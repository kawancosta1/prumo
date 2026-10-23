/*
  Mundo Programador, extras:
  - Commits: cada tarefa feita vira um commit (hash e mensagem) num git log de mentirinha.
  - Gráfico de contribuição: 12 semanas de quadradinhos verdes com as tarefas de cada dia, e a sequência.
  - "git push": fecha os commits do dia (+5 gotas, 1 vez por dia, com pelo menos 1 commit).
  - Teclado mecânico ao concluir tarefa e café com chuva e teclas no foco. Código atravessando a tela na troca de aba.
*/
"use strict";

function devDados() {
  const d = dadosMundo("programador");
  if (!d.contrib || typeof d.contrib !== "object") d.contrib = {};
  if (!Array.isArray(d.commits)) d.commits = [];
  // guarda só 12 semanas
  const limite = addDays(today(), -90);
  for (const k of Object.keys(d.contrib)) if (k < limite) delete d.contrib[k];
  return d;
}
const hashCurto = () => [...Array(7)].map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
function tipoCommit(t) {
  const s = norm(t.title || "");
  if (/consert|resolver|corrig|bug/.test(s)) return "fix";
  if (/estud|revis|\bler\b|livro|aula|prova/.test(s)) return "docs";
  if (/academia|correr|corrida|trein|caminh/.test(s)) return "perf";
  if (/limp|arrum|organiz/.test(s)) return "refactor";
  return "feat";
}

function sequenciaDev(d) {
  let n = 0,
    dia = d.contrib[today()] ? today() : addDays(today(), -1);
  while (d.contrib[dia]) {
    n++;
    dia = addDays(dia, -1);
  }
  return n;
}

function contribSVG(d) {
  const fim = today();
  const inicio = addDays(mondayOf(fim), -77); // 12 semanas
  let q = "";
  for (let s = 0; s < 12; s++)
    for (let w = 0; w < 7; w++) {
      const dia = addDays(inicio, s * 7 + w);
      if (dia > fim) continue;
      const n = d.contrib[dia] || 0;
      const cor =
        n === 0 ? "var(--sunken)" : n === 1 ? "#9BE9A8" : n <= 3 ? "#40C463" : n <= 5 ? "#30A14E" : "#216E39";
      q += `<rect x="${s * 13}" y="${w * 13}" width="11" height="11" rx="2" fill="${cor}"${dia === fim ? ' stroke="var(--ink)" stroke-width="1"' : ""}><title>${fmtShort(dia)}: ${n} ${n === 1 ? "commit" : "commits"}</title></rect>`;
    }
  return `<svg class="cm-cena contrib" viewBox="-1 -1 158 92" role="img" aria-label="Gráfico de contribuição das últimas 12 semanas">${q}</svg>`;
}

function teclas(ctx, saida, t, n = 3) {
  for (let i = 0; i < n; i++) {
    const ti = t + i * (0.07 + Math.random() * 0.04);
    rajada(ctx, saida, ti, 0.025, 2600 + Math.random() * 800, "bandpass", 0.35, 3);
    tocarTom(ctx, saida, ti, 140 + Math.random() * 30, 0.03, "sine", 0.12, 0.001);
  }
}

