/*
  Mundo Clean boy, extras:
  - Rotina impecável: 5 cuidados do dia (cama, skincare, roupa separada, mesa, água ao acordar).
    Todos marcados? Dia impecável, +10 gotas e brilho. Conta a sequência de dias impecáveis.
  - Inbox zero: aparece um selo quando todas as tarefas de hoje estão feitas.
  - Toque de vidro ao concluir tarefa e lounge com piano no foco. Brilhos na troca de aba.
*/
"use strict";

const CUIDADOS = [
  { id: "cama", nome: "Cama arrumada" },
  { id: "pele", nome: "Skincare" },
  { id: "roupa", nome: "Roupa separada" },
  { id: "mesa", nome: "Mesa organizada" },
  { id: "agua", nome: "Água ao acordar" }
];

function rotinaDados() {
  const d = dadosMundo("cleanboy");
  if (d.dia !== today()) {
    d.dia = today();
    d.feitos = [];
  }
  if (!Array.isArray(d.feitos)) d.feitos = [];
  if (!Array.isArray(d.impecaveis)) d.impecaveis = [];
  d.impecaveis = d.impecaveis.filter(x => typeof x === "string").slice(-120);
  return d;
}
function sequenciaImpecavel(d) {
  let n = 0,
    dia = d.impecaveis.includes(today()) ? today() : addDays(today(), -1);
  while (d.impecaveis.includes(dia)) {
    n++;
    dia = addDays(dia, -1);
  }
  return n;
}
const inboxZero = () => {
  const hoje = S.tasks.filter(t => t.date === today());
  return hoje.length > 0 && hoje.every(t => t.done);
};

MUNDO_FX.cleanboy = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "brilhar",
      n: 10,
      tam: [12, 22],
      dur: [0.8, 1.3],
      cores: ["#FFFFFF", "#E0E0E0", "#D4AF37"],
      formas: [
        `<path d="M12 2L13.6 10.4L22 12L13.6 13.6L12 22L10.4 13.6L2 12L10.4 10.4Z" fill="currentColor" stroke="#9E9E9E" stroke-width=".4"/>`
      ]
    }),
  confete: { cores: ["#FFFFFF", "#D4AF37", "#B0BEC5", "#263238"], formas: ["estrela", "ret", "redondo"] },
  musicas: {
    party: "Jazz no rooftop",
    happy: "Bossa de manhã",
    idle: "Lounge minimalista",
    upset: "Camisa amassada",
    sad: "Piano na chuva",
    cry: "Café frio"
  },
  subnicks: [
    "menos é mais",
    "~ tudo no lugar ~",
    "skincare feito, mente limpa",
    "inbox zero",
    "elegância é constância"
  ],
  humorNomes: {
    Radiante: "Impecável",
    Feliz: "Alinhado",
    "De boa": "Minimalista",
    Chateado: "Amassado",
    Triste: "Fora do lugar",
    Arrasado: "Bagunçado"
  },
  humorExtra(soma) {
    const d = rotinaDados();
    if (d.impecaveis.includes(today())) soma(4, "dia impecável");
    if (inboxZero()) soma(2, "inbox zero");
  },
  aoConcluir() {
    const hoje = S.tasks.filter(t => t.date === today());
    if (hoje.length > 1 && hoje.filter(t => !t.done).length === 0)
      setTimeout(
        () =>
          notificar({
            titulo: "Inbox zero",
            texto: "Todas as tarefas de hoje feitas. Elegante.",
            mood: "party",
            tipo: "conquista"
          }),
        1400
      );
  },
  legendasFotolog: [
    "eu e o café gelado",
    "{n} tarefas, zero bagunça",
    "{ml} de água cristalina",
    "camisa passada e perfume",
    "{nome}, edição impecável"
  ],
  textos: {
    diario: "Notas do dia",
    diarioDica: "Três linhas sobre hoje. Simples e direto.",
    foco: "Deep work",
    tarefas: "Agenda de hoje",
    adicionar: "Agendar",
    vazioHoje: "Agenda limpa. Coloque só o essencial.",
    atrasadas: "Pendências",
    fecharDia: "Encerrar o expediente",
    diaFechado: "Expediente encerrado. Impecável.",
    reabrir: "Reabrir a agenda",
    diaPerfeito: "Dia impecável",
    adicionarHabito: "Pôr na rotina",
    vazioHabitos: "Nenhuma rotina ainda. Comece com uma: cama arrumada.",
    conviteTitulo: "Bom gosto se compartilha.",
    conviteBotao: "Convidar",
    pedidoChegou: "quer se conectar com você. Aceita?",
    conviteTexto: "Te convido pro Prumo.",
    sonsTitulo: "Sons do lounge",
    somFoco: "Lounge",
    somFocoNome: "Lounge com piano",
    somFocoDica: "Ambiente calmo com notas de piano soltas enquanto o cronômetro roda.",
    somTarefa: "Vidro",
    somTarefaNome: "Toque de cristal",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const d = rotinaDados();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24">${CUIDADOS.map((c, i) => `<circle cx="${3 + i * 4.5}" cy="12" r="1.8" fill="${d.feitos.includes(c.id) ? "#D4AF37" : "none"}" stroke="#9E9E9E" stroke-width=".8"/>`).join("")}</svg><small>${d.feitos.length}/5 cuidados${inboxZero() ? " · inbox zero" : ""}</small></span>`;
  },
  secaoHoje() {
    const d = rotinaDados();
    const tudo = d.feitos.length === CUIDADOS.length;
    const seq = sequenciaImpecavel(d);
    return cartaoMundo(
      `cm-rotina ${tudo ? "impecavel" : ""}`,
      "Rotina impecável",
      `${tudo ? "Dia impecável." : "Os cuidados que deixam o dia no lugar."}${seq ? ` Sequência: ${seq} ${seq === 1 ? "dia" : "dias"}.` : ""}${inboxZero() ? " Inbox zero!" : ""}`,
      `<ul class="cm-lista cuidados">${CUIDADOS.map(c => `<li><button class="cuidado" data-act="clean-cuidado" data-id="${c.id}" aria-pressed="${d.feitos.includes(c.id)}"><span class="cuidado-marca"></span>${c.nome}</button></li>`).join("")}</ul>`
    );
  }
};

