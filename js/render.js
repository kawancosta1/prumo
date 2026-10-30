/*
  Desenha a tela atual (render) e posiciona o indicador das abas.
*/
"use strict";

const VIEWS = {
  hoje: viewHoje,
  estudos: viewEstudos,
  dieta: viewDieta,
  social: viewSocial,
  prumi: viewPrumi,
  estante: viewEstante,
  amigos: viewAmigos,
  avisos: viewAvisos,
  ajustes: viewAjustes,
  feedback: viewFeedback,
  admin: () => (typeof viewAdmin === "function" ? viewAdmin() : "")
};

let lastProg = 0,
  indPlaced = false;

function placeInd() {
  const nav = document.getElementById("tabs"),
    ind = document.getElementById("ind"),
    a = nav.querySelector('button[aria-current="page"]');
  if (!a) {
    ind.style.opacity = "0";
    return;
  }
  ind.style.opacity = "1";
  ind.style.width = a.offsetWidth + "px";
  ind.style.height = a.offsetHeight + "px";
  ind.style.transform = `translate(${a.offsetLeft}px,${a.offsetTop}px)`;
  if (!indPlaced) {
    indPlaced = true;
    requestAnimationFrame(() => requestAnimationFrame(() => ind.classList.remove("noanim")));
  }
}

window.addEventListener("resize", () => {
  const ind = document.getElementById("ind");
  ind.classList.add("noanim");
  placeInd();
  requestAnimationFrame(() => ind.classList.remove("noanim"));
});

function render() {
  pendingRender = false;
  document
    .querySelectorAll("#tabs button")
    .forEach(b => b.setAttribute("aria-current", b.dataset.tab === tab ? "page" : "false"));
  document.getElementById("gear").setAttribute("aria-current", tab === "ajustes" ? "page" : "false");
  for (const [id, t] of [
    ["sino", "avisos"],
    ["amigos-bt", "amigos"]
  ]) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-current", tab === t ? "page" : "false");
  }
  if (typeof atualizarSino === "function") atualizarSino();
  placeInd();
  const main = document.getElementById("main");
  main.classList.remove("enter");
  if (fx.enter && !RM) {
    void main.offsetWidth;
    main.classList.add("enter");
    const efeitoMundo = MUNDO_FX[S.persona];
    if (efeitoMundo && efeitoMundo.trocaAba) efeitoMundo.trocaAba(); // ex.: sangue escorrendo no emo
  }
  main.innerHTML = VIEWS[tab]();
  updateMascots(false);
  /* pós-render: barras, números, nível de água, confete */
  const prog = main.querySelector(".progress span");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (prog) {
        prog.style.width = prog.dataset.to + "%";
        lastProg = +prog.dataset.to;
      }
      const wf = main.querySelector(".wfill span");
      if (wf) wf.style.width = wf.dataset.to + "%";
    })
  );
  const wc = document.getElementById("wcount");
  if (wc) countUp(wc, fx.waterFrom != null ? fx.waterFrom : +wc.dataset.to, +wc.dataset.to);
  if (fx.waterFrom != null && !RM) {
    const f0 = lvlFor(Math.min(1, fx.waterFrom / S.waterGoal));
    main.querySelectorAll(".waterg").forEach(g => {
      const to = +g.dataset.lvl;
      if (g.animate)
        g.animate([{ transform: `translate(0px,${f0}px)` }, { transform: `translate(0px,${to}px)` }], {
          duration: 1100,
          easing: "cubic-bezier(.2,.8,.2,1)"
        });
    });
  }
  if (fx.burst) burstAt(fx.burst, fx.burstN || 18);
  if (fx.big) setTimeout(bigConfetti, 120);
  fx = {};
  const cn = document.getElementById("coinsn");
  if (cn) cn.textContent = S.coins;
  renderOnb();
}
