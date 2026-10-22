/*
  Liga tudo: carrega os dados salvos, aplica o tema, desenha e conecta na conta.
*/
"use strict";

/* início */
try {
  const c = JSON.parse(lsGet(LS_KEY) || "null");
  if (c && c.state) {
    S = normalize(c.state);
    updatedAt = c.updatedAt || 0;
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