ACOES_EXTRAS["clean-cuidado"] = (b, id) => {
  const d = rotinaDados();
  if (!CUIDADOS.some(c => c.id === id)) return;
  d.feitos = d.feitos.includes(id) ? d.feitos.filter(x => x !== id) : [...d.feitos, id];
  if (d.feitos.length === CUIDADOS.length && !d.impecaveis.includes(today())) {
    d.impecaveis.push(today());
    MUNDO_FX.cleanboy.trocaAba();
    premioMundo(10, "Dia impecável. <b>+10 gotas</b>.");
  } else if (d.feitos.includes(id)) {
    const ctx = pegarAudio();
    if (ctx && S.sons.pagina) SONS_MUNDO.cleanboy.concluir(ctx, saidaMundo(ctx, 0.6), ctx.currentTime + 0.02);
  }
  commit();
};

SONS_MUNDO.cleanboy = {
  concluir(ctx, saida, t) {
    sino(ctx, saida, t, 1568, 1.2, 0.07, [1, 2.76]);
    sino(ctx, saida, t + 0.09, 2093, 1.4, 0.06, [1, 2.76]);
  },
  ambiente: ctx => {
    const notas = [261.6, 329.6, 392, 493.9, 587.3, 659.3];
    return ambienteComposto(ctx, { freq: 400, tipo: "lowpass", vol: 0.03 }, [
      [
        (c, s, t) =>
          tocarTom(c, s, t, notas[Math.floor(Math.random() * notas.length)], 2.4, "sine", 0.5, 0.01),
        2600,
        6200
      ]
    ]);
  }
};

