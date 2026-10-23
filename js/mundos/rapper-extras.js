/*
  Mundo Rapper, extras:
  - Caderno de rimas: cada tarefa feita vira um verso que rima (AABB), montado com o nome da tarefa.
    "Soltar o beat" toca um boom bap. Verso completo (4 linhas no dia) dá +8 gotas uma vez por dia.
  - Scratch de vinil ao concluir tarefa e beat abafado com chiado de disco no foco.
  - Diamantes caindo na troca de aba, falas, humor e roupas novas.
*/
"use strict";

const RIMAS = [
  // pares que rimam entre si (A, A)
  ["Risquei {t} da lista, isso é revolução", "Caneta no caderno, foco e disposição"],
  ["{t}: feito, sem enrolação", "Cada passo que eu dou é uma lição"],
  ["Fechei {t}, agora é só voar", "Quem acorda cedo não para de sonhar"],
  ["{t} no papel, eu vim pra ficar", "Rima, água e foco: ninguém vai me parar"],
  ["Mandei {t} igual quem sabe o que quer", "Disciplina é o flow, pode crer"],
  ["{t} entregue, ponto final", "Minha rotina é meu verso principal"],
  ["Concluí {t}, tô no meu momento", "Constância é o beat, tempo é instrumento"],
  ["{t} na conta, mais um degrau", "Do caderno pro palco, no meu ritual"]
];

function versoDoDia() {
  const feitas = S.tasks.filter(t => t.done && (t.feitaEm || t.date) === today()).slice(0, 8);
  const linhas = [];
  feitas.forEach((t, i) => {
    const par = RIMAS[(hashTexto(today()) + Math.floor(i / 2)) % RIMAS.length];
    const titulo = t.title.length > 28 ? t.title.slice(0, 27) + "…" : t.title;
    linhas.push(
      par[i % 2]
        .replace("{t}", titulo.charAt(0).toLowerCase() + titulo.slice(1))
        .replace(/^./, c => c.toUpperCase())
    );
  });
  return linhas;
}

function boomBap(ctx, saida, t, compassos = 2) {
  const tempo = 60 / 90; // 90 bpm
  for (let c = 0; c < compassos; c++) {
    const b = t + c * tempo * 4;
    [0, 1.5, 2.5].forEach(x => bumbo(ctx, saida, b + x * tempo, 0.55));
    [1, 3].forEach(x => caixa(ctx, saida, b + x * tempo, 0.28));
    for (let k = 0; k < 8; k++)
      chimbal(ctx, saida, b + (k * tempo) / 2 + (k % 2 ? 0.03 : 0), k % 2 ? 0.04 : 0.07);
    // baixo
    [55, 55, 49, 65.4].forEach((f, i) =>
      tocarTom(ctx, saida, b + i * tempo, f, tempo * 0.9, "triangle", 0.25, 0.01)
    );
  }
}
function scratch(ctx, saida, t) {
  const f = ctx.createBufferSource();
  f.buffer = ruidoBranco(ctx);
  const fl = ctx.createBiquadFilter();
  fl.type = "bandpass";
  fl.Q.value = 4;
  fl.frequency.setValueAtTime(400, t);
  fl.frequency.exponentialRampToValueAtTime(2400, t + 0.09);
  fl.frequency.exponentialRampToValueAtTime(500, t + 0.2);
  const g = envelope(ctx, t, 0.01, 0.22, 0.4);
  f.connect(fl).connect(g).connect(saida);
  f.start(t);
  f.stop(t + 0.25);
}

