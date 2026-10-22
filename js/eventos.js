/*
  Eventos com itens por tempo limitado (Halloween, Sexta-feira 13, Dia do Rock).
  Itens de evento usam p: "*" (aparecem em todos os mundos) e evento: "<id>".
  Só dá para comprar enquanto o evento está ativo; quem comprou fica com o item pra sempre.
  Para criar um evento: adicione em EVENTOS (com ativo(data) e prazo()) e itens com evento: "<id>".
*/
"use strict";

const mmdd = d => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const EVENTOS = {
  halloween: {
    nome: "Halloween",
    ativo: d => mmdd(d) >= "10-20" && mmdd(d) <= "11-02",
    prazo: () => "02/11"
  },
  sexta13: {
    nome: "Sexta-feira 13",
    // Fica aberto na sexta 13 e no fim de semana seguinte
    ativo: d =>
      [0, 1, 2].some(k => {
        const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - k);
        return x.getDate() === 13 && x.getDay() === 5;
      }),
    prazo: () => "domingo"
  },
  diaRock: {
    nome: "Dia do Rock",
    ativo: d => mmdd(d) >= "07-10" && mmdd(d) <= "07-16",
    prazo: () => "16/07"
  }
};

/** O evento deste item está acontecendo agora? */
const eventoAtivo = item => !!(item.evento && EVENTOS[item.evento] && EVENTOS[item.evento].ativo(new Date()));
/** Eventos acontecendo hoje (para o aviso na loja). */
const eventosHoje = () => Object.entries(EVENTOS).filter(([, ev]) => ev.ativo(new Date()));

