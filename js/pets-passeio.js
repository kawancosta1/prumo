/*
  Passeio dos pets pelas páginas (dados e desenho em js/pets.js).
  Cada pet é um "agente" numa camada fixa por cima do app:
  - anda pela beirada de baixo da tela, senta, deita, sobe em cima dos cards e segue onde você toca;
  - dorme no horário de dormir (com balão de sonho), deita do lado do cronômetro no foco
    e bate na tela se você sair no meio; na Estante fica "lendo" do lado;
  - pula quando você conclui tarefa, dança quando bate a meta de água, comemora conquistas;
  - pede atenção quando você fica muito tempo sem beber água e traz na boca uma tarefa esquecida;
  - brinca de bolinha, de esconde-esconde (se esconde em outra aba) e encontra os outros pets;
  - de vez em quando o pet de um amigo vem visitar.
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
    (a.carrega ? `<span class="pet-carrega" title="${esc(a.carrega)}"></span>` : "");
  a.el.classList.toggle("vira", a.dir < 0);
}
function posicionar(a, animar = true, dur = 0) {
  a.el.style.transition = animar ? `transform ${dur.toFixed(2)}s linear` : "none";
  a.el.style.transform = `translate(${Math.round(a.x)}px, ${Math.round(a.y)}px)`;
}
function andarAte(a, x, y = chaoPasseio(), depois) {
  if (RM) {
    a.x = x;
    a.y = y;
    posicionar(a, false);
    return depois && depois();
  }
  const pers = PERSONALIDADES_PET[a.pet.personalidade] || PERSONALIDADES_PET.curioso;
  const vel = 60 * pers.vel * (tristinho(a.pet) ? 0.5 : 1); // px por segundo
  const dist = Math.hypot(x - a.x, y - a.y);
  const dur = Math.max(0.3, dist / vel);
  a.dir = x >= a.x ? 1 : -1;
  desenharAgente(a, "andando");
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
function cardParaSubir() {
  const cards = [...document.querySelectorAll("#main .block, #main .item, #main .cartao-mundo")].filter(
    el => {
      const r = el.getBoundingClientRect();
      return r.top > 70 && r.top < chaoPasseio() - 60 && r.width > 120;
    }
  );
  return cards.length ? cards[Math.floor(Math.random() * cards.length)] : null;
}
function subirNoCard(a) {
  const card = cardParaSubir();
  if (!card) return false;
  const r = card.getBoundingClientRect();
  const x = Math.max(r.left, Math.min(r.right - PET_TAM, r.left + Math.random() * (r.width - PET_TAM)));
  andarAte(a, a.x, chaoPasseio(), () => {
    // pulo até o card
    a.ancora = { el: card, dx: x - r.left };
    a.x = x;
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
  if (r.top < 40 || r.top > chaoPasseio() - 20) return descer(a);
  a.x = r.left + a.ancora.dx;
  a.y = r.top - PET_TAM * 0.8;
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
  if (a.balao && a.pose !== "dormindo") a.balao = "";
  if (a.pose === "dormindo") {
    a.balao = "";
    desenharAgente(a, "parado");
  }
  // foco: deita do lado do cronômetro
  if (!a.visitante && typeof timer !== "undefined" && timer.running && tab === "estudos") {
    const relogio = document.getElementById("clock");
    if (relogio) {
      const r = relogio.getBoundingClientRect();
      if (r.top > 60 && r.top < chaoPasseio()) {
        a.ancora = { el: relogio, dx: r.width + 6 };
        a.x = r.right + 6;
        a.y = r.top - PET_TAM * 0.3;
        desenharAgente(a, "deitado");
        posicionar(a, true, 0.5);
        a.ocupadoAte = Date.now() + 15000;
        return;
      }
    }
  }
  // estante: lendo do lado
  if (!a.visitante && tab === "estante" && Math.random() < 0.5) {
    a.ancora = null;
    andarAte(a, 16 + Math.random() * 40, chaoPasseio(), () => reagir(a, "lendo", 8000));
    return;
  }
  if (a.ancora && Math.random() < 0.5) return descer(a);
  const r = Math.random();
  if (r < pers.sono * 0.5) return reagir(a, "deitado", 5000 + Math.random() * 6000);
  if (r < pers.sono * 0.5 + pers.curioso * 0.5 && subirNoCard(a)) return;
  if (r < 0.75) return andarAte(a, 8 + Math.random() * (W - PET_TAM - 16));
  if (r < 0.88) return reagir(a, "sentado", 3000 + Math.random() * 4000);
  if (pet.personalidade === "agitado") return reagir(a, "pulando", 900);
  reagir(a, "parado", 2000);
}
function sonhoSVG(pet) {
  const s = {
    peixe: `<path d="M3 8q5-6 11 0q-6 6-11 0zM3 8l-3-3v6z" fill="#FF8A65"/>`,
    osso: `<path d="M4 6a2 2 0 1 1 2-2h6a2 2 0 1 1 2 2v2a2 2 0 1 1-2 2H6a2 2 0 1 1-2-2z" fill="#FFF8E1" stroke="#BCAAA4" stroke-width=".6"/>`,
    cenoura: `<path d="M3 3l10 4l-8 6z" fill="#FF7043"/><path d="M3 3l-2-2M3 3l-3 1" stroke="#43A047"/>`,
    semente: `<ellipse cx="8" cy="8" rx="5" ry="3" fill="#D7CCC8" transform="rotate(-30 8 8)"/>`,
    lua: `<circle cx="8" cy="8" r="5" fill="#FFF59D"/><circle cx="10" cy="6.6" r="4.2" fill="#fff"/>`,
    nota: `<path d="M9 2v8a2.4 2 0 1 1-1.4-1.8V2h4v2.4H9z" fill="#424242"/>`,
    estrela: `<path d="M8 1l2 4.6 5 .5-3.8 3.4 1.1 4.9L8 11.8l-4.3 2.6 1.1-4.9L1 6.1l5-.5z" fill="#FFD54F"/>`
  }[ESPECIES_PET[pet.especie].sonho];
  return `<svg viewBox="0 0 16 16" width="18" height="18">${s || ""}</svg>`;
}

/* ---------- toque no pet ---------- */
function tocarAgente(a) {
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
  a.pet.carinhos[today()] = (a.pet.carinhos[today()] || 0) + 1;
  cuidou(a.pet);
  persist();
  somDoPet(a.pet, 0.8);
  reagir(a, "feliz", 1500);
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
          const r = card.getBoundingClientRect();
          a.x = r.right - PET_TAM * 0.55;
          a.y = r.top + 6;
          posicionar(a, false);
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
  agentes.forEach(a => (a.ancora ? seguirAncora(a) : null));
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
  setTimeout(
    () => andarAte(a, larguraTela() + PET_TAM, chaoPasseio(), () => ((passeio.visita = null), a.el.remove())),
    60000
  );
}

