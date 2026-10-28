/*
  visual-supremo.js - Motor de Aprimoramento Visual e Renderizacao Dinamica 2.5D do Prumo
  Injeta filtros SVG de profundidade, iluminacao especular, fisica de squash & stretch
  e micro-inclinacao 3D interativa.
*/
"use strict";

const DEFINICOES_SVG_SUPREMAS = `
  <svg id="svg-defs-supremas" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
    <defs>
      <!-- Sombra de contato suave e oclusao de ambiente -->
      <filter id="filtro-sombra-suave" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0, 0, 0, 0.15)" />
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="rgba(0, 0, 0, 0.08)" />
      </filter>

      <!-- Brilho de aura bioluminescente para evolucao e vitoria -->
      <filter id="filtro-brilho-aura" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="
          1 0 0 0 1
          0 1 0 0 0.85
          0 0 1 0 0.3
          0 0 0 1 0" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Gradiente esferico para volume 2.5D dos Mascotes -->
      <radialGradient id="grad-volume-mascote" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.22" />
      </radialGradient>

      <!-- Gradiente dourado foil para acabamento nobre de livros -->
      <linearGradient id="grad-dourado-luxo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37" />
        <stop offset="25%" stop-color="#fff4b8" />
        <stop offset="50%" stop-color="#d4af37" />
        <stop offset="75%" stop-color="#aa7c11" />
        <stop offset="100%" stop-color="#ffd700" />
      </linearGradient>
    </defs>
  </svg>
`;

function inicializarVisualSupremo() {
  if (typeof document === "undefined") return;

  // Injetar os defs SVG caso ainda nao existam
  if (!document.getElementById("svg-defs-supremas")) {
    document.body.insertAdjacentHTML("afterbegin", DEFINICOES_SVG_SUPREMAS);
  }

  // Registrar listeners de inclinacao 3D (tilt) para cartoes e estante
  registrarEfeitoTilt3D();
  aplicarEfeitoSquashNoClique();
}

