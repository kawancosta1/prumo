/*
  Confete, efeitos pendentes do próximo render (fx) e números que sobem contando.
*/
"use strict";

/* ================= confete ================= */
const fxc = document.getElementById("fxc"),
  fctx = fxc.getContext && fxc.getContext("2d");

let parts = [],
  fxRunning = false;

function confetti(x, y, n = 24, power = 1, spread = Math.PI * 0.9) {
  if (RM || !fctx) return;
  const cs = getComputedStyle(document.documentElement),
    estilo = (MUNDO_FX[S.persona] && MUNDO_FX[S.persona].confete) || null, // confete próprio do mundo
    cols = estilo
      ? estilo.cores
      : ["--accent", "--dieta", "--social", "--water", "--warn"].map(
          v => cs.getPropertyValue(v).trim() || "#2340C4"
        ),
    formas = estilo ? estilo.formas : ["ret", "ret", "redondo"];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * spread,
      v = (3 + Math.random() * 6) * power;
    parts.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      g: 0.16 + Math.random() * 0.1,
      r: Math.random() * 6.3,
      vr: (Math.random() - 0.5) * 0.35,
      w: 4 + Math.random() * 5,
      h: 3 + Math.random() * 4,
      c: cols[i % cols.length],
      life: 0,
      max: 60 + Math.random() * 50,
      forma: formas[Math.floor(Math.random() * formas.length)]
    });
  }
  if (!fxRunning) {
    fxRunning = true;
    requestAnimationFrame(fxLoop);
  }
}

function fxLoop() {
  const dpr = window.devicePixelRatio || 1,
    W = innerWidth,
    H = innerHeight;
  if (fxc.width !== Math.round(W * dpr) || fxc.height !== Math.round(H * dpr)) {
    fxc.width = Math.round(W * dpr);
    fxc.height = Math.round(H * dpr);
  }
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fctx.clearRect(0, 0, W, H);
  parts = parts.filter(p => p.life < p.max && p.y < H + 20);
  for (const p of parts) {
    p.life++;
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    fctx.save();
    fctx.globalAlpha = Math.min(1, (p.max - p.life) / 20);
    fctx.translate(p.x, p.y);
    fctx.rotate(p.r);
    fctx.fillStyle = p.c;
    desenharParticula(p);
    fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop);
  else {
    fxRunning = false;
    fctx.clearRect(0, 0, W, H);
  }
}

/* Formas do confete: "ret" (retângulo), "redondo", "morcego", "gota", "petala", "palheta", "estrela", "raio" e as dos outros mundos */
const FORMAS_CONFETE =
  typeof Path2D === "undefined" // navegadores muito antigos não têm Path2D
    ? {}
    : {
        morcego: new Path2D(
          "M0 -3Q2.5 -8 3.5 -3.5Q9 -8.5 15 -4Q12 0 13 4.5Q9 2 7 5.5Q4 2.5 2 4.5Q1 2.5 0 3.5Q-1 2.5 -2 4.5Q-4 2.5 -7 5.5Q-9 2 -13 4.5Q-12 0 -15 -4Q-9 -8.5 -3.5 -3.5Q-2.5 -8 0 -3Z"
        ),
        gota: new Path2D("M0 -6Q5 0 3.8 3A3.8 3.8 0 0 1 -3.8 3Q-5 0 0 -6Z"),
        petala: new Path2D("M0 -6Q5 -2 0 6Q-5 -2 0 -6Z"),
        palheta: new Path2D("M-5 -4Q0 -6.5 5 -4Q5.4 2 0 7Q-5.4 2 -5 -4Z"),
        estrela: new Path2D(
          "M0 -6L1.8 -1.9L6 -1.6L2.8 1.3L3.7 5.6L0 3.4L-3.7 5.6L-2.8 1.3L-6 -1.6L-1.8 -1.9Z"
        ),
        raio: new Path2D("M2 -7L-4 1H0L-2 7L4 -1H0Z"),
        // usadas pelos outros mundos (js/mundos/<mundo>-extras.js)
        folha: new Path2D("M0 -7Q6 -3 4 3Q2 6 0 7Q-2 6 -4 3Q-6 -3 0 -7Z"),
        nota: new Path2D("M1 -7V3.5A2.6 2.2 0 1 1 -1 1.6V-7H5V-4.5H1Z"),
        coracao: new Path2D("M0 6Q-7 0 -6 -3.5Q-4.5 -7 0 -3.5Q4.5 -7 6 -3.5Q7 0 0 6Z"),
        diamante: new Path2D("M-5 -2L-2.5 -5.5H2.5L5 -2L0 6Z"),
        pixel: new Path2D("M-3.5 -3.5H3.5V3.5H-3.5Z"),
        flor: new Path2D(
          "M0 -6A2.6 2.6 0 0 1 2.4 -1.4A2.6 2.6 0 0 1 5.5 1.6A2.6 2.6 0 0 1 1.5 4.6A2.6 2.6 0 0 1 -1.5 4.6A2.6 2.6 0 0 1 -5.5 1.6A2.6 2.6 0 0 1 -2.4 -1.4A2.6 2.6 0 0 1 0 -6Z"
        ),
        bandeira: new Path2D("M-5 -4H5L0 5Z"),
        moeda: new Path2D(
          "M0 -5A5 5 0 1 1 0 5A5 5 0 1 1 0 -5ZM0 -2.6A2.6 2.6 0 1 0 0 2.6A2.6 2.6 0 1 0 0 -2.6Z"
        )
      };
function desenharParticula(p) {
  if (p.forma === "redondo") {
    fctx.beginPath();
    fctx.arc(0, 0, p.w / 2.4, 0, 6.3);
    fctx.fill();
  } else if (FORMAS_CONFETE[p.forma]) {
    const escala = p.forma === "morcego" ? 0.55 + p.w / 20 : 0.8 + p.w / 12;
    fctx.scale(escala, escala * (p.forma === "morcego" ? Math.abs(Math.cos(p.life / 4)) * 0.7 + 0.3 : 1));
    fctx.fill(FORMAS_CONFETE[p.forma]);
  } else fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life / 6)) + 1);
}

function bigConfetti() {
  confetti(innerWidth * 0.25, innerHeight * 0.45, 60, 1.5, Math.PI * 0.7);
  confetti(innerWidth * 0.75, innerHeight * 0.45, 60, 1.5, Math.PI * 0.7);
}

function burstAt(sel, n = 18) {
  const el = document.querySelector(sel);
  if (!el) return;
  const r = el.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 2, n, 0.75, Math.PI * 1.6);
}

/* efeitos pendentes para o próximo render */
let fx = {};

const CHEERS = [
  "Boa! Uma a menos.",
  "Mandou bem!",
  "Isso aí! Segue o fluxo.",
  "Riscou! Que sensação boa.",
  "Mais uma! Tô orgulhoso.",
  "Feito! Próxima?"
];

function countUp(el, from, to) {
  if (RM || from === to) {
    el.textContent = to.toLocaleString("pt-BR");
    return;
  }
  const t0 = performance.now(),
    d = 800;
  const step = n => {
    const k = Math.min(1, (n - t0) / d),
      e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e).toLocaleString("pt-BR");
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
