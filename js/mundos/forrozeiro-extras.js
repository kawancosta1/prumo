/*
  Mundo Forrozeiro, extras:
  - Arraiá: cada tarefa feita pendura 2 bandeirinhas no varal (a meta de água também).
    Com 6 a fogueira acende; com 12 o arraiá está completo e dá pra puxar a quadrilha (+10 gotas, 1 vez por dia).
  - Sanfona ao concluir tarefa, fogueira estalando com grilos no foco.
  - Bandeirinhas atravessando a tela na troca de aba, falas, humor e roupas novas.
*/
"use strict";

const CORES_BANDEIRA = ["#E53935", "#FDD835", "#1E88E5", "#43A047", "#FB8C00", "#8E24AA"];

function bandeirinhasHoje() {
  const agua = waterToday() >= S.waterGoal ? 2 : 0;
  return Math.min(12, feitasHoje() * 2 + agua);
}

function arraiaSVG(n) {
  const fogo = n >= 6;
  let varal = "";
  for (let i = 0; i < 12; i++) {
    const x = 18 + i * 24.5;
    const y = 18 + Math.sin((i / 11) * Math.PI) * 14;
    varal +=
      i < n
        ? `<path class="bandeirinha" style="animation-delay:${(i % 4) * 0.25}s" d="M${x - 9} ${y}H${x + 9}L${x} ${y + 16}Z" fill="${CORES_BANDEIRA[i % 6]}" stroke="#5D3A1A" stroke-width=".8"/>`
        : `<path d="M${x - 9} ${y}H${x + 9}L${x} ${y + 16}Z" fill="none" stroke="#5D3A1A" stroke-width=".6" stroke-dasharray="2 2" opacity=".35"/>`;
  }
  const chama = fogo
    ? `<g class="chama"><path d="M160 96q-16-14-6-34q4 12 10 8q-4-14 8-24q-2 16 8 22q6-8 4-16q14 18 0 44z" fill="#FF7043"/><path d="M162 96q-8-8-2-20q4 6 8 4q-2 8 4 10q4-4 2-10q8 12-2 18z" fill="#FFD54F"/></g>`
    : `<text x="160" y="80" text-anchor="middle" font-size="9" fill="#8D6E63">faltam ${6 - n} bandeirinhas pra fogueira</text>`;
  return `<svg class="cm-cena arraia ${fogo ? "acesa" : ""}" viewBox="0 0 320 120" role="img" aria-label="${n} de 12 bandeirinhas no arraiá">
    <rect width="320" height="120" fill="${fogo ? "#2A1B3D" : "#3B2A55"}"/>
    ${[...Array(16)].map((_, i) => `<circle cx="${(i * 41) % 320}" cy="${((i * 17) % 50) + 4}" r=".9" fill="#fff" opacity=".7"/>`).join("")}
    <path d="M0 18Q160 50 320 18" stroke="#5D3A1A" stroke-width="1.2" fill="none"/>${varal}
    <path d="M0 104H320V120H0Z" fill="#6D4C2B"/>
    <g stroke="#4E342E" stroke-width="5" stroke-linecap="round"><path d="M146 104l28-10M146 94l28 10"/></g>${chama}
  </svg>`;
}

