/*
  Pets: bichinhos que você adota, cuida e que passeiam pelas páginas (o passeio fica em js/pets-passeio.js).
  Dados em S.pets = { lista: [pet], ativo, passeio, quieto, caminhada, ... } e cada pet:
    { id, especie, cor, nome, personalidade, adotado, comeuEm, carinhos: {dia: n}, cuidados: [dias], acess: {coleira, chapeu, roupa},
      truques: [], momentos: [{t, em, pose}], banho, soneca, diario: {dia: frase} }
  Nunca morre: se ficar sem cuidado, só fica tristinho.
  Tudo aparece na aba Prumi → Pet. O pet ativo também dorme na caminha do quarto e aparece no seu perfil pros amigos.
*/
"use strict";

const ESPECIES_PET = {
  gato: {
    nome: "Gatinho",
    cores: [
      ["laranja", "#FFB74D"],
      ["preto", "#37474F"],
      ["branco", "#FAFAFA"],
      ["cinza", "#9E9E9E"]
    ],
    som: "miau",
    sonho: "peixe",
    comida: "ração de peixe"
  },
  cachorro: {
    nome: "Cachorrinho",
    cores: [
      ["caramelo", "#D9963F"],
      ["chocolate", "#795548"],
      ["branco", "#F5F5F5"],
      ["preto", "#424242"]
    ],
    som: "au",
    sonho: "osso",
    comida: "petisco de carne"
  },
  coelho: {
    nome: "Coelhinho",
    cores: [
      ["branco", "#FAFAFA"],
      ["cinza", "#BDBDBD"],
      ["marrom", "#A1887F"]
    ],
    som: "nhac",
    sonho: "cenoura",
    comida: "cenoura"
  },
  hamster: {
    nome: "Hamster",
    cores: [
      ["dourado", "#FFCC80"],
      ["branco", "#FFF8E1"],
      ["cinza", "#B0BEC5"]
    ],
    som: "squik",
    sonho: "semente",
    comida: "sementinhas"
  },
  morcego: {
    nome: "Morceguinho",
    mundo: "emo",
    cores: [
      ["preto", "#263238"],
      ["roxo", "#5E35B1"]
    ],
    som: "squik",
    sonho: "lua",
    comida: "frutinhas"
  },
  papagaio: {
    nome: "Papagaio",
    mundo: "rock",
    cores: [
      ["verde", "#43A047"],
      ["azul", "#1E88E5"],
      ["vermelho", "#E53935"]
    ],
    som: "rá",
    sonho: "nota",
    comida: "sementes"
  },
  raposa: {
    nome: "Raposinha",
    cores: [
      ["laranja", "#FF8A65"],
      ["ártica", "#ECEFF1"]
    ],
    som: "yip",
    sonho: "estrela",
    comida: "frutinhas"
  },
  vaca: {
    nome: "Vaquinha",
    cores: [
      ["malhada", "#FAFAFA"],
      ["caramelo", "#C98B4B"],
      ["rosa", "#F8BBD0"]
    ],
    som: "muu",
    sonho: "capim",
    comida: "capim fresquinho",
    especial: {
      id: "sininho",
      nome: "Tocar o sininho",
      desc: "Ela dança no ritmo do sininho. Pasta pelo chão das páginas e toca o sino quando você conclui tarefa."
    }
  },
  boi: {
    nome: "Boizinho",
    cores: [
      ["marrom", "#8D5A3B"],
      ["preto", "#3E2723"],
      ["branco", "#EEE8E0"]
    ],
    som: "muuu",
    sonho: "capim",
    comida: "capim com milho",
    especial: {
      id: "bumba",
      nome: "Dança do boi-bumbá",
      desc: "Faz a festa do boi-bumbá com chuva vermelha e azul. Sai correndo pela tela quando você conclui tarefa."
    }
  },
  coala: {
    nome: "Coalinha",
    cores: [
      ["cinza", "#A7A9AC"],
      ["prateado", "#CFD8DC"],
      ["marrom", "#9C8A7A"]
    ],
    som: "grr",
    sonho: "folha",
    comida: "folhas de eucalipto",
    especial: {
      id: "abraco",
      nome: "Abraço apertado",
      desc: "Te dá um abraço na tela. Dorme o dobro e se pendura na lateral dos cards."
    }
  }
};
// cores raras: só na época (js/quarto-extras.js, EPOCAS)
const CORES_RARAS = [
  { id: "abobora", nome: "Abóbora", cor: "#FF6F00", epoca: "halloween" },
  { id: "neve", nome: "Neve", cor: "#E3F2FD", epoca: "natal" },
  { id: "solar", nome: "Solar", cor: "#FFD54F", epoca: "ferias" },
  { id: "fogueira", nome: "Fogueira", cor: "#D84315", epoca: "saojoao" }
];
const PERSONALIDADES_PET = {
  preguicoso: {
    nome: "Preguiçoso",
    desc: "Anda devagar e dorme muito.",
    vel: 0.55,
    sono: 0.45,
    curioso: 0.1
  },
  agitado: { nome: "Agitado", desc: "Corre pra todo lado e pula à toa.", vel: 1.6, sono: 0.08, curioso: 0.3 },
  curioso: {
    nome: "Curioso",
    desc: "Sobe nos cards pra ver tudo de perto.",
    vel: 1,
    sono: 0.15,
    curioso: 0.6
  },
  dramatico: {
    nome: "Dramático",
    desc: "Reage a tudo como se fosse novela.",
    vel: 1,
    sono: 0.2,
    curioso: 0.25
  }
};
const ACESSORIOS_PET = [
  { id: "coleira_vermelha", slot: "coleira", nome: "Coleira vermelha", preco: 30, cor: "#E53935" },
  { id: "coleira_azul", slot: "coleira", nome: "Coleira azul", preco: 30, cor: "#1E88E5" },
  {
    id: "coleira_mundo",
    slot: "coleira",
    nome: "Coleira com pingente do mundo",
    preco: 60,
    cor: "#212121",
    pingente: true
  },
  { id: "chapeu_bone", slot: "chapeu", nome: "Boné", preco: 40 },
  { id: "chapeu_laco", slot: "chapeu", nome: "Laço", preco: 40 },
  { id: "chapeu_coroa", slot: "chapeu", nome: "Coroa", preco: 90 },
  { id: "chapeu_festa", slot: "chapeu", nome: "Chapéu de festa", preco: 50 },
  { id: "roupa_moletom", slot: "roupa", nome: "Moletom", preco: 60 },
  { id: "roupa_capa", slot: "roupa", nome: "Capa de herói", preco: 80 },
  { id: "roupa_capa_chuva", slot: "roupa", nome: "Capa de chuva", preco: 60 }
];
const TRUQUES_PET = [
  { id: "sentar", nome: "Sentar", pose: "sentado" },
  { id: "pata", nome: "Dar a pata", pose: "pata", ach: "primeira" },
  { id: "pular", nome: "Pulo alto", pose: "pulando", ach: "hidratado" },
  { id: "rolar", nome: "Rolar", pose: "rolando", ach: "ritmo" },
  { id: "dancar", nome: "Dançar", pose: "dancando", ach: "dia_perfeito" },
  { id: "fingir", nome: "Fingir de morto", pose: "fingindo", ach: "foco10" },
  { id: "girar", nome: "Girar", pose: "girando", ach: "semana_agua" },
  { id: "acenar", nome: "Acenar", pose: "acenando", dias: 7 },
  { id: "cambalhota", nome: "Cambalhota", pose: "cambalhota", dias: 14 },
  { id: "bananeira", nome: "Plantar bananeira", pose: "bananeira", dias: 21 },
  { id: "posar", nome: "Fazer pose de foto", pose: "posando", dias: 30 }
];
const DESTINOS_CAMINHADA = [
  "Praça do bairro",
  "Praia",
  "Parque",
  "Feirinha",
  "Show na praça",
  "Montanha",
  "Lago",
  "Centro da cidade",
  "Sítio",
  "Mirante"
];
const PASSOS_SEMANA = 15;

