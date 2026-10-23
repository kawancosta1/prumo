/*
  Base comum para os mundos ganharem o mesmo capricho do Emo e do Roqueiro.
  Cada mundo (js/mundos/<mundo>-extras.js) usa estas peças:
  - chuvaMundo(): enfeites que caem, sobem ou atravessam a tela na troca de aba (gancho trocaAba).
  - Formas de confete extras (folha, nota, coracao, diamante, pixel, flor, bandeira, moeda) ficam em js/efeitos.js.
  - Sons sintetizados (sem arquivo): cordas dedilhadas, sanfona, bateria, sinos, apito, 8 bits...
    SONS_MUNDO[mundo] = { concluir(ctx, saida, t), ambiente(ctx, saida) → { parar() } }
    js/sons.js usa isso para o som ao concluir tarefa e o som ambiente do foco.
  - dadosMundo(mundo): um cantinho em S.mundos para cada mundo guardar o que é dele.
  A decoração em CSS fica em estilos/mundos/extras.css.
*/
"use strict";

const SONS_MUNDO = {};

/** Cantinho de dados de cada mundo (S.mundos.sertanejo, S.mundos.gamer...). */
function dadosMundo(m) {
  if (!S.mundos || typeof S.mundos !== "object") S.mundos = {};
  if (!S.mundos[m] || typeof S.mundos[m] !== "object") S.mundos[m] = {};
  return S.mundos[m];
}

/* ===================== chuva de enfeites na troca de aba ===================== */
/**
 * o = { formas: [svg (viewBox 0 0 24 24)], cores: [...], n: 14, movimento: "cair"|"subir"|"atravessar"|"brilhar",
 *       tam: [16, 30], dur: [1.2, 2.2] }
 * Cada forma pode usar "currentColor" para pegar uma das cores.
 */
function chuvaMundo(o) {
  if (RM) return;
  const velho = document.getElementById("chuva-mundo");
  if (velho) velho.remove();
  const camada = document.createElement("div");
  camada.id = "chuva-mundo";
  camada.className = "mv-" + (o.movimento || "cair");
  camada.setAttribute("aria-hidden", "true");
  const n = o.n || 14,
    [t0, t1] = o.tam || [16, 30],
    [d0, d1] = o.dur || [1.2, 2.2];
  let html = "";
  let maior = 0;
  for (let i = 0; i < n; i++) {
    const forma = o.formas[i % o.formas.length];
    const cor = o.cores[Math.floor(Math.random() * o.cores.length)];
    const tam = t0 + Math.random() * (t1 - t0);
    const dur = d0 + Math.random() * (d1 - d0);
    const atraso = Math.random() * 0.5;
    maior = Math.max(maior, dur + atraso);
    html += `<span style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${tam}px;height:${tam}px;color:${cor};animation-duration:${dur.toFixed(2)}s;animation-delay:${atraso.toFixed(2)}s;--giro:${Math.round((Math.random() - 0.5) * 540)}deg;--deriva:${Math.round((Math.random() - 0.5) * 80)}px"><svg viewBox="0 0 24 24" width="100%" height="100%">${forma}</svg></span>`;
  }
  camada.innerHTML = html;
  document.body.appendChild(camada);
  setTimeout(() => camada.remove(), (maior + 0.3) * 1000);
}

/* ===================== sons: peças para montar ===================== */
/** Envelope de volume: sobe rápido e cai até sumir. */
function envelope(ctx, t, ataque, dur, vol) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  return g;
}

/** Nota simples de um oscilador. */
function tocarTom(ctx, saida, t, freq, dur, tipo = "sine", vol = 0.2, ataque = 0.01) {
  const o = ctx.createOscillator();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, t);
  const g = envelope(ctx, t, ataque, dur, vol);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + dur + 0.05);
  return o;
}

const bufferCorda = new Map();
/** Corda dedilhada (algoritmo Karplus-Strong): viola, cavaquinho, violão. brilho de 0 a 1. */
function dedilhar(ctx, saida, t, freq, dur = 1.4, vol = 0.3, brilho = 0.5) {
  const chave = `${Math.round(freq)}|${dur}|${brilho}`;
  let buf = bufferCorda.get(chave);
  if (!buf) {
    const sr = ctx.sampleRate,
      n = Math.floor(sr * dur),
      p = Math.max(2, Math.round(sr / freq));
    buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    const linha = new Float32Array(p);
    for (let i = 0; i < p; i++) linha[i] = Math.random() * 2 - 1;
    const perda = 0.494 + brilho * 0.0055; // mais brilho = some mais devagar
    for (let i = 0; i < n; i++) {
      const k = i % p;
      const prox = linha[(k + 1) % p];
      d[i] = linha[k];
      linha[k] = (linha[k] + prox) * perda;
    }
    if (bufferCorda.size > 80) bufferCorda.clear();
    bufferCorda.set(chave, buf);
  }
  const f = ctx.createBufferSource();
  f.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = vol;
  f.connect(g).connect(saida);
  f.start(t);
}

