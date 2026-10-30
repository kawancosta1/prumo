/*
  30 jeitos novos de brincar com o pet (passeio em js/pets-passeio.js, dados em js/pets.js):
   1 olhos seguem o mouse/dedo            16 se assusta quando você apaga uma tarefa
   2 dois toques: faz um truque           17 comemora quando você fecha o dia
   3 esfregar com o mouse: barriga pra cima 18 bebe água junto (potinho azul)
   4 três toques rápidos: cócegas          19 reage quando chega mimo de amigo
   5 combo de carinho com corações         20 pula junto quando o Prumi comemora
   6 menu do pet (botão direito)           21 dança com o som ambiente do foco
   7 chamar pelo nome (botão ou tecla P)   22 bom dia e boa noite ao abrir o app
   8 "Vem comigo": segue o ponteiro        23 pede carinho se você esqueceu
   9 jogar petisco no chão                 24 traz presente quando está muito feliz
  10 ronrona com som quando você segura    25 plaquinha com nome e humor ao passar o mouse
  11 fica tonto com rolagem muito rápida   26 o curioso fareja o cursor parado
  12 tira soneca se você some 5 min        27 dois pets brincam de pega-pega
  13 olha você escrever uma tarefa         28 o dramático finge desmaio se ignorado
  14 sobe na tarefa que você concluiu      29 o agitado corre em círculo no combo
  15 fica tristinho quando desmarca        30 momentos novos no álbum
*/
"use strict";

const agentePrincipal = () => {
  if (typeof passeio !== "object") return null;
  const a = passeio.agentes.get(petsDados().ativo) || [...passeio.agentes.values()][0];
  return a && !a.escondido && !a.el.hidden ? a : null;
};
const livre = a => a && !a.preso && a.pose !== "dormindo";
const marcarMomento = (x, t, pose) => {
  if (!x.momentos.some(m => m.t === t)) {
    momentoPet(x, t, pose);
    persist(true);
  }
};

/* 1. olhos seguem o ponteiro */
let ponteiro = { x: -1, y: -1, em: 0 };
{
  let pedido = 0;
  addEventListener(
    "pointermove",
    ev => {
      ponteiro = { x: ev.clientX, y: ev.clientY, em: Date.now() };
      if (pedido || typeof passeio !== "object") return;
      pedido = requestAnimationFrame(() => {
        pedido = 0;
        for (const a of passeio.agentes.values()) {
          const cx = a.x + PET_TAM * 0.7,
            cy = a.y + PET_TAM * 0.3;
          let dx = Math.max(-1, Math.min(1, (ponteiro.x - cx) / 180)) * 1.3;
          const dy = Math.max(-1, Math.min(1, (ponteiro.y - cy) / 180)) * 1.1;
          if (a.dir < 0) dx = -dx;
          a.el.style.setProperty("--olho-x", dx.toFixed(2) + "px");
          a.el.style.setProperty("--olho-y", dy.toFixed(2) + "px");
        }
      });
    },
    { passive: true }
  );
}

