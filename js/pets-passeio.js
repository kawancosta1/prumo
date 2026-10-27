/*
  Passeio dos pets pelas páginas (dados e desenho em js/pets.js).
  Cada pet é um "agente" numa camada fixa por cima do app:
  - anda pela beirada de baixo da tela, senta, deita, sobe em cima dos cards e segue onde você toca;
  - dorme no horário de dormir (com balão de sonho), deita do lado do cronômetro no foco
    e bate na tela se você sair no meio; na Estante fica "lendo" do lado;
  - pula quando você conclui tarefa, dança quando bate a meta de água, comemora conquistas;
  - pede atenção quando você fica muito tempo sem beber água e traz na boca uma tarefa esquecida;
  - brinca de bolinha, de esconde-esconde (se esconde em outra aba) e encontra os outros pets;
  - de vez em quando o pet de um amigo vem visitar;
  - dá pra arrastar (ele fica pendurado e cai no chão ou em cima de um card) e segurar parado pra ele ronronar;
  - come no potinho quando você dá comida; boceja, se espreguiça e pisca;
  - cada espécie tem seu jeito: vaca pasta e toca o sininho, boi sai correndo, coala se pendura nos cards e dorme muito.
  Ao rolar a página, quem estava em cima de um card desce pro chão (não fica "grudado" no card subindo junto).
  Respeita "Passear pelas páginas" (Ajustes do pet) e prefers-reduced-motion (fica parado num canto).
*/
"use strict";

const passeio = { agentes: new Map(), camada: null, timer: null, visita: null };
const PET_TAM = 52;

function camadaPasseio() {
  if (passeio.camada && document.body.contains(passeio.camada)) return passeio.camada;
  const c = document.createElement("div");
  c.id = "pets-passeio";
  c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  passeio.camada = c;
  return c;
}
/** Linha do "chão": logo acima da barra de abas. */
function chaoPasseio() {
  const tabs = document.getElementById("tabs");
  const topo = tabs ? tabs.getBoundingClientRect().top : innerHeight;
  return Math.max(120, Math.min(innerHeight, topo) - PET_TAM * 0.82);
}
const larguraTela = () => document.documentElement.clientWidth || innerWidth;

/* ---------- agente ---------- */
function criarAgente(pet, visitante) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "pet-agente";
  el.dataset.pet = pet.id || "visita";
  el.setAttribute(
    "aria-label",
    visitante ? `Pet de ${pet.dono} visitando` : `${pet.nome}, toque pra fazer carinho`
  );
  el.tabIndex = -1;
  const a = {
    pet,
    el,
    x: 20 + Math.random() * (larguraTela() - 100),
    y: chaoPasseio(),
    dir: 1,
    pose: "parado",
    ancora: null,
    ocupadoAte: 0,
    visitante: !!visitante
  };
  el.addEventListener("click", ev => {
    ev.stopPropagation();
    tocarAgente(a);
  });
  ligarArraste(a);
  camadaPasseio().appendChild(el);
  desenharAgente(a);
  posicionar(a, false);
  return a;
}
function desenharAgente(a, pose = a.pose) {
  a.pose = pose;
  a.el.innerHTML =
    petSVG(a.pet, { pose, tam: PET_TAM, visitante: a.visitante }) +
    (a.balao ? `<span class="pet-balao">${a.balao}</span>` : "") +
    (a.carrega ? `<span class="pet-carrega" title="${esc(a.carrega)}"></span>` : "") +
    (a.fala ? `<span class="pet-fala ${a.x > larguraTela() - 170 ? "esq" : ""}">${esc(a.fala)}</span>` : "");
  a.el.classList.toggle("vira", a.dir < 0);
}
function posicionar(a, animar = true, dur = 0) {
  a.el.style.transition = animar ? `transform ${dur.toFixed(2)}s linear` : "none";
  a.el.style.transform = `translate(${Math.round(a.x)}px, ${Math.round(a.y)}px)`;
}
function andarAte(a, x, y = chaoPasseio(), depois, op = {}) {
  if (RM) {
    a.x = x;
    a.y = y;
    posicionar(a, false);
    return depois && depois();
  }
  const pers = PERSONALIDADES_PET[a.pet.personalidade] || PERSONALIDADES_PET.curioso;
  const vel = 60 * pers.vel * (op.vel || 1) * (tristinho(a.pet) ? 0.5 : 1); // px por segundo
  const dist = Math.hypot(x - a.x, y - a.y);
  const dur = Math.max(0.3, dist / vel);
  a.dir = x >= a.x ? 1 : -1;
  desenharAgente(a, op.pose || "andando");
  a.x = x;
  a.y = y;
  posicionar(a, true, dur);
  clearTimeout(a.fimAndar);
  a.fimAndar = setTimeout(() => {
    desenharAgente(a, "parado");
    if (depois) depois();
  }, dur * 1000);
  a.ocupadoAte = Date.now() + dur * 1000;
}
function reagir(a, pose, ms = 1600) {
  clearTimeout(a.fimReacao);
  desenharAgente(a, pose);
  a.ocupadoAte = Date.now() + ms;
  a.fimReacao = setTimeout(() => desenharAgente(a, "parado"), ms);
}

