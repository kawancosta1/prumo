/*
  Mundo Sertanejo, extras:
  - Roça: três canteiros (milho, feijão, girassol). Cada tarefa concluída rega um canteiro;
    com 5 regas a planta fica madura e dá pra colher (+12 gotas). Depois planta outra coisa.
  - Céu da roça no cartão: amanhecer, sol, pôr do sol ou noite estrelada conforme a hora real.
  - Viola caipira ao concluir tarefa e grilos com vento no foco.
  - Chapéus voando na troca de aba, falas, humor, legendas e roupas novas.
*/
"use strict";

const PLANTAS_ROCA = ["milho", "feijao", "girassol"];
const NOME_PLANTA = { milho: "Milho", feijao: "Feijão", girassol: "Girassol" };
const REGAS_MADURA = 5;

function rocaDados() {
  const d = dadosMundo("sertanejo");
  if (!Array.isArray(d.canteiros) || d.canteiros.length !== 3)
    d.canteiros = PLANTAS_ROCA.map(tipo => ({ tipo, regas: 0 }));
  d.canteiros.forEach((c, i) => {
    if (!PLANTAS_ROCA.includes(c.tipo)) c.tipo = PLANTAS_ROCA[i];
    c.regas = Math.max(0, Math.min(REGAS_MADURA, Math.round(+c.regas || 0)));
  });
  d.colhidos = Math.max(0, Math.round(+d.colhidos || 0));
  return d;
}

/** Hora do céu: "manha" (até 10h), "dia", "tarde" (pôr do sol, 17h às 19h) ou "noite". */
function ceuDaRoca(h = new Date().getHours()) {
  if (h >= 5 && h < 10) return "manha";
  if (h >= 10 && h < 17) return "dia";
  if (h >= 17 && h < 19) return "tarde";
  return "noite";
}
const CORES_CEU = {
  manha: ["#FFD9A8", "#BFE3F2"],
  dia: ["#8FD0EE", "#DDF3FB"],
  tarde: ["#F2994A", "#F7C873"],
  noite: ["#141B33", "#2C3560"]
};

/** Desenho de uma planta no estágio 0..5 (5 = madura). */
function plantaSVG(tipo, regas, x) {
  const chao = `<ellipse cx="${x}" cy="104" rx="30" ry="7" fill="#7A4E2A"/><path d="M${x - 24} 103q8-4 16 0t16 0t16 0" stroke="#5C3A1E" stroke-width="2" fill="none"/>`;
  if (regas === 0) return chao + `<circle cx="${x}" cy="100" r="2.2" fill="#C9A06A"/>`;
  const altura = [0, 10, 20, 32, 44, 52][regas];
  const caule = `<path d="M${x} 102V${102 - altura}" stroke="#3C8D3A" stroke-width="3" stroke-linecap="round"/>`;
  let folhas = "";
  for (let i = 1; i <= Math.min(regas, 4); i++) {
    const y = 102 - (altura * i) / 5;
    const lado = i % 2 ? 1 : -1;
    folhas += `<path d="M${x} ${y}q${lado * 12} -6 ${lado * 16} 2q${-lado * 8} 4 ${-lado * 16} -2z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1"/>`;
  }
  let fruto = "";
  if (regas >= REGAS_MADURA) {
    const topo = 102 - altura;
    if (tipo === "milho")
      fruto = `<g transform="translate(${x + 6} ${topo + 18}) rotate(20)"><ellipse rx="5" ry="11" fill="#F2C94C" stroke="#B7892B" stroke-width="1.2"/><path d="M-3-6h6M-3-2h6M-3 2h6M-3 6h6" stroke="#B7892B" stroke-width=".8"/><path d="M-5 8q-4-10 1-16M5 8q4-10-1-16" stroke="#6BAF3D" stroke-width="2" fill="none"/></g><path d="M${x} ${topo}l-4-8M${x} ${topo}l4-8M${x} ${topo}v-9" stroke="#D9B26A" stroke-width="1.6"/>`;
    else if (tipo === "feijao")
      fruto = [
        [-12, 20],
        [10, 30],
        [-10, 38]
      ]
        .map(
          ([dx, dy]) =>
            `<path d="M${x + dx} ${topo + dy}q${dx > 0 ? 8 : -8} 2 ${dx > 0 ? 10 : -10} 10" stroke="#7CB342" stroke-width="4" stroke-linecap="round" fill="none"/>`
        )
        .join("");
    else
      fruto = `<g transform="translate(${x} ${topo})">${[...Array(12)].map((_, i) => `<ellipse rx="3.2" ry="8" transform="rotate(${i * 30}) translate(0 -9)" fill="#FFC928" stroke="#E0A100" stroke-width=".8"/>`).join("")}<circle r="6.5" fill="#6D4C2B"/><circle r="6.5" fill="url(#roca-miolo)"/></g>`;
  } else if (regas >= 3) fruto = `<circle cx="${x}" cy="${102 - altura}" r="3" fill="#8BC34A"/>`;
  return chao + caule + folhas + fruto;
}

