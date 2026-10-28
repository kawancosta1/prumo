/*
  Boas-vindas (primeira vez que abre).
*/
"use strict";

/* ---------- boas-vindas ---------- */
let onb = { step: 0, name: "", gender: "m", calendar: "google", persona: "zen" },
  onbShown = false,
  appReady = false;

function onbHTML() {
  const s = onb.step,
    dots = `<div class="odots">${[0, 1, 2, 3].map(i => `<i class="${i === s ? "on" : i < s ? "done" : ""}"></i>`).join("")}</div>`;
  const pe = PERSONAS[onb.persona],
    e2 = {};
  pe.starter.forEach(i => (e2[ITEM[i].slot] = i));
  let c = "";
  if (s === 0)
    c = `<div class="ohero">${prumi({ mood: "happy", size: 140, eq: {}, gender: onb.gender })}</div>
    <h2 class="oh">Oi! Eu sou o Prumi.</h2><p class="op">Vou te ajudar a organizar estudos, água, hábitos e vida social. Cada meta cumprida me dá gotas pra comprar roupinhas novas.</p>
    <label class="ofield"><span class="label">Como posso te chamar?</span><input id="onb-name" type="text" value="${esc(onb.name)}" maxlength="30" autocomplete="off" placeholder="Seu nome"></label>
    <div class="ofield"><span class="label">Como prefere que eu fale com você?</span>
      <div class="ogender">
        <button type="button" class="ogbtn ${onb.gender === "m" ? "on" : ""}" data-act="onbgender" data-g="m"><b>Masculino</b><span>ele / dele</span></button>
        <button type="button" class="ogbtn ${onb.gender === "f" ? "on" : ""}" data-act="onbgender" data-g="f"><b>Feminino</b><span>ela / dela</span></button>
        <button type="button" class="ogbtn ${onb.gender === "n" ? "on" : ""}" data-act="onbgender" data-g="n"><b>Neutro</b><span>elu / neutro</span></button>
      </div>
    </div>
    <button class="btn primary big" data-act="onbnext">Continuar</button>`;
  else if (s === 1)
    c = `<h2 class="oh">Qual agenda você usa?</h2><p class="op">É onde os lembretes vão aparecer, com alarme no celular.</p>
    <div class="ocal">${[
      ["google", "Google Agenda", "Um toque abre o evento já preenchido. Funciona no Android, iPhone e PC."],
      [
        "samsung",
        "Samsung Calendar",
        "Baixa um arquivo com o lembrete e alarme, que o Samsung Calendar importa. Se sua conta Google já aparece no Samsung Calendar, escolher Google é mais rápido."
      ],
      [
        "apple",
        "Calendário da Apple",
        "Baixa um arquivo com lembrete e alarme que o iPhone e o Mac adicionam ao Calendário."
      ]
    ]
      .map(
        ([k, t, d]) =>
          `<button class="ocard ${onb.calendar === k ? "on" : ""}" data-act="onbcal" data-c="${k}"><b>${t}</b><span>${d}</span></button>`
      )
      .join("")}</div>
    <p class="note">Seus dados ficam salvos na sua conta e aparecem igual no celular e no computador. Dá pra trocar a agenda depois em Ajustes.</p>
    <div class="row"><button class="btn ghost" data-act="onbback">Voltar</button><button class="btn primary big" data-act="onbnext" style="flex:1">Continuar</button></div>`;
  else if (s === 2)
    c = `<h2 class="oh">Escolha meu jeito</h2><p class="op">Cada personalidade é um mundo: cores, água, jeito de falar e itens próprios. Dá pra trocar depois.</p>
    <div class="opreview">${prumi({ mood: "happy", size: 96, eq: e2, fill: 0.55, p: onb.persona, gender: onb.gender })}<div class="bubble">${say.call(null, "hi", { n: 3 }).replace("{nome}", "")}</div></div>
    <div class="ogrid">${Object.entries(PERSONAS)
      .map(([k, p]) => {
        const e3 = {};
        p.starter.forEach(i => (e3[ITEM[i].slot] = i));
        const t = TH(k),
          c = isDark() ? t.D : t.L;
        return `<button class="opers ${onb.persona === k ? "on" : ""}" data-act="onbpers" data-p="${k}" style="--pa:${c[3]};--pw:${c[4]}">${prumi({ mood: "idle", size: 46, eq: e3, p: k })}<span style="font-family:${esc(t.font)},sans-serif;font-size:${Math.round(13 * Math.min(1.1, t.ds))}px">${p.name}</span><i class="pw"></i></button>`;
      })
      .join("")}</div>
    <div class="row"><button class="btn ghost" data-act="onbback">Voltar</button><button class="btn primary big" data-act="onbnext" style="flex:1">Quero esse</button></div>`;
  else
    c = `<div class="ohero">${prumi({ mood: "party", size: 140, eq: e2, fill: 0.7, p: onb.persona, gender: onb.gender })}</div><h2 class="oh">Tudo pronto${onb.name ? ", " + esc(onb.name) : ""}!</h2>
    <p class="op">Você ganhou <b>50 gotas</b> de boas-vindas. Cumpra metas, junte gotas e monte o meu visual na aba <b>Prumi</b>. Minha água agora é <b>${esc(waterOf(onb.persona).name.toLowerCase())}</b>.</p>
    <button class="btn primary big" data-act="onbdone">Começar</button>`;
  return `<div class="osheet">${dots}<div class="ostep" key="${s}">${c}</div></div>`;
}

function renderOnb() {
  const el = document.getElementById("onb");
  // Tela de entrada (Google ou email) vem antes de tudo: js/telas/entrar.js
  if (appReady && typeof precisaEntrar === "function" && precisaEntrar()) return mostrarEntrar(el);
  entrarDesenhado = "";
  el.setAttribute("aria-label", "Boas-vindas");

  // Se o usuário já possui dados ou conta ativa com histórico, o personagem já existe: não força onboarding
  if (
    !S.onboarded &&
    (hasData() ||
      (typeof contaUsuario !== "undefined" &&
        contaUsuario &&
        (S.xp > 0 || S.coins > 0 || (S.tasks && S.tasks.length > 0))))
  ) {
    S.onboarded = true;
    persist(true);
  }

  if (S.onboarded || !appReady) {
    if (!el.hidden) {
      el.classList.add("out");
      setTimeout(() => {
        el.hidden = true;
        el.classList.remove("out");
      }, 350);
    }
    return;
  }
  if (!onbShown) {
    onbShown = true;
    onb.name = S.name || "";
    onb.gender = S.gender || "m";
    onb.calendar = S.calendar || "google";
    onb.persona = S.persona || "zen";
  }
  el.hidden = false;
  /* preview da personalidade usa a escolhida no rascunho */
  const prev = S.persona;
  S.persona = onb.persona;
  el.innerHTML = onbHTML();
  S.persona = prev;
}
