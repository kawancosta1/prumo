/*
  Mundo Feiticeiro, extras:
  - Constelação do dia: cada tarefa concluída acende uma estrela (7 por constelação). Completa = +15 gotas
    e ela vai pro seu mapa do céu (o nome muda a cada uma).
  - Grimório: conta quantos "feitiços" (tarefas) você já lançou neste mundo e te dá um título de mago.
  - Feitiço do dia: uma sugestão pequena pra fazer em 5 minutos.
  - Troca de aba: um círculo mágico gira no meio da tela. Concluir tarefa: sino de cristal.
*/
"use strict";

const CONSTELACOES = [
  "Coruja do Foco",
  "Dragão Paciente",
  "Cajado de Prata",
  "Grimório Aberto",
  "Lua do Aprendiz",
  "Fênix da Manhã",
  "Torre Alta",
  "Gato do Arquimago",
  "Chave das Estrelas"
];
// posições das 7 estrelas (desenho muda com a constelação)
const FORMAS_CONSTELACAO = [
  [
    [12, 40],
    [26, 22],
    [44, 28],
    [58, 12],
    [74, 26],
    [88, 18],
    [100, 36]
  ],
  [
    [14, 18],
    [30, 34],
    [46, 20],
    [60, 36],
    [76, 22],
    [90, 38],
    [104, 20]
  ],
  [
    [20, 40],
    [30, 18],
    [52, 12],
    [64, 30],
    [84, 14],
    [96, 32],
    [80, 42]
  ]
];
const TITULOS_MAGO = [
  [0, "Aprendiz de vassoura"],
  [10, "Leitor de pergaminhos"],
  [30, "Mago iniciado"],
  [60, "Feiticeiro da torre"],
  [120, "Mestre das runas"],
  [250, "Arquimago"],
  [500, "Lenda das estrelas"]
];
const FEITICOS_DO_DIA = [
  ["Arrumatum", "Arruma a mesa em 5 minutos."],
  ["Hidratus", "Enche a garrafa d'água agora."],
  ["Respiratio", "Três respirações bem fundas."],
  ["Mensagem voadora", "Manda uma mensagem pra alguém que você gosta."],
  ["Esticamentum", "Levanta e alonga por 2 minutos."],
  ["Lixeirus", "Esvazia o lixo do quarto."],
  ["Lumen", "Abre a janela e deixa a luz entrar."],
  ["Lista mágica", "Escreve as 3 coisas mais importantes de amanhã."],
  ["Silencium", "10 minutos sem celular."]
];

function dadosFeit() {
  const d = dadosMundo("feiticeiro");
  if (!d.ceu || typeof d.ceu !== "object") d.ceu = { atual: 0, acesas: 0, mapa: [] };
  if (!Array.isArray(d.ceu.mapa)) d.ceu.mapa = [];
  if (typeof d.feiticos !== "number") d.feiticos = 0;
  return d;
}
const tituloMago = n => TITULOS_MAGO.filter(([min]) => n >= min).pop()[1];
const feiticoDoDia = () =>
  FEITICOS_DO_DIA[
    ((diffDays("2026-01-01", today()) % FEITICOS_DO_DIA.length) + FEITICOS_DO_DIA.length) %
      FEITICOS_DO_DIA.length
  ];

function constelacaoSVG(idx, acesas) {
  const pts = FORMAS_CONSTELACAO[idx % FORMAS_CONSTELACAO.length];
  const linhas = pts
    .slice(1)
    .map(
      ([x, y], i) =>
        `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${x}" y2="${y}" stroke="${i + 1 < acesas ? "#E8C55A" : "currentColor"}" stroke-opacity="${i + 1 < acesas ? 0.9 : 0.15}" stroke-width="1.2" stroke-dasharray="${i + 1 < acesas ? "0" : "2 3"}"/>`
    )
    .join("");
  const estrelas = pts
    .map(([x, y], i) =>
      i < acesas
        ? `<g class="estrela-acesa" style="animation-delay:${i * 0.2}s">${estrelaFeit(x, y, 4.4, "#FFE082")}</g>`
        : `<circle cx="${x}" cy="${y}" r="1.8" fill="currentColor" opacity=".3"/>`
    )
    .join("");
  return `<svg viewBox="0 0 116 52" class="constelacao" aria-hidden="true">${linhas}${estrelas}</svg>`;
}

