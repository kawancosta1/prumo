/*
  Mundo Pagodeiro, extras:
  - Roda de samba: cada tarefa feita chama um instrumento pra roda (a meta de água também chama um).
    "Tocar a roda" toca de verdade um samba curtinho só com quem já chegou. Roda completa (7) dá +10 gotas por dia.
  - Cavaquinho ao concluir tarefa e ondas do mar no foco.
  - Notas subindo na troca de aba, falas, humor e roupas novas (tem cachorro caramelo).
*/
"use strict";

const INSTRUMENTOS_RODA = [
  { id: "pandeiro", nome: "Pandeiro", cor: "#F2C14E" },
  { id: "cavaco", nome: "Cavaquinho", cor: "#C98B4A" },
  { id: "surdo", nome: "Surdo", cor: "#1E88E5" },
  { id: "tanta", nome: "Tantã", cor: "#43A047" },
  { id: "repique", nome: "Repique", cor: "#E53935" },
  { id: "banjo", nome: "Banjo", cor: "#8E24AA" },
  { id: "violao", nome: "Violão 7 cordas", cor: "#6D4C2B" }
];
const naRoda = () => Math.min(7, feitasHoje() + (waterToday() >= S.waterGoal ? 1 : 0));

function rodaSVG(n) {
  const cx = 160,
    cy = 76,
    r = 42;
  const mesa = `<ellipse cx="${cx}" cy="${cy + 4}" rx="30" ry="14" fill="#8D6E63"/><ellipse cx="${cx}" cy="${cy}" rx="30" ry="14" fill="#A1887F"/><rect x="${cx - 4}" y="${cy - 14}" width="8" height="12" rx="2" fill="#FFF8E1" opacity=".9"/>`;
  const lugares = INSTRUMENTOS_RODA.map((ins, i) => {
    const a = -Math.PI / 2 + (i / 7) * Math.PI * 2;
    const x = cx + Math.cos(a) * r * 2.2,
      y = cy + Math.sin(a) * r * 1.2;
    const chegou = i < n;
    return `<g class="lugar ${chegou ? "chegou" : ""}" style="animation-delay:${i * 0.12}s" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="13" fill="${chegou ? ins.cor : "none"}" stroke="${chegou ? "#3E2723" : "#BCAAA4"}" stroke-width="1.4" stroke-dasharray="${chegou ? "" : "3 3"}"/>${chegou ? iconeInstrumento(ins.id) : ""}<text y="24" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="${chegou ? 0.9 : 0.4}">${ins.nome}</text></g>`;
  }).join("");
  return `<svg class="cm-cena roda" viewBox="0 0 320 150" role="img" aria-label="${n} de 7 instrumentos na roda">${[...Array(7)].map((_, i) => `<circle cx="${20 + i * 47}" cy="6" r="3" fill="#FFE082" opacity="${0.4 + (i % 2) * 0.4}"/>`).join("")}<path d="M0 6Q160 18 320 6" stroke="#6D4C41" stroke-width=".6" fill="none"/>${mesa}${lugares}</svg>`;
}
function iconeInstrumento(id) {
  const b = 'stroke="#3E2723" stroke-width="1.1"';
  return {
    pandeiro: `<circle r="7" fill="#FFF3E0" ${b}/>${[0, 72, 144, 216, 288].map(a => `<circle r="1.4" fill="#BDBDBD" transform="rotate(${a}) translate(0 -7)"/>`).join("")}`,
    cavaco: `<ellipse cy="3" rx="5" ry="5.6" fill="#E0A96D" ${b}/><rect x="-1.2" y="-9" width="2.4" height="9" fill="#5D4037"/><circle cy="3" r="1.6" fill="#3E2723"/>`,
    surdo: `<rect x="-7" y="-6" width="14" height="12" rx="2" fill="#E3F2FD" ${b}/><path d="M-7 -1h14" stroke="#1565C0" stroke-width="1.4"/>`,
    tanta: `<rect x="-5" y="-8" width="10" height="16" rx="2" fill="#E8F5E9" ${b}/><path d="M-5 -4h10M-5 4h10" stroke="#2E7D32" stroke-width="1.2"/>`,
    repique: `<rect x="-6" y="-5" width="12" height="10" rx="2" fill="#FFEBEE" ${b}/><path d="M-9 -9l6 5M9 -9l-6 5" stroke="#3E2723" stroke-width="1.4"/>`,
    banjo: `<circle cy="3" r="5.4" fill="#F3E5F5" ${b}/><rect x="-1.2" y="-9" width="2.4" height="8" fill="#5D4037"/>`,
    violao: `<path d="M0 -2a4 4 0 1 1 0 .1zM0 2a5 5 0 1 1 0 .1z" fill="#D7A86E" ${b}/><rect x="-1.2" y="-11" width="2.4" height="8" fill="#5D4037"/>`
  }[id];
}

