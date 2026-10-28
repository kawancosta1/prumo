/* ===================================================================
   pets-cuphead-shaders.js - Motor de Animacao e Shaders Estilo Cuphead (1930s)
   - Shaders SVG de celuloide e nanquim hand-drawn (feTurbulence)
   - Animacao Rubber Hose (Squash & Stretch, Fleischer 120 BPM Bounce)
   - Brincadeira da Bolinha Quicante com Fisica de Gravidade
   - Sintetizador WebAudio Vintage Honky-Tonk / Ragtime
   =================================================================== */
"use strict";

(function () {
  let _audioCtxVintage = null;
  let _bolinhaAtiva = null;

  function obterAudioVintage() {
    if (!_audioCtxVintage && typeof AudioContext !== "undefined") {
      try {
        _audioCtxVintage = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) {}
    }
    if (_audioCtxVintage && _audioCtxVintage.state === "suspended") {
      _audioCtxVintage.resume().catch(() => {});
    }
    return _audioCtxVintage;
  }

  /* 01. Sons Procedurais Estilo Ragtime / Cartoon 1930s */
  function tocarSomCuphead(tipo = "boing") {
    const ctx = obterAudioVintage();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Filtro analógico passa-baixa para aquecer o som estilo vitrola vintage
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    if (tipo === "boing") {
      // Efeito clássico de mola elástica cartoon
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(540, t + 0.18);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.32);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      osc.start(t);
      osc.stop(t + 0.36);
    } else if (tipo === "ragtime-acorde") {
      // Acorde alegre de piano honky-tonk dos anos 1930
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(f, t + idx * 0.04);
        g.gain.setValueAtTime(0.08, t + idx * 0.04);
        g.gain.exponentialRampToValueAtTime(0.005, t + 0.4 + idx * 0.04);
        o.connect(filter);
        o.start(t + idx * 0.04);
        o.stop(t + 0.42 + idx * 0.04);
      });
    } else if (tipo === "pega-bolinha") {
      // Efeito triunfante de fanfarra cômica
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(554.37, t + 0.08);
      osc.frequency.setValueAtTime(659.25, t + 0.16);
      osc.frequency.setValueAtTime(880, t + 0.24);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

      osc.start(t);
      osc.stop(t + 0.46);
    }
  }

  /* 02. Injetar Shaders SVG Globais no Documento */
  function injetarShadersSvgCuphead() {
    if (document.getElementById("cuphead-shaders-svg")) return;

    const svgContainer = document.createElement("div");
    svgContainer.id = "cuphead-shaders-svg";
    svgContainer.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
    svgContainer.innerHTML = `
      <svg aria-hidden="true" width="0" height="0">
        <defs>
          <!-- Tremor 1 de Nanquim Hand-Drawn 1930s -->
          <filter id="cuphead-ink-filter-1" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" result="noise1"/>
            <feDisplacementMap in="SourceGraphic" in2="noise1" scale="1.1" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <!-- Tremor 2 de Nanquim Hand-Drawn 1930s -->
          <filter id="cuphead-ink-filter-2" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06 0.05" numOctaves="2" result="noise2"/>
            <feDisplacementMap in="SourceGraphic" in2="noise2" scale="1.0" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <!-- Tremor 3 de Nanquim Hand-Drawn 1930s -->
          <filter id="cuphead-ink-filter-3" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="2" result="noise3"/>
            <feDisplacementMap in="SourceGraphic" in2="noise3" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <!-- Shader de Retícula Chiaroscuro Vintage -->
          <filter id="cuphead-halftone" x="0%" y="0%" width="100%" height="100%">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>
    `;
    document.body.appendChild(svgContainer);
  }

  /* 03. Efeitos de Partículas Cartoon: Poeira e Estrelas 1930s */
  function soltarPoeiraCuphead(x, y, dir = 1) {
    for (let i = 0; i < 3; i++) {
      const puff = document.createElement("div");
      puff.className = "cuphead-dust-cloud";
      puff.style.left = `${x - 10 + (Math.random() * 8 - 4)}px`;
      puff.style.top = `${y - 12 + (Math.random() * 6 - 3)}px`;
      puff.style.setProperty("--dx", `${-dir * (10 + i * 6)}px`);
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 450);
    }
  }

  function soltarEstrelasCuphead(x, y) {
    const estrelas = ["⭐", "✨", "💫", "🌟"];
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("div");
      star.className = "cuphead-star-burst";
      star.textContent = estrelas[i % estrelas.length];
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      const angulo = (i / 5) * Math.PI * 2;
      const dist = 30 + Math.random() * 20;
      star.style.setProperty("--tx", `${Math.cos(angulo) * dist}px`);
      star.style.setProperty("--ty", `${Math.sin(angulo) * dist}px`);
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 550);
    }
  }

  /* 04. Brincadeira da Bolinha Quicante (Fetch Ball Physics) */
  function jogarBolinhaParaPet(agenteAlvo) {
    if (_bolinhaAtiva) return;

    tocarSomCuphead("boing");
    const bolinha = document.createElement("div");
    bolinha.className = "cuphead-toy-ball";
    document.body.appendChild(bolinha);
    _bolinhaAtiva = bolinha;

    // Posição inicial: centro da tela
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight * 0.4;
    let velX = (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 4);
    let velY = -8;
    const gravidade = 0.65;
    const amortecimento = 0.72;
    const chao = (typeof chaoPasseio === "function" ? chaoPasseio() : window.innerHeight - 70) + 20;

    let animId = null;

    function atualizarFisica() {
      velY += gravidade;
      posX += velX;
      posY += velY;

      // Colisão com as laterais da tela
      if (posX <= 20 || posX >= window.innerWidth - 44) {
        velX = -velX * amortecimento;
        posX = Math.max(20, Math.min(window.innerWidth - 44, posX));
      }

      // Colisão com o solo (quique elástico)
      if (posY >= chao) {
        posY = chao;
        velY = -velY * amortecimento;
        velX *= 0.88;
        if (Math.abs(velY) > 2) {
          soltarPoeiraCuphead(posX + 12, posY + 16, Math.sign(velX) || 1);
        }
      }

      bolinha.style.transform = `translate3d(${Math.round(posX)}px, ${Math.round(posY)}px, 0)`;

      // Quando a bolinha estabiliza, o pet corre atrás dela
      if (Math.abs(velY) < 0.8 && posY >= chao - 2) {
        cancelAnimationFrame(animId);
        fazerPetBuscarBolinha(agenteAlvo, posX, posY, bolinha);
        return;
      }

      animId = requestAnimationFrame(atualizarFisica);
    }

    animId = requestAnimationFrame(atualizarFisica);
  }

  function fazerPetBuscarBolinha(agente, destX, destY, bolinhaEl) {
    if (!agente || typeof andarAte !== "function") {
      setTimeout(() => { bolinhaEl.remove(); _bolinhaAtiva = null; }, 1500);
      return;
    }

    // O pet dá uma reação de susto/alegria de desenho dos anos 30
    if (typeof desenharAgente === "function") {
      desenharAgente(agente, "feliz");
    }
    tocarSomCuphead("boing");

    setTimeout(() => {
      // Pet corre rápido até a bolinha
      andarAte(agente, Math.max(10, destX - 16), destY - 14, () => {
        // Pet pegou a bolinha!
        tocarSomCuphead("pega-bolinha");
        soltarEstrelasCuphead(destX + 12, destY);

        if (agente.el) {
          agente.el.classList.add("cambalhota-cuphead");
          setTimeout(() => agente.el.classList.remove("cambalhota-cuphead"), 650);
        }

        if (typeof reagir === "function") {
          reagir(agente, "feliz", 2500);
        }

        bolinhaEl.remove();
        _bolinhaAtiva = null;
      }, { pose: "correndo", dur: 0.8 });
    }, 250);
  }

  /* 05. Aprimorar Agentes Existentes com Sombras e Badges de Interação */
  function aprimorarAgenteCuphead(agente) {
    if (!agente || !agente.el || agente._cupheadInit) return;
    agente._cupheadInit = true;

    // Adicionar sombra oval clássica estilo desenho animado
    if (!agente.el.querySelector(".cuphead-ground-shadow")) {
      const sombra = document.createElement("div");
      sombra.className = "cuphead-ground-shadow";
      agente.el.appendChild(sombra);
    }

    // Adicionar badge fofo de interação "Brincar"
    if (!agente.el.querySelector(".cuphead-pet-play-badge")) {
      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "cuphead-pet-play-badge";
      badge.textContent = "⚾ Brincar!";
      badge.setAttribute("aria-label", "Jogar bolinha para o pet");

      badge.addEventListener("click", e => {
        e.stopPropagation();
        jogarBolinhaParaPet(agente);
      });

      agente.el.appendChild(badge);
    }

    // Truque da cambalhota em duplo clique no próprio pet
    agente.el.addEventListener("dblclick", e => {
      e.stopPropagation();
      tocarSomCuphead("ragtime-acorde");
      agente.el.classList.add("cambalhota-cuphead");
      soltarEstrelasCuphead(agente.x + 26, agente.y);
      setTimeout(() => agente.el.classList.remove("cambalhota-cuphead"), 650);
    });

    // Detectar virada de direção para emitir poeirinha e spin elástico
    let dirAnterior = agente.dir || 1;
    setInterval(() => {
      if (agente.dir !== dirAnterior) {
        dirAnterior = agente.dir;
        agente.el.classList.add("girando-elastico");
        soltarPoeiraCuphead(agente.x + 24, agente.y + 44, agente.dir);
        setTimeout(() => agente.el.classList.remove("girando-elastico"), 380);
      }
    }, 150);
  }

  /* 06. Loop de Varredura e Ativação Contínua */
  function iniciarMotorCuphead() {
    injetarShadersSvgCuphead();

    setInterval(() => {
      if (typeof passeio !== "undefined" && passeio.agentes) {
        passeio.agentes.forEach(agente => {
          aprimorarAgenteCuphead(agente);
        });
      }
    }, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarMotorCuphead);
  } else {
    iniciarMotorCuphead();
  }

  // Exportar funções para escopo global
  window.jogarBolinhaParaPet = jogarBolinhaParaPet;
  window.tocarSomCuphead = tocarSomCuphead;
  window.soltarEstrelasCuphead = soltarEstrelasCuphead;
  window.soltarPoeiraCuphead = soltarPoeiraCuphead;
})();