/** Acorde dedilhado (as cordas uma depois da outra). */
function arpejo(ctx, saida, t, freqs, passo = 0.035, dur = 1.6, vol = 0.22, brilho = 0.5) {
  freqs.forEach((f, i) => dedilhar(ctx, saida, t + i * passo, f, dur, vol, brilho));
}

/** Sanfona: fole com duas vozes e tremolo. */
function sanfona(ctx, saida, t, freqs, dur = 0.5, vol = 0.12) {
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 2200;
  const trem = ctx.createGain();
  trem.gain.value = 0.85;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 6.5;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.15;
  lfo.connect(lfoG).connect(trem.gain);
  const g = envelope(ctx, t, 0.04, dur, vol);
  filtro.connect(trem).connect(g).connect(saida);
  for (const f of freqs)
    for (const [tipo, det] of [
      ["sawtooth", -6],
      ["square", 7]
    ]) {
      const o = ctx.createOscillator();
      o.type = tipo;
      o.frequency.value = f;
      o.detune.value = det;
      const v = ctx.createGain();
      v.gain.value = tipo === "square" ? 0.4 : 0.6;
      o.connect(v).connect(filtro);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  lfo.start(t);
  lfo.stop(t + dur + 0.05);
}

let bufferRuido = null;
function ruidoBranco(ctx) {
  if (!bufferRuido || bufferRuido.sampleRate !== ctx.sampleRate) {
    bufferRuido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = bufferRuido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return bufferRuido;
}
/** Rajada de ruído filtrado (chimbal, caixa, palma, clique de teclado, chocalho). */
function rajada(ctx, saida, t, dur, freq, tipoFiltro = "highpass", vol = 0.2, q = 1) {
  const f = ctx.createBufferSource();
  f.buffer = ruidoBranco(ctx);
  const fl = ctx.createBiquadFilter();
  fl.type = tipoFiltro;
  fl.frequency.value = freq;
  fl.Q.value = q;
  const g = envelope(ctx, t, 0.002, dur, vol);
  f.connect(fl).connect(g).connect(saida);
  f.start(t, Math.random() * 0.5);
  f.stop(t + dur + 0.02);
}
/** Bumbo: tom que despenca. grave = 808 longo. */
function bumbo(ctx, saida, t, vol = 0.5, grave = false) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(grave ? 110 : 150, t);
  o.frequency.exponentialRampToValueAtTime(grave ? 42 : 48, t + (grave ? 0.25 : 0.12));
  const g = envelope(ctx, t, 0.003, grave ? 0.9 : 0.35, vol);
  o.connect(g).connect(saida);
  o.start(t);
  o.stop(t + 1);
}
const caixa = (ctx, saida, t, vol = 0.25) => {
  rajada(ctx, saida, t, 0.16, 1800, "bandpass", vol, 0.7);
  tocarTom(ctx, saida, t, 190, 0.08, "triangle", vol * 0.6, 0.002);
};
const chimbal = (ctx, saida, t, vol = 0.08, aberto = false) =>
  rajada(ctx, saida, t, aberto ? 0.25 : 0.05, 7000, "highpass", vol);
const palma = (ctx, saida, t, vol = 0.2) => {
  for (let i = 0; i < 3; i++) rajada(ctx, saida, t + i * 0.012, 0.09, 1400, "bandpass", vol, 1.2);
};

/** Sino ou tigela: parciais que somem devagar, com um leve batimento. */
function sino(ctx, saida, t, freq, dur = 3, vol = 0.15, parciais = [1, 2.76, 5.4]) {
  parciais.forEach((m, i) => {
    for (const det of [0, 1.8])
      tocarTom(
        ctx,
        saida,
        t,
        freq * m + det,
        dur / (1 + i * 0.8),
        "sine",
        (vol / (1 + i * 1.6)) * 0.6,
        0.004
      );
  });
}

/** Saída padrão dos sons de mundo: volume e um eco curto. */
function saidaMundo(ctx, vol = 1) {
  const g = ctx.createGain();
  g.gain.value = vol;
  const eco = ctx.createDelay(0.4);
  eco.delayTime.value = 0.09;
  const volta = ctx.createGain();
  volta.gain.value = 0.18;
  g.connect(ctx.destination);
  g.connect(eco);
  eco.connect(volta).connect(eco);
  volta.connect(ctx.destination);
  return g;
}

/* ---------- sons ambiente reaproveitáveis (foco) ---------- */
/** Ruído contínuo filtrado que entra e sai devagar. Devolve { saida, parar }. */
function ambienteRuido(ctx, { freq = 800, tipo = "lowpass", vol = 0.08, onda = 0, q = 0.7 } = {}) {
  const f = ctx.createBufferSource();
  f.buffer = typeof ruido === "function" ? ruido(ctx, 4) : ruidoBranco(ctx);
  f.loop = true;
  const fl = ctx.createBiquadFilter();
  fl.type = tipo;
  fl.frequency.value = freq;
  fl.Q.value = q;
  const mod = ctx.createGain();
  mod.gain.value = 1;
  let lfo = null;
  if (onda) {
    lfo = ctx.createOscillator();
    lfo.frequency.value = onda; // ondas do mar, vento
    const lg = ctx.createGain();
    lg.gain.value = 0.6;
    lfo.connect(lg).connect(mod.gain);
    lfo.start();
  }
  const vg = ctx.createGain();
  vg.gain.setValueAtTime(0, ctx.currentTime);
  vg.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2);
  f.connect(fl).connect(mod).connect(vg).connect(ctx.destination);
  f.start();
  return {
    saida: vg,
    parar(timers = []) {
      timers.forEach(clearTimeout);
      const t = ctx.currentTime;
      vg.gain.cancelScheduledValues(t);
      vg.gain.setValueAtTime(vg.gain.value, t);
      vg.gain.linearRampToValueAtTime(0, t + 1);
      f.stop(t + 1.1);
      if (lfo) lfo.stop(t + 1.1);
    }
  };
}

