/*
  Leitura no dia a dia:
  - Sessão de leitura: cronômetro só da leitura, com Prumi lendo junto, sons ambiente e "parei na página..." no fim.
    Os minutos ficam em S.leitura.minutos (por dia) e as páginas entram como sempre (irParaPagina em js/leitura.js).
  - Meta do dia: X páginas OU Y minutos (leitura + estudo). Bater a meta dá gotas uma vez por dia.
  - Sequência: dias seguidos lendo ou estudando. Escudos (comprados com gotas) salvam um dia sem atividade.
  - Previsão de término de cada livro, pelo seu ritmo das últimas 2 semanas.
  O cartão da meta aparece no cartão do Prumi, na aba Hoje (js/mascote/falas.js chama metaDiaHTML()).
*/
"use strict";

const ESCUDO_PRECO = 60; // gotas
const ESCUDOS_MAX = 3;
const META_GOTAS = 10;

/* ===================== dados ===================== */
function leituraDia() {
  const L = S.leitura;
  if (!L.minutos || typeof L.minutos !== "object") L.minutos = {};
  if (!L.meta || typeof L.meta !== "object") L.meta = { paginas: 10, minutos: 25 };
  if (!Array.isArray(L.diasEscudo)) L.diasEscudo = [];
  L.escudos = Math.max(0, Math.min(ESCUDOS_MAX, +L.escudos || 0));
  return L;
}
const minutosLeitura = (d = today()) => leituraDia().minutos[d] || 0;
const minutosEstudo = (d = today()) => S.sessions.filter(s => s.date === d).reduce((a, b) => a + b.min, 0);
const paginasDoDia = (d = today()) => S.leitura.log[d] || 0;
/** Dia com leitura ou estudo. */
const diaAtivo = d => paginasDoDia(d) > 0 || minutosLeitura(d) > 0 || minutosEstudo(d) > 0;

/* ===================== meta do dia ===================== */
function progressoMeta(d = today()) {
  const m = leituraDia().meta;
  const p = m.paginas ? paginasDoDia(d) / m.paginas : 0;
  const t = m.minutos ? (minutosLeitura(d) + minutosEstudo(d)) / m.minutos : 0;
  return Math.min(1, Math.max(p, t));
}

/** Entrega as gotas da meta uma vez por dia. */
function conferirMeta() {
  const L = leituraDia();
  if (L.metaFeita === today() || progressoMeta() < 1) return false;
  L.metaFeita = today();
  earn(META_GOTAS);
  setTimeout(() => {
    toast(`Meta do dia batida! +${META_GOTAS} gotas`, false, "party");
    fx.big = true;
  }, 500);
  persist();
  return true;
}