function rocaSVG() {
  const d = rocaDados();
  const hora = ceuDaRoca();
  const [c1, c2] = CORES_CEU[hora];
  const astro =
    hora === "noite"
      ? `<circle cx="282" cy="24" r="10" fill="#F4F1DE"/><circle cx="286" cy="21" r="9" fill="${c1}"/>${[...Array(14)].map((_, i) => `<circle class="estrela-roca" style="animation-delay:${(i * 0.37) % 3}s" cx="${(i * 53) % 320}" cy="${8 + ((i * 29) % 40)}" r="${i % 3 ? 0.9 : 1.4}" fill="#fff"/>`).join("")}`
      : `<circle cx="${hora === "manha" ? 40 : hora === "tarde" ? 270 : 160}" cy="${hora === "dia" ? 20 : 46}" r="14" fill="${hora === "tarde" ? "#FF7A3D" : "#FFD34D"}" opacity=".95"/>`;
  const vagalumes =
    hora === "noite"
      ? [...Array(6)]
          .map(
            (_, i) =>
              `<circle class="vagalume" style="animation-delay:${i * 0.6}s" cx="${40 + i * 48}" cy="${70 + (i % 3) * 8}" r="1.8" fill="#E6F96B"/>`
          )
          .join("")
      : "";
  return `<svg class="cm-cena roca" viewBox="0 0 320 120" role="img" aria-label="Roça com ${d.canteiros.map(c => NOME_PLANTA[c.tipo]).join(", ")}">
    <defs><linearGradient id="roca-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="roca-miolo"><stop offset="0" stop-color="#3E2A16"/><stop offset="1" stop-color="#6D4C2B"/></radialGradient></defs>
    <rect width="320" height="120" fill="url(#roca-ceu)"/>${astro}
    <path d="M0 78Q80 58 160 72T320 66V120H0Z" fill="${hora === "noite" ? "#1F3B2A" : "#7CB66A"}"/>
    <path d="M0 92Q90 80 200 90T320 86V120H0Z" fill="${hora === "noite" ? "#173023" : "#5E9E4E"}"/>
    <g stroke="#8B5A2B" stroke-width="3">${[8, 40, 280, 312].map(x => `<path d="M${x} 82V104"/>`).join("")}<path d="M4 88H44M276 88H316" stroke-width="2.4"/></g>
    ${d.canteiros.map((c, i) => plantaSVG(c.tipo, c.regas, 85 + i * 75)).join("")}
    ${vagalumes}
  </svg>`;
}