/** Samba de 2 compassos só com os instrumentos que chegaram. */
function tocarRoda(ctx, saida, t, n) {
  const tem = id => INSTRUMENTOS_RODA.findIndex(i => i.id === id) < n;
  const sem = 0.135; // semicolcheia (~110 bpm)
  for (let c = 0; c < 2; c++) {
    const base = t + c * sem * 16;
    for (let k = 0; k < 16; k++) {
      const tk = base + k * sem;
      if (tem("pandeiro"))
        rajada(
          ctx,
          saida,
          tk,
          k % 4 === 0 ? 0.08 : 0.04,
          k % 4 === 3 ? 900 : 6000,
          k % 4 === 3 ? "bandpass" : "highpass",
          k % 4 === 0 ? 0.09 : 0.05
        );
      if (tem("surdo") && (k === 4 || k === 12)) bumbo(ctx, saida, tk, 0.45);
      if (tem("tanta") && (k === 0 || k === 7 || k === 10))
        tocarTom(ctx, saida, tk, 110, 0.25, "sine", 0.22, 0.004);
      if (tem("repique") && [3, 6, 11, 14].includes(k)) caixa(ctx, saida, tk, 0.1);
    }
    const acordes =
      c === 0
        ? [
            [587, 740, 880, 1175],
            [587, 740, 880, 1175]
          ]
        : [
            [554, 659, 784, 988],
            [587, 740, 880, 1175]
          ];
    if (tem("cavaco"))
      [0, 3, 6, 10, 12, 14].forEach((k, i) =>
        arpejo(ctx, saida, base + k * sem, acordes[i < 3 ? 0 : 1], 0.012, 0.35, 0.09, 0.4)
      );
    if (tem("banjo")) [2, 8, 13].forEach(k => dedilhar(ctx, saida, base + k * sem, 1175, 0.5, 0.12, 0.95));
    if (tem("violao"))
      [146.8, 164.8, 185, 196].forEach((f, i) =>
        dedilhar(ctx, saida, base + i * sem * 4, c === 0 ? f : f * 0.94, 0.9, 0.3, 0.6)
      );
  }
}

