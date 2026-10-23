/*
  Mudança de endereço: o Prumo saiu do GitHub Pages e foi para o Firebase Hosting.
  Os dados de quem usa sem conta ficam presos ao endereço antigo (o localStorage é por site).
  - No endereço antigo: se o novo já estiver no ar (mudanca.json responde), aparece uma faixa
    "O Prumo mudou de endereço" com um botão que leva os dados junto, compactados no # do link.
    O # nunca vai para servidor nenhum.
  - No endereço novo: se o link chegou com #mudanca=... e este aparelho ainda não tem dados aqui,
    os dados entram. Se já tiver, nada é trocado (ninguém consegue apagar seus dados com um link).
*/
"use strict";

const ENDERECO_ANTIGO = /(^|\.)github\.io$/;
const MUDANCA_MAX = 1800000; // tamanho máximo do link (letras)

const b64url = bytes => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const deB64url = t => {
  const s = atob(t.replace(/-/g, "+").replace(/_/g, "/"));
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
  return b;
};
const transformar = async (bytes, stream) =>
  new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

/** Dados do aparelho em texto curto para o link. "z" = compactado, "p" = puro. */
async function pacoteMudanca() {
  const bruto = new TextEncoder().encode(lsGet(LS_KEY) || "");
  if (typeof CompressionStream === "function")
    return "z" + b64url(await transformar(bruto, new CompressionStream("gzip")));
  return "p" + b64url(bruto);
}
async function abrirPacote(t) {
  const bytes = deB64url(t.slice(1));
  const puro = t[0] === "z" ? await transformar(bytes, new DecompressionStream("gzip")) : bytes;
  return JSON.parse(new TextDecoder().decode(puro));
}

/* ---------- endereço antigo: faixa de aviso ---------- */
async function avisarMudanca() {
  let novo;
  try {
    const r = await fetch("https://prumo-66d76.web.app/mudanca.json", { cache: "no-store" });
    const j = await r.json();
    if (!j || !j.ativo || !/^https:\/\/[a-z0-9.-]+\/$/.test(j.endereco)) return;
    novo = j.endereco;
  } catch (e) {
    return; // o endereço novo ainda não está no ar
  }
  const faixa = document.createElement("div");
  faixa.className = "mudanca";
  faixa.setAttribute("role", "status");
  faixa.innerHTML = `<span><b>O Prumo mudou de endereço.</b> Seus dados vão junto.</span><button class="btn small primary" type="button">Ir para o novo Prumo</button>`;
  faixa.querySelector("button").addEventListener("click", async () => {
    let destino = novo;
    if (lsGet(LS_KEY)) {
      try {
        const p = await pacoteMudanca();
        if (p.length <= MUDANCA_MAX) destino = novo + "#mudanca=" + p;
        else {
          toast("Seus dados são grandes demais para o link. Baixe o backup em Ajustes e restaure lá.");
          return;
        }
      } catch (e) {}
    }
    location.href = destino;
  });
  document.body.appendChild(faixa);
}

/* ---------- endereço novo: recebe os dados ---------- */
async function receberMudanca() {
  const m = /^#mudanca=([zp][A-Za-z0-9_-]+)$/.exec(location.hash);
  if (!m) return;
  history.replaceState(null, "", location.pathname);
  if (lsGet(LS_KEY)) {
    toast("Este aparelho já tem dados do Prumo aqui. Nada foi trocado.");
    return;
  }
  try {
    const c = await abrirPacote(m[1]);
    if (!c || !c.state || typeof c.state !== "object") throw 0;
    S = normalize(c.state);
    commit();
    toast("Mudança feita! Seus dados chegaram.");
  } catch (e) {
    toast(
      "Não consegui trazer os dados pelo link. Baixe o backup no endereço antigo e restaure aqui em Ajustes."
    );
  }
}

if (ENDERECO_ANTIGO.test(location.hostname)) avisarMudanca();
else receberMudanca();
