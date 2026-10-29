/* ===================================================================
   diferenciais-saas.js - 5 Pilares de Diferenciação Estratégica do Prumo
   1. Anti-Burnout: Dia de Respiro & Streak de Perdão
   2. Modo Corpo Duplo: Foco para TDAH & Mentes Inquietas
   3. Experiência Sensorial: ASMR Vintage (Vitrola 1930 & WebAudio Analógico)
   4. Cenário Vivo: Conexão Real da Rotina com o Quarto (Animal Crossing)
   5. Passaporte Vitalício: Alternativa à Fadiga de Assinaturas
   =================================================================== */
"use strict";

(function () {
  /* =================================================================
     01. PILAR 1: ANTI-BURNOUT (Dia de Respiro & Streak de Perdão)
     ================================================================= */
  function isDiaDeRespiro(d) {
    const data = d || (typeof today === "function" ? today() : "");
    return !!(window.S && window.S.respiro && window.S.respiro[data]);
  }

  function alternarDiaRespiro(d) {
    if (!window.S) return;
    const data = d || (typeof today === "function" ? today() : "");
    window.S.respiro = window.S.respiro || {};

    if (window.S.respiro[data]) {
      delete window.S.respiro[data];
      if (typeof toast === "function") {
        toast("Dia de Respiro desativado. Bons estudos e boa rotina!", false, "happy");
      }
    } else {
      window.S.respiro[data] = true;
      if (typeof toast === "function") {
        toast("🌿 Dia de Respiro ativado! Suas sequências estão 100% protegidas sem culpa.", false, "sleepy");
      }
      if (typeof react === "function") {
        react("sleepy", "Tudo bem descansar hoje. Recarregue suas energias com calma!", 3200);
      }
    }

    if (typeof persist === "function") persist();
    if (typeof commit === "function") commit();
    if (typeof render === "function") render();
  }

  function renderBannerRespiroHTML(d) {
    const data = d || (typeof today === "function" ? today() : "");
    const ativo = isDiaDeRespiro(data);

    if (ativo) {
      return `
        <div class="card-dia-respiro">
          <div class="respiro-header">
            <span class="respiro-icone" aria-hidden="true">🌿☕</span>
            <div class="respiro-texto">
              <strong>Dia de Respiro Ativo (Modo Anti-Burnout)</strong>
              <p>Hoje você está descansando. Suas sequências de hábitos e metas estão 100% blindadas e protegidas. Seu pet está relaxando com você.</p>
            </div>
          </div>
          <button class="btn small" data-act="alternar-respiro">Retomar Atividades</button>
        </div>
      `;
    }
    return `
      <div class="row" style="margin-bottom:8px;justify-content:flex-end">
        <button class="btn small ghost btn-pedir-respiro" data-act="alternar-respiro" title="Precisa desacelerar hoje? Ative o Dia de Respiro para pausar sem quebrar sequências e sem culpa.">
          🌿 Tirar Dia de Respiro (Sem Culpa)
        </button>
      </div>
    `;
  }

  /* =================================================================
     02. PILAR 2: MODO CORPO DUPLO (Body Doubling para TDAH)
     ================================================================= */
  const FRASES_CORPO_DUPLO = [
    "Uma coisa de cada vez. Você não está sozinho nessa.",
    "Solte os ombros, beba um gole d'água e siga no seu ritmo.",
    "Cada minuto de foco conta. Não precisa ser perfeito.",
    "Estou lendo aqui com você. Só mais um pouquinho!",
    "Respira fundo. Mantenha a atenção no próximo passo pequeno."
  ];

  function obterFraseCorpoDuplo() {
    const min = Math.floor(Date.now() / 60000);
    return FRASES_CORPO_DUPLO[min % FRASES_CORPO_DUPLO.length];
  }

  function renderCorpoDuploHTML() {
    const pet = typeof petAtivo === "function" ? petAtivo() : null;
    const nomePet = pet ? pet.nome : "Prumi";
    const petDesenho = pet && typeof petSVG === "function"
      ? petSVG(pet, { pose: "lendo", tam: 52 })
      : typeof prumi === "function"
        ? prumi({ mood: "focus", size: 52 })
        : "🐾";

    return `
      <div class="box-corpo-duplo">
        <div class="corpo-duplo-header">
          <span class="corpo-duplo-badge">👥 Modo Corpo Duplo (TDAH &amp; Mentes Inquietas)</span>
          <span class="corpo-duplo-sub">${typeof esc === "function" ? esc(nomePet) : nomePet} está focado ao seu lado</span>
        </div>
        <div class="corpo-duplo-cena">
          <div class="corpo-duplo-pet">${petDesenho}</div>
          <div class="corpo-duplo-balao">"${obterFraseCorpoDuplo()}"</div>
        </div>
      </div>
    `;
  }

  /* =================================================================
     03. PILAR 3: ASMR VINTAGE & FEEDBACK TÁTIL (WebAudio)
     ================================================================= */
  let _somAsmrAtivo = null;
  let _nosAsmr = [];
  let _timerMelodiaVinil = null;

  function obterAudioCtx() {
    if (typeof obterAudioContext === "function") return obterAudioContext();
    if (!window._asmrCtx && typeof AudioContext !== "undefined") {
      window._asmrCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window._asmrCtx;
  }

  function pararAsmrVintage() {
    if (_timerMelodiaVinil) {
      clearTimeout(_timerMelodiaVinil);
      _timerMelodiaVinil = null;
    }
    _nosAsmr.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (_) {}
    });
    _nosAsmr = [];
    _somAsmrAtivo = null;
    atualizarBotaoAsmr();
  }

  function tocarAsmrVintage(tipo) {
    pararAsmrVintage();
    if (typeof pararPaisagemSonora === "function") pararPaisagemSonora();
    const ctx = obterAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    _somAsmrAtivo = tipo;

    if (tipo === "vinil") {
      const t0 = ctx.currentTime;

      // 1. Efeito mecânico de agulha pousando suavemente nas ranhuras do vinil
      try {
        const pop = ctx.createOscillator();
        const popGain = ctx.createGain();
        pop.type = "sine";
        pop.frequency.setValueAtTime(80, t0);
        pop.frequency.exponentialRampToValueAtTime(30, t0 + 0.045);
        popGain.gain.setValueAtTime(0.08, t0);
        popGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
        pop.connect(popGain);
        popGain.connect(ctx.destination);
        pop.start(t0);
        pop.stop(t0 + 0.055);
        _nosAsmr.push(pop, popGain);
      } catch (_) {}

      // 2. Chiado contínuo estéreo de goma-laca 78 RPM (revoluções cíclicas a 1.3Hz)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dL = buffer.getChannelData(0);
      const dR = buffer.getChannelData(1);
      const revSamples = Math.floor(ctx.sampleRate * 0.77); // Rotação 78 RPM

      for (let i = 0; i < bufferSize; i++) {
        const revMod = 1.0 + 0.14 * Math.sin((i / revSamples) * 2 * Math.PI);
        const white = (Math.random() * 2 - 1);
        let crackle = 0;
        if (Math.random() < 0.0007) {
          crackle = (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.3);
        }
        if (i % revSamples < 16) {
          crackle += (Math.random() * 0.08);
        }
        const s = (white * 0.032 + crackle) * revMod;
        dL[i] = s;
        dR[i] = s * (0.92 + Math.random() * 0.16);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1750;
      filter.Q.value = 1.15;

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 320;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(highpass);
      highpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      _nosAsmr.push(noise, filter, highpass, gain);

      // 3. Melodia suave e aconchegante de gramofone 1930 (acordes relaxantes com filtro analógico)
      const acordes = [
        [261.6, 329.6, 392.0], // C
        [220.0, 261.6, 329.6], // Am
        [174.6, 220.0, 261.6], // F
        [196.0, 246.9, 293.7]  // G
      ];
      let acordeIdx = 0;

      const tocarProximoAcorde = () => {
        if (_somAsmrAtivo !== "vinil") return;
        try {
          const agora = ctx.currentTime;
          const notas = acordes[acordeIdx % acordes.length];
          acordeIdx++;

          const mFilter = ctx.createBiquadFilter();
          mFilter.type = "bandpass";
          mFilter.frequency.value = 1100;
          mFilter.Q.value = 1.8;

          const mGain = ctx.createGain();
          mGain.gain.setValueAtTime(0.001, agora);
          mGain.gain.linearRampToValueAtTime(0.022, agora + 0.6);
          mGain.gain.setValueAtTime(0.022, agora + 2.2);
          mGain.gain.linearRampToValueAtTime(0.001, agora + 3.2);

          mFilter.connect(mGain);
          mGain.connect(ctx.destination);

          notas.forEach((freq, k) => {
            const osc = ctx.createOscillator();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, agora + k * 0.04);
            osc.connect(mFilter);
            osc.start(agora + k * 0.04);
            osc.stop(agora + 3.3);
            _nosAsmr.push(osc);
          });
          _nosAsmr.push(mFilter, mGain);
        } catch (_) {}

        _timerMelodiaVinil = setTimeout(tocarProximoAcorde, 3400);
      };
      tocarProximoAcorde();

    } else if (tipo === "chuva" && typeof tocarPaisagemSonora === "function") {
      tocarPaisagemSonora("chuva");
      _somAsmrAtivo = "chuva";
    } else if (tipo === "lareira" && typeof tocarPaisagemSonora === "function") {
      tocarPaisagemSonora("lareira");
      _somAsmrAtivo = "lareira";
    } else if (tipo === "binaural" && typeof tocarPaisagemSonora === "function") {
      tocarPaisagemSonora("binaural");
      _somAsmrAtivo = "binaural";
    }

    atualizarBotaoAsmr();
  }

  function alternarAsmrVintage() {
    const lista = [null, "vinil", "chuva", "lareira", "binaural"];
    const idx = lista.indexOf(_somAsmrAtivo);
    const prox = lista[(idx + 1) % lista.length];
    if (prox) {
      tocarAsmrVintage(prox);
    } else {
      pararAsmrVintage();
    }
  }

  function alternarVitrola1930() {
    if (_somAsmrAtivo === "vinil") {
      pararAsmrVintage();
      if (typeof toast === "function") toast("📻 Vitrola 1930 pausada.", false, "sleepy");
    } else {
      tocarAsmrVintage("vinil");
      if (typeof toast === "function") toast("📻 Vitrola 1930 ligada! Foco analógico e chiado vintage.", false, "happy");
      if (typeof react === "function") react("happy", "A agulha pousou no disco... Bom foco e boa rotina!", 3000);
    }
  }

  function obterSomAsmrAtivo() {
    return _somAsmrAtivo;
  }

  function atualizarBotaoAsmr() {
    const btns = document.querySelectorAll(".barra-som-asmr");
    const nomes = {
      vinil: "📻 Vitrola 1930",
      chuva: "🌧️ Chuva na Vidraça",
      lareira: "🔥 Lareira",
      binaural: "🧠 Foco Alfa 10Hz"
    };
    btns.forEach(btn => {
      btn.classList.toggle("tocando", !!_somAsmrAtivo);
      btn.innerHTML = _somAsmrAtivo
        ? `<span class="onda-animada"><i></i><i></i><i></i></span> ${nomes[_somAsmrAtivo] || "Tocando"}`
        : `🎧 Som ASMR Vintage`;
    });

    if (typeof document !== "undefined" && document.body) {
      document.body.classList.toggle("vitrola-tocando", _somAsmrAtivo === "vinil");
      document.body.classList.toggle("asmr-tocando", !!_somAsmrAtivo);
      document.querySelectorAll(".vitrola-svg-grupo, .q-movel").forEach(el => {
        el.classList.toggle("tocando", _somAsmrAtivo === "vinil");
        el.classList.toggle("vitrola-girando", _somAsmrAtivo === "vinil");
      });
    }

    const widgetInfo = document.querySelector(".vitrola-foco-sub");
    if (widgetInfo) {
      widgetInfo.innerHTML = _somAsmrAtivo
        ? `<span class="ponto-verde"></span> Tocando: <b>${nomes[_somAsmrAtivo]}</b>`
        : "Toque na Vitrola para focar com som analógico";
    }
    document.querySelectorAll(".vitrola-foco-botoes [data-tipo]").forEach(btn => {
      btn.classList.toggle("ativo", btn.dataset.tipo === _somAsmrAtivo);
    });
  }

  /* =================================================================
     DESENHO VETORIAL DA VITROLA 1930 (Gramofone Clássico em Puro SVG)
     ================================================================= */
  function desenharVitrolaSVG(opcoes = {}) {
    const tocando = typeof opcoes.tocando === "boolean"
      ? opcoes.tocando
      : (_somAsmrAtivo === "vinil" || (typeof document !== "undefined" && document.body && document.body.classList.contains("vitrola-tocando")));
    const interativo = opcoes.interativo !== false;
    const classe = (opcoes.classe || "") + (tocando ? " vitrola-girando tocando" : "");

    return `
      <g class="vitrola-svg-grupo ${classe}" ${interativo ? 'data-act="vitrola-tocar" style="cursor:pointer;" role="button" tabindex="0" title="Vitrola 1930 (Toque para ligar ou pausar o disco de vinil)"' : ''}>
        <!-- Sombra no piso -->
        <ellipse cx="24" cy="45" rx="19" ry="3" fill="#000000" opacity="0.32"/>

        <!-- Pés de madeira torneada -->
        <rect x="7" y="42" width="4.5" height="4" rx="1.2" fill="#2E1408" stroke="#170A04" stroke-width="0.8"/>
        <rect x="36.5" y="42" width="4.5" height="4" rx="1.2" fill="#2E1408" stroke="#170A04" stroke-width="0.8"/>

        <!-- Gabinete principal de mogno/nogueira maciça 1930 -->
        <rect x="6" y="25" width="36" height="18" rx="2.5" fill="#5A2A12" stroke="#261005" stroke-width="1.2"/>
        <!-- Moldura chanfrada de madeira nobre -->
        <rect x="8.5" y="27.5" width="31" height="13" rx="1.6" fill="#753718" stroke="#3D1A08" stroke-width="0.8"/>
        <line x1="9.5" y1="28.5" x2="38.5" y2="28.5" stroke="#9E5326" stroke-width="0.7" opacity="0.65"/>

        <!-- Plaqueta de latão gravada "PRUMO 1930" -->
        <rect x="17" y="29.5" width="14" height="4" rx="0.8" fill="#F59E0B" stroke="#78350F" stroke-width="0.6"/>
        <text x="24" y="32.5" font-size="2.4" font-family="'Times New Roman', Georgia, serif" font-weight="bold" fill="#451A03" text-anchor="middle" letter-spacing="0.3">PRUMO 1930</text>

        <!-- Botões de controle de baquelite e seletor de rotação -->
        <circle cx="12" cy="35.5" r="1.6" fill="#D97706" stroke="#261005" stroke-width="0.6"/>
        <circle cx="12" cy="35.5" r="0.6" fill="#451A03"/>
        <circle cx="36" cy="35.5" r="1.6" fill="#D97706" stroke="#261005" stroke-width="0.6"/>
        <circle cx="36" cy="35.5" r="0.6" fill="#451A03"/>
        <path d="M22 36.5 H26" stroke="#B45309" stroke-width="0.9" stroke-linecap="round"/>

        <!-- Manivela lateral dourada de dar corda -->
        <path d="M42 34 L46.5 32 L46.5 26.5" fill="none" stroke="#D97706" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="46.5" cy="26" r="1.4" fill="#5A2A12" stroke="#261005" stroke-width="0.5"/>

        <!-- Prato giratório de feltro e aro de latão -->
        <ellipse cx="24" cy="24.5" rx="17.5" ry="4.2" fill="#3D1A08" stroke="#1F0C04" stroke-width="0.9"/>
        <ellipse cx="24" cy="24" rx="16" ry="3.6" fill="#B45309"/>

        <!-- Tubo acústico curvo de latão (ligação do gabinete à corneta) -->
        <path d="M12 24 C9 17, 11 10, 16 6.5" fill="none" stroke="#B45309" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M12 24 C9 17, 11 10, 16 6.5" fill="none" stroke="#FDE68A" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>

        <!-- DISCO DE VINIL GIRATÓRIO (Goma-laca 78 RPM) -->
        <g class="vitrola-disco" style="transform-origin: 24px 23.5px;">
          <!-- Corpo do disco preto -->
          <ellipse cx="24" cy="23.5" rx="14" ry="3.6" fill="#141416" stroke="#000000" stroke-width="0.5"/>
          <!-- Ranhuras concêntricas de som -->
          <ellipse cx="24" cy="23.5" rx="11.8" ry="2.9" fill="none" stroke="#282930" stroke-width="0.6"/>
          <ellipse cx="24" cy="23.5" rx="9.2" ry="2.2" fill="none" stroke="#1D1E22" stroke-width="0.6"/>
          <ellipse cx="24" cy="23.5" rx="6.5" ry="1.6" fill="none" stroke="#282930" stroke-width="0.5"/>
          <!-- Selo clássico vermelho carmim -->
          <ellipse cx="24" cy="23.5" rx="4.5" ry="1.3" fill="#DC2626"/>
          <ellipse cx="24" cy="23.5" rx="2.5" ry="0.7" fill="#FBBF24"/>
          <!-- Pino central de latão -->
          <circle cx="24" cy="23.5" r="0.7" fill="#FEF08A"/>
          <!-- Brilho reflexivo na superfície do vinil -->
          <path d="M14 23.2 Q24 21.8 34 23.2" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.32"/>
        </g>

        <!-- BRAÇO FONOGRÁFICO COM AGULHA (Tonearm) -->
        <circle cx="35.5" cy="22.5" r="1.8" fill="#78350F" stroke="#261005" stroke-width="0.6"/>
        <circle cx="35.5" cy="22.5" r="0.8" fill="#FDE68A"/>
        ${tocando ? `
          <g class="braco-tocando">
            <path d="M35.5 22.5 C33 18.5, 28 18.5, 24.5 21.8" fill="none" stroke="#E2E8F0" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M35.5 22.5 C33 18.5, 28 18.5, 24.5 21.8" fill="none" stroke="#F59E0B" stroke-width="0.5" stroke-linecap="round" opacity="0.6"/>
            <ellipse cx="24.5" cy="21.8" rx="1.2" ry="0.9" fill="#DC2626"/>
            <line x1="24.5" y1="21.8" x2="24" y2="23.2" stroke="#FEF08A" stroke-width="0.8"/>
            <circle cx="24" cy="23.2" r="0.6" fill="#FDE047" opacity="0.9"/>
          </g>
        ` : `
          <g class="braco-repouso">
            <path d="M35.5 22.5 C36.5 19, 37.5 17, 37.5 15" fill="none" stroke="#CBD5E1" stroke-width="1.2" stroke-linecap="round"/>
            <ellipse cx="37.5" cy="14.8" rx="1.1" ry="0.8" fill="#94A3B8"/>
            <line x1="36.2" y1="16.5" x2="38.8" y2="16.5" stroke="#B45309" stroke-width="0.8"/>
          </g>
        `}

        <!-- CORNETA FLORAL DE LATÃO 1930 (Brass Horn / Gramophone Bell) -->
        <path d="M16 6.5 C21 5.5, 26 2, 33 0 C28 5, 24 12, 18 14 Z" fill="#D97706" stroke="#78350F" stroke-width="0.8"/>
        <g class="vitrola-campanula">
          <ellipse cx="29.5" cy="5.5" rx="8.5" ry="6.2" fill="#F59E0B" stroke="#92400E" stroke-width="1" transform="rotate(32 29.5 5.5)"/>
          <ellipse cx="29.5" cy="5.5" rx="5.8" ry="4.2" fill="#92400E" stroke="#451A03" stroke-width="0.7" transform="rotate(32 29.5 5.5)"/>
          <circle cx="29.5" cy="5.5" r="2.2" fill="#3D1A08"/>
          <path d="M24.5 2.5 Q29.5 5.5 34.5 8.5" fill="none" stroke="#FEF3C7" stroke-width="0.75" opacity="0.85"/>
          <path d="M32.5 1.5 Q29.5 5.5 26.5 9.5" fill="none" stroke="#FEF3C7" stroke-width="0.75" opacity="0.85"/>
          <path d="M23 6 Q29.5 5.5 36 5" fill="none" stroke="#FEF3C7" stroke-width="0.6" opacity="0.6"/>
        </g>

        <!-- NOTAS MUSICAIS FLUTUANTES -->
        <g class="vitrola-notas-musicais">
          <text x="36" y="-2" font-size="7.5" fill="#F59E0B" font-family="'Times New Roman', Georgia, serif" class="vitrola-nota n1">♪</text>
          <text x="28" y="-7" font-size="6.5" fill="#FBBF24" font-family="'Times New Roman', Georgia, serif" class="vitrola-nota n2">♫</text>
          <text x="40" y="-10" font-size="5.5" fill="#D97706" font-family="'Times New Roman', Georgia, serif" class="vitrola-nota n3">♩</text>
        </g>
      </g>
    `;
  }

  function renderVitrolaEstudoHTML() {
    const nomes = {
      vinil: "Vitrola 1930",
      chuva: "Chuva",
      lareira: "Lareira",
      binaural: "Alfa 10Hz"
    };
    const ativo = _somAsmrAtivo;
    const nomeAtual = ativo ? nomes[ativo] : "";

    return `
      <div class="vitrola-foco-card">
        <div class="vitrola-foco-cena">
          <div class="vitrola-estudo-palco" data-act="vitrola-tocar" title="Toque para ligar/pausar a Vitrola 1930">
            <svg class="vitrola-estudo-svg" viewBox="0 0 52 48" width="64" height="58">
              ${desenharVitrolaSVG({ tocando: ativo === "vinil", w: 52, h: 48, interativo: false })}
            </svg>
          </div>
          <div class="vitrola-foco-info">
            <div class="vitrola-foco-titulo">
              <span class="badge-vitrola">1930</span>
              <strong>Vitrola Vintage &amp; Paisagens Sonoras</strong>
            </div>
            <div class="vitrola-foco-sub">
              ${ativo ? `<span class="ponto-verde"></span> Tocando: <b>${nomeAtual}</b>` : "Toque na Vitrola para focar com som analógico"}
            </div>
            <div class="vitrola-foco-botoes">
              <button class="chipbtn ${ativo === 'vinil' ? 'ativo' : ''}" data-act="asmr-tocar" data-tipo="vinil">📻 Vinil 1930</button>
              <button class="chipbtn ${ativo === 'chuva' ? 'ativo' : ''}" data-act="asmr-tocar" data-tipo="chuva">🌧️ Chuva</button>
              <button class="chipbtn ${ativo === 'lareira' ? 'ativo' : ''}" data-act="asmr-tocar" data-tipo="lareira">🔥 Lareira</button>
              <button class="chipbtn ${ativo === 'binaural' ? 'ativo' : ''}" data-act="asmr-tocar" data-tipo="binaural">🧠 Alfa 10Hz</button>
              ${ativo ? `<button class="chipbtn parar" data-act="asmr-parar">⏹️ Pausar</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function tocarCliqueAnalogo() {
    const ctx = obterAudioCtx();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(850, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch (_) {}
  }

  /* =================================================================
     04. PILAR 4: CENÁRIO VIVO (Conexão da Vida Real com o Quarto)
     ================================================================= */
  function florzinhasPlantaSVG() {
    return `
      <g class="planta-florida">
        <!-- Florzinhas que brotam no quarto quando você atinge a meta de água -->
        <circle cx="-14" cy="-22" r="2.2" fill="#F43F5E" class="flor-petala"/>
        <circle cx="-14" cy="-22" r="1.0" fill="#FEF08A"/>
        <circle cx="-2" cy="-28" r="2.2" fill="#EC4899" class="flor-petala"/>
        <circle cx="-2" cy="-28" r="1.0" fill="#FEF08A"/>
        <circle cx="14" cy="-20" r="2.2" fill="#F43F5E" class="flor-petala"/>
        <circle cx="14" cy="-20" r="1.0" fill="#FEF08A"/>
      </g>
    `;
  }

  /* =================================================================
     05. REGISTRO DE AÇÕES E EXPORTAÇÃO GLOBAL
     ================================================================= */
  if (typeof window.ACOES_EXTRAS !== "undefined") {
    window.ACOES_EXTRAS["alternar-respiro"] = () => alternarDiaRespiro();
    window.ACOES_EXTRAS["alternar-asmr"] = () => alternarAsmrVintage();
    window.ACOES_EXTRAS["vitrola-tocar"] = () => alternarVitrola1930();
    window.ACOES_EXTRAS["asmr-tocar"] = b => {
      if (b && b.dataset && b.dataset.tipo) tocarAsmrVintage(b.dataset.tipo);
    };
    window.ACOES_EXTRAS["asmr-parar"] = () => pararAsmrVintage();
  }

  // Interceptar cliques em botões para feedback sensorial sutil e ações da Vitrola/ASMR
  if (typeof document !== "undefined") {
    document.addEventListener("click", e => {
      const act = e.target.closest("[data-act]");
      if (act) {
        const a = act.dataset.act;
        if (a === "alternar-asmr") {
          alternarAsmrVintage();
        } else if (a === "vitrola-tocar") {
          alternarVitrola1930();
        } else if (a === "asmr-tocar") {
          const tipo = act.dataset.tipo;
          if (tipo) tocarAsmrVintage(tipo);
        } else if (a === "asmr-parar") {
          pararAsmrVintage();
        } else if (a === "alternar-respiro") {
          alternarDiaRespiro();
        }
      }

      const b = e.target.closest("button, .btn, [role='button'], .tab");
      if (b && !b.classList.contains("sem-clique")) {
        tocarCliqueAnalogo();
      }
    });
  }

  window.isDiaDeRespiro = isDiaDeRespiro;
  window.alternarDiaRespiro = alternarDiaRespiro;
  window.renderBannerRespiroHTML = renderBannerRespiroHTML;
  window.renderCorpoDuploHTML = renderCorpoDuploHTML;
  window.tocarAsmrVintage = tocarAsmrVintage;
  window.pararAsmrVintage = pararAsmrVintage;
  window.alternarAsmrVintage = alternarAsmrVintage;
  window.alternarVitrola1930 = alternarVitrola1930;
  window.obterSomAsmrAtivo = obterSomAsmrAtivo;
  window.desenharVitrolaSVG = desenharVitrolaSVG;
  window.renderVitrolaEstudoHTML = renderVitrolaEstudoHTML;
  window.florzinhasPlantaSVG = florzinhasPlantaSVG;
})();
