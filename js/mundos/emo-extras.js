/*
  Mundo Emo, parte 2:
  - Madrugada (meia-noite às 5h): o cartão escurece, o Prumi ganha olheiras e fala diferente;
  - Chuva no vidro: gotas escorrendo no cartão enquanto o cronômetro de foco roda (junto com o som de chuva);
  - Cartas pro futuro: você escreve e lacra; ela só abre na data escolhida;
  - Querido diário: todos os "Fechar o dia" num lugar só, com cadeado de PIN;
  - Mixtape montável: monte uma fita com músicas inventadas e mande para os amigos.
  Os dados ficam em S.emo (normalizados em js/estado.js).
  O cadeado é proteção contra curiosos no mesmo aparelho, não criptografia: os textos continuam na conta.
*/
"use strict";

const emoDados = () => S.emo || (S.emo = { cartas: [], cadeado: null, mixtape: { nome: "", faixas: [] } });

/* ===================== Madrugada ===================== */
const madrugada = () => new Date().getHours() < 5;
const FALAS_MADRUGADA = [
  "Madrugada de novo{nome}? Eu também não durmo, mas amanhã cobra.",
  "3 da manhã é hora de poesia ou de dormir. Escolhe um.",
  "Os vampiros tão orgulhosos. Mas bebe água e vai deitar.",
  "Se o sono não vem, escreve no diário. Ele guarda segredo.",
  "A cidade dorme e a gente aqui, acordados com a playlist triste.",
  "Até as estrelas tão bocejando{nome}. Desliga a tela, vai."
];

/* ===================== Chuva no vidro ===================== */
const deveChoverNoVidro = () =>
  S.persona === "emo" && typeof timer !== "undefined" && timer.running && !document.hidden;

/** Liga as classes do html (madrugada e chuva) conforme a hora e o cronômetro. */
function conferirClimaEmo() {
  const h = document.documentElement;
  h.classList.toggle("madrugada", S.persona === "emo" && madrugada());
  h.classList.toggle("chovendo", deveChoverNoVidro());
}
setInterval(conferirClimaEmo, 1500);
document.addEventListener("visibilitychange", conferirClimaEmo);

/** Gotas no vidro do cartão: posições fixas (o desenho não pula quando a tela redesenha). */
function vidroChuvaHTML() {
  let gotas = "";
  for (let i = 0; i < 18; i++) {
    const x = (i * 37 + 11) % 97,
      t = 3.2 + ((i * 0.83) % 2.6),
      d = (((i * 0.61) % 1) * t).toFixed(2),
      s = (6 + ((i * 7) % 6)).toFixed(0);
    gotas += `<i style="--x:${x}%;--d:${d}s;--t:${t.toFixed(2)}s;--s:${s}px"></i>`;
  }
  return `<div class="vidro-chuva" aria-hidden="true">${gotas}</div>`;
}

/* ===================== Cadeado do diário ===================== */
let diarioAbertoAte = 0; // fica destrancado por alguns minutos, só neste aparelho
let pedindoEsqueci = false;

/** Resumo do PIN com sal (não guarda o PIN em si). */
function resumoPin(pin, sal) {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  const s = sal + ":" + pin;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}
const pinValido = p => /^\d{4,6}$/.test(p);
const diarioTrancado = () => !!emoDados().cadeado && Date.now() > diarioAbertoAte;

const entradasDiario = () =>
  Object.entries(S.journal)
    .filter(([, j]) => j && (j.note || "").trim())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 60);

