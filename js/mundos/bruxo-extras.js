/*
  Mundo Bruxo, extras:
  - Caldeirão do dia: cada tarefa concluída joga um ingrediente (nome tirado da tarefa). Com 4, dá pra
    preparar a poção do dia: sai uma poção com efeito engraçado e +10 gotas. A prateleira guarda as poções.
  - Horta de ervas: cada hábito marcado hoje faz uma erva crescer no canteiro.
  - Troca de aba: bolhas verdes sobem e uma fumacinha passa. Concluir tarefa: "blub" de caldeirão.
*/
"use strict";

const INGREDIENTES = [
  "asa de morcego (de chocolate)",
  "pétala de lua",
  "pena de corvo",
  "orvalho da meia-noite",
  "cogumelo saltitante",
  "raiz de mandrágora (calminha)",
  "pó de vaga-lume",
  "folha de hortelã encantada",
  "escama de sapo (caiu sozinha)",
  "suspiro de gato preto"
];
const POCOES = [
  { nome: "Poção da Coragem", efeito: "Dá vontade de começar a tarefa mais chata.", cor: "#FF7043" },
  { nome: "Elixir do Sono Bom", efeito: "Hoje você dorme como um gato no sol.", cor: "#9575CD" },
  { nome: "Xarope do Foco", efeito: "Nada de celular por 25 minutos.", cor: "#4FC3F7" },
  { nome: "Chá da Gentileza", efeito: "Manda um oi pra alguém hoje.", cor: "#F48FB1" },
  { nome: "Gosma da Sorte", efeito: "Algo bom vai acontecer até amanhã.", cor: "#9CCC65" },
  { nome: "Tônico da Hidratação", efeito: "Seu corpo pede mais um copo d'água.", cor: "#80DEEA" },
  { nome: "Poção da Calma", efeito: "Três respirações e tudo fica mais leve.", cor: "#AED581" },
  { nome: "Néctar da Criatividade", efeito: "Uma ideia brilhante aparece no banho.", cor: "#FFD54F" }
];
const ERVAS = ["Alecrim", "Lavanda", "Hortelã", "Camomila", "Sálvia", "Manjericão", "Arruda"];

function dadosBruxo() {
  const d = dadosMundo("bruxo");
  if (!d.caldeirao || d.caldeirao.dia !== today()) d.caldeirao = { dia: today(), itens: [], feita: null };
  if (!Array.isArray(d.prateleira)) d.prateleira = [];
  return d;
}
function ingredienteDe(titulo) {
  const n = norm(titulo);
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  return INGREDIENTES[h % INGREDIENTES.length];
}

function caldeiraoHTML(d) {
  const c = d.caldeirao;
  const cor = c.feita
    ? (POCOES.find(p => p.nome === c.feita) || {}).cor || "#76FF03"
    : c.itens.length >= 4
      ? "#C6FF00"
      : "#7CB342";
  const bolhas = Math.min(6, c.itens.length + 1);
  return `<svg viewBox="0 0 120 80" class="caldeirao-dia" aria-hidden="true">
    <path d="M30 70l-6 8M90 70l6 8" stroke="#37474F" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 34H100Q104 74 60 76Q16 74 20 34Z" fill="#263238" stroke="var(--ink)" stroke-width="2"/>
    <rect x="14" y="28" width="92" height="9" rx="4.5" fill="#37474F" stroke="var(--ink)" stroke-width="1.6"/>
    <ellipse cx="60" cy="31" rx="40" ry="4.4" fill="${cor}"/>
    <g class="bolhas-caldeirao">${Array.from({ length: bolhas }, (_, i) => `<circle cx="${32 + i * 11}" cy="${26 - (i % 2) * 4}" r="${2.4 + (i % 3)}" fill="${cor}" style="animation-delay:${i * 0.35}s"/>`).join("")}</g>
    <g class="fogo-caldeirao"><path d="M40 80q4-10 8 0M56 80q4-12 8 0M72 80q4-10 8 0" fill="#FF7043"/></g>
  </svg>`;
}

