/*
  Mundo Otaku, extras:
  - Episódio do dia: o seu dia vira um episódio de anime, com número e título montado com as tarefas.
  - Poder liberado: com 5 tarefas feitas no dia, o Prumi ganha uma aura até a meia-noite.
  - Figurinhas: com 3 tarefas feitas, abre um pacotinho por dia (9 figurinhas pra completar o álbum, +5 gotas cada nova).
  - Brilho "kira" ao concluir tarefa e cigarras de verão no foco. Pétalas de sakura na troca de aba.
*/
"use strict";

const FIGURINHAS = [
  { id: "neko", nome: "Neko sensei", cor: "#FFB74D" },
  { id: "onigiri", nome: "Onigiri feliz", cor: "#E0E0E0" },
  { id: "sakura", nome: "Sakura eterna", cor: "#F48FB1" },
  { id: "lua", nome: "Lua de verão", cor: "#9575CD" },
  { id: "raio", nome: "Golpe relâmpago", cor: "#FFEB3B" },
  { id: "dango", nome: "Trio de dango", cor: "#A5D6A7" },
  { id: "kitsune", nome: "Raposa da sorte", cor: "#FF8A65" },
  { id: "estrela", nome: "Estrela cadente", cor: "#81D4FA" },
  { id: "lamen", nome: "Lámen da madrugada", cor: "#FFCC80" }
];

const auraLigada = () => feitasHoje() >= 5;

function episodioDoDia() {
  const d = dadosMundo("otaku");
  if (!d.primeiroDia) d.primeiroDia = today();
  const n = diffDays(d.primeiroDia, today()) + 1;
  const feitas = S.tasks.filter(t => t.done && (t.feitaEm || t.date) === today());
  const nome = S.name || "nosso herói";
  const titulos = feitas.length
    ? [
        `O dia em que ${nome} venceu "${feitas[0].title}"`,
        `"${feitas[0].title}"! O despertar de um novo poder`,
        `${feitas.length} desafios e um só destino`,
        `A promessa do entardecer: "${feitas[feitas.length - 1].title}"`
      ]
    : [`O começo de uma nova jornada`, `A calmaria antes da batalha`, `${nome} e o mistério da lista vazia`];
  const titulo = titulos[n % titulos.length];
  return { n, titulo: titulo.length > 70 ? titulo.slice(0, 69) + "…" : titulo };
}

