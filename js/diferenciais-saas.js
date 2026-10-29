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

  function obterAudioCtx() {
    if (typeof obterAudioContext === "function") return obterAudioContext();
    if (!window._asmrCtx && typeof AudioContext !== "undefined") {
      window._asmrCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window._asmrCtx;
  }

  function pararAsmrVintage() {
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
      // 1. Chiado quente de vinil analógico (Filtro passa-faixa em ruído suave)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Ruído filtrado com estalos aleatórios periódicos (crackle de agulha)
        const estalo = Math.random() < 0.0004 ? (Math.random() * 2 - 1) * 3 : 0;
        data[i] = (Math.random() * 2 - 1) * 0.05 + estalo;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.value = 0.28;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      _nosAsmr.push(noise, filter, gain);

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
  }

  // Interceptar cliques em botões para feedback sensorial sutil de clique retrô
  if (typeof document !== "undefined") {
    document.addEventListener("click", e => {
      const b = e.target.closest("button, .btn, [role='button'], .tab");
      if (b && !b.classList.contains("sem-clique")) {
        tocarCliqueAnalogo();
      }
    }, { passive: true });
  }

  window.isDiaDeRespiro = isDiaDeRespiro;
  window.alternarDiaRespiro = alternarDiaRespiro;
  window.renderBannerRespiroHTML = renderBannerRespiroHTML;
  window.renderCorpoDuploHTML = renderCorpoDuploHTML;
  window.tocarAsmrVintage = tocarAsmrVintage;
  window.pararAsmrVintage = pararAsmrVintage;
  window.alternarAsmrVintage = alternarAsmrVintage;
  window.florzinhasPlantaSVG = florzinhasPlantaSVG;
})();
