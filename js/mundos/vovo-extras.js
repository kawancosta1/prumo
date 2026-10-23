/*
  Mundo Vovô fofo, extras:
  - Mantinha de crochê: cada tarefa feita é um quadradinho colorido na manta da semana (7 x 4 = 28).
    Manta completa? +30 gotas e ela vai pro baú (contador de mantas).
  - Conselho da vó: uma frase carinhosa por dia.
  - Cuco ao concluir tarefa e tic-tac com lareira no foco. Novelos rolando na troca de aba.
*/
"use strict";

const CORES_LA = ["#E57373", "#F06292", "#BA68C8", "#64B5F6", "#4DB6AC", "#AED581", "#FFD54F", "#FFB74D"];
const CONSELHOS = [
  "Come alguma coisa antes de sair, viu?",
  "Leva um casaquinho que vai esfriar.",
  "Uma coisa de cada vez, meu bem.",
  "Bebe água, que faz bem pra pele.",
  "Dorme cedo que amanhã é outro dia.",
  "Liga pra quem você ama.",
  "O que é seu ninguém tira.",
  "Devagar se vai ao longe.",
  "Pede ajuda quando precisar, não é vergonha.",
  "Arruma a cama que o dia rende mais."
];
const conselhoDoDia = () =>
  CONSELHOS[Math.floor(new Date(today() + "T12:00:00").getTime() / 864e5) % CONSELHOS.length];

function mantaDados() {
  const d = dadosMundo("vovo");
  const semana = mondayOf(today());
  if (d.semana !== semana) {
    d.semana = semana;
    d.pontos = [];
    d.guardada = false;
  }
  if (!Array.isArray(d.pontos)) d.pontos = [];
  d.mantas = Math.max(0, Math.round(+d.mantas || 0));
  return d;
}

function mantaSVG(pontos) {
  let q = "";
  for (let i = 0; i < 28; i++) {
    const x = (i % 7) * 40 + 20,
      y = Math.floor(i / 7) * 24 + 8;
    if (i < pontos.length) {
      const c = CORES_LA[pontos[i] % CORES_LA.length];
      q += `<g class="ponto" style="animation-delay:${(i % 7) * 0.05}s"><rect x="${x}" y="${y}" width="38" height="22" rx="3" fill="${c}"/><rect x="${x + 6}" y="${y + 5}" width="26" height="12" rx="2" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2" opacity=".7"/><circle cx="${x + 19}" cy="${y + 11}" r="2.4" fill="#fff" opacity=".8"/></g>`;
    } else
      q += `<rect x="${x}" y="${y}" width="38" height="22" rx="3" fill="none" stroke="#BCAAA4" stroke-width="1" stroke-dasharray="3 3"/>`;
  }
  return `<svg class="cm-cena manta" viewBox="0 0 320 112" role="img" aria-label="Manta de crochê com ${pontos.length} de 28 quadradinhos">${q}<path d="M20 8v96M298 8v96" stroke="#D7CCC8" stroke-width="2" stroke-dasharray="1 4"/></svg>`;
}