function diarioHTML() {
  const e = emoDados();
  const entradas = entradasDiario();
  let corpo;
  if (diarioTrancado()) {
    corpo = pedindoEsqueci
      ? `<p class="note">Sem o PIN dá para tirar o cadeado, porque ele é uma proteção contra curiosos neste aparelho, não um cofre. As páginas continuam todas aí.</p>
        <div class="row"><button class="btn danger ghost" data-act="diario-esqueci-sim">Tirar o cadeado</button><button class="btn ghost" data-act="diario-esqueci-nao">Voltar</button></div>`
      : `<div class="cadeado-fechado">${ICONE_CADEADO}<span>${entradas.length} ${entradas.length === 1 ? "página trancada" : "páginas trancadas"}</span></div>
        <form class="row" data-form="diario-abrir"><input id="diario-pin" type="password" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="PIN" aria-label="PIN do diário" style="width:110px" required><button class="btn primary" type="submit">Abrir</button></form>
        <button class="olink" data-act="diario-esqueci">Esqueci o PIN</button>`;
  } else {
    const paginas = entradas.length
      ? `<ol class="paginas">${entradas.map(([d, j]) => `<li><span class="pag-data">${fmtLong(d)}</span><p>${esc(j.note)}</p></li>`).join("")}</ol>`
      : `<span class="note">Nenhuma página ainda. Tudo o que você escreve em "${esc(textoMundo("diario", "Fechar o dia"))}" vem parar aqui.</span>`;
    const cadeado = e.cadeado
      ? `<div class="row"><button class="btn small ghost" data-act="diario-trancar">Trancar agora</button><button class="btn small ghost" data-act="diario-tirar">Tirar o cadeado</button></div>`
      : `<form class="col cadeado-novo" data-form="diario-cadeado"><span class="label">Pôr cadeado (PIN de 4 a 6 números)</span><div class="row"><input id="diario-pin1" type="password" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="PIN" aria-label="Novo PIN" style="width:100px" required><input id="diario-pin2" type="password" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="Repetir" aria-label="Repetir PIN" style="width:100px" required><button class="btn" type="submit">Trancar</button></div><span class="note">Protege contra curiosos neste aparelho. Não é um cofre: os textos continuam na sua conta.</span></form>`;
    corpo = paginas + cadeado;
  }
  return `<section class="block diario-emo"><details class="more" ${diarioAbertoAte > Date.now() || pedindoEsqueci ? "open" : ""}><summary>${ICONE_CADEADO}Querido diário <span class="count">${entradas.length}</span></summary>${corpo}</details></section>`;
}
const ICONE_CADEADO = `<svg class="cadeado" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="15.5" r="1.6" fill="var(--surface)"/></svg>`;

FORMS_EXTRAS["diario-abrir"] = () => {
  const pin = getV("diario-pin");
  const c = emoDados().cadeado;
  if (!c) return;
  if (resumoPin(pin, c.sal) !== c.resumo) {
    toast("PIN errado", false, "worried");
    return "diario-pin";
  }
  diarioAbertoAte = Date.now() + 5 * 60e3;
  react("happy", "Diário aberto. Fecha sozinho em 5 minutos.", 2600);
};
FORMS_EXTRAS["diario-cadeado"] = () => {
  const a = getV("diario-pin1"),
    b = getV("diario-pin2");
  if (!pinValido(a)) return toast("Use de 4 a 6 números", false, "worried");
  if (a !== b) return toast("Os dois PINs não são iguais", false, "worried");
  const sal = newId() + newId();
  emoDados().cadeado = { sal, resumo: resumoPin(a, sal), em: Date.now() };
  diarioAbertoAte = 0;
  react("happy", "Diário trancado. Só abre com o seu PIN.", 2600);
};
ACOES_EXTRAS["diario-trancar"] = () => {
  diarioAbertoAte = 0;
  render();
};
ACOES_EXTRAS["diario-tirar"] = () => {
  if (diarioTrancado()) return;
  emoDados().cadeado = null;
  toast("Cadeado tirado", false, "happy");
  commit();
};
ACOES_EXTRAS["diario-esqueci"] = () => {
  pedindoEsqueci = true;
  render();
};
ACOES_EXTRAS["diario-esqueci-nao"] = () => {
  pedindoEsqueci = false;
  render();
};
ACOES_EXTRAS["diario-esqueci-sim"] = () => {
  pedindoEsqueci = false;
  emoDados().cadeado = null;
  toast("Cadeado tirado. Pode pôr outro quando quiser.", false, "happy");
  commit();
};

