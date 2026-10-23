/*
  Sons dos mundos. Tudo é gerado na hora com WebAudio, sem arquivos de áudio:
  - Emo: chuva ambiente enquanto o cronômetro de foco roda e som de virar página ao concluir uma tarefa.
  - Roqueiro: plateia ao longe no foco, palhetada (acorde de guitarra) ao concluir uma tarefa,
    o acorde do Star Power e o riff secreto.
  Os dois sons de cada mundo podem ser desligados (S.sons.chuva e S.sons.pagina), no Foco ou em Ajustes.
*/
"use strict";

let audio = null; // AudioContext, criado só quando precisa
let chuva = null; // { parar() } quando está chovendo
let pingoTimer = null;

// mundos com sons próprios: emo e rock aqui; os outros em SONS_MUNDO (js/mundos/base-extras.js e <mundo>-extras.js)
const somProprio = () => (typeof SONS_MUNDO !== "undefined" && SONS_MUNDO[S.persona]) || null;
const somDoMundo = () => S.persona === "emo" || S.persona === "rock" || !!somProprio();

function pegarAudio() {
  if (!audio) {
    const A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    audio = new A();
  }
  if (audio.state === "suspended") audio.resume().catch(() => {});
  return audio;
}

/** Um buffer de ruído (chiado) de alguns segundos, usado na chuva e na página. */
function ruido(ctx, segundos) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * segundos), ctx.sampleRate);
  const d = buf.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < d.length; i++) {
    // ruído "rosado" simples: mistura o valor anterior com um aleatório, fica mais grave e macio
    ultimo = 0.97 * ultimo + 0.03 * (Math.random() * 2 - 1);
    d[i] = ultimo * 6 + (Math.random() * 2 - 1) * 0.25;
  }
  return buf;
}

/* ---------- chuva ---------- */
function comecarChuva() {
  if (chuva) return;
  if (S.persona === "rock") return comecarPlateia();
  const ctx = pegarAudio();
  if (!ctx) return;
  const proprio = somProprio();
  if (proprio) {
    if (proprio.ambiente) chuva = proprio.ambiente(ctx);
    return;
  }
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido(ctx, 4);
  fonte.loop = true;
  const grave = ctx.createBiquadFilter();
  grave.type = "lowpass";
  grave.frequency.value = 1600;
  const agudo = ctx.createBiquadFilter();
  agudo.type = "highpass";
  agudo.frequency.value = 280;
  const volume = ctx.createGain();
  volume.gain.setValueAtTime(0, ctx.currentTime);
  volume.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2); // entra devagar
  fonte.connect(grave).connect(agudo).connect(volume).connect(ctx.destination);
  fonte.start();
  // pingos soltos batendo na janela
  const pingar = () => {
    const t = ctx.currentTime;
    const p = ctx.createBufferSource();
    p.buffer = ruido(ctx, 0.05);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2500 + Math.random() * 3000;
    f.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05 + Math.random() * 0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    p.connect(f).connect(g).connect(volume);
    p.start(t);
    pingoTimer = setTimeout(pingar, 70 + Math.random() * 260);
  };
  pingar();
  chuva = {
    parar() {
      clearTimeout(pingoTimer);
      const t = ctx.currentTime;
      volume.gain.cancelScheduledValues(t);
      volume.gain.setValueAtTime(volume.gain.value, t);
      volume.gain.linearRampToValueAtTime(0, t + 1); // sai devagar
      setTimeout(() => fonte.stop(), 1100);
    }
  };
}

function pararChuva() {
  if (!chuva) return;
  chuva.parar();
  chuva = null;
}

/** Liga ou desliga a chuva conforme o foco. Roda a cada segundo e logo depois de cada clique. */
function atualizarChuva() {
  const deveChover = timer.running && somDoMundo() && S.sons.chuva && !document.hidden;
  if (deveChover) comecarChuva();
  else pararChuva();
}
setInterval(atualizarChuva, 1000);
document.addEventListener("click", () => setTimeout(atualizarChuva, 0));
document.addEventListener("visibilitychange", atualizarChuva);

/* ---------- virar página ---------- */
function somPagina() {
  if (!somDoMundo() || !S.sons.pagina) return;
  if (S.persona === "rock") return somPalhetada();
  const ctx = pegarAudio();
  if (!ctx) return;
  const proprio = somProprio();
  if (proprio) {
    if (proprio.concluir) proprio.concluir(ctx, saidaMundo(ctx, 0.9), ctx.currentTime + 0.02);
    return;
  }
  const t = ctx.currentTime;
  const p = ctx.createBufferSource();
  p.buffer = ruido(ctx, 0.35);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  // o "fsss" do papel: a frequência sobe e desce rápido
  f.frequency.setValueAtTime(900, t);
  f.frequency.linearRampToValueAtTime(3200, t + 0.12);
  f.frequency.linearRampToValueAtTime(1400, t + 0.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
  p.connect(f).connect(g).connect(ctx.destination);
  p.start(t);
}

/* ---------- guitarra (mundo Roqueiro) ---------- */
let curvaDistorcao = null;
/** Curva de distorção: achata o som como um pedal de overdrive. */
function distorcao(ctx) {
  const ws = ctx.createWaveShaper();
  if (!curvaDistorcao) {
    const n = 1024;
    curvaDistorcao = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curvaDistorcao[i] = ((Math.PI + 30) * x) / (Math.PI + 30 * Math.abs(x));
    }
  }
  ws.curve = curvaDistorcao;
  ws.oversample = "2x";
  return ws;
}

