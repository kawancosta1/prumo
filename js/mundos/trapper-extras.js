/*
  Mundo Trapper, extras:
  - Cofre de joias: cada dia com 3 ou mais tarefas feitas conta pro drip.
    A cada 2 dias assim, libera uma joia nova (7 no total, +15 gotas cada). "Mostrar o drip" faz tudo brilhar.
  - 808 deslizando com chimbal picado ao concluir tarefa e chuva neon com 808 no foco.
  - Diamantes brilhando na troca de aba, falas, humor e roupas novas.
*/
"use strict";

const JOIAS = [
  { id: "anel", nome: "Anel de gelo" },
  { id: "brinco", nome: "Brinco de diamante" },
  { id: "pulseira", nome: "Pulseira tennis" },
  { id: "relogio", nome: "Relógio cravejado" },
  { id: "corrente", nome: "Corrente cubana" },
  { id: "grillz", nome: "Grillz" },
  { id: "coroa", nome: "Coroa de gelo" }
];
const DIAS_POR_JOIA = 2;

function dripDados() {
  const d = dadosMundo("trapper");
  if (!Array.isArray(d.dias)) d.dias = [];
  d.dias = d.dias.filter(x => typeof x === "string").slice(-60);
  d.liberadas = Math.max(0, Math.min(JOIAS.length, Math.round(+d.liberadas || 0)));
  return d;
}
/** Marca hoje como dia de drip (3+ tarefas) e libera joias. Devolve a joia nova, se houver. */
function contarDrip() {
  const d = dripDados();
  if (feitasHoje() < 3 || d.dias.includes(today())) return null;
  d.dias.push(today());
  const deveTer = Math.min(JOIAS.length, Math.floor(d.dias.length / DIAS_POR_JOIA));
  if (deveTer > d.liberadas) {
    d.liberadas = deveTer;
    return JOIAS[deveTer - 1];
  }
  return null;
}

function joiaSVG(id, liberada) {
  const gelo = liberada ? "#E1F5FE" : "#3A3A48";
  const brilho = liberada ? "#FFFFFF" : "#555";
  const metal = liberada ? "#CFD8DC" : "#444";
  const d = {
    anel: `<circle cx="20" cy="26" r="9" fill="none" stroke="${metal}" stroke-width="3"/><path d="M14 16l6-7l6 7l-6 5z" fill="${gelo}" stroke="${brilho}" stroke-width=".8"/>`,
    brinco: `<circle cx="20" cy="12" r="3" fill="none" stroke="${metal}" stroke-width="1.6"/><path d="M13 22l7-8l7 8l-7 10z" fill="${gelo}" stroke="${brilho}" stroke-width=".8"/>`,
    pulseira: `<ellipse cx="20" cy="21" rx="13" ry="8" fill="none" stroke="${metal}" stroke-width="2"/>${[...Array(10)].map((_, i) => `<circle cx="${20 + Math.cos((i / 10) * 6.28) * 13}" cy="${21 + Math.sin((i / 10) * 6.28) * 8}" r="1.8" fill="${gelo}"/>`).join("")}`,
    relogio: `<rect x="17" y="4" width="6" height="32" rx="2" fill="${metal}"/><circle cx="20" cy="20" r="9" fill="${gelo}" stroke="${metal}" stroke-width="2"/><path d="M20 20V14M20 20h4" stroke="#455A64" stroke-width="1.2"/>`,
    corrente: `<path d="M6 6Q20 30 34 6" stroke="${metal}" stroke-width="4" fill="none" stroke-dasharray="4 2"/><rect x="15" y="22" width="10" height="12" rx="2" fill="${gelo}" stroke="${brilho}" stroke-width=".8"/>`,
    grillz: `<path d="M6 16Q20 30 34 16V22Q20 34 6 22Z" fill="${gelo}" stroke="${metal}" stroke-width="1.2"/>${[10, 15, 20, 25, 30].map(x => `<path d="M${x} 18v6" stroke="${metal}" stroke-width=".8"/>`).join("")}`,
    coroa: `<path d="M6 30V12l7 7l7-11l7 11l7-7v18Z" fill="${gelo}" stroke="${metal}" stroke-width="1.4"/><circle cx="20" cy="22" r="2.6" fill="${liberada ? "#E040FB" : "#555"}"/>`
  }[id];
  return `<svg viewBox="0 0 40 40" class="joia ${liberada ? "liberada" : ""}">${d}${liberada ? `<path class="faisca" d="M32 6l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fff"/>` : ""}</svg>`;
}

function sintetizar808(ctx, saida, t, de = 98, para = 55, dur = 0.9, vol = 0.5) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(para, t + 0.25);
  const dist = ctx.createWaveShaper();
  const c = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = i / 128 - 1;
    c[i] = Math.tanh(x * 2.2);
  }
  dist.curve = c;
  const g = envelope(ctx, t, 0.005, dur, vol);
  o.connect(dist).connect(g).connect(saida);
  o.start(t);
  o.stop(t + dur + 0.05);
}