/* 2, 4, 5. toques: dois = truque, três = cócegas, vários seguidos = combo */
function truqueAleatorio(a) {
  const sabe = TRUQUES_PET.filter(t => a.pet.truques.includes(t.id) && truqueLivre(a.pet, t));
  const t = pick(sabe.length ? sabe : TRUQUES_PET.slice(0, 1));
  reagir(a, t.pose, 1600);
  petFala(a, `${t.nome}!`, 1400);
}
function coracaoCombo(a, n) {
  if (RM) return;
  const el = document.createElement("span");
  el.className = "pet-combo";
  el.textContent = n >= 2 ? `♥ x${n}` : "♥";
  el.style.left = a.x + PET_TAM * 0.5 + (Math.random() * 16 - 8) + "px";
  el.style.top = a.y - 6 + "px";
  el.style.fontSize = 12 + Math.min(10, n * 2) + "px";
  camadaPasseio().appendChild(el);
  setTimeout(() => el.remove(), 900);
}
document.addEventListener(
  "click",
  ev => {
    const el = ev.target.closest && ev.target.closest(".pet-agente");
    if (!el || typeof passeio !== "object") return;
    const a = [...passeio.agentes.values()].find(x => x.el === el);
    if (!a || a.visitante || a.escondido || a.ignorarClique || a.pose === "dormindo") return;
    const agora = Date.now();
    a.toques = (a.toques || []).filter(t => agora - t < 2200);
    a.toques.push(agora);
    const rapidos = a.toques.filter(t => agora - t < 900).length;
    const n = a.toques.length;
    coracaoCombo(a, n);
    if (rapidos === 3) {
      setTimeout(() => {
        reagir(a, "girando", 1400);
        petFala(a, pick(["Hihihi!", "Para, tenho cócegas!", "Hahaha!"]), 1600);
        marcarMomento(a.pet, "Primeira cócega", "girando");
      }, 60);
    } else if (rapidos === 2) setTimeout(() => truqueAleatorio(a), 320);
    if (n === 5) {
      marcarMomento(a.pet, "Combo de 5 carinhos", "feliz");
      if (a.pet.personalidade === "agitado") correrEmCirculo(a);
      else petFala(a, "Combo de amor!", 1600);
    }
  },
  true
);

/* 29. agitado corre em círculo */
function correrEmCirculo(a) {
  if (RM || !livre(a)) return;
  const cx = a.x,
    cy = a.y;
  a.preso = true;
  let i = 0;
  const passo = () => {
    if (i > 12) {
      a.preso = false;
      a.x = cx;
      a.y = cy;
      posicionar(a, true, 0.2);
      return reagir(a, "feliz", 1000);
    }
    const ang = (i / 12) * Math.PI * 2;
    a.x = cx + Math.cos(ang) * 30;
    a.y = cy - Math.abs(Math.sin(ang)) * 16;
    a.dir = Math.sin(ang) > 0 ? -1 : 1;
    desenharAgente(a, "correndo");
    posicionar(a, true, 0.08);
    i++;
    setTimeout(passo, 80);
  };
  passo();
}

/* 3. esfregar com o mouse em cima do pet */
document.addEventListener("pointermove", ev => {
  if (ev.pointerType !== "mouse" || ev.buttons) return;
  const el = ev.target.closest && ev.target.closest(".pet-agente");
  if (!el || typeof passeio !== "object") return;
  const a = [...passeio.agentes.values()].find(x => x.el === el);
  if (!a || a.visitante || !livre(a)) return;
  const agora = Date.now();
  const lado = Math.sign(ev.movementX || 0);
  if (!lado) return;
  a.esfrega = (a.esfrega || []).filter(e => agora - e.t < 1200);
  const ultimo = a.esfrega[a.esfrega.length - 1];
  if (!ultimo || ultimo.l !== lado) a.esfrega.push({ t: agora, l: lado });
  if (a.esfrega.length >= 6 && agora - (a.ultimoEsfrega || 0) > 4000) {
    a.ultimoEsfrega = agora;
    a.esfrega = [];
    fazerCarinho(a.pet, a.el);
    reagir(a, "rolando", 1800);
    petFala(a, "Barriguinha!", 1500);
    somDoPet(a.pet, 0.6);
    marcarMomento(a.pet, "Carinho na barriga", "rolando");
  }
});