MUNDO_FX.pagodeiro = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "subir",
      n: 12,
      tam: [16, 26],
      dur: [1.4, 2.2],
      cores: ["#F2C14E", "#E53935", "#1E88E5", "#43A047"],
      formas: [
        `<path d="M13 3V15.5A3.4 2.8 0 1 1 10.5 13V3H19V7H13Z" fill="currentColor"/>`,
        `<path d="M8 4V16A3 2.6 0 1 1 6 13.6V7L17 5V14A3 2.6 0 1 1 15 11.6V4.5Z" fill="currentColor"/>`
      ]
    }),
  confete: {
    cores: ["#F2C14E", "#E53935", "#1E88E5", "#43A047", "#FFFFFF"],
    formas: ["nota", "nota", "estrela", "redondo"]
  },
  musicas: {
    party: "Roda de samba no quintal",
    happy: "Pagode de domingo",
    idle: "Cavaquinho afinando",
    upset: "Corda do cavaco estourou",
    sad: "Samba de saudade",
    cry: "Choro de bandolim"
  },
  subnicks: [
    "deixa a vida me levar",
    "~ na roda com os parça ~",
    "churrasco, pagode e água de coco",
    "resenha marcada pro fim de semana",
    "tamo junto e misturado"
  ],
  humorNomes: {
    Radiante: "Na resenha",
    Feliz: "No gingado",
    "De boa": "De chinelo",
    Chateado: "Fora do tom",
    Triste: "Samba de saudade",
    Arrasado: "Sem roda"
  },
  humorExtra(soma) {
    const d = new Date();
    if (d.getDay() === 0) soma(3, "domingo de pagode");
    if (naRoda() >= 7) soma(3, "roda completa");
  },
  aoConcluir() {
    const n = naRoda() + 1;
    if (n <= 7)
      setTimeout(
        () => react("happy", `Chegou o <b>${INSTRUMENTOS_RODA[n - 1].nome.toLowerCase()}</b> na roda!`, 2600),
        1400
      );
  },
  legendasFotolog: [
    "eu e o cavaco no quintal",
    "{n} sambas no repertório de hoje",
    "{ml} de água de coco",
    "chinelo, bermuda e sorriso",
    "{nome} puxando o samba"
  ],
  textos: {
    diario: "Resenha do dia",
    diarioDica: "Como foi a resenha de hoje? O que rolou de bom?",
    foco: "Ensaio da roda",
    tarefas: "Repertório de hoje",
    adicionar: "Pôr no repertório",
    vazioHoje: "Repertório vazio. Puxa o primeiro samba!",
    atrasadas: "Ficou pro outro pagode",
    fecharDia: "Encerrar a roda",
    diaFechado: "Roda encerrada. Que resenha!",
    reabrir: "Voltar pra roda",
    diaPerfeito: "Roda completa",
    adicionarHabito: "Pôr no pagode de sempre",
    vazioHabitos: "Nenhum costume ainda. Todo pagode tem seu ensaio: comece com um.",
    vazioCompromissos: "Nada marcado. Bora marcar a resenha?",
    vazioPessoas: "Ninguém na lista. Põe os parça da roda.",
    conviteTitulo: "Pagode bom é com os parça.",
    conviteBotao: "Chamar pra roda",
    pedidoChegou: "quer entrar na sua roda. Bora?",
    conviteTexto: "Cola na minha roda no Prumo!",
    sonsTitulo: "Sons da roda",
    somFoco: "Mar",
    somFocoNome: "Ondas da praia",
    somFocoDica: "Ondas do mar enquanto o cronômetro roda.",
    somTarefa: "Cavaquinho",
    somTarefaNome: "Batida de cavaquinho",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#FFF3E0" stroke="#3E2723" stroke-width="1.2"/>${[0, 60, 120, 180, 240, 300].map(a => `<circle r="1.6" fill="#BDBDBD" transform="translate(12 12) rotate(${a}) translate(0 -9)"/>`).join("")}</svg><small>${naRoda()}/7 na roda</small></span>`,
  secaoHoje() {
    const n = naRoda();
    const d = dadosMundo("pagodeiro");
    const premio = n >= 7 && d.rodaCompleta !== today();
    return cartaoMundo(
      "cm-roda",
      "Roda de samba",
      n >= 7
        ? "Roda completa! Todo mundo tocando."
        : `Cada tarefa feita chama um instrumento. Falta ${INSTRUMENTOS_RODA[n].nome.toLowerCase()}.`,
      `${rodaSVG(n)}<div class="cm-botoes">${n ? `<button class="btn small ${premio ? "" : "primary"}" data-act="pagode-tocar">Tocar a roda</button>` : ""}${premio ? `<button class="btn small primary" data-act="pagode-completa">Roda completa (+10 gotas)</button>` : ""}</div>`
    );
  }
};

ACOES_EXTRAS["pagode-tocar"] = () => {
  const ctx = pegarAudio();
  if (ctx) tocarRoda(ctx, saidaMundo(ctx, 0.9), ctx.currentTime + 0.05, naRoda());
};
ACOES_EXTRAS["pagode-completa"] = () => {
  const d = dadosMundo("pagodeiro");
  if (naRoda() < 7 || d.rodaCompleta === today()) return;
  d.rodaCompleta = today();
  ACOES_EXTRAS["pagode-tocar"]();
  premioMundo(10, "Roda completa! O samba não pode parar. <b>+10 gotas</b>.");
  fx.big = true;
  commit();
};

SONS_MUNDO.pagodeiro = {
  concluir(ctx, saida, t) {
    arpejo(ctx, saida, t, [587, 740, 880, 1175], 0.014, 0.5, 0.14, 0.5);
    arpejo(ctx, saida, t + 0.2, [587, 740, 880, 1175], 0.01, 0.6, 0.12, 0.5);
    rajada(ctx, saida, t + 0.1, 0.06, 6000, "highpass", 0.05);
  },
  ambiente: ctx => ambienteRuido(ctx, { freq: 600, tipo: "lowpass", vol: 0.12, onda: 0.12 })
};

