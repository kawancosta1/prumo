/*
  Pets crescendo junto com você (dados em S.pets; desenho e painel em js/pets.js, passeio em js/pets-passeio.js):
  - Comenta a tarefa que você acabou de criar (balãozinho em cima dele).
  - Foco no colo: dorme do lado do cronômetro e acorda quando o foco acaba.
  - Lembranças: o pet de um amigo que veio visitar deixa um presentinho (osso, flor, bilhete...).
  - Ninhada: com 2 pets felizes juntos por 30 dias, nasce um filhote (se ainda couber, até 3).
  - Fantasia da época: abóbora, gorro, chapéu de palha ou óculos, quando o pet está sem chapéu.
  Os truques que ele aprende sozinho com os dias de cuidado ficam em js/pets.js (TRUQUES_PET com "dias").
*/
"use strict";

/* ===================== comenta a tarefa nova ===================== */
const COMENTARIOS_TAREFA = [
  [/prova|teste|exame/, ["Prova? Você vai arrasar!", "Estuda que eu fico de guarda.", "Respira e confia!"]],
  [
    /estud|revis|exerc|lista|calculo|cálculo/,
    ["Bora estudar! Eu fico do lado.", "Liga o foco que eu durmo no seu colo."]
  ],
  [/academia|treino|corr|caminh|futebol|bike/, ["Vai treinar? Leva água!", "Bora mexer o corpo!"]],
  [/medic|médic|dentista|consulta|exame/, ["Cuida da saúde, hein!", "Vai lá, eu espero aqui."]],
  [/compr|mercado|feira/, ["Traz um petisco pra mim?", "Não esquece da lista!"]],
  [/ler|livro|leitura/, ["Lê em voz alta pra mim?", "Adoro hora da leitura!"]],
  [/limp|arrum|faxina|lavar/, ["Faxina! Vou me esconder do aspirador.", "Deixa que eu supervisiono."]],
  [/aniver|festa|role|rolê|encontro/, ["Festa? Me leva!", "Que delícia, vai ser ótimo!"]],
  [/trabalh|reuni|projeto|relat|entreg/, ["Foco no trabalho! Depois a gente brinca.", "Você dá conta!"]],
  [/agua|água|beber/, ["Água! Eu também quero.", "Hidratação é tudo!"]],
  [/dormir|descans|soneca/, ["Soneca? Eu sou especialista.", "Dormir bem é sagrado."]]
];
function comentarioTarefa(pet, titulo) {
  const t = norm(titulo);
  const achado = COMENTARIOS_TAREFA.find(([re]) => re.test(t));
  const som =
    S.persona === "otaku"
      ? "Nya~!"
      : {
          miau: "Miau!",
          au: "Au au!",
          muu: "Muuu!",
          muuu: "Muuuu!",
          grr: "Hmm...",
          rá: "Rá!",
          yip: "Yip!"
        }[ESPECIES_PET[pet.especie].som];
  return achado ? pick(achado[1]) : `${som || "Oba!"} Mais uma pra lista.`;
}
/** Balãozinho de fala em cima do pet que está passeando. */
function petFala(quem, texto, ms = 3600) {
  const a = typeof quem === "object" ? quem : typeof passeio === "object" && passeio.agentes.get(quem);
  if (!a || a.escondido || a.el.hidden) return false;
  a.fala = String(texto).slice(0, 80);
  desenharAgente(a);
  clearTimeout(a.fimFala);
  a.fimFala = setTimeout(() => {
    a.fala = "";
    desenharAgente(a);
  }, ms);
  return true;
}
{
  let conhecidas = null;
  document.addEventListener("DOMContentLoaded", () => {
    const renderAntesFala = render;
    render = function () {
      renderAntesFala();
      const ids = new Set(S.tasks.map(x => x.id));
      if (conhecidas && S.onboarded) {
        const novas = S.tasks.filter(x => !conhecidas.has(x.id));
        if (novas.length === 1 && tab === "hoje") {
          const pet = petAtivo();
          if (pet && !dormindoAgora()) {
            const a = passeio.agentes.get(pet.id);
            if (a && !a.preso) reagir(a, "feliz", 1200);
            petFala(pet.id, comentarioTarefa(pet, novas[0].title));
          }
        }
      }
      conhecidas = ids;
    };
  });
}