MUNDO_FX.forrozeiro = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "atravessar",
      n: 12,
      tam: [16, 26],
      dur: [1.4, 2.2],
      cores: CORES_BANDEIRA,
      formas: [`<path d="M3 3H21L12 21Z" fill="currentColor"/>`]
    }),
  confete: { cores: CORES_BANDEIRA, formas: ["bandeira", "bandeira", "estrela", "flor"] },
  musicas: {
    party: "Xote do arraiá",
    happy: "Baião de domingo",
    idle: "Sanfona no alpendre",
    upset: "Fole furado",
    sad: "Asa branca da saudade",
    cry: "Chuva no sertão"
  },
  subnicks: [
    "arrasta-pé até amanhecer",
    "~ sanfona, zabumba e triângulo ~",
    "o xote não pode parar",
    "cuscuz com café e muita lida",
    "anarriê!"
  ],
  humorNomes: {
    Radiante: "Arretado",
    Feliz: "No xote",
    "De boa": "Na rede",
    Chateado: "Arreliado",
    Triste: "Com saudade do sertão",
    Arrasado: "Fole murcho"
  },
  humorExtra(soma) {
    if (new Date().getMonth() === 5) soma(4, "mês de São João");
    if (bandeirinhasHoje() >= 12) soma(3, "arraiá completo");
  },
  aoConcluir() {
    const n = bandeirinhasHoje() + 2;
    if (n === 6)
      setTimeout(
        () =>
          notificar({
            titulo: "Fogueira acesa",
            texto: "Seis bandeirinhas no varal. O arraiá tá esquentando!",
            mood: "party",
            aba: "hoje"
          }),
        1500
      );
  },
  legendasFotolog: [
    "eu, a sanfona e o luar",
    "{n} tarefas no arrasta-pé",
    "{ml} de água do açude",
    "chapéu de couro e sorriso no rosto",
    "{nome} no arraiá"
  ],
  textos: {
    diario: "Prosa do dia",
    diarioDica: "Como foi o forró de hoje? Conta a prosa.",
    foco: "Xote concentrado",
    tarefas: "Arrasta-pé de hoje",
    adicionar: "Puxar o fole",
    vazioHoje: "Salão vazio. Bota a primeira tarefa e chama o povo pro forró.",
    atrasadas: "Ficou do São João passado",
    fecharDia: "Apagar a fogueira",
    diaFechado: "Fogueira apagada. Que festa!",
    reabrir: "Reacender a fogueira",
    diaPerfeito: "Arraiá completo",
    adicionarHabito: "Pôr no forró de sempre",
    vazioHabitos: "Nenhum costume ainda. Todo forró tem seu passo básico: comece com um.",
    vazioCompromissos: "Nenhuma festa marcada. Bora marcar um forró?",
    conviteTitulo: "Forró bom se dança agarradinho.",
    conviteBotao: "Chamar pra dançar",
    pedidoChegou: "te chamou pra dançar um xote. Topa?",
    conviteTexto: "Bora dançar um xote no Prumo!",
    sonsTitulo: "Sons do arraiá",
    somFoco: "Fogueira",
    somFocoNome: "Fogueira de São João",
    somFocoDica: "Fogueira estalando e grilos enquanto o cronômetro roda.",
    somTarefa: "Sanfona",
    somTarefaNome: "Fole da sanfona",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const n = bandeirinhasHoje();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24">${[0, 1, 2].map(i => `<path d="M${1 + i * 7.5} 6H${8 + i * 7.5}L${4.5 + i * 7.5} 15Z" fill="${i * 4 < n ? CORES_BANDEIRA[i * 2] : "none"}" stroke="#8D6E63" stroke-width=".8"/>`).join("")}</svg><small>${n}/12 bandeirinhas</small></span>`;
  },
  secaoHoje() {
    const n = bandeirinhasHoje();
    const d = dadosMundo("forrozeiro");
    const pronta = n >= 12 && d.quadrilha !== today();
    return cartaoMundo(
      "cm-arraia",
      "Arraiá",
      n >= 12
        ? d.quadrilha === today()
          ? "Quadrilha dançada hoje. Anarriê!"
          : "Arraiá completo! Puxa a quadrilha."
        : "Cada tarefa pendura 2 bandeirinhas. A meta de água também.",
      `${arraiaSVG(n)}<div class="cm-botoes">${pronta ? `<button class="btn small primary" data-act="forro-quadrilha">Puxar a quadrilha (+10 gotas)</button>` : ""}<button class="btn small ghost" data-act="forro-fole">Tocar a sanfona</button></div>`
    );
  }
};

function tocarXote(ctx, saida, t) {
  // xote em dó: zabumba marcando e a sanfona no contratempo
  const acordes = [
    [262, 330, 392],
    [262, 330, 392],
    [349, 440, 523],
    [392, 494, 587]
  ];
  acordes.forEach((a, i) => {
    const b = t + i * 0.42;
    bumbo(ctx, saida, b, 0.35);
    sanfona(ctx, saida, b + 0.21, a, 0.2, 0.08);
    rajada(ctx, saida, b + 0.1, 0.05, 6500, "highpass", 0.05); // triângulo
    rajada(ctx, saida, b + 0.31, 0.05, 6500, "highpass", 0.05);
  });
}
ACOES_EXTRAS["forro-fole"] = () => {
  const ctx = pegarAudio();
  if (ctx) tocarXote(ctx, saidaMundo(ctx, 0.9), ctx.currentTime + 0.05);
};
ACOES_EXTRAS["forro-quadrilha"] = () => {
  const d = dadosMundo("forrozeiro");
  if (d.quadrilha === today() || bandeirinhasHoje() < 12) return;
  d.quadrilha = today();
  ACOES_EXTRAS["forro-fole"]();
  premioMundo(10, "Anarriê! Olha a chuva! É mentira! <b>+10 gotas</b> pela quadrilha.");
  fx.big = true;
  commit();
};

SONS_MUNDO.forrozeiro = {
  concluir(ctx, saida, t) {
    sanfona(ctx, saida, t, [392, 494], 0.16, 0.1);
    sanfona(ctx, saida, t + 0.17, [523, 659, 784], 0.45, 0.1);
    rajada(ctx, saida, t + 0.17, 0.08, 6500, "highpass", 0.06);
  },
  ambiente: ctx =>
    ambienteComposto(ctx, { freq: 350, tipo: "lowpass", vol: 0.06 }, [
      [estalo, 120, 700],
      [grilo, 600, 1800]
    ])
};