/** Um power chord (tônica, quinta e oitava) com distorção, tocado em t segundos. */
function powerChord(ctx, t, tonica, dur = 0.9, vol = 0.22) {
  const saida = ctx.createGain();
  saida.gain.setValueAtTime(0.0001, t);
  saida.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  saida.gain.exponentialRampToValueAtTime(vol * 0.45, t + 0.18);
  saida.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const tom = ctx.createBiquadFilter();
  tom.type = "lowpass";
  tom.frequency.value = 2600;
  const pre = ctx.createGain();
  pre.gain.value = 3;
  const ws = distorcao(ctx);
  pre.connect(ws).connect(tom).connect(saida).connect(ctx.destination);
  [1, 1.5, 2].forEach((m, i) => {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = tonica * m;
    o.detune.value = (i - 1) * 6;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    o.connect(g).connect(pre);
    o.start(t + i * 0.012); // a palheta passa pelas cordas uma depois da outra
    o.stop(t + dur + 0.05);
  });
}

/** Palhetada ao concluir uma tarefa: um acorde curto. */
function somPalhetada() {
  const ctx = pegarAudio();
  if (!ctx) return;
  powerChord(ctx, ctx.currentTime, pick([82.41, 98, 110, 123.47]), 0.7, 0.16);
}

/** Star Power: acorde subindo com um chiado elétrico. */
function somStarPower() {
  if (!S.sons.pagina) return;
  const ctx = pegarAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const p = ctx.createBufferSource();
  p.buffer = ruido(ctx, 0.6);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 3;
  f.frequency.setValueAtTime(600, t);
  f.frequency.exponentialRampToValueAtTime(6000, t + 0.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.2, t + 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  p.connect(f).connect(g).connect(ctx.destination);
  p.start(t);
  powerChord(ctx, t + 0.45, 110, 1.6, 0.2);
  powerChord(ctx, t + 0.45, 164.81, 1.6, 0.12);
}

/** Riff secreto: uma sequência inventada de acordes. */
function somRiff() {
  const ctx = pegarAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notas = [
    [82.41, 0, 0.22],
    [82.41, 0.24, 0.22],
    [110, 0.48, 0.3],
    [98, 0.84, 0.22],
    [82.41, 1.08, 0.22],
    [123.47, 1.32, 0.9]
  ];
  for (const [f, quando, dur] of notas) powerChord(ctx, t + quando, f, dur, 0.18);
}

/* ---------- plateia ao longe (foco no mundo Roqueiro) ---------- */
function comecarPlateia() {
  const ctx = pegarAudio();
  if (!ctx) return;
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido(ctx, 4);
  fonte.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 700;
  f.Q.value = 0.8;
  const onda = ctx.createGain(); // a plateia sobe e desce devagar
  onda.gain.value = 0.7;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.3;
  lfo.connect(lfoG).connect(onda.gain);
  const volume = ctx.createGain();
  volume.gain.setValueAtTime(0, ctx.currentTime);
  volume.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2);
  fonte.connect(f).connect(onda).connect(volume).connect(ctx.destination);
  fonte.start();
  lfo.start();
  chuva = {
    parar() {
      const t = ctx.currentTime;
      volume.gain.cancelScheduledValues(t);
      volume.gain.setValueAtTime(volume.gain.value, t);
      volume.gain.linearRampToValueAtTime(0, t + 1);
      fonte.stop(t + 1.1);
      lfo.stop(t + 1.1);
    }
  };
}

/* ---------- botões ---------- */
/** Botãozinho de liga/desliga (usado no Foco e em Ajustes). */
const botaoSom = (qual, rotulo) =>
  `<button class="btn small ${S.sons[qual] ? "" : "ghost"}" data-act="som" data-s="${qual}" aria-pressed="${!!S.sons[qual]}">${rotulo}: ${S.sons[qual] ? "ligado" : "desligado"}</button>`;

ACOES_EXTRAS.som = b => {
  const qual = b.dataset.s;
  S.sons[qual] = !S.sons[qual];
  commit();
  atualizarChuva();
  if (qual === "pagina" && S.sons.pagina) somPagina(); // amostra do som
};