function registrarEfeitoTilt3D() {
  if (typeof document === "undefined") return;

  document.addEventListener(
    "mousemove",
    e => {
      const alvos = document.querySelectorAll(".card, .mv-cartao-personalidade, .livro-lombada-real");
      alvos.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const centroX = rect.width / 2;
          const centroY = rect.height / 2;
          const rotX = ((y - centroY) / centroY) * -5;
          const rotY = ((x - centroX) / centroX) * 5;
          el.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(0, -4px, 0)`;
        }
      });
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseleave",
    () => {
      const alvos = document.querySelectorAll(".card, .mv-cartao-personalidade, .livro-lombada-real");
      alvos.forEach(el => {
        el.style.transform = "";
      });
    },
    { passive: true }
  );
}

function aplicarEfeitoSquashNoClique() {
  if (typeof document === "undefined") return;

  document.addEventListener("click", e => {
    const pet = e.target.closest(".pet-svg, .prumi, [data-act='pet-carinho']");
    if (!pet) return;

    pet.style.transition = "transform 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    pet.style.transform = "scale(1.22, 0.82)"; // Squash no clique

    setTimeout(() => {
      pet.style.transform = "scale(0.88, 1.18)"; // Stretch de recuperacao
      setTimeout(() => {
        pet.style.transform = "";
      }, 140);
    }, 120);
  });
}

/* ==========================================================================
   05. MASCOT ACTING, RUBBER HOSE 1930S & CHIAROSCURO RIGOROSO
   ========================================================================== */

// 1. Balanço rítmico contínuo estilo anos 1930
function animarBalancoRitmicoMascote(el) {
  if (!el && typeof document !== "undefined") {
    el = document.querySelector(".pet-svg, .prumi, #prumi-mascote");
  }
  if (el && el.classList) {
    el.classList.add("prumi-idle-1930s");
  }
  return { ativo: true, elemento: el };
}

// 2. Olhos expressivos estilo Cuphead / Fleischer 1930s (Pie-Eyes)
function gerarOlhoPieEyeCuphead(tamanho = 32, emocao = "feliz") {
  const tam = Math.max(16, parseInt(tamanho, 10) || 32);
  let arcoSobrancelha = "";
  let deformacaoPupila = "";

  if (emocao === "foco") {
    arcoSobrancelha = `<path d="M4 6 Q16 12 28 8" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    deformacaoPupila = `transform="scale(1, 0.9) translate(0, 2)"`;
  } else if (emocao === "sonolento") {
    arcoSobrancelha = `<path d="M4 14 Q16 18 28 14" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
    deformacaoPupila = `transform="scale(1, 0.6) translate(0, 6)"`;
  } else if (emocao === "celebrando") {
    arcoSobrancelha = `<path d="M4 8 Q16 2 28 6" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    deformacaoPupila = `transform="scale(1.15, 1.15) translate(-2, -2)"`;
  } else {
    // feliz (padrao)
    arcoSobrancelha = `<path d="M5 8 Q16 4 27 7" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
  }

  return `<svg class="pie-eye-svg" width="${tam}" height="${tam}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Olho Cuphead ${emocao}">
    ${arcoSobrancelha}
    <ellipse cx="16" cy="18" rx="12" ry="11" fill="#ffffff" stroke="#1a1a1a" stroke-width="2.5"/>
    <g ${deformacaoPupila}>
      <!-- Pupila com recorte de torta (Pie cut) -->
      <path d="M 16 18 L 24 13 A 8 8 0 1 1 18 10 Z" fill="#1a1a1a"/>
      <!-- Ponto de brilho especular -->
      <circle cx="12" cy="14" r="2.2" fill="#ffffff"/>
    </g>
  </svg>`;
}

// 3. Efeito de poeira e fumaça vintage nos passos/saltos
function criarEfeitoPoeiraPasso(x = 0, y = 0, container = null) {
  if (typeof document === "undefined") return null;
  const pai = container || document.body;
  const puff = document.createElement("div");
  puff.className = "dust-puff-1930s";
  puff.style.left = `${x}px`;
  puff.style.top = `${y}px`;
  puff.innerHTML = `
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="14" r="7" fill="rgba(240, 235, 220, 0.85)"/>
      <circle cx="20" cy="10" r="9" fill="rgba(245, 240, 230, 0.9)"/>
      <circle cx="30" cy="15" r="6" fill="rgba(240, 235, 220, 0.8)"/>
    </svg>
  `;
  pai.appendChild(puff);
  setTimeout(() => {
    if (puff.parentNode) puff.parentNode.removeChild(puff);
  }, 500);
  return puff;
}

// 4. Sombra de contato dinâmica do mascote com oclusão ambiente
function atualizarSombraContatoMascote(alturaPulo = 0, elSombra = null) {
  const h = Math.max(0, Math.min(100, parseInt(alturaPulo, 10) || 0));
  const fator = 1 - h / 100;
  const escalaX = Math.round((0.55 + 0.45 * fator) * 100) / 100;
  const escalaY = Math.round((0.35 + 0.65 * fator) * 100) / 100;
  const opacidade = Math.round((0.15 + 0.7 * fator) * 100) / 100;
  const blurPx = Math.round((8 - 6 * fator) * 10) / 10;

  if (elSombra && elSombra.style) {
    elSombra.style.transform = `scale(${escalaX}, ${escalaY})`;
    elSombra.style.opacity = String(opacidade);
    elSombra.style.filter = `blur(${blurPx}px)`;
  }

  return {
    alturaPulo: h,
    escalaX,
    escalaY,
    opacidade,
    blurPx,
    oclusaoCompleta: h === 0
  };
}

// 5. Sombras solares e lunares circadianas
function calcularSombraCircadiana(hora = 12) {
  const h = typeof hora === "number" ? ((hora % 24) + 24) % 24 : new Date().getHours();
  let matizLuz = "zenite-claro";
  let anguloGraus = 90;
  let deslocamentoX = 0;
  let deslocamentoY = 4;
  let blur = 12;
  let corSombra = "rgba(15, 23, 42, 0.16)";

  if (h >= 6 && h < 11) {
    // Manhã: sol a leste, sombra longa à direita
    matizLuz = "ouro-matinal";
    anguloGraus = 45;
    deslocamentoX = 6;
    deslocamentoY = 8;
    blur = 18;
    corSombra = "rgba(55, 38, 20, 0.13)";
  } else if (h >= 11 && h < 15) {
    // Meio-dia: sol a pino, sombra vertical curta e nítida
    matizLuz = "zenite-claro";
    anguloGraus = 90;
    deslocamentoX = 0;
    deslocamentoY = 4;
    blur = 10;
    corSombra = "rgba(15, 23, 42, 0.18)";
  } else if (h >= 15 && h < 19) {
    // Tarde/Entardecer: sol poente a oeste, sombra longa à esquerda
    matizLuz = "crepusculo-ambar";
    anguloGraus = 135;
    deslocamentoX = -6;
    deslocamentoY = 9;
    blur = 20;
    corSombra = "rgba(75, 25, 20, 0.15)";
  } else {
    // Noite: luar difuso azulado
    matizLuz = "luar-azul";
    anguloGraus = -90;
    deslocamentoX = 0;
    deslocamentoY = 6;
    blur = 24;
    corSombra = "rgba(0, 0, 0, 0.52)";
  }

  const cssBoxShadow = `${deslocamentoX}px ${deslocamentoY}px ${blur}px ${corSombra}`;
  return {
    hora: h,
    matizLuz,
    anguloGraus,
    deslocamentoX,
    deslocamentoY,
    blur,
    corSombra,
    cssBoxShadow
  };
}

// 6. Rim light especular para o modo escuro
function aplicarRimLightDark(elemento = null) {
  const css =
    "0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 8px 24px rgba(0, 0, 0, 0.55)";
  if (elemento && elemento.style) {
    elemento.style.boxShadow = css;
    if (elemento.classList) elemento.classList.add("chiaroscuro-rim-light");
  }
  return { css, aplicado: Boolean(elemento) };
}

// 7. Níveis de elevação tátil com dupla camada de profundidade
function calcularNivelElevacaoChiaroscuro(nivel = 1, modoEscuro = false) {
  const n = Math.max(1, Math.min(4, parseInt(nivel, 10) || 1));
  const niveisClaro = {
    1: {
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.05)",
      superficieBg: "#ffffff",
      elevacaoPx: 2
    },
    2: {
      boxShadow: "0 2px 4px rgba(15, 23, 42, 0.09), 0 10px 24px rgba(15, 23, 42, 0.08)",
      superficieBg: "#ffffff",
      elevacaoPx: 6
    },
    3: {
      boxShadow: "0 4px 6px rgba(15, 23, 42, 0.10), 0 16px 36px rgba(15, 23, 42, 0.11)",
      superficieBg: "#ffffff",
      elevacaoPx: 12
    },
    4: {
      boxShadow: "0 8px 12px rgba(15, 23, 42, 0.12), 0 32px 64px rgba(15, 23, 42, 0.16)",
      superficieBg: "#ffffff",
      elevacaoPx: 24
    }
  };
  const niveisEscuro = {
    1: {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 14px rgba(0, 0, 0, 0.45)",
      superficieBg: "#1a1727",
      elevacaoPx: 2
    },
    2: {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.09), 0 8px 26px rgba(0, 0, 0, 0.60)",
      superficieBg: "#211d33",
      elevacaoPx: 6
    },
    3: {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12), 0 16px 40px rgba(0, 0, 0, 0.72)",
      superficieBg: "#29243f",
      elevacaoPx: 12
    },
    4: {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.16), 0 28px 60px rgba(0, 0, 0, 0.85)",
      superficieBg: "#322b4d",
      elevacaoPx: 24
    }
  };

  const info = modoEscuro ? niveisEscuro[n] : niveisClaro[n];
  return {
    nivel: n,
    modoEscuro: Boolean(modoEscuro),
    boxShadow: info.boxShadow,
    superficieBg: info.superficieBg,
    elevacaoPx: info.elevacaoPx
  };
}

// 8. Transição cinematográfica Iris-In / Iris-Out dos desenhos anos 1930
function executarTransicaoIris(origemX = 0, origemY = 0, duracaoMs = 400, onMeio = null) {
  return new Promise(resolve => {
    if (typeof document === "undefined") {
      if (typeof onMeio === "function") onMeio();
      resolve();
      return;
    }

    const wipe = document.createElement("div");
    wipe.className = "iris-wipe-1930s";
    const x = origemX || (window.innerWidth ? window.innerWidth / 2 : 200);
    const y = origemY || (window.innerHeight ? window.innerHeight / 2 : 300);
    wipe.style.setProperty("--iris-x", `${x}px`);
    wipe.style.setProperty("--iris-y", `${y}px`);
    document.body.appendChild(wipe);

    // Fechar iris (Iris-In)
    requestAnimationFrame(() => {
      wipe.classList.add("fechando");
    });

    const meioTempo = Math.max(50, Math.floor(duracaoMs / 2));
    setTimeout(() => {
      if (typeof onMeio === "function") {
        try {
          onMeio();
        } catch (e) {}
      }
      // Reabrir iris (Iris-Out)
      wipe.classList.remove("fechando");
      setTimeout(() => {
        if (wipe.parentNode) wipe.parentNode.removeChild(wipe);
        resolve();
      }, meioTempo);
    }, meioTempo);
  });
}

// 9. Impacto de carimbo de conquista com recuo elástico e squash
function animarCarimboSeloConquista(el) {
  if (el && el.classList) {
    el.classList.remove("carimbo-conquista-animado");
    void el.offsetWidth; // Força reflow
    el.classList.add("carimbo-conquista-animado");
  }
  return { elemento: el, animado: true };
}

// 10. Odômetro numérico com antecipação (micro-afundamento antes do salto)
function animarContadorOdometroAntecipado(el, valorInicial = 0, valorFinal = 10, duracaoMs = 300) {
  const vIni = parseInt(valorInicial, 10) || 0;
  const vFim = parseInt(valorFinal, 10) || 0;
  if (el) {
    el.textContent = String(vFim);
    if (el.style) {
      el.style.transition = "transform 0.08s ease-in";
      el.style.transform = "translateY(2px) scale(0.96)";
      setTimeout(() => {
        el.style.transition = "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)";
        el.style.transform = "translateY(0) scale(1)";
      }, 90);
    }
  }
  return { valorInicial: vIni, valorFinal: vFim, duracaoMs, concluido: true };
}

// 11. Feedback tátil com estalo elástico nos botões
function aplicarEstaloElasticoBotao(el) {
  if (el && el.style) {
    el.style.transition = "transform 0.06s ease-in";
    el.style.transform = "scale(0.93)";
    setTimeout(() => {
      el.style.transition = "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "scale(1)";
    }, 70);
  }
  return { ativo: true, elemento: el };
}

// Executar ao carregar a página
if (typeof window !== "undefined") {
  window.inicializarVisualSupremo = inicializarVisualSupremo;
  window.animarBalancoRitmicoMascote = animarBalancoRitmicoMascote;
  window.gerarOlhoPieEyeCuphead = gerarOlhoPieEyeCuphead;
  window.criarEfeitoPoeiraPasso = criarEfeitoPoeiraPasso;
  window.atualizarSombraContatoMascote = atualizarSombraContatoMascote;
  window.calcularSombraCircadiana = calcularSombraCircadiana;
  window.aplicarRimLightDark = aplicarRimLightDark;
  window.calcularNivelElevacaoChiaroscuro = calcularNivelElevacaoChiaroscuro;
  window.executarTransicaoIris = executarTransicaoIris;
  window.animarCarimboSeloConquista = animarCarimboSeloConquista;
  window.animarContadorOdometroAntecipado = animarContadorOdometroAntecipado;
  window.aplicarEstaloElasticoBotao = aplicarEstaloElasticoBotao;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarVisualSupremo);
  } else {
    inicializarVisualSupremo();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEFINICOES_SVG_SUPREMAS,
    inicializarVisualSupremo,
    registrarEfeitoTilt3D,
    aplicarEfeitoSquashNoClique,
    animarBalancoRitmicoMascote,
    gerarOlhoPieEyeCuphead,
    criarEfeitoPoeiraPasso,
    atualizarSombraContatoMascote,
    calcularSombraCircadiana,
    aplicarRimLightDark,
    calcularNivelElevacaoChiaroscuro,
    executarTransicaoIris,
    animarCarimboSeloConquista,
    animarContadorOdometroAntecipado,
    aplicarEstaloElasticoBotao
  };
}
