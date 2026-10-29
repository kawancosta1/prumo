/*
  musica-prumo.js - Sintetizador Musical Procedural & Player de Foco Lo-Fi
  Gera trilhas musicais ricas em puro WebAudio (100% offline, zero MP3):
  1. Café & Chuva (Lo-Fi Hip-Hop Chill)
  2. Noturno em C (Piano Acústico & Neoclássico)
  3. Gramofone 1930 (Jazz Vintage & Swing)
  4. Viagem Cósmica (Synthwave & Deep Focus)
  5. Bossa Foco (Violão & Bossa Nova Suave)
*/
"use strict";

(() => {
  let _audioCtx = null;
  let _musicaTocando = false;
  let _faixaAtual = 0;
  let _volumeMestre = 0.75;
  let _masterGain = null;
  let _somFundoAtivo = "vinil"; // "nenhum", "vinil", "chuva"
  let _nosFundo = [];
  let _timerScheduler = null;
  let _proximoCompassoTempo = 0;
  let _compassoContador = 0;
  let _playerModalAberto = false;

  function obterAudioContext() {
    if (!_audioCtx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) _audioCtx = new AudioContextClass();
    }
    if (_audioCtx && _audioCtx.state === "suspended") {
      _audioCtx.resume().catch(() => {});
    }
    return _audioCtx;
  }

  function garantirMasterGain() {
    const ctx = obterAudioContext();
    if (!ctx) return null;
    if (!_masterGain) {
      _masterGain = ctx.createGain();
      _masterGain.gain.setValueAtTime(_volumeMestre, ctx.currentTime);
      _masterGain.connect(ctx.destination);
    }
    return _masterGain;
  }

  /* =================================================================
     CATÁLOGO DE TRILHAS PROCEDURAIS
     ================================================================= */
  const FAIXAS = [
    {
      id: "lofi-cafe",
      nome: "Café & Chuva",
      estilo: "Lo-Fi Hip-Hop Chill",
      icone: "☕",
      bpm: 68,
      cor: "#f59e0b",
      acordes: [
        // Dm9 -> G13 -> Cmaj9 -> Am7
        [146.83, 220.0, 261.63, 293.66, 329.63],
        [98.0, 196.0, 246.94, 329.63, 349.23],
        [130.81, 196.0, 246.94, 261.63, 329.63],
        [110.0, 164.81, 220.0, 261.63, 329.63]
      ],
      baixo: [73.42, 49.0, 65.41, 55.0],
      temBateria: true,
      tipoInstrumento: "rhodes",
      fundoPadrao: "vinil"
    },
    {
      id: "piano-noturno",
      nome: "Noturno em C",
      estilo: "Piano Acústico & Neoclássico",
      icone: "🎹",
      bpm: 62,
      cor: "#3b82f6",
      acordes: [
        // Cmaj7 -> Em7 -> Fmaj7 -> G6
        [130.81, 196.0, 246.94, 261.63, 329.63],
        [164.81, 196.0, 246.94, 329.63, 392.0],
        [174.61, 220.0, 261.63, 329.63, 392.0],
        [196.0, 246.94, 293.66, 329.63, 392.0]
      ],
      baixo: [65.41, 82.41, 87.31, 98.0],
      temBateria: false,
      tipoInstrumento: "piano",
      fundoPadrao: "nenhum"
    },
    {
      id: "jazz-vintage",
      nome: "Gramofone 1930",
      estilo: "Jazz Swing & Bossa Vintage",
      icone: "🎷",
      bpm: 76,
      cor: "#d97706",
      acordes: [
        // C6 -> A7 -> Dm7 -> G7
        [130.81, 164.81, 196.0, 220.0, 261.63],
        [110.0, 138.59, 164.81, 220.0, 277.18],
        [146.83, 174.61, 220.0, 261.63, 349.23],
        [98.0, 146.83, 196.0, 246.94, 349.23]
      ],
      baixo: [65.41, 55.0, 73.42, 49.0],
      temBateria: true,
      tipoInstrumento: "vintage",
      fundoPadrao: "vinil"
    },
    {
      id: "synth-foco",
      nome: "Viagem Cósmica",
      estilo: "Synthwave & Deep Focus",
      icone: "🌌",
      bpm: 80,
      cor: "#8b5cf6",
      acordes: [
        // Fm -> Ab -> Eb -> Db
        [174.61, 207.65, 261.63, 349.23],
        [207.65, 261.63, 311.13, 415.3],
        [155.56, 196.0, 233.08, 311.13],
        [138.59, 174.61, 207.65, 277.18]
      ],
      baixo: [43.65, 51.91, 38.89, 34.65],
      temBateria: true,
      tipoInstrumento: "synth",
      fundoPadrao: "nenhum"
    },
    {
      id: "bossa-foco",
      nome: "Bossa da Tarde",
      estilo: "Violão & Bossa Nova Suave",
      icone: "🍃",
      bpm: 72,
      cor: "#10b981",
      acordes: [
        // D7M(9) -> G7(13) -> C7M(9) -> A7(b13)
        [146.83, 185.0, 220.0, 277.18, 329.63],
        [98.0, 146.83, 185.0, 246.94, 329.63],
        [130.81, 164.81, 196.0, 246.94, 293.66],
        [110.0, 138.59, 207.65, 220.0, 261.63]
      ],
      baixo: [73.42, 49.0, 65.41, 55.0],
      temBateria: true,
      tipoInstrumento: "violao",
      fundoPadrao: "chuva"
    }
  ];

  /* =================================================================
     SÍNTESE DOS INSTRUMENTOS COM WEBAUDIO
     ================================================================= */
  function tocarNotaInstrumento(ctx, dest, tempo, freq, duracao, tipo, vel = 0.28) {
    if (!freq || freq <= 0) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filtro = ctx.createBiquadFilter();

    filtro.type = "lowpass";

    if (tipo === "rhodes") {
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(freq, tempo);
      osc2.frequency.setValueAtTime(freq * 2, tempo);
      filtro.frequency.setValueAtTime(1100, tempo);
      filtro.Q.value = 1.0;
      gain.gain.setValueAtTime(0.001, tempo);
      gain.gain.linearRampToValueAtTime(vel * 0.45, tempo + 0.025);
      gain.gain.exponentialRampToValueAtTime(vel * 0.18, tempo + duracao * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);
    } else if (tipo === "piano") {
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(freq, tempo);
      osc2.frequency.setValueAtTime(freq * 1.002, tempo);
      filtro.frequency.setValueAtTime(1600, tempo);
      filtro.Q.value = 1.4;
      gain.gain.setValueAtTime(0.001, tempo);
      gain.gain.linearRampToValueAtTime(vel * 0.55, tempo + 0.015);
      gain.gain.exponentialRampToValueAtTime(vel * 0.22, tempo + duracao * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);
    } else if (tipo === "synth") {
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(freq, tempo);
      osc2.frequency.setValueAtTime(freq * 0.5, tempo);
      filtro.frequency.setValueAtTime(650, tempo);
      filtro.frequency.linearRampToValueAtTime(1400, tempo + duracao * 0.4);
      filtro.frequency.linearRampToValueAtTime(500, tempo + duracao);
      filtro.Q.value = 3.5;
      gain.gain.setValueAtTime(0.001, tempo);
      gain.gain.linearRampToValueAtTime(vel * 0.3, tempo + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);
    } else if (tipo === "violao" || tipo === "vintage") {
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(freq, tempo);
      osc2.frequency.setValueAtTime(freq * 2.003, tempo);
      filtro.frequency.setValueAtTime(1250, tempo);
      filtro.Q.value = 1.8;
      gain.gain.setValueAtTime(0.001, tempo);
      gain.gain.linearRampToValueAtTime(vel * 0.48, tempo + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao * 0.9);
    }

    osc1.connect(filtro);
    osc2.connect(filtro);
    filtro.connect(gain);
    gain.connect(dest);

    osc1.start(tempo);
    osc2.start(tempo);
    osc1.stop(tempo + duracao + 0.05);
    osc2.stop(tempo + duracao + 0.05);
  }

  function tocarBaixo(ctx, dest, tempo, freq, duracao, vel = 0.42) {
    if (!freq || freq <= 0) return;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filtro = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    sub.type = "sine";
    osc.frequency.setValueAtTime(freq, tempo);
    sub.frequency.setValueAtTime(freq * 0.5, tempo);

    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(220, tempo);
    filtro.Q.value = 1.2;

    gain.gain.setValueAtTime(0.001, tempo);
    gain.gain.linearRampToValueAtTime(vel * 0.5, tempo + 0.03);
    gain.gain.exponentialRampToValueAtTime(vel * 0.25, tempo + duracao * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);

    osc.connect(filtro);
    sub.connect(filtro);
    filtro.connect(gain);
    gain.connect(dest);

    osc.start(tempo);
    sub.start(tempo);
    osc.stop(tempo + duracao + 0.05);
    sub.stop(tempo + duracao + 0.05);
  }

  function tocarBumbo(ctx, dest, tempo, vel = 0.55) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, tempo);
    osc.frequency.exponentialRampToValueAtTime(42, tempo + 0.08);

    gain.gain.setValueAtTime(vel * 0.65, tempo);
    gain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.16);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(tempo);
    osc.stop(tempo + 0.18);
  }

  function tocarCaixaRimshot(ctx, dest, tempo, vel = 0.35) {
    // Ruído filtrado (madeira / rimshot lo-fi)
    const bufLen = Math.floor(ctx.sampleRate * 0.09);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.5;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filtro = ctx.createBiquadFilter();
    filtro.type = "bandpass";
    filtro.frequency.setValueAtTime(1900, tempo);
    filtro.Q.value = 1.3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.45, tempo);
    gain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.09);

    noise.connect(filtro);
    filtro.connect(gain);
    gain.connect(dest);
    noise.start(tempo);
    noise.stop(tempo + 0.1);

    // Corpo de madeira
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(260, tempo);
    pop.frequency.exponentialRampToValueAtTime(90, tempo + 0.04);
    popGain.gain.setValueAtTime(vel * 0.3, tempo);
    popGain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.045);
    pop.connect(popGain);
    popGain.connect(dest);
    pop.start(tempo);
    pop.stop(tempo + 0.05);
  }

  function tocarHiHat(ctx, dest, tempo, vel = 0.15) {
    const bufLen = Math.floor(ctx.sampleRate * 0.035);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filtro = ctx.createBiquadFilter();
    filtro.type = "highpass";
    filtro.frequency.setValueAtTime(7000, tempo);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.28, tempo);
    gain.gain.exponentialRampToValueAtTime(0.001, tempo + 0.035);

    noise.connect(filtro);
    filtro.connect(gain);
    gain.connect(dest);
    noise.start(tempo);
    noise.stop(tempo + 0.04);
  }

  /* =================================================================
     AMBIÊNCIA DE FUNDO (CHIADO DE VINIL RETRÔ OU CHUVA SUAVE)
     ================================================================= */
  function pararSomFundo() {
    _nosFundo.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (_) {}
    });
    _nosFundo = [];
  }

  function iniciarSomFundo(tipo) {
    pararSomFundo();
    if (!tipo || tipo === "nenhum") return;
    const ctx = obterAudioContext();
    const dest = garantirMasterGain();
    if (!ctx || !dest) return;

    if (tipo === "vinil") {
      const bufSize = ctx.sampleRate * 2.5;
      const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
      const dL = buf.getChannelData(0);
      const dR = buf.getChannelData(1);
      const revSamples = Math.floor(ctx.sampleRate * 0.85);

      for (let i = 0; i < bufSize; i++) {
        const rev = 1.0 + 0.12 * Math.sin((i / revSamples) * 2 * Math.PI);
        const w = (Math.random() * 2 - 1) * 0.015;
        let pop = 0;
        if (Math.random() < 0.0006) pop = (Math.random() > 0.5 ? 1 : -1) * 0.09;
        const val = (w + pop) * rev;
        dL[i] = val;
        dR[i] = val * (0.9 + Math.random() * 0.2);
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filtro = ctx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.frequency.value = 1600;
      filtro.Q.value = 1.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      src.connect(filtro);
      filtro.connect(gain);
      gain.connect(dest);
      src.start();
      _nosFundo.push(src, filtro, gain);
    } else if (tipo === "chuva") {
      const bufSize = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.055;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.96900 * b2 + white * 0.153;
        data[i] = (b0 + b1 + b2) * 0.08;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filtro = ctx.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = 750;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      src.connect(filtro);
      filtro.connect(gain);
      gain.connect(dest);
      src.start();
      _nosFundo.push(src, filtro, gain);
    }
  }

  /* =================================================================
     MOTOR DE REPRODUÇÃO MUSICAL (SCHEDULER TEMPORAL)
     ================================================================= */
  function agendarCompasso(tempoInicio, compassoIdx) {
    const ctx = obterAudioContext();
    const dest = garantirMasterGain();
    if (!ctx || !dest) return;

    const faixa = FAIXAS[_faixaAtual];
    if (!faixa) return;

    const tempoPorBatida = 60 / faixa.bpm;
    const acordeIdx = compassoIdx % faixa.acordes.length;
    const acordeNotas = faixa.acordes[acordeIdx];
    const notaBaixo = faixa.baixo[acordeIdx];

    // 1. Acorde com leve arpejo natural
    acordeNotas.forEach((freq, i) => {
      const microStrum = tempoInicio + i * 0.022;
      tocarNotaInstrumento(ctx, dest, microStrum, freq, tempoPorBatida * 3.6, faixa.tipoInstrumento, 0.32);
    });

    // 2. Linha de baixo encorpada
    tocarBaixo(ctx, dest, tempoInicio, notaBaixo, tempoPorBatida * 3.2, 0.44);

    // 3. Notas melódicas doces na segunda metade do compasso
    const notaMelodia1 = acordeNotas[acordeNotas.length - 1] * 1.5;
    const notaMelodia2 = acordeNotas[acordeNotas.length - 2] * 1.5;
    tocarNotaInstrumento(ctx, dest, tempoInicio + tempoPorBatida * 2.0, notaMelodia1, tempoPorBatida * 0.8, faixa.tipoInstrumento, 0.22);
    tocarNotaInstrumento(ctx, dest, tempoInicio + tempoPorBatida * 2.75, notaMelodia2, tempoPorBatida * 0.9, faixa.tipoInstrumento, 0.2);

    // 4. Bateria (se a faixa tiver)
    if (faixa.temBateria) {
      // Beat 1: Kick
      tocarBumbo(ctx, dest, tempoInicio, 0.55);
      tocarHiHat(ctx, dest, tempoInicio, 0.16);

      // Beat 1.5: Hi-hat swing
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida * 0.58, 0.11);

      // Beat 2: Snare / Rimshot
      tocarCaixaRimshot(ctx, dest, tempoInicio + tempoPorBatida, 0.38);
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida, 0.18);

      // Beat 2.5: Hi-hat swing
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida * 1.58, 0.12);

      // Beat 3: Kick sincopado
      tocarBumbo(ctx, dest, tempoInicio + tempoPorBatida * 2.0, 0.48);
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida * 2.0, 0.16);

      // Beat 3.75: Kick fantasma lo-fi
      if (compassoIdx % 2 === 1) {
        tocarBumbo(ctx, dest, tempoInicio + tempoPorBatida * 2.75, 0.35);
      }

      // Beat 4: Snare
      tocarCaixaRimshot(ctx, dest, tempoInicio + tempoPorBatida * 3.0, 0.38);
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida * 3.0, 0.18);

      // Beat 4.5: Hi-hat swing
      tocarHiHat(ctx, dest, tempoInicio + tempoPorBatida * 3.58, 0.14);
    } else {
      // Sem bateria: dedilhado de piano na mão esquerda
      tocarNotaInstrumento(ctx, dest, tempoInicio + tempoPorBatida * 1.0, acordeNotas[1], tempoPorBatida * 1.2, faixa.tipoInstrumento, 0.22);
      tocarNotaInstrumento(ctx, dest, tempoInicio + tempoPorBatida * 2.0, acordeNotas[2], tempoPorBatida * 1.2, faixa.tipoInstrumento, 0.24);
      tocarNotaInstrumento(ctx, dest, tempoInicio + tempoPorBatida * 3.0, acordeNotas[0], tempoPorBatida * 1.2, faixa.tipoInstrumento, 0.2);
    }
  }

  function loopScheduler() {
    if (!_musicaTocando) return;
    const ctx = obterAudioContext();
    if (!ctx) return;

    const faixa = FAIXAS[_faixaAtual];
    const duracaoCompasso = (60 / (faixa ? faixa.bpm : 68)) * 4;

    // Agendar se estiver dentro da janela de lookahead (150ms)
    while (_proximoCompassoTempo < ctx.currentTime + 0.15) {
      agendarCompasso(_proximoCompassoTempo, _compassoContador++);
      _proximoCompassoTempo += duracaoCompasso;
    }

    _timerScheduler = setTimeout(loopScheduler, 30);
  }

  /* =================================================================
     API PÚBLICA DE REPRODUÇÃO
     ================================================================= */
  function tocarMusicaPrumo(faixaIdx = 0) {
    const ctx = obterAudioContext();
    if (!ctx) return;

    if (typeof faixaIdx === "number" && faixaIdx >= 0 && faixaIdx < FAIXAS.length) {
      _faixaAtual = faixaIdx;
    }

    _musicaTocando = true;
    _compassoContador = 0;
    _proximoCompassoTempo = ctx.currentTime + 0.05;

    garantirMasterGain();
    const faixa = FAIXAS[_faixaAtual];
    _somFundoAtivo = faixa.fundoPadrao || "vinil";
    iniciarSomFundo(_somFundoAtivo);

    if (_timerScheduler) clearTimeout(_timerScheduler);
    loopScheduler();

    atualizarInterfaceMusica();

    // Notificar com toast acolhedor
    if (typeof toast === "function") {
      toast(`${faixa.icone} Tocando: <b>${faixa.nome}</b> (${faixa.estilo})`, false, "happy");
    }
    if (typeof react === "function") {
      react("happy", `A música começou... Ótimo foco! 🎵`, 2200);
    }
  }

  function pararMusicaPrumo() {
    _musicaTocando = false;
    if (_timerScheduler) {
      clearTimeout(_timerScheduler);
      _timerScheduler = null;
    }
    pararSomFundo();
    atualizarInterfaceMusica();

    if (typeof toast === "function") {
      toast("🔇 Música pausada.", false, "sleepy");
    }
  }

  function alternarMusicaPrumo() {
    if (_musicaTocando) pararMusicaPrumo();
    else tocarMusicaPrumo(_faixaAtual);
  }

  function proximaMusicaPrumo() {
    _faixaAtual = (_faixaAtual + 1) % FAIXAS.length;
    tocarMusicaPrumo(_faixaAtual);
  }

  function musicaAnteriorPrumo() {
    _faixaAtual = (_faixaAtual - 1 + FAIXAS.length) % FAIXAS.length;
    tocarMusicaPrumo(_faixaAtual);
  }

  function definirVolumeMusicaPrumo(vol) {
    _volumeMestre = Math.max(0, Math.min(1, parseFloat(vol) || 0.75));
    if (_masterGain && _audioCtx) {
      _masterGain.gain.cancelScheduledValues(_audioCtx.currentTime);
      _masterGain.gain.setValueAtTime(_volumeMestre, _audioCtx.currentTime);
    }
    atualizarInterfaceMusica();
  }

  function alternarFundoAmbiencia(tipo) {
    if (_somFundoAtivo === tipo) _somFundoAtivo = "nenhum";
    else _somFundoAtivo = tipo;
    if (_musicaTocando) iniciarSomFundo(_somFundoAtivo);
    atualizarInterfaceMusica();
  }

  function obterEstadoMusicaPrumo() {
    return {
      tocando: _musicaTocando,
      faixaAtual: _faixaAtual,
      faixa: FAIXAS[_faixaAtual],
      faixas: FAIXAS,
      volume: _volumeMestre,
      somFundo: _somFundoAtivo,
      modalAberto: _playerModalAberto
    };
  }

  /* =================================================================
     SINCRONIZAÇÃO VISUAL COM O DOM
     ================================================================= */
  function atualizarInterfaceMusica() {
    const estado = obterEstadoMusicaPrumo();
    const faixa = estado.faixa;

    // 1. Botão no cabeçalho superior (#btn-musica-topo e .barra-som-asmr)
    const btnsTopo = document.querySelectorAll(".barra-som-asmr, #btn-musica-topo");
    btnsTopo.forEach(btn => {
      btn.classList.toggle("tocando", estado.tocando);
      btn.title = estado.tocando
        ? `Tocando: ${faixa.nome} (${faixa.estilo}) - Clique para abrir o Player`
        : `Player de Música & Foco - Clique para ouvir`;
      btn.innerHTML = estado.tocando
        ? `<span class="onda-animada"><i></i><i></i><i></i></span> ${faixa.icone} ${faixa.nome}`
        : `🎵 Música & Foco`;
    });

    // 2. Classes no body e nas vitrolas (Sótão, Quartos, Casa e Estudos)
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.toggle("vitrola-tocando", estado.tocando);
      document.body.classList.toggle("musica-tocando", estado.tocando);
      document.body.classList.toggle("asmr-tocando", estado.tocando);

      document.querySelectorAll(".vitrola-svg-grupo, .sotao-vitrola-canto, .q-movel[data-id='vitrola']").forEach(el => {
        el.classList.toggle("tocando", estado.tocando);
        el.classList.toggle("vitrola-girando", estado.tocando);
      });
    }

    // 3. Card da Vitrola na tela de Estudos
    const widgetInfo = document.querySelector(".vitrola-foco-sub");
    if (widgetInfo) {
      widgetInfo.innerHTML = estado.tocando
        ? `<span class="ponto-verde"></span> Tocando: <b>${faixa.icone} ${faixa.nome}</b> (${faixa.estilo})`
        : "Toque na Vitrola para ouvir música de foco relaxante";
    }

    // 4. Atualizar modal do player se estiver aberto
    atualizarConteudoModalPlayer();
  }

  /* =================================================================
     MODAL / DRAWER COMPLETO DO PLAYER DE MÚSICA
     ================================================================= */
  function abrirPlayerMusica() {
    _playerModalAberto = true;
    let modal = document.getElementById("modal-player-musica");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-player-musica";
      modal.className = "modal-player-overlay";
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";
    atualizarConteudoModalPlayer();
  }

  function fecharPlayerMusica() {
    _playerModalAberto = false;
    const modal = document.getElementById("modal-player-musica");
    if (modal) modal.style.display = "none";
  }

  function atualizarConteudoModalPlayer() {
    const modal = document.getElementById("modal-player-musica");
    if (!modal || !_playerModalAberto) return;

    const estado = obterEstadoMusicaPrumo();
    const faixa = estado.faixa;

    modal.innerHTML = `
      <div class="modal-player-caixa" role="dialog" aria-modal="true" aria-label="Player de Música">
        <div class="modal-player-header">
          <div class="modal-player-badge">
            <span class="disco-giratorio ${estado.tocando ? 'girando' : ''}">📀</span>
            <strong>Player de Música & Foco</strong>
          </div>
          <button class="modal-player-fechar" data-act="fechar-player-musica" aria-label="Fechar">&times;</button>
        </div>

        <div class="modal-player-corpo">
          <!-- Arte do Disco / Capa -->
          <div class="modal-player-arte">
            <div class="vinil-disco-card ${estado.tocando ? 'girando' : ''}" style="--cor-faixa:${faixa.cor}">
              <div class="vinil-ranhuras">
                <div class="vinil-centro">
                  <span class="vinil-icone">${faixa.icone}</span>
                  <small>${faixa.bpm} BPM</small>
                </div>
              </div>
            </div>
            <div class="modal-player-info">
              <h3 class="modal-player-titulo">${faixa.nome}</h3>
              <p class="modal-player-sub">${faixa.estilo}</p>
              <div class="modal-player-status">
                ${estado.tocando ? `<span class="badge-tocando"><span class="onda-mini"><i></i><i></i><i></i><i></i></span> No ar</span>` : `<span class="badge-pausado">Pausado</span>`}
              </div>
            </div>
          </div>

          <!-- Controles Principais -->
          <div class="modal-player-controles">
            <button class="btn-ctrl" data-act="musica-anterior" title="Música Anterior">⏮️</button>
            <button class="btn-ctrl btn-play-principal ${estado.tocando ? 'tocando' : ''}" data-act="alternar-musica" title="${estado.tocando ? 'Pausar' : 'Tocar'}">
              ${estado.tocando ? '⏸️ Pausar' : '▶️ Tocar Música'}
            </button>
            <button class="btn-ctrl" data-act="proxima-musica" title="Próxima Música">⏭️</button>
          </div>

          <!-- Slider de Volume -->
          <div class="modal-player-volume">
            <span>🔈</span>
            <input type="range" id="slider-volume-musica" min="0" max="1" step="0.05" value="${estado.volume}" aria-label="Volume da música">
            <span>🔊</span>
          </div>

          <!-- Efeitos de Ambiência (Opcionais) -->
          <div class="modal-player-fundo-seletor">
            <span class="label-fundo">Ambiência de fundo:</span>
            <div class="chips-fundo">
              <button class="chipbtn ${estado.somFundo === 'vinil' ? 'ativo' : ''}" data-act="mudar-fundo-musica" data-fundo="vinil">📻 Crepitar de Vinil</button>
              <button class="chipbtn ${estado.somFundo === 'chuva' ? 'ativo' : ''}" data-act="mudar-fundo-musica" data-fundo="chuva">🌧️ Chuva Suave</button>
              <button class="chipbtn ${estado.somFundo === 'nenhum' ? 'ativo' : ''}" data-act="mudar-fundo-musica" data-fundo="nenhum">🚫 Puro</button>
            </div>
          </div>

          <!-- Lista de Faixas Disponíveis -->
          <div class="modal-player-lista">
            <div class="label-lista">Escolha sua trilha sonora:</div>
            ${estado.faixas.map((f, idx) => `
              <button class="faixa-item ${idx === estado.faixaAtual ? 'selecionada' : ''}" data-act="selecionar-faixa" data-idx="${idx}">
                <span class="faixa-icone">${f.icone}</span>
                <div class="faixa-textos">
                  <strong>${f.nome}</strong>
                  <small>${f.estilo} · ${f.bpm} BPM</small>
                </div>
                ${idx === estado.faixaAtual && estado.tocando ? '<span class="faixa-onda"><i></i><i></i><i></i></span>' : '<span class="faixa-play">▶</span>'}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Conectar slider de volume
    const slider = modal.querySelector("#slider-volume-musica");
    if (slider) {
      slider.oninput = e => definirVolumeMusicaPrumo(e.target.value);
    }
  }

  /* =================================================================
     REGISTRO DE AÇÕES DO SISTEMA (ACOES_EXTRAS)
     ================================================================= */
  if (typeof window !== "undefined") {
    if (!window.ACOES_EXTRAS) window.ACOES_EXTRAS = {};

    window.ACOES_EXTRAS["abrir-player-musica"] = () => abrirPlayerMusica();
    window.ACOES_EXTRAS["fechar-player-musica"] = () => fecharPlayerMusica();
    window.ACOES_EXTRAS["alternar-musica"] = () => alternarMusicaPrumo();
    window.ACOES_EXTRAS["proxima-musica"] = () => proximaMusicaPrumo();
    window.ACOES_EXTRAS["musica-anterior"] = () => musicaAnteriorPrumo();
    window.ACOES_EXTRAS["selecionar-faixa"] = b => {
      const idx = parseInt(b && b.dataset && b.dataset.idx, 10);
      if (!isNaN(idx)) tocarMusicaPrumo(idx);
    };
    window.ACOES_EXTRAS["mudar-fundo-musica"] = b => {
      const fundo = b && b.dataset && b.dataset.fundo;
      if (fundo) alternarFundoAmbiencia(fundo);
    };

    // Atualizar ação da vitrola para tocar a música de verdade!
    window.ACOES_EXTRAS["vitrola-tocar"] = () => {
      if (_musicaTocando) {
        // Se já está tocando, abre o player de música para controle total
        abrirPlayerMusica();
      } else {
        // Se está parada, liga a música imediatamente com som aconchegante!
        tocarMusicaPrumo(_faixaAtual);
      }
    };

    // Ação do cabeçalho
    window.ACOES_EXTRAS["alternar-asmr"] = () => {
      abrirPlayerMusica();
    };

    // Exportação global
    window.tocarMusicaPrumo = tocarMusicaPrumo;
    window.pararMusicaPrumo = pararMusicaPrumo;
    window.alternarMusicaPrumo = alternarMusicaPrumo;
    window.proximaMusicaPrumo = proximaMusicaPrumo;
    window.musicaAnteriorPrumo = musicaAnteriorPrumo;
    window.definirVolumeMusicaPrumo = definirVolumeMusicaPrumo;
    window.abrirPlayerMusica = abrirPlayerMusica;
    window.fecharPlayerMusica = fecharPlayerMusica;
    window.obterEstadoMusicaPrumo = obterEstadoMusicaPrumo;
    window.alternarVitrola1930 = () => {
      if (_musicaTocando) abrirPlayerMusica();
      else tocarMusicaPrumo(_faixaAtual);
    };
  }
})();