MUNDO_FX.vovo = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "atravessar",
      n: 6,
      tam: [20, 30],
      dur: [2, 2.8],
      cores: CORES_LA,
      formas: [
        `<circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M5 9q7-3 14 2M4 13q8-2 15 3M7 18q5-3 10 0" stroke="#fff" stroke-width="1" fill="none" opacity=".6"/><path d="M20 15q4 4 2 8" stroke="currentColor" stroke-width="1.2" fill="none"/>`
      ]
    }),
  confete: { cores: CORES_LA, formas: ["coracao", "flor", "redondo"] },
  musicas: {
    party: "Valsa do aniversário",
    happy: "Rádio AM de domingo",
    idle: "Bolero na vitrola",
    upset: "Novela com final triste",
    sad: "Saudade dos netos",
    cry: "Chuva no telhado"
  },
  subnicks: [
    "tomando um cafezinho",
    "~ fazendo crochê na varanda ~",
    "já comeu hoje?",
    "bolo saindo do forno",
    "neto querido, ligue pra vó"
  ],
  humorNomes: {
    Radiante: "Felicidade de vó",
    Feliz: "Contente",
    "De boa": "Na cadeira de balanço",
    Chateado: "Ranzinza",
    Triste: "Saudosa",
    Arrasado: "Com as juntas doendo"
  },
  humorExtra(soma) {
    if (new Date().getHours() < 9) soma(2, "acordou cedinho");
    if (mantaDados().pontos.length >= 28) soma(3, "manta pronta");
  },
  aoConcluir() {
    const d = mantaDados();
    if (d.pontos.length < 28) d.pontos.push(Math.floor(Math.random() * CORES_LA.length));
    if (d.pontos.length === 28)
      setTimeout(
        () =>
          notificar({
            titulo: "Manta pronta",
            texto: "Vinte e oito quadradinhos! Guarda lá no Hoje.",
            mood: "party",
            aba: "hoje"
          }),
        1500
      );
  },
  legendasFotolog: [
    "eu e o cafezinho",
    "{n} afazeres prontos hoje",
    "{ml} de aguinha fresca",
    "crochê, novela e cochilo",
    "{nome} na varanda"
  ],
  textos: {
    diario: "Caderninho da vó",
    diarioDica: "Conta pra vó: como foi seu dia?",
    foco: "Hora do crochê",
    tarefas: "Afazeres de hoje",
    adicionar: "Anotar",
    vazioHoje: "Nenhum afazer anotado. Anota um, meu bem.",
    atrasadas: "Esquecidinhos",
    fecharDia: "Apagar a luz da sala",
    diaFechado: "Luz apagada. Boa noite, querido.",
    reabrir: "Acender a luz",
    diaPerfeito: "Dia de bolo",
    adicionarHabito: "Pôr no costume",
    vazioHabitos: "Nenhum costume ainda. Vó sempre diz: um chá antes de dormir.",
    vazioPessoas: "Ninguém na lista. Põe os netos, os filhos e as comadres.",
    conviteTitulo: "Vó gosta de casa cheia.",
    conviteBotao: "Chamar pra um café",
    pedidoChegou: "quer tomar um café com você. Aceita?",
    conviteTexto: "Vem tomar um cafezinho comigo no Prumo!",
    sonsTitulo: "Sons da casa da vó",
    somFoco: "Lareira",
    somFocoNome: "Relógio e lareira",
    somFocoDica: "Tic-tac do relógio de parede e lareira enquanto o cronômetro roda.",
    somTarefa: "Cuco",
    somTarefaNome: "Relógio cuco",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7" fill="#E57373"/><path d="M6 10q6-3 12 2M5 14q7-2 13 3" stroke="#fff" stroke-width=".9" fill="none" opacity=".7"/><path d="M16 7l5-5M18 9l5-4" stroke="#8D6E63" stroke-width="1.2"/></svg><small>${esc(conselhoDoDia())}</small></span>`,
  secaoHoje() {
    const d = mantaDados();
    const pronta = d.pontos.length >= 28 && !d.guardada;
    return cartaoMundo(
      "cm-manta",
      "Mantinha de crochê",
      `${d.mantas ? `${d.mantas} ${d.mantas === 1 ? "manta" : "mantas"} no baú · ` : ""}Cada afazer é um quadradinho. ${d.pontos.length}/28 nesta semana.`,
      `${mantaSVG(d.pontos)}<p class="conselho">"${esc(conselhoDoDia())}"</p>${pronta ? `<div class="cm-botoes"><button class="btn small primary" data-act="vovo-guardar">Guardar no baú (+30 gotas)</button></div>` : ""}`
    );
  }
};

ACOES_EXTRAS["vovo-guardar"] = () => {
  const d = mantaDados();
  if (d.pontos.length < 28 || d.guardada) return;
  d.guardada = true;
  d.mantas++;
  premioMundo(30, "Que manta linda! Vai pro baú. <b>+30 gotas</b>.");
  fx.big = true;
  commit();
};

SONS_MUNDO.vovo = {
  concluir(ctx, saida, t) {
    // cu-co
    tocarTom(ctx, saida, t, 659, 0.25, "sine", 0.18, 0.02);
    tocarTom(ctx, saida, t + 0.3, 523, 0.4, "sine", 0.18, 0.02);
    rajada(ctx, saida, t + 0.02, 0.03, 1200, "bandpass", 0.08, 4);
  },
  ambiente: ctx =>
    ambienteComposto(ctx, { freq: 300, tipo: "lowpass", vol: 0.05 }, [
      [ticTac, 999, 1001],
      [estalo, 300, 1400]
    ])
};