/* ---------- eventos do app ---------- */
document.addEventListener("prumo:concluiu", () => {
  petTarefaConcluida();
  for (const a of passeio.agentes.values())
    if (!a.escondido && a.pose !== "dormindo")
      reagir(a, a.pet.personalidade === "dramatico" ? "girando" : "pulando", 1000);
});
document.addEventListener("prumo:agua", ev => {
  for (const a of passeio.agentes.values())
    if (!a.escondido && a.pose !== "dormindo")
      reagir(
        a,
        ev.detail && ev.detail.meta ? "dancando" : "comendo",
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

// tocar num lugar vazio: o pet vai até lá
document.addEventListener("pointerdown", ev => {
  if (
    !passeio.agentes.size ||
    ev.target.closest(
      "button,a,input,textarea,select,label,summary,[data-act],.pet-agente,.banner-aviso,dialog"
    )
  )
    return;
  const a = passeio.agentes.get(petsDados().ativo) || [...passeio.agentes.values()][0];
  if (!a || a.escondido || a.pose === "dormindo" || a.preso) return;
  a.ancora = null;
  andarAte(a, Math.max(4, Math.min(larguraTela() - PET_TAM - 4, ev.clientX - PET_TAM / 2)));
});
// saiu no meio do foco: quando volta, o pet bate na tela
let saiuNoFoco = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saiuNoFoco = typeof timer !== "undefined" && timer.running;
    return;
  }
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
addEventListener("scroll", () => passeio.agentes.forEach(a => a.ancora && seguirAncora(a)), {
  passive: true
});
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
