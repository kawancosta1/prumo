/*
  Resumo da semana: no domingo à noite (a semana que está acabando) e na segunda e terça (a semana passada)
  aparece um cartão no Hoje com água, estudo, leitura, hábitos e tarefas, comparando com a semana anterior.
  Dá para compartilhar como imagem (gera um PNG com o Prumi vestido como está).
  S.resumoVisto guarda a segunda-feira da última semana que a pessoa fechou, para não insistir.
*/
"use strict";

/** Dias de uma semana (segunda a domingo) que já aconteceram. */
const diasPassadosDaSemana = seg => [...Array(7)].map((_, i) => addDays(seg, i)).filter(d => d <= today());

function numerosDaSemana(seg) {
  const dias = diasPassadosDaSemana(seg);
  const fim = addDays(seg, 6);
  const agua = dias.reduce((a, d) => a + waterToday(d), 0);
  const diasAgua = dias.filter(d => waterToday(d) >= S.waterGoal).length;
  const estudo = S.sessions
    .filter(s => s.date >= seg && s.date <= fim)
    .reduce((a, s) => a + (+s.min || 0), 0);
  const paginas = dias.reduce((a, d) => a + (S.leitura.log[d] || 0), 0);
  let habitosFeitos = 0,
    habitosTotal = 0;
  for (const d of dias)
    for (const h of S.habits) {
      if (!habitDue(h, d)) continue;
      habitosTotal++;
      if (habitDone(h, d)) habitosFeitos++;
    }
  const tarefas = S.tasks.filter(
    t => t.done && (t.feitaEm ? t.feitaEm >= seg && t.feitaEm <= fim : t.date >= seg && t.date <= fim)
  ).length;
  // melhor dia: o que somou mais coisa (água batida, estudo, páginas, hábitos)
  let melhor = null,
    melhorNota = 0;
  for (const d of dias) {
    const nota =
      (waterToday(d) >= S.waterGoal ? 3 : 0) +
      S.sessions.filter(s => s.date === d).reduce((a, s) => a + s.min, 0) / 20 +
      (S.leitura.log[d] || 0) / 10 +
      (S.habitLog[d] || []).length;
    if (nota > melhorNota) ((melhorNota = nota), (melhor = d));
  }
  return {
    seg,
    fim,
    dias: dias.length,
    agua,
    diasAgua,
    estudo,
    paginas,
    habitosFeitos,
    habitosTotal,
    tarefas,
    melhor
  };
}

/** Qual semana mostrar agora (ou null): domingo a partir das 18h a atual; segunda e terça a passada. */
function semanaDoResumo() {
  const agora = new Date();
  const dia = wIdx(today()); // 0 = segunda ... 6 = domingo
  let seg = null;
  if (dia === 6 && agora.getHours() >= 18) seg = mondayOf(today());
  else if (dia <= 1) seg = addDays(mondayOf(today()), -7);
  if (!seg || S.resumoVisto === seg) return null;
  return seg;
}

const seta = (agora, antes) => (agora > antes ? "sobe" : agora < antes ? "desce" : "igual");

function fraseDaSemana(n) {
  const pontos =
    (n.diasAgua >= 5 ? 1 : 0) +
    (n.estudo >= 120 ? 1 : 0) +
    (n.paginas >= 50 ? 1 : 0) +
    (n.habitosTotal && n.habitosFeitos / n.habitosTotal >= 0.6 ? 1 : 0) +
    (n.tarefas >= 7 ? 1 : 0);
  if (pontos >= 4) return { mood: "party", texto: "Que semana! Você mandou bem em quase tudo." };
  if (pontos >= 2) return { mood: "happy", texto: "Semana boa. Bora repetir o que funcionou." };
  if (n.agua + n.estudo + n.paginas + n.tarefas === 0)
    return { mood: "sleepy", texto: "Semana quietinha. Essa que vem é nossa." };
  return { mood: "happy", texto: "Cada passo conta. Semana que vem a gente sobe mais um." };
}

function resumoSemanaHTML(segForcada) {
  const seg = segForcada || semanaDoResumo();
  if (!seg) return "";
  const n = numerosDaSemana(seg);
  const a = numerosDaSemana(addDays(seg, -7));
  const f = fraseDaSemana(n);
  const item = (rotulo, valor, sub, dir) =>
    `<div class="rs-item"><span class="rs-rotulo">${rotulo}</span><b class="rs-valor">${valor}</b><span class="rs-sub ${dir || ""}">${sub}</span></div>`;
  const comp = (x, y, fmt) =>
    x === y ? "igual à anterior" : `${x > y ? "+" : "-"}${fmt(Math.abs(x - y))} que a anterior`;
  return `<section class="block resumo-semana" aria-label="Resumo da semana">
    <div class="rs-topo">${prumi({ mood: f.mood, fill: Math.min(1, waterToday() / S.waterGoal), size: 56 })}<div><h2 class="h2">${seg === mondayOf(today()) ? "Sua semana" : "Semana passada"}</h2><span class="note">${fmtShort(seg)} a ${fmtShort(n.fim)} · ${esc(f.texto)}</span></div></div>
    <div class="rs-grade">
      ${item("Água", `${n.diasAgua}/${n.dias} dias`, `meta batida · ${fmtML(n.agua)}`, seta(n.diasAgua, a.diasAgua))}
      ${item("Estudo", fmtMin(n.estudo), comp(n.estudo, a.estudo, fmtMin), seta(n.estudo, a.estudo))}
      ${item(
        "Leitura",
        `${n.paginas} pág.`,
        comp(n.paginas, a.paginas, x => x + " pág."),
        seta(n.paginas, a.paginas)
      )}
      ${item("Hábitos", n.habitosTotal ? `${Math.round((n.habitosFeitos / n.habitosTotal) * 100)}%` : "–", n.habitosTotal ? `${n.habitosFeitos} de ${n.habitosTotal} feitos` : "nenhum hábito ainda")}
      ${item("Tarefas", `${n.tarefas}`, "concluídas")}
      ${item("Melhor dia", n.melhor ? DIAS_LONGO_RS[wIdx(n.melhor)] : "–", n.melhor ? fmtShort(n.melhor) : "ainda vem")}
    </div>
    <div class="row rs-botoes"><button class="btn small primary" data-act="resumo-compartilhar" data-id="${seg}">Compartilhar</button><button class="btn small ghost" data-act="resumo-fechar" data-id="${seg}">Fechar</button></div>
  </section>`;
}
const DIAS_LONGO_RS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