/* ===================== Cartas pro futuro ===================== */
const PRAZOS_CARTA = [
  [7, "Daqui a 1 semana"],
  [30, "Daqui a 1 mês"],
  [90, "Daqui a 3 meses"],
  [365, "Daqui a 1 ano"]
];
let prazoCarta = 30;
const cartasQueChegaram = () => emoDados().cartas.filter(c => !c.aberta && c.abre <= today());

function cartasHTML() {
  const e = emoDados();
  const chegaram = cartasQueChegaram();
  const lacradas = e.cartas
    .filter(c => !c.aberta && c.abre > today())
    .sort((a, b) => (a.abre < b.abre ? -1 : 1));
  const abertas = e.cartas.filter(c => c.aberta).sort((a, b) => (a.abre < b.abre ? 1 : -1));
  const trancado = diarioTrancado();
  return `<section class="block cartas"><details class="more" ${chegaram.length ? "open" : ""}><summary>Cartas pro futuro ${chegaram.length ? `<span class="count novo">${chegaram.length} chegou</span>` : `<span class="count">${lacradas.length} lacradas</span>`}</summary>
    ${chegaram.map(c => `<div class="card carta-chegou"><b>Chegou uma carta do passado!</b><span class="note">Escrita por você em ${fmtLong(c.em)}.</span><button class="btn primary" data-act="carta-abrir" data-id="${esc(c.id)}">Abrir a carta</button></div>`).join("")}
    <form class="col" data-form="carta-nova">
      <textarea id="carta-txt" maxlength="2000" rows="4" placeholder="Querido eu do futuro..." required></textarea>
      <div class="row"><select id="carta-prazo" data-change="carta-prazo" aria-label="Quando a carta abre">${PRAZOS_CARTA.map(([d, l]) => `<option value="${d}" ${d === prazoCarta ? "selected" : ""}>${l}</option>`).join("")}</select><button class="btn" type="submit">Lacrar a carta</button></div>
      <span class="note">Depois de lacrada, nem você consegue ler antes da data.</span>
    </form>
    ${lacradas.length ? `<ul class="lacradas">${lacradas.map(c => `<li>${ICONE_CADEADO}<span>Abre em <b>${fmtLong(c.abre)}</b></span><small>escrita em ${fmtShort(c.em)}</small></li>`).join("")}</ul>` : ""}
    ${
      abertas.length
        ? trancado
          ? `<span class="note">${abertas.length} ${abertas.length === 1 ? "carta aberta" : "cartas abertas"} guardadas no diário trancado.</span>`
          : `<ol class="abertas">${abertas.map(c => `<li><span class="pag-data">Escrita em ${fmtLong(c.em)}, aberta em ${fmtShort(c.abertaEm || c.abre)}</span><p>${esc(c.texto)}</p><button class="olink" data-act="carta-apagar" data-id="${esc(c.id)}">Apagar</button></li>`).join("")}</ol>`
        : ""
    }</details></section>`;
}

MUDANCAS_EXTRAS["carta-prazo"] = el => {
  prazoCarta = +el.value || 30;
};
FORMS_EXTRAS["carta-nova"] = () => {
  const texto = getV("carta-txt").slice(0, 2000);
  if (!texto) return;
  const dias = PRAZOS_CARTA.some(([d]) => d === +getV("carta-prazo")) ? +getV("carta-prazo") : 30;
  emoDados().cartas.push({ id: newId(), texto, em: today(), abre: addDays(today(), dias), aberta: false });
  if (typeof somPagina === "function") somPagina();
  react(
    "happy",
    `Carta lacrada com cera vermelha. Ela abre em <b>${fmtLong(addDays(today(), dias))}</b>.`,
    3600
  );
};
ACOES_EXTRAS["carta-abrir"] = (b, id) => {
  const c = emoDados().cartas.find(x => x.id === id);
  if (!c || c.abre > today()) return;
  c.aberta = true;
  c.abertaEm = today();
  fx.big = true;
  react("party", "Uma carta sua, do passado. Lê com carinho.", 3600);
  commit();
};
ACOES_EXTRAS["carta-apagar"] = (b, id) => {
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para apagar";
    return;
  }
  const e = emoDados();
  e.cartas = e.cartas.filter(x => x.id !== id);
  commit();
};

