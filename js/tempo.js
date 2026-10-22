/*
  Relógios: cronômetro de foco e virada do dia.
*/
"use strict";

/* cronômetro: atualiza só o relógio */
setInterval(() => {
  if (!timer.running) return;
  const secs = Math.floor(elapsed() / 1000),
    remain = timer.goal * 60 - secs,
    shown = Math.abs(remain);
  if (remain <= 0 && !timer.beeped) {
    timer.beeped = true;
    saveTimerState();
    beep();
    bigConfetti();
    react("party", "Tempo de foco concluído! Registra quando quiser parar.", 5000);
    toast("Tempo de foco concluído! Registre quando quiser parar.", false, "party");
  }
  const c = document.getElementById("clock");
  if (c) {
    c.textContent = (remain < 0 ? "+" : "") + pad(Math.floor(shown / 60)) + ":" + pad(shown % 60);
    c.classList.toggle("over", remain < 0);
  }
}, 1000);

/* virada do dia e linha do "agora" */
let lastDay = today(),
  lastMin = nowHM();

setInterval(() => {
  const t = today();
  if (t !== lastDay) {
    if (selDay === lastDay) selDay = t;
    lastDay = t;
    softRender();
    return;
  }
  if (marcarNoite()) persist(); // conquista Criatura da noite
  const n = nowHM();
  if (n.slice(0, 4) !== lastMin.slice(0, 4) && tab === "hoje" && !openTask) softRender();
  lastMin = n;
}, 30000);