MUNDO_FX.rapper = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "cair",
      n: 12,
      tam: [14, 26],
      dur: [1.1, 1.8],
      cores: ["#F2C14E", "#E0E0E0", "#80DEEA"],
      formas: [
        `<path d="M4 9L8 3H16L20 9L12 21Z" fill="currentColor" stroke="#5D4037" stroke-width=".8"/><path d="M4 9H20M8 3L10 9L12 21L14 9L16 3" stroke="#5D4037" stroke-width=".6" fill="none" opacity=".6"/>`
      ]
    }),
  confete: {
    cores: ["#F2C14E", "#E0E0E0", "#212121", "#80DEEA"],
    formas: ["diamante", "estrela", "ret", "moeda"]
  },
  musicas: {
    party: "Hino da quebrada (ao vivo)",
    happy: "Flow de segunda",
    idle: "Beat no repeat",
    upset: "Rima travada",
    sad: "Verso de saudade",
    cry: "Faixa bônus triste"
  },
  subnicks: [
    "rima no caderno, foco no corre",
    "~ boom bap no fone ~",
    "de onde eu vim ninguém desiste",
    "cada dia um verso novo",
    "respeita o processo"
  ],
  humorNomes: {
    Radiante: "No topo",
    Feliz: "No flow",
    "De boa": "No beat",
    Chateado: "Rima travada",
    Triste: "Verso triste",
    Arrasado: "Sem caneta"
  },
  humorExtra(soma) {
    if (versoDoDia().length >= 4) soma(3, "verso completo");
  },
  aoConcluir() {
    setTimeout(() => {
      const v = versoDoDia();
      if (v.length) react("party", `<i>"${esc(v[v.length - 1])}"</i>`, 3600);
    }, 1400);
  },
  legendasFotolog: [
    "eu e o caderno de rimas",
    "{n} versos escritos hoje",
    "{ml} de água gelada no estúdio",
    "corrente no peito e caneta na mão",
    "{nome} no microfone"
  ],
  textos: {
    diario: "Verso livre",
    diarioDica: "Escreve o verso do dia: o que rolou, o que você aprendeu.",
    foco: "Estúdio",
    tarefas: "Corre de hoje",
    adicionar: "Pôr no corre",
    vazioHoje: "Caderno em branco. Escreve o primeiro corre.",
    atrasadas: "Rimas pendentes",
    fecharDia: "Fechar a faixa",
    diaFechado: "Faixa gravada. Que verso!",
    reabrir: "Regravar",
    diaPerfeito: "Disco de ouro",
    adicionarHabito: "Pôr no ritual",
    vazioHabitos: "Nenhum ritual ainda. Todo MC treina todo dia: comece com um.",
    conviteTitulo: "Todo MC precisa de um parceiro de feat.",
    conviteBotao: "Chamar pro feat",
    pedidoChegou: "quer fazer um feat com você. Bora?",
    conviteTexto: "Cola no meu feat no Prumo!",
    sonsTitulo: "Sons do estúdio",
    somFoco: "Beat",
    somFocoNome: "Beat no estúdio",
    somFocoDica: "Boom bap abafado e chiado de vinil enquanto o cronômetro roda.",
    somTarefa: "Scratch",
    somTarefaNome: "Scratch no vinil",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () =>
    `<span class="enfeite-mundo"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1.5" fill="#FFF8E1" stroke="#5D4037" stroke-width="1"/><path d="M8 8h8M8 11h8M8 14h6" stroke="#9E9E9E" stroke-width="1"/><path d="M15 17l5-9" stroke="#212121" stroke-width="1.6"/></svg><small>${versoDoDia().length} ${versoDoDia().length === 1 ? "verso" : "versos"} hoje</small></span>`,
  secaoHoje() {
    const v = versoDoDia();
    const d = dadosMundo("rapper");
    const premio = v.length >= 4 && d.verso !== today();
    return cartaoMundo(
      "cm-rimas",
      "Caderno de rimas",
      v.length
        ? v.length >= 4
          ? "Verso completo! Solta o beat."
          : `Faltam ${4 - v.length} pra fechar o verso.`
        : "Cada tarefa feita vira um verso.",
      `<div class="caderno">${v.length ? v.map(l => `<p>${esc(l)}</p>`).join("") : `<p class="vazio">(a primeira rima nasce quando você concluir uma tarefa)</p>`}</div><div class="cm-botoes"><button class="btn small ${premio ? "" : "primary"}" data-act="rap-beat">Soltar o beat</button>${premio ? `<button class="btn small primary" data-act="rap-verso">Gravar o verso (+8 gotas)</button>` : ""}</div>`
    );
  }
};

ACOES_EXTRAS["rap-beat"] = () => {
  const ctx = pegarAudio();
  if (ctx) boomBap(ctx, saidaMundo(ctx, 0.85), ctx.currentTime + 0.05, 2);
};
ACOES_EXTRAS["rap-verso"] = () => {
  const d = dadosMundo("rapper");
  if (versoDoDia().length < 4 || d.verso === today()) return;
  d.verso = today();
  ACOES_EXTRAS["rap-beat"]();
  premioMundo(8, "Verso gravado! Disco de ouro na parede. <b>+8 gotas</b>.");
  commit();
};