/* 6. menu do pet (botão direito em cima dele) */
function abrirMenuPet(a, x, y) {
  fecharMenuPet();
  const m = document.createElement("div");
  m.className = "pet-menu";
  m.setAttribute("role", "menu");
  const op = [
    ["carinho", "Carinho"],
    ["truque", "Truque"],
    ["petisco", "Jogar petisco (1)"],
    ["seguir", "Vem comigo"],
    ["dormir", a.pose === "dormindo" ? "Acordar" : "Tirar soneca"],
    ["painel", "Abrir o painel"]
  ];
  m.innerHTML = `<b>${esc(a.pet.nome)}</b>${op.map(([k, t]) => `<button type="button" role="menuitem" data-m="${k}">${t}</button>`).join("")}`;
  m.style.left = Math.min(innerWidth - 170, Math.max(8, x)) + "px";
  m.style.top = Math.min(innerHeight - 230, Math.max(8, y - 200)) + "px";
  document.body.appendChild(m);
  m.addEventListener("click", e => {
    const b = e.target.closest("[data-m]");
    if (!b) return;
    fecharMenuPet();
    const k = b.dataset.m;
    if (k === "carinho") {
      fazerCarinho(a.pet, a.el);
      reagir(a, "feliz", 1400);
      somDoPet(a.pet, 0.7);
    } else if (k === "truque") truqueAleatorio(a);
    else if (k === "petisco") jogarPetisco(a.pet.id);
    else if (k === "seguir") vemComigo(a.pet.id);
    else if (k === "dormir") {
      if (a.pose === "dormindo") acordar(a);
      else {
        a.balao = sonhoSVG(a.pet);
        desenharAgente(a, "dormindo");
        a.ocupadoAte = Date.now() + 60000;
        a.sonecaManual = true;
      }
    } else if (k === "painel") {
      tab = "prumi";
      prumiTab = "pet";
      petSel = a.pet.id;
      render();
      scrollTo(0, 0);
    }
  });
  setTimeout(() => document.addEventListener("pointerdown", fecharMenuForaDele, true), 0);
}
function fecharMenuForaDele(e) {
  if (!e.target.closest(".pet-menu")) fecharMenuPet();
}
function fecharMenuPet() {
  document.querySelectorAll(".pet-menu").forEach(m => m.remove());
  document.removeEventListener("pointerdown", fecharMenuForaDele, true);
}
document.addEventListener("contextmenu", ev => {
  const el = ev.target.closest && ev.target.closest(".pet-agente");
  if (!el || typeof passeio !== "object") return;
  const a = [...passeio.agentes.values()].find(x => x.el === el);
  if (!a || a.visitante || a.escondido) return;
  ev.preventDefault();
  abrirMenuPet(a, ev.clientX, ev.clientY);
});
document.addEventListener("keydown", e => e.key === "Escape" && fecharMenuPet());

/* 7. chamar pelo nome */
function chamarPet(id) {
  const a = (id && passeio.agentes.get(id)) || agentePrincipal();
  if (!a) return toast("Ative o passeio pelas páginas para chamar o pet.");
  if (a.pose === "dormindo") acordar(a);
  a.ancora = null;
  a.preso = false;
  andarAte(
    a,
    larguraTela() / 2 - PET_TAM / 2,
    chaoPasseio(),
    () => {
      reagir(a, "pulando", 900);
      somDoPet(a.pet);
      petFala(a, pick(["Chamou?", "Tô aqui!", "Oi oi!", `${a.pet.nome} chegou!`]), 1800);
    },
    { vel: 3, pose: a.pet.especie === "coala" ? "andando" : "correndo" }
  );
}
document.addEventListener("keydown", e => {
  if ((e.key === "p" || e.key === "P") && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const t = (document.activeElement || {}).tagName || "";
    if (!/INPUT|TEXTAREA|SELECT/.test(t) && S.onboarded && petsDados().lista.length) chamarPet();
  }
});

/* 8. vem comigo: segue o ponteiro por 15 segundos */
function vemComigo(id) {
  const a = (id && passeio.agentes.get(id)) || agentePrincipal();
  if (!a) return toast("Ative o passeio pelas páginas para que ele te acompanhe.");
  if (a.pose === "dormindo") acordar(a);
  clearInterval(a.seguindo);
  a.ancora = null;
  petFala(a, "Bora!", 1200);
  const fim = Date.now() + 15000;
  marcarMomento(a.pet, "Passeou atrás de você", "andando");
  a.seguindo = setInterval(() => {
    if (Date.now() > fim || a.preso) {
      clearInterval(a.seguindo);
      a.seguindo = null;
      return reagir(a, "sentado", 2000);
    }
    if (ponteiro.x < 0) return;
    const alvo = Math.max(4, Math.min(larguraTela() - PET_TAM - 4, ponteiro.x - PET_TAM / 2));
    if (Math.abs(alvo - a.x) > 20) andarAte(a, alvo, chaoPasseio(), null, { vel: 2.4 });
    a.ocupadoAte = Date.now() + 1500;
  }, 600);
}