/* ===================== Mixtape montável ===================== */
const MIX_QUEM = [
  "A chuva",
  "O delineador borrado",
  "Meu all star",
  "A última mensagem",
  "O quarto escuro",
  "A lua",
  "Seu casaco",
  "A fita K7",
  "O último ônibus",
  "Meu coração de papel",
  "A janela do quarto",
  "Nossa foto"
];
const MIX_FAZ = [
  "não volta mais",
  "às 3 da manhã",
  "em preto e branco",
  "sabe meu nome",
  "virou poesia",
  "ficou pra trás",
  "contra o mundo",
  "na janela",
  "(versão acústica)",
  "ainda dói",
  "e eu"
];
const MAX_FAIXAS = 10;
const nomeDeFaixa = () => `${pick(MIX_QUEM)} ${pick(MIX_FAZ)}`;
let mixAmigo = "";

function mixtapeHTML() {
  const m = emoDados().mixtape;
  const temConta = typeof modoFirebase === "function" && modoFirebase();
  const amigos = temConta && typeof amigosAceitos === "function" ? amigosAceitos() : [];
  const cheia = m.faixas.length >= MAX_FAIXAS;
  return `<section class="block mixtape-montar"><details class="more"><summary><svg class="k7" viewBox="-12 -8 24 16" width="30" height="20" aria-hidden="true">${fitaK7("#141416", "#C8102E").replace(/var\(--ink\)/g, "#141416")}</svg>Monte sua mixtape <span class="count">${m.faixas.length}/${MAX_FAIXAS}</span></summary>
    <label class="col"><span class="label">Nome da fita</span><input id="mix-nome" data-change="mix-nome" maxlength="40" value="${esc(m.nome)}" placeholder="Pra ouvir no ônibus"></label>
    ${m.faixas.length ? `<ol class="faixas montadas">${m.faixas.map((f, i) => `<li><span>${esc(f)}</span><button class="icon" data-act="mix-tirar" data-id="${i}" aria-label="Tirar ${esc(f)}">${ICON.x || "×"}</button></li>`).join("")}</ol>` : `<span class="note">Fita virgem. Grave músicas (inventadas valem!) e mande pra alguém.</span>`}
    ${cheia ? `<span class="note">Fita cheia: ${MAX_FAIXAS} faixas.</span>` : `<form class="row" data-form="mix-faixa"><input id="mix-faixa" maxlength="60" placeholder="Nome da música" style="flex:1" autocomplete="off" required><button class="btn" type="submit">Gravar</button></form><button class="btn small ghost" data-act="mix-inventar">Inventar uma música</button>`}
    ${
      m.faixas.length
        ? amigos.length
          ? `<div class="row mix-mandar"><select data-change="mix-amigo" aria-label="Para quem mandar"><option value="">Mandar para...</option>${amigos.map(a => `<option value="${esc(a.uid)}" ${a.uid === mixAmigo ? "selected" : ""}>${esc(nomeDe(a.uid))}</option>`).join("")}</select><button class="btn primary" data-act="mix-mandar">Mandar a fita</button></div><span class="note">Seus amigos também veem a fita no seu perfil.</span>`
          : `<span class="note">${temConta ? "Adicione amigos para mandar a fita." : "Entre com uma conta para mandar a fita para amigos."}</span>`
        : ""
    }
    ${m.faixas.length ? `<button class="olink" data-act="mix-limpar">Apagar a fita</button>` : ""}</details></section>`;
}

