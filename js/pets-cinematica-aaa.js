/*
  pets-cinematica-aaa.js - Motor de Cinemática e Interatividade Triple-AAA para os Pets do Prumo
  Implementa:
  - Eye & Head Tracking em tempo real (olhos e cabeça viram suavemente para o cursor/toque)
  - FSM de Idle Fidgets Espontâneos (espirros, sacudidas de orelha e olhares curiosos)
  - Screen Juice ao fazer carinho com partículas físicas (corações e estrelas flutuantes)
  - Ondas de choque dinâmicas de contato no solo
*/
"use strict";

let _eyeTrackingAtivo = true;
let _ultimoFidgetTempo = 0;
let _intervaloFidgetMs = 7000;

function inicializarCinematicaPetsAAA() {
  if (typeof document === "undefined") return;

  iniciarEyeTrackingPets();
  iniciarLoopIdleFidgets();
  iniciarListenerCarinhoAAA();
}

/* ==========================================================================
   01. EYE & HEAD TRACKING (O PET OLHA PARA O USUÁRIO)
   ========================================================================== */

function iniciarEyeTrackingPets() {
  if (typeof document === "undefined") return;

  document.addEventListener("mousemove", e => {
    if (!_eyeTrackingAtivo) return;

    const pets = document.querySelectorAll(".pet-svg:not(.pose-dormindo)");
    pets.forEach(pet => {
      const rect = pet.getBoundingClientRect();
      const petCentroX = rect.left + rect.width / 2;
      const petCentroY = rect.top + rect.height * 0.4;

      const deltaX = e.clientX - petCentroX;
      const deltaY = e.clientY - petCentroY;
      const dist = Math.hypot(deltaX, deltaY);

      // Limitar o deslocamento ocular para permanecer realista e fofo
      const maxDeslocamento = 3.5;
      const angulo = Math.atan2(deltaY, deltaX);
      const intensidade = Math.min(1, dist / 350);

      const olhoX = Math.cos(angulo) * maxDeslocamento * intensidade;
      const olhoY = Math.sin(angulo) * maxDeslocamento * intensidade;

      const olhos = pet.querySelectorAll(".olho, circle[fill='#212121'], circle[fill='#000']");
      olhos.forEach(olho => {
        olho.style.transform = `translate(${olhoX.toFixed(1)}px, ${olhoY.toFixed(1)}px)`;
        olho.style.transition = "transform 0.1s ease-out";
      });

      // Leve inclinação da cabeça acompanhando o olhar (Head tracking)
      const cabeca = pet.querySelector(".cabeca, .pet-corpo");
      if (cabeca && dist < 450) {
        const rotCabeca = Math.max(-6, Math.min(6, (deltaX / 300) * 6));
        cabeca.style.transform = `rotate(${rotCabeca.toFixed(1)}deg)`;
      }
    });
  }, { passive: true });

  // Reset do olhar ao sair da janela
  document.addEventListener("mouseleave", () => {
    document.querySelectorAll(".pet-svg .olho, .pet-svg .pet-corpo").forEach(el => {
      el.style.transform = "";
    });
  });
}

/* ==========================================================================
   02. IDLE FIDGETS ESPONTÂNEOS (MICRO-COMPORTAMENTOS VIVOS)
   ========================================================================== */

function iniciarLoopIdleFidgets() {
  setInterval(() => {
    const pets = document.querySelectorAll(".pet-svg.pose-parado");
    if (!pets.length) return;

    pets.forEach(pet => {
      // Sorteia um micro-comportamento espontâneo
      const sorteio = Math.random();

      if (sorteio < 0.35) {
        // Fidget 1: Piscar duplo rápido
        const olhos = pet.querySelectorAll(".olho");
        olhos.forEach(o => {
          o.style.transform = "scaleY(0.1)";
          setTimeout(() => {
            o.style.transform = "scaleY(1)";
            setTimeout(() => {
              o.style.transform = "scaleY(0.1)";
              setTimeout(() => { o.style.transform = ""; }, 100);
            }, 80);
          }, 90);
        });
      } else if (sorteio < 0.70) {
        // Fidget 2: Sacudida fofa de orelhas
        const orelhas = pet.querySelectorAll(".orelhas, path[d*='M27 12']");
        orelhas.forEach(or => {
          or.style.transition = "transform 0.08s ease";
          or.style.transform = "rotate(-8deg)";
          setTimeout(() => {
            or.style.transform = "rotate(8deg)";
            setTimeout(() => { or.style.transform = ""; }, 90);
          }, 80);
        });
      } else {
        // Fidget 3: Mini-suspiro de contentamento
        pet.style.transition = "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        pet.style.transform = "scale(1.06, 0.94) translateY(1px)";
        setTimeout(() => {
          pet.style.transform = "";
        }, 260);
      }
    });
  }, _intervaloFidgetMs);
}

/* ==========================================================================
   03. SCREEN JUICE: FÍSICA DE CARINHO & IMPACTO
   ========================================================================== */

function iniciarListenerCarinhoAAA() {
  if (typeof document === "undefined") return;

  document.addEventListener("click", e => {
    const petPalco = e.target.closest(".pet-palco, .pet-agente, [data-act='pet-carinho']");
    if (!petPalco) return;

    const x = e.clientX || (petPalco.getBoundingClientRect().left + petPalco.offsetWidth / 2);
    const y = e.clientY || (petPalco.getBoundingClientRect().top + petPalco.offsetHeight / 2);

    gerarParticulasCarinhoAAA(x, y);
    gerarOndaDeChoqueSolo(petPalco);
  });
}

function gerarParticulasCarinhoAAA(origemX, origemY, quantidade = 5) {
  if (typeof document === "undefined") return;

  const icones = ["💖", "✨", "🌟", "🌸", "⭐", "🐾"];

  for (let i = 0; i < quantidade; i++) {
    const el = document.createElement("div");
    el.className = "particula-carinho-aaa";
    el.textContent = icones[Math.floor(Math.random() * icones.length)];

    const dx = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 60;
    el.style.left = `${origemX}px`;
    el.style.top = `${origemY}px`;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--rot", `${rot}deg`);

    document.body.appendChild(el);
    setTimeout(() => { el.remove(); }, 1200);
  }
}

function gerarOndaDeChoqueSolo(container) {
  if (!container) return;
  const onda = document.createElement("div");
  onda.className = "onda-choque-solo-aaa";
  container.appendChild(onda);
  setTimeout(() => { onda.remove(); }, 520);
}

// Inicializacao segura
if (typeof window !== "undefined") {
  window.inicializarCinematicaPetsAAA = inicializarCinematicaPetsAAA;
  window.gerarParticulasCarinhoAAA = gerarParticulasCarinhoAAA;
  window.gerarOndaDeChoqueSolo = gerarOndaDeChoqueSolo;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarCinematicaPetsAAA);
  } else {
    inicializarCinematicaPetsAAA();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    inicializarCinematicaPetsAAA,
    gerarParticulasCarinhoAAA,
    gerarOndaDeChoqueSolo
  };
}