ITEMS.push(
  {
    id: "forro_cangaceiro",
    p: "forrozeiro",
    slot: "hat",
    name: "Chapéu de meia-lua",
    price: 160,
    svg: () =>
      `<path d="M10 40Q20 4 60 6Q100 4 110 40Q60 22 10 40Z" fill="#8D5524" ${O}/><path d="M22 34Q60 18 98 34" stroke="#5D3A1A" stroke-width="2" fill="none"/>${[30, 45, 60, 75, 90].map((x, i) => `<path d="M${x} ${23 - (i === 2 ? 4 : i % 2 ? 2 : 0)}l2.4 4.8 5.2.6-3.8 3.6 1 5.2-4.8-2.6-4.8 2.6 1-5.2-3.8-3.6 5.2-.6z" fill="#F2C14E" stroke="#5D3A1A" stroke-width=".8"/>`).join("")}`
  },
  {
    id: "forro_gibao",
    p: "forrozeiro",
    slot: "top",
    name: "Gibão de couro",
    price: 150,
    svg: () =>
      topBase("#9A5B2E") +
      `<path d="M60 88V150" stroke="#5D3A1A" stroke-width="2"/>${[96, 108, 120, 132].map(y => `<path d="M14 ${y}h30M76 ${y}h30" stroke="#C78A4E" stroke-width="1.6" stroke-dasharray="4 3"/>`).join("")}<path d="M44 90l16 14l16-14" stroke="#5D3A1A" stroke-width="2" fill="none"/>`
  },
  {
    id: "forro_chita_lenco",
    p: "forrozeiro",
    slot: "neck",
    name: "Lenço de chita",
    price: 70,
    svg: () =>
      `<path d="M28 84Q60 100 92 84L84 96Q72 104 60 112Q48 104 36 96Z" fill="#E53935" ${O}/>${[
        [44, 92],
        [60, 100],
        [74, 92],
        [52, 98],
        [68, 98]
      ]
        .map(
          ([x, y], i) =>
            `<circle cx="${x}" cy="${y}" r="2.4" fill="${["#FDD835", "#1E88E5", "#43A047", "#FFFFFF", "#FDD835"][i]}"/>`
        )
        .join("")}`
  },
  {
    id: "forro_zabumba",
    p: "forrozeiro",
    slot: "hand",
    name: "Zabumba",
    price: 140,
    svg: (x, y) =>
      H(
        x,
        y,
        `<ellipse cx="10" cy="-6" rx="14" ry="10" fill="#F5E6C8" stroke="var(--ink)" stroke-width="1.6"/><path d="M-4 -6v10a14 10 0 0 0 28 0v-10" fill="#C62828" stroke="var(--ink)" stroke-width="1.6"/><path d="M-2 0l8 8l8-8l8 8" stroke="#FDD835" stroke-width="1.6" fill="none"/><path d="M22 -20l-8 12" stroke="#5D3A1A" stroke-width="2.4" stroke-linecap="round"/><circle cx="23" cy="-21" r="2.6" fill="#F5E6C8" stroke="var(--ink)" stroke-width="1"/>`
      )
  },
  {
    id: "forro_fogueira",
    p: "forrozeiro",
    slot: "bg",
    name: "Noite de São João",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#3B2A55" opacity=".5"/><path d="M0 4Q60 22 120 4" stroke="#5D3A1A" stroke-width=".8" fill="none" opacity=".7"/>${[...Array(9)].map((_, i) => `<path d="M${6 + i * 13} ${6 + Math.sin(((i + 0.5) / 9) * Math.PI) * 8}h8l-4 8z" fill="${CORES_BANDEIRA[i % 6]}" opacity=".8"/>`).join("")}<path d="M10 140q-8-8-2-18q2 6 6 4q-2-8 4-12q0 8 4 10q4-4 2-8q8 10 0 24z" fill="#FF7043" opacity=".85"/><path d="M100 140q-8-8-2-18q2 6 6 4q-2-8 4-12q0 8 4 10q4-4 2-8q8 10 0 24z" fill="#FF7043" opacity=".85"/>`
  },
  {
    id: "forro_bode",
    p: "forrozeiro",
    slot: "pet",
    name: "Bodinho",
    price: 150,
    svg: () =>
      `<g transform="translate(15 128)"><ellipse cx="0" cy="-3" rx="10" ry="6.5" fill="#EFEBE0" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 2v7M-2 2v7M3 2v7M7 2v7" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/><path d="M7 -7q5-8 10-6q2 4-1 8l-6 2z" fill="#EFEBE0" stroke="var(--ink)" stroke-width="1.1"/><path d="M11 -12q-2-6 2-8M14 -12q1-6 5-6" stroke="#8D6E63" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="14" cy="-8.5" r=".9" fill="#141416"/><path d="M15 -3q0 4-2 5" stroke="#EFEBE0" stroke-width="2"/><path d="M-10 -5q-4-2-4 2" stroke="#EFEBE0" stroke-width="2" fill="none"/></g>`
  }
);
