/*
  Perfil do Prumi no estilo MySpace/Orkut: foto de perfil, subnick, humor, música tocando,
  sobre mim, Top 8 amigos e recados da parceria.
  Aparece na aba Prumi → Perfil. As músicas e frases podem ser trocadas por cada mundo
  (ex.: js/mundos/emo-efeitos.js define musicas e subnicks próprios).
*/
"use strict";

// Músicas inventadas (nada de música de verdade), uma por humor
const MUSICAS_PADRAO = {
  party: "Dia perfeito (versão estendida)",
  happy: "Tudo dando certo",
  idle: "Trilha sonora de terça-feira",
  upset: "Hoje não, amanhã talvez",
  sad: "Chuva no fone",
  cry: "Precisando de um abraço"
};
const SUBNICKS_PADRAO = [
  "~ focado(a) hoje ~",
  "bebendo água e vencendo a vida",
  "um dia de cada vez",
  "*-* produtividade on",
  "volto já, fui organizar a vida"
];

const musicasDoMundo = () => (MUNDO_FX[S.persona] && MUNDO_FX[S.persona].musicas) || MUSICAS_PADRAO;
const subnicksDoMundo = () => (MUNDO_FX[S.persona] && MUNDO_FX[S.persona].subnicks) || SUBNICKS_PADRAO;

function perfilHTML() {
  const h = calcularHumor();
  const L = levelOf(S.xp);
  const musica = musicasDoMundo()[h.nivel.rosto] || MUSICAS_PADRAO.idle;
  const amigo = parceriaAtiva() ? parceiroDados : null;
  const recados = recadosRecebidos();
  // Top 8: o parceiro ocupa o primeiro lugar; o resto fica esperando novos amigos
  const top8 = Array.from({ length: 8 }, (_, i) => {
    if (i === 0 && amigo) {
      return `<div class="top8-item">${prumi({ mood: "happy", size: 52, eq: amigo.equip || {}, p: amigo.persona })}<span>${esc(nomeParceiro())}</span></div>`;
    }
    return `<div class="top8-item vazio"><span class="top8-mais">+</span><span>${i === 0 ? "Seu par" : "Em breve"}</span></div>`;
  }).join("");

  return `<div class="perfil-ms">
    <div class="ms-topo">
      <div class="ms-foto">${prumi({ mood: h.nivel.rosto === "cry" ? "sad" : "happy", fill: Math.min(1, waterToday() / S.waterGoal), size: 104, eq: S.equip })}</div>
      <div class="ms-info">
        <span class="ms-nome glitter">${esc(S.name || "Prumi")}</span>
        ${S.perfil.subnick ? `<span class="subnick">${esc(S.perfil.subnick)}</span>` : ""}
        <span><b>Humor:</b> ${esc(h.nivel.nome)}</span>
        <span><b>Ouvindo agora:</b> ♪ ${esc(musica)}</span>
        <span><b>Personalidade:</b> ${esc(P().name)} · <b>Nível</b> ${L.lvl}</span>
      </div>
    </div>

    <div class="ms-bloco">
      <span class="ms-titulo">Subnick</span>
      <div class="row">
        <input id="perfil-subnick" type="text" data-change="perfil-subnick" maxlength="60" value="${esc(S.perfil.subnick)}" placeholder="Sua frase do dia" autocomplete="off" style="flex:1">
        <button class="btn small" data-act="sortear-subnick">Sortear frase</button>
      </div>
      <span class="note">Aparece para o seu par, igual o subnick do MSN.</span>
    </div>

    <div class="ms-bloco">
      <span class="ms-titulo">Sobre mim</span>
      <textarea id="perfil-sobre" data-change="perfil-sobre" maxlength="400" placeholder="Escreva sobre você, suas bandas, o que te define...">${esc(S.perfil.sobre)}</textarea>
    </div>

    <div class="ms-bloco">
      <span class="ms-titulo">Top 8</span>
      <div class="top8">${top8}</div>
    </div>

    <div class="ms-bloco">
      <span class="ms-titulo">Recados</span>
      ${
        amigo
          ? `<form class="row" data-form="recado"><input id="recado-txt" type="text" maxlength="240" placeholder="Deixe um recado para ${esc(nomeParceiro())}" style="flex:1" autocomplete="off" required><button class="btn small primary" type="submit">Enviar</button></form>
        ${recados.length ? `<ul class="recados">${recados.map(r => `<li><b>${esc(nomeParceiro())}</b> <span class="note">${fmtShort(ymd(new Date(r.em)))}</span><p>${esc(r.texto)}</p></li>`).join("")}</ul>` : `<span class="note">Nenhum recado ainda.</span>`}`
          : `<span class="note">Conecte uma parceria (aba Hábitos e social) para trocar recados.</span>`
      }
    </div>
  </div>`;
}