/* 9. jogar petisco no chão */
function jogarPetisco(id) {
  const a = (id && passeio.agentes.get(id)) || agentePrincipal();
  if (!a) return toast("Ative o passeio pelas páginas para oferecer um petisco.");
  if (S.coins < 1)
    return toast("Saldo insuficiente: você precisa de 1 gota para o petisco.", false, "worried");
  earn(-1);
  const n = document.getElementById("coinsn");
  if (n) n.textContent = S.coins;
  if (a.pose === "dormindo") acordar(a);
  const W = larguraTela(),
    chao = chaoPasseio();
  const alvo = Math.max(
    20,
    Math.min(W - 40, a.x < W / 2 ? W * (0.6 + Math.random() * 0.3) : W * (0.1 + Math.random() * 0.3))
  );
  const p = document.createElement("span");
  p.className = "pet-petisco";
  p.style.transform = `translate(${W / 2}px, ${chao - 140}px)`;
  camadaPasseio().appendChild(p);
  void p.offsetWidth;
  p.style.transition = "transform .7s cubic-bezier(.3,.7,.5,1)";
  p.style.transform = `translate(${alvo}px, ${chao + PET_TAM * 0.6}px)`;
  a.ancora = null;
  a.preso = true;
  setTimeout(
    () =>
      andarAte(
        a,
        alvo - PET_TAM * 0.5,
        chao,
        () => {
          p.remove();
          a.preso = false;
          a.pet.comeuEm = Math.min(Date.now(), a.pet.comeuEm + 3 * 36e5);
          cuidou(a.pet);
          reagir(a, "comendo", 1400);
          setTimeout(() => reagir(a, "feliz", 1000), 1400);
          marcarMomento(a.pet, "Pegou o petisco no ar", "comendo");
          persist();
        },
        { vel: 3, pose: "correndo" }
      ),
    300
  );
}

/* 10. som de ronronar quando você segura o pet */
function somRonronar() {
  if (!S.notif.som || typeof pegarAudio !== "function") return;
  const ctx = pegarAudio();
  if (!ctx || typeof ruido !== "function") return;
  const t = ctx.currentTime;
  const f = ctx.createBufferSource();
  f.buffer = ruido(ctx, 2);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 180;
  const g = ctx.createGain();
  g.gain.value = 0;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 24;
  const lg = ctx.createGain();
  lg.gain.value = 0.18;
  lfo.connect(lg).connect(g.gain);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.6, t + 0.2);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
  f.connect(filtro).connect(g).connect(env).connect(ctx.destination);
  f.start(t);
  lfo.start(t);
  f.stop(t + 1.6);
  lfo.stop(t + 1.6);
}
{
  const desenharAntes = desenharAgente;
  desenharAgente = function (a, pose = a.pose) {
    if (
      pose === "ronronando" &&
      a.pose !== "ronronando" &&
      ["gato", "coelho", "hamster", "raposa", "coala"].includes(a.pet.especie)
    )
      somRonronar();
    desenharAntes(a, pose);
    // 25. plaquinha com nome e humor
    a.el.title = a.visitante
      ? `Pet de ${a.pet.dono}`
      : `${a.pet.nome} · barriga ${Math.round(fomePet(a.pet))}% · felicidade ${humorPet(a.pet)}%`;
    if (a.presente)
      a.el.insertAdjacentHTML("beforeend", `<span class="pet-presente" aria-hidden="true"></span>`);
  };
}

