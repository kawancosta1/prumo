/*
  Sons do clima (mundo Emo). Tudo é gerado na hora com WebAudio, sem arquivos de áudio:
  - Chuva ambiente enquanto o cronômetro de foco está rodando (ruído filtrado + pingos).
  - Som de virar página ao concluir uma tarefa.
  Os dois podem ser desligados (S.sons.chuva e S.sons.pagina), no Foco ou em Ajustes.
*/
"use strict";

let audio = null; // AudioContext, criado só quando precisa
let chuva = null; // { parar() } quando está chovendo
let pingoTimer = null;

const somDoMundo = () => S.persona === "emo"; // por enquanto só o emo tem clima

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
  const ctx = pegarAudio();
  if (!ctx) return;
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
  const ctx = pegarAudio();
  if (!ctx) return;
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