/* círculo mágico na troca de aba */
function circuloMagico() {
  if (RM) return;
  const velho = document.getElementById("circulo-magico");
  if (velho) velho.remove();
  const el = document.createElement("div");
  el.id = "circulo-magico";
  el.setAttribute("aria-hidden", "true");
  const runas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2,
      x = 100 + Math.cos(a) * 78,
      y = 100 + Math.sin(a) * 78;
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${"ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ"[i]}</text>`;
  }).join("");
  el.innerHTML = `<svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="92" stroke-width="2"/><circle cx="100" cy="100" r="64" stroke-width="1.2"/><circle cx="100" cy="100" r="40" stroke-width="1"/><path d="M100 36L155 132H45Z M100 164L45 68H155Z" stroke-width="1.2"/></g><g class="cm-runas">${runas}</g></svg>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

MUNDO_FX.feiticeiro = {
  trocaAba() {
    circuloMagico();
    chuvaMundo({
      movimento: "brilhar",
      n: 12,
      tam: [10, 18],
      dur: [0.9, 1.5],
      cores: ["#FFE082", "#90CAF9", "#E1BEE7"],
      formas: [`<path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="currentColor"/>`]
    });
  },
  confete: {
    cores: ["#FFE082", "#E8C55A", "#90CAF9", "#7986CB", "#E1BEE7"],
    formas: ["estrela", "estrela", "estrela", "coracao"]
  },
  musicas: {
    party: "Hino da academia de magia",
    happy: "Valsa das constelações",
    idle: "Chuva na janela da torre",
    upset: "Tempestade arcana",
    sad: "Balada do mago solitário",
    cry: "Réquiem das velas"
  },
  subnicks: [
    "estudando o grimório desde 1347",
    "✦ magia é só ciência que ninguém entendeu ✦",
    "não toque no meu cajado",
    "chá de lavanda e feitiços",
    "aprendiz eterno das estrelas"
  ],
  humorNomes: {
    Radiante: "Mana transbordando",
    Feliz: "Feitiço certeiro",
    "De boa": "Lendo na torre",
    Chateado: "Feitiço que falhou",
    Triste: "Vela apagada",
    Arrasado: "Grimório molhado"
  },
  humorExtra(soma) {
    const d = dadosFeit();
    if (d.ceu.acesas >= 4) soma(4, "constelação brilhando");
  },
  aoConcluir() {
    const d = dadosFeit();
    d.feiticos++;
    d.ceu.acesas++;
    if (d.ceu.acesas >= 7) {
      const nome = CONSTELACOES[d.ceu.atual % CONSTELACOES.length];
      d.ceu.mapa.push({ nome, em: today() });
      d.ceu.mapa = d.ceu.mapa.slice(-30);
      d.ceu.atual++;
      d.ceu.acesas = 0;
      setTimeout(() => {
        premioMundo(15, `Constelação completa: <b>${esc(nome)}</b>! +15 gotas.`);
        notificar({
          titulo: "Constelação completa!",
          texto: `${nome} foi pro seu mapa do céu.`,
          tipo: "conquista",
          mood: "party",
          aba: "hoje"
        });
      }, 1200);
    }
    const t = tituloMago(d.feiticos);
    if (t !== tituloMago(d.feiticos - 1))
      setTimeout(
        () =>
          notificar({
            titulo: "Novo título!",
            texto: `Agora você é ${t}.`,
            tipo: "conquista",
            mood: "party"
          }),
        2200
      );
  },
  legendasFotolog: [
    "{nome}, aprendiz das estrelas",
    "{n} feitiços lançados hoje",
    "{ml} de poção de clareza",
    "vista da torre ✦",
    "grimório aberto e chá quente"
  ],
  textos: {
    diario: "Anotações do grimório",
    diarioDica: "Que magia você aprendeu hoje? O que fica pra estudar amanhã?",
    foco: "Estudo na torre",
    tarefas: "Feitiços do dia",
    adicionar: "Escrever feitiço",
    vazioHoje: "Nenhum feitiço no pergaminho. Que tal escrever o primeiro?",
    atrasadas: "Feitiços esquecidos",
    trazerTudo: "Trazer pro pergaminho de hoje",
    fecharDia: "Fechar o grimório",
    diaFechado: "Grimório fechado. As estrelas guardam o seu dia.",
    reabrir: "Abrir de novo",
    diaPerfeito: "Dia de arquimago",
    adicionarHabito: "Virar ritual diário",
    vazioHabitos: "Nenhum ritual ainda. Todo mago tem os seus.",
    sequencia: ["noite de ritual", "noites de ritual"],
    conviteTitulo: "Toda torre fica melhor com outro mago.",
    conviteBotao: "Chamar pra academia",
    pedidoChegou: "quer estudar magia com você. Aceita?",
    conviteTexto: "Vem estudar magia comigo no Prumo!",
    sonsTitulo: "Sons da torre",
    somFoco: "Vela e chuva",
    somFocoNome: "Torre na chuva",
    somFocoDica: "Chuva fina e páginas virando enquanto o cronômetro roda.",
    somTarefa: "Sino de cristal",
    somTarefaNome: "Sino de cristal",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const d = dadosFeit();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24">${estrelaFeit(12, 12, 9, "currentColor")}</svg><small>${d.ceu.acesas}/7 estrelas · ${esc(tituloMago(d.feiticos))}</small></span>`;
  },
  secaoHoje() {
    const d = dadosFeit();
    const nome = CONSTELACOES[d.ceu.atual % CONSTELACOES.length];
    const [fn, fd] = feiticoDoDia();
    const feitoHoje = d.feiticoFeito === today();
    return cartaoMundo(
      "cm-ceu",
      "Constelação do dia",
      `${esc(nome)} · ${d.ceu.acesas}/7 estrelas`,
      `${constelacaoSVG(d.ceu.atual, d.ceu.acesas)}
      <span class="note">Cada tarefa feita acende uma estrela. ${d.ceu.mapa.length ? `Seu mapa do céu já tem ${d.ceu.mapa.length} ${d.ceu.mapa.length === 1 ? "constelação" : "constelações"}.` : "Complete a primeira pra começar seu mapa do céu."} Título: <b>${esc(tituloMago(d.feiticos))}</b> (${d.feiticos} feitiços).</span>
      <div class="feitico-dia"><b>Feitiço do dia: ${esc(fn)}</b><span class="note">${esc(fd)}</span>${feitoHoje ? `<span class="tag on">Lançado!</span>` : `<button class="btn small" data-act="feit-feitico">Lancei! (+3)</button>`}</div>`
    );
  }
};

ACOES_EXTRAS["feit-feitico"] = b => {
  const d = dadosFeit();
  if (d.feiticoFeito === today()) return;
  d.feiticoFeito = today();
  earn(3, b);
  circuloMagico();
  react("party", `Feitiço <b>${esc(feiticoDoDia()[0])}</b> lançado! +3 gotas.`, 3000);
  commit();
};

SONS_MUNDO.feiticeiro = {
  concluir(ctx, saida, t) {
    // sino de cristal subindo + brilho
    [1318.5, 1760, 2349.3].forEach((f, i) => sino(ctx, saida, t + i * 0.08, f, 1.4, 0.07, [1, 2.76, 5.4]));
    tocarTom(ctx, saida, t + 0.25, 3136, 0.5, "sine", 0.03, 0.01);
  },
  ambiente(ctx) {
    // chuva fina na janela da torre e uma página virando de vez em quando
    return ambienteComposto(ctx, { freq: 1400, tipo: "lowpass", vol: 0.05, onda: 0.08 }, [
      [(c, s, t) => rajada(c, s, t, 0.18, 2200, "bandpass", 0.18, 1.4), 6000, 14000],
      [(c, s, t) => sino(c, s, t, 1760 + Math.random() * 600, 2, 0.02, [1, 2.76]), 9000, 20000]
    ]);
  }
};