/* 11. tonto com rolagem muito rápida */
{
  let ultimoY = scrollY,
    ultimoT = Date.now(),
    tontoEm = 0;
  addEventListener(
    "scroll",
    () => {
      const agora = Date.now(),
        vel = Math.abs(scrollY - ultimoY) / Math.max(1, agora - ultimoT);
      ultimoY = scrollY;
      ultimoT = agora;
      if (vel > 4 && agora - tontoEm > 30000) {
        const a = agentePrincipal();
        if (!livre(a)) return;
        tontoEm = agora;
        setTimeout(() => {
          reagir(a, "girando", 1600);
          petFala(a, "Ai, tô tonto...", 1800);
        }, 400);
      }
    },
    { passive: true }
  );
}

/* 12. soneca se você some 5 minutos (e acorda se espreguiçando) */
let ultimaAcao = Date.now();
for (const tipo of ["pointerdown", "keydown", "wheel"])
  addEventListener(tipo, () => (ultimaAcao = Date.now()), { passive: true });
function acordar(a) {
  a.balao = "";
  a.sonecaParada = false;
  a.sonecaManual = false;
  a.ocupadoAte = 0;
  reagir(a, "espreguicando", 1600);
  setTimeout(() => petFala(a, "Uaaah... voltei!", 1500), 300);
}
function conferirSoneca() {
  const a = agentePrincipal();
  if (!a || document.hidden) return;
  if (Date.now() - ultimaAcao > 5 * 60e3 && livre(a) && !a.sonecaParada) {
    a.sonecaParada = true;
    a.ancora = null;
    a.balao = sonhoSVG(a.pet);
    desenharAgente(a, "dormindo");
    a.ocupadoAte = Date.now() + 10 * 60e3;
  } else if (a.sonecaParada && Date.now() - ultimaAcao < 3000) acordar(a);
}
setInterval(conferirSoneca, 3000);

/* 13. olha você escrever uma tarefa */
{
  let olhouEm = 0;
  document.addEventListener("input", e => {
    if (e.target.id !== "q" || Date.now() - olhouEm < 120000) return;
    const a = agentePrincipal();
    if (!livre(a)) return;
    olhouEm = Date.now();
    reagir(a, "sentado", 3000);
    petFala(a, pick(["O que vai ser?", "Anota aí!", "Hmm, interessante..."]), 2200);
  });
}

/* 14. sobe na tarefa que você concluiu */
document.addEventListener("prumo:concluiu", ev => {
  const a = agentePrincipal();
  if (!livre(a) || rolouAgora() || !ev.detail) return;
  setTimeout(() => {
    const li = document.querySelector(`[data-act="toggle"][data-id="${ev.detail.id}"]`);
    const item = li && li.closest("li");
    if (!item) return;
    const r = item.getBoundingClientRect();
    if (r.top < 70 || r.top > chaoPasseio() - 40) return;
    a.ancora = { el: item, dx: Math.min(r.width - PET_TAM, 40) };
    a.x = r.left + a.ancora.dx;
    a.y = r.top - PET_TAM * 0.8;
    desenharAgente(a, "pulando");
    posicionar(a, true, 0.45);
    setTimeout(() => desenharAgente(a, "feliz"), 450);
    a.ocupadoAte = Date.now() + 3500;
  }, 1100);
});

/* 15, 16, 17. desmarcar, apagar e fechar o dia */
document.addEventListener(
  "click",
  ev => {
    const b = ev.target.closest && ev.target.closest("[data-act]");
    if (!b) return;
    const a = agentePrincipal();
    if (!livre(a)) return;
    const act = b.dataset.act;
    if (act === "toggle" && b.getAttribute("aria-pressed") === "true") {
      setTimeout(() => {
        reagir(a, "triste", 1600);
        petFala(a, "Ué, voltou?", 1400);
      }, 200);
    } else if (act === "del" && b.dataset.list === "tasks") {
      a.x = Math.max(4, a.x - 30 * a.dir);
      reagir(a, "pulando", 700);
      posicionar(a, true, 0.25);
      petFala(a, "Ih, sumiu!", 1200);
    } else if (act === "closeday") {
      setTimeout(() => {
        reagir(a, "dancando", 2600);
        petFala(a, "Dia fechado! Bora descansar.", 2200);
      }, 300);
    }
  },
  true
);

