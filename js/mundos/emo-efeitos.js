/*
  Efeitos especiais do mundo Emo: sangue na troca de aba, lua real, medo do sol,
  caixão à noite, nomes de humor, bônus noturno e o segredo dos 13 toques.
  A decoração visual (CSS) fica em estilos/mundos/emo.css.
*/
"use strict";

/* ---------- Lua: fase real calculada pela data ---------- */
// Ciclo lunar médio e uma lua nova de referência (6 jan 2000, 18:14 UTC)
const CICLO_LUNAR = 29.530588853;
const LUA_NOVA_REF = Date.UTC(2000, 0, 6, 18, 14);

/** Fase da lua de 0 a 1: 0 = nova, 0.5 = cheia. */
function faseDaLua(data = new Date()) {
  const dias = (data.getTime() - LUA_NOVA_REF) / 864e5;
  return (((dias % CICLO_LUNAR) + CICLO_LUNAR) % CICLO_LUNAR) / CICLO_LUNAR;
}
function nomeDaFase(f) {
  if (f < 0.03 || f > 0.97) return "Lua nova";
  if (f < 0.22) return "Lua crescente";
  if (f < 0.28) return "Quarto crescente";
  if (f < 0.47) return "Crescente gibosa";
  if (f < 0.53) return "Lua cheia";
  if (f < 0.72) return "Minguante gibosa";
  if (f < 0.78) return "Quarto minguante";
  return "Lua minguante";
}
const ehLuaCheia = (data = new Date()) => {
  const f = faseDaLua(data);
  return f >= 0.47 && f <= 0.53;
};

/** Desenha a lua na fase certa (SVG). */
function luaSVG(f, tamanho = 34) {
  const r = 14;
  const crescendo = f < 0.5;
  const rx = Math.abs(Math.cos(2 * Math.PI * f)) * r;
  const varreduraFora = crescendo ? 1 : 0;
  const varreduraDentro = crescendo ? (f < 0.25 ? 0 : 1) : f < 0.75 ? 0 : 1;
  const iluminada =
    f < 0.03 || f > 0.97
      ? ""
      : `<path d="M16 2A${r} ${r} 0 0 ${varreduraFora} 16 30A${rx.toFixed(2)} ${r} 0 0 ${varreduraDentro} 16 2Z" fill="#F2EAD3"/>`;
  return `<svg class="lua" viewBox="0 0 32 32" width="${tamanho}" height="${tamanho}" aria-hidden="true"><circle cx="16" cy="16" r="${r}" fill="#2A2733"/>${iluminada}<circle cx="11" cy="12" r="2" fill="#000" opacity=".08"/><circle cx="19" cy="21" r="1.6" fill="#000" opacity=".08"/></svg>`;
}

/* ---------- Sol e noite (vampiro) ---------- */
const solForte = () => {
  const h = new Date().getHours();
  return h >= 10 && h < 16;
};
const horaDosVampiros = () => {
  const h = new Date().getHours();
  return h >= 19 || h < 5;
};

/* ---------- Segredo: 13 toques seguidos viram morcego ---------- */
let toquesSegredo = [];
function virarMorcego() {
  if (RM) return;
  const voo = document.createElement("div");
  voo.className = "voo-morcego";
  voo.setAttribute("aria-hidden", "true");
  voo.innerHTML = `<svg viewBox="-16 -10 32 20" width="90" height="56"><g class="asas">${bat(0, 0, 1, "#141016")}</g><circle cx="-2" cy="-1" r="1" fill="#E0102E"/><circle cx="2" cy="-1" r="1" fill="#E0102E"/></svg>`;
  document.body.appendChild(voo);
  document.documentElement.classList.add("prumi-sumiu");
  setTimeout(() => {
    voo.remove();
    document.documentElement.classList.remove("prumi-sumiu");
  }, 3200);
}

/* ---------- Sangue escorrendo (fino, irregular, atrás dos cartões) ---------- */
function sangueEscorrendo() {
  if (RM) return;
  const antigo = document.getElementById("sangue");
  if (antigo) antigo.remove();
  const W = innerWidth;
  // Faixa do topo com a borda de baixo irregular
  let borda = `M0 0H${W}V6`;
  for (let x = W; x > 0; x -= 14 + Math.random() * 18) {
    borda += `Q${(x - 7).toFixed(0)} ${(9 + Math.random() * 6).toFixed(1)} ${(x - 16).toFixed(0)} ${(5 + Math.random() * 3).toFixed(1)}`;
  }
  borda += "V0Z";
  // Escorridos: finos, com largura variando e afinando até a ponta
  let escorridos = "";
  let gotas = "";
  const n = Math.round(W / 26);
  for (let i = 0; i < n; i++) {
    const x = Math.random() * W;
    const larg = 1.6 + Math.random() * 3.4; // meia largura no topo
    const comp = 24 + Math.random() * 150;
    const ondula = (Math.random() - 0.5) * 6;
    const d = `M${(x - larg).toFixed(1)} 4C${(x - larg * 0.7 + ondula).toFixed(1)} ${(comp * 0.4).toFixed(0)} ${(x - larg * 0.25).toFixed(1)} ${(comp * 0.75).toFixed(0)} ${x.toFixed(1)} ${comp.toFixed(0)}C${(x + larg * 0.25).toFixed(1)} ${(comp * 0.75).toFixed(0)} ${(x + larg * 0.7 + ondula).toFixed(1)} ${(comp * 0.4).toFixed(0)} ${(x + larg).toFixed(1)} 4Z`;
    const atraso = (Math.random() * 0.35).toFixed(2);
    escorridos += `<path d="${d}" style="animation-delay:${atraso}s"/>`;
    if (Math.random() < 0.45) {
      // gotinha em forma de lágrima que se solta da ponta
      gotas += `<path class="pingo" d="M${x.toFixed(1)} ${(comp + 2).toFixed(0)}q2.6 4.2 0 6.2q-2.6-2 0-6.2z" style="animation-delay:${(0.6 + Number(atraso)).toFixed(2)}s"/>`;
    }
  }
  const camada = document.createElement("div");
  camada.id = "sangue";
  camada.setAttribute("aria-hidden", "true");
  camada.innerHTML = `<svg width="${W}" height="260" viewBox="0 0 ${W} 260"><path class="faixa" d="${borda}"/>${escorridos}${gotas}</svg>`;
  document.body.appendChild(camada);
  setTimeout(() => camada.remove(), 2000);
}