/** Um card visível pra subir em cima (o topo dele vira o chão do pet). */
let ultimoScroll = 0;
const rolouAgora = () => Date.now() - ultimoScroll < 2500;
function cardParaSubir() {
  const cards = [...document.querySelectorAll("#main .block, #main .item, #main .cartao-mundo")].filter(
    el => {
      const r = el.getBoundingClientRect();
      return r.top > 70 && r.top < chaoPasseio() - 60 && r.width > 120;
    }
  );
  return cards.length ? cards[Math.floor(Math.random() * cards.length)] : null;
}
function podeSubirEmCards(pet) {
  if (!pet || !pet.especie) return false;
  // Animais pesados e terrestres (vaca, boi, cachorro, etc.) NUNCA sobem no meio da tela
  return ['papagaio', 'coruja', 'gato', 'coala'].includes(pet.especie);
}

function subirNoCard(a) {
  if (!podeSubirEmCards(a.pet)) return false;
  const card = cardParaSubir();
  if (!card) return false;
  const r0 = card.getBoundingClientRect();
  const dx = Math.max(0, Math.min(r0.width - PET_TAM, Math.random() * (r0.width - PET_TAM)));
  andarAte(a, a.x, chaoPasseio(), () => {
    // pulo até o card (posição medida de novo: a página pode ter rolado no caminho)
    const r = card.getBoundingClientRect();
    if (rolouAgora() || !document.body.contains(card) || r.top < 70 || r.top > chaoPasseio() - 60) return;
    a.ancora = { el: card, dx };
    a.x = r.left + dx;
    a.y = r.top - PET_TAM * 0.8;
    desenharAgente(a, "pulando");
    posicionar(a, true, 0.45);
    setTimeout(() => desenharAgente(a, Math.random() < 0.5 ? "sentado" : "parado"), 450);
    a.ocupadoAte = Date.now() + 4000 + Math.random() * 6000;
  });
  return true;
}
function descer(a) {
  a.ancora = null;
  a.y = chaoPasseio();
  desenharAgente(a, "pulando");
  posicionar(a, true, 0.4);
  setTimeout(() => desenharAgente(a, "parado"), 400);
}
function seguirAncora(a) {
  if (!a.ancora) return;
  if (!document.body.contains(a.ancora.el)) return descer(a);
  const r = a.ancora.el.getBoundingClientRect();
  if (a.ancora.lado) {
    // coala pendurado na lateral do card
    if (r.top < 40 || r.top > chaoPasseio() - 40) return descer(a);
    a.x = r.left - PET_TAM * 0.42;
    a.y = r.top + 8;
    return posicionar(a, false);
  }
  if (r.top < 40 || r.top > chaoPasseio() - 20) return descer(a);
  a.x = r.left + a.ancora.dx;
  a.y = r.top - PET_TAM * 0.8 + (a.ancora.alto || 0);
  posicionar(a, false);
}

