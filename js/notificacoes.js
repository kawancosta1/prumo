/*
  Avisos do Prumo dentro do app:
  - Sons próprios, gerados na hora com WebAudio (sem arquivo de áudio), macios e curtos:
      "aviso"     dois toques de vidro subindo (chegou algo de um amigo)
      "lembrete"  três notas de marimba (hora da água, tarefa, prova)
      "conquista" brilho subindo (conquista ou dia perfeito)
      "feito"     um toque curtinho (envio deu certo)
  - Banner no topo, no estilo dos avisos do celular: desce com mola, some sozinho,
    arrasta para cima para fechar, toque abre o lugar certo.
  - Vibração curtinha no Android.
  Tudo pode ser desligado em Ajustes, Notificações (S.notif.som e S.notif.vibrar).
  Com o app fechado quem toca é o celular (notificações do sistema não aceitam som próprio na web).
*/
"use strict";

/* ===================== sons ===================== */
/** Saída comum dos avisos: um eco bem curto e abafado dá a sensação de "ar" em volta do toque. */
function saidaAviso(ctx, volume) {
  const entrada = ctx.createGain();
  entrada.gain.value = volume;
  const seco = ctx.createGain();
  seco.gain.value = 1;
  const eco = ctx.createDelay(0.5);
  eco.delayTime.value = 0.11;
  const volta = ctx.createGain();
  volta.gain.value = 0.28;
  const abafa = ctx.createBiquadFilter();
  abafa.type = "lowpass";
  abafa.frequency.value = 3800;
  const molhado = ctx.createGain();
  molhado.gain.value = 0.32;
  entrada.connect(seco).connect(ctx.destination);
  entrada.connect(eco);
  eco.connect(abafa).connect(volta).connect(eco); // repete e vai sumindo
  abafa.connect(molhado).connect(ctx.destination);
  return entrada;
}

/**
 * Um toque de sino de vidro: a nota com harmônicos suaves, ataque rápido e cauda longa.
 * parciais: [multiplicador da frequência, volume, quanto tempo dura em relação à nota]
 */
function toqueVidro(ctx, saida, t, freq, dur = 1.1, vol = 1) {
  const parciais = [
    [1, 1, 1],
    [2, 0.22, 0.55],
    [3.01, 0.08, 0.35],
    [4.2, 0.035, 0.22]
  ];
  for (const [m, v, d] of parciais) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq * m;
    const g = ctx.createGain();
    const fim = t + dur * d;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v * vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(v * vol * 0.35, t + 0.09);
    g.gain.exponentialRampToValueAtTime(0.0001, fim);
    o.connect(g).connect(saida);
    o.start(t);
    o.stop(fim + 0.05);
  }
}

/** Nota de marimba: madeira macia, some rápido. */
function toqueMarimba(ctx, saida, t, freq, vol = 1) {
  for (const [m, v, d] of [
    [1, 1, 0.55],
    [4, 0.12, 0.08],
    [10, 0.02, 0.03]
  ]) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq * m;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v * vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(saida);
    o.start(t);
    o.stop(t + d + 0.05);
  }
}

const NOTA = {
  G5: 783.99,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
  A6: 1760,
  B6: 1975.53,
  C7: 2093
};

const SONS_AVISO = {
  aviso(ctx, t) {
    const s = saidaAviso(ctx, 0.16);
    toqueVidro(ctx, s, t, NOTA.E6, 1.0, 0.9);
    toqueVidro(ctx, s, t + 0.11, NOTA.B6, 1.3, 1);
  },
  lembrete(ctx, t) {
    const s = saidaAviso(ctx, 0.3);
    toqueMarimba(ctx, s, t, NOTA.G5, 0.8);
    toqueMarimba(ctx, s, t + 0.13, NOTA.C6, 0.85);
    toqueMarimba(ctx, s, t + 0.26, NOTA.E6, 1);
  },
  conquista(ctx, t) {
    const s = saidaAviso(ctx, 0.12);
    [NOTA.C6, NOTA.E6, NOTA.G6, NOTA.C7].forEach((f, i) =>
      toqueVidro(ctx, s, t + i * 0.075, f, 0.9 + i * 0.25, 0.7 + i * 0.1)
    );
  },
  feito(ctx, t) {
    const s = saidaAviso(ctx, 0.12);
    toqueVidro(ctx, s, t, NOTA.A6, 0.7, 1);
  }
};

let ultimoSomAviso = 0;
/** Toca um som de aviso (só com o app na frente, sem repetir em menos de 0,4 s). */
function tocarSom(tipo = "aviso", forcar) {
  if (!forcar && (!S.notif.som || document.hidden)) return;
  const agora = Date.now();
  if (!forcar && agora - ultimoSomAviso < 400) return;
  ultimoSomAviso = agora;
  const ctx = typeof pegarAudio === "function" ? pegarAudio() : null;
  if (!ctx || !SONS_AVISO[tipo]) return;
  SONS_AVISO[tipo](ctx, ctx.currentTime + 0.02);
}