/** Repete um som de tempos em tempos (grilos, estalos da fogueira, tic-tac). Devolve o parar. */
function repetirSom(fn, minMs, maxMs) {
  let timer = null,
    vivo = true;
  const passo = () => {
    if (!vivo) return;
    fn();
    timer = setTimeout(passo, minMs + Math.random() * (maxMs - minMs));
  };
  timer = setTimeout(passo, 300);
  return () => {
    vivo = false;
    clearTimeout(timer);
  };
}

/** Ambiente pronto: um fundo de ruído + sons soltos por cima. */
function ambienteComposto(ctx, fundo, soltos = []) {
  const base = ambienteRuido(ctx, fundo);
  const paradas = soltos.map(([fn, min, max]) =>
    repetirSom(() => fn(ctx, base.saida, ctx.currentTime + 0.02), min, max)
  );
  return {
    parar() {
      paradas.forEach(p => p());
      base.parar();
    }
  };
}

/* ---------- sons soltos comuns ---------- */
const grilo = (ctx, saida, t) => {
  for (let i = 0; i < 3; i++)
    tocarTom(ctx, saida, t + i * 0.05, 4200 + Math.random() * 300, 0.03, "sine", 0.05, 0.004);
};
const estalo = (ctx, saida, t) =>
  rajada(
    ctx,
    saida,
    t,
    0.03 + Math.random() * 0.04,
    2500 + Math.random() * 3000,
    "bandpass",
    0.25 + Math.random() * 0.3,
    2
  );
const ticTac = (() => {
  let lado = 0;
  return (ctx, saida, t) => rajada(ctx, saida, t, 0.02, (lado ^= 1) ? 3200 : 2600, "bandpass", 0.35, 8);
})();

/* ===================== recurso exclusivo: utilidades de tela ===================== */
/** Cartão padrão do recurso de um mundo no Hoje. */
const cartaoMundo = (classe, titulo, sub, corpo) =>
  `<section class="block cartao-mundo ${classe}"><div class="cm-topo"><h2 class="h2">${titulo}</h2>${sub ? `<span class="note">${sub}</span>` : ""}</div>${corpo}</section>`;

/** Ganhar gotas com o multiplicador do mundo (o mesmo das tarefas). */
function premioMundo(n, msg, mood = "party") {
  earn(n);
  react(mood, msg, 4200);
  if (typeof tocarSom === "function") tocarSom("conquista");
}

/** Quantas tarefas foram concluídas hoje. */
const feitasHoje = () => S.tasks.filter(t => t.done && (t.feitaEm || t.date) === today()).length;
