/*
  Mundo Zen, extras:
  - Jardim de areia: cada tarefa feita e cada sessão de foco risca uma onda nova na areia (o jardim recomeça todo dia).
  - Respirar 1 minuto: círculo que cresce e diminui (4 s inspira, 4 s segura, 6 s solta), com tigela no começo e no fim.
    A primeira respiração do dia dá +3 gotas.
  - Pensamento do dia, tigela tibetana ao concluir tarefa e ondas do mar com sino no foco. Folhas na troca de aba.
*/
"use strict";

const PENSAMENTOS = [
  "Uma coisa de cada vez já é muita coisa.",
  "O rio não tem pressa e mesmo assim chega ao mar.",
  "Respire antes de responder.",
  "Feito com calma é feito duas vezes.",
  "Descansar também faz parte do caminho.",
  "Você não precisa dar conta de tudo hoje.",
  "Água parada clareia sozinha.",
  "O bambu se dobra e não quebra.",
  "Pequenos passos, todos os dias.",
  "Silêncio também é resposta."
];
const pensamentoDoDia = () =>
  PENSAMENTOS[Math.floor(new Date(today() + "T12:00:00").getTime() / 864e5) % PENSAMENTOS.length];

function jardimSVG(n) {
  const linhas = [];
  for (let i = 0; i < Math.min(n, 10); i++) {
    const y = 18 + i * 9;
    linhas.push(
      `<path class="risco" style="animation-delay:${i * 0.08}s" d="M8 ${y}Q60 ${y - 5} 110 ${y}T210 ${y}T312 ${y}" stroke="#C8B48A" stroke-width="1.6" fill="none" opacity=".9"/>`
    );
  }
  const pedras = [
    [96, 60, 16, 11],
    [226, 44, 12, 9],
    [250, 86, 9, 7]
  ]
    .map(
      ([x, y, rx, ry]) =>
        `<ellipse cx="${x}" cy="${y + 2}" rx="${rx + 9}" ry="${ry + 6}" fill="none" stroke="#C8B48A" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#6D6A65"/><ellipse cx="${x - rx / 3}" cy="${y - ry / 3}" rx="${rx / 3}" ry="${ry / 4}" fill="#8C8983"/>`
    )
    .join("");
  return `<svg class="cm-cena jardim" viewBox="0 0 320 110" role="img" aria-label="Jardim de areia com ${n} riscos"><rect width="320" height="110" rx="10" fill="#EDE3CC"/>${linhas.join("")}${pedras}<path d="M290 104q4-18 16-22q-6 10-4 22z" fill="#7CB342"/></svg>`;
}
function riscosHoje() {
  const focos = S.sessions.filter(s => s.date === today()).length;
  return feitasHoje() + focos;
}

