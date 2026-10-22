/*
  Efeitos especiais do mundo Roqueiro, com o jeito do videogame de guitarra:
  - notas coloridas (verde, vermelho, amarelo, azul, laranja) caindo numa estrada ao trocar de aba;
  - medidor da plateia, dificuldade do dia e multiplicador de sequência no cartão do Prumi;
  - Star Power: cada tarefa concluída enche a barra (as de prioridade alta são "notas estrela" e enchem mais).
    Cheia, um toque ativa 30 minutos de gotas em dobro;
  - turnê da semana (cada dia é um show com nota de 1 a 5 estrelas), letra do dia e o segredo do riff.
  A decoração visual (CSS) fica em estilos/mundos/rock.css e os sons em js/sons.js.
  Regra: nada de nome, logo ou letra de banda real. Tudo aqui é inventado.
*/
"use strict";

/* ---------- partícula da água e do fundo: palheta ---------- */
PART.palheta = () => `<path d="M-3.6 -3Q0 -5 3.6 -3Q3.9 1.6 0 5Q-3.9 1.6 -3.6 -3Z" fill="#F2C318"/>`;

/* ---------- Star Power ---------- */
const STAR_MINUTOS = 30;
const ENERGIA_NOTA = 20; // tarefa comum: 5 enchem a barra
const ENERGIA_ESTRELA = 34; // nota estrela (prioridade alta): 3 enchem a barra
const rockDados = () => S.rock || (S.rock = { energia: 0, starAte: 0, usos: 0 });
const starAtivo = () => rockDados().starAte > Date.now();
const minutosStar = () => Math.max(1, Math.ceil((rockDados().starAte - Date.now()) / 60000));

/** Liga a classe do Star Power no html (cores elétricas) conforme o tempo que falta. */
let starLigado = false;
function conferirStar(redesenhar = false) {
  const ligar = S.persona === "rock" && starAtivo();
  const acabou = starLigado && !ligar && S.persona === "rock";
  starLigado = ligar; // atualiza antes de redesenhar (o redesenho chama esta função de novo)
  document.documentElement.classList.toggle("star-power", ligar);
  if (acabou && redesenhar) {
    toast("O Star Power acabou. Conclua mais tarefas para encher a barra de novo.", false, "idle");
    if (typeof render === "function") render();
  }
}
setInterval(() => conferirStar(true), 20000);

/** Clarão azul com raios quando o Star Power liga. */
function claraoStar() {
  if (RM) return;
  const c = document.createElement("div");
  c.className = "clarao-star";
  c.setAttribute("aria-hidden", "true");
  c.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M22 0L12 38H20L8 100" /><path d="M78 0L88 30H80L94 100"/><path d="M50 0L44 22H52L46 46"/></svg>`;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1200);
}

ACOES_EXTRAS["star-power"] = () => {
  const r = rockDados();
  if (starAtivo()) {
    react("party", `Star Power ligado! Gotas em dobro por mais <b>${minutosStar()} min</b>.`, 3000);
    return;
  }
  if (r.energia < 100) {
    const faltam = Math.ceil((100 - r.energia) / ENERGIA_NOTA);
    react(
      "happy",
      `A barra tá em <b>${r.energia}%</b>. Mais ${faltam} ${faltam === 1 ? "tarefa" : "tarefas"} e o Star Power liga. As de prioridade alta são notas estrela e enchem mais!`,
      4200
    );
    return;
  }
  r.energia = 0;
  r.starAte = Date.now() + STAR_MINUTOS * 60000;
  r.usos = (r.usos || 0) + 1;
  if (typeof somStarPower === "function") somStarPower();
  claraoStar();
  starLigado = true;
  document.documentElement.classList.add("star-power");
  fx.big = true;
  react(
    "party",
    `STAR POWER! Gotas em dobro por <b>${STAR_MINUTOS} minutos</b>. A plateia foi à loucura!`,
    4500
  );
  commit();
};

