/*
  Base das personalidades: como pegar a atual, as falas (say) e trocar de personalidade.
*/
"use strict";

/* ---------- personalidades ---------- */
const PERSONAS = {}; // cada arquivo em mundos/ preenche a sua parte

const P = () => PERSONAS[S.persona] || PERSONAS.zen;

const say = (k, v = {}) => {
  let s = P()[k];
  if (Array.isArray(s))
    s =
      k === "cheers" || k === "drink"
        ? pick(s)
        : s[(new Date().getDate() + new Date().getHours() + k.length) % s.length];
  return s
    .replace("{nome}", nome())
    .replace("{n}", v.n ?? "")
    .replace("{ml}", v.ml ?? "")
    .replace(/\{o\/a\}/g, flex("o", "a", "e"))
    .replace(/\{ele\/ela\}/g, flex("ele", "ela", "elu"))
    .replace(/\{amigo\/amiga\}/g, flex("amigo", "amiga", "amigue"))
    .replace(/\{parceiro\/parceira\}/g, flex("parceiro", "parceira", "parceire"));
};

function setPersona(id) {
  const p = PERSONAS[id];
  if (!p) return;
  if (S.persona && S.persona !== id) S.equipBy[S.persona] = { ...S.equip };
  const fresh = !S.equipBy[id];
  S.persona = id;
  p.starter.forEach(iid => {
    if (!S.owned.includes(iid)) S.owned.push(iid);
  });
  if (fresh) {
    S.equip = {};
    p.starter.forEach(iid => {
      S.equip[ITEM[iid].slot] = iid;
    });
  } else S.equip = { ...S.equipBy[id] };
}