ITEMS.push(
  {
    id: "clean_gel",
    p: "cleanboy",
    slot: "hair",
    name: "Cabelo penteado com gel",
    price: 110,
    svg: () =>
      `<path d="M30 46Q26 12 60 10Q94 12 90 46Q86 26 64 24Q40 22 30 46Z" fill="#3E2723" ${O}/><path d="M40 22Q60 14 84 24M38 30Q60 20 86 32" stroke="#6D4C41" stroke-width="1.4" fill="none"/><path d="M46 16q8-3 14 0" stroke="#fff" stroke-width="1.6" opacity=".6" fill="none"/>`
  },
  {
    id: "clean_aviador",
    p: "cleanboy",
    slot: "face",
    name: "Óculos aviador",
    price: 130,
    svg: () =>
      `<path d="M32 58H56Q58 74 46 74Q34 74 32 58ZM64 58H88Q86 74 74 74Q62 74 64 58Z" fill="#455A64" opacity=".85" stroke="#D4AF37" stroke-width="1.8"/><path d="M56 60Q60 56 64 60M32 58H88" stroke="#D4AF37" stroke-width="1.6" fill="none"/>`
  },
  {
    id: "clean_blazer",
    p: "cleanboy",
    slot: "top",
    name: "Blazer bege",
    price: 180,
    svg: () =>
      topBase("#D7C4A3") +
      `<path d="M40 86L56 120L52 150M80 86L64 120L68 150" stroke="#B9A07A" stroke-width="3" fill="none"/><path d="M48 88L60 104L72 88" fill="#FFFFFF"/>${[124, 136].map(y => `<circle cx="62" cy="${y}" r="1.8" fill="#5D4037"/>`).join("")}<path d="M18 112h16" stroke="#B9A07A" stroke-width="2"/>`
  },
  {
    id: "clean_lenco",
    p: "cleanboy",
    slot: "neck",
    name: "Lenço de seda",
    price: 120,
    svg: () =>
      `<path d="M38 84Q60 96 82 84L74 94Q60 100 46 94Z" fill="#1A237E" ${O}/><path d="M60 94l-6 18l6-4l6 4z" fill="#1A237E" ${O}/><path d="M44 88h32" stroke="#D4AF37" stroke-width="1" stroke-dasharray="2 2"/>`
  },
  {
    id: "clean_cafe",
    p: "cleanboy",
    slot: "hand",
    name: "Café gelado",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 -20H16L14 6H2Z" fill="#E0E0E0" opacity=".7" stroke="var(--ink)" stroke-width="1.2"/><path d="M1 -12H15L14 6H2Z" fill="#8D6E63" opacity=".85"/><rect x="3" y="-16" width="4" height="4" fill="#fff" opacity=".8"/><path d="M10 -26V-14" stroke="#4CAF50" stroke-width="2"/>`
      )
  },
  {
    id: "clean_ape",
    p: "cleanboy",
    slot: "bg",
    name: "Apartamento clean",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#F5F5F5" opacity=".6"/><rect x="72" y="4" width="44" height="60" fill="#E3F2FD" stroke="#CFD8DC" stroke-width="2"/><path d="M94 4V64M72 34H116" stroke="#CFD8DC" stroke-width="1.6"/><path d="M8 112h30v26" stroke="#BDBDBD" stroke-width="2" fill="none"/><path d="M14 112q-2-20 8-26q8 10 4 26" fill="#81C784"/>`
  },
  {
    id: "clean_siames",
    p: "cleanboy",
    slot: "pet",
    name: "Gato siamês",
    price: 160,
    svg: () =>
      `<g transform="translate(15 130)"><path d="M-9 6Q-11 -6 0 -7Q11 -6 9 6Z" fill="#F3E5D0" stroke="var(--ink)" stroke-width="1.1"/><circle cy="-11" r="6.5" fill="#F3E5D0" stroke="var(--ink)" stroke-width="1.1"/><path d="M-5 -15l-1-6l5 3M5 -15l1-6l-5 3" fill="#5D4037" stroke="var(--ink)" stroke-width=".9"/><ellipse cy="-9" rx="3.6" ry="2.8" fill="#5D4037" opacity=".75"/><circle cx="-2.4" cy="-12" r="1" fill="#29B6F6"/><circle cx="2.4" cy="-12" r="1" fill="#29B6F6"/><path d="M9 4q6-2 4-10" stroke="#5D4037" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`
  }
);