MUNDO_FX.programador = {
  trocaAba: () =>
    chuvaMundo({
      movimento: "atravessar",
      n: 10,
      tam: [22, 34],
      dur: [1.4, 2.2],
      cores: ["#40C463", "#58A6FF", "#D2A8FF", "#FFA657"],
      formas: ["{ }", "&lt;/&gt;", "0 1", "=&gt;", "( )", ";"].map(
        t =>
          `<text x="12" y="16" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="currentColor">${t}</text>`
      )
    }),
  confete: {
    cores: ["#40C463", "#58A6FF", "#D2A8FF", "#FFA657", "#F0F6FC"],
    formas: ["pixel", "ret", "estrela"]
  },
  musicas: {
    party: "Deploy na sexta (deu certo)",
    happy: "Build passou",
    idle: "Lofi pra codar",
    upset: "Merge conflict",
    sad: "Erro 404 no coração",
    cry: "Produção caiu"
  },
  subnicks: [
    "funciona na minha máquina",
    "~ café, código e commit ~",
    "git commit -m 'vida organizada'",
    "0 bugs (que eu saiba)",
    "refatorando a rotina"
  ],
  humorNomes: {
    Radiante: "Build verde",
    Feliz: "Compilou",
    "De boa": "Em code review",
    Chateado: "Warning",
    Triste: "Bug em produção",
    Arrasado: "Segfault"
  },
  humorExtra(soma) {
    const d = devDados();
    if (sequenciaDev(d) >= 3) soma(3, "sequência de commits");
    if (new Date().getHours() >= 23) soma(1, "madrugada codando");
  },
  aoConcluir(x) {
    const d = devDados();
    d.contrib[today()] = (d.contrib[today()] || 0) + 1;
    d.commits = [
      { h: hashCurto(), m: `${tipoCommit(x)}: ${x.title}`.slice(0, 70), em: today() },
      ...d.commits
    ].slice(0, 30);
  },
  legendasFotolog: [
    "eu, o café e o terminal",
    "{n} commits hoje",
    "{ml} de água.exe",
    "moletom, fone e foco",
    "{nome} fazendo deploy"
  ],
  textos: {
    diario: "Changelog do dia",
    diarioDica: "O que foi pra produção hoje? E o que ficou no backlog?",
    foco: "Modo foco (não perturbe)",
    tarefas: "Backlog de hoje",
    adicionar: "Abrir issue",
    vazioHoje: "Backlog vazio. Abre a primeira issue do dia.",
    atrasadas: "Issues atrasadas",
    trazerTudo: "Puxar tudo pra sprint",
    fecharDia: "Fechar a sprint do dia",
    diaFechado: "Sprint fechada. Bora descansar.",
    reabrir: "Reabrir a sprint",
    diaPerfeito: "Build verde",
    adicionarHabito: "Pôr no cron",
    vazioHabitos: "Nenhuma rotina agendada. Todo sistema roda um cron: comece com um.",
    conviteTitulo: "Todo projeto bom tem pair programming.",
    conviteBotao: "Parear",
    pedidoChegou: "quer parear com você. Aceita o pull request?",
    conviteTexto: "Bora parear no Prumo!",
    sonsTitulo: "Sons do setup",
    somFoco: "Café",
    somFocoNome: "Café com chuva",
    somFocoDica: "Chuva leve e teclas de longe enquanto o cronômetro roda.",
    somTarefa: "Teclado",
    somTarefaNome: "Teclado mecânico",
    somTarefaDica: "Toca ao concluir uma tarefa."
  },
  enfeiteHero: () => {
    const d = devDados();
    return `<span class="enfeite-mundo"><svg viewBox="0 0 24 24">${[0, 1, 2, 3, 4].map(i => `<rect x="${1 + i * 4.6}" y="9" width="3.6" height="3.6" rx=".8" fill="${d.contrib[addDays(today(), i - 4)] ? "#40C463" : "var(--sunken)"}"/>`).join("")}</svg><small>${sequenciaDev(d)} ${sequenciaDev(d) === 1 ? "dia" : "dias"} de commits</small></span>`;
  },
  secaoHoje() {
    const d = devDados();
    const hoje = d.contrib[today()] || 0;
    const push = hoje > 0 && d.push !== today();
    const total = Object.values(d.contrib).reduce((a, b) => a + b, 0);
    return cartaoMundo(
      "cm-git",
      "Commits",
      `${total} ${total === 1 ? "commit" : "commits"} nas últimas 12 semanas · sequência de ${sequenciaDev(d)} ${sequenciaDev(d) === 1 ? "dia" : "dias"}`,
      `${contribSVG(d)}<div class="terminal cm-mono">${
        d.commits.length
          ? d.commits
              .slice(0, 4)
              .map(c => `<div><span class="hash">${c.h}</span> ${esc(c.m)}</div>`)
              .join("")
          : `<div>$ git log<br>(nenhum commit ainda: conclua uma tarefa)</div>`
      }${d.push === today() ? `<div class="ok">$ git push origin main ✓</div>` : ""}</div>${push ? `<div class="cm-botoes"><button class="btn small primary" data-act="dev-push">git push (+5 gotas)</button></div>` : ""}`
    );
  }
};

ACOES_EXTRAS["dev-push"] = () => {
  const d = devDados();
  if (!(d.contrib[today()] > 0) || d.push === today()) return;
  d.push = today();
  const ctx = pegarAudio();
  if (ctx) {
    const s = saidaMundo(ctx, 0.9);
    teclas(ctx, s, ctx.currentTime + 0.02, 6);
    [523, 659, 784].forEach((f, i) =>
      tocarTom(ctx, s, ctx.currentTime + 0.5 + i * 0.09, f, 0.3, "triangle", 0.12)
    );
  }
  premioMundo(5, "Deploy feito! Build verde. <b>+5 gotas</b>.");
  commit();
};

SONS_MUNDO.programador = {
  concluir(ctx, saida, t) {
    teclas(ctx, saida, t, 3);
    tocarTom(ctx, saida, t + 0.3, 1047, 0.25, "triangle", 0.08);
  },
  ambiente: ctx =>
    ambienteComposto(ctx, { freq: 1400, tipo: "lowpass", vol: 0.06 }, [
      [(c, s, t) => teclas(c, s, t, 2 + Math.floor(Math.random() * 4)), 1200, 4200]
    ])
};