MUNDO_FX.zen = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "cair",
      n: 8,
      tam: [14, 22],
      dur: [2.6, 3.6],
      cores: ["#8BC34A", "#AED581", "#C5E1A5"],
      formas: [
        `<path d="M12 2Q20 8 16 16Q14 20 12 22Q10 20 8 16Q4 8 12 2Z" fill="currentColor"/><path d="M12 4V21" stroke="#558B2F" stroke-width=".8"/>`
      ]
    }),
  confete: { cores: ["#AED581", "#F8BBD0", "#FFF59D", "#B39DDB"], formas: ["folha", "petala", "redondo"] },
  musicas: {
    party: "Sinos do templo",
    happy: "Manhã no jardim",
    idle: "Chá e silêncio",
    upset: "Vento forte no bambu",
    sad: "Chuva no lago",
    cry: "Neblina na montanha"
  },
  subnicks: [
    "respira",
    "~ um passo de cada vez ~",
    "chá quente e mente leve",
    "aqui e agora",
    "menos pressa, mais presença"
  ],
  humorNomes: {
    Radiante: "Iluminado",
    Feliz: "Em paz",
    "De boa": "Sereno",
    Chateado: "Agitado",
    Triste: "Nublado",
    Arrasado: "Tempestade"
  },
  humorExtra(soma) {
    if (dadosMundo("zen").respirou === today()) soma(4, "respirou com calma");
  },
  legendasFotolog: [
    "eu e o silêncio",
    "{n} passos com calma hoje",
    "{ml} de água em paz",
    "chá, bambu e respiração",
    "{nome} no jardim"
  ],
  textos: {
    diario: "Reflexão do dia",
    diarioDica: "O que te trouxe paz hoje? O que você pode soltar?",
    foco: "Meditação ativa",
    tarefas: "Intenções de hoje",
    adicionar: "Pôr intenção",
    vazioHoje: "Nenhuma intenção ainda. Uma só já basta.",
    atrasadas: "Ficou para outro momento",
    fecharDia: "Encerrar com gratidão",
    diaFechado: "Dia encerrado. Gratidão.",
    reabrir: "Voltar ao dia",
    diaPerfeito: "Dia em harmonia",
    adicionarHabito: "Pôr no ritual",
    vazioHabitos: "Nenhum ritual ainda. Comece pequeno: um copo d'água ao acordar.",
    conviteTitulo: "Caminhar junto deixa o caminho mais leve.",
    conviteBotao: "Caminhar junto",
    pedidoChegou: "quer caminhar junto com você. Aceita?",
    conviteTexto: "Vem caminhar comigo no Prumo.",
    sonsTitulo: "Sons da natureza",
    somFoco: "Mar",
    somFocoNome: "Mar e sino",
    somFocoDica: "Ondas do mar e um sino de vez em quando enquanto o cronômetro roda.",
    somTarefa: "Tigela",
    somTarefaNome: "Tigela tibetana",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><path d="M3 15q9-6 18 0" stroke="#C8B48A" stroke-width="1.4" fill="none"/><path d="M3 19q9-6 18 0" stroke="#C8B48A" stroke-width="1.4" fill="none"/><ellipse cx="15" cy="13" rx="3" ry="2" fill="#8C8983"/></svg><small>${esc(pensamentoDoDia())}</small></span>`,
  secaoHoje() {
    const n = riscosHoje();
    const d = dadosMundo("zen");
    return cartaoMundo(
      "cm-jardim",
      "Jardim de areia",
      "Cada tarefa feita e cada foco risca uma onda na areia.",
      `${jardimSVG(n)}<div class="cm-botoes"><button class="btn small primary" data-act="zen-respirar">Respirar 1 minuto${d.respirou === today() ? "" : " (+3 gotas)"}</button></div>`
    );
  }
};

function tigela(ctx, saida, t, vol = 0.18) {
  sino(ctx, saida, t, 196, 4.5, vol, [1, 2.71, 5.15]);
}

ACOES_EXTRAS["zen-respirar"] = () => {
  if (document.getElementById("respirar")) return;
  const ctx = pegarAudio();
  const s = ctx ? saidaMundo(ctx, 0.9) : null;
  if (ctx) tigela(ctx, s, ctx.currentTime + 0.05);
  const caixa = document.createElement("div");
  caixa.id = "respirar";
  caixa.setAttribute("role", "dialog");
  caixa.setAttribute("aria-label", "Respiração guiada");
  caixa.innerHTML = `<div class="resp-circulo"></div><b class="resp-texto">Inspira</b><span class="resp-tempo">60</span><button class="btn small ghost" type="button">Parar</button>`;
  document.body.appendChild(caixa);
  const texto = caixa.querySelector(".resp-texto"),
    tempo = caixa.querySelector(".resp-tempo"),
    circulo = caixa.querySelector(".resp-circulo");
  const fases = [
    ["Inspira", 4, "cresce"],
    ["Segura", 4, "cheio"],
    ["Solta devagar", 6, "diminui"]
  ];
  let restante = 60,
    fase = 0,
    naFase = 0;
  const mostrar = () => {
    const [nome, , classe] = fases[fase];
    texto.textContent = nome;
    circulo.className = "resp-circulo " + classe;
  };
  mostrar();
  const relogio = setInterval(() => {
    restante--;
    naFase++;
    tempo.textContent = restante;
    if (naFase >= fases[fase][1]) {
      fase = (fase + 1) % fases.length;
      naFase = 0;
      mostrar();
    }
    if (restante <= 0) terminar(true);
  }, 1000);
  function terminar(completo) {
    clearInterval(relogio);
    caixa.remove();
    if (!completo) return;
    if (ctx) tigela(ctx, s, ctx.currentTime + 0.05, 0.22);
    const d = dadosMundo("zen");
    if (d.respirou !== today()) {
      d.respirou = today();
      premioMundo(3, "Um minuto inteiro de calma. <b>+3 gotas</b>.", "happy");
    } else react("happy", "Mais um minuto de calma. Bonito.", 2800);
    commit();
  }
  caixa.querySelector("button").addEventListener("click", () => terminar(false));
};

SONS_MUNDO.zen = {
  concluir: (ctx, saida, t) => tigela(ctx, saida, t, 0.16),
  ambiente: ctx =>
    ambienteComposto(ctx, { freq: 700, tipo: "lowpass", vol: 0.12, onda: 0.09 }, [
      [(c, s, t) => sino(c, s, t, 523, 3, 0.03, [1, 2.4]), 14000, 26000]
    ])
};

ITEMS.push(
  {
    id: "zen_chapeu_bambu",
    p: "zen",
    slot: "hat",
    name: "Chapéu de bambu",
    price: 130,
    svg: () =>
      `<path d="M8 42L60 10L112 42Q60 48 8 42Z" fill="#D7B56D" ${O}/>${[24, 40, 52, 68, 80, 96].map(x => `<path d="M60 12L${x} 44" stroke="#B08A3E" stroke-width="1"/>`).join("")}<circle cx="60" cy="10" r="3" fill="#8D6E3E"/>`
  },
  {
    id: "zen_olhos_serenos",
    p: "zen",
    slot: "face",
    name: "Olhinhos serenos",
    price: 70,
    svg: () =>
      `<path d="M40 64q7 5 14 0M66 64q7 5 14 0" stroke="var(--ink)" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "zen_roupao",
    p: "zen",
    slot: "top",
    name: "Roupão de spa",
    price: 140,
    svg: () =>
      topBase("#F5F1E8") +
      `<path d="M36 86L62 124" stroke="#D7CCB8" stroke-width="7"/><path d="M84 86L58 124" stroke="#E8E1D2" stroke-width="7"/><rect x="0" y="120" width="120" height="6" fill="#A5D6A7"/><path d="M60 122q-10 10-14 22M60 122q10 10 14 22" stroke="#A5D6A7" stroke-width="3" fill="none"/>`
  },
  {
    id: "zen_rastelo",
    p: "zen",
    slot: "hand",
    name: "Rastelo de jardim",
    price: 100,
    svg: (x, y) =>
      H(
        x,
        y,
        `<path d="M0 6L18 -30" stroke="#A1887F" stroke-width="3" stroke-linecap="round"/><path d="M10 -34L28 -26" stroke="#8D6E63" stroke-width="3" stroke-linecap="round"/>${[0, 1, 2, 3].map(i => `<path d="M${12 + i * 5} ${-33 + i * 2.2}l-3 6" stroke="#8D6E63" stroke-width="1.6"/>`).join("")}`
      )
  },
  {
    id: "zen_tartaruga",
    p: "zen",
    slot: "pet",
    name: "Tartaruguinha",
    price: 130,
    svg: () =>
      `<g transform="translate(15 134)"><ellipse cx="13" cy="-1" rx="4" ry="3" fill="#9CCC65" stroke="var(--ink)" stroke-width="1"/><circle cx="14.6" cy="-1.8" r=".8" fill="#141416"/><path d="M-6 2v4M6 2v4" stroke="#9CCC65" stroke-width="3" stroke-linecap="round"/><path d="M-11 2Q-10 -11 0 -11Q10 -11 11 2Z" fill="#6D8B3A" stroke="var(--ink)" stroke-width="1.1"/><path d="M-5 -8l5 3l5-3M0 -5v6M-8 -2h16" stroke="#4E6B23" stroke-width=".9" fill="none"/></g>`
  },
  {
    id: "zen_lago",
    p: "zen",
    slot: "bg",
    name: "Lago com carpas",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#B2DFDB" opacity=".5"/><ellipse cx="60" cy="126" rx="70" ry="22" fill="#4DB6AC" opacity=".45"/><path d="M18 122q8-6 14 0q-6 4-14 0zM20 122l-6-3v6z" fill="#FF7043" opacity=".85"/><path d="M92 132q-8-6-14 0q6 4 14 0zM90 132l6-3v6z" fill="#FFFFFF" opacity=".85"/><circle cx="96" cy="130" r="1.6" fill="#FF7043"/><ellipse cx="40" cy="116" rx="7" ry="3" fill="#81C784" opacity=".8"/>`
  }
);