function figurinhaSVG(f, tem) {
  const simbolos = {
    neko: `<path d="M12 24q0-10 8-10t8 10z" fill="#fff"/><path d="M13 16l1-6l4 4M27 16l-1-6l-4 4" fill="#fff"/><circle cx="17" cy="20" r="1.2" fill="#333"/><circle cx="23" cy="20" r="1.2" fill="#333"/>`,
    onigiri: `<path d="M20 10L30 28H10Z" fill="#fff" stroke="#333" stroke-width="1"/><rect x="15" y="22" width="10" height="6" fill="#263238"/>`,
    sakura:
      [0, 72, 144, 216, 288]
        .map(a => `<ellipse cx="20" cy="13" rx="4" ry="6" fill="#fff" transform="rotate(${a} 20 20)"/>`)
        .join("") + `<circle cx="20" cy="20" r="2.4" fill="#F06292"/>`,
    lua: `<circle cx="20" cy="20" r="9" fill="#FFF59D"/><circle cx="24" cy="17" r="8" fill="#9575CD"/>`,
    raio: `<path d="M22 8L12 22H19L17 32L28 17H21Z" fill="#fff" stroke="#333" stroke-width=".8"/>`,
    dango: `<path d="M20 6V34" stroke="#8D6E63" stroke-width="1.6"/><circle cx="20" cy="12" r="4.6" fill="#F48FB1"/><circle cx="20" cy="20" r="4.6" fill="#fff"/><circle cx="20" cy="28" r="4.6" fill="#81C784"/>`,
    kitsune: `<path d="M10 14l4-6l3 6h6l3-6l4 6q2 10-10 16q-12-6-10-16z" fill="#fff"/><circle cx="16" cy="18" r="1.2" fill="#333"/><circle cx="24" cy="18" r="1.2" fill="#333"/>`,
    estrela: `<path d="M24 10l2 6l6 1l-5 4l2 6l-5-3l-5 3l2-6l-5-4l6-1z" fill="#fff"/><path d="M8 30l10-8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
    lamen: `<path d="M8 20h24q-2 10-12 10t-12-10z" fill="#fff"/><path d="M12 18q4-6 8 0t8 0" stroke="#FBC02D" stroke-width="1.6" fill="none"/><path d="M26 8l-6 12M30 10l-8 10" stroke="#5D4037" stroke-width="1.2"/>`
  };
  return `<svg viewBox="0 0 40 40" class="figurinha ${tem ? "tem" : ""}"><rect x="2" y="2" width="36" height="36" rx="6" fill="${tem ? f.cor : "#CFD8DC"}" stroke="${tem ? "#fff" : "#B0BEC5"}" stroke-width="2"/>${tem ? simbolos[f.id] : `<text x="20" y="26" text-anchor="middle" font-size="14" fill="#90A4AE" font-weight="700">?</text>`}</svg>`;
}

MUNDO_FX.otaku = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "cair",
      n: 16,
      tam: [12, 22],
      dur: [1.8, 2.8],
      cores: ["#F8BBD0", "#F48FB1", "#FCE4EC"],
      formas: [
        `<path d="M12 3Q18 8 14 15Q12 19 12 21Q12 19 10 15Q6 8 12 3Z" fill="currentColor"/><path d="M12 3l-1 3l2 0z" fill="#fff" opacity=".7"/>`
      ]
    }),
  confete: {
    cores: ["#F8BBD0", "#F48FB1", "#CE93D8", "#81D4FA", "#FFF59D"],
    formas: ["petala", "petala", "estrela", "coracao"]
  },
  musicas: {
    party: "Abertura (versão completa)",
    happy: "Tema do protagonista",
    idle: "Lofi de estudo",
    upset: "Tema do rival",
    sad: "Encerramento triste",
    cry: "Flashback do passado"
  },
  subnicks: [
    "protagonista da própria história",
    "~ episódio novo toda noite ~",
    "nunca desista dos seus sonhos",
    "onigiri e foco",
    "arco de treinamento ativo"
  ],
  humorNomes: {
    Radiante: "Modo kira kira",
    Feliz: "Sugoi",
    "De boa": "Na paz do dojo",
    Chateado: "Gota de suor",
    Triste: "Chuva de anime",
    Arrasado: "Fim de temporada"
  },
  humorExtra(soma) {
    if (auraLigada()) soma(5, "poder liberado");
  },
  aoConcluir() {
    const n = feitasHoje() + 1;
    if (n === 5)
      setTimeout(
        () =>
          notificar({
            titulo: "Poder liberado!",
            texto: "Cinco tarefas! O Prumi ganhou uma aura até a meia-noite.",
            mood: "party",
            tipo: "conquista"
          }),
        1400
      );
    if (n === 3 && dadosMundo("otaku").pacote !== today())
      setTimeout(
        () =>
          notificar({
            titulo: "Pacotinho liberado",
            texto: "Abre a figurinha de hoje no Hoje.",
            mood: "happy",
            aba: "hoje"
          }),
        1600
      );
  },
  legendasFotolog: [
    "eu no meu arco de treinamento",
    "{n} desafios vencidos hoje",
    "{ml} de água de sakura",
    "cena de abertura com pétalas",
    "{nome}, episódio de hoje"
  ],
  textos: {
    diario: "Prévia do próximo episódio",
    diarioDica: "No próximo episódio... o que aconteceu hoje e o que vem amanhã?",
    foco: "Arco de treinamento",
    tarefas: "Missões do episódio",
    adicionar: "Aceitar missão",
    vazioHoje: "Episódio sem missões. Todo protagonista começa com uma.",
    atrasadas: "Missões do arco passado",
    fecharDia: "Encerrar o episódio",
    diaFechado: "Episódio encerrado. Continua...",
    reabrir: "Cena pós-créditos",
    diaPerfeito: "Episódio lendário",
    adicionarHabito: "Pôr no treino diário",
    vazioHabitos: "Nenhum treino ainda. Todo herói treina todo dia.",
    conviteTitulo: "Toda jornada precisa de um companheiro.",
    conviteBotao: "Formar o time",
    pedidoChegou: "quer entrar no seu time. Aceita?",
    conviteTexto: "Entra no meu time no Prumo!",
    sonsTitulo: "Sons do verão",
    somFoco: "Cigarras",
    somFocoNome: "Tarde de verão",
    somFocoDica: "Cigarras de verão enquanto o cronômetro roda.",
    somTarefa: "Brilho",
    somTarefaNome: "Brilho kira",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 9l5 3l-5 3z" fill="currentColor"/></svg><small>Ep. ${episodioDoDia().n}${auraLigada() ? " · aura ativa" : ""}</small></span>`,
  secaoHoje() {
    const ep = episodioDoDia();
    const d = dadosMundo("otaku");
    if (!Array.isArray(d.album)) d.album = [];
    const pacote = feitasHoje() >= 3 && d.pacote !== today();
    return cartaoMundo(
      "cm-episodio",
      `Episódio ${ep.n}`,
      esc(ep.titulo),
      `<div class="album">${FIGURINHAS.map(f => `<figure title="${d.album.includes(f.id) ? f.nome : "Figurinha secreta"}">${figurinhaSVG(f, d.album.includes(f.id))}</figure>`).join("")}</div><span class="note">${d.album.length}/9 no álbum. ${pacote ? "Pacotinho de hoje liberado!" : d.pacote === today() ? "Pacotinho de hoje aberto." : `Faça 3 tarefas pra abrir o pacotinho (${Math.min(3, feitasHoje())}/3).`}${auraLigada() ? " Aura ativa!" : ` Aura com 5 tarefas (${Math.min(5, feitasHoje())}/5).`}</span>${pacote ? `<div class="cm-botoes"><button class="btn small primary" data-act="otaku-pacote">Abrir pacotinho</button></div>` : ""}`
    );
  }
};