MUNDO_FX.trapper = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "brilhar",
      n: 14,
      tam: [14, 28],
      dur: [0.9, 1.5],
      cores: ["#E1F5FE", "#E040FB", "#80DEEA"],
      formas: [
        `<path d="M4 9L8 3H16L20 9L12 21Z" fill="currentColor" stroke="#fff" stroke-width=".6"/>`,
        `<path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="currentColor"/>`
      ]
    }),
  confete: {
    cores: ["#E1F5FE", "#E040FB", "#7C4DFF", "#80DEEA"],
    formas: ["diamante", "diamante", "estrela", "redondo"]
  },
  musicas: {
    party: "Drip no estúdio (remix)",
    happy: "Ice no pulso",
    idle: "808 no repeat",
    upset: "Autotune desligado",
    sad: "Trap de madrugada",
    cry: "Chuva neon"
  },
  subnicks: [
    "drip infinito",
    "~ 808 no talo ~",
    "gelo no pulso, foco na mente",
    "do zero ao topo",
    "flexin' nas tarefas"
  ],
  humorNomes: {
    Radiante: "No drip",
    Feliz: "Brilhando",
    "De boa": "Chill",
    Chateado: "Sem gelo",
    Triste: "Trap triste",
    Arrasado: "Apagado"
  },
  humorExtra(soma) {
    if (dripDados().dias.includes(today())) soma(3, "dia de drip");
    if (new Date().getHours() >= 22) soma(2, "madrugada no estúdio");
  },
  aoConcluir() {
    setTimeout(() => {
      const nova = contarDrip();
      if (nova) {
        earn(15);
        notificar({
          titulo: "Joia nova no cofre",
          texto: `${nova.nome} liberada! +15 gotas.`,
          mood: "party",
          tipo: "conquista",
          aba: "hoje"
        });
        persist();
        softRender();
      } else if (feitasHoje() === 3) react("party", "Dia de drip garantido!", 2600);
    }, 1300);
  },
  legendasFotolog: [
    "eu e o drip",
    "{n} tarefas cravejadas",
    "{ml} de água no gelo",
    "corrente no peito e foco na mente",
    "{nome} no estúdio"
  ],
  textos: {
    diario: "Faixa do dia",
    diarioDica: "Como foi a faixa de hoje? O que brilhou?",
    foco: "Sessão no estúdio",
    tarefas: "Tracklist de hoje",
    adicionar: "Pôr na tracklist",
    vazioHoje: "Tracklist vazia. Bota a primeira faixa.",
    atrasadas: "Faixas engavetadas",
    fecharDia: "Fechar a sessão",
    diaFechado: "Sessão fechada. Hit garantido!",
    reabrir: "Abrir a sessão",
    diaPerfeito: "Dia platinado",
    adicionarHabito: "Pôr no ritual",
    vazioHabitos: "Nenhum ritual ainda. Todo drip começa com constância.",
    conviteTitulo: "Todo hit tem um feat.",
    conviteBotao: "Chamar pro feat",
    pedidoChegou: "quer um feat com você. Bora?",
    conviteTexto: "Cola no meu feat no Prumo!",
    sonsTitulo: "Sons do estúdio",
    somFoco: "Chuva neon",
    somFocoNome: "Chuva neon com 808",
    somFocoDica: "Chuva fina e um 808 lá no fundo enquanto o cronômetro roda.",
    somTarefa: "808",
    somTarefaNome: "808 deslizando",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo">${joiaSVG(JOIAS[Math.max(0, dripDados().liberadas - 1)].id, dripDados().liberadas > 0)}<small>${dripDados().liberadas}/7 joias</small></span>`,
  secaoHoje() {
    const d = dripDados();
    const faltam = DIAS_POR_JOIA - (d.dias.length % DIAS_POR_JOIA);
    const hojeConta = d.dias.includes(today());
    return cartaoMundo(
      "cm-cofre",
      "Cofre de joias",
      d.liberadas >= JOIAS.length
        ? "Cofre completo. Drip lendário!"
        : `Dia com 3 tarefas feitas conta pro drip. ${hojeConta ? "Hoje já contou! " : `Hoje: ${Math.min(3, feitasHoje())}/3. `}Próxima joia em ${faltam} ${faltam === 1 ? "dia" : "dias"}.`,
      `<div class="cofre">${JOIAS.map((j, i) => `<figure>${joiaSVG(j.id, i < d.liberadas)}<figcaption>${i < d.liberadas ? j.nome : "???"}</figcaption></figure>`).join("")}</div><div class="cm-botoes">${d.liberadas ? `<button class="btn small primary" data-act="trap-flex">Mostrar o drip</button>` : ""}</div>`
    );
  }
};

ACOES_EXTRAS["trap-flex"] = () => {
  MUNDO_FX.trapper.trocaAba();
  const ctx = pegarAudio();
  if (ctx) {
    const s = saidaMundo(ctx, 0.9),
      t = ctx.currentTime + 0.05;
    sintetizar808(ctx, s, t, 110, 41, 1.4, 0.55);
    for (let i = 0; i < 6; i++) chimbal(ctx, s, t + 0.4 + i * 0.06, 0.06);
  }
  document.querySelectorAll(".cofre .joia.liberada").forEach((j, i) => {
    j.classList.remove("flex");
    void j.getBoundingClientRect();
    setTimeout(() => j.classList.add("flex"), i * 80);
  });
};