/* 18. bebe água junto (potinho azul) */
document.addEventListener("prumo:agua", ev => {
  const a = agentePrincipal();
  if (!livre(a) || (ev.detail && ev.detail.meta)) return;
  const p = document.createElement("span");
  p.className = "pet-pote agua";
  p.style.transform = `translate(${Math.round(a.x + (a.dir > 0 ? PET_TAM * 0.8 : -16))}px, ${Math.round(a.y + PET_TAM * 0.62)}px)`;
  camadaPasseio().appendChild(p);
  setTimeout(() => {
    p.classList.add("vazio");
    setTimeout(() => p.remove(), 700);
  }, 1400);
});

/* 19. mimo de amigo */
if (typeof receberItem === "function") {
  const receberAntes = receberItem;
  receberItem = function (i) {
    receberAntes(i);
    const a = agentePrincipal();
    if (i && i.tipo === "mimo" && livre(a)) {
      reagir(a, "pulando", 1200);
      somDoPet(a.pet);
      petFala(a, "Chegou mimo!", 1600);
    }
  };
}

/* 20. pula junto quando o Prumi comemora */
{
  const reactAntes = react;
  react = function (mood, ...resto) {
    reactAntes(mood, ...resto);
    if (mood === "party") {
      const a = agentePrincipal();
      if (livre(a) && Math.random() < 0.6) setTimeout(() => reagir(a, "pulando", 900), 200);
    }
  };
}

/* 21. dança com o som ambiente do foco; 26. curioso fareja o cursor; 23, 24, 27, 28 */
let ultimaInteracaoPet = Date.now();
document.addEventListener(
  "click",
  ev => ev.target.closest && ev.target.closest(".pet-agente") && (ultimaInteracaoPet = Date.now()),
  true
);
setInterval(() => {
  const a = agentePrincipal();
  if (!a || document.hidden || !S.onboarded) return;
  const agora = Date.now();
  const hoje = today();
  const p = petsDados();
  if (!p.interacoes || p.interacoes.dia !== hoje) p.interacoes = { dia: hoje };
  const marcas = p.interacoes;
  // 21
  if (typeof chuva !== "undefined" && chuva && livre(a) && agora > a.ocupadoAte && Math.random() < 0.3)
    reagir(a, "dancando", 2000);
  // 26
  if (
    a.pet.personalidade === "curioso" &&
    livre(a) &&
    agora > a.ocupadoAte &&
    ponteiro.x > 0 &&
    agora - ponteiro.em > 2500 &&
    agora - ponteiro.em < 8000 &&
    Math.random() < 0.25
  ) {
    const alvo = Math.max(4, Math.min(larguraTela() - PET_TAM - 4, ponteiro.x - PET_TAM / 2));
    andarAte(a, alvo, chaoPasseio(), () => {
      reagir(a, "sentado", 1800);
      petFala(a, "Snif snif...", 1400);
    });
  }
  // 23 pede carinho depois das 18h se ainda não teve
  if (
    new Date().getHours() >= 18 &&
    !(a.pet.carinhos[hoje] > 0) &&
    !marcas.pediu &&
    livre(a) &&
    !dormindoAgora()
  ) {
    marcas.pediu = true;
    persist(true);
    andarAte(a, larguraTela() / 2 - PET_TAM / 2, chaoPasseio(), () => {
      reagir(a, "sentado", 3000);
      petFala(a, "Hoje ainda não teve carinho...", 3000);
    });
  }
  // 24 traz presente quando muito feliz
  if (humorPet(a.pet) >= 80 && !marcas.presente && !a.presente && livre(a) && Math.random() < 0.04) {
    marcas.presente = true;
    a.presente = true;
    persist(true);
    desenharAgente(a);
    petFala(a, "Trouxe uma coisa pra você!", 2400);
  }
  // 28 dramático ignorado por mais de 1 hora
  if (
    a.pet.personalidade === "dramatico" &&
    agora - ultimaInteracaoPet > 60 * 60e3 &&
    livre(a) &&
    !marcas.desmaio
  ) {
    marcas.desmaio = true;
    persist(true);
    reagir(a, "fingindo", 4000);
    petFala(a, "Ninguém me ama... (desmaiei)", 3200);
  }
  // 27 pega-pega entre dois pets
  const agentes = [...passeio.agentes.values()].filter(
    x => !x.escondido && !x.el.hidden && livre(x) && !x.visitante
  );
  if (agentes.length >= 2 && Math.random() < 0.06) {
    const [x, y] = agentes;
    const W = larguraTela();
    const fuga = x.x < W / 2 ? W - PET_TAM - 10 : 10;
    petFala(x, "Pega eu!", 1200);
    andarAte(x, fuga, chaoPasseio(), () => reagir(x, "pulando", 900), { vel: 3, pose: "correndo" });
    setTimeout(
      () =>
        andarAte(
          y,
          fuga + (fuga > W / 2 ? -PET_TAM : PET_TAM),
          chaoPasseio(),
          () => reagir(y, "feliz", 1200),
          { vel: 3, pose: "correndo" }
        ),
      400
    );
  }
}, 7000);