SONS_MUNDO.rapper = {
  concluir(ctx, saida, t) {
    scratch(ctx, saida, t);
    scratch(ctx, saida, t + 0.22);
    bumbo(ctx, saida, t + 0.44, 0.45);
  },
  ambiente(ctx) {
    const fundo = ambienteComposto(ctx, { freq: 3500, tipo: "highpass", vol: 0.015 }, [[estalo, 300, 1400]]);
    const abafa = ctx.createBiquadFilter();
    abafa.type = "lowpass";
    abafa.frequency.value = 500;
    const vol = ctx.createGain();
    vol.gain.value = 0.35;
    abafa.connect(vol).connect(ctx.destination);
    let vivo = true;
    const loop = () => {
      if (!vivo) return;
      boomBap(ctx, abafa, ctx.currentTime + 0.05, 1);
      setTimeout(loop, (60 / 90) * 4 * 1000);
    };
    loop();
    return {
      parar() {
        vivo = false;
        vol.gain.setValueAtTime(vol.gain.value, ctx.currentTime);
        vol.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        fundo.parar();
      }
    };
  }
};

ITEMS.push(
  {
    id: "rap_bucket",
    p: "rapper",
    slot: "hat",
    name: "Bucket hat",
    price: 110,
    svg: () =>
      `<path d="M34 38Q34 12 60 12Q86 12 86 38Z" fill="#212121" ${O}/><path d="M22 40Q60 30 98 40L92 48Q60 40 28 48Z" fill="#212121" ${O}/><path d="M36 26h48" stroke="#F2C14E" stroke-width="2" stroke-dasharray="4 3"/>`
  },
  {
    id: "rap_college",
    p: "rapper",
    slot: "top",
    name: "Jaqueta college",
    price: 160,
    svg: () =>
      topBase("#1A237E") +
      `<path d="M0 88Q20 96 30 108L18 120Q6 104 0 100ZM120 88Q100 96 90 108L102 120Q114 104 120 100Z" fill="#ECEFF1"/><path d="M60 90V150" stroke="#ECEFF1" stroke-width="2"/>${[100, 112, 124].map(y => `<circle cx="64" cy="${y}" r="1.8" fill="#ECEFF1"/>`).join("")}<text x="36" y="122" text-anchor="middle" font-size="16" font-weight="900" fill="#F2C14E" font-family="serif">P</text>`
  },
  {
    id: "rap_mic_pingente",
    p: "rapper",
    slot: "neck",
    name: "Corrente com microfone",
    price: 150,
    svg: () =>
      `<path d="M30 86Q60 114 90 86" stroke="#E0B23A" stroke-width="3" fill="none" stroke-dasharray="2.6 1.4"/><rect x="57" y="100" width="6" height="12" rx="2" fill="#F2C14E" stroke="#B7892B"/><circle cx="60" cy="99" r="4.4" fill="#F2C14E" stroke="#B7892B"/>`
  },
  {
    id: "rap_oculos_ouro",
    p: "rapper",
    slot: "face",
    name: "Óculos dourado",
    price: 120,
    svg: () =>
      `<rect x="34" y="57" width="24" height="13" rx="3" fill="#212121" stroke="#E0B23A" stroke-width="2"/><rect x="62" y="57" width="24" height="13" rx="3" fill="#212121" stroke="#E0B23A" stroke-width="2"/><path d="M58 62h4" stroke="#E0B23A" stroke-width="2"/><path d="M38 60l6 0" stroke="#fff" stroke-width="1.2" opacity=".6"/>`
  },
  {
    id: "rap_spray",
    p: "rapper",
    slot: "hand",
    name: "Lata de spray",
    price: 90,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-4" y="-16" width="12" height="22" rx="3" fill="#E53935" stroke="var(--ink)" stroke-width="1.4"/><rect x="-1" y="-21" width="6" height="5" fill="#BDBDBD" stroke="var(--ink)" stroke-width="1"/><path d="M8 -20q6-2 10-6M8 -19q7 1 11-1" stroke="#E53935" stroke-width="1.4" opacity=".6"/>`
      )
  },
  {
    id: "rap_muro",
    p: "rapper",
    slot: "bg",
    name: "Muro grafitado",
    price: 170,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#9E9E9E" opacity=".35"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0 ${8 + i * 24}H120" stroke="#757575" stroke-width=".8" opacity=".4"/>`).join("")}<path d="M6 30q10-16 22 0t22 0" stroke="#E53935" stroke-width="7" fill="none" opacity=".55" stroke-linecap="round"/><path d="M72 22q12 10 24-2t20 6" stroke="#1E88E5" stroke-width="6" fill="none" opacity=".55" stroke-linecap="round"/><path d="M90 110l8-14l8 14z" fill="#FDD835" opacity=".55"/>`
  }
);