/* ---------- o que fazer agora ---------- */
function decidir(a) {
  if (Date.now() < a.ocupadoAte || a.preso) return;
  const pet = a.pet;
  const pers = PERSONALIDADES_PET[pet.personalidade] || PERSONALIDADES_PET.curioso;
  const W = larguraTela();
  // dormindo: horário de dormir ou soneca
  if (!a.visitante && (dormindoAgora() || (pet.sonecaAte && Date.now() < pet.sonecaAte))) {
    if (a.pose !== "dormindo") {
      a.ancora = null;
      andarAte(a, W - PET_TAM - 12, chaoPasseio(), () => {
        a.balao = sonhoSVG(pet);
        desenharAgente(a, "dormindo");
      });
    }
    a.ocupadoAte = Date.now() + 20000;
    return;
  }
  // foco: deita do lado do cronômetro (coala abraça o cronômetro)
  const focoRolando =
    typeof timer !== "undefined" && timer.running && elapsed() < timer.goal * 60e3 && tab === "estudos";
  if (!a.visitante && !rolouAgora() && focoRolando) {
    const relogio = document.getElementById("clock");
    if (relogio) {
      const r = relogio.getBoundingClientRect();
      if (r.top > 60 && r.top < chaoPasseio()) {
        a.ancora = { el: relogio, dx: r.width + 6 };
        a.x = r.right + 6;
        a.y = r.top - PET_TAM * 0.3;
        // dorme do lado do cronômetro até o foco acabar (js/pets-evolucao.js acorda ele)
        if (pet.especie !== "coala") a.balao = sonhoSVG(pet);
        desenharAgente(a, pet.especie === "coala" ? "abracando" : "dormindo");
        posicionar(a, true, 0.5);
        a.ocupadoAte = Date.now() + 15000;
        return;
      }
    }
  }
  if (a.balao && a.pose !== "dormindo") a.balao = "";
  if (a.pose === "dormindo") {
    a.balao = "";
    desenharAgente(a, "parado");
  }
  // estante: lendo do lado
  if (!a.visitante && tab === "estante" && Math.random() < 0.5) {
    a.ancora = null;
    andarAte(a, 16 + Math.random() * 40, chaoPasseio(), () => reagir(a, "lendo", 8000));
    return;
  }
  if (a.ancora && Math.random() < 0.5) return descer(a);
  if (a.ancora) return reagir(a, Math.random() < 0.5 ? "sentado" : "parado", 3000);
  const r = Math.random();
  const sono = pers.sono * (pet.especie === "coala" ? 2.2 : 1);
  // jeitos de cada espécie (animais terrestres mantêm-se no chão com comportamentos realistas)
  if (pet.especie === "vaca" && r < 0.25) return pastar(a);
  if (pet.especie === "boi" && r < 0.15) return pastar(a);
  if (pet.especie === "cachorro" && r < 0.28) return farejarChao(a);
  if ((pet.especie === "coelho" || pet.especie === "hamster") && r < 0.25) return roerChao(a);
  if (pet.especie === "coala" && r < 0.16 && !rolouAgora() && pendurarNoCard(a)) return;
  // na aba Prumi: senta do lado do Prumi
  if (tab === "prumi" && r > 0.85 && !rolouAgora() && sentarNoPrumi(a)) return;
  if (r < sono * 0.5) return reagir(a, "deitado", 5000 + Math.random() * 6000);
  if (r < sono * 0.5 + 0.06) return reagir(a, Math.random() < 0.5 ? "bocejando" : "espreguicando", 1800);
  if (r < sono * 0.5 + 0.06 + pers.curioso * 0.5 && !rolouAgora() && subirNoCard(a)) return;
  if (r < 0.75) return andarAte(a, 8 + Math.random() * (W - PET_TAM - 16));
  if (r < 0.88) return reagir(a, "sentado", 3000 + Math.random() * 4000);
  if (pet.personalidade === "agitado") return reagir(a, "pulando", 900);
  reagir(a, "parado", 2000);
}

/* ---------- jeitos de cada espécie ---------- */
function farejarChao(a) {
  const dx = (Math.random() - 0.5) * 90;
  const nx = Math.max(12, Math.min(larguraTela() - PET_TAM - 12, a.x + dx));
  andarAte(a, nx, chaoPasseio(), () => reagir(a, "farejando", 3200), { vel: 0.7 });
}

function roerChao(a) {
  const dx = (Math.random() - 0.5) * 60;
  const nx = Math.max(12, Math.min(larguraTela() - PET_TAM - 12, a.x + dx));
  andarAte(a, nx, chaoPasseio(), () => reagir(a, "comendo", 2600), { vel: 1.3 });
}

