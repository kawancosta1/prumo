/*
  Perfil do Prumi no estilo MySpace/Orkut: foto de perfil, subnick, humor, música tocando,
  sobre mim, Top 8 amigos e recados da parceria.
  MSN, depoimentos, comunidades, contador, fundos e Fotolog ficam em js/internet2000.js.
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

  const st = STATUS_MSN[statusMsn()];
  return `<div class="perfil-ms" data-layout="${esc(S.perfil.layout || "classico")}">
    <div class="ms-topo">
      <div class="ms-foto">${prumi({ mood: h.nivel.rosto === "cry" ? "sad" : "happy", fill: Math.min(1, waterToday() / S.waterGoal), size: 104, eq: S.equip })}</div>
      <div class="ms-info">
        <span class="ms-nome glitter">${esc(S.name || "Prumi")}</span>
        ${S.perfil.subnick ? `<span class="subnick letreiro"><span>${esc(S.perfil.subnick)}</span></span>` : ""}
        <span><i class="msn-bola" style="--c:${st.cor}"></i> ${statusMsn() === "offline" ? "Offline" : st.nome}</span>
        <span><b>Humor:</b> ${esc(h.nivel.nome)}</span>
        <span><b>Ouvindo agora:</b> ♪ ${esc(S.perfil.ouvindo || musica)}</span>
        <span><b>Personalidade:</b> ${esc(P().name)} · <b>Nível</b> ${L.lvl}</span>
      </div>
    </div>

    <div class="ms-visitas">Você é o visitante nº ${contadorHTML(S.perfil.visitas || 0)}</div>

    ${msnBlocoHTML()}

    <div class="ms-bloco">
      <span class="ms-titulo">Sobre mim</span>
      <textarea id="perfil-sobre" data-change="perfil-sobre" maxlength="400" placeholder="Escreva sobre você, suas bandas, o que te define...">${esc(S.perfil.sobre)}</textarea>
    </div>

    ${comunidadesBlocoHTML()}

    <div class="ms-bloco">
      <span class="ms-titulo">Fotolog</span>
      ${fotologHTML()}
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

    ${depoimentosBlocoHTML()}

    ${layoutBlocoHTML()}
  </div>`;
}
