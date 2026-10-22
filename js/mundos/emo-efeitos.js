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

/* ---------- Sangue escorrendo do topo ao trocar de aba ----------
  Tudo fica dentro de um filtro "goo": borrões e círculos se fundem como líquido.
  Cada fio é um corpo que cresce para baixo (scaleY) com uma ponta redonda que desce junto,
  cada um com velocidade própria e desacelerando no fim. Alguns soltam uma gota que cai. */
function sangueEscorrendo() {
  if (RM) return;
  const antigo = document.getElementById("sangue");
  if (antigo) antigo.remove();
  const W = document.documentElement.clientWidth || innerWidth;
  const H = Math.round(Math.min(innerHeight * 0.55, 380));
  const r = (a, b) => a + Math.random() * (b - a);
  const f = n => n.toFixed(1);

  // Faixa do topo com a borda de baixo cheia de bolhas (o filtro junta tudo)
  let poca = `<rect class="faixa" x="-20" y="-30" width="${W + 40}" height="${f(r(36, 40))}"/>`;
  for (let x = -6; x < W + 10; x += r(7, 15)) {
    poca += `<circle class="faixa" cx="${f(x)}" cy="${f(r(7, 12))}" r="${f(r(3, 7.5))}"/>`;
  }

  // Fios escorrendo: a maioria curta, poucos bem longos
  let fios = "";
  let brilhos = "";
  const n = Math.max(6, Math.round(W / 24));
  let x = r(4, 14);
  for (let i = 0; i < n && x < W - 4; i++) {
    const w = r(2.2, 5.2); // meia largura do fio
    const comp = Math.round(16 + Math.pow(Math.random(), 1.8) * (H * 0.62));
    const dur = (0.9 + comp / 150 + r(0, 0.6)).toFixed(2);
    const atraso = r(0.15, 0.75).toFixed(2);
    const torto = r(-1.5, 1.5);
    const ponta = w * r(1.15, 1.45);
    // corpo: largo no topo, afina e engrossa de novo perto da ponta
    const corpo =
      `M${f(x - w * 1.6)} 0C${f(x - w)} ${f(comp * 0.25)} ${f(x - w * 0.6 + torto)} ${f(comp * 0.6)} ${f(x - w * 0.85 + torto)} ${comp}` +
      `H${f(x + w * 0.85 + torto)}C${f(x + w * 0.6 + torto)} ${f(comp * 0.6)} ${f(x + w)} ${f(comp * 0.25)} ${f(x + w * 1.6)} 0Z`;
    const t = `--t:${dur}s;--d:${atraso}s;--y:${comp}px`;
    fios += `<path class="fio" d="${corpo}" style="${t}"/>`;
    fios += `<circle class="ponta" cx="${f(x + torto)}" cy="0" r="${f(ponta)}" style="${t}"/>`;
    if (comp > 40 && Math.random() < 0.5) {
      // gota que se solta quando o fio termina de escorrer
      const solta = (Number(atraso) + Number(dur) * 0.9).toFixed(2);
      fios += `<circle class="pingo" cx="${f(x + torto)}" cy="0" r="${f(ponta * 0.9)}" style="--d:${solta}s;--y:${comp}px;--q:${Math.round(r(90, 170))}px"/>`;
    }
    // reflexo de luz na ponta (fora do filtro para ficar nítido)
    brilhos += `<circle class="brilho" cx="${f(x + torto - ponta * 0.35)}" cy="${f(-ponta * 0.3)}" r="${f(ponta * 0.32)}" style="${t}"/>`;
    x += r(10, 44);
  }

  const camada = document.createElement("div");
  camada.id = "sangue";
  camada.style.zIndex = "1";
  camada.setAttribute("aria-hidden", "true");
  camada.innerHTML =
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<defs><filter id="sangue-goo" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur stdDeviation="2.6"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -9"/></filter>` +
    `<linearGradient id="sangue-cor" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${Math.round(H * 0.7)}">` +
    `<stop offset="0" class="c1"/><stop offset="0.25" class="c2"/><stop offset="1" class="c3"/></linearGradient></defs>` +
    `<g filter="url(#sangue-goo)" fill="url(#sangue-cor)">${poca}${fios}</g>${brilhos}</svg>`;
  document.body.insertBefore(camada, document.body.firstChild);
  setTimeout(() => camada.remove(), 4200);
}