function pastar(a) {
  andarAte(a, 8 + Math.random() * (larguraTela() - PET_TAM - 16), chaoPasseio(), () => {
    reagir(a, "pastando", 4500);
    if (Math.random() < 0.3) somDoPet(a.pet, 0.5);
  });
}
function corrida(a) {
  const W = larguraTela();
  const alvo = a.x < W / 2 ? W - PET_TAM - 8 : 8;
  a.ancora = null;
  andarAte(a, alvo, chaoPasseio(), () => reagir(a, "parado", 1200), { pose: "correndo", vel: 4 });
}
function pendurarNoCard(a) {
  const card = cardParaSubir();
  if (!card) return false;
  const r = card.getBoundingClientRect();
  if (r.left < PET_TAM * 0.5) return false;
  andarAte(a, Math.max(0, r.left - PET_TAM * 0.42), chaoPasseio(), () => {
    const r2 = card.getBoundingClientRect();
    if (rolouAgora() || r2.top < 70 || r2.top > chaoPasseio() - 60) return;
    a.ancora = { el: card, lado: true };
    a.x = r2.left - PET_TAM * 0.42;
    a.y = r2.top + 8;
    desenharAgente(a, Math.random() < 0.5 ? "abracando" : "dormindo");
    posicionar(a, true, 0.8);
    a.ocupadoAte = Date.now() + 8000 + Math.random() * 8000;
  });
  return true;
}
function sentarNoPrumi(a) {
  const palco = document.querySelector("#main .stage .mslot");
  if (!palco) return false;
  const r = palco.getBoundingClientRect();
  if (r.top < 60 || r.bottom > chaoPasseio()) return false;
  const dx = r.width - PET_TAM * 0.3;
  a.ancora = { el: palco, dx, alto: r.height - PET_TAM * 0.05 }; // senta na base do Prumi, do lado direito
  a.x = r.left + dx;
  a.y = r.top - PET_TAM * 0.8 + a.ancora.alto;
  desenharAgente(a, "pulando");
  posicionar(a, true, 0.5);
  setTimeout(() => desenharAgente(a, "sentado"), 500);
  a.ocupadoAte = Date.now() + 7000;
  return true;
}
function sonhoSVG(pet) {
  const s = {
    peixe: `<path d="M3 8q5-6 11 0q-6 6-11 0zM3 8l-3-3v6z" fill="#FF8A65"/>`,
    osso: `<path d="M4 6a2 2 0 1 1 2-2h6a2 2 0 1 1 2 2v2a2 2 0 1 1-2 2H6a2 2 0 1 1-2-2z" fill="#FFF8E1" stroke="#BCAAA4" stroke-width=".6"/>`,
    cenoura: `<path d="M3 3l10 4l-8 6z" fill="#FF7043"/><path d="M3 3l-2-2M3 3l-3 1" stroke="#43A047"/>`,
    semente: `<ellipse cx="8" cy="8" rx="5" ry="3" fill="#D7CCC8" transform="rotate(-30 8 8)"/>`,
    lua: `<circle cx="8" cy="8" r="5" fill="#FFF59D"/><circle cx="10" cy="6.6" r="4.2" fill="#fff"/>`,
    nota: `<path d="M9 2v8a2.4 2 0 1 1-1.4-1.8V2h4v2.4H9z" fill="#424242"/>`,
    capim: `<path d="M4 15l-1-8M8 15V4M12 15l2-9M6 15l-3-5M10 15l3-5" stroke="#43A047" stroke-width="1.6" stroke-linecap="round"/>`,
    folha: `<path d="M3 13Q3 3 14 2Q13 13 3 13z" fill="#66BB6A"/><path d="M3 13L11 5" stroke="#2E7D32" stroke-width=".8"/>`,
    estrela: `<path d="M8 1l2 4.6 5 .5-3.8 3.4 1.1 4.9L8 11.8l-4.3 2.6 1.1-4.9L1 6.1l5-.5z" fill="#FFD54F"/>`
  }[ESPECIES_PET[pet.especie].sonho];
  return `<svg viewBox="0 0 16 16" width="18" height="18">${s || ""}</svg>`;
}

/* ---------- toque no pet ---------- */
function tocarAgente(a) {
  if (a.ignorarClique) return;
  if (a.visitante) {
    reagir(a, "feliz", 1500);
    toast(`Você fez carinho no pet de ${a.pet.dono}!`);
    return;
  }
  if (a.escondido) return achouPet(a);
  if (a.carrega) {
    const t = a.carrega;
    a.carrega = "";
    reagir(a, "feliz", 1400);
    toast(`${a.pet.nome} trouxe na boca: "${t}". Bora fazer?`);
    tab = "hoje";
    fx.enter = true;
    render();
    return;
  }
  if (a.pose === "dormindo") {
    toast(`Shhh... ${a.pet.nome} tá sonhando.`);
    return;
  }
  fazerCarinho(a.pet, a.el);
  somDoPet(a.pet, 0.8);
  reagir(a, "feliz", 1500);
}

