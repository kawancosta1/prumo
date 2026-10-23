/*
  Mundo Coach, extras:
  - Desafio 21 dias: escolhe um hábito e o anel enche a cada dia em que ele foi feito (desde o começo do desafio).
    Completou 21? Medalha e +50 gotas.
  - Check-in de energia: de 1 a 5, uma vez por dia, com a linha dos últimos 7 dias.
  - Frase do dia, apito ao concluir tarefa e batida de treino no foco. Setas subindo na troca de aba.
*/
"use strict";

const FRASES_COACH = [
  "Disciplina é lembrar o que você quer.",
  "Feito é melhor que perfeito.",
  "Um por cento melhor que ontem.",
  "Constância vence intensidade.",
  "Quem descansa também treina.",
  "Começar é metade do caminho.",
  "Você é o único concorrente que importa.",
  "Pequenas vitórias também contam."
];
const fraseCoach = () =>
  FRASES_COACH[Math.floor(new Date(today() + "T12:00:00").getTime() / 864e5) % FRASES_COACH.length];

function coachDados() {
  const d = dadosMundo("coach");
  if (!d.energia || typeof d.energia !== "object") d.energia = {};
  const limite = addDays(today(), -30);
  for (const k of Object.keys(d.energia)) if (k < limite) delete d.energia[k];
  d.medalhas = Math.max(0, Math.round(+d.medalhas || 0));
  return d;
}
function progressoDesafio(d) {
  const h = S.habits.find(x => x.id === d.habito);
  if (!h || !d.desde) return null;
  let feitos = 0;
  for (let dia = d.desde; dia <= today(); dia = addDays(dia, 1)) if (habitDone(h, dia)) feitos++;
  return { h, feitos: Math.min(21, feitos), dias: diffDays(d.desde, today()) + 1 };
}

