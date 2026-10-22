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
    cols = ["--accent", "--dieta", "--social", "--water", "--warn"].map(
      v => cs.getPropertyValue(v).trim() || "#2340C4"
    );
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
      round: Math.random() < 0.3
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
    if (p.round) {
      fctx.beginPath();
      fctx.arc(0, 0, p.w / 2.4, 0, 6.3);
      fctx.fill();
    } else fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life / 6)) + 1);
    fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop);
  else {
    fxRunning = false;
    fctx.clearRect(0, 0, W, H);
  }
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