ITEMS.push(
  /* ---------- Halloween ---------- */
  {
    id: "hw_bruxa",
    p: "*",
    evento: "halloween",
    slot: "hat",
    name: "Chapéu de bruxa",
    price: 90,
    svg: () =>
      `<path d="M30 40Q46 36 50 8Q56 -4 74 6Q64 8 66 24Q70 36 90 40Z" fill="#2A1B3D" ${O}/><path d="M44 30Q60 26 76 30L78 36Q60 32 42 36Z" fill="#FF8A1F"/><ellipse cx="60" cy="41" rx="42" ry="7" fill="#2A1B3D" ${O}/><rect x="56" y="29" width="8" height="7" rx="1" fill="none" stroke="#F2C14E" stroke-width="1.6"/>`
  },
  {
    id: "hw_abobora",
    p: "*",
    evento: "halloween",
    slot: "hand",
    name: "Balde de abóbora",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 -6Q0 -14 9 -6" fill="none" stroke="#3A2A1E" stroke-width="1.6"/><ellipse rx="11" ry="9.5" fill="#FF8A1F" ${O} stroke-width="1.6"/><path d="M-4 -9Q-6 0 -4 9M4 -9Q6 0 4 9" stroke="#C25E0C" stroke-width="1.2" fill="none"/><path d="M-6 -3L-3 -6L0 -3ZM6 -3L3 -6L0 -3Z" fill="#2A1B12"/><path d="M-6 3Q0 8 6 3L3 4L0 2.6L-3 4Z" fill="#2A1B12"/>`
      )
  },
  {
    id: "hw_capa",
    p: "*",
    evento: "halloween",
    slot: "back",
    name: "Capa de conde",
    price: 150,
    svg: () =>
      `<path d="M28 48Q12 96 4 142L60 128L116 142Q108 96 92 48Z" fill="#141016" ${O}/><path d="M34 56Q22 98 16 134L60 124L104 134Q98 98 86 56Z" fill="#5B2E7A"/><path d="M26 48L12 20L44 42M94 48L108 20L76 42" fill="#141016" ${O}/>`
  },
  {
    id: "hw_fantasminha",
    p: "*",
    evento: "halloween",
    slot: "pet",
    name: "Fantasminha",
    price: 120,
    svg: () =>
      `<g transform="translate(16 30)"><path d="M-8 10V-2A8 8 0 0 1 8 -2V10L5 7.5L2.5 10L0 7.5L-2.5 10L-5 7.5Z" fill="#F7F5FA" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="-2.6" cy="-1" rx="1.3" ry="1.8" fill="#141416"/><ellipse cx="2.6" cy="-1" rx="1.3" ry="1.8" fill="#141416"/><ellipse cy="3.2" rx="1.6" ry="1.2" fill="#141416"/></g>`
  },
  {
    id: "hw_cenario",
    p: "*",
    evento: "halloween",
    slot: "bg",
    name: "Noite de Halloween",
    price: 140,
    svg: () =>
      `<circle cx="100" cy="16" r="11" fill="#FFB347" opacity=".85"/>${bat(22, 18, 0.7, "#2A1B3D")}${bat(36, 32, 0.5, "#2A1B3D")}${bat(88, 34, 0.45, "#2A1B3D")}<g transform="translate(14 136)"><ellipse rx="10" ry="8" fill="#FF8A1F"/><path d="M-4 -2L-2 -4L0 -2ZM4 -2L2 -4L0 -2Z M-4 2Q0 5 4 2Z" fill="#2A1B12"/><path d="M0 -8V-11" stroke="#2E5A2A" stroke-width="2"/></g><g transform="translate(106 140) scale(.8)"><ellipse rx="10" ry="8" fill="#FF8A1F"/><path d="M0 -8V-11" stroke="#2E5A2A" stroke-width="2"/></g>`
  },
  /* ---------- Sexta-feira 13 ---------- */
  {
    id: "s13_gato",
    p: "*",
    evento: "sexta13",
    slot: "pet",
    name: "Gato preto da sorte",
    price: 130,
    svg: () =>
      `<g transform="translate(14 118)"><path d="M10 6Q18 2 16 -8" fill="none" stroke="#141416" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="2" cy="4" rx="9" ry="7" fill="#141416"/><circle cx="0" cy="-6" r="6.5" fill="#141416"/><path d="M-6 -8L-6 -15L-1.5 -11ZM6 -8L6 -15L1.5 -11Z" fill="#141416"/><ellipse cx="-2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#5FD06C"/><ellipse cx="2.4" cy="-6.5" rx="1.4" ry="1.8" fill="#5FD06C"/><text x="0" y="6" font-size="5" text-anchor="middle" fill="#F2C14E" font-weight="900" font-family="sans-serif">13</text></g>`
  },
  {
    id: "s13_espelho",
    p: "*",
    evento: "sexta13",
    slot: "hand",
    name: "Espelho rachado",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-2" y="6" width="4" height="10" rx="1.5" fill="#6B4E3D"/><ellipse cy="-2" rx="8" ry="10" fill="#B8975A" ${O} stroke-width="1.4"/><ellipse cy="-2" rx="6" ry="8" fill="#DCEBF2"/><path d="M-3 -8L0 -2L-2 2L2 6M0 -2L4 -4" stroke="#7A8A96" stroke-width=".9" fill="none"/>`
      )
  },
  /* ---------- Dia do Rock ---------- */
  {
    id: "rock_palheta",
    p: "*",
    evento: "diaRock",
    slot: "hand",
    name: "Palheta gigante",
    price: 80,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-9 -9Q0 -13 9 -9Q10 2 0 12Q-10 2 -9 -9Z" fill="#C8102E" ${O} stroke-width="1.6"/><path d="M-3 -4L3 -4L0 3Z" fill="#fff" opacity=".7"/>`
      )
  },
  {
    id: "rock_colar_palhetas",
    p: "*",
    evento: "diaRock",
    slot: "neck",
    name: "Colar de palhetas",
    price: 90,
    svg: () =>
      `<path d="M30 84Q60 102 90 84" fill="none" stroke="#2B2D3A" stroke-width="1.6"/>` +
      necklacePts(5)
        .map(
          ([x, y], i) =>
            `<path d="M${x - 3} ${y}Q${x} ${y - 1.5} ${x + 3} ${y}Q${x + 3} ${y + 4} ${x} ${y + 7}Q${x - 3} ${y + 4} ${x - 3} ${y}Z" fill="${["#C8102E", "#F2C14E", "#2F6FD6", "#5FD06C", "#FF4FB0"][i]}" ${O} stroke-width="1"/>`
        )
        .join("")
  }
);