ACOES_EXTRAS["otaku-pacote"] = () => {
  const d = dadosMundo("otaku");
  if (!Array.isArray(d.album)) d.album = [];
  if (feitasHoje() < 3 || d.pacote === today()) return;
  d.pacote = today();
  const f = FIGURINHAS[Math.floor(Math.random() * FIGURINHAS.length)];
  const nova = !d.album.includes(f.id);
  if (nova) {
    d.album.push(f.id);
    premioMundo(5, `Figurinha nova: <b>${f.nome}</b>! +5 gotas.`);
    if (d.album.length === FIGURINHAS.length)
      setTimeout(() => premioMundo(30, "Álbum completo! <b>+30 gotas</b>. Sugoi!"), 2500);
  } else react("happy", `Repetida: <b>${f.nome}</b>. Amanhã tem mais!`, 3000);
  MUNDO_FX.otaku.trocaAba();
  commit();
};

/* aura no Prumi quando o poder está liberado */
document.addEventListener("DOMContentLoaded", () => {
  const atualizarAura = () =>
    document.documentElement.classList.toggle("aura-otaku", S.persona === "otaku" && auraLigada());
  const renderAntes = render;
  render = function () {
    renderAntes();
    atualizarAura();
  };
  atualizarAura();
});

SONS_MUNDO.otaku = {
  concluir(ctx, saida, t) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(2640, t + 0.18);
    const g = envelope(ctx, t, 0.01, 0.3, 0.12);
    o.connect(g).connect(saida);
    o.start(t);
    o.stop(t + 0.35);
    [2093, 2637, 3136].forEach((f, i) => sino(ctx, saida, t + 0.16 + i * 0.07, f, 0.8, 0.06, [1, 2.4]));
  },
  ambiente(ctx) {
    // cigarras: chiado agudo que pulsa e cresce em ondas
    const base = ambienteRuido(ctx, { freq: 4800, tipo: "bandpass", vol: 0.05, onda: 0.18, q: 3 });
    const pulso = ctx.createOscillator();
    pulso.frequency.value = 38;
    const pg = ctx.createGain();
    pg.gain.value = 0.4;
    pulso.connect(pg).connect(base.saida.gain);
    pulso.start();
    return {
      parar() {
        base.parar();
        pulso.stop(ctx.currentTime + 1.1);
      }
    };
  }
};