/* ---------- arrastar e segurar ---------- */
/** Para o pet onde ele está agora (no meio de uma caminhada a posição da tela é diferente de a.x). */
function congelar(a) {
  try {
    const t = getComputedStyle(a.el).transform;
    if (t && t !== "none" && typeof DOMMatrix === "function") {
      const m = new DOMMatrix(t);
      a.x = m.m41;
      a.y = m.m42;
    }
  } catch (e) {}
  clearTimeout(a.fimAndar);
  clearTimeout(a.fimReacao);
  posicionar(a, false);
}
function ligarArraste(a) {
  const el = a.el;
  el.addEventListener("pointerdown", ev => {
    if (a.visitante || a.escondido || (ev.button && ev.button > 0)) return;
    ev.stopPropagation();
    const ini = { x: ev.clientX, y: ev.clientY };
    let modo = null;
    let ox = ev.clientX - a.x,
      oy = ev.clientY - a.y;
    try {
      el.setPointerCapture(ev.pointerId);
    } catch (e) {}
    const segurar = setTimeout(() => {
      if (modo || a.pose === "dormindo") return;
      modo = "segura";
      a.preso = true;
      congelar(a);
      desenharAgente(a, "ronronando");
      somDoPet(a.pet, 0.5);
      fazerCarinho(a.pet, el);
      a.ronrona = setInterval(() => {
        fazerCarinho(a.pet, el);
        if (Math.random() < 0.4) somDoPet(a.pet, 0.4);
      }, 1600);
    }, 450);
    const mover = e => {
      if (!modo && Math.hypot(e.clientX - ini.x, e.clientY - ini.y) > 8) {
        modo = "arrasta";
        clearTimeout(segurar);
        a.preso = true;
        a.ancora = null;
        a.balao = "";
        congelar(a);
        ox = e.clientX - a.x;
        oy = e.clientY - a.y;
        desenharAgente(a, "segurado");
      }
      if (modo !== "arrasta") return;
      a.dir = e.clientX >= a.x + ox ? 1 : -1;
      a.el.classList.toggle("vira", a.dir < 0);
      a.x = Math.max(0, Math.min(larguraTela() - PET_TAM, e.clientX - ox));
      a.y = Math.max(0, Math.min(chaoPasseio(), e.clientY - oy));
      posicionar(a, false);
    };
    const soltar = () => {
      clearTimeout(segurar);
      clearInterval(a.ronrona);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
      if (!modo) return; // foi só um toque: o clique faz carinho
      a.ignorarClique = true;
      setTimeout(() => (a.ignorarClique = false), 60);
      a.preso = false;
      if (modo === "segura") return reagir(a, "feliz", 1200);
      soltarPet(a);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);
  });
}
/** Soltou no ar: cai no card que estiver embaixo (e fica em cima dele) ou no chão. */
function soltarPet(a) {
  const meio = a.x + PET_TAM / 2;
  const card = [...document.querySelectorAll("#main .block, #main .item, #main .cartao-mundo")].find(el => {
    const r = el.getBoundingClientRect();
    return (
      meio > r.left &&
      meio < r.right &&
      r.top > a.y + PET_TAM * 0.4 &&
      r.top > 70 &&
      r.top < chaoPasseio() - 40
    );
  });
  const chao = chaoPasseio();
  let y = chao;
  if (card) {
    const r = card.getBoundingClientRect();
    a.ancora = { el: card, dx: a.x - r.left };
    y = r.top - PET_TAM * 0.8;
  }
  const dur = RM ? 0 : Math.min(0.7, Math.max(0.2, Math.sqrt(Math.max(0, y - a.y) / 900)));
  a.y = y;
  desenharAgente(a, "pulando");
  a.el.style.transition = dur ? `transform ${dur.toFixed(2)}s cubic-bezier(.55,0,1,.45)` : "none";
  a.el.style.transform = `translate(${Math.round(a.x)}px, ${Math.round(a.y)}px)`;
  a.ocupadoAte = Date.now() + dur * 1000 + 2500;
  clearTimeout(a.fimReacao);
  a.fimReacao = setTimeout(() => desenharAgente(a, card ? "sentado" : "parado"), dur * 1000 + 300);
}

/* ---------- potinho de comida e abraço ---------- */
function passeioComer(id) {
  const a = passeio.agentes.get(id);
  if (!a || a.escondido || a.pose === "dormindo") return;
  const W = larguraTela(),
    chao = chaoPasseio();
  const pote = document.createElement("span");
  pote.className = "pet-pote";
  const bx = Math.max(10, Math.min(W - 40, a.x + (a.x < W / 2 ? 90 : -70)));
  pote.style.transform = `translate(${Math.round(bx)}px, ${Math.round(chao + PET_TAM * 0.62)}px)`;
  camadaPasseio().appendChild(pote);
  a.ancora = null;
  a.preso = true;
  const lado = bx > a.x ? -PET_TAM + 6 : 22;
  andarAte(
    a,
    bx + lado,
    chao,
    () => {
      a.dir = bx > a.x ? 1 : -1;
      reagir(a, "comendo", 2600);
      setTimeout(() => {
        a.preso = false;
        pote.classList.add("vazio");
        setTimeout(() => pote.remove(), 700);
        reagir(a, "feliz", 1200);
      }, 2600);
    },
    { vel: 1.8 }
  );
}
function passeioAbraco(id) {
  const a = passeio.agentes.get(id);
  if (!a || a.escondido) return;
  a.ancora = null;
  a.preso = true;
  congelar(a);
  a.x = larguraTela() / 2 - PET_TAM / 2;
  a.y = innerHeight * 0.38;
  desenharAgente(a, "abracando");
  posicionar(a, true, 0.4);
  a.el.classList.add("na-tela");
  setTimeout(() => {
    a.el.classList.remove("na-tela");
    a.preso = false;
    descer(a);
  }, 2600);
}