ACOES_EXTRAS["resumo-fechar"] = (b, id) => {
  S.resumoVisto = id;
  commit();
};

/* ---------- imagem para compartilhar ---------- */
/** Copia o SVG do Prumi já desenhado na tela, com as cores calculadas por escrito (a imagem não lê o CSS). */
function svgComEstilos(el, attrs = {}) {
  const copia = el.cloneNode(true);
  const orig = [el, ...el.querySelectorAll("*")],
    novo = [copia, ...copia.querySelectorAll("*")];
  const props = [
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "opacity",
    "fill-opacity",
    "stroke-opacity",
    "display",
    "visibility"
  ];
  orig.forEach((o, i) => {
    const cs = getComputedStyle(o);
    const n = novo[i];
    n.removeAttribute("class");
    n.setAttribute("style", props.map(p => `${p}:${cs.getPropertyValue(p)}`).join(";"));
  });
  copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  for (const [k, v] of Object.entries(attrs)) copia.setAttribute(k, v);
  return new XMLSerializer().serializeToString(copia);
}

const escX = s =>
  String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function imagemDaSemana(seg) {
  const n = numerosDaSemana(seg),
    f = fraseDaSemana(n);
  const cs = getComputedStyle(document.documentElement);
  const cor = v => cs.getPropertyValue(v).trim() || "#222";
  const fundo = cor("--bg"),
    tinta = cor("--ink"),
    destaque = cor("--accent"),
    cartao = cor("--surface");
  const mascote = document.querySelector(".resumo-semana .rs-topo svg.prumi");
  const prumiSvg = mascote ? svgComEstilos(mascote, { x: 390, y: 200, width: 300, height: 384 }) : "";
  const blocos = [
    ["Água", `${n.diasAgua}/${n.dias} dias`, fmtML(n.agua)],
    ["Estudo", fmtMin(n.estudo), "de foco"],
    ["Leitura", `${n.paginas}`, "páginas"],
    ["Tarefas", `${n.tarefas}`, "concluídas"]
  ];
  const fonte = "font-family:'Bricolage Grotesque','Instrument Sans',system-ui,sans-serif";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <rect width="1080" height="1350" fill="${fundo}"/>
    <text x="540" y="110" text-anchor="middle" style="${fonte};font-size:56px;font-weight:800" fill="${tinta}">Minha semana no Prumo</text>
    <text x="540" y="160" text-anchor="middle" style="${fonte};font-size:30px" fill="${tinta}" opacity=".7">${escX(fmtShort(seg))} a ${escX(fmtShort(n.fim))}</text>
    ${prumiSvg}
    ${blocos
      .map(([r, v, s], i) => {
        const x = 80 + (i % 2) * 470,
          y = 620 + Math.floor(i / 2) * 250;
        return `<rect x="${x}" y="${y}" width="450" height="220" rx="36" fill="${cartao}"/>
        <text x="${x + 40}" y="${y + 66}" style="${fonte};font-size:30px" fill="${tinta}" opacity=".65">${escX(r)}</text>
        <text x="${x + 40}" y="${y + 140}" style="${fonte};font-size:64px;font-weight:800" fill="${destaque}">${escX(v)}</text>
        <text x="${x + 40}" y="${y + 186}" style="${fonte};font-size:28px" fill="${tinta}" opacity=".65">${escX(s)}</text>`;
      })
      .join("")}
    <text x="540" y="1180" text-anchor="middle" style="${fonte};font-size:34px" fill="${tinta}">${escX(f.texto)}</text>
    <text x="540" y="1270" text-anchor="middle" style="${fonte};font-size:26px" fill="${tinta}" opacity=".5">prumo-66d76.web.app</text>
  </svg>`;
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();
  const cv = document.createElement("canvas");
  cv.width = 1080;
  cv.height = 1350;
  cv.getContext("2d").drawImage(img, 0, 0);
  return new Promise(ok => cv.toBlob(ok, "image/png"));
}

ACOES_EXTRAS["resumo-compartilhar"] = async (b, id) => {
  b.disabled = true;
  try {
    const blob = await imagemDaSemana(id);
    const arquivo = new File([blob], `prumo-semana-${id}.png`, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      await navigator.share({ files: [arquivo], title: "Minha semana no Prumo" }).catch(() => {});
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = arquivo.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast("Imagem baixada. É só postar!");
    }
  } catch (e) {
    toast("Não consegui gerar a imagem agora.", false, "worried");
  }
  b.disabled = false;
};