function anelSVG(feitos) {
  const r = 34,
    c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 90 90" class="anel21"><circle cx="45" cy="45" r="${r}" fill="none" stroke="var(--sunken)" stroke-width="9"/><circle cx="45" cy="45" r="${r}" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${((c * feitos) / 21).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 45 45)"/><text x="45" y="50" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">${feitos}/21</text></svg>`;
}
function energiaSVG(d) {
  const pts = [];
  for (let i = 6; i >= 0; i--) {
    const dia = addDays(today(), -i);
    if (d.energia[dia]) pts.push([(6 - i) * 30 + 10, 50 - d.energia[dia] * 9]);
  }
  if (!pts.length) return "";
  return `<svg viewBox="0 0 200 56" class="energia7"><path d="M10 50H190" stroke="var(--sunken)" stroke-width="1"/>${pts.length > 1 ? `<path d="M${pts.map(p => p.join(" ")).join("L")}" stroke="var(--accent)" stroke-width="2.4" fill="none" stroke-linejoin="round"/>` : ""}${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="var(--accent)"/>`).join("")}</svg>`;
}

function apito(ctx, saida, t, dur = 0.18) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = 2800;
  const trill = ctx.createOscillator();
  trill.frequency.value = 38;
  const tg = ctx.createGain();
  tg.gain.value = 140;
  trill.connect(tg).connect(o.frequency);
  const g = envelope(ctx, t, 0.01, dur, 0.09);
  o.connect(g).connect(saida);
  o.start(t);
  trill.start(t);
  o.stop(t + dur + 0.05);
  trill.stop(t + dur + 0.05);
}

MUNDO_FX.coach = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "subir",
      n: 10,
      tam: [16, 26],
      dur: [1.2, 1.8],
      cores: ["#43A047", "#FFC107", "#1E88E5"],
      formas: [
        `<path d="M12 3L20 12H15V21H9V12H4Z" fill="currentColor"/>`,
        `<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="currentColor"/>`
      ]
    }),
  confete: { cores: ["#43A047", "#FFC107", "#1E88E5", "#E53935"], formas: ["estrela", "ret", "moeda"] },
  musicas: {
    party: "Hino da vitória",
    happy: "Playlist do treino",
    idle: "Aquecimento",
    upset: "Cãibra",
    sad: "Dia de descanso",
    cry: "Lesão no joelho"
  },
  subnicks: [
    "foco, força e água",
    "~ 1% melhor que ontem ~",
    "sem desculpas hoje",
    "treino pago, mente leve",
    "constância > intensidade"
  ],
  humorNomes: {
    Radiante: "Imparável",
    Feliz: "Focado",
    "De boa": "No aquecimento",
    Chateado: "Desmotivado",
    Triste: "Cansado",
    Arrasado: "Sem gás"
  },
  humorExtra(soma) {
    const d = coachDados();
    const e = d.energia[today()];
    if (e) soma((e - 3) * 2, "energia de hoje");
    const p = progressoDesafio(d);
    if (p && p.feitos >= 7) soma(2, "desafio em andamento");
  },
  legendasFotolog: [
    "eu e o cronômetro",
    "{n} metas batidas hoje",
    "{ml} de hidratação de campeão",
    "suor, foco e água",
    "{nome} no pódio"
  ],
  textos: {
    diario: "Avaliação do dia",
    diarioDica: "O que funcionou hoje? O que você melhora amanhã?",
    foco: "Treino focado",
    tarefas: "Metas de hoje",
    adicionar: "Bater meta",
    vazioHoje: "Nenhuma meta. Campeão começa com uma.",
    atrasadas: "Metas atrasadas",
    trazerTudo: "Trazer tudo pra hoje",
    fecharDia: "Fechar o treino",
    diaFechado: "Treino fechado. Orgulho!",
    reabrir: "Voltar pro treino",
    diaPerfeito: "Dia de campeão",
    adicionarHabito: "Pôr na rotina de campeão",
    vazioHabitos: "Nenhum hábito ainda. Escolha um e comece o desafio de 21 dias.",
    conviteTitulo: "Ninguém chega no pódio sozinho.",
    conviteBotao: "Treinar junto",
    pedidoChegou: "quer treinar junto com você. Bora?",
    conviteTexto: "Bora treinar junto no Prumo!",
    sonsTitulo: "Sons do treino",
    somFoco: "Treino",
    somFocoNome: "Batida de treino",
    somFocoDica: "Uma batida firme e baixinha enquanto o cronômetro roda.",
    somTarefa: "Apito",
    somTarefaNome: "Apito do treinador",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><path d="M5 20h4v-6H5zM10 20h4V8h-4zM15 20h4v-9h-4z" fill="var(--accent)"/></svg><small>${esc(fraseCoach())}</small></span>`,
  secaoHoje() {
    const d = coachDados();
    const p = progressoDesafio(d);
    const checkin = d.energia[today()];
    const desafio = p
      ? `<div class="desafio">${anelSVG(p.feitos)}<div><b>${esc(p.h.name)}</b><span class="note">Dia ${Math.min(p.dias, 99)} do desafio. ${p.feitos >= 21 ? "Completo!" : `Faltam ${21 - p.feitos}.`}</span>${p.feitos >= 21 && d.premiado !== d.desde ? `<button class="btn small primary" data-act="coach-medalha">Pegar a medalha (+50 gotas)</button>` : `<button class="btn small ghost" data-act="coach-trocar">Trocar desafio</button>`}</div></div>`
      : S.habits.length
        ? `<label class="row"><span class="note">Desafio 21 dias com</span><select data-change="coach-habito" aria-label="Hábito do desafio"><option value="">Escolha um hábito</option>${S.habits.map(h => `<option value="${h.id}">${esc(h.name)}</option>`).join("")}</select></label>`
        : `<span class="note">Crie um hábito na aba Hábitos para começar o desafio de 21 dias.</span>`;
    return cartaoMundo(
      "cm-coach",
      "Desafio 21 dias",
      `${d.medalhas ? `${d.medalhas} ${d.medalhas === 1 ? "medalha" : "medalhas"} · ` : ""}${esc(fraseCoach())}`,
      `${desafio}<div class="checkin"><span class="note">${checkin ? `Energia de hoje: ${checkin}/5` : "Como está sua energia hoje?"}</span><div class="row">${[1, 2, 3, 4, 5].map(n => `<button class="chip-bt" data-act="coach-energia" data-id="${n}" aria-pressed="${checkin === n}">${n}</button>`).join("")}</div>${energiaSVG(d)}</div>`
    );
  }
};

