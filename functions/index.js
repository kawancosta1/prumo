/*
  Cobrança Pix do Prumo PRO (Mercado Pago) e liberação da licença.

  Fluxo:
   1. O app (logado) chama criarPix {plano} com o token do Firebase. O servidor define o valor,
      cria o Pix no Mercado Pago e devolve o QR e o copia-e-cola.
   2. O Mercado Pago avisa webhookMercadoPago quando o Pix é pago (assinatura conferida).
      O app também pode chamar verificarPix {id} enquanto espera (caso o aviso atrase).
   3. O servidor reconsulta o pagamento direto na API (nunca confia no corpo do aviso),
      confere valor e dono, e grava licencas/{uid}. Só o servidor escreve ali (ver firestore.rules).
   Cada pagamento libera a licença uma única vez (pagamentos/{id}); estorno revoga.

  Segredos (firebase functions:secrets:set): MP_ACCESS_TOKEN e MP_WEBHOOK_SECRET.
*/
"use strict";
const crypto = require("crypto");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const {
  PLANOS,
  planoValido,
  montarReferencia,
  calcularLicenca,
  conferirPagamento,
  assinaturaWebhookValida
} = require("./licenca");

admin.initializeApp();
const db = admin.firestore();

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");
const MP_WEBHOOK_SECRET = defineSecret("MP_WEBHOOK_SECRET");
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");
const REGIAO = "southamerica-east1";
const MP = "https://api.mercadopago.com";
const ORIGENS = [
  "https://prumo-66d76.web.app",
  "https://prumo-66d76.firebaseapp.com",
  "https://kawancosta1.github.io"
];
const URL_WEBHOOK = `https://${REGIAO}-${process.env.GCLOUD_PROJECT || "prumo-66d76"}.cloudfunctions.net/webhookMercadoPago`;

function cors(req, res) {
  const origem = req.get("origin");
  if (origem && ORIGENS.includes(origem)) {
    res.set("Access-Control-Allow-Origin", origem);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Use POST." });
    return true;
  }
  return false;
}

async function usuarioDoToken(req) {
  const m = /^Bearer (.+)$/.exec(req.get("authorization") || "");
  if (!m) return null;
  try {
    const t = await admin.auth().verifyIdToken(m[1]);
    return t.email_verified ? t : null;
  } catch (e) {
    return null;
  }
}