/* 24. pegar o presente */
{
  const tocarAntes = tocarAgente;
  tocarAgente = function (a) {
    if (a.presente && !a.ignorarClique) {
      a.presente = false;
      const tipo = pick(["flor", "folha", "bolinha", "bilhete"]);
      const p = petsDados();
      if (!Array.isArray(p.lembrancas)) p.lembrancas = [];
      p.lembrancas.push({ tipo, de: "você", pet: a.pet.nome, em: today() });
      p.lembrancas = p.lembrancas.slice(-12);
      earn(2, a.el);
      marcarMomento(a.pet, "Me deu um presente", "feliz");
      persist();
      reagir(a, "feliz", 1500);
      return toast(`${a.pet.nome} te deu um presente! +2 gotas`, false, "happy");
    }
    if (a.pose === "dormindo" && (a.sonecaParada || a.sonecaManual)) return acordar(a);
    tocarAntes(a);
  };
}

/* 22. bom dia e boa noite ao abrir o app */
document.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    const a = agentePrincipal();
    if (!livre(a)) return;
    const h = new Date().getHours();
    if (h >= 5 && h < 11) {
      reagir(a, "espreguicando", 1800);
      petFala(a, pick(["Bom dia!", "Uaaah, bom dia!", "Acordou! Bora?"]), 2200);
    } else if (h >= 22 || h < 2) {
      reagir(a, "bocejando", 1800);
      petFala(a, "Tô com soninho...", 2000);
    }
  }, 2600)
);

/* botões no painel do pet */
ACOES_EXTRAS["pet-chamar"] = (b, id) => chamarPet(id);
ACOES_EXTRAS["pet-seguir"] = (b, id) => vemComigo(id);
ACOES_EXTRAS["pet-jogar-petisco"] = (b, id) => jogarPetisco(id);
function brincarHTML(x) {
  return `<h3 class="h3">Brincar</h3><div class="cm-botoes"><button class="btn small" data-act="pet-chamar" data-id="${x.id}">Chamar ${esc(x.nome)}</button><button class="btn small" data-act="pet-seguir" data-id="${x.id}">Vem comigo</button><button class="btn small" data-act="pet-jogar-petisco" data-id="${x.id}">Jogar petisco (1)</button></div>
  <details class="more jeitos-brincar"><summary>Jeitos de brincar</summary><ul>
    <li><b>Um toque</b>: carinho. <b>Dois</b>: truque. <b>Três rápidos</b>: cócegas.</li>
    <li><b>Segurar parado</b>: ronrona. <b>Segurar e arrastar</b>: leva pra onde quiser.</li>
    <li><b>Esfregar com o mouse</b>: barriguinha pra cima.</li>
    <li><b>Botão direito</b> nele: menu. <b>Tecla P</b>: chama o pet.</li>
    <li>Ele olha pra onde você aponta, toma água junto, sobe na tarefa que você conclui e comemora quando você fecha o dia.</li>
  </ul></details>`;
}