/* ---------- números do show de hoje ---------- */
function showDeHoje() {
  const d = today();
  const tt = S.tasks.filter(t => t.date === d);
  const feitas = tt.filter(t => t.done).length;
  const atrasadas = S.tasks.filter(t => !t.done && t.date < d).length;
  const agua = Math.min(1, waterToday() / (S.waterGoal || 2000));
  const base = tt.length ? feitas / tt.length : 0.45;
  let v = 0.15 + base * 0.6 + agua * 0.25 - Math.min(atrasadas, 4) * 0.06;
  if (starAtivo()) v = 1;
  v = Math.max(0.03, Math.min(0.97, v));
  const mult = (feitas >= 9 ? 4 : feitas >= 6 ? 3 : feitas >= 3 ? 2 : 1) * (starAtivo() ? 2 : 1);
  const dificuldade =
    tt.length <= 2 ? "Fácil" : tt.length <= 5 ? "Médio" : tt.length <= 8 ? "Difícil" : "Expert";
  const plateia =
    v < 0.3
      ? "Plateia vaiando"
      : v < 0.55
        ? "Plateia morna"
        : v < 0.8
          ? "Plateia animada"
          : "Plateia em delírio";
  return { v, feitas, mult, dificuldade, plateia };
}

/** Medidor da plateia: meia-lua vermelha, amarela e verde com um ponteiro. */
function medidorSVG(v) {
  const cx = 24,
    cy = 24,
    r = 18;
  const pt = graus => {
    const a = (graus * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy - r * Math.sin(a)).toFixed(1)}`;
  };
  const arco = (de, ate, cor) =>
    `<path d="M${pt(de)}A${r} ${r} 0 0 1 ${pt(ate)}" fill="none" stroke="${cor}" stroke-width="6"/>`;
  const ang = ((180 - v * 180) * Math.PI) / 180;
  const px = (cx + (r - 3) * Math.cos(ang)).toFixed(1),
    py = (cy - (r - 3) * Math.sin(ang)).toFixed(1);
  return `<svg viewBox="0 0 48 28" width="48" height="28" aria-hidden="true">${arco(180, 121, "#E0312F")}${arco(119, 61, "#F2C318")}${arco(59, 0, "#2FB344")}<path d="M${cx} ${cy}L${px} ${py}" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="3" fill="var(--ink)"/></svg>`;
}

/* ---------- notas caindo na estrada ao trocar de aba ---------- */
const CORES_TRASTE = ["#2FB344", "#E0312F", "#F2C318", "#2F6FD6", "#F07A1A"];
function notasCaindo() {
  if (RM) return;
  const antigo = document.getElementById("estrada-notas");
  if (antigo) antigo.remove();
  const W = document.documentElement.clientWidth || innerWidth;
  const alvo = Math.round(Math.min(innerHeight * 0.4, 300)); // altura da linha de acerto
  const largura = Math.min(W * 0.92, 420);
  const topo = largura * 0.28;
  const cx = W / 2;
  const estrela = starAtivo();
  const pista = document.createElement("div");
  pista.id = "estrada-notas";
  pista.setAttribute("aria-hidden", "true");
  pista.style.setProperty("--alvo", alvo + "px");
  let html = `<div class="pista" style="left:${cx - largura / 2}px;width:${largura}px;clip-path:polygon(${50 - (topo / largura) * 50}% 0,${50 + (topo / largura) * 50}% 0,100% 100%,0 100%)"></div>`;
  // trastes na linha de acerto
  for (let i = 0; i < 5; i++) {
    const x = cx + (i - 2) * (largura / 5);
    html += `<span class="traste" style="left:${x}px;--c:${CORES_TRASTE[i]}"></span>`;
  }
  // um riff curtinho: 5 a 7 notas, às vezes um acorde (duas juntas)
  let t = 0;
  const n = 5 + Math.floor(Math.random() * 3);
  for (let k = 0; k < n; k++) {
    const pistas =
      Math.random() < 0.25
        ? [Math.floor(Math.random() * 4)].flatMap(a => [a, a + 1])
        : [Math.floor(Math.random() * 5)];
    for (const i of pistas) {
      const x0 = cx + (i - 2) * (topo / 5);
      const x1 = cx + (i - 2) * (largura / 5);
      const cor = estrela ? "#8FD3FF" : CORES_TRASTE[i];
      const s = `--x0:${x0.toFixed(0)}px;--x1:${x1.toFixed(0)}px;--d:${t.toFixed(2)}s;--c:${cor}`;
      html += `<span class="nota" style="${s}"><i></i></span><span class="acerto" style="${s}"></span>`;
    }
    t += 0.1 + Math.random() * 0.09;
  }
  pista.innerHTML = html;
  document.body.insertBefore(pista, document.body.firstChild);
  setTimeout(() => pista.remove(), 1900 + t * 1000);
}

/* ---------- segredo: 6 toques rápidos no Prumi tocam um riff ---------- */
let toquesRiff = [];

/* ---------- turnê da semana ---------- */
const PALCOS = [
  "Garagem do vizinho",
  "Bar do Porão",
  "Festa da faculdade",
  "Casa de shows Trovão",
  "Teatro da Praça",
  "Ginásio Lotado",
  "Estádio Municipal",
  "Festival de Verão"
];
const DIAS_CURTOS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** Nota de 1 a 5 estrelas de um dia (ou 0 se foi folga). */
function estrelasDoDia(d) {
  const tt = S.tasks.filter(t => t.date === d);
  const bateuAgua = waterToday(d) >= (S.waterGoal || 2000);
  if (!tt.length && !bateuAgua) return 0;
  const ratio = tt.length ? tt.filter(t => t.done).length / tt.length : 0.5;
  return Math.max(1, Math.min(5, Math.round(1 + ratio * 3 + (bateuAgua ? 1 : 0))));
}
const estrelasHTML = n =>
  `<span class="estrelas" aria-label="${n} de 5 estrelas">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? "on" : ""}">★</i>`).join("")}</span>`;

