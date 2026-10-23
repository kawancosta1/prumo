/*
  Mundo Funkeiro, extras:
  - Paredão: 8 caixas de som que sobem com as tarefas feitas e a água bebida.
    Paredão no talo (100%) libera "Soltar o grave": tamborzão de verdade, tela tremendo e +10 gotas (1 vez por dia).
  - Tamborzão ao concluir tarefa e baile ao longe no foco.
  - Estrelas neon na troca de aba, falas, humor e roupas novas.
*/
"use strict";

const CORES_NEON = ["#FF2BD6", "#00E5FF", "#C6FF00", "#FFEA00", "#7C4DFF"];

/** Nível do paredão de 0 a 100: cada tarefa 16 pontos e a água até 36. */
const nivelParedao = () =>
  Math.min(100, Math.round(feitasHoje() * 16 + Math.min(1, waterToday() / S.waterGoal) * 36));

function paredaoSVG(nivel) {
  let barras = "";
  for (let i = 0; i < 8; i++) {
    const alturaMax = 70;
    const forma = 0.55 + 0.45 * Math.sin((i / 7) * Math.PI);
    const h = Math.max(4, (alturaMax * forma * nivel) / 100);
    const cor = CORES_NEON[i % CORES_NEON.length];
    barras += `<rect class="eq-barra" style="animation-delay:${(i * 0.13) % 0.8}s;--h:${h.toFixed(0)}px" x="${24 + i * 36}" y="${92 - h}" width="26" height="${h}" rx="3" fill="${cor}"/>`;
  }
  const caixas = [0, 1, 2, 3]
    .map(
      i =>
        `<g transform="translate(${18 + i * 76} 96)"><rect width="66" height="22" rx="3" fill="#1A1A22" stroke="#33333F"/><circle cx="18" cy="11" r="8" fill="#2A2A35" stroke="#555" /><circle cx="48" cy="11" r="8" fill="#2A2A35" stroke="#555"/><circle cx="18" cy="11" r="3" fill="#111"/><circle cx="48" cy="11" r="3" fill="#111"/></g>`
    )
    .join("");
  return `<svg class="cm-cena paredao ${nivel >= 100 ? "no-talo" : ""}" viewBox="0 0 320 120" role="img" aria-label="Paredão em ${nivel}%"><rect width="320" height="120" fill="#0D0B14"/>${[...Array(5)].map((_, i) => `<path d="M${40 + i * 60} 0L${20 + i * 70} 120" stroke="${CORES_NEON[i]}" stroke-width="10" opacity=".08"/>`).join("")}${barras}${caixas}<text x="306" y="16" text-anchor="end" font-size="11" font-weight="700" fill="#C6FF00">${nivel}%</text></svg>`;
}

function tamborzao(ctx, saida, t, compassos = 2) {
  // a batida clássica: bumbo e atabaque no 3+3+2
  const sem = 0.115;
  for (let c = 0; c < compassos; c++) {
    const b = t + c * sem * 16;
    [0, 3, 6, 10, 12].forEach(k => bumbo(ctx, saida, b + k * sem, 0.55, k === 0));
    [4, 12].forEach(k => palma(ctx, saida, b + k * sem, 0.22));
    [2, 7, 9, 14].forEach(k => tocarTom(ctx, saida, b + k * sem, 180, 0.12, "triangle", 0.18, 0.002));
    for (let k = 0; k < 16; k += 2) chimbal(ctx, saida, b + k * sem, 0.05);
  }
}