MUNDO_FX.bruxo = {
  trocaAba() {
    chuvaMundo({
      movimento: "subir",
      n: 18,
      tam: [10, 22],
      dur: [1.6, 2.6],
      cores: ["#C6FF00", "#9CCC65", "#CE93D8", "#B388FF"],
      formas: [
        `<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".55" stroke="currentColor" stroke-width="1.4"/><circle cx="8.5" cy="8.5" r="2.4" fill="#fff" opacity=".8"/>`
      ]
    });
  },
  confete: {
    cores: ["#C6FF00", "#9CCC65", "#B388FF", "#CE93D8", "#FB8C00"],
    formas: ["coracao", "estrela", "gota", "estrela"]
  },
  musicas: {
    party: "Dança em volta da fogueira",
    happy: "Valsa do caldeirão",
    idle: "Sapos e grilos da clareira",
    upset: "Trovoada no pântano",
    sad: "Lamento da lua minguante",
    cry: "Chuva no telhado da cabana"
  },
  subnicks: [
    "mexendo o caldeirão desde cedo",
    "~ meu gato manda aqui ~",
    "chá de ervas resolve quase tudo",
    "bruxaria fofa, sem maldade",
    "lua cheia, vassoura carregada"
  ],
  humorNomes: {
    Radiante: "Caldeirão em festa",
    Feliz: "Poção certeira",
    "De boa": "Chá com o gato",
    Chateado: "Poção azedou",
    Triste: "Caldeirão frio",
    Arrasado: "Virei sapo"
  },
  humorExtra(soma) {
    const d = dadosBruxo();
    if (d.caldeirao.feita) soma(4, "poção do dia feita");
  },
  aoConcluir(x) {
    const d = dadosBruxo();
    const ing = ingredienteDe(x.title);
    d.caldeirao.itens.push(ing);
    d.caldeirao.itens = d.caldeirao.itens.slice(-8);
    if (d.caldeirao.itens.length === 4 && !d.caldeirao.feita)
      setTimeout(
        () =>
          notificar({
            titulo: "O caldeirão borbulhou!",
            texto: "4 ingredientes. A poção do dia está pronta pra preparar no Hoje.",
            mood: "party",
            aba: "hoje"
          }),
        1400
      );
    else setTimeout(() => react("happy", `Joguei <b>${esc(ing)}</b> no caldeirão. Blub!`, 2400), 900);
  },
  legendasFotolog: [
    "{nome} e o caldeirão",
    "{n} ingredientes na poção de hoje",
    "{ml} de poção borbulhante",
    "o gato aprovou essa foto",
    "lua bonita na cabana"
  ],
  textos: {
    diario: "Diário de bruxaria",
    diarioDica: "Que poção deu certo hoje? Qual explodiu? (opcional)",
    foco: "Mexer o caldeirão",
    tarefas: "Ingredientes do dia",
    adicionar: "Jogar no caldeirão",
    vazioHoje: "Caldeirão vazio. Joga a primeira tarefa aí dentro.",
    atrasadas: "Ingredientes esquecidos",
    trazerTudo: "Tudo pro caldeirão de hoje",
    fecharDia: "Apagar o fogo",
    diaFechado: "Fogo apagado. O gato já dormiu.",
    reabrir: "Acender de novo",
    diaPerfeito: "Lua cheia perfeita",
    adicionarHabito: "Plantar na horta",
    vazioHabitos: "A horta tá vazia. Cada hábito vira uma erva.",
    sequencia: ["dia regando", "dias regando"],
    conviteTitulo: "Todo coven começa com duas bruxas.",
    conviteBotao: "Chamar pro coven",
    pedidoChegou: "quer entrar no seu coven. Aceita?",
    conviteTexto: "Vem mexer o caldeirão comigo no Prumo!",
    sonsTitulo: "Sons da cabana",
    somFoco: "Caldeirão",
    somFocoNome: "Caldeirão e grilos",
    somFocoDica: "Borbulhas do caldeirão e grilos lá fora enquanto o cronômetro roda.",
    somTarefa: "Blub",
    somTarefaNome: "Blub do caldeirão",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const d = dadosBruxo();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><path d="M4 9h16q1 9-8 10q-9-1-8-10z" fill="currentColor"/><circle cx="9" cy="6" r="1.6" fill="currentColor"/><circle cx="14" cy="4" r="1.2" fill="currentColor"/></svg><small>${d.caldeirao.feita ? esc(d.caldeirao.feita) : `${Math.min(4, d.caldeirao.itens.length)}/4 ingredientes`}</small></span>`;
  },
  secaoHoje() {
    const d = dadosBruxo();
    const c = d.caldeirao;
    const pronto = c.itens.length >= 4 && !c.feita;
    const pocao = c.feita ? POCOES.find(p => p.nome === c.feita) : null;
    const ervas = S.habits.filter(h => habitDone(h, today())).slice(0, 7);
    return cartaoMundo(
      "cm-caldeirao",
      "Caldeirão do dia",
      pocao ? esc(pocao.nome) : `${Math.min(4, c.itens.length)}/4 ingredientes`,
      `${caldeiraoHTML(d)}
      <span class="note">${c.itens.length ? `Dentro: ${c.itens.slice(-4).map(esc).join(", ")}.` : "Cada tarefa feita joga um ingrediente."} ${pocao ? `<b>${esc(pocao.efeito)}</b>` : ""}</span>
      ${pronto ? `<div class="cm-botoes"><button class="btn small primary" data-act="bru-preparar">Preparar a poção</button></div>` : ""}
      ${
        d.prateleira.length
          ? `<div class="prateleira-pocoes">${d.prateleira
              .slice(-8)
              .map(
                p =>
                  `<span title="${esc(p.nome)} (${fmtShort(p.em)})"><svg viewBox="0 0 16 22" width="16" height="22"><path d="M6 1h4v5l4 8a4 4 0 0 1-4 6H6a4 4 0 0 1-4-6l4-8z" fill="${(POCOES.find(x => x.nome === p.nome) || {}).cor || "#9CCC65"}" stroke="var(--ink)" stroke-width="1"/></svg></span>`
              )
              .join("")}</div>`
          : ""
      }
      ${S.habits.length ? `<div class="horta"><b>Horta</b> ${ervas.length ? ervas.map((h, i) => `<span class="erva" title="${esc(h.name)}">🌿 ${ERVAS[i % ERVAS.length]}</span>`).join("") : `<span class="note">Marque um hábito pra uma erva crescer.</span>`}</div>` : ""}`
    );
  }
};

