/*
  audio-paisagens.js - Sintetizador WebAudio de Foco Profundo (Zero MP3)
  Gera paisagens sonoras matematicas puras: Chuva, Lareira crepitante e Batidas Binaurais Alfa (10Hz).
*/
"use strict";

let _audioCtx = null;
let _somAtivoTipo = null;
let _nosAudio = [];

function obterAudioContext() {
  if (!_audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) _audioCtx = new AudioContextClass();
  }
  if (_audioCtx && _audioCtx.state === "suspended") {
    _audioCtx.resume();
  }
  return _audioCtx;
}

let _parandoPaisagem = false;
function pararPaisagemSonora() {
  if (_parandoPaisagem) return;
  _parandoPaisagem = true;

  _nosAudio.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {}
  });
  _nosAudio = [];
  _somAtivoTipo = null;

  if (typeof document !== "undefined") {
    const btn = document.getElementById("btn-paisagem-som");
    if (btn) btn.textContent = "🎧 Foco Sonoro";
  }

  if (typeof pararAsmrVintage === "function" && typeof window.obterSomAsmrAtivo === "function" && window.obterSomAsmrAtivo()) {
    try { pararAsmrVintage(); } catch (_) {}
  }

  _parandoPaisagem = false;
}

function tocarPaisagemSonora(tipo) {
  pararPaisagemSonora();
  const ctx = obterAudioContext();
  if (!ctx) return;

  _somAtivoTipo = tipo;

  if (tipo === "vinil") {
    if (typeof tocarAsmrVintage === "function") {
      tocarAsmrVintage("vinil");
    }
  } else if (tipo === "chuva") {
    // Gerar Ruído Rosa Suave (Frequências de Chuva na Vidraça)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.11;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;

    const gain = ctx.createGain();
    gain.gain.value = 0.35;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    _nosAudio.push(noise, filter, gain);

  } else if (tipo === "binaural") {
    // Batida Binaural Alfa (Ouvido Esquerdo: 200Hz, Ouvido Direito: 210Hz -> Diferença = 10Hz de Hiperfoco)
    const oscEsq = ctx.createOscillator();
    const oscDir = ctx.createOscillator();
    oscEsq.type = "sine";
    oscDir.type = "sine";
    oscEsq.frequency.value = 200;
    oscDir.frequency.value = 210;

    const merger = ctx.createChannelMerger(2);
    const gain = ctx.createGain();
    gain.gain.value = 0.18;

    oscEsq.connect(merger, 0, 0); // Canal Esquerdo
    oscDir.connect(merger, 0, 1); // Canal Direito
    merger.connect(gain);
    gain.connect(ctx.destination);

    oscEsq.start();
    oscDir.start();
    _nosAudio.push(oscEsq, oscDir, merger, gain);

  } else if (tipo === "lareira") {
    // Ruído Marrom com estalos suaves de calor
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 1.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 450;

    const gain = ctx.createGain();
    gain.gain.value = 0.4;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    _nosAudio.push(noise, filter, gain);
  }

  if (typeof document !== "undefined") {
    const btn = document.getElementById("btn-paisagem-som");
    if (btn) {
      const nomes = { vinil: "📻 Vitrola 1930", chuva: "🌧️ Chuva", lareira: "🔥 Lareira", binaural: "🧠 Alfa 10Hz" };
      btn.textContent = nomes[tipo] || "🎧 Foco";
    }
  }
}

function alternarPaisagemSonora() {
  if (_somAtivoTipo || (typeof window.obterSomAsmrAtivo === "function" && window.obterSomAsmrAtivo())) {
    pararPaisagemSonora();
  } else {
    tocarPaisagemSonora("vinil");
  }
}

// Exportacao universal
if (typeof window !== "undefined") {
  window.tocarPaisagemSonora = tocarPaisagemSonora;
  window.pararPaisagemSonora = pararPaisagemSonora;
  window.alternarPaisagemSonora = alternarPaisagemSonora;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    tocarPaisagemSonora,
    pararPaisagemSonora,
    alternarPaisagemSonora
  };
}
