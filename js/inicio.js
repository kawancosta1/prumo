/*
  Liga tudo: carrega os dados salvos, aplica o tema, desenha e conecta na conta.
*/
"use strict";

/* fontes dos mundos: baixam como "print" (não travam a tela) e valem para tudo quando chegam */
{
  const f = document.getElementById("fontes-mundos");
  if (f) {
    if (f.sheet) f.media = "all";
    else f.addEventListener("load", () => (f.media = "all"));
  }
}

/* início */
try {
  const c = JSON.parse(lsGet(LS_KEY) || "null");
  if (c && c.state) {
    S = normalize(c.state);
    updatedAt = c.updatedAt || 0;
    sujo = c.sujo === true || (c.sujo === undefined && (!base || base.updatedAt !== updatedAt)); // mudanças ainda não mandadas
  }
} catch (e) {}

const h = (location.hash || "").slice(1);

if (VIEWS[h]) tab = h;

applyTheme();

fx.enter = true;

fx.entrada = pick(["pulo", "giro", "espiada", "aceno"]);

render();

setSync("");

connect();

setTimeout(markReady, 3000);