ITEMS.push(
  {
    id: "pag_panama_preto",
    p: "pagodeiro",
    slot: "hat",
    name: "Panamá preto",
    price: 140,
    svg: () =>
      `<path d="M38 36Q36 14 60 13Q84 14 82 36Z" fill="#2B2B2B" ${O}/><path d="M38 30Q60 25 82 30" stroke="#F2C14E" stroke-width="4" fill="none"/><path d="M18 38Q60 28 102 38Q100 44 90 43Q60 36 30 43Q20 44 18 38Z" fill="#2B2B2B" ${O}/>`
  },
  {
    id: "pag_camisa_time",
    p: "pagodeiro",
    slot: "top",
    name: "Camisa listrada de time",
    price: 130,
    svg: () =>
      topBase("#FFFFFF") +
      stripesV("#1B5E20", 16, 8, 4) +
      `<path d="M48 88Q60 98 72 88" stroke="#1B5E20" stroke-width="3" fill="none"/>`
  },
  {
    id: "pag_cordao",
    p: "pagodeiro",
    slot: "neck",
    name: "Cordão fino de ouro",
    price: 120,
    svg: () =>
      `<path d="M34 86Q60 108 86 86" stroke="#E0B23A" stroke-width="2.2" fill="none"/><circle cx="60" cy="98" r="3.4" fill="#F2C14E" stroke="#B7892B" stroke-width="1"/>`
  },
  {
    id: "pag_tanta",
    p: "pagodeiro",
    slot: "hand",
    name: "Tantã",
    price: 130,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-2" y="-22" width="18" height="30" rx="4" fill="#E8F5E9" stroke="var(--ink)" stroke-width="1.6"/><path d="M-2 -14h18M-2 0h18" stroke="#2E7D32" stroke-width="2"/><ellipse cx="7" cy="-22" rx="9" ry="3" fill="#FFF8E1" stroke="var(--ink)" stroke-width="1.2"/>`
      )
  },
  {
    id: "pag_quintal",
    p: "pagodeiro",
    slot: "bg",
    name: "Pagode no quintal",
    price: 170,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#FFE0B2" opacity=".5"/><path d="M0 10Q30 22 60 12T120 10" stroke="#6D4C41" stroke-width=".8" fill="none"/>${[8, 22, 36, 50, 64, 78, 92, 106].map((x, i) => `<circle cx="${x}" cy="${14 + Math.sin(i) * 3}" r="3" fill="#FFD54F" opacity=".9"/>`).join("")}<path d="M0 118H120V148H0Z" fill="#A1887F" opacity=".45"/><path d="M96 70h20v48h-20z" fill="#8D6E63" opacity=".5"/>`
  },
  {
    id: "pag_caramelo",
    p: "pagodeiro",
    slot: "pet",
    name: "Vira-lata caramelo",
    price: 160,
    svg: () =>
      `<g transform="translate(15 128)"><path d="M-10 -6Q-10 -12 -2 -11H8Q13 -11 12 -3Q12 2 6 2H-6Q-10 2 -10 -6Z" fill="#D9963F" stroke="var(--ink)" stroke-width="1.1"/><path d="M-7 1v7M-3 1v7M5 1v7M9 1v7" stroke="#B9772A" stroke-width="2.2" stroke-linecap="round"/><path d="M8 -9Q8 -19 15 -19Q21 -19 21 -12Q21 -7 15 -6Z" fill="#D9963F" stroke="var(--ink)" stroke-width="1.1"/><path d="M11 -18Q8 -22 10 -14Z" fill="#B9772A"/><ellipse cx="20" cy="-11.5" rx="2.4" ry="1.8" fill="#FFF3E0"/><circle cx="21.6" cy="-12" r="1" fill="#141416"/><circle cx="16" cy="-14.5" r=".9" fill="#141416"/><path d="M-10 -8q-5-4-3-9" stroke="#D9963F" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-3 -10Q2 -8 6 -10" stroke="#FFF3E0" stroke-width="1.4" fill="none"/></g>`
  }
);