/* ===================== foco no colo: acorda quando acaba ===================== */
{
  let acordouDe = 0;
  setInterval(() => {
    if (typeof timer === "undefined" || !timer.running || acordouDe === timer.start) return;
    if (elapsed() < timer.goal * 60e3) return;
    acordouDe = timer.start;
    const pet = petAtivo();
    const a = pet && passeio.agentes.get(pet.id);
    if (!a || a.escondido) return;
    a.ancora = null;
    a.balao = "";
    a.preso = false;
    reagir(a, "pulando", 1600);
    somDoPet(pet);
    petFala(pet.id, "Acordei! O foco acabou, bora descansar?", 4000);
    setTimeout(() => descer(a), 1600);
  }, 4000);
}

/* ===================== lembranças das visitas ===================== */
const LEMBRANCAS = {
  osso: {
    nome: "um ossinho",
    svg: `<path d="M4 6a2 2 0 1 1 2-2h6a2 2 0 1 1 2 2v2a2 2 0 1 1-2 2H6a2 2 0 1 1-2-2z" fill="#FFF8E1" stroke="#BCAAA4" stroke-width=".6"/>`
  },
  flor: {
    nome: "uma florzinha",
    svg: `<circle cx="8" cy="6" r="2.4" fill="#F06292"/><circle cx="5" cy="8" r="2.4" fill="#F06292"/><circle cx="11" cy="8" r="2.4" fill="#F06292"/><circle cx="8" cy="10" r="2.4" fill="#F06292"/><circle cx="8" cy="8" r="1.6" fill="#FFD54F"/>`
  },
  bilhete: {
    nome: "um bilhetinho",
    svg: `<rect x="2" y="3" width="12" height="10" rx="1" fill="#FFFDE7" stroke="#BCAAA4" stroke-width=".6"/><path d="M4 6h8M4 8h8M4 10h5" stroke="#BCAAA4" stroke-width=".6"/>`
  },
  bolinha: {
    nome: "uma bolinha",
    svg: `<circle cx="8" cy="8" r="5" fill="#FFB300"/><path d="M4 6q4 3 8 0" stroke="#fff" stroke-width=".8" fill="none"/>`
  },
  folha: {
    nome: "uma folha bonita",
    svg: `<path d="M3 13Q3 3 14 2Q13 13 3 13z" fill="#66BB6A"/><path d="M3 13L11 5" stroke="#2E7D32" stroke-width=".8"/>`
  }
};
function deixarLembranca(petVisita, agente) {
  const p = petsDados();
  if (!Array.isArray(p.lembrancas)) p.lembrancas = [];
  const tipo = pick(Object.keys(LEMBRANCAS));
  p.lembrancas.push({
    tipo,
    de: String(petVisita.dono || "").slice(0, 30),
    pet: String(petVisita.nome || "").slice(0, 20),
    em: today()
  });
  p.lembrancas = p.lembrancas.slice(-12);
  earn(2);
  if (agente) petFala(agente, `Deixei ${LEMBRANCAS[tipo].nome} pra você!`, 3000);
  toast(`${petVisita.nome} deixou ${LEMBRANCAS[tipo].nome} antes de ir embora. +2 gotas`, false, "happy");
  persist();
}
function lembrancasHTML() {
  const l = (petsDados().lembrancas || []).slice().reverse();
  if (!l.length) return "";
  return `<h3 class="h3">Lembranças das visitas</h3><div class="pet-lembrancas">${l
    .map(
      x =>
        `<span class="pet-lembranca" title="${esc(x.pet)} (de ${esc(x.de)}) deixou ${esc((LEMBRANCAS[x.tipo] || {}).nome || "algo")} em ${fmtShort(x.em)}"><svg viewBox="0 0 16 16" width="26" height="26" aria-hidden="true">${(LEMBRANCAS[x.tipo] || LEMBRANCAS.bilhete).svg}</svg><small>${esc(x.pet)}</small></span>`
    )
    .join("")}</div>`;
}