ITEMS.push(
  {
    id: "otaku_laco",
    p: "otaku",
    slot: "hat",
    name: "Laço gigante",
    price: 120,
    svg: () =>
      `<path d="M60 22Q40 2 30 14Q26 28 60 26Z M60 22Q80 2 90 14Q94 28 60 26Z" fill="#E91E63" ${O}/><circle cx="60" cy="24" r="6" fill="#C2185B" ${O}/><path d="M56 28l-8 16M64 28l8 16" stroke="#E91E63" stroke-width="5" stroke-linecap="round"/>`
  },
  {
    id: "otaku_gota",
    p: "otaku",
    slot: "face",
    name: "Gota de suor de anime",
    price: 60,
    svg: () =>
      `<path d="M86 40Q94 52 90 58Q84 62 80 56Q78 50 86 40Z" fill="#81D4FA" stroke="var(--ink)" stroke-width="1.4"/><path d="M84 50q1 3 3 4" stroke="#fff" stroke-width="1.4" fill="none"/>`
  },
  {
    id: "otaku_kimono",
    p: "otaku",
    slot: "top",
    name: "Kimono de festival",
    price: 170,
    svg: () =>
      topBase("#3949AB") +
      `<path d="M36 86L60 120L84 86" stroke="#F8BBD0" stroke-width="6" fill="none"/><rect x="0" y="122" width="120" height="10" fill="#F48FB1"/>${[
        [20, 102],
        [96, 104],
        [30, 140],
        [88, 142]
      ]
        .map(([x, y]) =>
          [0, 72, 144, 216, 288]
            .map(
              a =>
                `<ellipse cx="${x}" cy="${y - 3}" rx="1.6" ry="2.8" fill="#F8BBD0" transform="rotate(${a} ${x} ${y})"/>`
            )
            .join("")
        )
        .join("")}`
  },
  {
    id: "otaku_bokken",
    p: "otaku",
    slot: "hand",
    name: "Espada de madeira",
    price: 120,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M2 6L26 -34" stroke="#C8A165" stroke-width="5" stroke-linecap="round"/><path d="M2 6L26 -34" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" opacity=".15"/><path d="M-2 0l10 6" stroke="#5D4037" stroke-width="3" stroke-linecap="round"/>`
      )
  },
  {
    id: "otaku_maneki",
    p: "otaku",
    slot: "pet",
    name: "Gatinho da sorte",
    price: 160,
    svg: () =>
      `<g transform="translate(15 128)"><path d="M-9 8Q-10 -6 0 -6Q10 -6 9 8Z" fill="#FFFFFF" stroke="var(--ink)" stroke-width="1.1"/><circle cy="-10" r="7.5" fill="#FFFFFF" stroke="var(--ink)" stroke-width="1.1"/><path d="M-6 -15l-1-6l5 3M6 -15l1-6l-5 3" fill="#FFFFFF" stroke="var(--ink)" stroke-width="1"/><path d="M-3 -10.5q1-1.4 2 0M1 -10.5q1-1.4 2 0" stroke="#141416" stroke-width=".9" fill="none"/><rect x="-6" y="-3.6" width="12" height="2.2" rx="1" fill="#E53935"/><circle cy="-1" r="1.8" fill="#FFC107"/><path d="M8 -4q4-6 2-10" stroke="var(--ink)" stroke-width="1.1" fill="#fff"/><ellipse cx="0" cy="3" rx="3.4" ry="3" fill="#FFC107" stroke="#B7892B" stroke-width=".7"/></g>`
  },
  {
    id: "otaku_ceu",
    p: "otaku",
    slot: "bg",
    name: "Céu de anime",
    price: 170,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#4FC3F7" opacity=".45"/><path d="M6 30q6-10 16-6q6-8 16 0q10 0 8 8H6z" fill="#fff" opacity=".85"/><path d="M76 60q6-10 16-6q6-8 16 0q10 0 8 8H76z" fill="#fff" opacity=".8"/><path d="M0 120Q60 104 120 120V148H0Z" fill="#81C784" opacity=".5"/>`
  }
);