const VIBRACOES = {
  aviso: [12, 60, 18],
  lembrete: [20, 80, 20, 80, 20],
  conquista: [10, 40, 10, 40, 30],
  feito: [10]
};
function vibrar(tipo = "aviso") {
  if (!S.notif.vibrar || document.hidden || !navigator.vibrate) return;
  try {
    navigator.vibrate(VIBRACOES[tipo] || VIBRACOES.aviso);
  } catch (e) {}
}

/* ===================== banner ===================== */
const filaBanner = [];
let bannerAtual = null;

/**
 * Mostra um aviso no topo.
 * o = { titulo, texto, mood, tipo: "aviso"|"lembrete"|"conquista"|"feito", aba, som (padrão true) }
 * titulo e texto são texto puro (o banner escapa).
 */
function notificar(o) {
  filaBanner.push(o);
  if (!bannerAtual) proximoBanner();
}

function proximoBanner() {
  const o = filaBanner.shift();
  if (!o) return (bannerAtual = null);
  const tipo = o.tipo || "aviso";
  if (o.som !== false) {
    tocarSom(tipo);
    vibrar(tipo);
  }
  const el = document.createElement("div");
  el.className = "banner-aviso";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = `<span class="ba-icone">${prumi({ mood: o.mood || "happy", fill: Math.min(1, waterToday() / S.waterGoal), size: 30 })}</span><span class="ba-corpo"><span class="ba-topo"><b>PRUMO</b><span>agora</span></span>${o.titulo ? `<b class="ba-titulo">${esc(o.titulo)}</b>` : ""}<span class="ba-texto">${esc(o.texto || "")}</span></span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("on"));
  bannerAtual = el;

  let tempo = setTimeout(fechar, o.duracao || 5000);
  let fechado = false;
  function fechar() {
    if (fechado) return;
    fechado = true;
    clearTimeout(tempo);
    el.classList.remove("on");
    el.classList.add("sai");
    setTimeout(() => {
      el.remove();
      proximoBanner();
    }, 380);
  }

  // arrastar para cima fecha; toque abre a aba do aviso
  let y0 = null,
    dy = 0;
  el.addEventListener("pointerdown", e => {
    y0 = e.clientY;
    dy = 0;
    clearTimeout(tempo);
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    el.classList.add("arrastando");
  });
  el.addEventListener("pointermove", e => {
    if (y0 == null) return;
    dy = Math.min(12, e.clientY - y0); // para baixo quase não mexe
    el.style.transform = `translate(-50%, ${dy}px)`;
  });
  const soltar = () => {
    if (y0 == null) return;
    y0 = null;
    el.classList.remove("arrastando");
    el.style.transform = "";
    if (dy < -24) return fechar();
    if (Math.abs(dy) < 6) {
      fechar();
      if (o.aba && VIEWS[o.aba]) {
        tab = o.aba;
        fx.enter = true;
        render();
        window.scrollTo(0, 0);
      }
      return;
    }
    tempo = setTimeout(fechar, 2500);
  };
  el.addEventListener("pointerup", soltar);
  el.addEventListener("pointercancel", soltar);
}

/* ===================== Ajustes ===================== */
function notificacoesAjustesHTML() {
  return `<section class="block">
    <h2 class="h2">Notificações</h2>
    <div class="setbox">
      <div class="setrow"><div class="lbl"><b>Som dos avisos</b><span class="note">Um toque macio quando chega algo, na hora de um lembrete e nas conquistas.</span></div><div class="row" style="gap:6px"><button class="btn small ghost" data-act="ouvir-aviso" aria-label="Ouvir o som dos avisos">Ouvir</button><button class="btn small ${S.notif.som ? "" : "ghost"}" data-act="notif" data-s="som" aria-pressed="${S.notif.som}">${S.notif.som ? "Ligado" : "Desligado"}</button></div></div>
      ${typeof lembretesAjustesHTML === "function" ? lembretesAjustesHTML() : ""}
      <div class="setrow"><div class="lbl"><b>Vibrar</b><span class="note">Uma vibração curtinha junto com o aviso (Android).</span></div><button class="btn small ${S.notif.vibrar ? "" : "ghost"}" data-act="notif" data-s="vibrar" aria-pressed="${S.notif.vibrar}">${S.notif.vibrar ? "Ligado" : "Desligado"}</button></div>
    </div>
  </section>`;
}

let amostraSom = 0;
ACOES_EXTRAS["ouvir-aviso"] = () => {
  const tipos = ["aviso", "lembrete", "conquista"];
  const tipo = tipos[amostraSom++ % tipos.length];
  tocarSom(tipo, true);
  vibrar(tipo);
  toast(
    {
      aviso: "Esse toca quando chega algo.",
      lembrete: "Esse é o dos lembretes.",
      conquista: "E esse, nas conquistas."
    }[tipo]
  );
};
ACOES_EXTRAS.notif = b => {
  const qual = b.dataset.s;
  if (!(qual in S.notif)) return;
  S.notif[qual] = !S.notif[qual];
  commit();
  if (S.notif[qual]) qual === "som" ? tocarSom("feito", true) : vibrar("feito");
};