MUNDO_FX.sertanejo = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "atravessar",
      n: 7,
      tam: [24, 40],
      dur: [1.6, 2.4],
      cores: ["#9C6A35", "#F2EEE4", "#5C3A1E"],
      formas: [
        `<path d="M7 13Q6 4 10 4.5Q12 7 14 4.5Q18 4 17 13Z" fill="currentColor" stroke="#2B1D12" stroke-width="1"/><path d="M1 13.5Q12 9 23 13.5Q22.5 16 20 15.5Q12 12.5 4 15.5Q1.5 16 1 13.5Z" fill="currentColor" stroke="#2B1D12" stroke-width="1"/>`,
        `<path d="M12 3c-3 4-3 8 0 18c3-10 3-14 0-18z" fill="#D9B26A"/><path d="M12 6v15" stroke="#A9803A" stroke-width=".8"/>`
      ]
    }),
  confete: {
    cores: ["#C2410C", "#F2C14E", "#2F8C8C", "#8B4A1C", "#F3EBDD"],
    formas: ["folha", "estrela", "ret", "flor"]
  },
  musicas: {
    party: "Modão de rodeio (ao vivo)",
    happy: "Estrada de chão",
    idle: "Viola no alpendre",
    upset: "Porteira fechada",
    sad: "Sofrência das antigas",
    cry: "Chora, viola"
  },
  subnicks: [
    "bão demais da conta",
    "~ tocando uma moda de viola ~",
    "no rancho, sem sinal e feliz",
    "lida feita, coração tranquilo",
    "café passado e pão de queijo"
  ],
  humorNomes: {
    Radiante: "Bão demais",
    Feliz: "Sossegado",
    "De boa": "De boa na rede",
    Chateado: "Cabreiro",
    Triste: "Na sofrência",
    Arrasado: "Mais triste que modão"
  },
  humorExtra(soma) {
    const agora = new Date();
    if (agora.getDay() === 6) soma(3, "sábado de rodeio");
    if (ceuDaRoca() === "tarde") soma(2, "pôr do sol no campo");
  },
  aoConcluir(x) {
    if (x.regou) return;
    x.regou = 1;
    const d = rocaDados();
    const c = d.canteiros.filter(k => k.regas < REGAS_MADURA).sort((a, b) => a.regas - b.regas)[0];
    if (!c) return;
    c.regas++;
    if (c.regas === REGAS_MADURA)
      setTimeout(
        () =>
          notificar({
            titulo: "Colheita pronta",
            texto: `${NOME_PLANTA[c.tipo]} maduro na roça! Colhe lá no Hoje.`,
            mood: "party",
            aba: "hoje"
          }),
        1600
      );
  },
  legendasFotolog: [
    "eu e a viola no fim de tarde",
    "{n} lidas feitas, agora é moda de viola",
    "{ml} de água da mina",
    "pôr do sol na porteira",
    "{nome} no rancho, chapéu no peito"
  ],
  textos: {
    diario: "Causo do dia",
    diarioDica: "Conta o causo de hoje: o que deu certo na lida e o que ficou pra amanhã?",
    foco: "Lida concentrada",
    tarefas: "Lida do dia",
    adicionar: "Pôr na lida",
    vazioHoje: "Lida vazia. Coloca a primeira tarefa e bora tocar a boiada.",
    atrasadas: "Ficou pra trás na estrada",
    trazerTudo: "Trazer tudo pra hoje",
    fecharDia: "Fechar a porteira",
    fecharComPendentes: "Deixar {n} pra amanhã e fechar a porteira",
    diaFechado: "Porteira fechada. Dia bão!",
    reabrir: "Abrir a porteira",
    diaPerfeito: "Dia de rodeio campeão",
    adicionarHabito: "Pôr na rotina do rancho",
    vazioHabitos: "Nenhum costume ainda. Todo rancho tem sua rotina: comece com uma.",
    vazioCompromissos: "Nenhum compromisso. Que tal marcar um rodeio com a turma?",
    vazioPessoas: "Ninguém na lista ainda. Põe a família e os compadres.",
    vazioEstudos: "Nenhum estudo nesta semana. A viola também precisa de ensaio.",
    conviteTitulo: "Toda dupla sertaneja começa com um convite.",
    conviteBotao: "Formar a dupla",
    pedidoChegou: "quer formar dupla com você. Topa?",
    conviteTexto: "Bora formar dupla no Prumo, sô!",
    sonsTitulo: "Sons da roça",
    somFoco: "Grilos",
    somFocoNome: "Noite na roça",
    somFocoDica: "Grilos e vento leve enquanto o cronômetro roda.",
    somTarefa: "Viola",
    somTarefaNome: "Ponteado de viola",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero() {
    const h = ceuDaRoca();
    const nome = {
      manha: "Amanhecer na roça",
      dia: "Sol no campo",
      tarde: "Pôr do sol",
      noite: "Noite estrelada"
    }[h];
    const icone =
      h === "noite"
        ? `<svg viewBox="0 0 24 24"><circle cx="13" cy="11" r="7" fill="#F4F1DE"/><circle cx="16" cy="9" r="6" fill="var(--surface)"/></svg>`
        : `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.5" fill="${h === "tarde" ? "#FF7A3D" : "#FFC928"}"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M12 2.5v3" stroke="#FFC928" stroke-width="1.8" stroke-linecap="round" transform="rotate(${a} 12 12)"/>`).join("")}</svg>`;
    return `<span class="enfeite-mundo">${icone}<small>${nome}</small></span>`;
  },
  secaoHoje() {
    const d = rocaDados();
    const madura = d.canteiros.findIndex(c => c.regas >= REGAS_MADURA);
    const status = d.canteiros.map(c => `${NOME_PLANTA[c.tipo]} ${c.regas}/${REGAS_MADURA}`).join(" · ");
    return cartaoMundo(
      "cm-roca",
      "Roça",
      `Cada tarefa feita rega um canteiro. ${d.colhidos ? `${d.colhidos} ${d.colhidos === 1 ? "colheita" : "colheitas"} até hoje.` : ""}`,
      `${rocaSVG()}<span class="note">${status}</span>${madura >= 0 ? `<div class="cm-botoes"><button class="btn small primary" data-act="roca-colher" data-id="${madura}">Colher ${NOME_PLANTA[d.canteiros[madura].tipo].toLowerCase()} (+12 gotas)</button></div>` : ""}`
    );
  }
};

ACOES_EXTRAS["roca-colher"] = (b, id) => {
  const d = rocaDados();
  const c = d.canteiros[+id];
  if (!c || c.regas < REGAS_MADURA) return;
  const colhido = NOME_PLANTA[c.tipo];
  // planta outra coisa no lugar (gira entre as três)
  c.tipo = PLANTAS_ROCA[(PLANTAS_ROCA.indexOf(c.tipo) + 1) % PLANTAS_ROCA.length];
  c.regas = 0;
  d.colhidos++;
  premioMundo(12, `Colheita boa! ${colhido} no paiol. <b>+12 gotas</b>.`);
  fx.big = true;
  commit();
};

/* ---------- sons: viola caipira e noite na roça ---------- */
SONS_MUNDO.sertanejo = {
  concluir(ctx, saida, t) {
    // ponteado em terças, jeito de viola caipira (sol maior)
    const notas = [
      [392, 494],
      [440, 523],
      [494, 587],
      [587, 740]
    ];
    notas.forEach((par, i) => par.forEach(f => dedilhar(ctx, saida, t + i * 0.11, f, 1.4, 0.2, 0.9)));
  },
  ambiente: ctx =>
    ambienteComposto(ctx, { freq: 500, tipo: "lowpass", vol: 0.05, onda: 0.07 }, [
      [grilo, 260, 900],
      [grilo, 500, 1600]
    ])
};

/* ---------- roupas novas ---------- */
ITEMS.push(
  {
    id: "sert_peao",
    p: "sertanejo",
    slot: "hat",
    name: "Chapéu de peão preto",
    price: 150,
    svg: () => cowboyHat("#2B2320", "#C9A06A")
  },
  {
    id: "sert_palha",
    p: "sertanejo",
    slot: "hat",
    name: "Chapéu de palha de roça",
    price: 90,
    svg: () =>
      `<path d="M36 36Q34 12 60 11Q86 12 84 36Z" fill="#E7C977" ${O}/><path d="M40 22H80M38 29H82" stroke="#B9953F" stroke-width="1.6"/><path d="M38 31Q60 26 82 31" stroke="#B3122E" stroke-width="4" fill="none"/><path d="M4 39Q60 24 116 39Q113 47 100 45Q60 34 20 45Q7 47 4 39Z" fill="#E7C977" ${O}/><path d="M14 42l3 2M30 38l2 3M90 38l-2 3M104 42l-3 2" stroke="#B9953F" stroke-width="1.4"/>`
  },
  {
    id: "sert_bordada",
    p: "sertanejo",
    slot: "top",
    name: "Camisa de rodeio bordada",
    price: 160,
    svg: () =>
      topBase("#8B1E2D") +
      `<path d="M0 84Q20 92 34 104L22 112Q8 100 0 96Z M120 84Q100 92 86 104L98 112Q112 100 120 96Z" fill="#F4EFE6"/><path d="M60 92V150" stroke="#5E1220" stroke-width="1.4"/>${[100, 112, 124, 136].map(y => `<circle cx="60" cy="${y}" r="1.6" fill="#F4EFE6"/>`).join("")}<path d="M24 118q6-8 12 0q-6 8-12 0zM84 118q6-8 12 0q-6 8-12 0z" fill="#C2410C"/><path d="M30 112v12M90 112v12" stroke="#2F8C8C" stroke-width="1.2"/>`
  },
  {
    id: "sert_fivela",
    p: "sertanejo",
    slot: "waist",
    name: "Cinto com fivela de rodeio",
    price: 130,
    svg: () =>
      `<rect x="0" y="112" width="120" height="8" fill="#5C3A1E"/><rect x="0" y="113" width="120" height="1" fill="#8B5A2B"/><ellipse cx="60" cy="116" rx="13" ry="9" fill="#D9B26A" stroke="#7A5A22" stroke-width="1.6"/><ellipse cx="60" cy="116" rx="9" ry="5.6" fill="#C0C6CC" stroke="#7A5A22" stroke-width="1"/><path d="M55 118q2-6 5-3q3-3 5 3" stroke="#5C3A1E" stroke-width="1.4" fill="none"/>`
  },
  {
    id: "sert_berrante",
    p: "sertanejo",
    slot: "hand",
    name: "Berrante",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M-4 -2Q8 -14 26 -18L28 -10Q10 -6 0 4Z" fill="#E8DCC4" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 -9l2 4M15 -13l2 4" stroke="#8B5A2B" stroke-width="2"/><ellipse cx="27" cy="-14" rx="2.4" ry="4.6" transform="rotate(-14 27 -14)" fill="#2B1D12"/>`
      )
  },
  {
    id: "sert_laco",
    p: "sertanejo",
    slot: "hand",
    name: "Laço de corda",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<ellipse cx="10" cy="-14" rx="14" ry="7" fill="none" stroke="#C9A06A" stroke-width="2.6"/><ellipse cx="10" cy="-14" rx="14" ry="7" fill="none" stroke="#8B5A2B" stroke-width="1" stroke-dasharray="2 3"/><path d="M0 0Q-2 -6 -2 -10" stroke="#C9A06A" stroke-width="2.6" fill="none"/>`
      )
  },
  {
    id: "sert_fazenda",
    p: "sertanejo",
    slot: "bg",
    name: "Pôr do sol na fazenda",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#F7C873" opacity=".55"/><circle cx="92" cy="52" r="16" fill="#FF8A3D" opacity=".8"/><path d="M0 92Q30 80 60 88T120 84V148H0Z" fill="#7A9A4A" opacity=".55"/><path d="M8 72h18v18H8z" fill="#B3122E" opacity=".7"/><path d="M5 73L17 62L29 73Z" fill="#5C3A1E" opacity=".75"/><path d="M98 96v20M110 96v20M94 102h20" stroke="#8B5A2B" stroke-width="2.4" opacity=".7"/>`
  },
  {
    id: "sert_cavalo",
    p: "sertanejo",
    slot: "pet",
    name: "Potrinho",
    price: 160,
    svg: () =>
      `<g transform="translate(14 126)"><path d="M-8 -2Q-9 -10 -2 -10H8Q14 -10 13 -2Z" fill="#9C6A35" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 -2V8M-2 -2V8M6 -2V8M10 -2V8" stroke="#6B4423" stroke-width="2.4" stroke-linecap="round"/><path d="M10 -9Q14 -18 18 -18Q22 -16 20 -12L14 -7Z" fill="#9C6A35" stroke="var(--ink)" stroke-width="1.1"/><circle cx="18.2" cy="-15" r=".9" fill="#141416"/><path d="M12 -16Q8 -16 8 -10" stroke="#2B1D12" stroke-width="2" fill="none"/><path d="M-8 -6Q-14 -2 -12 4" stroke="#2B1D12" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M15 -19l1-3 2 3" fill="#9C6A35" stroke="var(--ink)" stroke-width=".8"/></g>`
  }
);