MUDANCAS_EXTRAS["mix-nome"] = el => {
  emoDados().mixtape.nome = el.value.trim().slice(0, 40);
  persist();
};
MUDANCAS_EXTRAS["mix-amigo"] = el => {
  mixAmigo = el.value;
};
FORMS_EXTRAS["mix-faixa"] = () => {
  const f = getV("mix-faixa").slice(0, 60);
  const m = emoDados().mixtape;
  if (!f || m.faixas.length >= MAX_FAIXAS) return;
  m.faixas.push(f);
  return "mix-faixa";
};
ACOES_EXTRAS["mix-inventar"] = () => {
  const m = emoDados().mixtape;
  if (m.faixas.length >= MAX_FAIXAS) return;
  let f = nomeDeFaixa();
  for (let i = 0; i < 6 && m.faixas.includes(f); i++) f = nomeDeFaixa();
  m.faixas.push(f);
  commit();
};
ACOES_EXTRAS["mix-tirar"] = (b, id) => {
  emoDados().mixtape.faixas.splice(+id, 1);
  commit();
};
ACOES_EXTRAS["mix-limpar"] = b => {
  if (!b.dataset.certeza) {
    b.dataset.certeza = "1";
    b.textContent = "Toque de novo para apagar a fita";
    return;
  }
  emoDados().mixtape = { nome: "", faixas: [] };
  commit();
};
ACOES_EXTRAS["mix-mandar"] = async () => {
  const m = emoDados().mixtape;
  if (!mixAmigo || !m.faixas.length) return toast("Escolha para quem mandar", false, "worried");
  const nome = m.nome || "Mixtape sem nome";
  const texto = [nome, ...m.faixas].join("\n").slice(0, 600);
  const ok = await mandarParaCaixa(mixAmigo, "mixtape", texto, {
    mixtape: { nome, faixas: m.faixas.slice(0, MAX_FAIXAS) }
  });
  if (ok) {
    react("party", `Fita mandada para <b>${esc(nomeDe(mixAmigo))}</b>. Aperta o play aí!`, 3200);
    mixAmigo = "";
    render();
  }
};

/* ===================== ganchos ===================== */
MUNDO_FX.emo.secaoHoje = () => {
  const chegaram = cartasQueChegaram();
  const e = emoDados();
  if (chegaram.length && e.avisoCarta !== today()) {
    e.avisoCarta = today();
    setTimeout(() => toast("Uma carta do passado chegou! Veja em Cartas pro futuro.", false, "party"), 800);
    persist();
  }
  return cartasHTML() + diarioHTML() + mixtapeHTML();
};

// Hoje esconde a nota do dia fechado enquanto o diário estiver trancado
MUNDO_FX.emo.diarioTrancado = diarioTrancado;

// Fala do Prumi na madrugada (js/mascote/falas.js chama ganchoMundo("contextoMascote"))
MUNDO_FX.emo.contextoMascote = () => {
  if (!madrugada()) return "";
  const msg = FALAS_MADRUGADA[new Date().getMinutes() % FALAS_MADRUGADA.length];
  return { mood: "idle", msg: msg.replace("{nome}", nome()) };
};

{
  // Olheiras na madrugada, por cima do que o mundo já desenha
  const camadasAntes = MUNDO_FX.emo.camadasPrumi;
  MUNDO_FX.emo.camadasPrumi = arg => {
    const c = camadasAntes ? camadasAntes(arg) : { fundo: "", rosto: "" };
    if (madrugada() && !["sleepy", "cry"].includes(arg.mood))
      c.rosto =
        `<g class="olheiras"><path d="M40 70.5Q47 74.5 54 70.5" fill="none" stroke="#6B4E8C" stroke-width="2.2" stroke-linecap="round" opacity=".6"/><path d="M66 70.5Q73 74.5 80 70.5" fill="none" stroke="#6B4E8C" stroke-width="2.2" stroke-linecap="round" opacity=".6"/></g>` +
        (c.rosto || "");
    return c;
  };
  // Vidro com chuva no cartão do Prumi
  const enfeiteAntes = MUNDO_FX.emo.enfeiteHero;
  MUNDO_FX.emo.enfeiteHero = () => {
    conferirClimaEmo();
    return (enfeiteAntes ? enfeiteAntes() : "") + vidroChuvaHTML();
  };
}