ACOES_EXTRAS["bru-preparar"] = b => {
  const d = dadosBruxo();
  const c = d.caldeirao;
  if (c.feita || c.itens.length < 4) return;
  const p = POCOES[(diffDays("2026-01-01", today()) + c.itens.join("").length) % POCOES.length];
  c.feita = p.nome;
  d.prateleira.push({ nome: p.nome, em: today() });
  d.prateleira = d.prateleira.slice(-20);
  MUNDO_FX.bruxo.trocaAba();
  premioMundo(10, `Saiu <b>${esc(p.nome)}</b>! ${esc(p.efeito)} +10 gotas.`);
  commit();
};

SONS_MUNDO.bruxo = {
  concluir(ctx, saida, t) {
    // blub: bolha que sobe e estoura
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(620, t + 0.12);
    const g = envelope(ctx, t, 0.01, 0.18, 0.18);
    o.connect(g).connect(saida);
    o.start(t);
    o.stop(t + 0.22);
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(260, t + 0.14);
    o2.frequency.exponentialRampToValueAtTime(900, t + 0.24);
    const g2 = envelope(ctx, t + 0.14, 0.01, 0.14, 0.12);
    o2.connect(g2).connect(saida);
    o2.start(t + 0.14);
    o2.stop(t + 0.32);
    sino(ctx, saida, t + 0.3, 1568, 0.8, 0.04, [1, 2.4]);
  },
  ambiente(ctx) {
    // caldeirão borbulhando baixinho e grilos lá fora
    const blub = (c, s, t) => {
      const o = c.createOscillator();
      o.frequency.setValueAtTime(120 + Math.random() * 80, t);
      o.frequency.exponentialRampToValueAtTime(380 + Math.random() * 200, t + 0.08);
      const g = envelope(c, t, 0.005, 0.1, 0.06);
      o.connect(g).connect(s);
      o.start(t);
      o.stop(t + 0.14);
    };
    return ambienteComposto(ctx, { freq: 400, tipo: "lowpass", vol: 0.05, onda: 0.12 }, [
      [blub, 300, 1400],
      [grilo, 2000, 6000]
    ]);
  }
};