/* ---------- bolinha ---------- */
function passeioBolinha(id) {
  const a = passeio.agentes.get(id);
  if (!a) return toast("Liga o passeio pelas páginas pra brincar de bolinha.");
  const W = larguraTela(),
    chao = chaoPasseio();
  const bola = document.createElement("span");
  bola.className = "pet-bolinha";
  camadaPasseio().appendChild(bola);
  const alvo = a.x < W / 2 ? W - 60 : 30;
  bola.style.transform = `translate(${W / 2}px, ${chao - 120}px)`;
  void bola.offsetWidth;
  bola.style.transition = "transform .9s cubic-bezier(.3,.6,.5,1)";
  bola.style.transform = `translate(${alvo}px, ${chao + PET_TAM * 0.55}px)`;
  a.ancora = null;
  a.preso = true;
  setTimeout(
    () =>
      andarAte(a, alvo - 10, chao, () => {
        bola.remove();
        a.carregaBola = true;
        reagir(a, "feliz", 600);
        setTimeout(
          () =>
            andarAte(a, W / 2 - PET_TAM / 2, chao, () => {
              a.preso = false;
              reagir(a, "pulando", 900);
              a.pet.carinhos[today()] = (a.pet.carinhos[today()] || 0) + 1;
              cuidou(a.pet);
              persist();
              toast(`${a.pet.nome} trouxe a bolinha de volta!`);
            }),
          600
        );
      }),
    500
  );
}

/* ---------- esconde-esconde ---------- */
const ABAS_ESCONDE = ["hoje", "estudos", "dieta", "social", "estante", "prumi"];
function passeioEsconder(id) {
  const p = petsDados();
  if (p.esconde && p.esconde.dia === today()) return;
  const x = petPorId(id);
  const opcoes = ABAS_ESCONDE.filter(t => t !== tab);
  p.esconde = {
    dia: today(),
    pet: id,
    aba: opcoes[Math.floor(Math.random() * opcoes.length)],
    achado: false
  };
  persist();
  toast(`${x.nome} foi se esconder em outra aba! Procura ele (uma pontinha do rabo aparece).`);
  passeioAtualizar();
}
function achouPet(a) {
  const p = petsDados();
  if (p.esconde) p.esconde.achado = true;
  a.escondido = false;
  a.el.classList.remove("escondido");
  earn(5);
  notificar({
    titulo: "Achou!",
    texto: `${a.pet.nome} tava escondido aqui. +5 gotas.`,
    tipo: "conquista",
    mood: "party"
  });
  persist();
  reagir(a, "pulando", 1200);
}

/* ---------- atualiza quem está na tela ---------- */
function passeioAtualizar() {
  const p = petsDados();
  const ligado = p.passeio && S.onboarded && document.getElementById("main") !== null;
  const queremos = ligado ? p.lista.slice(0, 3) : [];
  for (const [id, a] of passeio.agentes)
    if (!queremos.some(x => x.id === id)) {
      a.el.remove();
      passeio.agentes.delete(id);
    }
  for (const x of queremos) {
    let a = passeio.agentes.get(x.id);
    if (!a) {
      a = criarAgente(x);
      passeio.agentes.set(x.id, a);
    }
    a.pet = x;
    const esc = p.esconde && p.esconde.dia === today() && !p.esconde.achado && p.esconde.pet === x.id;
    if (esc) {
      a.escondido = true;
      a.el.classList.add("escondido");
      a.el.hidden = tab !== p.esconde.aba;
      if (tab === p.esconde.aba) {
        const card = cardParaSubir();
        if (card) {
          a.ancora = { el: card, escondido: true };
          seguirEscondido(a);
        }
      }
    } else {
      a.escondido = false;
      a.el.hidden = false;
      a.el.classList.remove("escondido");
    }
    desenharAgente(a);
  }
  if (queremos.length && !passeio.timer) passeio.timer = setInterval(cicloPasseio, 2500);
  if (!queremos.length && passeio.timer) {
    clearInterval(passeio.timer);
    passeio.timer = null;
  }
}
window.passeioAtualizar = passeioAtualizar;

/** Escondido atrás de um card: acompanha o card quando a página rola. */
function seguirEscondido(a) {
  if (!a.ancora || !document.body.contains(a.ancora.el)) return;
  const r = a.ancora.el.getBoundingClientRect();
  a.x = r.right - PET_TAM * 0.55;
  a.y = r.top + 6;
  posicionar(a, false);
}
function passeioReagir(id, pose, ms) {
  const a = passeio.agentes.get(id);
  if (a && !a.escondido) reagir(a, pose, ms);
}

