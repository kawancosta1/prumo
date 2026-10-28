// Pagamento do Prumo PRO: regras puras do servidor (functions/licenca.js), sem rede nem Firebase
const assert = require("assert");
const crypto = require("crypto");
const L = require("../functions/licenca");

module.exports = () => {
  const erros = [];
  const teste = (nome, fn) => {
    try {
      fn();
      console.log("  ok  " + nome);
    } catch (e) {
      erros.push("FALHOU: " + nome + " (" + e.message + ")");
    }
  };
  const DIA = 864e5;
  const agora = 1_800_000_000_000;

  teste("preços são definidos no servidor", () => {
    assert.strictEqual(L.PLANOS.anual.valor, 149);
    assert.strictEqual(L.PLANOS.mensal.valor, 19.9);
    assert.strictEqual(L.PLANOS.vitalicio.valor, 297);
    assert.strictEqual(L.planoValido("anual"), true);
    assert.strictEqual(L.planoValido("__proto__"), false);
    assert.strictEqual(L.planoValido("toString"), false);
    assert.strictEqual(L.planoValido(undefined), false);
  });

  teste("referência liga o pagamento à conta e ao plano", () => {
    const ref = L.montarReferencia("abcDEF123456", "anual");
    assert.deepStrictEqual(L.lerReferencia(ref), { uid: "abcDEF123456", plano: "anual" });
    assert.strictEqual(L.lerReferencia("abcDEF123456|ouro"), null);
    assert.strictEqual(L.lerReferencia("../x|anual"), null);
    assert.strictEqual(L.lerReferencia(""), null);
  });

  teste("primeira compra soma o período a partir de agora", () => {
    const l = L.calcularLicenca(null, "anual", agora);
    assert.strictEqual(l.ativo, true);
    assert.strictEqual(l.expiraEm, agora + 365 * DIA);
    assert.strictEqual(L.calcularLicenca(null, "mensal", agora).expiraEm, agora + 30 * DIA);
  });

  teste("renovar antes de vencer não perde dias", () => {
    const atual = { ativo: true, plano: "mensal", expiraEm: agora + 10 * DIA };
    assert.strictEqual(L.calcularLicenca(atual, "mensal", agora).expiraEm, agora + 40 * DIA);
  });

  teste("licença vencida recomeça de agora", () => {
    const atual = { ativo: false, plano: "mensal", expiraEm: agora - 5 * DIA };
    assert.strictEqual(L.calcularLicenca(atual, "mensal", agora).expiraEm, agora + 30 * DIA);
  });

  teste("vitalício não vence e não é rebaixado", () => {
    const v = L.calcularLicenca({ ativo: true, expiraEm: agora + DIA }, "vitalicio", agora);
    assert.strictEqual(v.vitalicio, true);
    assert.strictEqual(v.expiraEm, null);
    const depois = L.calcularLicenca(v, "mensal", agora);
    assert.strictEqual(depois.vitalicio, true);
    assert.strictEqual(depois.expiraEm, null);
  });

  teste("pagamento só vale se for Pix, em reais, do valor certo e com referência válida", () => {
    const bom = {
      external_reference: "abcDEF123456|anual",
      payment_method_id: "pix",
      transaction_amount: 149,
      currency_id: "BRL",
      status: "approved"
    };
    const r = L.conferirPagamento(bom);
    assert.strictEqual(r.ok, true);
    assert.strictEqual(r.uid, "abcDEF123456");
    assert.strictEqual(r.plano, "anual");
    assert.strictEqual(L.conferirPagamento({ ...bom, transaction_amount: 1 }).ok, false);
    assert.strictEqual(L.conferirPagamento({ ...bom, payment_method_id: "visa" }).ok, false);
    assert.strictEqual(L.conferirPagamento({ ...bom, currency_id: "USD" }).ok, false);
    assert.strictEqual(L.conferirPagamento({ ...bom, external_reference: "x" }).ok, false);
    assert.strictEqual(L.conferirPagamento(null).ok, false);
    // valor do plano barato não libera o plano caro
    assert.strictEqual(
      L.conferirPagamento({ ...bom, external_reference: "abcDEF123456|vitalicio", transaction_amount: 19.9 })
        .ok,
      false
    );
  });

  teste("assinatura do webhook: só a assinada com o segredo passa", () => {
    const segredo = "segredo-de-teste";
    const ts = "1800000000";
    const manifesto = `id:12345678;request-id:req-1;ts:${ts};`;
    const v1 = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");
    const head = `ts=${ts},v1=${v1}`;
    assert.strictEqual(L.assinaturaWebhookValida(segredo, head, "req-1", "12345678"), true);
    assert.strictEqual(L.assinaturaWebhookValida("outro", head, "req-1", "12345678"), false);
    assert.strictEqual(L.assinaturaWebhookValida(segredo, head, "req-2", "12345678"), false);
    assert.strictEqual(L.assinaturaWebhookValida(segredo, head, "req-1", "99999999"), false);
    assert.strictEqual(L.assinaturaWebhookValida(segredo, "ts=1,v1=zzzz", "req-1", "12345678"), false);
    assert.strictEqual(L.assinaturaWebhookValida(segredo, "", "req-1", "12345678"), false);
    assert.strictEqual(L.assinaturaWebhookValida("", head, "req-1", "12345678"), false);
  });

  return Promise.resolve(erros);
};