SONS_MUNDO.trapper = {
  concluir(ctx, saida, t) {
    sintetizar808(ctx, saida, t, 98, 55, 0.7, 0.45);
    for (let i = 0; i < 6; i++) chimbal(ctx, saida, t + 0.05 + i * (i < 3 ? 0.06 : 0.04), 0.05);
  },
  ambiente(ctx) {
    const chuvaFina = ambienteRuido(ctx, { freq: 3000, tipo: "bandpass", vol: 0.05, q: 0.4 });
    const fundo = ctx.createGain();
    fundo.gain.value = 0.35;
    fundo.connect(ctx.destination);
    const parar = repetirSom(
      () => sintetizar808(ctx, fundo, ctx.currentTime + 0.02, 70, 44, 1.6, 0.4),
      3600,
      5200
    );
    return { parar: () => (parar(), chuvaFina.parar()) };
  }
};

ITEMS.push(
  {
    id: "trap_oculos_azul",
    p: "trapper",
    slot: "face",
    name: "Óculos lente azul",
    price: 120,
    svg: () =>
      `<path d="M30 58H90L86 70Q74 74 64 66H56Q46 74 34 70Z" fill="#29B6F6" opacity=".85" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M36 61l8 0M66 61l8 0" stroke="#fff" stroke-width="1.4" opacity=".7"/>`
  },
  {
    id: "trap_trancas",
    p: "trapper",
    slot: "hair",
    name: "Tranças com contas",
    price: 150,
    svg: () =>
      `<path d="M30 46Q28 14 60 12Q92 14 90 46Q84 30 60 28Q36 30 30 46Z" fill="#212121" ${O}/>${[34, 44, 54, 66, 76, 86].map((x, i) => `<path d="M${x} ${30 + (i % 2) * 2}V${50 + (i % 3) * 4}" stroke="#212121" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${52 + (i % 3) * 4}" r="2.4" fill="${["#E040FB", "#F2C14E", "#80DEEA"][i % 3]}"/>`).join("")}`
  },
  {
    id: "trap_couro",
    p: "trapper",
    slot: "top",
    name: "Jaqueta de couro preta",
    price: 170,
    svg: () =>
      topBase("#1C1C22") +
      `<path d="M44 88L60 108L76 88" stroke="#3A3A48" stroke-width="3" fill="none"/><path d="M60 108V150" stroke="#9E9E9E" stroke-width="1.6" stroke-dasharray="2 2"/><path d="M20 120h18M82 120h18" stroke="#3A3A48" stroke-width="2"/>`
  },
  {
    id: "trap_relogio",
    p: "trapper",
    slot: "wrist",
    name: "Relógio de gelo",
    price: 160,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-4" width="12" height="8" rx="2" fill="#CFD8DC" stroke="var(--ink)" stroke-width="1"/><circle r="4.4" fill="#E1F5FE" stroke="#90A4AE" stroke-width="1"/>${[0, 90, 180, 270].map(a => `<circle r=".8" fill="#fff" transform="rotate(${a}) translate(0 -3)"/>`).join("")}`
      )
  },
  {
    id: "trap_cidade",
    p: "trapper",
    slot: "bg",
    name: "Cidade neon",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#1A0B2E" opacity=".55"/>${[
        [0, 70, 18],
        [20, 50, 14],
        [36, 80, 16],
        [54, 40, 20],
        [76, 62, 14],
        [92, 46, 18],
        [108, 74, 12]
      ]
        .map(
          ([x, y, w]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${148 - y}" fill="#2D1B4E" opacity=".75"/>${[0, 1, 2].map(k => `<rect x="${x + 3}" y="${y + 6 + k * 12}" width="3" height="4" fill="${k % 2 ? "#E040FB" : "#80DEEA"}" opacity=".8"/>`).join("")}`
        )
        .join("")}`
  },
  {
    id: "trap_pinscher",
    p: "trapper",
    slot: "pet",
    name: "Pinscher de moletom",
    price: 150,
    svg: () =>
      `<g transform="translate(15 128)"><path d="M-8 -4Q-8 -10 0 -10H6Q11 -10 10 -3Q10 2 5 2H-5Q-8 2 -8 -4Z" fill="#E040FB" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 1v7M-2 1v7M4 1v7M8 1v7" stroke="#3E2723" stroke-width="1.6" stroke-linecap="round"/><path d="M7 -8Q7 -16 13 -16Q18 -16 18 -10Q18 -6 13 -5Z" fill="#3E2723" stroke="var(--ink)" stroke-width="1.1"/><path d="M9 -15l-2-7l5 4M15 -16l2-7l2 6" fill="#3E2723" stroke="var(--ink)" stroke-width=".8"/><circle cx="14.6" cy="-11.4" r="1" fill="#fff"/><path d="M-8 -6l-4-4" stroke="#3E2723" stroke-width="1.6" stroke-linecap="round"/></g>`
  }
);
