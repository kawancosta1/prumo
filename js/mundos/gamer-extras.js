/*
  Mundo Gamer, extras:
  - Boss da semana: um chefão novo toda segunda com 100 de vida. Tarefa feita bate 10 (prioridade alta 20),
    meta de água bate 10 por dia e cada 10 minutos de foco bate 3. Derrotou? +25 gotas de loot.
  - Combo: tarefas concluídas com menos de 20 minutos entre si somam combo (x2, x3...).
  - Moeda de 8 bits ao concluir e fliperama baixinho no foco. Pixels caindo na troca de aba.
*/
"use strict";

const BOSSES = [
  { nome: "Dragão da Procrastinação", cor: "#E53935", olho: "#FFEB3B" },
  { nome: "Slime do Sono", cor: "#7CB342", olho: "#212121" },
  { nome: "Golem da Preguiça", cor: "#8D6E63", olho: "#00E5FF" },
  { nome: "Hidra das Notificações", cor: "#7E57C2", olho: "#FF4081" },
  { nome: "Fantasma do Prazo", cor: "#B0BEC5", olho: "#212121" }
];

function bossDados() {
  const d = dadosMundo("gamer");
  const semana = mondayOf(today());
  if (d.semana !== semana) {
    const idx = Math.floor(new Date(semana + "T12:00:00").getTime() / (7 * 864e5)) % BOSSES.length;
    d.semana = semana;
    d.boss = idx;
    d.vida = 100;
    d.log = [];
    d.vencido = false;
    d.aguaDias = [];
    d.focoMin = 0;
  }
  if (!Array.isArray(d.log)) d.log = [];
  if (!Array.isArray(d.aguaDias)) d.aguaDias = [];
  d.vencidos = Math.max(0, Math.round(+d.vencidos || 0));
  return d;
}

function baterNoBoss(dano, motivo) {
  const d = bossDados();
  if (d.vencido || dano <= 0) return;
  d.vida = Math.max(0, d.vida - dano);
  d.log = [`-${dano} ${motivo}`, ...d.log].slice(0, 4);
  if (d.vida === 0) {
    d.vencido = true;
    d.vencidos++;
    earn(25);
    setTimeout(() => {
      notificar({
        titulo: "Boss derrotado!",
        texto: `${BOSSES[d.boss].nome} caiu. +25 gotas de loot.`,
        mood: "party",
        tipo: "conquista",
        aba: "hoje"
      });
      bigConfetti();
    }, 1200);
  }
}

/** Boss em pixel art (grade 12x10), com a cor do chefão da semana. */
function bossSVG(b, vida, vencido) {
  const mapa = [
    "....XXXX....",
    "..XXXXXXXX..",
    ".XXXXXXXXXX.",
    "XXOOXXXXOOXX",
    "XXOOXXXXOOXX",
    "XXXXXXXXXXXX",
    "XXXMMMMMMXXX",
    ".XXXXXXXXXX.",
    ".XX.XXXX.XX.",
    "XX..XX..XX.."
  ];
  let px = "";
  mapa.forEach((linha, y) =>
    [...linha].forEach((c, x) => {
      if (c === ".") return;
      const cor = c === "O" ? b.olho : c === "M" ? "#212121" : b.cor;
      px += `<rect x="${x * 6}" y="${y * 6}" width="6" height="6" fill="${cor}"/>`;
    })
  );
  return `<svg class="cm-cena boss ${vencido ? "vencido" : ""}" viewBox="0 0 320 110" role="img" aria-label="${b.nome}, ${vida} de vida">
    <rect width="320" height="110" fill="#14141F"/>${[...Array(20)].map((_, i) => `<rect x="${(i * 37) % 320}" y="${(i * 23) % 70}" width="2" height="2" fill="#fff" opacity=".4"/>`).join("")}
    <rect y="96" width="320" height="14" fill="#2E2E44"/>${[...Array(20)].map((_, i) => `<rect x="${i * 16}" y="96" width="8" height="4" fill="#3D3D5C"/>`).join("")}
    <g transform="translate(124 32)"><g class="boss-corpo">${px}</g></g>
    ${vencido ? `<text x="160" y="24" text-anchor="middle" font-family="'Press Start 2P',monospace" font-size="10" fill="#FFEB3B">VITÓRIA!</text>` : ""}
    <rect x="12" y="10" width="100" height="10" fill="#2E2E44" stroke="#fff" stroke-width="1"/><rect x="13" y="11" width="${(98 * vida) / 100}" height="8" fill="${vida > 50 ? "#43A047" : vida > 20 ? "#FDD835" : "#E53935"}"/><text x="118" y="19" font-family="'Press Start 2P',monospace" font-size="7" fill="#fff">${vida} HP</text>
  </svg>`;
}

function moeda8bits(ctx, saida, t) {
  tocarTom(ctx, saida, t, 988, 0.08, "square", 0.08, 0.002);
  tocarTom(ctx, saida, t + 0.08, 1319, 0.35, "square", 0.08, 0.002);
}