ITEMS.push(
  {
    id: "vovo_touca_croche",
    p: "vovo",
    slot: "hat",
    name: "Touca de crochê",
    price: 100,
    svg: () =>
      `<path d="M28 44Q26 10 60 10Q94 10 92 44Z" fill="#BA68C8" ${O}/>${[18, 26, 34].map(y => `<path d="M${34 - (34 - y) * 0.3} ${y + 4}Q60 ${y - 4} ${86 + (34 - y) * 0.3} ${y + 4}" stroke="#E1BEE7" stroke-width="2" fill="none" stroke-dasharray="3 2"/>`).join("")}<circle cx="60" cy="9" r="6" fill="#F06292" ${O}/>`
  },
  {
    id: "vovo_cordinha",
    p: "vovo",
    slot: "face",
    name: "Óculos com cordinha",
    price: 90,
    svg: () =>
      `<circle cx="47" cy="64" r="9" fill="none" stroke="#8D6E63" stroke-width="2.2"/><circle cx="73" cy="64" r="9" fill="none" stroke="#8D6E63" stroke-width="2.2"/><path d="M56 64h8" stroke="#8D6E63" stroke-width="2"/><path d="M38 64Q30 90 44 104M82 64Q90 90 76 104" stroke="#FFD54F" stroke-width="1.4" fill="none" stroke-dasharray="2 1.4"/>`
  },
  {
    id: "vovo_xale",
    p: "vovo",
    slot: "neck",
    name: "Xale de crochê",
    price: 120,
    svg: () =>
      `<path d="M14 82Q60 104 106 82L84 112Q60 122 36 112Z" fill="#F8BBD0" ${O}/>${[
        [40, 96],
        [52, 102],
        [64, 102],
        [76, 96],
        [58, 112]
      ]
        .map(
          ([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#EC407A" stroke-width="1.2"/>`
        )
        .join("")}`
  },
  {
    id: "vovo_agulhas",
    p: "vovo",
    slot: "hand",
    name: "Agulhas e novelo",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<circle cx="8" cy="-4" r="9" fill="#64B5F6" stroke="var(--ink)" stroke-width="1.2"/><path d="M1 -8q7-3 14 2M0 -3q8-2 15 3" stroke="#fff" stroke-width="1" fill="none" opacity=".6"/><path d="M-2 4L20 -22M4 6L24 -16" stroke="#BCAAA4" stroke-width="1.8" stroke-linecap="round"/>`
      )
  },
  {
    id: "vovo_bolo",
    p: "vovo",
    slot: "hand",
    name: "Bolo de fubá",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<ellipse cx="10" cy="2" rx="16" ry="4" fill="#ECEFF1" stroke="var(--ink)" stroke-width="1"/><path d="M-3 -10Q10 -16 23 -10V0Q10 4 -3 0Z" fill="#FFD54F" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="10" cy="-11" rx="13" ry="3" fill="#FFE082"/><ellipse cx="10" cy="-11" rx="3" ry="1" fill="#ECEFF1"/>`
      )
  },
  {
    id: "vovo_gato",
    p: "vovo",
    slot: "pet",
    name: "Gato gordinho",
    price: 150,
    svg: () =>
      `<g transform="translate(15 132)"><ellipse cy="0" rx="11" ry="8" fill="#FFB74D" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 -4q3 2 0 4M0 -6q3 2 0 4" stroke="#E65100" stroke-width="1" fill="none"/><circle cx="8" cy="-7" r="6" fill="#FFB74D" stroke="var(--ink)" stroke-width="1.1"/><path d="M4 -11l1-5l3 3M10 -12l2-4l1 5" fill="#FFB74D" stroke="var(--ink)" stroke-width=".9"/><path d="M6 -7.5q1-1 2 0M9.5 -7.5q1-1 2 0" stroke="#141416" stroke-width=".8" fill="none"/><path d="M-11 2q-6 0-6-6" stroke="#FFB74D" stroke-width="3" fill="none" stroke-linecap="round"/></g>`
  },
  {
    id: "vovo_sala",
    p: "vovo",
    slot: "bg",
    name: "Sala com lareira",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#D7CCC8" opacity=".5"/>${[...Array(12)].map((_, i) => `<path d="M${i * 10} -6V148" stroke="#BCAAA4" stroke-width="3" opacity=".35"/>`).join("")}<rect x="84" y="96" width="34" height="40" fill="#8D6E63" opacity=".75"/><rect x="90" y="108" width="22" height="28" fill="#3E2723" opacity=".8"/><path d="M94 134q4-12 8-6q2-8 6 0q2 4-2 6z" fill="#FF7043" opacity=".9"/><rect x="6" y="24" width="20" height="24" rx="2" fill="#FFF8E1" stroke="#A1887F" stroke-width="2" opacity=".85"/><circle cx="16" cy="34" r="4" fill="#BCAAA4"/>`
  }
);