/* ---------- números para as conquistas do rock (js/conquistas.js) ---------- */
/** Maior número de tarefas concluídas num mesmo dia. */
function recordeNotasNumDia() {
  const c = {};
  for (const t of S.tasks) if (t.done) c[t.date] = (c[t.date] || 0) + 1;
  return Math.max(0, ...Object.values(c));
}
/** Dias seguidos (até hoje ou ontem) com pelo menos uma tarefa concluída. */
function turneSeguida() {
  const dias = new Set(S.tasks.filter(t => t.done).map(t => t.date));
  let d = today();
  if (!dias.has(d)) d = addDays(d, -1);
  let n = 0;
  while (dias.has(d) && n < 400) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/* ---------- ganchos usados pelo resto do app ---------- */
MUNDO_FX.rock = {
  trocaAba: notasCaindo,

  // Confete: palhetas, estrelas e raios nas cores dos trastes
  confete: {
    cores: CORES_TRASTE,
    formas: ["palheta", "palheta", "estrela", "raio"]
  },

  // Perfil: música inventada para cada humor e frases de subnick
  musicas: {
    party: "Hino do estádio (ao vivo)",
    happy: "Estrada aberta",
    idle: "Passagem de som",
    upset: "Corda arrebentada",
    sad: "Balada do amplificador desligado",
    cry: "Solo na chuva"
  },
  subnicks: [
    "\\m/ rock até o fim do dia \\m/",
    "~ afinando a guitarra ~",
    "setlist pronta, palco montado",
    "ouvindo vinil no talo",
    "volume no máximo, problema no mínimo",
    "x4 de multiplicador hoje",
    "acordes > boletos",
    "em turnê pela minha própria vida"
  ],

  // Nomes de humor no jeito roqueiro (a chave é o nome padrão em humor.js)
  humorNomes: {
    Radiante: "Lendário",
    Feliz: "No ritmo",
    "De boa": "Afinando",
    Chateado: "Corda arrebentou",
    Triste: "Balada triste",
    Arrasado: "Vaiado"
  },

  // Fatores extras de humor: Star Power e noite de show (sexta e sábado à noite)
  humorExtra(soma) {
    if (starAtivo()) soma(6, "Star Power ligado");
    const agora = new Date();
    if ([5, 6].includes(agora.getDay()) && agora.getHours() >= 19) soma(4, "noite de show");
  },

  // Gotas em dobro com o Star Power ligado
  multiplicadorGotas: () => (starAtivo() ? 2 : 1),

  // Cada tarefa concluída enche a barra do Star Power (só uma vez por tarefa)
  aoConcluir(x) {
    if (x.estrela) return;
    x.estrela = 1;
    const r = rockDados();
    const antes = r.energia || 0;
    r.energia = Math.min(100, antes + (x.prio === 3 ? ENERGIA_ESTRELA : ENERGIA_NOTA));
    if (antes < 100 && r.energia >= 100 && !starAtivo())
      setTimeout(
        () => toast("Star Power carregado! Toque na barra no cartão do Prumi para ativar.", false, "party"),
        2400
      );
  },

  // Legendas do Fotolog. {n} = tarefas feitas hoje, {ml} = água, {nome} = seu nome
  legendasFotolog: [
    "eu e a guitarra contra o silêncio",
    "{n} músicas tocadas hoje. bis!",
    "{ml} de água elétrica no tanque",
    "flash no palco e chifrinho pro alto \\m/",
    "camiseta da turnê e cara de quem não dormiu",
    "{nome} ao vivo, ingressos esgotados",
    "passagem de som feita, agora é show",
    "suor, palheta e muita água"
  ],

  // Textos trocados neste mundo (a chave é usada em textoMundo("chave", "texto padrão") nas telas)
  textos: {
    diario: "Fim de show",
    diarioDica: "Como foi o show de hoje? Qual música bombou, qual desafinou?",
    foco: "Ensaio no estúdio",
    poemaBotao: "Letra do dia",
    poemaFala: "Compus uma letra pra hoje. Pode mexer no refrão, a música é sua.",
    // aba Hoje
    tarefas: "Setlist",
    adicionar: "Tocar",
    vazioHoje: "Setlist vazia. Palco montado, só falta a primeira música.",
    atrasadas: "Notas perdidas",
    trazerTudo: "Tocar tudo hoje",
    fecharDia: "Encerrar o show",
    fecharComPendentes: "Deixar {n} pro bis e encerrar",
    diaFechado: "Cortinas fechadas. Que show!",
    reabrir: "Voltar pro bis",
    diaPerfeito: "Show 5 estrelas",
    conquista_dia_perfeito: "Show 5 estrelas",
    // outras abas
    adicionarHabito: "Pôr no repertório",
    vazioHabitos: "Repertório vazio. Toda banda tem seu ensaio de sempre: comece com um.",
    vazioCompromissos: "Agenda de shows vazia. Bora marcar uma data!",
    vazioPessoas: "Nenhum fã ainda. Adiciona sua banda e sua galera.",
    vazioEstudos: "Nenhum ensaio nesta semana. O metrônomo tá com saudade.",
    // parceria no tom de banda
    conviteTitulo: "Toda lenda precisa de uma banda.",
    conviteDica: "Chama alguém pra tocar junto: passe seu código ou digite o código da pessoa.",
    conviteBotao: "Formar a banda",
    pedidoChegou: "quer entrar na sua banda. Bora tocar junto?",
    // estante de leitura
    notaIcone: "♪",
    livroLido: "Livro terminado! Disco de ouro na estante. <b>+50 páginas</b>.",
    vazioLeitura: "Nenhum livro aberto. Biografia de roqueiro também conta.",
    // amigos
    pedidoAmizade: "Pedido mandado! Agora é esperar o convite pro camarim ser aceito.",
    pedirPar: "Fazer um dueto (ser meu par)",
    conviteTexto: "Entra pra minha banda no Prumo! \\m/",
    // sons (js/sons.js)
    sonsTitulo: "Sons do palco",
    somFoco: "Plateia",
    somFocoNome: "Plateia no ensaio",
    somFocoDica: "Barulho de plateia ao longe enquanto o cronômetro roda.",
    somTarefa: "Palhetada",
    somTarefaNome: "Palhetada",
    somTarefaDica: "Um acorde de guitarra ao concluir uma tarefa."
  },

  // Hábitos sugeridos na aba Hábitos (um toque adiciona)
  habitosSugeridos: ["Treinar guitarra 20 min", "Aquecer a voz", "Ouvir um disco inteiro", "Alongar as mãos"],

  // Botão "Letra do dia" no diário: compõe uma letra inventada (verso e refrão)
  poemaDoDia() {
    const quem = [
      "A estrada",
      "Meu amplificador",
      "A cidade",
      "O palco",
      "Minha guitarra velha",
      "O ônibus da turnê",
      "A segunda-feira",
      "Meu caderno de tarefas",
      "O copo d'água",
      "A plateia"
    ];
    const faz = [
      "grita meu nome",
      "não para de tocar",
      "pega fogo",
      "acelera comigo",
      "me chama pra viver",
      "faz o chão tremer",
      "vira um solo",
      "pede mais um bis"
    ];
    const onde = [
      "na madrugada",
      "no último volume",
      "debaixo dos holofotes",
      "na beira da estrada",
      "no meio da semana",
      "entre um gole e outro",
      "no quinto traste",
      "antes do sol nascer"
    ];
    const refrao = [
      "Hoje ninguém me para",
      "Aumenta esse som",
      "É só mais um dia de turnê",
      "Eu vim pra tocar alto",
      "Liga o Star Power",
      "A lista acabou, o show não"
    ];
    const grito = ["Ô ô ô!", "Ê ê ê!", "Yeah!", "Uh!", "Hey, hey!"];
    const titulo = ["Setlist", "Estrada", "Volume", "Turnê", "Amplificador", "Bis", "Raio"];
    const a = pick(quem);
    const b = pick(quem.filter(x => x !== a));
    const r = pick(refrao);
    const f1 = pick(faz);
    const f2 = pick(faz.filter(x => x !== f1));
    return `♪ ${pick(titulo)} ♪\n${a} ${f1}\n${pick(onde)},\n${b} ${f2}\n\n[refrão]\n${r}, ${pick(grito)}\n${r}!`;
  },

  // Resumo da semana como turnê: cada dia é um show num palco, com nota de 1 a 5 estrelas
  resumoSemana() {
    const fim = today(),
      inicio = mondayOf(fim);
    const nivel = levelOf(S.xp).lvl;
    const base = Math.min(nivel - 1, PALCOS.length - 4);
    const shows = [];
    for (let i = 0, d = inicio; d <= fim; i++, d = addDays(d, 1)) {
      shows.push({
        d,
        i,
        n: estrelasDoDia(d),
        palco: PALCOS[Math.min(PALCOS.length - 1, base + Math.floor(i / 2))]
      });
    }
    const tocados = shows.filter(s => s.n);
    const media = tocados.length ? tocados.reduce((a, s) => a + s.n, 0) / tocados.length : 0;
    const linha = s =>
      `<li class="${s.n ? "" : "folga"}"><span class="dia">${DIAS_CURTOS[s.i]}</span><span class="palco">${s.n ? esc(s.palco) : "Folga"}${s.d === fim && s.n ? ` <em>ao vivo</em>` : ""}</span>${s.n ? estrelasHTML(s.n) : `<span class="note">sem show</span>`}</li>`;
    return `<section class="block turne"><details class="more"><summary><svg viewBox="-20 -26 36 40" width="24" height="26" aria-hidden="true">${guitar("#E0312F", "#3A2A1E").replace(/var\(--ink\)/g, "#141416")}</svg>Turnê da semana <span class="count">${tocados.length} ${tocados.length === 1 ? "show" : "shows"}</span></summary>
      <ol class="shows">${shows.map(linha).join("")}</ol>
      <span class="note">${tocados.length ? `Média da turnê: <b>${media.toFixed(1).replace(".", ",")} estrelas</b>. Concluir tudo e bater a água dá 5 estrelas.` : "Nenhum show ainda. Conclua tarefas para subir no palco."}</span></details></section>`;
  },

  // Enfeite no cartão do Prumi: medidor da plateia, dificuldade, multiplicador e a barra do Star Power
  enfeiteHero() {
    conferirStar();
    const s = showDeHoje();
    const r = rockDados();
    const ativo = starAtivo();
    const cheio = !ativo && r.energia >= 100;
    const barra = ativo ? 100 - ((r.starAte - Date.now()) / (STAR_MINUTOS * 60000)) * 100 : r.energia;
    return `<div class="palco-hud"><span class="medidor" title="Medidor da plateia">${medidorSVG(s.v)}</span>
      <span class="hud-txt"><b>${s.plateia}</b><small>${s.dificuldade} · ${s.feitas} ${s.feitas === 1 ? "nota" : "notas"} <span class="mult">x${s.mult}</span></small></span>
      <button class="star-bt ${cheio ? "cheio" : ""} ${ativo ? "ativo" : ""}" data-act="star-power" aria-label="${ativo ? `Star Power ligado, faltam ${minutosStar()} minutos` : cheio ? "Ativar Star Power" : `Star Power em ${r.energia}%`}"><span class="star-barra"><i style="width:${Math.max(0, Math.min(100, ativo ? 100 - barra : barra)).toFixed(0)}%"></i></span><small>${ativo ? `Gotas x2 · ${minutosStar()} min` : cheio ? "Ativar Star Power!" : "Star Power"}</small></button></div>`;
  },

  // Camadas extras no desenho do Prumi (só nos Prumis "vivos")
  camadasPrumi({ mood, temCenario }) {
    let fundo = "";
    if (starAtivo()) {
      fundo = `<g class="aura-star"><ellipse cx="60" cy="82" rx="58" ry="70" fill="#4FA3FF" opacity=".16"/><path class="pisca" d="M8 40L18 52H12L22 66" stroke="#8FD3FF" stroke-width="2" fill="none"/><path class="pisca" style="animation-delay:.5s" d="M112 46L102 58H108L98 72" stroke="#8FD3FF" stroke-width="2" fill="none"/></g>`;
    } else if (mood === "sleepy" && !temCenario) {
      // dormindo encostado no amplificador
      fundo = `<g class="amp-sono"><rect x="14" y="88" width="92" height="60" rx="4" fill="#1E1F24" stroke="var(--ink)" stroke-width="2"/><rect x="20" y="94" width="80" height="10" fill="#2B2B33"/>${[30, 44, 58, 72, 86].map(x => `<circle cx="${x}" cy="99" r="2" fill="#C9CED6"/>`).join("")}<rect x="20" y="108" width="80" height="34" fill="#3A3A44"/></g>`;
    } else if (mood === "party" && !temCenario) {
      fundo = `<g class="holofote"><path d="M48 -6H72L112 148H8Z" fill="#FFF6C8" opacity=".22"/></g>`;
    }
    return { fundo, rosto: "" };
  },

  // Toques no Prumi: 6 toques rápidos tocam um riff secreto
  aoTocar() {
    const agora = Date.now();
    toquesRiff = toquesRiff.filter(t => agora - t < 3500);
    toquesRiff.push(agora);
    if (toquesRiff.length < 6) return false;
    toquesRiff = [];
    if (typeof somRiff === "function") somRiff();
    if (!S.stats.riff) S.stats.riff = 1;
    fx.big = true;
    react("party", "\\m/ Você tocou o riff secreto! A plateia pediu bis.", 4500);
    commit();
    return true;
  }
};