/* ===================== ninhada ===================== */
const DIAS_NINHADA = 30;
function conferirNinhada() {
  const p = petsDados();
  if (!p.ninhada || typeof p.ninhada !== "object") p.ninhada = { dias: [] };
  const n = p.ninhada;
  if (!Array.isArray(n.dias)) n.dias = [];
  if (p.lista.length !== 2) return;
  if (n.dias.includes(today())) return;
  if (!p.lista.every(x => humorPet(x) >= 60)) return;
  n.dias.push(today());
  n.dias = n.dias.slice(-DIAS_NINHADA);
  if (n.dias.length >= DIAS_NINHADA) nascerFilhote();
  persist(true);
}
function nascerFilhote() {
  const p = petsDados();
  const [a, b] = p.lista;
  const especie = pick([a.especie, b.especie]);
  const cores = ESPECIES_PET[especie].cores.map(c => c[0]);
  const outro = especie === a.especie ? b : a;
  const filhote = {
    id: newId(),
    especie,
    cor: cores.includes(outro.cor) ? outro.cor : pick(cores),
    nome: "Filhote",
    personalidade: pick([a.personalidade, b.personalidade]),
    adotado: today(),
    comeuEm: Date.now(),
    carinhos: {},
    cuidados: [today()],
    acess: {},
    truques: ["sentar"],
    momentos: [{ t: `Nasceu! Filhote de ${a.nome} e ${b.nome}`, em: today(), pose: "feliz" }],
    diario: {},
    pais: [a.id, b.id]
  };
  normalizarPet(filhote);
  p.lista.push(filhote);
  p.ninhada = { dias: [], nasceu: today() };
  momentoPet(a, "Virou mãe/pai!", "feliz");
  momentoPet(b, "Virou mãe/pai!", "feliz");
  setTimeout(() => {
    notificar({
      titulo: "Nasceu um filhote!",
      texto: `${a.nome} e ${b.nome} tiveram um filhote. Dá um nome pra ele no painel do pet.`,
      tipo: "conquista",
      mood: "party",
      aba: "prumi"
    });
    bigConfetti();
  }, 800);
  if (typeof passeioAtualizar === "function") passeioAtualizar();
}
function ninhadaHTML() {
  const p = petsDados();
  if (p.lista.length !== 2) return "";
  const n = (p.ninhada && p.ninhada.dias) || [];
  return `<h3 class="h3">Ninhada</h3><div class="pet-caminhada"><span class="note">Com os 2 felizes juntos por ${DIAS_NINHADA} dias, nasce um filhote. <b>${n.length}/${DIAS_NINHADA}</b> dias.</span><div class="cm-barra"><span style="width:${Math.round((n.length / DIAS_NINHADA) * 100)}%;background:#F48FB1"></span></div></div>`;
}
document.addEventListener("DOMContentLoaded", () => setTimeout(conferirNinhada, 3000));
setInterval(() => S.onboarded && conferirNinhada(), 10 * 60e3);

/* ===================== fantasia da época ===================== */
function epocaDaFantasia() {
  if (typeof epocaAtiva !== "function" || typeof EPOCAS !== "object") return null;
  return ["halloween", "natal", "saojoao", "ferias"].find(id => EPOCAS[id] && epocaAtiva(id)) || null;
}
function fantasiaPetSVG(x) {
  const p = S.pets || {};
  if (p.fantasia === false || x.acess.chapeu) return "";
  const e = epocaDaFantasia();
  return (
    {
      halloween: `<path d="M28 10q-1-5 6-5q7 0 6 5q-6 2-12 0z" fill="#FF8F00" stroke="#E65100" stroke-width=".6"/><path d="M31 6v4M34 5v5M37 6v4" stroke="#E65100" stroke-width=".5"/><path d="M34 5q0-3 2-3" stroke="#43A047" stroke-width="1.2" fill="none"/>`,
      natal: `<path d="M27 11q6-10 14-1z" fill="#E53935"/><path d="M27 11q7 2 14-1" stroke="#FAFAFA" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="30" cy="3.6" r="1.8" fill="#FAFAFA"/>`,
      saojoao: `<path d="M27 11q7-6 14 0z" fill="#F9D56E" stroke="#B7892B" stroke-width=".6"/><path d="M23.6 11.4h20.6" stroke="#E2B547" stroke-width="1.8" stroke-linecap="round"/><path d="M28 10l12 0" stroke="#E53935" stroke-width=".9"/>`,
      ferias: `<rect x="33" y="13.6" width="5.6" height="3.4" rx="1.4" fill="#212121"/><rect x="39.4" y="13.6" width="4" height="3.4" rx="1.4" fill="#212121"/><path d="M38.6 15h.8" stroke="#212121" stroke-width=".8"/>`
    }[e] || ""
  );
}
ACOES_EXTRAS["pet-fantasia"] = () => {
  const p = petsDados();
  p.fantasia = p.fantasia === false;
  commit();
  if (typeof passeioAtualizar === "function") passeioAtualizar();
};