MUNDO_FX.funkeiro = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "brilhar",
      n: 16,
      tam: [14, 30],
      dur: [0.8, 1.4],
      cores: CORES_NEON,
      formas: [`<path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4Z" fill="currentColor"/>`]
    }),
  confete: { cores: CORES_NEON, formas: ["estrela", "raio", "ret", "diamante"] },
  musicas: {
    party: "Baile de favela (ao vivo)",
    happy: "Batidão de sexta",
    idle: "Passinho no quarto",
    upset: "Caixa de som queimada",
    sad: "Funk melody de saudade",
    cry: "Fim de baile"
  },
  subnicks: [
    "o grave bateu",
    "~ no passinho ~",
    "tá tranquilo, tá favorável",
    "paredão ligado, tarefa riscada",
    "só vitória"
  ],
  humorNomes: {
    Radiante: "No grave",
    Feliz: "No passinho",
    "De boa": "Tranquilo e favorável",
    Chateado: "Sem bateria",
    Triste: "Sem baile",
    Arrasado: "Paredão desligado"
  },
  humorExtra(soma) {
    const d = new Date();
    if ([5, 6].includes(d.getDay()) && d.getHours() >= 20) soma(4, "noite de baile");
    if (nivelParedao() >= 100) soma(3, "paredão no talo");
  },
  aoConcluir() {
    if (nivelParedao() + 16 >= 100 && nivelParedao() < 100)
      setTimeout(
        () =>
          notificar({
            titulo: "Paredão no talo",
            texto: "Chegou em 100%! Solta o grave lá no Hoje.",
            mood: "party",
            aba: "hoje"
          }),
        1500
      );
  },
  legendasFotolog: [
    "eu e o paredão",
    "{n} tarefas no batidão",
    "{ml} de água neon",
    "boné aba reta e corrente",
    "{nome} no baile"
  ],
  textos: {
    diario: "Resumo do baile",
    diarioDica: "Como foi o baile de hoje? O que bateu forte?",
    foco: "Foco no grave",
    tarefas: "Set de hoje",
    adicionar: "Soltar no set",
    vazioHoje: "Set vazio. Liga o paredão e põe a primeira.",
    atrasadas: "Ficou do baile passado",
    fecharDia: "Desligar o paredão",
    diaFechado: "Paredão desligado. Baile histórico!",
    reabrir: "Religar o paredão",
    diaPerfeito: "Baile lotado",
    adicionarHabito: "Pôr no passinho de sempre",
    vazioHabitos: "Nenhum passinho ainda. Todo baile tem seu passo: comece com um.",
    conviteTitulo: "Baile bom é com a tropa.",
    conviteBotao: "Chamar pro baile",
    pedidoChegou: "quer colar no seu baile. Libera?",
    conviteTexto: "Cola no meu baile no Prumo!",
    sonsTitulo: "Sons do baile",
    somFoco: "Baile",
    somFocoNome: "Baile ao longe",
    somFocoDica: "O grave do baile de longe enquanto o cronômetro roda.",
    somTarefa: "Tamborzão",
    somTarefaNome: "Batida de tamborzão",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24">${[0, 1, 2, 3, 4].map(i => `<rect x="${2 + i * 4.2}" y="${20 - (4 + ((i * 7) % 12) * (nivelParedao() / 100))}" width="3" height="${4 + ((i * 7) % 12) * (nivelParedao() / 100)}" rx="1" fill="${CORES_NEON[i]}"/>`).join("")}</svg><small>Paredão ${nivelParedao()}%</small></span>`,
  secaoHoje() {
    const n = nivelParedao();
    const d = dadosMundo("funkeiro");
    const pode = n >= 100 && d.grave !== today();
    return cartaoMundo(
      "cm-paredao",
      "Paredão",
      n >= 100
        ? d.grave === today()
          ? "Grave solto hoje. Baile histórico!"
          : "No talo! Solta o grave."
        : "Tarefas feitas e água bebida sobem o volume.",
      `${paredaoSVG(n)}<div class="cm-botoes">${pode ? `<button class="btn small primary" data-act="funk-grave">Soltar o grave (+10 gotas)</button>` : `<button class="btn small ghost" data-act="funk-batida">Ouvir a batida</button>`}</div>`
    );
  }
};

ACOES_EXTRAS["funk-batida"] = () => {
  const ctx = pegarAudio();
  if (ctx) tamborzao(ctx, saidaMundo(ctx, 0.85), ctx.currentTime + 0.05, 1);
};
ACOES_EXTRAS["funk-grave"] = () => {
  const d = dadosMundo("funkeiro");
  if (nivelParedao() < 100 || d.grave === today()) return;
  d.grave = today();
  const ctx = pegarAudio();
  if (ctx) tamborzao(ctx, saidaMundo(ctx, 0.95), ctx.currentTime + 0.05, 2);
  if (typeof tremerTela === "function") tremerTela();
  if (navigator.vibrate && S.notif.vibrar) navigator.vibrate([60, 40, 60, 40, 120]);
  premioMundo(10, "O GRAVE BATEU! <b>+10 gotas</b>.");
  fx.big = true;
  commit();
};