MUNDO_FX.gamer = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "cair",
      n: 18,
      tam: [8, 16],
      dur: [0.9, 1.5],
      cores: ["#00E5FF", "#FF4081", "#C6FF00", "#FFEB3B", "#7C4DFF"],
      formas: [`<rect x="4" y="4" width="16" height="16" fill="currentColor"/>`]
    }),
  confete: {
    cores: ["#00E5FF", "#FF4081", "#C6FF00", "#FFEB3B", "#7C4DFF"],
    formas: ["pixel", "pixel", "moeda", "estrela"]
  },
  musicas: {
    party: "Tema da vitória (8 bits)",
    happy: "Fase 1-1",
    idle: "Tela de título",
    upset: "Game over",
    sad: "Continue? 10... 9...",
    cry: "Fase da água"
  },
  subnicks: [
    "GG EZ",
    "~ upando de nível ~",
    "speedrun da rotina",
    "sem lag, só foco",
    "achievement desbloqueado"
  ],
  humorNomes: {
    Radiante: "Modo lendário",
    Feliz: "Upando",
    "De boa": "No lobby",
    Chateado: "Com lag",
    Triste: "Game over",
    Arrasado: "Sem vidas"
  },
  humorExtra(soma) {
    const d = bossDados();
    if (d.vencido) soma(4, "boss derrotado");
    if ((d.combo || 0) >= 3) soma(2, "combo ativo");
  },
  aoConcluir(x) {
    const d = bossDados();
    baterNoBoss(x.prio === 3 ? 20 : 10, "tarefa");
    // combo
    const agora = Date.now();
    d.combo = d.ultimaTarefa && agora - d.ultimaTarefa < 20 * 60e3 ? (d.combo || 1) + 1 : 1;
    d.ultimaTarefa = agora;
    if (d.combo >= 2) setTimeout(() => react("party", `<b>COMBO x${d.combo}!</b>`, 2200), 1300);
  },
  legendasFotolog: [
    "eu e o controle",
    "{n} quests completas hoje",
    "{ml} de poção de mana",
    "headset no ouvido, foco no jogo",
    "{nome} no ranking"
  ],
  textos: {
    diario: "Log da partida",
    diarioDica: "Como foi a partida de hoje? Qual quest foi difícil?",
    foco: "Modo foco (sem lag)",
    tarefas: "Quests de hoje",
    adicionar: "Aceitar quest",
    vazioHoje: "Nenhuma quest aceita. Abre o mapa e pega a primeira.",
    atrasadas: "Quests esquecidas",
    trazerTudo: "Pegar tudo hoje",
    fecharDia: "Salvar o jogo",
    diaFechado: "Jogo salvo. GG!",
    reabrir: "Continuar partida",
    diaPerfeito: "Run perfeita",
    adicionarHabito: "Pôr nas dailies",
    vazioHabitos: "Nenhuma daily ainda. Todo jogador tem suas missões diárias.",
    conviteTitulo: "Todo jogador precisa de um duo.",
    conviteBotao: "Chamar pro duo",
    pedidoChegou: "quer jogar em duo com você. Aceita?",
    conviteTexto: "Bora jogar de duo no Prumo!",
    sonsTitulo: "Sons do fliperama",
    somFoco: "Fliperama",
    somFocoNome: "Fliperama baixinho",
    somFocoDica: "Zumbido de fliperama e bipes soltos enquanto o cronômetro roda.",
    somTarefa: "Moeda",
    somTarefaNome: "Moeda de 8 bits",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const d = bossDados();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><rect x="2" y="9" width="20" height="6" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="3.5" y="10.5" width="${(17 * d.vida) / 100}" height="3" fill="${d.vida > 50 ? "#43A047" : d.vida > 20 ? "#FDD835" : "#E53935"}"/></svg><small>${d.vencido ? "Boss derrotado" : `Boss ${d.vida} HP`}</small></span>`;
  },
  secaoHoje() {
    const d = bossDados();
    const b = BOSSES[d.boss];
    // água do dia bate no boss uma vez
    if (waterToday() >= S.waterGoal && !d.aguaDias.includes(today())) {
      d.aguaDias.push(today());
      baterNoBoss(10, "meta de água");
      setTimeout(() => persist(true), 0);
    }
    return cartaoMundo(
      "cm-boss",
      "Boss da semana",
      `<b>${b.nome}</b>. ` +
        (d.vencido
          ? `Derrotado! ${d.vencidos} ${d.vencidos === 1 ? "boss vencido" : "bosses vencidos"} no total. O próximo chega na segunda.`
          : "Tarefa bate 10 (prioridade alta 20), água bate 10, foco bate 3 a cada 10 min."),
      `${bossSVG(b, d.vida, d.vencido)}${d.log.length ? `<ul class="cm-lista cm-mono">${d.log.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}`
    );
  }
};

// foco também bate no boss (a cada 10 minutos registrados). logTimer só existe depois de js/tempo.js.
document.addEventListener("DOMContentLoaded", () => {
  if (typeof logTimer !== "function") return;
  const logAntesGamer = logTimer;
  logTimer = function () {
    const min = Math.round(elapsed() / 6e4);
    logAntesGamer();
    if (S.persona === "gamer" && min >= 10) {
      baterNoBoss(Math.floor(min / 10) * 3, `${min} min de foco`);
      persist();
    }
  };
});

SONS_MUNDO.gamer = {
  concluir: moeda8bits,
  ambiente: ctx => {
    const zumbido = ambienteRuido(ctx, { freq: 120, tipo: "lowpass", vol: 0.05 });
    const notas = [523, 659, 784, 1047, 784, 659];
    let i = 0;
    const parar = repetirSom(
      () =>
        tocarTom(
          ctx,
          zumbido.saida,
          ctx.currentTime + 0.02,
          notas[i++ % notas.length],
          0.12,
          "square",
          0.25,
          0.002
        ),
      2200,
      5200
    );
    return { parar: () => (parar(), zumbido.parar()) };
  }
};

ITEMS.push(
  {
    id: "gamer_capacete",
    p: "gamer",
    slot: "hat",
    name: "Elmo de pixel",
    price: 160,
    svg: () =>
      `<g fill="#90A4AE" stroke="var(--ink)" stroke-width="1.6">${[
        [36, 30],
        [42, 18],
        [48, 12],
        [54, 12],
        [60, 12],
        [66, 12],
        [72, 18],
        [78, 30]
      ]
        .map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="${46 - y}"/>`)
        .join(
          ""
        )}</g><rect x="56" y="4" width="8" height="10" fill="#E53935" stroke="var(--ink)" stroke-width="1.4"/>`
  },
  {
    id: "gamer_oculos_pixel",
    p: "gamer",
    slot: "face",
    name: "Óculos de pixel",
    price: 110,
    svg: () =>
      `<g fill="#111">${[
        [32, 58, 26, 4],
        [36, 62, 18, 4],
        [40, 66, 10, 4],
        [62, 58, 26, 4],
        [66, 62, 18, 4],
        [70, 66, 10, 4],
        [56, 58, 8, 4]
      ]
        .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`)
        .join(
          ""
        )}</g><rect x="38" y="62" width="4" height="4" fill="#fff"/><rect x="68" y="62" width="4" height="4" fill="#fff"/>`
  },
  {
    id: "gamer_espada",
    p: "gamer",
    slot: "hand",
    name: "Espada de pixel",
    price: 130,
    svg: (x, y) =>
      H(
        x,
        y,
        `<g stroke="var(--ink)" stroke-width="1"><rect x="0" y="-30" width="6" height="26" fill="#CFD8DC"/><rect x="2" y="-34" width="2" height="4" fill="#CFD8DC"/><rect x="-6" y="-4" width="18" height="4" fill="#FFB300"/><rect x="1" y="0" width="4" height="8" fill="#6D4C41"/></g>`
      )
  },
  {
    id: "gamer_mvp",
    p: "gamer",
    slot: "neck",
    name: "Medalha de MVP",
    price: 120,
    svg: () =>
      `<path d="M42 84L54 104M78 84L66 104" stroke="#1E88E5" stroke-width="5"/><circle cx="60" cy="108" r="9" fill="#FFC107" stroke="#B7892B" stroke-width="1.4"/><text x="60" y="111" text-anchor="middle" font-size="6.5" font-weight="900" fill="#7A5A00" font-family="monospace">MVP</text>`
  },
  {
    id: "gamer_armadura",
    p: "gamer",
    slot: "top",
    name: "Armadura de pixel",
    price: 170,
    svg: () =>
      topBase("#78909C") +
      [...Array(6)]
        .map(
          (_, i) =>
            `<rect x="${i * 20}" y="${96 + (i % 2) * 10}" width="20" height="10" fill="#90A4AE" stroke="#546E7A" stroke-width="1"/>`
        )
        .join("") +
      `<rect x="52" y="104" width="16" height="16" fill="#FFB300" stroke="#546E7A"/>`
  },
  {
    id: "gamer_slime",
    p: "gamer",
    slot: "pet",
    name: "Slime",
    price: 140,
    svg: () =>
      `<g transform="translate(15 132)"><path d="M-11 4Q-12 -10 0 -12Q12 -10 11 4Z" fill="#7CB342" stroke="var(--ink)" stroke-width="1.1" opacity=".92"/><ellipse cx="-4" cy="-6" rx="2.4" ry="1.6" fill="#fff" opacity=".6"/><circle cx="-3" cy="-2" r="1.3" fill="#141416"/><circle cx="4" cy="-2" r="1.3" fill="#141416"/><path d="M-1 1q1.5 1.4 3 0" stroke="#141416" stroke-width=".9" fill="none"/></g>`
  }
);