/* ---------- Ganchos usados pelo resto do app ---------- */
MUNDO_FX.emo = {
  trocaAba: sangueEscorrendo,

  // Confete: morcegos, gotas de sangue e pétalas de rosa
  confete: {
    cores: ["#8A0F22", "#B3122E", "#141016", "#5B2E7A", "#E0314F"],
    formas: ["morcego", "morcego", "gota", "petala"]
  },

  // Perfil estilo MySpace: música inventada para cada humor e frases de subnick
  musicas: {
    party: "Hoje eu tô bem (versão acústica)",
    happy: "Sorrindo no escuro",
    idle: "Chuva na janela do ônibus",
    upset: "Ninguém me entende (ao vivo)",
    sad: "Carta que eu nunca mandei",
    cry: "Lágrimas às 3 da manhã"
  },
  subnicks: [
    "~ escrevendo poesia ~",
    "x nada faz sentido x",
    "=( deixa eu ser triste em paz",
    "~ vivendo de lua ~",
    "<3 ouvindo música no escuro <3",
    "rawr significa eu te amo em dinossauro",
    "*-* hoje sim, amanhã não",
    "x_x morto de sono, vivo de noite"
  ],

  // Nomes de humor no jeito emo (a chave é o nome padrão em humor.js)
  humorNomes: {
    Radiante: "Radiante (raro)",
    Feliz: "Quase feliz",
    "De boa": "Melancólico",
    Chateado: "Na bad",
    Triste: "Escrevendo poesia",
    Arrasado: "Chorando no chuveiro"
  },

  // Fatores extras de humor: vampiro fica animado de noite e na lua cheia
  humorExtra(soma) {
    if (horaDosVampiros()) soma(5, "noite: hora dos vampiros");
    if (ehLuaCheia()) soma(5, "lua cheia");
  },

  // Gotas em dobro na lua cheia
  multiplicadorGotas: () => (ehLuaCheia() ? 2 : 1),

  // Textos trocados neste mundo
  textos: {
    diario: "Querido diário",
    diarioDica: "Escreve aqui o que doeu, o que foi bom, o que ficou pra amanhã...",
    foco: "Ensaio da banda",
    sequencia: ["noite seguida", "noites seguidas"]
  },

  // Enfeite no cartão do Prumi: a lua de hoje
  enfeiteHero() {
    const f = faseDaLua();
    const cheia = ehLuaCheia();
    return `<span class="lua-hoje ${cheia ? "cheia" : ""}" title="${nomeDaFase(f)}${cheia ? ": gotas em dobro!" : ""}">${luaSVG(f, 30)}<small>${nomeDaFase(f)}${cheia ? " · gotas x2" : ""}</small></span>`;
  },

  // Camadas extras no desenho do Prumi (só nos Prumis "vivos": Hoje, Água, Foco, Palco)
  camadasPrumi({ mood, temRosto, temCenario }) {
    let fundo = "";
    let rosto = "";
    // À noite, dormindo dentro do caixão
    if (mood === "sleepy" && !temCenario) {
      fundo = `<g class="caixao"><path d="M42 14L78 14L92 42L84 146L36 146L28 42Z" fill="#3A2420" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/><path d="M46 20L74 20L86 43L79 140L41 140L34 43Z" fill="#7A0F24"/><path d="M60 26V44M53 33H67" stroke="#E8C24A" stroke-width="2.4" stroke-linecap="round"/></g>`;
    }
    // De dia, sol forte: óculos escuros automáticos
    if (solForte() && !temRosto && !["sleepy", "cry"].includes(mood)) {
      rosto =
        glasses("#141416") +
        `<path d="M39 60.5h6M66 60.5h6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
    }
    return { fundo, rosto };
  },

  // Toques no Prumi: 13 toques rápidos viram morcego
  aoTocar() {
    const agora = Date.now();
    toquesSegredo = toquesSegredo.filter(t => agora - t < 9000);
    toquesSegredo.push(agora);
    if (toquesSegredo.length < 13) return false;
    toquesSegredo = [];
    virarMorcego();
    if (!S.stats.morcego) {
      S.stats.morcego = 1;
      fx.big = true;
    }
    react("party", "Rawr! Virei morcego por uns segundos. Você descobriu o segredo da noite =]", 4500);
    commit();
    return true;
  }
};