/* ===================== dados ===================== */
function petsDados() {
  if (!S.pets || typeof S.pets !== "object" || Array.isArray(S.pets)) S.pets = {};
  const p = S.pets;
  if (!Array.isArray(p.lista)) p.lista = [];
  p.lista = p.lista.filter(x => x && ESPECIES_PET[x.especie]).slice(0, 3);
  p.lista.forEach(normalizarPet);
  if (!p.lista.some(x => x.id === p.ativo)) p.ativo = p.lista[0] ? p.lista[0].id : null;
  if (typeof p.passeio !== "boolean") p.passeio = true;
  if (!Array.isArray(p.donos)) p.donos = []; // acessórios comprados
  const seg = mondayOf(today());
  if (!p.caminhada || p.caminhada.semana !== seg)
    p.caminhada = {
      semana: seg,
      passos: 0,
      destino:
        (p.caminhada ? (p.caminhada.destino || 0) + (p.caminhada.chegou ? 1 : 0) : 0) %
        DESTINOS_CAMINHADA.length,
      chegou: false
    };
  return p;
}
function normalizarPet(x) {
  x.nome = String(x.nome || ESPECIES_PET[x.especie].nome).slice(0, 20);
  if (!PERSONALIDADES_PET[x.personalidade]) x.personalidade = "curioso";
  if (!x.adotado) x.adotado = today();
  if (typeof x.comeuEm !== "number") x.comeuEm = Date.now();
  if (!x.carinhos || typeof x.carinhos !== "object") x.carinhos = {};
  for (const k of Object.keys(x.carinhos)) if (k < addDays(today(), -10)) delete x.carinhos[k];
  if (!Array.isArray(x.cuidados)) x.cuidados = [];
  x.cuidados = x.cuidados.slice(-400);
  if (!x.acess || typeof x.acess !== "object") x.acess = {};
  if (!Array.isArray(x.truques)) x.truques = ["sentar"];
  if (!Array.isArray(x.momentos)) x.momentos = [];
  x.momentos = x.momentos.slice(-40);
  if (!x.diario || typeof x.diario !== "object") x.diario = {};
  for (const k of Object.keys(x.diario)) if (k < addDays(today(), -30)) delete x.diario[k];
}
const petAtivo = () => {
  const p = petsDados();
  return p.lista.find(x => x.id === p.ativo) || null;
};
const petPorId = id => petsDados().lista.find(x => x.id === id) || null;
const corDoPet = x =>
  (CORES_RARAS.find(c => c.id === x.cor) || {}).cor ||
  (ESPECIES_PET[x.especie].cores.find(c => c[0] === x.cor) || ESPECIES_PET[x.especie].cores[0])[1];

/** Fome de 0 (faminto) a 100 (cheio): cai 4 por hora. */
const fomePet = x => Math.max(0, Math.min(100, 100 - ((Date.now() - x.comeuEm) / 36e5) * 4));
const carinhoPet = x =>
  Math.min(100, ((x.carinhos[today()] || 0) + (x.carinhos[addDays(today(), -1)] || 0) / 2) * 20);
function humorPet(x) {
  const h = fomePet(x) * 0.5 + carinhoPet(x) * 0.3 + Math.min(100, feitasHojePet() * 25) * 0.2;
  return Math.round(h);
}
const feitasHojePet = () => S.tasks.filter(t => t.done && (t.feitaEm || t.date) === today()).length;
const tristinho = x => humorPet(x) < 30;
/** Fase de vida pela quantidade de dias de cuidado. */
function fasePet(x) {
  const n = new Set(x.cuidados).size;
  return n >= 15 ? "adulto" : n >= 5 ? "jovem" : "filhote";
}
const ESCALA_FASE = { filhote: 0.78, jovem: 0.9, adulto: 1 };
const dormindoAgora = () => {
  const h = new Date().getHours() * 60 + new Date().getMinutes();
  const dorme = hm2min(S.sleep || "23:00"),
    acorda = hm2min(S.wake || "07:00");
  return dorme > acorda ? h >= dorme || h < acorda : h >= dorme && h < acorda;
};

/** Truque liberado: pela conquista (ach) ou pelos dias de cuidado (dias). */
const truqueLivre = (x, t) =>
  (!t.ach || !!S.ach[t.ach]) && (!t.dias || new Set(x.cuidados || []).size >= t.dias);
function cuidou(x) {
  if (!x.cuidados.includes(today())) {
    const antes = fasePet(x);
    x.cuidados.push(today());
    // aprende truque sozinho com os dias de cuidado
    const n = new Set(x.cuidados).size;
    const novo = TRUQUES_PET.find(t => t.dias === n && !x.truques.includes(t.id));
    if (novo) {
      x.truques.push(novo.id);
      momentoPet(x, `Aprendeu sozinho: ${novo.nome.toLowerCase()}`, novo.pose);
      setTimeout(() => {
        notificar({
          titulo: `${x.nome} aprendeu um truque!`,
          texto: `${n} dias de cuidado e ${x.nome} aprendeu ${novo.nome.toLowerCase()} sozinho.`,
          tipo: "conquista",
          mood: "party"
        });
        if (typeof passeioReagir === "function") passeioReagir(x.id, novo.pose, 2200);
      }, 900);
    }
    const depois = fasePet(x);
    if (antes !== depois) {
      momentoPet(x, depois === "jovem" ? "Virou jovem" : "Virou adulto", "feliz");
      setTimeout(
        () =>
          notificar({
            titulo: `${x.nome} cresceu!`,
            texto: depois === "jovem" ? "Agora é um jovem cheio de energia." : "Agora é adulto. Que orgulho!",
            tipo: "conquista",
            mood: "party"
          }),
        600
      );
    }
  }
}
function momentoPet(x, t, pose = "feliz") {
  if (x.momentos.some(m => m.t === t && m.em === today())) return;
  x.momentos.push({ t, em: today(), pose });
}

/** Carinho vale gota: +1 por carinho, até 10 por dia (somando todos os pets). */
const GOTAS_CARINHO_DIA = 10;
function gotaDoCarinho(el) {
  const p = petsDados();
  if (!p.carinhoGotas || p.carinhoGotas.dia !== today()) p.carinhoGotas = { dia: today(), n: 0 };
  if (p.carinhoGotas.n >= GOTAS_CARINHO_DIA) return false;
  p.carinhoGotas.n++;
  earn(1, el);
  const n = document.getElementById("coinsn");
  if (n) n.textContent = S.coins;
  if (p.carinhoGotas.n === GOTAS_CARINHO_DIA)
    toast("Carinho de hoje já rendeu 10 gotas. Mas pode continuar, ele adora!");
  return true;
}
/** Um carinho completo (painel, passeio ou segurando o pet). */
function fazerCarinho(x, el, vezes = 1) {
  x.carinhos[today()] = (x.carinhos[today()] || 0) + vezes;
  cuidou(x);
  gotaDoCarinho(el);
  persist();
}