ITEMS.push(
  {
    id: "dev_headset_gato",
    p: "programador",
    slot: "hat",
    name: "Fone com orelhinhas",
    price: 140,
    svg: () =>
      `<path d="M30 52Q28 14 60 14Q92 14 90 52" stroke="#37474F" stroke-width="6" fill="none"/><path d="M36 22l-4-14l12 8zM84 22l4-14l-12 8z" fill="#F48FB1" ${O}/><rect x="22" y="46" width="14" height="20" rx="6" fill="#37474F" ${O}/><rect x="84" y="46" width="14" height="20" rx="6" fill="#37474F" ${O}/><circle cx="29" cy="56" r="3" fill="#40C463"/>`
  },
  {
    id: "dev_oculos_azul",
    p: "programador",
    slot: "face",
    name: "Óculos anti luz azul",
    price: 100,
    svg: () =>
      `<rect x="34" y="56" width="22" height="16" rx="4" fill="#58A6FF" opacity=".25" stroke="#263238" stroke-width="2.2"/><rect x="64" y="56" width="22" height="16" rx="4" fill="#58A6FF" opacity=".25" stroke="#263238" stroke-width="2.2"/><path d="M56 62h8" stroke="#263238" stroke-width="2.2"/>`
  },
  {
    id: "dev_hoodie",
    p: "programador",
    slot: "top",
    name: "Moletom preto com capuz",
    price: 150,
    svg: () =>
      topBase("#1F2328") +
      `<path d="M30 84Q60 104 90 84" stroke="#30363D" stroke-width="6" fill="none"/><path d="M52 96v18M68 96v18" stroke="#8B949E" stroke-width="1.6"/><rect x="42" y="124" width="36" height="14" rx="3" fill="#30363D"/><text x="60" y="134" text-anchor="middle" font-size="8" fill="#40C463" font-family="monospace">&gt;_</text>`
  },
  {
    id: "dev_teclado",
    p: "programador",
    slot: "hand",
    name: "Teclado mecânico",
    price: 130,
    svg: (x, y) =>
      H(
        x,
        y,
        `<rect x="-6" y="-8" width="34" height="14" rx="2" fill="#30363D" stroke="var(--ink)" stroke-width="1.4"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-4 + i * 5}" y="-6" width="4" height="4" rx=".6" fill="${["#FF7B72", "#FFA657", "#F2CC60", "#40C463", "#58A6FF", "#D2A8FF"][i]}"/><rect x="${-4 + i * 5}" y="-1" width="4" height="4" rx=".6" fill="#8B949E"/>`).join("")}`
      )
  },
  {
    id: "dev_bug",
    p: "programador",
    slot: "pet",
    name: "Bugzinho",
    price: 120,
    svg: () =>
      `<g transform="translate(15 132)"><path d="M-6 -2l-6-3M-6 2l-7 0M-6 5l-6 3M6 -2l6-3M6 2l7 0M6 5l6 3" stroke="#141416" stroke-width="1.2"/><ellipse cy="2" rx="7" ry="8" fill="#40C463" stroke="var(--ink)" stroke-width="1.1"/><path d="M0 -6V10" stroke="#216E39" stroke-width="1"/><circle cy="-7" r="4.5" fill="#30363D" stroke="var(--ink)" stroke-width="1"/><path d="M-2 -11l-3-4M2 -11l3-4" stroke="#141416" stroke-width="1"/><circle cx="-1.6" cy="-7.4" r="1" fill="#fff"/><circle cx="1.6" cy="-7.4" r="1" fill="#fff"/></g>`
  },
  {
    id: "dev_setup",
    p: "programador",
    slot: "bg",
    name: "Setup com monitores",
    price: 180,
    svg: () =>
      `<rect x="0" y="-6" width="120" height="154" fill="#0D1117" opacity=".55"/><rect x="4" y="20" width="40" height="28" rx="2" fill="#161B22" stroke="#30363D"/><rect x="76" y="20" width="40" height="28" rx="2" fill="#161B22" stroke="#30363D"/>${[0, 1, 2, 3].map(i => `<rect x="8" y="${25 + i * 5}" width="${10 + ((i * 13) % 24)}" height="2" fill="${["#FF7B72", "#40C463", "#58A6FF", "#D2A8FF"][i]}" opacity=".9"/><rect x="80" y="${25 + i * 5}" width="${8 + ((i * 17) % 26)}" height="2" fill="${["#FFA657", "#58A6FF", "#40C463", "#F2CC60"][i]}" opacity=".9"/>`).join("")}<path d="M0 118H120" stroke="#30363D" stroke-width="3"/>`
  }
);