SONS_MUNDO.funkeiro = {
  concluir(ctx, saida, t) {
    bumbo(ctx, saida, t, 0.5, true);
    palma(ctx, saida, t + 0.23, 0.2);
    tocarTom(ctx, saida, t + 0.35, 180, 0.12, "triangle", 0.18, 0.002);
  },
  ambiente(ctx) {
    const fundo = ambienteRuido(ctx, { freq: 180, tipo: "lowpass", vol: 0.05 });
    const abafa = ctx.createBiquadFilter();
    abafa.type = "lowpass";
    abafa.frequency.value = 220;
    abafa.connect(fundo.saida);
    const parar = repetirSom(() => bumbo(ctx, abafa, ctx.currentTime + 0.01, 0.9), 460, 470);
    return { parar: () => (parar(), fundo.parar()) };
  }
};

ITEMS.push(
  {
    id: "funk_bone_limao",
    p: "funkeiro",
    slot: "hat",
    name: "Boné aba reta limão",
    price: 120,
    svg: () =>
      `<path d="M30 40Q30 12 60 12Q90 12 90 40Z" fill="#C6FF00" ${O}/><path d="M28 38H104Q108 44 100 46H28Z" fill="#1A1A22" ${O}/><circle cx="60" cy="13" r="2.6" fill="#1A1A22"/><path d="M50 28h20" stroke="#1A1A22" stroke-width="3"/>`
  },
  {
    id: "funk_camisa10",
    p: "funkeiro",
    slot: "top",
    name: "Camisa 10",
    price: 140,
    svg: () =>
      topBase("#FFEA00") +
      `<path d="M0 88Q20 96 30 108L18 116Q6 104 0 100ZM120 88Q100 96 90 108L102 116Q114 104 120 100Z" fill="#1E88E5"/><text x="60" y="130" text-anchor="middle" font-size="22" font-weight="900" fill="#1E88E5" font-family="sans-serif">10</text>`
  },
  {
    id: "funk_tactel",
    p: "funkeiro",
    slot: "waist",
    name: "Bermuda tactel",
    price: 100,
    svg: () =>
      `<path d="M6 112H114L122 150H-2Z" fill="#7C4DFF"/><path d="M22 112L14 150M98 112L106 150" stroke="#FFFFFF" stroke-width="3"/><rect x="0" y="110" width="120" height="5" fill="#5E35B1"/>`
  },
  {
    id: "funk_cifrao",
    p: "funkeiro",
    slot: "neck",
    name: "Cordão com pingente",
    price: 130,
    svg: () =>
      `<path d="M30 86Q60 112 90 86" stroke="#E0B23A" stroke-width="3.4" fill="none" stroke-dasharray="3 1.6"/><circle cx="60" cy="104" r="7" fill="#F2C14E" stroke="#B7892B" stroke-width="1.4"/><path d="M60 98v12M57 101q3-2 6 0q-6 3 0 6q-3 2-6 0" stroke="#7A5A00" stroke-width="1.4" fill="none"/>`
  },
  {
    id: "funk_mic",
    p: "funkeiro",
    slot: "hand",
    name: "Microfone sem fio",
    price: 110,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-2" y="-10" width="7" height="20" rx="3" fill="#212121" stroke="var(--ink)" stroke-width="1.2" transform="rotate(-20)"/><circle cx="-3" cy="-14" r="6" fill="#9E9E9E" stroke="var(--ink)" stroke-width="1.2"/><path d="M-7 -14h8M-3 -18v8" stroke="#616161" stroke-width=".8"/>`
      )
  },
  {
    id: "funk_baile",
    p: "funkeiro",
    slot: "bg",
    name: "Baile de favela",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#0D0B14" opacity=".55"/>${CORES_NEON.map((c, i) => `<path d="M${10 + i * 25} -6L${i * 30 - 10} 148" stroke="${c}" stroke-width="8" opacity=".22"/>`).join("")}${[...Array(10)].map((_, i) => `<rect x="${4 + (i % 5) * 24}" y="${96 + Math.floor(i / 5) * 10}" width="10" height="8" fill="#FFD54F" opacity=".5"/>`).join("")}`
  }
);