/* ===================== desenho ===================== */
/** Sprite do pet (de lado, olhando pra direita). pose: parado, andando, sentado, dormindo, pulando, comendo, feliz, triste... */
function petSVG(x, { pose = "parado", tam = 48, visitante = false } = {}) {
  const e = x.especie,
    c = corDoPet(x),
    escuro = "rgba(0,0,0,.22)",
    tinta = 'stroke="var(--ink, #222)" stroke-width="1.1"';
  const dorme = pose === "dormindo" || pose === "fingindo";
  const olho = dorme
    ? `<path d="M35 16q2 1.6 4 0" stroke="#212121" stroke-width="1" fill="none"/>`
    : `<g class="olho"><circle cx="37" cy="15.5" r="1.5" fill="#212121"/><circle cx="37.5" cy="15" r=".5" fill="#fff"/></g>`;
  let orelhas = "",
    cauda = "",
    extra = "",
    corpo = `<ellipse cx="22" cy="26" rx="13" ry="8.6" fill="${c}" ${tinta}/>`,
    cabeca = `<circle cx="34" cy="17" r="8.4" fill="${c}" ${tinta}/>`;
  if (e === "gato") {
    orelhas = `<path d="M28 12l1-7l5 4zM36 10l4-5l1 7z" fill="${c}" ${tinta}/>`;
    cauda = `<path class="cauda" d="M10 24q-8-2-6-12" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    extra = `<path d="M41 19l4-1M41 20.5l4 1" stroke="#9E9E9E" stroke-width=".6"/>`;
  } else if (e === "cachorro") {
    orelhas = `<ellipse cx="29" cy="15" rx="3" ry="6" fill="${escuro}" transform="rotate(20 29 15)"/><ellipse cx="29" cy="15" rx="3" ry="6" fill="${c}" ${tinta} transform="rotate(20 29 15)"/>`;
    cauda = `<path class="cauda" d="M9 22q-5-4-3-9" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    extra = `<ellipse cx="41.5" cy="18.5" rx="2" ry="1.5" fill="#212121"/>`;
  } else if (e === "coelho") {
    orelhas = `<ellipse cx="31" cy="4" rx="2.6" ry="8" fill="${c}" ${tinta} transform="rotate(-12 31 4)"/><ellipse cx="36" cy="4" rx="2.6" ry="8" fill="${c}" ${tinta} transform="rotate(10 36 4)"/><ellipse cx="36" cy="4" rx="1.1" ry="5.4" fill="#F8BBD0" transform="rotate(10 36 4)"/>`;
    cauda = `<circle class="cauda" cx="9" cy="24" r="3.4" fill="#FAFAFA" ${tinta}/>`;
  } else if (e === "hamster") {
    corpo = `<ellipse cx="24" cy="26" rx="14" ry="10" fill="${c}" ${tinta}/>`;
    cabeca = `<circle cx="33" cy="19" r="8" fill="${c}" ${tinta}/>`;
    orelhas = `<circle cx="29" cy="11.5" r="2.6" fill="#F8BBD0" ${tinta}/>`;
    extra = `<ellipse cx="36" cy="21" rx="3.4" ry="2.6" fill="#FFF8E1"/>`;
  } else if (e === "morcego") {
    corpo = `<ellipse cx="24" cy="22" rx="9" ry="8" fill="${c}" ${tinta}/>`;
    cabeca = `<circle cx="32" cy="15" r="7" fill="${c}" ${tinta}/>`;
    orelhas = `<path d="M27 10l0-7l4 5zM34 9l3-6l1 7z" fill="${c}" ${tinta}/>`;
    extra = `<path class="asa" d="M18 20Q8 10 2 18Q6 20 6 24Q10 22 12 26Q14 22 18 24Z" fill="${c}" ${tinta}/><path d="M35 19l1 2l1-2" fill="#fff"/>`;
  } else if (e === "papagaio") {
    corpo = `<ellipse cx="24" cy="24" rx="9" ry="11" fill="${c}" ${tinta} transform="rotate(-20 24 24)"/>`;
    cabeca = `<circle cx="31" cy="13" r="7" fill="${c}" ${tinta}/>`;
    orelhas = `<path d="M28 7q-2-6 3-6q-1 4 2 5" fill="#FDD835" ${tinta}/>`;
    extra = `<path d="M37 12q5 1 3 6q-2-2-4-1z" fill="#FFB300" ${tinta}/><path class="asa" d="M18 20q8 2 10 10q-8 0-10-10z" fill="${escuro}"/>`;
    cauda = `<path class="cauda" d="M17 32l-8 8M19 33l-5 9" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (e === "raposa") {
    orelhas = `<path d="M27 12l1-9l6 6zM35 10l5-7l1 9z" fill="${c}" ${tinta}/>`;
    cauda = `<path class="cauda" d="M10 26q-12 0-8-14q6 4 10 10z" fill="${c}" ${tinta}/><path d="M3 13q2 2 4 2" stroke="#FAFAFA" stroke-width="3" stroke-linecap="round"/>`;
    extra = `<path d="M37 21q4 1 6-3q-2 4-6 3z" fill="#FAFAFA"/><circle cx="42.5" cy="18" r="1.2" fill="#212121"/>`;
  } else if (e === "vaca" || e === "boi") {
    const boi = e === "boi";
    const mancha = boi
      ? "rgba(0,0,0,.18)"
      : x.cor === "caramelo"
        ? "#FAFAFA"
        : x.cor === "rosa"
          ? "#A1887F"
          : "#37474F";
    corpo = `<ellipse cx="22" cy="25.5" rx="14.5" ry="9.4" fill="${c}" ${tinta}/>${
      boi
        ? `<ellipse cx="25" cy="17.6" rx="6" ry="3.6" fill="${c}" ${tinta}/><path d="M20 19.5q5 2 10 0" stroke="${c}" stroke-width="2.4"/>`
        : `<ellipse cx="16" cy="23" rx="4.6" ry="3.4" fill="${mancha}"/><ellipse cx="26" cy="28" rx="3.6" ry="2.6" fill="${mancha}"/><ellipse cx="11.5" cy="28.5" rx="2.2" ry="1.8" fill="${mancha}"/><ellipse cx="20" cy="33.4" rx="3" ry="1.8" fill="#F48FB1" ${tinta}/>`
    }`;
    cabeca = `<ellipse cx="34.5" cy="16.5" rx="7.4" ry="8" fill="${c}" ${tinta}/>${boi ? `<path d="M31 10q4-2 7 0l-1 4q-2.6-1-5 0z" fill="rgba(0,0,0,.14)"/>` : ""}`;
    orelhas = `<ellipse cx="27.6" cy="13" rx="3.6" ry="1.8" fill="${c}" ${tinta} transform="rotate(-24 27.6 13)"/>${
      boi
        ? `<path d="M30 10q-5-1-6-7M38.5 9q3-3 2-8" stroke="#EFE6D2" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M24.4 3.4l-.6-1.4M40.6 1.4l.2-1.4" stroke="#5D4037" stroke-width="2.4" stroke-linecap="round"/>`
        : `<path d="M30.6 9.6q-1-3 .6-4.4M37.6 9q1.6-2.6 .2-4.2" stroke="#EFE6D2" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    }`;
    cauda = `<path class="cauda" d="M8 22q-4 3-3 10" stroke="${c}" stroke-width="1.6" fill="none"/><ellipse class="cauda" cx="5" cy="32.5" rx="1.6" ry="2.4" fill="${boi ? "#3E2723" : mancha}"/>`;
    extra = `<ellipse cx="40" cy="20.6" rx="4.8" ry="3.4" fill="#F8BBD0" ${tinta}/><circle cx="39" cy="20" r=".7" fill="#AD1457"/><circle cx="42" cy="20" r=".7" fill="#AD1457"/>${
      boi
        ? `<circle cx="40.6" cy="23.4" r="1.7" fill="none" stroke="#FFC107" stroke-width=".9"/>`
        : x.acess.coleira
          ? ""
          : `<path d="M29 22.6q4 2.6 8 0" stroke="#8D6E63" stroke-width="1.4" fill="none"/><path class="sino" d="M31.6 24h2.8l.6 3h-4z" fill="#FFC107" stroke="#B7892B" stroke-width=".5"/>`
    }`;
  } else if (e === "coala") {
    corpo = `<ellipse cx="22" cy="26" rx="12" ry="9" fill="${c}" ${tinta}/><ellipse cx="25" cy="28" rx="6" ry="5" fill="#ECEFF1" opacity=".75"/>`;
    cabeca = `<circle cx="33" cy="16.5" r="9.4" fill="${c}" ${tinta}/>`;
    orelhas = `<circle cx="25.4" cy="9.6" r="5.2" fill="${c}" ${tinta}/><circle cx="25.4" cy="9.6" r="3" fill="#ECEFF1"/><circle cx="39.6" cy="8" r="4.6" fill="${c}" ${tinta}/><circle cx="39.6" cy="8" r="2.6" fill="#ECEFF1"/>`;
    extra = `<ellipse cx="41.4" cy="18.6" rx="2.6" ry="3.4" fill="#37474F"/><ellipse cx="40.8" cy="17.4" rx=".8" ry="1" fill="#90A4AE"/>`;
  }
  const passaro = e === "papagaio" || e === "morcego";
  const pernas = passaro
    ? `<path class="perna p1" d="M22 31v6M26 31v6" stroke="#FFB300" stroke-width="1.6"/>`
    : [12, 17, 26, 31]
        .map(
          (px, i) =>
            `<rect class="perna p${i + 1}" x="${px}" y="31" width="4" height="7" rx="2" fill="${c}" ${tinta}/>`
        )
        .join("");
  const bochecha = `<circle cx="34" cy="20" r="1.6" fill="#F48FB1" opacity=".55"/>`;
  const boca =
    pose === "triste"
      ? `<path d="M38 21q1.4-1.4 3 0" stroke="#212121" stroke-width=".8" fill="none"/>`
      : pose === "comendo" || pose === "pastando"
        ? `<ellipse cx="39.5" cy="21" rx="1.6" ry="1.2" fill="#C62828"/>`
        : pose === "bocejando"
          ? `<ellipse cx="39.6" cy="21.4" rx="1.8" ry="2.4" fill="#5D1F1F"/><ellipse cx="39.6" cy="22.6" rx="1" ry=".8" fill="#F06292"/>`
          : `<path d="M38 20.5q1.4 1.4 3 0" stroke="#212121" stroke-width=".8" fill="none"/>`;
  const acess = acessoriosSVG(x);
  const zz =
    pose === "dormindo"
      ? `<g class="zz"><text x="40" y="6" font-size="6" fill="var(--ink, #222)" font-weight="700">z</text><text x="44" y="1" font-size="8" fill="var(--ink, #222)" font-weight="700">Z</text></g>`
      : "";
  const objeto =
    pose === "lendo"
      ? `<path d="M36 26l6-2 6 2v7l-6-2-6 2z" fill="#FFF8E1" stroke="var(--ink, #222)" stroke-width=".7"/><path d="M42 24v7" stroke="#BCAAA4" stroke-width=".6"/>`
      : pose === "banho"
        ? [
            [10, 10],
            [20, 6],
            [30, 2],
            [16, 16],
            [40, 8]
          ]
            .map(
              ([bx, by], i) =>
                `<circle class="bolha" style="animation-delay:${i * 0.2}s" cx="${bx}" cy="${by}" r="${2 + (i % 3)}" fill="#E1F5FE" stroke="#81D4FA" stroke-width=".6"/>`
            )
            .join("")
        : pose === "festa"
          ? `<path d="M30 9l4-11l4 11z" fill="#E91E63" stroke="var(--ink, #222)" stroke-width=".6"/><circle cx="34" cy="-2" r="1.6" fill="#FFD54F"/>`
          : pose === "batendo"
            ? `<path d="M44 20l5-3M44 24l6 0M44 28l5 3" stroke="var(--ink, #222)" stroke-width="1" stroke-linecap="round"/>`
            : pose === "pastando"
              ? `<path class="capim" d="M42 39l-1-7M44 39l1-8M46 39l2-6M40 39l-2-5" stroke="#43A047" stroke-width="1.4" stroke-linecap="round"/>`
              : pose === "correndo"
                ? `<g class="poeira"><circle cx="4" cy="36" r="2.6" fill="#BCAAA4" opacity=".6"/><circle cx="-1" cy="33" r="1.8" fill="#BCAAA4" opacity=".45"/></g>`
                : pose === "sininho"
                  ? `<path class="nota-pet" d="M44 4v6a1.8 1.5 0 1 1-1-1.4V4h3v1.8h-2z" fill="var(--ink, #222)"/><path class="nota-pet n2" d="M2 8v5a1.6 1.3 0 1 1-1-1.2V8h2.6v1.6H2z" fill="var(--ink, #222)"/>`
                  : pose === "bocejando"
                    ? `<text x="44" y="8" font-size="6" fill="var(--ink, #222)" font-weight="700" class="zz">a</text>`
                    : pose === "abracando"
                      ? `<ellipse cx="40" cy="27" rx="3" ry="2.2" fill="${c}" ${tinta}/><ellipse cx="36" cy="29" rx="3" ry="2.2" fill="${c}" ${tinta}/>`
                      : "";
  const coracao =
    pose === "feliz" || pose === "abracando" || pose === "ronronando"
      ? `<path class="coracao-pet" d="M40 4q-3-4-5 0q-2 3 5 7q7-4 5-7q-2-4-5 0z" fill="#E91E63"/>`
      : "";
  const placa = visitante
    ? `<rect x="10" y="-2" width="28" height="7" rx="2" fill="#FFF8E1" stroke="#8D6E63" stroke-width=".6"/><text x="24" y="3.4" text-anchor="middle" font-size="4.4" fill="#5D4037">visita</text>`
    : "";
  const escala = ESCALA_FASE[fasePet(x)] || 1;
  return `<svg class="pet-svg pose-${pose} pers-${x.personalidade}" viewBox="-4 -8 54 50" width="${tam}" height="${Math.round((tam * 50) / 54)}" aria-hidden="true"><g transform="translate(24 38) scale(${escala}) translate(-24 -38)"><g class="pet-corpo">${cauda}${pernas}${corpo}${x.acess.roupa ? roupaPetSVG(x.acess.roupa) : ""}${orelhas}${cabeca}${extra}${olho}${bochecha}${boca}${acess}${estiloMundoPet(x)}</g>${zz}${coracao}${objeto}</g>${placa}</svg>`;
}

function acessoriosSVG(x) {
  let s = "";
  const col = ACESSORIOS_PET.find(a => a.id === x.acess.coleira);
  if (col) {
    s += `<path d="M28 22q4 3 9 0" stroke="${col.cor}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    s += col.pingente ? pingenteMundo(32.5, 25.6) : `<circle cx="32.5" cy="25" r="1.4" fill="#FFD54F"/>`;
  }
  const ch = x.acess.chapeu;
  if (ch === "chapeu_bone")
    s += `<path d="M28 10q6-6 12 0z" fill="#1E88E5" stroke="var(--ink, #222)" stroke-width=".8"/><path d="M38 9.5l6 1" stroke="#1565C0" stroke-width="2" stroke-linecap="round"/>`;
  if (ch === "chapeu_laco")
    s += `<path d="M33 8l-5-3v6zM33 8l5-3v6z" fill="#E91E63" stroke="var(--ink, #222)" stroke-width=".6"/><circle cx="33" cy="8" r="1.4" fill="#C2185B"/>`;
  if (ch === "chapeu_coroa")
    s += `<path d="M28 9V3l3 3l3-4l3 4l3-3v6z" fill="#FFD54F" stroke="#B7892B" stroke-width=".6"/>`;
  if (ch === "chapeu_festa")
    s += `<path d="M30 9l4-11l4 11z" fill="#7E57C2" stroke="var(--ink, #222)" stroke-width=".6"/><circle cx="34" cy="-2" r="1.6" fill="#FFD54F"/><path d="M31 6h6M32 3h4" stroke="#FFD54F" stroke-width=".8"/>`;
  return s;
}
function roupaPetSVG(id) {
  if (id === "roupa_moletom")
    return `<path d="M13 21q9-5 19 0v10q-10 3-19 0z" fill="#7E57C2" opacity=".92"/><path d="M14 25h17" stroke="#5E35B1"/>`;
  if (id === "roupa_capa") return `<path d="M28 21q-14-2-22 10q12 2 22-4z" fill="#E53935"/>`;
  if (id === "roupa_capa_chuva")
    return `<path d="M12 22q10-8 20 0v8q-10 3-20 0z" fill="#FDD835" opacity=".95"/><circle cx="20" cy="26" r=".8" fill="#F9A825"/><circle cx="25" cy="26" r=".8" fill="#F9A825"/>`;
  return "";
}
/** Pingente da coleira no formato do mundo atual. */
function pingenteMundo(x, y) {
  const f = {
    emo: `<path d="M${x} ${y}q1.4-1.6 2.6-.4q2-1.6 3 .6q-2 .6-2 2q-1.6-1-3.6 0q0-1.4-2-2q1-2.2 3-.6z" fill="#212121"/>`,
    rock: `<path d="M${x - 2} ${y - 1}q2-1 4 0q0 3-2 4.6q-2-1.6-2-4.6z" fill="#E53935"/>`,
    gamer: `<rect x="${x - 2}" y="${y - 1}" width="4" height="4" fill="#00E5FF"/>`,
    zen: `<circle cx="${x}" cy="${y + 1}" r="2" fill="none" stroke="#81C784" stroke-width="1"/>`,
    sertanejo: `<path d="M${x - 2} ${y - 1}q0 4 2 4q2 0 2-4" stroke="#9E9E9E" stroke-width="1" fill="none"/>`
  }[S.persona];
  return (
    f || `<path d="M${x} ${y + 3}q-3-2-2.4-3.6q1-1.6 2.4 0q1.4-1.6 2.4 0q.6 1.6-2.4 3.6z" fill="#E91E63"/>`
  );
}
/** Um toque do mundo quando o pet está sem chapéu (franjinha no emo, bandana no rock...). */
function estiloMundoPet(x) {
  if (x.acess.chapeu) return "";
  if (typeof fantasiaPetSVG === "function") {
    const f = fantasiaPetSVG(x);
    if (f) return f; // fantasia da época no lugar do toque do mundo
  }
  return (
    {
      emo: `<path d="M29 10q8-2 12 5q-6-2-9 1q-1-3-3-6z" fill="#212121"/>`,
      rock: `<path d="M27 11q7-4 14 0l-1 2.4q-6-3-12 0z" fill="#E53935"/>`,
      gamer: `<path d="M27 15q7-12 14 0" stroke="#212121" stroke-width="1.4" fill="none"/><rect x="25.5" y="13" width="3" height="5" rx="1" fill="#7C4DFF"/>`,
      zen: `<circle cx="29" cy="9" r="2" fill="#F48FB1"/><circle cx="29" cy="9" r=".8" fill="#FFF59D"/>`,
      otaku: `<path d="M30 9l-3-2v4zM30 9l3-2v4z" fill="#F06292"/>`,
      programador: `<path d="M27 15q7-12 14 0" stroke="#37474F" stroke-width="1.4" fill="none"/>`,
      sertanejo: `<path d="M27 11q7-6 14 0z" fill="#9C6A35"/><path d="M24 11.5h20" stroke="#9C6A35" stroke-width="1.6" stroke-linecap="round"/>`,
      feiticeiro: `<path d="M27 11q7 -3 14 0q-4 -1 -6 -9q-4 5 -8 9z" fill="#283593"/><path d="M33 3l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#FFE082"/>`,
      bruxo: `<path d="M26 11.5q8 -3 16 0q-5 -1 -6 -6q-1 -5 4 -6q-8 -1 -10 6q-1 4 -4 6z" fill="#2E1A47"/><path d="M28 10.6q6 -2 12 0" stroke="#7CB342" stroke-width="1.2"/>`
    }[S.persona] || ""
  );
}

/* ===================== diário do pet ===================== */
function fraseDoDiario(x) {
  const agua = waterToday() >= S.waterGoal,
    feitas = feitasHojePet(),
    fome = fomePet(x) < 30;
  const nome = S.name || "meu humano";
  if (fome)
    return `Querido diário: ${nome} esqueceu do meu ${ESPECIES_PET[x.especie].comida}. Vou fazer drama até alguém perceber.`;
  if (feitas >= 5)
    return `Querido diário: ${nome} fez ${feitas} tarefas hoje! Eu ajudei supervisionando do sofá.`;
  if (agua) return `Querido diário: ${nome} bebeu toda a água hoje. Eu também bebi a minha, claro.`;
  if (feitas)
    return `Querido diário: ${nome} concluiu ${feitas} ${feitas === 1 ? "coisa" : "coisas"} hoje. Ganhei ${x.carinhos[today()] || 0} carinhos.`;
  return `Querido diário: hoje foi um dia calmo. Fiquei olhando ${nome} e pensando na vida.`;
}

/* ===================== som do pet ===================== */
function somDoPet(x, vol = 1) {
  if (!S.notif.som || document.hidden || typeof pegarAudio !== "function") return;
  const ctx = pegarAudio();
  if (!ctx) return;
  const t = ctx.currentTime + 0.02,
    s = ctx.createGain();
  s.gain.value = 0.12 * vol;
  s.connect(ctx.destination);
  const o = ctx.createOscillator();
  o.type = "sine";
  const tipo = ESPECIES_PET[x.especie].som;
  const curvas = {
    miau: [
      [700, 0],
      [950, 0.12],
      [620, 0.38]
    ],
    au: [
      [420, 0],
      [300, 0.12]
    ],
    squik: [
      [1800, 0],
      [2400, 0.06],
      [1700, 0.12]
    ],
    nhac: [
      [300, 0],
      [260, 0.08]
    ],
    rá: [
      [900, 0],
      [1300, 0.08],
      [700, 0.22]
    ],
    yip: [
      [1100, 0],
      [1500, 0.06],
      [900, 0.14]
    ],
    muu: [
      [210, 0],
      [250, 0.18],
      [170, 0.7]
    ],
    muuu: [
      [140, 0],
      [165, 0.22],
      [110, 0.9]
    ],
    grr: [
      [130, 0],
      [190, 0.1],
      [120, 0.32]
    ]
  }[tipo] || [[600, 0]];
  // bichos grandes: som mais grave e encorpado (dente de serra com filtro)
  if (tipo === "muu" || tipo === "muuu" || tipo === "grr") {
    o.type = "sawtooth";
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = tipo === "grr" ? 500 : 750;
    f.connect(s);
    o.saidaFiltro = f;
  }
  curvas.forEach(([f, dt], i) =>
    i ? o.frequency.exponentialRampToValueAtTime(f, t + dt) : o.frequency.setValueAtTime(f, t)
  );
  const g = ctx.createGain();
  const fim = t + curvas[curvas.length - 1][1] + 0.12;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(1, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, fim);
  o.connect(g).connect(o.saidaFiltro || s);
  o.start(t);
  o.stop(fim + 0.05);
}

/* ===================== painel (aba Prumi → Pet) ===================== */
let adocao = { especie: "gato", cor: "", nome: "", personalidade: "curioso" };
let petSel = null; // pet aberto no painel

function petPainelHTML() {
  const p = petsDados();
  if (!p.lista.length || petSel === "adotar") return adocaoHTML();
  const x = petPorId(petSel) || petAtivo();
  petSel = x.id;
  x.diario[today()] = fraseDoDiario(x);
  const fome = Math.round(fomePet(x)),
    humor = humorPet(x),
    fase = fasePet(x);
  const pose = dormindoAgora() ? "dormindo" : tristinho(x) ? "triste" : humor > 70 ? "feliz" : "parado";
  const c = p.caminhada;
  const barra = (rot, v, cor) =>
    `<div class="pet-barra"><span>${rot}</span><div class="cm-barra"><span style="width:${v}%;background:${cor}"></span></div></div>`;
  const truques = TRUQUES_PET.map(t => {
    const livre = truqueLivre(x, t);
    const dica = t.dias
      ? `Aprende sozinho com ${t.dias} dias de cuidado`
      : "Libera com a conquista " + esc((ACH[t.ach] || {}).name || "");
    return `<button class="chip-bt" data-act="pet-truque" data-id="${t.id}" ${livre ? "" : "disabled"} title="${livre ? "" : dica}">${livre ? "" : ICON.lock + " "}${t.nome}${!livre && t.dias ? ` <small>${t.dias}d</small>` : ""}</button>`;
  }).join("");
  const diasC = new Set(x.cuidados).size;
  const prox = TRUQUES_PET.filter(t => t.dias && t.dias > diasC).sort((a, b) => a.dias - b.dias)[0];
  const prova =
    acessPrevia && acessPrevia.pet === x.id ? ACESSORIOS_PET.find(a => a.id === acessPrevia.id) : null;
  const loja = ["coleira", "chapeu", "roupa"]
    .map(slot => {
      const itens = ACESSORIOS_PET.filter(a => a.slot === slot)
        .map(a => {
          const tem = p.donos.includes(a.id),
            usando = x.acess[slot] === a.id,
            provando = prova && prova.id === a.id;
          return `<button class="chip-bt ${provando ? "provando" : ""}" data-act="pet-acess" data-id="${a.id}" aria-pressed="${usando || provando}">${esc(a.nome)}${tem ? (usando ? " ✓" : "") : ` · ${a.preco} gotas`}</button>`;
        })
        .join("");
      const comprar =
        prova && prova.slot === slot
          ? `<div class="pet-comprar">${petSVG({ ...x, acess: { ...x.acess, [prova.slot]: prova.id } }, { pose: "feliz", tam: 46 })}<span>Provando <b>${esc(prova.nome)}</b></span><button class="btn small ghost" data-act="pet-acess-desistir">Tirar</button><button class="btn small primary" data-act="pet-acess-comprar" data-id="${prova.id}" ${S.coins < prova.preco ? "disabled" : ""}>${S.coins < prova.preco ? `Faltam ${prova.preco - S.coins} gotas` : `Comprar por ${prova.preco}`}</button></div>`
          : "";
      return `<div class="pet-loja-linha"><b>${{ coleira: "Coleira", chapeu: "Chapéu", roupa: "Roupinha" }[slot]}</b><div class="row">${itens}${x.acess[slot] ? `<button class="chip-bt" data-act="pet-tirar" data-id="${slot}">Tirar</button>` : ""}</div>${comprar}</div>`;
    })
    .join("");
  const visto = prova ? { ...x, acess: { ...x.acess, [prova.slot]: prova.id } } : x;
  const esp = ESPECIES_PET[x.especie].especial;
  const momentos = x.momentos
    .slice()
    .reverse()
    .slice(0, 8)
    .map(
      m =>
        `<figure>${petSVG(x, { pose: m.pose, tam: 46 })}<figcaption>${esc(m.t)}<small>${fmtShort(m.em)}</small></figure>`
    )
    .join("");
  return `<div class="pet-painel">
    ${p.lista.length > 1 ? `<div class="row pet-abas">${p.lista.map(y => `<button class="chip-bt" data-act="pet-abrir" data-id="${y.id}" aria-pressed="${y.id === x.id}">${esc(y.nome)}</button>`).join("")}</div>` : ""}
    <div class="pet-palco"><button class="pet-grande" data-act="pet-carinho" aria-label="Fazer carinho em ${esc(x.nome)}">${petSVG(visto, { pose, tam: 150 })}</button>
      <div class="pet-info"><b class="pet-nome">${esc(x.nome)}</b><span class="note">${ESPECIES_PET[x.especie].nome} ${fase} · ${PERSONALIDADES_PET[x.personalidade].nome.toLowerCase()} · ${diffDays(x.adotado, today())} dias com você</span>
      ${barra("Barriga", fome, fome < 30 ? "var(--danger)" : "#FFB300")}${barra("Felicidade", humor, "#E91E63")}
      ${tristinho(x) ? `<span class="note">${esc(x.nome)} tá tristinho. Um carinho e comida resolvem.</span>` : dormindoAgora() ? `<span class="note">Shhh, ${esc(x.nome)} tá dormindo. Sonhando com ${ESPECIES_PET[x.especie].sonho}.</span>` : ""}
      </div></div>
    <div class="cm-botoes"><button class="btn small primary" data-act="pet-comida">Dar comida (5 gotas)</button><button class="btn small" data-act="pet-carinho">Carinho</button><button class="btn small" data-act="pet-bolinha">Jogar bolinha</button><button class="btn small" data-act="pet-petisco">Petisco especial (15)</button>
      <button class="btn small ghost" data-act="pet-banho" ${x.banho === today() ? "disabled" : ""}>${x.banho === today() ? "Banho tomado" : "Dar banho (+2)"}</button><button class="btn small ghost" data-act="pet-soneca" ${x.soneca === today() ? "disabled" : ""}>${x.soneca === today() ? "Soneca feita" : "Soneca (+2)"}</button>
      <button class="btn small ghost" data-act="pet-esconde" ${p.esconde && p.esconde.dia === today() ? "disabled" : ""}>Esconde-esconde</button></div>
    <span class="note">Carinho vale gota: +1 por carinho, até ${GOTAS_CARINHO_DIA} por dia (hoje: ${p.carinhoGotas && p.carinhoGotas.dia === today() ? p.carinhoGotas.n : 0}). Segure o pet pra ele ronronar e arraste pra levar pra onde quiser.</span>
    ${esp ? `<div class="pet-especial"><div><b>Só ${ESPECIES_PET[x.especie].nome.toLowerCase()} faz</b><span class="note">${esc(esp.desc)}</span></div><button class="btn small primary" data-act="pet-especial">${esc(esp.nome)}${x.especialDia === today() ? "" : " (+3)"}</button></div>` : ""}
    <h3 class="h3">Diário de ${esc(x.nome)}</h3><p class="pet-diario">${esc(x.diario[today()])}</p>
    <h3 class="h3">Caminhada da semana</h3><div class="pet-caminhada"><span class="note">Cada tarefa feita é um passo. Destino: <b>${esc(DESTINOS_CAMINHADA[c.destino])}</b> (${Math.min(c.passos, PASSOS_SEMANA)}/${PASSOS_SEMANA} passos)</span><div class="cm-barra"><span style="width:${Math.min(100, (c.passos / PASSOS_SEMANA) * 100)}%"></span></div>${c.chegou ? `<span class="note">Chegaram! O cartão postal está no álbum.</span>` : ""}</div>
    <h3 class="h3">Truques</h3><div class="pet-nivel"><span class="note"><b>${diasC}</b> ${diasC === 1 ? "dia" : "dias"} de cuidado${prox ? ` · aprende <b>${esc(prox.nome.toLowerCase())}</b> sozinho em ${prox.dias - diasC} ${prox.dias - diasC === 1 ? "dia" : "dias"}` : " · já sabe todos os truques"}</span>${prox ? `<div class="cm-barra"><span style="width:${Math.round((diasC / prox.dias) * 100)}%"></span></div>` : ""}</div><div class="row pet-truques">${truques}</div>
    <h3 class="h3">Acessórios</h3>${loja}
    ${typeof ninhadaHTML === "function" ? ninhadaHTML() : ""}
    ${typeof lembrancasHTML === "function" ? lembrancasHTML() : ""}
    <h3 class="h3">Álbum</h3><div class="pet-album">${momentos || `<span class="note">Os momentos especiais vão aparecendo aqui.</span>`}</div>
    <h3 class="h3">Ajustes do pet</h3>
    <div class="setbox"><div class="setrow"><div class="lbl"><b>Passear pelas páginas</b><span class="note">Anda pela tela, sobe nos cards e segue seu dedo.</span></div><button class="btn small ${p.passeio ? "" : "ghost"}" data-act="pet-passeio" aria-pressed="${p.passeio}">${p.passeio ? "Ligado" : "Desligado"}</button></div>
    <div class="setrow"><div class="lbl"><b>Fantasia da época</b><span class="note">Abóbora no Halloween, gorro no Natal, chapéu de palha no São João, óculos nas férias (quando ele está sem chapéu).</span></div><button class="btn small ${p.fantasia !== false ? "" : "ghost"}" data-act="pet-fantasia" aria-pressed="${p.fantasia !== false}">${p.fantasia !== false ? "Ligado" : "Desligado"}</button></div>
    <div class="setrow"><div class="lbl"><b>Nome</b></div><input type="text" maxlength="20" value="${esc(x.nome)}" data-change="pet-nome" data-id="${x.id}" style="width:150px" aria-label="Nome do pet"></div>
    ${p.lista.length > 1 ? `<div class="setrow"><div class="lbl"><b>Pet que passeia primeiro</b></div><button class="btn small ${p.ativo === x.id ? "" : "ghost"}" data-act="pet-ativo" data-id="${x.id}">${p.ativo === x.id ? "É este" : "Escolher este"}</button></div>` : ""}
    ${p.lista.length < 3 ? `<div class="setrow"><div class="lbl"><b>Adotar mais um</b><span class="note">Até 3 pets. Eles brincam entre si.</span></div><button class="btn small" data-act="pet-adotar-outro">Adotar</button></div>` : ""}</div>
  </div>`;
}

function adocaoHTML() {
  const p = petsDados();
  const especies = Object.entries(ESPECIES_PET).filter(([, e]) => !e.mundo || e.mundo === S.persona);
  if (!especies.some(([k]) => k === adocao.especie)) adocao.especie = especies[0][0];
  const e = ESPECIES_PET[adocao.especie];
  const raras = CORES_RARAS.filter(c => typeof epocaAtiva === "function" && epocaAtiva(c.epoca));
  const cores = [
    ...e.cores.map(([id, cor]) => ({ id, nome: id, cor })),
    ...raras.map(r => ({ ...r, rara: true }))
  ];
  if (!cores.some(c => c.id === adocao.cor)) adocao.cor = cores[0].id;
  const previa = {
    especie: adocao.especie,
    cor: adocao.cor,
    nome: adocao.nome || e.nome,
    personalidade: adocao.personalidade,
    acess: {},
    cuidados: [],
    carinhos: {}
  };
  return `<div class="pet-adocao">
    <h3 class="h3">${p.lista.length ? "Adotar mais um" : "Adote um bichinho"}</h3>
    <span class="note">Ele passeia pelas páginas, reage ao que você faz e cresce com o seu cuidado. Nunca morre: se ficar sozinho, só fica tristinho.</span>
    <div class="pet-especies">${especies
      .map(
        ([k, es]) =>
          `<button class="pet-especie" data-act="adotar-especie" data-id="${k}" aria-pressed="${adocao.especie === k}">${petSVG(
            {
              especie: k,
              cor: es.cores[0][0],
              nome: es.nome,
              personalidade: "curioso",
              acess: {},
              cuidados: Array(20)
                .fill(0)
                .map((_, i) => i),
              carinhos: {}
            },
            { tam: 60 }
          )}<span>${es.nome}${es.mundo ? " ★" : ""}</span></button>`
      )
      .join("")}</div>
    <div class="pet-previa">${petSVG(previa, { tam: 120, pose: "feliz" })}</div>
    <span class="label">Cor</span><div class="row pet-cores">${cores.map(c => `<button class="pet-cor ${c.rara ? "rara" : ""}" data-act="adotar-cor" data-id="${c.id}" aria-pressed="${adocao.cor === c.id}" style="--c:${c.cor}" title="${esc(c.nome)}${c.rara ? " (cor rara da época)" : ""}"></button>`).join("")}</div>
    <span class="label">Jeito</span><div class="pet-pers">${Object.entries(PERSONALIDADES_PET)
      .map(
        ([k, ps]) =>
          `<button class="chip-bt" data-act="adotar-pers" data-id="${k}" aria-pressed="${adocao.personalidade === k}" title="${esc(ps.desc)}">${ps.nome}</button>`
      )
      .join("")}</div><span class="note">${esc(PERSONALIDADES_PET[adocao.personalidade].desc)}</span>
    <form class="row" data-form="adotar"><input id="adotar-nome" data-change="adotar-nome" maxlength="20" placeholder="Nome (ex.: ${esc(e.nome === "Gatinho" ? "Paçoca" : "Bolinha")})" value="${esc(adocao.nome)}" autocomplete="off"><button class="btn primary" type="submit">Adotar</button></form>
    ${p.lista.length ? `<button class="btn small ghost" data-act="pet-abrir" data-id="${p.ativo}">Voltar</button>` : ""}
  </div>`;
}

/* ---------- ações do painel ---------- */
ACOES_EXTRAS["adotar-especie"] = (b, id) =>
  ESPECIES_PET[id] && ((adocao.especie = id), (adocao.cor = ""), render());
ACOES_EXTRAS["adotar-cor"] = (b, id) => ((adocao.cor = id), render());
ACOES_EXTRAS["adotar-pers"] = (b, id) => PERSONALIDADES_PET[id] && ((adocao.personalidade = id), render());
MUDANCAS_EXTRAS["adotar-nome"] = el => (adocao.nome = el.value.slice(0, 20));
FORMS_EXTRAS.adotar = () => {
  const p = petsDados();
  if (p.lista.length >= 3) return toast("Já são 3 pets! Muito amor por aqui.");
  const nome = (getV("adotar-nome") || adocao.nome || ESPECIES_PET[adocao.especie].nome).slice(0, 20);
  const pet = {
    id: newId(),
    especie: adocao.especie,
    cor: adocao.cor,
    nome,
    personalidade: adocao.personalidade,
    adotado: today(),
    comeuEm: Date.now(),
    carinhos: {},
    cuidados: [today()],
    acess: {},
    truques: ["sentar"],
    momentos: [{ t: "Dia da adoção", em: today(), pose: "feliz" }],
    diario: {}
  };
  normalizarPet(pet);
  p.lista.push(pet);
  if (!p.ativo) p.ativo = pet.id;
  petSel = pet.id;
  adocao = { especie: "gato", cor: "", nome: "", personalidade: "curioso" };
  notificar({
    titulo: `Bem-vindo, ${nome}!`,
    texto: "Já está passeando pelas páginas. Cuida bem!",
    tipo: "conquista",
    mood: "party"
  });
  bigConfetti();
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
ACOES_EXTRAS["pet-abrir"] = (b, id) => ((petSel = id), render());
ACOES_EXTRAS["pet-adotar-outro"] = () => ((petSel = "adotar"), render());
ACOES_EXTRAS["pet-ativo"] = (b, id) => ((petsDados().ativo = id), commit());
MUDANCAS_EXTRAS["pet-nome"] = el => {
  const x = petPorId(el.dataset.id);
  if (!x || !el.value.trim()) return;
  x.nome = el.value.trim().slice(0, 20);
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
ACOES_EXTRAS["pet-passeio"] = () => {
  const p = petsDados();
  p.passeio = !p.passeio;
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};

const petDoPainel = () => petPorId(petSel) || petAtivo();
function reagirPet(x, pose, ms = 1600, soPainel = false) {
  if (!soPainel && typeof passeioReagir === "function") passeioReagir(x.id, pose, ms);
  const grande = document.querySelector(".pet-grande");
  if (grande) {
    grande.innerHTML = petSVG(x, { pose, tam: 150 });
    clearTimeout(reagirPet.t);
    reagirPet.t = setTimeout(() => softRender(), ms);
  }
}
ACOES_EXTRAS["pet-carinho"] = b => {
  const x = petDoPainel();
  if (!x) return;
  fazerCarinho(x, b);
  somDoPet(x);
  reagirPet(x, "feliz");
  if (x.personalidade === "dramatico" && x.carinhos[today()] === 1)
    react("happy", `${esc(x.nome)} desmaiou de tanto amor. Já voltou.`, 2600);
};
ACOES_EXTRAS["pet-comida"] = () => {
  const x = petDoPainel();
  if (!x) return;
  if (fomePet(x) > 90) return toast(`${x.nome} tá de barriga cheia!`);
  if (S.coins < 5) return toast("Faltam gotas. Conclui uma tarefa!", false, "worried");
  S.coins -= 5;
  x.comeuEm = Date.now();
  cuidou(x);
  reagirPet(x, "comendo", 1800, true);
  if (typeof passeioComer === "function") passeioComer(x.id); // o potinho aparece e ele vai comer
  momentoPet(x, "Primeira refeição", "comendo");
  persist();
  toast(`Nhac! ${x.nome} comeu ${ESPECIES_PET[x.especie].comida}.`);
};
ACOES_EXTRAS["pet-petisco"] = () => {
  const x = petDoPainel();
  if (!x) return;
  if (S.coins < 15) return toast("O petisco especial custa 15 gotas.", false, "worried");
  S.coins -= 15;
  x.comeuEm = Date.now();
  x.carinhos[today()] = (x.carinhos[today()] || 0) + 2;
  cuidou(x);
  momentoPet(x, "Primeiro petisco especial", "girando");
  reagirPet(x, "girando", 2000);
  if (typeof chuvaMundo === "function")
    chuvaMundo({
      movimento: "brilhar",
      n: 10,
      tam: [12, 20],
      dur: [0.8, 1.2],
      cores: ["#FFD54F", "#F48FB1"],
      formas: [`<path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="currentColor"/>`]
    });
  persist();
};
ACOES_EXTRAS["pet-banho"] = () => {
  const x = petDoPainel();
  if (!x || x.banho === today()) return;
  x.banho = today();
  cuidou(x);
  earn(2);
  reagirPet(x, "banho", 2200);
  toast(`${x.nome} tá cheiroso! +2 gotas.`);
  commit();
};
ACOES_EXTRAS["pet-soneca"] = () => {
  const x = petDoPainel();
  if (!x || x.soneca === today()) return;
  x.soneca = today();
  x.sonecaAte = Date.now() + 10 * 60e3;
  cuidou(x);
  earn(2);
  toast(`${x.nome} vai tirar uma soneca de 10 minutos. +2 gotas.`);
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
ACOES_EXTRAS["pet-truque"] = (b, id) => {
  const x = petDoPainel(),
    t = TRUQUES_PET.find(k => k.id === id);
  if (!x || !t || !truqueLivre(x, t)) return;
  if (!x.truques.includes(id)) {
    x.truques.push(id);
    momentoPet(x, `Aprendeu: ${t.nome.toLowerCase()}`, t.pose);
    persist();
  }
  somDoPet(x);
  reagirPet(x, t.pose, 1800);
};
// acessório: o que já é seu veste na hora; o que não é, prova primeiro e compra ali mesmo, embaixo da linha
let acessPrevia = null; // { pet, id }
ACOES_EXTRAS["pet-acess"] = (b, id) => {
  const x = petDoPainel(),
    a = ACESSORIOS_PET.find(k => k.id === id);
  if (!x || !a) return;
  const p = petsDados();
  if (!p.donos.includes(id)) {
    acessPrevia = acessPrevia && acessPrevia.id === id && acessPrevia.pet === x.id ? null : { pet: x.id, id };
    return render();
  }
  acessPrevia = null;
  if (x.acess[a.slot] === id) delete x.acess[a.slot];
  else x.acess[a.slot] = id;
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
ACOES_EXTRAS["pet-acess-desistir"] = () => ((acessPrevia = null), render());
ACOES_EXTRAS["pet-acess-comprar"] = (b, id) => {
  const x = petDoPainel(),
    a = ACESSORIOS_PET.find(k => k.id === id);
  if (!x || !a) return;
  const p = petsDados();
  if (!p.donos.includes(id)) {
    if (S.coins < a.preco) return toast(`Faltam ${a.preco - S.coins} gotas.`, false, "worried");
    earn(-a.preco, b);
    p.donos.push(id);
    toast(`${a.nome} é de ${x.nome}!`, false, "party");
  }
  acessPrevia = null;
  x.acess[a.slot] = id;
  somDoPet(x);
  commit();
  reagirPet(x, "feliz", 1400);
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
/* interação que só a espécie faz (vaca: sininho, boi: boi-bumbá, coala: abraço) */
ACOES_EXTRAS["pet-especial"] = b => {
  const x = petDoPainel();
  const esp = x && ESPECIES_PET[x.especie].especial;
  if (!esp) return;
  if (x.especialDia !== today()) {
    x.especialDia = today();
    earn(3, b);
  }
  cuidou(x);
  momentoPet(x, esp.nome, esp.id === "abraco" ? "abracando" : esp.id === "sininho" ? "sininho" : "dancando");
  if (esp.id === "sininho") {
    tocarSininho();
    reagirPet(x, "sininho", 2400);
    toast(`Blém blém! ${x.nome} tá dançando no ritmo do sininho.`);
  } else if (esp.id === "bumba") {
    somDoPet(x);
    reagirPet(x, "dancando", 3000);
    const lado = new Date().getDate() % 2 ? ["#D32F2F", "#FF5252"] : ["#1565C0", "#42A5F5"];
    if (typeof chuvaMundo === "function")
      chuvaMundo({
        movimento: "cair",
        n: 26,
        tam: [10, 18],
        dur: [1.6, 2.6],
        cores: [...lado, "#FFD54F"],
        formas: [
          `<path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="currentColor"/>`,
          `<circle cx="12" cy="12" r="8" fill="currentColor"/>`
        ]
      });
    toast(`Ê, boi! ${x.nome} fez a festa do boi-bumbá.`);
  } else {
    somDoPet(x, 0.7);
    reagirPet(x, "abracando", 2600, true);
    if (typeof passeioAbraco === "function") passeioAbraco(x.id);
    toast(`${x.nome} te deu um abraço bem apertado.`);
  }
  commit();
};
function tocarSininho() {
  if (!S.notif.som || typeof pegarAudio !== "function" || typeof sino !== "function") return;
  const ctx = pegarAudio();
  if (!ctx) return;
  const saida = typeof saidaMundo === "function" ? saidaMundo(ctx, 0.8) : ctx.destination;
  [0, 0.28, 0.56].forEach((dt, i) =>
    sino(ctx, saida, ctx.currentTime + 0.02 + dt, i === 1 ? 640 : 560, 0.7, 0.1, [1, 1.48, 2.2])
  );
}
ACOES_EXTRAS["pet-tirar"] = (b, slot) => {
  const x = petDoPainel();
  if (!x) return;
  delete x.acess[slot];
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
ACOES_EXTRAS["pet-bolinha"] = () => {
  const x = petDoPainel();
  if (x && typeof passeioBolinha === "function") passeioBolinha(x.id);
};
ACOES_EXTRAS["pet-esconde"] = () => {
  const x = petDoPainel();
  if (x && typeof passeioEsconder === "function") passeioEsconder(x.id);
};

/* ===================== reações ao que você faz ===================== */
/** Uma tarefa concluída: passo na caminhada, diário e pulo de alegria. */
function petTarefaConcluida() {
  const p = petsDados();
  if (!p.lista.length) return;
  const c = p.caminhada;
  c.passos++;
  if (c.passos === PASSOS_SEMANA && !c.chegou) {
    c.chegou = true;
    const x = petAtivo();
    momentoPet(x, `Cartão postal: ${DESTINOS_CAMINHADA[c.destino]}`, "feliz");
    earn(15);
    setTimeout(
      () =>
        notificar({
          titulo: `${x.nome} chegou: ${DESTINOS_CAMINHADA[c.destino]}!`,
          texto: "A caminhada da semana terminou. Cartão postal no álbum e +15 gotas.",
          tipo: "conquista",
          mood: "party"
        }),
      1800
    );
  }
}

/* ===================== mêsversário ===================== */
function conferirAniversarioPet() {
  const p = petsDados();
  for (const x of p.lista) {
    const dia = x.adotado.slice(8),
      meses = diffDays(x.adotado, today()) >= 28 ? Math.round(diffDays(x.adotado, today()) / 30.4) : 0;
    if (meses >= 1 && today().slice(8) === dia && x.niver !== today()) {
      x.niver = today();
      const ano = meses % 12 === 0;
      momentoPet(
        x,
        ano
          ? `${meses / 12} ${meses / 12 === 1 ? "ano" : "anos"} juntos`
          : `${meses} ${meses === 1 ? "mês" : "meses"} juntos`,
        "festa"
      );
      setTimeout(() => {
        notificar({
          titulo: `Hoje é aniversário de adoção de ${x.nome}!`,
          texto: `${ano ? meses / 12 + " ano(s)" : meses + " mês(es)"} juntos. Tem bolo!`,
          tipo: "conquista",
          mood: "party"
        });
        bigConfetti();
      }, 2500);
      persist(true);
    }
  }
}
document.addEventListener("DOMContentLoaded", () => setTimeout(conferirAniversarioPet, 1500));

/* ===================== pro perfil (vitrine) e pro Fotolog ===================== */
function petParaVitrine() {
  const x = petAtivo();
  return x
    ? { especie: x.especie, cor: x.cor, nome: x.nome, personalidade: x.personalidade, acess: { ...x.acess } }
    : null;
}
/** Limpa um pet vindo de outra pessoa (vitrine ou foto). */
function limparPetPublico(v) {
  if (!v || typeof v !== "object" || !ESPECIES_PET[v.especie]) return null;
  const cores = [...ESPECIES_PET[v.especie].cores.map(c => c[0]), ...CORES_RARAS.map(c => c.id)];
  const acess = {};
  if (v.acess && typeof v.acess === "object")
    for (const slot of ["coleira", "chapeu", "roupa"]) {
      const a = ACESSORIOS_PET.find(k => k.id === v.acess[slot] && k.slot === slot);
      if (a) acess[slot] = a.id;
    }
  return {
    especie: v.especie,
    cor: cores.includes(v.cor) ? v.cor : ESPECIES_PET[v.especie].cores[0][0],
    nome: String(v.nome || "").slice(0, 20),
    personalidade: PERSONALIDADES_PET[v.personalidade] ? v.personalidade : "curioso",
    acess,
    cuidados: Array(20).fill("x"),
    carinhos: {}
  };
}