let ultimoPedidoAgua = 0,
  ultimaTarefaTrazida = 0,
  ultimaVisita = 0;
function cicloPasseio() {
  if (document.hidden) return;
  const agentes = [...passeio.agentes.values()].filter(a => !a.escondido && !a.el.hidden);
  agentes.forEach(a => (a.ancora && !a.preso ? seguirAncora(a) : null));
  agentes.forEach(decidir);
  // dois pets perto: brincam
  for (let i = 0; i < agentes.length; i++)
    for (let k = i + 1; k < agentes.length; k++) {
      const A = agentes[i],
        B = agentes[k];
      if (Math.abs(A.x - B.x) < 40 && Math.abs(A.y - B.y) < 20 && Math.random() < 0.3) {
        reagir(A, "feliz", 1400);
        reagir(B, "pulando", 900);
      }
    }
  const principal = agentes.find(a => a.pet.id === petsDados().ativo) || agentes[0];
  if (!principal || principal.pose === "dormindo") return;
  const agora = Date.now();
  // pede atenção: muito tempo sem beber água (de dia)
  const ultimaAgua = (S.water[today()] || []).slice(-1)[0];
  const minSemAgua = ultimaAgua
    ? (agora - new Date(`${today()}T${ultimaAgua.t}:00`).getTime()) / 6e4
    : new Date().getHours() * 60 - hm2min(S.wake || "07:00");
  if (
    minSemAgua > 150 &&
    waterToday() < S.waterGoal &&
    agora - ultimoPedidoAgua > 60 * 60e3 &&
    !dormindoAgora()
  ) {
    ultimoPedidoAgua = agora;
    principal.ancora = null;
    andarAte(principal, larguraTela() / 2 - PET_TAM / 2, chaoPasseio(), () => {
      somDoPet(principal.pet);
      reagir(principal, "pulando", 1200);
      toast(`${principal.pet.nome} tá pedindo pra você beber água!`, false, "drink");
    });
    return;
  }
  // traz na boca uma tarefa esquecida (atrasada)
  const esquecida = S.tasks.find(t => !t.done && t.date < today());
  if (esquecida && agora - ultimaTarefaTrazida > 2 * 60 * 60e3 && Math.random() < 0.15) {
    ultimaTarefaTrazida = agora;
    principal.carrega = esquecida.title.slice(0, 40);
    desenharAgente(principal);
    andarAte(principal, larguraTela() / 2 - PET_TAM / 2);
  }
  // visita do pet de um amigo (uma vez por dia, se algum amigo tiver pet)
  if (!passeio.visita && agora - ultimaVisita > 30 * 60e3 && Math.random() < 0.05) visitaDeAmigo();
}

function visitaDeAmigo() {
  if (typeof amigosInfo !== "object" || !amigosInfo) return;
  const chave = "prumo-visita-pet";
  if (lsGet(chave) === today()) return;
  const comPet = Object.values(amigosInfo).filter(i => i && i.vitrine && i.vitrine.pet);
  if (!comPet.length) return;
  const amigo = comPet[Math.floor(Math.random() * comPet.length)];
  const pet = { ...amigo.vitrine.pet, id: "visita", dono: amigo.vitrine.nome || "um amigo" };
  lsSet(chave, today());
  ultimaVisita = Date.now();
  const a = criarAgente(pet, true);
  a.x = -PET_TAM;
  posicionar(a, false);
  passeio.visita = a;
  andarAte(a, larguraTela() * 0.6);
  toast(`${pet.nome}, o pet de ${pet.dono}, veio visitar!`);
  setTimeout(() => {
    if (typeof deixarLembranca === "function") deixarLembranca(pet, a); // deixa um presentinho antes de ir
    andarAte(a, larguraTela() + PET_TAM, chaoPasseio(), () => ((passeio.visita = null), a.el.remove()));
  }, 60000);
}