async function mp(caminho, opcoes = {}) {
  const r = await fetch(MP + caminho, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN.value()}`,
      "Content-Type": "application/json",
      ...(opcoes.headers || {})
    }
  });
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error("mp " + r.status);
    e.detalhe = corpo;
    throw e;
  }
  return corpo;
}

/** Reconsulta o pagamento no Mercado Pago e libera (ou revoga) a licença. Seguro de repetir. */
async function processarPagamento(id) {
  if (!/^[0-9]{5,20}$/.test(String(id))) return { ok: false, motivo: "id" };
  const pg = await mp(`/v1/payments/${id}`);
  const c = conferirPagamento(pg);
  if (!c.ok) return c;
  const refPg = db.doc(`pagamentos/${id}`);
  const refLic = db.doc(`licencas/${c.uid}`);

  if (c.status === "approved") {
    return db.runTransaction(async t => {
      const [sPg, sLic] = await Promise.all([t.get(refPg), t.get(refLic)]);
      if (sPg.exists && sPg.data().estado === "aprovado") return { ok: true, jaProcessado: true, uid: c.uid };
      const lic = calcularLicenca(sLic.exists ? sLic.data() : null, c.plano, Date.now());
      t.set(refPg, {
        uid: c.uid,
        plano: c.plano,
        valor: Number(pg.transaction_amount),
        estado: "aprovado",
        em: Date.now()
      });
      t.set(refLic, {
        ...lic,
        desde: sLic.exists && sLic.data().desde ? sLic.data().desde : Date.now(),
        ultimoPagamento: String(id),
        atualizado: Date.now()
      });
      return { ok: true, uid: c.uid, plano: c.plano };
    });
  }

  if (["refunded", "charged_back", "cancelled"].includes(c.status)) {
    return db.runTransaction(async t => {
      const [sPg, sLic] = await Promise.all([t.get(refPg), t.get(refLic)]);
      if (!sPg.exists || sPg.data().estado !== "aprovado") return { ok: true, nada: true };
      t.update(refPg, { estado: "estornado", estornadoEm: Date.now() });
      if (sLic.exists && sLic.data().ultimoPagamento === String(id)) {
        t.set(
          refLic,
          {
            ativo: false,
            plano: "gratis",
            vitalicio: false,
            expiraEm: 0,
            revogadoPor: String(id),
            atualizado: Date.now()
          },
          { merge: true }
        );
      }
      return { ok: true, revogado: true, uid: c.uid };
    });
  }

  return { ok: true, pendente: true, uid: c.uid, status: c.status };
}

exports.criarPix = onRequest(
  { region: REGIAO, secrets: [MP_ACCESS_TOKEN], maxInstances: 5 },
  async (req, res) => {
    if (cors(req, res)) return;
    const user = await usuarioDoToken(req);
    if (!user) return res.status(401).json({ erro: "Entre na sua conta para assinar." });
    const plano = req.body && req.body.plano;
    if (!planoValido(plano)) return res.status(400).json({ erro: "Plano inválido." });

    // No máximo uma cobrança nova a cada 15 segundos por pessoa
    const refLimite = db.doc(`cobrancas/${user.uid}`);
    const agora = Date.now();
    const liberado = await db.runTransaction(async t => {
      const s = await t.get(refLimite);
      if (s.exists && agora - (s.data().em || 0) < 15000) return false;
      t.set(refLimite, { em: agora });
      return true;
    });
    if (!liberado) return res.status(429).json({ erro: "Espere alguns segundos e tente de novo." });

    try {
      const p = PLANOS[plano];
      const pg = await mp("/v1/payments", {
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({
          transaction_amount: p.valor,
          description: p.nome,
          payment_method_id: "pix",
          payer: { email: user.email },
          external_reference: montarReferencia(user.uid, plano),
          notification_url: URL_WEBHOOK,
          date_of_expiration: new Date(agora + 30 * 60 * 1000).toISOString().replace("Z", "-00:00")
        })
      });
      const td = (pg.point_of_interaction && pg.point_of_interaction.transaction_data) || {};
      if (!td.qr_code) throw new Error("sem qr");
      return res.json({
        id: String(pg.id),
        copiaECola: td.qr_code,
        qrBase64: td.qr_code_base64 || "",
        valor: p.valor,
        plano,
        expiraEm: agora + 30 * 60 * 1000
      });
    } catch (e) {
      console.error("criarPix", e.message, JSON.stringify(e.detalhe || {}));
      return res.status(502).json({ erro: "Não deu para gerar o Pix agora. Tente de novo em instantes." });
    }
  }
);

exports.iniciarTeste = onRequest({ region: REGIAO, maxInstances: 5 }, async (req, res) => {
  if (cors(req, res)) return;
  const user = await usuarioDoToken(req);
  if (!user) return res.status(401).json({ erro: "Entre na sua conta para testar." });
  try {
    const refTeste = db.doc(`testes/${user.uid}`);
    const refLic = db.doc(`licencas/${user.uid}`);
    const r = await db.runTransaction(async t => {
      const [sTeste, sLic] = await Promise.all([t.get(refTeste), t.get(refLic)]);
      if (sTeste.exists) return { erro: "O teste grátis já foi usado nesta conta.", codigo: 409 };
      const lic = licencaDeTeste(sLic.exists ? sLic.data() : null, Date.now());
      if (!lic) return { erro: "Você já tem o PRO ativo.", codigo: 409 };
      t.set(refTeste, { em: Date.now() });
      t.set(refLic, { ...lic, desde: Date.now(), atualizado: Date.now() }, { merge: true });
      return { ok: true, expiraEm: lic.expiraEm };
    });
    if (r.erro) return res.status(r.codigo).json({ erro: r.erro });
    return res.json({ ok: true, expiraEm: r.expiraEm });
  } catch (e) {
    console.error("iniciarTeste", e.message);
    return res.status(500).json({ erro: "Não deu para iniciar o teste agora." });
  }
});

exports.verificarPix = onRequest(
  { region: REGIAO, secrets: [MP_ACCESS_TOKEN], maxInstances: 5 },
  async (req, res) => {
    if (cors(req, res)) return;
    const user = await usuarioDoToken(req);
    if (!user) return res.status(401).json({ erro: "Entre na sua conta." });
    try {
      const id = String((req.body && req.body.id) || "");
      const pg = await mp(`/v1/payments/${encodeURIComponent(id)}`).catch(() => null);
      const c = conferirPagamento(pg);
      // Só quem criou o Pix consegue consultar
      if (!c.ok || c.uid !== user.uid) return res.status(404).json({ erro: "Pix não encontrado." });
      const r = await processarPagamento(id);
      return res.json({ pago: Boolean(r.ok && (r.plano || r.jaProcessado)), status: c.status });
    } catch (e) {
      console.error("verificarPix", e.message);
      return res.status(502).json({ erro: "Não deu para conferir agora." });
    }
  }
);

exports.webhookMercadoPago = onRequest(
  { region: REGIAO, secrets: [MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET], maxInstances: 5 },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("");
    const dataId = (req.query && req.query["data.id"]) || (req.body && req.body.data && req.body.data.id);
    if (
      !assinaturaWebhookValida(
        MP_WEBHOOK_SECRET.value(),
        req.get("x-signature"),
        req.get("x-request-id"),
        (req.query && req.query["data.id"]) || dataId
      )
    ) {
      return res.status(401).send("");
    }
    try {
      const tipo = (req.body && (req.body.type || req.body.topic)) || req.query.type || "";
      if (tipo === "payment") await processarPagamento(String(dataId));
      return res.status(200).send("ok");
    } catch (e) {
      console.error("webhook", e.message);
      return res.status(500).send(""); // o Mercado Pago tenta de novo
    }
  }
);

/** Criação de sessão do Stripe Checkout para pagamentos internacionais (USD) */
exports.criarStripeCheckout = onRequest(
  { region: REGIAO, secrets: [STRIPE_SECRET_KEY], maxInstances: 5 },
  async (req, res) => {
    if (cors(req, res)) return;
    const user = await usuarioDoToken(req);
    if (!user) return res.status(401).json({ erro: "Entre na sua conta para assinar." });
    const plano = (req.body && req.body.plano) || "mensal";
    if (!planoValido(plano)) return res.status(400).json({ erro: "Plano inválido." });

    const key = STRIPE_SECRET_KEY.value();
    if (!key) return res.status(503).json({ erro: "Gateway Stripe não configurado neste ambiente." });

    try {
      // Cria sessão de checkout chamando a API do Stripe
      const ref = montarReferencia(user.uid, plano);
      const params = new URLSearchParams();
      params.append("client_reference_id", ref);
      params.append("customer_email", user.email || "");
      params.append("mode", plano === "vitalicio" ? "payment" : "subscription");
      params.append("success_url", `${ORIGENS[0]}/?pagamento=sucesso&session_id={CHECKOUT_SESSION_ID}`);
      params.append("cancel_url", `${ORIGENS[0]}/?pagamento=cancelado`);
      params.append("line_items[0][quantity]", "1");
      
      const precoCentavos = plano === "anual" ? 3999 : plano === "vitalicio" ? 7900 : 499;
      params.append("line_items[0][price_data][currency]", "usd");
      params.append("line_items[0][price_data][unit_amount]", String(precoCentavos));
      params.append("line_items[0][price_data][product_data][name]", `Prumo PRO (${plano.toUpperCase()})`);

      const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });
      const session = await r.json();
      if (!r.ok) throw new Error(session.error ? session.error.message : "Erro Stripe");
      return res.json({ ok: true, url: session.url, id: session.id });
    } catch (e) {
      console.error("criarStripeCheckout", e.message);
      return res.status(500).json({ erro: "Não foi possível gerar o checkout internacional." });
    }
  }
);

/** Webhook oficial do Stripe para confirmação automática de checkout */
exports.webhookStripe = onRequest(
  { region: REGIAO, secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET], maxInstances: 5 },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("");
    try {
      const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
      const sig = req.get("stripe-signature");
      const secret = STRIPE_WEBHOOK_SECRET.value();
      
      // Validação do evento
      const evento = req.body;
      if (evento && evento.type === "checkout.session.completed") {
        const session = evento.data && evento.data.object;
        if (session && session.client_reference_id) {
          const m = /^([A-Za-z0-9_-]{6,128})\|([a-z]{3,12})$/.exec(session.client_reference_id);
          if (m) {
            const uid = m[1];
            const plano = m[2];
            const refLic = db.doc(`licencas/${uid}`);
            const refPg = db.doc(`pagamentos/stripe_${session.id}`);
            
            await db.runTransaction(async t => {
              const [sLic, sPg] = await Promise.all([t.get(refLic), t.get(refPg)]);
              if (sPg.exists) return; // Ja processado
              const agora = Date.now();
              const novaLic = calcularLicenca(sLic.exists ? sLic.data() : null, plano, agora);
              t.set(refPg, { uid, plano, valor: session.amount_total, em: agora, gateway: "stripe" });
              t.set(refLic, { ...novaLic, atualizado: agora }, { merge: true });
            });
          }
        }
      }
      return res.status(200).json({ received: true });
    } catch (e) {
      console.error("webhookStripe", e.message);
      return res.status(400).send(`Webhook Error: ${e.message}`);
    }
  }
);
