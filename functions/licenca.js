/*
  licenca.js - regras puras do pagamento do Prumo PRO (sem rede, sem Firebase).
  Fica separado do index.js para ser testado com node puro (testes/pagamentos.js).
*/
"use strict";
const crypto = require("crypto");

const DIA = 24 * 60 * 60 * 1000;

// Os preços valem aqui no servidor: o app só diz qual plano quer, nunca o valor.
const PLANOS = {
  mensal: { nome: "Prumo PRO Mensal", valor: 19.9, dias: 30 },
  anual: { nome: "Prumo PRO Anual", valor: 149.0, dias: 365 },
  vitalicio: { nome: "Prumo PRO Vitalício Founder", valor: 297.0, dias: null },
  dupla: { nome: "Prumo PRO Dupla", valor: 29.9, dias: 30 }
};

function planoValido(p) {
  return typeof p === "string" && Object.prototype.hasOwnProperty.call(PLANOS, p);
}

/** external_reference = "uid|plano". O uid do Firebase tem até 128 letras/números. */
function montarReferencia(uid, plano) {
  return `${uid}|${plano}`;
}

function lerReferencia(ref) {
  const m = /^([A-Za-z0-9_-]{6,128})\|([a-z]{3,12})$/.exec(String(ref || ""));
  if (!m || !planoValido(m[2])) return null;
  return { uid: m[1], plano: m[2] };
}

/** Soma o período comprado ao que a pessoa ainda tem (renovar antes de vencer não perde dias). */
function calcularLicenca(atual, plano, agora) {
  const p = PLANOS[plano];
  if (!p) return null;
  const antes = atual && typeof atual === "object" ? atual : {};
  if (p.dias === null || antes.vitalicio === true) {
    return { ativo: true, plano: p.dias === null ? plano : "vitalicio", vitalicio: true, expiraEm: null };
  }
  const base = typeof antes.expiraEm === "number" && antes.expiraEm > agora ? antes.expiraEm : agora;
  return { ativo: true, plano, vitalicio: false, expiraEm: base + p.dias * DIA };
}

/** Confere o pagamento devolvido pela API do Mercado Pago contra o que o servidor esperava. */
function conferirPagamento(pg) {
  if (!pg || typeof pg !== "object") return { ok: false, motivo: "sem pagamento" };
  const ref = lerReferencia(pg.external_reference);
  if (!ref) return { ok: false, motivo: "referencia invalida" };
  if (pg.payment_method_id !== "pix") return { ok: false, motivo: "nao e pix" };
  if (pg.currency_id && pg.currency_id !== "BRL") return { ok: false, motivo: "moeda" };
  const esperado = PLANOS[ref.plano].valor;
  if (Math.abs(Number(pg.transaction_amount) - esperado) > 0.001) return { ok: false, motivo: "valor" };
  return { ok: true, ...ref, status: String(pg.status || "") };
}

/** Assinatura do webhook do Mercado Pago: x-signature = "ts=...,v1=<hmac sha256>". */
function assinaturaWebhookValida(segredo, xSignature, xRequestId, dataId) {
  if (!segredo || !xSignature || !dataId) return false;
  let ts = "";
  let v1 = "";
  String(xSignature)
    .split(",")
    .forEach(parte => {
      const [k, v] = parte.split("=").map(s => (s || "").trim());
      if (k === "ts") ts = v;
      if (k === "v1") v1 = v;
    });
  if (!ts || !/^[0-9a-f]{64}$/i.test(v1)) return false;
  const id = /^[a-z0-9]+$/i.test(String(dataId)) ? String(dataId).toLowerCase() : String(dataId);
  const manifesto = `id:${id};request-id:${xRequestId || ""};ts:${ts};`;
  const esperado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");
  const a = Buffer.from(esperado, "hex");
  const b = Buffer.from(v1.toLowerCase(), "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = {
  PLANOS,
  planoValido,
  montarReferencia,
  lerReferencia,
  calcularLicenca,
  conferirPagamento,
  assinaturaWebhookValida
};