/* ---------- Rastro de brilho no cursor e no toque (só no subtema Scene colorido) ---------- */
let ultimoBrilho = 0;
document.addEventListener(
  "pointermove",
  e => {
    const raiz = document.documentElement;
    if (RM || raiz.dataset.mundo !== "emo" || raiz.dataset.variante !== "scene") return;
    const agora = Date.now();
    if (agora - ultimoBrilho < 45) return; // no máximo ~22 brilhos por segundo
    ultimoBrilho = agora;
    const b = document.createElement("span");
    b.className = "rastro-brilho";
    b.style.left = e.clientX + "px";
    b.style.top = e.clientY + "px";
    b.style.setProperty("--c", pick(["#FF4FD8", "#4FE3FF", "#FFE14F", "#B6F23C", "#FFFFFF"]));
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 800);
  },
  { passive: true }
);

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

  // Legendas do Fotolog (js/internet2000.js). {n} = tarefas feitas hoje, {ml} = água, {nome} = seu nome
  legendasFotolog: [
    "eu e minha franja contra o mundo",
    "fotinho de cima porque o ângulo não mente =]",
    "{n} tarefas hoje. o vazio perdeu",
    "{ml} de lágrimas filtradas hoje",
    "flash na cara e coração na mão",
    "nem a lua entende esse olhar",
    "xoxo, {nome} rawr",
    "mais um dia sobrevivido no escuro"
  ],

  // Textos trocados neste mundo (a chave é usada em textoMundo("chave", "texto padrão") nas telas)
  textos: {
    diario: "Querido diário",
    diarioDica: "Escreve aqui o que doeu, o que foi bom, o que ficou pra amanhã...",
    foco: "Ensaio da banda",
    sequencia: ["noite seguida", "noites seguidas"],
    // aba Hoje
    tarefas: "Setlist",
    adicionar: "Escrever",
    vazioHoje: "Nenhuma tarefa. Só eu e o vazio.",
    atrasadas: "Assombrando a lista",
    trazerTudo: "Exorcizar tudo pra hoje",
    fecharDia: "Apagar as velas",
    fecharComPendentes: "Mandar {n} pra amanhã e apagar as velas",
    diaFechado: "Velas apagadas. Boa noite.",
    reabrir: "Acender de novo",
    diaPerfeito: "Show esgotado",
    conquista_dia_perfeito: "Show esgotado",
    // outras abas
    adicionarHabito: "Fazer um pacto",
    vazioHabitos: "Nenhum hábito ainda. Até vampiro tem rotina: comece com um.",
    vazioCompromissos: "Agenda vazia. Ninguém me chamou pra sair. Ainda.",
    vazioPessoas: "Ninguém aqui ainda. Adiciona quem te entende de verdade.",
    vazioEstudos: "Nenhum ensaio nesta semana. A banda tá parada.",
    // parceria no tom vampiro
    conviteTitulo: "Vampiro só entra se for convidado.",
    conviteDica: "Você me convida pra entrar? Passe o seu código ou digite o do seu par.",
    conviteBotao: "Convidar pra entrar",
    pedidoChegou: "bateu na sua janela. Você convida pra entrar?",
    // estante de leitura
    notaIcone: "♥",
    livroLido: "Terminou. Mais uma história pra chorar junto =] <b>+50 páginas</b>.",
    vazioLeitura: "Nenhum livro aberto. Até vampiro lê no caixão."
  },

  // Hábitos sugeridos na aba Hábitos (um toque adiciona)
  habitosSugeridos: [
    "Passar delineado",
    "Escrever no diário",
    "Dormir antes das 3h",
    "Ouvir um álbum inteiro"
  ],

  // Botão "Poema do dia" no diário: junta versos inventados
  poemaDoDia() {
    const abre = [
      "A lua",
      "Meu delineado",
      "A chuva",
      "O silêncio do quarto",
      "Meu caderno",
      "A franja",
      "O fone sem bateria",
      "A vela",
      "Meu coração de vampiro",
      "O ônibus das seis"
    ];
    const faz = [
      "escorre devagar",
      "chora baixinho",
      "me entende",
      "sussurra seu nome",
      "não dorme",
      "pinta tudo de cinza",
      "guarda segredo",
      "dança sozinho",
      "brilha no escuro",
      "esquece de mim"
    ];
    const onde = [
      "na janela embaçada",
      "às três da manhã",
      "no fim da playlist",
      "entre uma tarefa e outra",
      "debaixo do edredom",
      "na última página",
      "no reflexo do espelho",
      "no caminho de casa"
    ];
    const fecho = [
      "e mesmo assim eu sigo.",
      "mas hoje eu venci.",
      "e amanhã tem mais.",
      "rawr, fim.",
      "e a água não me abandona.",
      "e ninguém precisa entender.",
      "e tá tudo bem não estar bem.",
      "e eu escrevo pra não esquecer."
    ];
    const titulo = ["Noite", "Delineado", "Segunda-feira", "Chuva", "Eu", "Velas", "Lua"];
    const a = pick(abre);
    const b = pick(abre.filter(x => x !== a));
    return `~ ${pick(titulo)} ~\n${a} ${pick(faz)}\n${pick(onde)},\n${b} ${pick(faz)}\n${pick(fecho)}`;
  },

  // Resumo da semana como mixtape: cada tarefa feita ou conquista da semana vira uma faixa inventada
  resumoSemana() {
    const fim = today(),
      inicio = mondayOf(fim);
    const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    const molde = [
      t => `"${t}" (versão acústica)`,
      t => `Balada pra ${t}`,
      t => `${t} às 3 da manhã`,
      t => `Eu e ${t} contra o mundo`,
      t => `${t} (ao vivo no quarto)`,
      t => `Carta para ${t}`,
      t => `${t}, parte 2`
    ];
    const curto = s => (s.length > 26 ? s.slice(0, 25) + "…" : s).toLowerCase();
    const faixas = S.tasks
      .filter(t => t.done && t.date >= inicio && t.date <= fim)
      .slice(0, 9)
      .map(t => ({ nome: molde[hash(t.id) % molde.length](curto(t.title)), h: hash(t.id) }));
    ACHS.filter(a => S.ach[a.id] && S.ach[a.id] >= inicio).forEach(a =>
      faixas.push({ nome: `Hino de ${a.name.toLowerCase()} (faixa bônus)`, h: hash(a.id), bonus: true })
    );
    const tempo = h => `${2 + (h % 3)}:${pad((h >> 3) % 60)}`;
    return `<section class="block mixtape"><details class="more"><summary><svg class="k7" viewBox="-12 -8 24 16" width="30" height="20" aria-hidden="true">${fitaK7("#141416", "#F2EAD3").replace(/var\(--ink\)/g, "#141416")}</svg>Mixtape da semana <span class="count">${faixas.length} ${faixas.length === 1 ? "faixa" : "faixas"}</span></summary>
      ${
        faixas.length
          ? `<span class="note">Lado A · gravada de ${fmtShort(inicio)} até hoje</span><ol class="faixas">${faixas.map(f => `<li class="${f.bonus ? "bonus" : ""}"><span>${esc(f.nome)}</span><span class="mono">${tempo(f.h)}</span></li>`).join("")}</ol>`
          : `<span class="note">Fita virgem. Conclua tarefas para gravar as faixas da semana.</span>`
      }</details></section>`;
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
