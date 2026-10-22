/*
  Mundo Programador: personalidade (falas), tema (cores, fonte, água) e itens da loja.
  Para criar um item novo, copie um item parecido aqui embaixo e troque id, nome, preço e desenho.
  Itens com "ach" no lugar de "price" são lendários (liberados por conquista).
*/
"use strict";

PERSONAS.programador = {
  name: "Programador",
  desc: "Lógico, cafeinado e cheio de piadas de TI.",
  sad: "Erro 404: produtividade não encontrada. Tô triste.",
  starter: ["oculos_redondos", "moletom_cinza", "cafe"],
  hi: "Hello, world{nome}! Backlog de hoje: <b>{n}</b> tarefas.",
  cheers: ["Task merged!", "Build passou! Uma a menos.", 'git commit -m "feito"'],
  drink: "Água > café (às vezes). <b>+{ml} mL</b>.",
  goal: "Meta de água: 200 OK.",
  thirsty: "Warning: hidratação baixa. Faltam <b>{ml} mL</b>.",
  late: "<b>{n}</b> tarefas em atraso. Hora de refatorar o dia.",
  night: "Deploy do dia feito. Fecha o dia e desliga.",
  done: "Zero bugs, zero pendências. Sprint concluída!",
  focus: "Deep work: notificações em /dev/null."
};

THEMES.programador = {
  font: '"VT323"',
  ds: 1.35,
  L: ["#EDF2EC", "#FFFFFF", "#0C1A10", "#0F7A36", "#22A866", "#F7FBF7"],
  D: ["#050A06", "#0C140E", "#C8F7D0", "#39FF6A", "#2BE07A", "#12201A"],
  water: { name: "água.exe", spd: 2.4, amp: 3, part: "bit" },
  vars: [
    { id: "base", name: "Terminal" },
    {
      id: "roxo",
      name: "Modo noturno roxo",
      price: 120,
      a: ["#6A4EE0", "#B39BFF"],
      w: ["#8F7BFF", "#B39BFF"]
    },
    { id: "lenda", name: "Âmbar", ach: "nivel5", a: ["#A86A00", "#FFB000"], w: ["#E09A00", "#FFB000"] }
  ]
};

ITEMS.push(
  /* PROGRAMADOR */
  {
    id: "dev_fones",
    p: "programador",
    slot: "hat",
    name: "Fones grandes",
    price: 110,
    svg: () =>
      `<path d="M21 60Q19 15 60 15Q101 15 99 60" fill="none" stroke="#3A3F4A" stroke-width="6" stroke-linecap="round"/><rect x="10" y="50" width="16" height="24" rx="7" fill="#5C6370" ${O}/><rect x="94" y="50" width="16" height="24" rx="7" fill="#5C6370" ${O}/>`
  },

  {
    id: "dev_cabelo",
    p: "programador",
    slot: "hair",
    name: "Cabelo bagunçado",
    price: 80,
    svg: () => hairMessy("#3B2A1E")
  },

  {
    id: "oculos_redondos",
    p: "programador",
    slot: "face",
    name: "Óculos redondos",
    price: 70,
    svg: () =>
      `<circle cx="47" cy="64" r="9.5" fill="#BFE3F2" fill-opacity=".25" stroke="var(--ink)" stroke-width="2.6"/><circle cx="73" cy="64" r="9.5" fill="#BFE3F2" fill-opacity=".25" stroke="var(--ink)" stroke-width="2.6"/><path d="M56.5 63Q60 60 63.5 63" fill="none" ${O}/>`
  },

  {
    id: "dev_cracha",
    p: "programador",
    slot: "neck",
    name: "Crachá",
    price: 50,
    svg: () =>
      `<path d="M34 84L56 108M86 84L64 108" stroke="#2F6FD6" stroke-width="2.4"/><rect x="51" y="106" width="18" height="14" rx="2" fill="#F7F7F5" ${O} stroke-width="1.4"/><path d="M54 111h12M54 115h8" stroke="#2F6FD6" stroke-width="1.4"/>`
  },

  {
    id: "dev_hello",
    p: "programador",
    slot: "top",
    name: "Camiseta </>",
    price: 90,
    svg: () =>
      tee(
        "#1E1F24",
        `<text x="60" y="118" font-size="14" text-anchor="middle" fill="#39FF6A" font-family="JetBrains Mono,monospace" font-weight="700">&lt;/&gt;</text>`
      )
  },

  {
    id: "moletom_cinza",
    p: "programador",
    slot: "top",
    name: "Moletom cinza",
    price: 120,
    svg: () => hoodie("#8A9099")
  },

  {
    id: "cafe",
    p: "programador",
    slot: "hand",
    name: "Caneca de café",
    price: 50,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M7 -5Q13 -4 13 0.5Q13 5 7 4" fill="none" ${O} stroke-width="2"/><rect x="-7" y="-9" width="14" height="16" rx="2.5" fill="#F4F4F2" ${O} stroke-width="1.8"/><path d="M-2 -13q2.4-3 0-6M3 -13q2.4-3 0-6" stroke="var(--muted)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      )
  },

  {
    id: "dev_patinho",
    p: "programador",
    slot: "hand",
    name: "Patinho de borracha",
    price: 70,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-11 2Q-11 12 0 12Q11 12 11 3Q11 -2 6 -1Q8 -11 0 -11Q-7 -11 -5 -2Q-11 -3 -11 2Z" fill="#FFD23F" ${O} stroke-width="1.8"/><path d="M-6 -6L-12 -4L-6 -3Z" fill="#FF8A1F"/><circle cx="-2" cy="-6" r="1.3" fill="#222"/>`
      )
  },

  {
    id: "capelo",
    p: "programador",
    slot: "hat",
    name: "Capelo de formatura",
    ach: "produtivo",
    svg: () =>
      `<path d="M40 32V44Q60 52 80 44V32" fill="#1E1F24" ${O}/><path d="M22 26L60 11L98 26L60 41Z" fill="#1E1F24" ${O}/><path d="M60 26L94 32V50" stroke="#F2C14E" stroke-width="2.5" fill="none"/><circle cx="94" cy="52" r="3.2" fill="#F2C14E"/>`
  },

  {
    id: "dev_garrafa",
    p: "programador",
    slot: "hand",
    name: "Garrafa com adesivos",
    ach: "semana_agua",
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-12" width="12" height="24" rx="4.5" fill="#3A3F4A" ${O} stroke-width="1.8"/><rect x="-4" y="-17" width="8" height="6" rx="1.5" fill="#39FF6A" ${O} stroke-width="1.4"/><circle cx="-1" cy="-4" r="2.6" fill="#FF4FB0"/><rect x="-3" y="2" width="6" height="4" rx="1" fill="#FFD23F"/>`
      )
  }
);