/* ---------- eventos do app ---------- */
document.addEventListener("prumo:concluiu", () => {
  petTarefaConcluida();
  for (const a of passeio.agentes.values()) {
    if (a.escondido || a.pose === "dormindo" || a.preso) continue;
    if (a.pet.especie === "vaca") {
      if (typeof tocarSininho === "function") tocarSininho();
      reagir(a, "sininho", 1800);
    } else if (a.pet.especie === "boi") corrida(a);
    else reagir(a, a.pet.personalidade === "dramatico" ? "girando" : "pulando", 1000);
  }
});
document.addEventListener("prumo:agua", ev => {
  for (const a of passeio.agentes.values())
    if (!a.escondido && a.pose !== "dormindo")
      reagir(
        a,
        ev.detail && ev.detail.meta ? (a.pet.especie === "vaca" ? "sininho" : "dancando") : "comendo",
        ev.detail && ev.detail.meta ? 2400 : 1200
      );
});
document.addEventListener("prumo:conquista", () => {
  for (const a of passeio.agentes.values()) if (!a.escondido) reagir(a, "dancando", 2400);
});
// amigo do Prumi: cutucou o Prumi, o pet vem correndo brincar junto
document.addEventListener("click", ev => {
  if (!ev.target.closest('[data-act="poke"]')) return;
  const a = passeio.agentes.get(petsDados().ativo);
  if (!a || a.escondido || a.pose === "dormindo" || a.preso) return;
  const r = ev.target.closest('[data-act="poke"]').getBoundingClientRect();
  a.ancora = null;
  andarAte(a, Math.max(4, Math.min(larguraTela() - PET_TAM - 4, r.right + 4)), chaoPasseio(), () => {
    reagir(a, "feliz", 1600);
    if (Math.random() < 0.5) react("party", `Eu e ${esc(a.pet.nome)} somos uma dupla!`, 2400);
  });
});

// tocar num lugar vazio: o pet vai até lá (clique, não pointerdown: no celular o pointerdown dispara ao rolar a página)
document.addEventListener("click", ev => {
  if (
    !passeio.agentes.size ||
    ev.target.closest(
      "button,a,input,textarea,select,label,summary,[data-act],.pet-agente,.banner-aviso,dialog"
    )
  )
    return;
  if (rolouAgora() || (getSelection && String(getSelection()).length)) return;
  const a = passeio.agentes.get(petsDados().ativo) || [...passeio.agentes.values()][0];
  if (!a || a.escondido || a.pose === "dormindo" || a.preso) return;
  a.ancora = null;
  andarAte(a, Math.max(4, Math.min(larguraTela() - PET_TAM - 4, ev.clientX - PET_TAM / 2)));
});
// saiu no meio do foco: quando volta, o pet bate na tela
let saiuNoFoco = false,
  saiuEm = 0;
/** Voltou depois de um tempão: o pet vem correndo te receber. */
function petRecebe() {
  const a = passeio.agentes.get(petsDados().ativo);
  if (!a || a.escondido || a.preso || dormindoAgora()) return;
  a.ancora = null;
  andarAte(
    a,
    larguraTela() / 2 - PET_TAM / 2,
    chaoPasseio(),
    () => {
      somDoPet(a.pet);
      reagir(a, a.pet.personalidade === "dramatico" ? "girando" : "pulando", 1400);
      setTimeout(() => reagir(a, "feliz", 1600), 1400);
      toast(`${a.pet.nome} tava com saudade!`, false, "happy");
    },
    { vel: 2.5, pose: a.pet.especie === "coala" ? "andando" : "correndo" }
  );
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saiuNoFoco = typeof timer !== "undefined" && timer.running;
    saiuEm = Date.now();
    return;
  }
  if (!saiuNoFoco && saiuEm && Date.now() - saiuEm > 2 * 36e5) setTimeout(petRecebe, 800);
  if (!saiuNoFoco) return;
  saiuNoFoco = false;
  const a = passeio.agentes.get(petsDados().ativo);
  if (!a || a.escondido) return;
  a.ancora = null;
  a.x = larguraTela() / 2 - PET_TAM;
  a.y = innerHeight * 0.35;
  desenharAgente(a, "batendo");
  posicionar(a, true, 0.4);
  a.el.classList.add("na-tela");
  somDoPet(a.pet);
  toast(`Toc toc! ${a.pet.nome} viu você sair no meio do foco. Bora voltar?`, false, "worried");
  a.ocupadoAte = Date.now() + 2600;
  setTimeout(() => {
    a.el.classList.remove("na-tela");
    descer(a);
  }, 2600);
});
// rolou a página (a janela ou qualquer caixa com rolagem): quem estava em cima de card desce pro chão
addEventListener(
  "scroll",
  ev => {
    if (ev.target && ev.target.closest && ev.target.closest("#pets-passeio")) return;
    ultimoScroll = Date.now();
    passeio.agentes.forEach(a => {
      if (a.escondido) return seguirEscondido(a);
      if (a.ancora && !a.preso) descer(a);
    });
  },
  { passive: true, capture: true }
);
addEventListener("resize", () =>
  passeio.agentes.forEach(a => !a.ancora && ((a.y = chaoPasseio()), posicionar(a, false)))
);

// redesenha junto com o app (troca de aba, esconde-esconde...)
document.addEventListener("DOMContentLoaded", () => {
  const renderAntesPet = render;
  render = function () {
    renderAntesPet();
    passeioAtualizar();
  };
  passeioAtualizar();
});