MUDANCAS_EXTRAS["coach-habito"] = el => {
  const d = coachDados();
  if (!S.habits.some(h => h.id === el.value)) return;
  d.habito = el.value;
  d.desde = today();
  react("party", "Desafio aceito! 21 dias. Bora!", 3000);
  commit();
};
ACOES_EXTRAS["coach-trocar"] = () => {
  const d = coachDados();
  delete d.habito;
  delete d.desde;
  commit();
};
ACOES_EXTRAS["coach-energia"] = (b, id) => {
  const d = coachDados();
  d.energia[today()] = Math.max(1, Math.min(5, +id || 3));
  react(
    +id >= 4 ? "party" : +id <= 2 ? "sad" : "happy",
    +id >= 4
      ? "Energia lá em cima! Aproveita."
      : +id <= 2
        ? "Dia de pegar leve. Descansar também é treino."
        : "Bora no ritmo certo.",
    2800
  );
  commit();
};
ACOES_EXTRAS["coach-medalha"] = () => {
  const d = coachDados();
  const p = progressoDesafio(d);
  if (!p || p.feitos < 21 || d.premiado === d.desde) return;
  d.premiado = d.desde;
  d.medalhas++;
  premioMundo(50, `21 dias de <b>${esc(p.h.name)}</b>! Medalha de ouro. <b>+50 gotas</b>.`);
  fx.big = true;
  commit();
};

SONS_MUNDO.coach = {
  concluir(ctx, saida, t) {
    apito(ctx, saida, t, 0.12);
    apito(ctx, saida, t + 0.18, 0.28);
  },
  ambiente(ctx) {
    const base = ambienteRuido(ctx, { freq: 200, tipo: "lowpass", vol: 0.03 });
    const parar = repetirSom(() => bumbo(ctx, base.saida, ctx.currentTime + 0.01, 1.4), 499, 501);
    return { parar: () => (parar(), base.parar()) };
  }
};

ITEMS.push(
  {
    id: "coach_viseira",
    p: "coach",
    slot: "hat",
    name: "Viseira",
    price: 90,
    svg: () =>
      `<path d="M30 42Q60 30 90 42" stroke="#1E88E5" stroke-width="7" fill="none"/><path d="M60 38Q94 36 106 48Q84 50 60 44Z" fill="#1565C0" ${O}/>`
  },
  {
    id: "coach_camiseta_foco",
    p: "coach",
    slot: "top",
    name: "Camiseta FOCO",
    price: 110,
    svg: () =>
      topBase("#212121") +
      `<text x="60" y="128" text-anchor="middle" font-size="17" font-weight="900" fill="#C6FF00" font-family="sans-serif" letter-spacing="1">FOCO</text>`
  },
  {
    id: "coach_toalha",
    p: "coach",
    slot: "neck",
    name: "Toalha no pescoço",
    price: 70,
    svg: () =>
      `<path d="M26 82Q60 100 94 82L96 112H84L82 94Q60 104 38 94L36 112H24Z" fill="#FFFFFF" ${O}/><path d="M24 106h12M84 106h12" stroke="#43A047" stroke-width="2.6"/>`
  },
  {
    id: "coach_corda",
    p: "coach",
    slot: "hand",
    name: "Corda de pular",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-2" y="-6" width="5" height="12" rx="2" fill="#E53935" stroke="var(--ink)" stroke-width="1"/><path d="M1 -6Q20 -40 40 -10" stroke="#424242" stroke-width="1.6" fill="none"/>`
      )
  },
  {
    id: "coach_palestra",
    p: "coach",
    slot: "hand",
    name: "Microfone de palestra",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 4L10 -14" stroke="#424242" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="-17" r="4.6" fill="#616161" stroke="var(--ink)" stroke-width="1"/>`
      )
  },
  {
    id: "coach_podio",
    p: "coach",
    slot: "bg",
    name: "Pódio com holofotes",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#263238" opacity=".35"/><path d="M20 -6L44 120M100 -6L76 120" stroke="#FFF59D" stroke-width="18" opacity=".18"/><rect x="0" y="120" width="34" height="28" fill="#B0BEC5" opacity=".7"/><rect x="86" y="126" width="34" height="22" fill="#BCAAA4" opacity=".7"/><text x="17" y="138" text-anchor="middle" font-size="12" font-weight="900" fill="#455A64">2</text><text x="103" y="142" text-anchor="middle" font-size="12" font-weight="900" fill="#5D4037">3</text>`
  }
);