/* ===================== sequência e escudos ===================== */
/** Usa escudos nos dias sem atividade desde a última conferência (só se a sequência estava viva). */
function conferirEscudos() {
  const L = leituraDia();
  const ontem = addDays(today(), -1);
  let d = L.escudoChecado ? addDays(L.escudoChecado, 1) : ontem;
  if (d < addDays(today(), -10)) d = addDays(today(), -10);
  let usados = 0;
  for (; d <= ontem; d = addDays(d, 1)) {
    if (diaAtivo(d) || L.diasEscudo.includes(d)) continue;
    if (L.escudos > 0 && sequenciaAte(addDays(d, -1)) > 0) {
      L.escudos--;
      L.diasEscudo.push(d);
      usados++;
    } else break;
  }
  L.escudoChecado = ontem;
  L.diasEscudo = L.diasEscudo.filter(x => x >= addDays(today(), -60));
  if (usados) {
    setTimeout(
      () =>
        toast(
          usados === 1
            ? "Um escudo salvou sua sequência ontem!"
            : `${usados} escudos salvaram sua sequência!`,
          false,
          "happy"
        ),
      700
    );
    persist();
  }
}
/** Dias seguidos com atividade (ou escudo) terminando em d. */
function sequenciaAte(d) {
  const L = leituraDia();
  let n = 0;
  while ((diaAtivo(d) || L.diasEscudo.includes(d)) && n < 1000) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
/** Sequência atual: conta hoje se já teve atividade; senão, até ontem. */
const sequenciaAtual = () => (diaAtivo(today()) ? sequenciaAte(today()) : sequenciaAte(addDays(today(), -1)));

ACOES_EXTRAS["escudo-comprar"] = () => {
  const L = leituraDia();
  if (L.escudos >= ESCUDOS_MAX) return toast(`Máximo de ${ESCUDOS_MAX} escudos guardados`, false, "worried");
  if (S.coins < ESCUDO_PRECO)
    return toast(`Faltam ${ESCUDO_PRECO - S.coins} gotas para um escudo`, false, "worried");
  S.coins -= ESCUDO_PRECO;
  L.escudos++;
  react("happy", "Escudo guardado! Se um dia não der pra ler nem estudar, ele salva sua sequência.", 3400);
  commit();
};

const ICONE_CHAMA = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-9z" fill="#F07A1A"/><path d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1 1-2 1-3 1 1 2 0 2-2z" fill="#FFD27A"/></svg>`;
const ICONE_ESCUDO = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#4FA3FF" stroke="#1F3A7A" stroke-width="1.4"/></svg>`;

/** Anel de progresso (SVG). */
function anelMeta(p) {
  const r = 15,
    c = 2 * Math.PI * r;
  return `<svg class="anel-meta" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="${r}" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="20" cy="20" r="${r}" fill="none" stroke="${p >= 1 ? "var(--ok, #2FB344)" : "var(--accent)"}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 20 20)"/>${p >= 1 ? `<path d="M13 20.5l4.5 4.5L27 15.5" fill="none" stroke="var(--ok, #2FB344)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg>`;
}

/** Faixa da meta do dia, sequência e sessão em andamento (dentro do cartão do Prumi na aba Hoje). */
function metaDiaHTML() {
  conferirEscudos();
  conferirMeta();
  const L = leituraDia();
  const p = progressoMeta();
  const seq = sequenciaAtual();
  const pags = paginasDoDia(),
    mins = minutosLeitura() + minutosEstudo();
  const sessao = sessaoAtual();
  const livroS = sessao && livro(sessao.livroId);
  return `<div class="meta-dia">
    <button class="meta-anel" data-tab="estante" aria-label="Meta do dia: ${Math.round(p * 100)}%">${anelMeta(p)}</button>
    <div class="meta-txt"><b>${p >= 1 ? "Meta do dia batida!" : "Meta do dia"}</b><small>${pags}/${L.meta.paginas} páginas ou ${mins}/${L.meta.minutos} min</small></div>
    <div class="meta-seq" title="Dias seguidos lendo ou estudando">${ICONE_CHAMA}<b>${seq}</b><small>${seq === 1 ? "dia" : "dias"}</small>${L.escudos ? `<span class="escudos" aria-label="${L.escudos} escudos">${ICONE_ESCUDO.repeat(L.escudos)}</span>` : ""}</div>
  </div>
  ${livroS ? `<button class="sessao-faixa" data-tab="estante"><span class="sessao-ponto"></span>Lendo <b>${esc(livroS.titulo)}</b> · <span class="faixa-tempo mono">${fmtRelogio(tempoSessao())}</span></button>` : ""}`;
}

/** Bloco de meta e escudos na aba Estante (para ajustar a meta e comprar escudos). */
function metaAjustesHTML() {
  const L = leituraDia();
  const seq = sequenciaAtual();
  return `<div class="card meta-card">
    <div class="row" style="justify-content:space-between;align-items:center">${anelMeta(progressoMeta())}<div class="meta-txt" style="flex:1"><b>Meta do dia</b><small>${paginasDoDia()}/${L.meta.paginas} páginas ou ${minutosLeitura() + minutosEstudo()}/${L.meta.minutos} min de leitura e estudo. Vale <b>+${META_GOTAS} gotas</b>.</small></div></div>
    <div class="row meta-ajuste"><label>Páginas <input type="number" min="1" max="500" value="${L.meta.paginas}" data-change="meta-paginas" aria-label="Meta de páginas por dia"></label><label>Minutos <input type="number" min="5" max="600" step="5" value="${L.meta.minutos}" data-change="meta-minutos" aria-label="Meta de minutos por dia"></label></div>
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><span class="meta-seq">${ICONE_CHAMA}<b>${seq}</b><small>${seq === 1 ? "dia seguido" : "dias seguidos"}</small> ${ICONE_ESCUDO}<small>${L.escudos}/${ESCUDOS_MAX} escudos</small></span><button class="btn small" data-act="escudo-comprar" ${L.escudos >= ESCUDOS_MAX ? "disabled" : ""}>Escudo · ${ESCUDO_PRECO} gotas</button></div>
    <span class="note">Escudo salva a sequência num dia sem leitura nem estudo. É usado sozinho.</span>
  </div>`;
}
MUDANCAS_EXTRAS["meta-paginas"] = el => {
  leituraDia().meta.paginas = Math.max(1, Math.min(500, Math.round(+el.value || 10)));
  commit();
};
MUDANCAS_EXTRAS["meta-minutos"] = el => {
  leituraDia().meta.minutos = Math.max(5, Math.min(600, Math.round(+el.value || 25)));
  commit();
};

/* ===================== sessão de leitura ===================== */
const LS_SESSAO = "prumo-sessao-leitura"; // fica no aparelho: { livroId, inicio, acumulado, pausada, paginaInicial, som }
let encerrando = false;
const sessaoAtual = () => {
  try {
    const s = JSON.parse(lsGet(LS_SESSAO) || "null");
    return s && livro(s.livroId) ? s : null;
  } catch (e) {
    return null;
  }
};
const salvarSessao = s => (s ? lsSet(LS_SESSAO, JSON.stringify(s)) : lsSet(LS_SESSAO, ""));
const tempoSessao = (s = sessaoAtual()) => (s ? s.acumulado + (s.pausada ? 0 : Date.now() - s.inicio) : 0);
const fmtRelogio = ms => {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${pad(t % 60)}`;
};

function iniciarSessao(id) {
  const l = livro(id);
  if (!l) return;
  const antiga = sessaoAtual();
  if (antiga && antiga.livroId !== id)
    return toast("Termine a sessão aberta antes de começar outra", false, "worried");
  if (!antiga)
    salvarSessao({
      livroId: id,
      inicio: Date.now(),
      acumulado: 0,
      pausada: false,
      paginaInicial: l.pagina,
      som: ""
    });
  encerrando = false;
  estanteTab = "estante";
  tab = "estante";
  react("focus", `Bora ler <b>${esc(l.titulo)}</b>. Eu leio junto!`, 3000);
  render();
}
ACOES_EXTRAS["livro-timer"] = (b, id) => iniciarSessao(id);
ACOES_EXTRAS["sessao-pausar"] = () => {
  const s = sessaoAtual();
  if (!s) return;
  if (s.pausada) {
    s.pausada = false;
    s.inicio = Date.now();
  } else {
    s.acumulado += Date.now() - s.inicio;
    s.pausada = true;
    pararAmbiente();
  }
  salvarSessao(s);
  if (!s.pausada && s.som) tocarAmbiente(s.som);
  render();
};
ACOES_EXTRAS["sessao-terminar"] = () => {
  encerrando = true;
  render();
  const campo = document.getElementById("sessao-pagina");
  if (campo) campo.focus();
};
ACOES_EXTRAS["sessao-cancelar"] = () => {
  pararAmbiente();
  salvarSessao(null);
  encerrando = false;
  toast("Sessão descartada", false, "idle");
  render();
};
ACOES_EXTRAS["sessao-som"] = b => {
  const s = sessaoAtual();
  if (!s) return;
  s.som = s.som === b.dataset.som ? "" : b.dataset.som;
  salvarSessao(s);
  if (s.som && !s.pausada) tocarAmbiente(s.som);
  else pararAmbiente();
  render();
};
FORMS_EXTRAS["sessao-fim"] = () => {
  const s = sessaoAtual();
  if (!s) return;
  const l = livro(s.livroId);
  const min = Math.round(tempoSessao(s) / 6e4);
  const nova = Math.round(+getV("sessao-pagina"));
  pararAmbiente();
  salvarSessao(null);
  encerrando = false;
  const L = leituraDia();
  if (min >= 1) L.minutos[today()] = (L.minutos[today()] || 0) + min;
  const ganho = l && nova >= 0 ? irParaPagina(l, nova) : 0;
  const gotas = min >= 5 ? earn(Math.min(30, Math.floor(min / 5) * 2)) : 0;
  L.sessoes = (L.sessoes || 0) + 1;
  const partes = [];
  if (min >= 1) partes.push(`<b>${min} min</b> de leitura`);
  if (ganho) partes.push(`<b>${ganho} páginas</b>`);
  if (gotas) partes.push(`<b>+${gotas} gotas</b>`);
  if (partes.length) {
    if (min >= 20 || ganho >= 20) fx.big = true;
    react("party", `Sessão encerrada: ${partes.join(", ")}. Que leitor!`, 4200);
  } else react("idle", "Sessão curtinha, nada registrado. Na próxima vai!", 2600);
};

/** Prumi de óculos com um livro aberto nas mãos (desenhados dentro dele, para balançar junto). */
function prumiLendo(mood, tam) {
  const extra =
    `<g class="oculos-leitura"><circle cx="47" cy="64" r="9" fill="rgba(255,255,255,.18)" stroke="#141416" stroke-width="2.6"/><circle cx="73" cy="64" r="9" fill="rgba(255,255,255,.18)" stroke="#141416" stroke-width="2.6"/><path d="M56 63H64" stroke="#141416" stroke-width="2.4"/></g>` +
    `<g class="livro-aberto"><path d="M34 94L60 89L86 94V114L60 109L34 114Z" fill="#FBF7EC" stroke="#141416" stroke-width="1.8" stroke-linejoin="round"/><path d="M60 89V109" stroke="#141416" stroke-width="1.4"/><path d="M40 98L54 95.5M40 103L54 100.5M66 95.5L80 98M66 100.5L80 103" stroke="#B5AE9E" stroke-width="1.2"/></g>`;
  // os quatro </g> finais fecham hop, gira, swing e entra: o extra entra dentro do hop
  return prumi({ mood, size: tam }).replace(/(<\/g>\s*<\/g>\s*<\/g>\s*<\/g>\s*<\/svg>)\s*$/, extra + "$1");
}

/** Cartão da sessão em andamento (topo da aba Estante). */
function sessaoHTML() {
  const s = sessaoAtual();
  if (!s) return "";
  const l = livro(s.livroId);
  const sons = [
    ["", "Silêncio"],
    ["biblioteca", "Biblioteca"],
    ["cafe", "Café"],
    ["chuva", "Chuva"],
    ["lareira", "Lareira"]
  ];
  return `<div class="card sessao ${s.pausada ? "pausada" : ""}">
    <div class="sessao-topo"><span class="sessao-prumi">${prumiLendo(s.pausada ? "idle" : "focus", 70)}</span>
      <div class="sessao-info"><small>${s.pausada ? "Sessão pausada" : "Lendo agora"}</small><b>${esc(l.titulo)}</b><span class="sessao-tempo mono" id="sessao-relogio">${fmtRelogio(tempoSessao(s))}</span><small>Começou na página ${s.paginaInicial}</small></div></div>
    ${
      encerrando
        ? `<form class="row" data-form="sessao-fim"><label class="col" style="flex:1"><span class="label">Parei na página</span><input id="sessao-pagina" type="number" min="0" ${l.paginas ? `max="${l.paginas}"` : ""} value="${l.pagina}" inputmode="numeric" required></label><button class="btn primary" type="submit">Salvar</button></form>
          <button class="olink" data-act="sessao-cancelar">Descartar a sessão</button>`
        : `<div class="seg sessao-sons" role="group" aria-label="Som ambiente">${sons.map(([k, n]) => `<button data-act="sessao-som" data-som="${k}" aria-pressed="${(s.som || "") === k}">${n}</button>`).join("")}</div>
          <div class="row"><button class="btn" data-act="sessao-pausar">${s.pausada ? "Continuar" : "Pausar"}</button><button class="btn primary" data-act="sessao-terminar">Terminar sessão</button></div>`
    }
  </div>`;
}

// relógio da sessão e da faixa na Hoje, a cada segundo
setInterval(() => {
  const s = sessaoAtual();
  if (!s) return;
  const t = fmtRelogio(tempoSessao(s));
  document
    .querySelectorAll("#sessao-relogio, .sessao-faixa .faixa-tempo")
    .forEach(el => (el.textContent = t));
}, 1000);

/* ===================== sons ambiente (WebAudio, sem arquivos) ===================== */
let ambienteNos = null;
function pararAmbiente() {
  if (!ambienteNos) return;
  const { saida, timers, fontes } = ambienteNos;
  ambienteNos = null;
  timers.forEach(clearInterval);
  try {
    const ctx = saida.context;
    saida.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => fontes.forEach(f => f.stop && f.stop()), 1200);
  } catch (e) {}
}
function tocarAmbiente(tipo) {
  pararAmbiente();
  const ctx = typeof pegarAudio === "function" ? pegarAudio() : null;
  if (!ctx || !tipo) return;
  const saida = ctx.createGain();
  saida.gain.value = 0;
  saida.connect(ctx.destination);
  saida.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
  const fontes = [],
    timers = [];
  const chiado = (freq, tipoFiltro, vol, q = 0.7) => {
    const src = ctx.createBufferSource();
    src.buffer = ruido(ctx, 4);
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = tipoFiltro;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(saida);
    src.start();
    fontes.push(src);
    return g;
  };
  const estalo = (freq, dur, vol) => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = ruido(ctx, dur);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(saida);
    src.start(t);
  };
  const tim = (freq, vol) => {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g).connect(saida);
    o.start(t);
    o.stop(t + 0.55);
  };
  if (tipo === "biblioteca") {
    chiado(400, "lowpass", 0.05);
    timers.push(
      setInterval(() => Math.random() < 0.3 && typeof somPagina === "function" && somPagina(), 9000)
    );
  } else if (tipo === "cafe") {
    chiado(700, "bandpass", 0.16, 0.5);
    chiado(250, "lowpass", 0.08);
    timers.push(setInterval(() => Math.random() < 0.5 && tim(2400 + Math.random() * 1600, 0.025), 2600));
  } else if (tipo === "chuva") {
    chiado(5000, "lowpass", 0.18);
    chiado(900, "highpass", 0.06);
    timers.push(
      setInterval(() => Math.random() < 0.6 && estalo(3000 + Math.random() * 3000, 0.04, 0.05), 300)
    );
  } else if (tipo === "lareira") {
    chiado(300, "lowpass", 0.14);
    timers.push(
      setInterval(
        () => Math.random() < 0.55 && estalo(1500 + Math.random() * 2500, 0.03 + Math.random() * 0.05, 0.18),
        220
      )
    );
  }
  ambienteNos = { saida, timers, fontes };
}

/* ===================== previsão de término ===================== */
/** Páginas por dia nas últimas 2 semanas. */
const ritmoLeitura = () => {
  let soma = 0;
  for (let i = 0; i < 14; i++) soma += paginasDoDia(addDays(today(), -i));
  return soma / 14;
};
function previsaoHTML(l) {
  if (!l.paginas || l.pagina >= l.paginas) return "";
  const ritmo = ritmoLeitura();
  if (ritmo < 1)
    return `<span class="meta previsao">Leia um pouco por dia e eu calculo quando você termina.</span>`;
  const dias = Math.max(1, Math.ceil((l.paginas - l.pagina) / ritmo));
  return `<span class="meta previsao">No seu ritmo (${Math.round(ritmo)} pág./dia), termina em <b>${dias} ${dias === 1 ? "dia" : "dias"}</b>, lá por ${fmtShort(addDays(today(), dias))}.</span>`;
}
