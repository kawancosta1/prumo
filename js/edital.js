/*
  edital.js - Edital -> Cronograma. Cole o conteúdo programático de um concurso, ENEM, Fuvest,
  Unicamp etc. e o Prumo monta o cronograma dia a dia até a prova.
  Partes:
   1. Biblioteca de tópicos padrão por disciplina e presets de provas.
   2. Leitor de edital (local, sem internet) e leitor com IA (servidor), com o local de reserva.
   3. Gerador de cronograma (teoria, questões, revisão semanal, revisão final e simulados).
   4. Tela (aba "Edital" do planejador) e importação para a agenda.
*/
"use strict";

/* ---------- 1. Biblioteca ---------- */
const TOPICOS_PADRAO = {
  "lingua portuguesa": [
    "Interpretação e compreensão de textos",
    "Tipologia e gêneros textuais",
    "Ortografia e acentuação gráfica",
    "Classes de palavras",
    "Sintaxe da oração e do período",
    "Concordância verbal e nominal",
    "Regência verbal e nominal e crase",
    "Pontuação",
    "Coesão e coerência textual",
    "Semântica, figuras de linguagem e reescrita de frases",
    "Pronomes e colocação pronominal"
  ],
  matematica: [
    "Operações, MMC e MDC",
    "Frações, decimais e porcentagem",
    "Razão, proporção e regra de três",
    "Equações e sistemas de 1º e 2º graus",
    "Funções (afim, quadrática, exponencial e logarítmica)",
    "Progressões aritméticas e geométricas",
    "Geometria plana e áreas",
    "Geometria espacial e volumes",
    "Análise combinatória",
    "Probabilidade",
    "Estatística básica (média, mediana, moda)",
    "Trigonometria e geometria analítica"
  ],
  "raciocinio logico": [
    "Proposições e conectivos lógicos",
    "Tabelas-verdade e equivalências",
    "Negação de proposições e quantificadores",
    "Argumentação e silogismos",
    "Diagramas lógicos (conjuntos)",
    "Sequências, padrões e problemas de contagem",
    "Raciocínio analítico e verdades e mentiras",
    "Probabilidade e análise combinatória básica"
  ],
  informatica: [
    "Conceitos de hardware e software",
    "Sistemas operacionais (Windows e Linux)",
    "Editores de texto e planilhas",
    "Internet, navegadores e correio eletrônico",
    "Redes de computadores e protocolos",
    "Segurança da informação, malwares e backup",
    "Computação em nuvem e armazenamento",
    "Banco de dados e noções de programação"
  ],
  "direito constitucional": [
    "Princípios fundamentais",
    "Direitos e garantias fundamentais",
    "Direitos sociais, nacionalidade e direitos políticos",
    "Organização do Estado e da União, estados e municípios",
    "Poder Legislativo e processo legislativo",
    "Poder Executivo",
    "Poder Judiciário e funções essenciais à Justiça",
    "Controle de constitucionalidade",
    "Defesa do Estado e das instituições democráticas",
    "Ordem social e ordem econômica"
  ],
  "direito administrativo": [
    "Princípios da administração pública",
    "Organização administrativa (direta e indireta)",
    "Atos administrativos",
    "Poderes administrativos",
    "Licitações e contratos (Lei 14.133/2021)",
    "Serviços públicos e concessões",
    "Agentes públicos e Lei 8.112/1990",
    "Responsabilidade civil do Estado",
    "Controle da administração e improbidade administrativa",
    "Bens públicos e intervenção do Estado na propriedade"
  ],
  "direito penal": [
    "Princípios e aplicação da lei penal",
    "Teoria do crime: fato típico, ilicitude e culpabilidade",
    "Concurso de crimes e penas",
    "Extinção da punibilidade",
    "Crimes contra a pessoa",
    "Crimes contra o patrimônio",
    "Crimes contra a administração pública",
    "Legislação penal especial"
  ],
  "direito processual penal": [
    "Princípios e inquérito policial",
    "Ação penal",
    "Competência",
    "Provas",
    "Prisões e medidas cautelares",
    "Procedimentos e júri",
    "Nulidades e recursos"
  ],
  "direito civil": [
    "Lei de Introdução às Normas do Direito Brasileiro",
    "Pessoas naturais e jurídicas",
    "Bens e fatos jurídicos",
    "Obrigações",
    "Contratos",
    "Responsabilidade civil",
    "Direito das coisas",
    "Família e sucessões"
  ],
  "direito tributario": [
    "Sistema Tributário Nacional e princípios",
    "Competência tributária e limitações ao poder de tributar",
    "Tributos e espécies tributárias",
    "Obrigação e crédito tributário",
    "Lançamento, suspensão, extinção e exclusão do crédito",
    "Administração tributária e garantias",
    "Impostos em espécie"
  ],
  "direito do trabalho": [
    "Princípios e fontes",
    "Contrato de trabalho",
    "Jornada de trabalho e descansos",
    "Remuneração e salário",
    "Rescisão e estabilidades",
    "Direito coletivo",
    "Segurança e medicina do trabalho"
  ],
  "direito previdenciario": [
    "Seguridade social e princípios",
    "Segurados e dependentes",
    "Custeio",
    "Benefícios do RGPS",
    "Carência e qualidade de segurado",
    "Assistência social e BPC",
    "Reforma da Previdência"
  ],
  atualidades: [
    "Política nacional e internacional recente",
    "Economia brasileira e mundial",
    "Meio ambiente e sustentabilidade",
    "Tecnologia e inovação",
    "Saúde pública e sociedade",
    "Segurança pública e direitos humanos",
    "Conflitos e relações internacionais"
  ],
  fisica: [
    "Cinemática",
    "Dinâmica e leis de Newton",
    "Trabalho, energia e potência",
    "Impulso e quantidade de movimento",
    "Gravitação",
    "Estática e hidrostática",
    "Termologia e calorimetria",
    "Termodinâmica",
    "Ondulatória e acústica",
    "Óptica geométrica",
    "Eletrostática e eletrodinâmica",
    "Eletromagnetismo",
    "Física moderna"
  ],
  quimica: [
    "Estrutura atômica e tabela periódica",
    "Ligações químicas e geometria molecular",
    "Funções inorgânicas",
    "Reações químicas e estequiometria",
    "Soluções e propriedades coligativas",
    "Termoquímica",
    "Cinética e equilíbrio químico",
    "Eletroquímica",
    "Química orgânica: funções e nomenclatura",
    "Reações orgânicas e isomeria",
    "Radioatividade",
    "Química ambiental"
  ],
  biologia: [
    "Citologia e bioquímica",
    "Metabolismo energético",
    "Genética e hereditariedade",
    "Biotecnologia e engenharia genética",
    "Evolução",
    "Ecologia e meio ambiente",
    "Fisiologia humana",
    "Botânica",
    "Zoologia",
    "Microbiologia, parasitologia e saúde pública",
    "Embriologia e histologia"
  ],
  historia: [
    "Antiguidade e Idade Média",
    "Idade Moderna e expansão marítima",
    "Brasil Colônia",
    "Brasil Império",
    "República Velha e Era Vargas",
    "Ditadura militar e redemocratização",
    "Revolução Industrial e Iluminismo",
    "Imperialismo e Primeira Guerra",
    "Entreguerras e Segunda Guerra",
    "Guerra Fria e mundo contemporâneo"
  ],
  geografia: [
    "Cartografia e orientação",
    "Geologia, relevo e solos",
    "Climatologia e biomas",
    "Hidrografia",
    "Questões ambientais",
    "População e migrações",
    "Urbanização",
    "Agropecuária e indústria",
    "Energia e matriz energética",
    "Geopolítica e globalização",
    "Geografia do Brasil"
  ],
  filosofia: [
    "Filosofia antiga",
    "Filosofia medieval e moderna",
    "Ética e política",
    "Teoria do conhecimento",
    "Filosofia contemporânea"
  ],
  sociologia: [
    "Clássicos: Durkheim, Weber e Marx",
    "Cultura e identidade",
    "Estratificação e desigualdade",
    "Trabalho e sociedade",
    "Cidadania, movimentos sociais e Estado"
  ],
  ingles: [
    "Interpretação de textos",
    "Vocabulário e cognatos",
    "Tempos verbais",
    "Pronomes e preposições",
    "Conectivos"
  ],
  literatura: [
    "Trovadorismo ao Barroco",
    "Arcadismo e Romantismo",
    "Realismo, Naturalismo e Parnasianismo",
    "Simbolismo e Pré-Modernismo",
    "Modernismo (fases)",
    "Literatura contemporânea",
    "Obras de leitura obrigatória"
  ],
  redacao: [
    "Estrutura dissertativo-argumentativa",
    "As 5 competências de correção",
    "Repertório sociocultural",
    "Tese e argumentação",
    "Proposta de intervenção completa",
    "Coesão, conectivos e norma culta",
    "Treino de temas e correção de textos"
  ],
  "matematica financeira": [
    "Juros simples",
    "Juros compostos",
    "Descontos",
    "Taxas equivalentes e nominais",
    "Amortização (SAC e Price)",
    "Fluxo de caixa, VPL e TIR"
  ],
  "contabilidade geral": [
    "Patrimônio e equação contábil",
    "Contas e plano de contas",
    "Escrituração e lançamentos",
    "Balanço patrimonial",
    "DRE e demais demonstrações",
    "Análise das demonstrações"
  ],
  "administracao publica": [
    "Princípios e modelos de gestão pública",
    "Planejamento e orçamento público",
    "Gestão de pessoas",
    "Gestão de processos e projetos",
    "Governança e controle"
  ],
  "etica no servico publico": [
    "Código de ética do servidor",
    "Princípios e deveres",
    "Improbidade e conflito de interesses",
    "Processo administrativo disciplinar"
  ],
  "conhecimentos bancarios": [
    "Sistema Financeiro Nacional",
    "Produtos e serviços bancários",
    "Mercado financeiro e de capitais",
    "Lavagem de dinheiro e compliance",
    "Meios de pagamento e Pix",
    "LGPD"
  ],
  estatistica: [
    "Medidas de posição e dispersão",
    "Probabilidade",
    "Distribuições",
    "Amostragem e inferência",
    "Correlação e regressão"
  ]
};

const ALIAS_DISCIPLINAS = {
  portugues: "lingua portuguesa",
  rlm: "raciocinio logico",
  "raciocinio logico matematico": "raciocinio logico",
  "matematica e suas tecnologias": "matematica",
  "tecnologia da informacao": "informatica",
  ti: "informatica",
  "nocoes de informatica": "informatica",
  "etica profissional": "etica no servico publico"
};

const EXAMES_EDITAIS = {
  enem: {
    nome: "ENEM",
    materias: [
      ["Redação", 3],
      ["Matemática", 3],
      ["Linguagens e Literatura", 2, "literatura"],
      ["Física", 2],
      ["Química", 2],
      ["Biologia", 2],
      ["História", 2],
      ["Geografia", 2],
      ["Filosofia", 1],
      ["Sociologia", 1]
    ]
  },
  fuvest: {
    nome: "Fuvest (1ª fase)",
    materias: [
      ["Língua Portuguesa", 2],
      ["Literatura", 2],
      ["Matemática", 3],
      ["Física", 2],
      ["Química", 2],
      ["Biologia", 2],
      ["História", 2],
      ["Geografia", 2],
      ["Inglês", 1]
    ]
  },
  unicamp: {
    nome: "Unicamp (1ª fase)",
    materias: [
      ["Língua Portuguesa", 2],
      ["Literatura", 2],
      ["Matemática", 3],
      ["Física", 2],
      ["Química", 2],
      ["Biologia", 2],
      ["História", 2],
      ["Geografia", 2],
      ["Atualidades", 1]
    ]
  },
  medio: {
    nome: "Concurso nível médio",
    materias: [
      ["Língua Portuguesa", 3],
      ["Raciocínio Lógico", 2],
      ["Informática", 1],
      ["Direito Constitucional", 2],
      ["Direito Administrativo", 2],
      ["Atualidades", 1]
    ]
  },
  policial: {
    nome: "Concurso policial",
    materias: [
      ["Língua Portuguesa", 2],
      ["Raciocínio Lógico", 2],
      ["Direito Constitucional", 2],
      ["Direito Administrativo", 1],
      ["Direito Penal", 3],
      ["Direito Processual Penal", 3],
      ["Informática", 1]
    ]
  },
  bancario: {
    nome: "Concurso bancário",
    materias: [
      ["Língua Portuguesa", 2],
      ["Matemática", 2],
      ["Matemática Financeira", 2],
      ["Conhecimentos Bancários", 3],
      ["Informática", 1],
      ["Atualidades", 1]
    ]
  }
};

function edNorm(s) {
  return String(s == null ? "" : s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Tópicos da biblioteca para uma disciplina (por nome aproximado); [] se não conhece */
function buscarTopicosPadrao(nome) {
  let n = edNorm(nome).replace(/^(nocoes de|conhecimentos de|nocoes|fundamentos de)\s+/, "");
  if (ALIAS_DISCIPLINAS[n]) n = ALIAS_DISCIPLINAS[n];
  if (TOPICOS_PADRAO[n]) return TOPICOS_PADRAO[n].slice();
  if (n.length >= 5) {
    for (const k of Object.keys(TOPICOS_PADRAO)) {
      if (n.includes(k) || k.includes(n)) return TOPICOS_PADRAO[k].slice();
    }
  }
  return [];
}

function montarPresetEdital(chave) {
  const p = EXAMES_EDITAIS[chave];
  if (!p) return null;
  return {
    nome: p.nome,
    dataProva: "",
    fonte: "preset",
    materias: p.materias.map(([nome, peso, chaveTopicos]) => ({
      nome,
      peso,
      topicos: buscarTopicosPadrao(chaveTopicos || nome),
      sugerido: true
    }))
  };
}

/* ---------- 2. Leitor de edital ---------- */
const ED_SEPARADORES =
  /^(anexo|edital|concurso|prefeitura|tribunal|governo|ministerio|secretaria|cargo|inscri|prova|etapa|fase|quadro|tabela|requisitos|atribui|remunera|vagas|cronograma|bibliografia|referencias|observa|disposicoes|pagina|capitulo|titulo)\b/;
const ED_PALAVRAS_DISCIPLINA =
  /^(lingua|portugues|matematica|raciocinio|informatica|direito|legislacao|conhecimentos|atualidades|fisica|quimica|biologia|historia|geografia|filosofia|sociologia|ingles|espanhol|redacao|literatura|contabilidade|administracao|economia|estatistica|etica|nocoes|arquivologia|auditoria|gestao|ciencias|educacao|pedagogia|enfermagem|saude|medicina|engenharia|banco|portugues)\b/;
const ED_PEQUENAS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "a",
  "o",
  "para",
  "no",
  "na",
  "nos",
  "nas",
  "ao"
]);

function edTitulo(s) {
  return String(s)
    .replace(/[:.\s]+$/, "")
    .split(" ")
    .map((w, i) => {
      if (w.length <= 3 && w === w.toUpperCase() && !ED_PEQUENAS.has(w.toLowerCase())) return w;
      const l = w.toLowerCase();
      return i > 0 && ED_PEQUENAS.has(l) ? l : l.charAt(0).toUpperCase() + l.slice(1);
    })
    .join(" ")
    .slice(0, 80);
}

function edRazaoMaiuscula(s) {
  const letras = s.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letras.length < 4) return 0;
  const up = letras.replace(/[^A-ZÀ-Þ]/g, "").length;
  return up / letras.length;
}

/** Devolve o nome da disciplina se a linha for um cabeçalho; "" se for conteúdo; null se for separador */
function edCabecalho(l) {
  let m = /^(?:disciplina|mat[eé]ria)\s*[:\-–]\s*(.{3,80})$/i.exec(l);
  if (m) return edTitulo(m[1]);
  const semNum = l.replace(/^(?:\d{1,2}[.)]|[IVX]{1,4}\s*[-–.)])\s+/, "").trim();
  const n = edNorm(semNum.replace(/:$/, ""));
  if (ED_SEPARADORES.test(n) && edRazaoMaiuscula(semNum) >= 0.8) return null;
  if (
    semNum.length <= 90 &&
    !/[.;]$/.test(semNum) &&
    edRazaoMaiuscula(semNum) >= 0.85 &&
    semNum.split(" ").length <= 10
  ) {
    return edTitulo(semNum);
  }
  if (/:$/.test(semNum) && semNum.length <= 70 && ED_PALAVRAS_DISCIPLINA.test(n)) return edTitulo(semNum);
  if (semNum.length <= 50 && !/[.;:]$/.test(semNum) && (TOPICOS_PADRAO[n] || ALIAS_DISCIPLINAS[n]))
    return edTitulo(semNum);
  return "";
}

const ED_MARCADOR = /^(?:\d{1,2}(?:\.\d{1,2}){0,3}[.)]?|[a-z][.)]|[IVX]{1,4}\s*[-–.)]|[•\-–*·])\s+/i;

function edExtrairTopicos(linhas) {
  const itens = [];
  let buf = null;
  for (const l of linhas) {
    if (ED_MARCADOR.test(l)) {
      if (buf !== null) itens.push(buf);
      buf = l.replace(ED_MARCADOR, "");
    } else {
      buf = buf === null ? l : buf + " " + l;
    }
  }
  if (buf !== null) itens.push(buf);
  const out = [];
  const vistos = new Set();
  itens.forEach(it => {
    const partes = it.length > 140 || it.includes(";") ? it.split(/;|\.\s+(?=[A-ZÀ-Ý])/) : [it];
    partes.forEach(p => {
      const t = p
        .replace(/\s+/g, " ")
        .replace(/^[\s,.;:–-]+|[\s,.;:–-]+$/g, "")
        .replace(/^e\s+(?=[a-zà-ÿ])/i, "")
        .trim();
      const k = edNorm(t);
      if (t.length >= 4 && t.length <= 200 && !vistos.has(k)) {
        vistos.add(k);
        out.push(t.length > 160 ? t.slice(0, 157) + "..." : t);
      }
    });
  });
  return out.slice(0, 80);
}

function edDetectarData(texto, ref) {
  const re = /(\d{1,2})\/(\d{1,2})\/(20\d{2})/g;
  let m;
  while ((m = re.exec(texto))) {
    const ctx = texto.slice(Math.max(0, m.index - 90), m.index).toLowerCase();
    if (!/prova|aplica|exame|realiza/.test(ctx)) continue;
    const d = +m[1];
    const mes = +m[2];
    if (mes < 1 || mes > 12 || d < 1 || d > 31) continue;
    const iso = `${m[3]}-${String(mes).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!ref || iso > ref) return iso;
  }
  return "";
}

function edPesoPadrao(nome) {
  const n = edNorm(nome);
  if (/redacao|especific|portugues|matematica/.test(n)) return 2;
  return 1;
}

/** Lê o texto do edital sem internet. Devolve { nome, dataProva, materias:[{nome,peso,topicos,sugerido}], fonte } */
function analisarEditalLocal(texto, ref) {
  const bruto = String(texto || "");
  const linhas = bruto
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(l => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const secoes = [];
  let atual = null;
  for (const l of linhas) {
    const cab = edCabecalho(l);
    if (cab === null) {
      atual = null;
      continue;
    }
    if (cab) {
      atual = { nome: cab, linhas: [] };
      secoes.push(atual);
      continue;
    }
    if (atual) atual.linhas.push(l);
  }
  const porNome = new Map();
  secoes.forEach(s => {
    const topicos = edExtrairTopicos(s.linhas);
    if (!topicos.length) return;
    const k = edNorm(s.nome);
    if (porNome.has(k)) {
      const m = porNome.get(k);
      topicos.forEach(t => {
        if (!m.topicos.some(x => edNorm(x) === edNorm(t))) m.topicos.push(t);
      });
    } else {
      porNome.set(k, { nome: s.nome, topicos });
    }
  });
  const materias = [...porNome.values()].slice(0, 40).map(m => {
    const sugerido = m.topicos.length < 3;
    const topicos = sugerido ? [...new Set([...m.topicos, ...buscarTopicosPadrao(m.nome)])] : m.topicos;
    return { nome: m.nome, peso: edPesoPadrao(m.nome), topicos, sugerido };
  });
  const nomeLinha =
    linhas.find(l => l.length <= 100 && /edital|concurso|processo seletivo|vestibular/i.test(l)) || "";
  return { nome: nomeLinha.slice(0, 80), dataProva: edDetectarData(bruto, ref), materias, fonte: "local" };
}

function edLimparStr(v, max) {
  return String(v == null ? "" : v)
    .replace(/[\u0000-\u001f\u202a-\u202e\u2066-\u2069]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Valida e limpa o que a IA devolveu (nunca confia no formato) */
function edValidarResultadoIA(obj, ref) {
  if (!obj || typeof obj !== "object" || !Array.isArray(obj.materias)) return null;
  const materias = obj.materias
    .slice(0, 40)
    .map(m => {
      if (!m || typeof m !== "object") return null;
      const nome = edLimparStr(m.nome, 80);
      const topicos = (Array.isArray(m.topicos) ? m.topicos : [])
        .map(t => edLimparStr(t, 160))
        .filter(t => t.length >= 3)
        .slice(0, 80);
      if (!nome) return null;
      const peso = Math.min(3, Math.max(1, Math.round(Number(m.peso)) || 1));
      const sugerido = topicos.length < 3;
      return {
        nome,
        peso,
        topicos: sugerido ? [...new Set([...topicos, ...buscarTopicosPadrao(nome)])] : topicos,
        sugerido
      };
    })
    .filter(m => m && m.topicos.length);
  if (!materias.length) return null;
  let dataProva = edLimparStr(obj.dataProva, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataProva) || (ref && dataProva <= ref)) dataProva = "";
  return { nome: edLimparStr(obj.nome, 80), dataProva, materias, fonte: "ia" };
}

/** Lê o edital com a IA (servidor) e cai no leitor local se não der */
async function analisarEdital(texto, ref) {
  const t = String(texto || "").trim();
  const local = analisarEditalLocal(t, ref);
  if (t.length < 120 || typeof chamarServidorIA !== "function") return local;
  const cortado = t.slice(0, 38000);
  const prompt = `Leia o texto de edital abaixo e extraia o conteúdo programático.
Responda em JSON: {"nome": string, "dataProva": "AAAA-MM-DD" ou "", "materias": [{"nome": string, "peso": 1|2|3, "topicos": [string]}]}
Regras:
- Use SÓ o que está no texto. Não invente tópicos. Se uma disciplina não tiver tópicos listados, deixe "topicos" vazio.
- Agrupe por disciplina. Tópicos curtos (até 120 caracteres).
- Peso 3 para as disciplinas com mais questões ou mais importantes (se o texto indicar), senão 1 ou 2.
- Ignore regras de inscrição, vagas, salários e datas que não sejam da prova objetiva.
- "dataProva" só se o texto trouxer a data da prova.
TEXTO DO EDITAL:
<<<
${cortado}
>>>`;
  const r = await chamarServidorIA({ modo: "json", mensagem: prompt });
  if (r && r.texto && typeof lerJsonDaIA === "function") {
    const ok = edValidarResultadoIA(lerJsonDaIA(r.texto), ref);
    if (ok) return ok;
  }
  if (r && r.cota) local.aviso = r.erro;
  return local;
}

/* ---------- 3. Gerador de cronograma ---------- */
const edIsoParaData = iso => new Date(iso + "T12:00:00Z");
function edSomarDias(iso, n) {
  const d = edIsoParaData(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const edDiaSemana = iso => edIsoParaData(iso).getUTCDay();
function edSegunda(iso) {
  const d = edIsoParaData(iso);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
const edClamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ED_DIAS_ESTUDO = {
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6]
};

/**
 * cfg: { materias:[{nome,peso,topicos}], horasDia, diasSemana, dataProva, inicio }
 * Devolve { dias:[{data,blocos:[{materia,tipo,titulo,min}]}], resumo, avisos, materias } ou { erro }.
 */
function gerarCronogramaEdital(cfg) {
  const inicio = cfg.inicio;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio || "")) return { erro: "Data de início inválida." };
  const horasDia = edClamp(Number(cfg.horasDia) || 3, 1, 12);
  const diasSem = ED_DIAS_ESTUDO[+cfg.diasSemana] ? +cfg.diasSemana : 6;
  const prova =
    /^\d{4}-\d{2}-\d{2}$/.test(cfg.dataProva || "") && cfg.dataProva > inicio ? cfg.dataProva : "";
  const avisos = [];
  const materias = (cfg.materias || [])
    .map(m => ({
      nome: edLimparStr(m.nome, 80),
      peso: edClamp(Math.round(+m.peso) || 1, 1, 3),
      topicos: (m.topicos || []).map(t => edLimparStr(t, 160)).filter(Boolean)
    }))
    .filter(m => m.nome && m.topicos.length);
  if (!materias.length) return { erro: "Nenhuma disciplina com tópicos." };

  const fim = prova ? edSomarDias(prova, -1) : edSomarDias(inicio, 7 * 12 - 1);
  const datas = [];
  for (let d = inicio, n = 0; d <= fim && n < 400; d = edSomarDias(d, 1), n++) {
    if (ED_DIAS_ESTUDO[diasSem].includes(edDiaSemana(d))) datas.push(d);
  }
  if (!datas.length) return { erro: "Não há dias de estudo antes da prova. Confira a data." };
  if (!prova) avisos.push("Sem data de prova: montei 12 semanas. Informe a data para ajustar o ritmo.");

  const porDia = Math.max(1, Math.round((horasDia * 60) / 50));
  const minBloco = Math.max(25, Math.round((horasDia * 60) / porDia / 5) * 5);

  // posições dos blocos; o último bloco da última data de estudo de cada semana vira revisão semanal
  const posicoes = [];
  datas.forEach((d, di) => {
    const ultimaDaSemana = di === datas.length - 1 || edSegunda(datas[di + 1]) !== edSegunda(d);
    for (let b = 0; b < porDia; b++) {
      posicoes.push({ di, b, semanal: ultimaDaSemana && b === porDia - 1 && datas.length > 2 });
    }
  });
  const livres = posicoes.filter(p => !p.semanal);
  const nLivres = livres.length;
  const totalTopicos = materias.reduce((a, m) => a + m.topicos.length, 0);

  // pacotes por bloco: k tópicos por bloco de teoria, o menor k que cabe em ~70% do tempo
  let slotsA = nLivres >= 10 ? Math.floor(nLivres * 0.7) : nLivres;
  const unidades = k =>
    materias.reduce((a, m) => {
      const p = Math.ceil(m.topicos.length / k);
      return a + p + Math.ceil(p / 3);
    }, 0);
  let k = 1;
  while (k < 15 && unidades(k) > slotsA) k++;
  let unidadesTotal = unidades(k);
  if (unidadesTotal > slotsA) {
    slotsA = Math.min(nLivres, unidadesTotal);
    if (unidadesTotal > nLivres) {
      avisos.push(
        "O tempo até a prova é curto para todo o conteúdo. Aumente as horas por dia ou os dias por semana, ou tire disciplinas de peso baixo."
      );
    } else {
      avisos.push(
        "Tempo apertado: não sobrou espaço para a fase de revisão final. Considere estudar mais horas por dia."
      );
    }
  } else if (k > 1) {
    avisos.push(`Para caber no prazo, cada bloco cobre ${k} tópicos.`);
  }

  // filas por disciplina: teoria em pacotes e questões a cada 3 pacotes
  const filas = materias.map(m => {
    const pacotes = [];
    for (let i = 0; i < m.topicos.length; i += k) pacotes.push(m.topicos.slice(i, i + k));
    const fila = [];
    let desdeQuestoes = [];
    pacotes.forEach((p, i) => {
      fila.push({ tipo: "teoria", titulo: p.join("; "), topicos: p });
      desdeQuestoes.push(p[0]);
      if ((i + 1) % 3 === 0 || i === pacotes.length - 1) {
        fila.push({ tipo: "questoes", titulo: "Questões de " + desdeQuestoes.join("; ") });
        desdeQuestoes = [];
      }
    });
    return { m, fila, pacotes, i: 0 };
  });

  const escolher = (cands, ultimo) => {
    let melhor = -1;
    let melhorV = Infinity;
    cands.forEach(idx => {
      const f = filas[idx];
      const v = f.i / f.fila.length / f.m.peso + (idx === ultimo ? 0.03 : 0);
      if (v < melhorV) {
        melhorV = v;
        melhor = idx;
      }
    });
    return melhor;
  };

  const blocos = []; // por slot livre, na ordem
  let ultimo = -1;
  let extra = 0;
  for (let s = 0; s < slotsA; s++) {
    const cands = filas.map((f, i) => (f.i < f.fila.length ? i : -1)).filter(i => i >= 0);
    if (cands.length) {
      const idx = escolher(cands, ultimo);
      const f = filas[idx];
      const u = f.fila[f.i++];
      blocos.push({ materia: f.m.nome, tipo: u.tipo, titulo: u.titulo, topicos: u.topicos || [] });
      ultimo = idx;
    } else {
      // sobrou tempo: mais questões nas disciplinas de maior peso
      const ordem = materias.map((m, i) => i).sort((a, b) => materias[b].peso - materias[a].peso || a - b);
      const idx = ordem[extra++ % ordem.length];
      blocos.push({
        materia: materias[idx].nome,
        tipo: "questoes",
        titulo: "Questões e provas anteriores de " + materias[idx].nome,
        topicos: []
      });
      ultimo = idx;
    }
  }

  // fase final: revisão ativa + simulados
  let contB = 0;
  const ponteiros = filas.map(() => 0);
  const feitosB = filas.map(() => 0);
  for (let s = slotsA; s < nLivres; s++) {
    if (contB % 5 === 4) {
      blocos.push({
        materia: "Simulado",
        tipo: "simulado",
        titulo: "Simulado cronometrado e registro dos erros no Caderno de Erros",
        topicos: []
      });
    } else {
      const cands = filas.map((f, i) => i);
      let melhor = 0;
      let melhorV = Infinity;
      cands.forEach(idx => {
        const v = feitosB[idx] / filas[idx].m.peso + (idx === ultimo ? 0.03 : 0);
        if (v < melhorV) {
          melhorV = v;
          melhor = idx;
        }
      });
      const f = filas[melhor];
      const pacote = f.pacotes[ponteiros[melhor] % f.pacotes.length];
      ponteiros[melhor]++;
      feitosB[melhor]++;
      blocos.push({
        materia: f.m.nome,
        tipo: "revisao",
        titulo: "Revisão ativa: " + pacote.join("; "),
        topicos: pacote
      });
      ultimo = melhor;
    }
    contB++;
  }

  // monta os dias
  const dias = datas.map(d => ({ data: d, blocos: [] }));
  let li = 0;
  posicoes.forEach(p => {
    if (p.semanal) {
      dias[p.di].blocos.push({
        materia: "Revisão da semana",
        tipo: "revisao_semanal",
        titulo: "Revisar o que viu na semana e refazer os erros do caderno",
        min: minBloco
      });
    } else {
      const b = blocos[li++];
      if (b) dias[p.di].blocos.push({ materia: b.materia, tipo: b.tipo, titulo: b.titulo, min: minBloco });
    }
  });
  const ultimaData = datas[datas.length - 1];
  if (prova && fim > ultimaData) {
    dias.push({
      data: fim,
      blocos: [
        {
          materia: "Véspera da prova",
          tipo: "descanso",
          titulo: "Revisão leve (resumos e mapas), documentos prontos e dormir cedo",
          min: 60
        }
      ]
    });
  }

  const cobertos = new Set();
  dias.forEach(d =>
    d.blocos.forEach(b => b.tipo === "teoria" && b.titulo.split("; ").forEach(t => cobertos.add(edNorm(t))))
  );
  const todos = new Set();
  materias.forEach(m => m.topicos.forEach(t => todos.add(edNorm(t))));
  const horasTotais =
    Math.round((dias.reduce((a, d) => a + d.blocos.reduce((x, b) => x + b.min, 0), 0) / 60) * 10) / 10;
  return {
    dias: dias.filter(d => d.blocos.length),
    materias: materias.map(m => m.nome),
    avisos,
    resumo: {
      totalDias: dias.length,
      horasTotais,
      topicosTotal: totalTopicos,
      cobertura: Math.round((cobertos.size / Math.max(1, todos.size)) * 100),
      faseRevisaoEm:
        slotsA < nLivres ? dias.find(d => d.blocos.some(b => b.tipo === "revisao"))?.data || "" : "",
      prova
    }
  };
}

const ED_ROTULO = {
  teoria: "TEORIA",
  questoes: "QUESTÕES",
  revisao: "REVISÃO",
  revisao_semanal: "REVISÃO SEMANAL",
  simulado: "SIMULADO",
  descanso: "VÉSPERA"
};

function edTextoPlano(plano, nome) {
  const dow = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  let t = `📄 Cronograma: ${nome || "Edital"}\n`;
  plano.dias.forEach(d => {
    const [a, m, dia] = d.data.split("-");
    t += `\n${dia}/${m}/${a} (${dow[edDiaSemana(d.data)]})\n`;
    d.blocos.forEach(b => {
      t += `- [${ED_ROTULO[b.tipo] || b.tipo}] ${b.materia}: ${b.titulo} (${b.min} min)\n`;
    });
  });
  return t;
}

/* ---------- 4. Tela e agenda ---------- */
const estadoEdital = {
  texto: "",
  analise: null,
  plano: null,
  carregando: false,
  msg: "",
  cfg: { horasDia: 3, diasSemana: 6, dataProva: "" }
};

function edHoje() {
  return typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
}

function edEsc(s) {
  return typeof esc === "function"
    ? esc(s)
    : String(s).replace(
        /[&<>"']/g,
        c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
      );
}

function renderAbaEditalHTML() {
  const st = estadoEdital;
  const presets = Object.keys(EXAMES_EDITAIS)
    .map(
      k =>
        `<button type="button" class="ia-concurso-preset-btn" data-edital-act="preset" data-k="${k}">${edEsc(EXAMES_EDITAIS[k].nome)}</button>`
    )
    .join("");
  const mats = st.analise
    ? `<div class="ed-passo">2. Disciplinas encontradas${st.analise.fonte === "ia" ? " (lidas pela IA)" : st.analise.fonte === "preset" ? " (modelo da prova)" : ""}</div>
      ${st.analise.aviso ? `<div class="note" style="color:#b45309;">${edEsc(st.analise.aviso)}</div>` : ""}
      <div class="ed-materias">${st.analise.materias
        .map(
          (m, i) => `<details class="ed-materia"><summary>
            <b>${edEsc(m.nome)}</b> <span class="note">${m.topicos.length} tópicos${m.sugerido ? " (sugeridos)" : ""}</span>
            <select class="ia-provider-select ed-peso" data-edital-peso="${i}" aria-label="Peso de ${edEsc(m.nome)}">
              ${[1, 2, 3].map(p => `<option value="${p}" ${m.peso === p ? "selected" : ""}>${p === 1 ? "Peso normal" : p === 2 ? "Peso alto" : "Peso máximo"}</option>`).join("")}
            </select>
            <button type="button" class="ia-tag-materia-remover" data-edital-act="remover" data-i="${i}" title="Remover disciplina">&times;</button>
          </summary><ul class="ed-topicos">${m.topicos.map(t => `<li>${edEsc(t)}</li>`).join("")}</ul></details>`
        )
        .join("")}</div>
      <div class="ed-passo">3. Seu ritmo</div>
      <div class="ed-config">
        <label class="ia-label-titulo">Data da prova <input type="date" id="ed-data" class="ia-add-materia-input" value="${edEsc(st.cfg.dataProva)}" /></label>
        <div><span class="ia-label-titulo">Horas por dia</span><div class="ia-pill-select-group">${[
          2, 3, 4, 5, 6
        ]
          .map(
            h =>
              `<button type="button" class="ia-pill-select-btn ${st.cfg.horasDia === h ? "ativo" : ""}" data-edital-act="horas" data-v="${h}">${h}h</button>`
          )
          .join("")}</div></div>
        <div><span class="ia-label-titulo">Dias por semana</span><div class="ia-pill-select-group">${[
          3, 4, 5, 6, 7
        ]
          .map(
            d =>
              `<button type="button" class="ia-pill-select-btn ${st.cfg.diasSemana === d ? "ativo" : ""}" data-edital-act="dias" data-v="${d}">${d}d</button>`
          )
          .join("")}</div></div>
      </div>
      <button type="button" class="btn primary" style="width:100%;font-weight:800;" data-edital-act="gerar">📅 Gerar cronograma</button>`
    : "";
  const plano = st.plano ? renderPlanoEditalHTML(st.plano) : "";
  return `<div class="ed-wrap">
    <div class="ed-passo">1. Qual é a prova?</div>
    <div class="ia-concurso-presets">${presets}</div>
    <div class="note" style="margin:8px 0 4px;">ou cole o conteúdo programático do edital:</div>
    <textarea id="ed-texto" class="ed-texto" rows="7" maxlength="60000" placeholder="Cole aqui o conteúdo programático do edital (disciplinas e tópicos)...">${edEsc(st.texto)}</textarea>
    <div class="ed-linha">
      <label class="btn small" for="ed-arquivo">📎 Abrir arquivo .txt</label>
      <input type="file" id="ed-arquivo" accept=".txt,.md,text/plain" hidden />
      <button type="button" class="btn small primary" data-edital-act="analisar" ${st.carregando ? "disabled" : ""}>${st.carregando ? "⏳ Lendo..." : "🔎 Analisar edital"}</button>
    </div>
    <div class="note">Dica: abra o PDF do edital, copie o "Conteúdo Programático" e cole aqui. Entrando na conta, a IA organiza por disciplina; sem conta, uso o leitor do aparelho.</div>
    ${st.msg ? `<div class="ed-msg" role="status">${edEsc(st.msg)}</div>` : ""}
    ${mats}
    ${plano}
  </div>`;
}

function renderPlanoEditalHTML(p) {
  const dow = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const r = p.resumo;
  const primeiros = p.dias.slice(0, 14);
  return `<div class="ed-plano">
    <div class="ed-passo">4. Seu cronograma</div>
    <div class="ed-resumo"><b>${r.totalDias}</b> dias de estudo · <b>${r.horasTotais}h</b> no total · <b>${r.topicosTotal}</b> tópicos (cobertura ${r.cobertura}%)${r.prova ? ` · prova em ${r.prova.split("-").reverse().join("/")}` : ""}</div>
    ${p.avisos.map(a => `<div class="note" style="color:#b45309;">⚠️ ${edEsc(a)}</div>`).join("")}
    <div class="ed-dias">${primeiros
      .map(
        d =>
          `<div class="ed-dia"><div class="ed-dia-topo">${d.data.split("-").reverse().slice(0, 2).join("/")} · ${dow[edDiaSemana(d.data)]}</div>${d.blocos
            .map(
              b =>
                `<div class="ed-bloco ed-${b.tipo}"><span class="ed-tag">${ED_ROTULO[b.tipo] || b.tipo}</span> <b>${edEsc(b.materia)}</b>: ${edEsc(b.titulo)} <span class="note">${b.min} min</span></div>`
            )
            .join("")}</div>`
      )
      .join("")}</div>
    ${p.dias.length > 14 ? `<div class="note">Mostrando os 14 primeiros dias de ${p.dias.length}. O cronograma inteiro fica salvo e você importa aos poucos.</div>` : ""}
    <div class="ed-linha">
      <button type="button" class="btn primary" data-edital-act="importar">📲 Importar próximas 2 semanas</button>
      <button type="button" class="btn small" data-edital-act="copiar">📋 Copiar tudo</button>
    </div>
  </div>`;
}

function atualizarAbaEdital() {
  const box = document.getElementById("ia-conteudo-aba-desdobrador");
  if (
    box &&
    typeof estadoPlanejadorEstudos !== "undefined" &&
    estadoPlanejadorEstudos.abaAtiva === "edital"
  ) {
    box.innerHTML = renderAbaEditalHTML();
  }
}

function abrirEditalPrumo() {
  if (typeof estadoPlanejadorEstudos !== "undefined") estadoPlanejadorEstudos.abaAtiva = "edital";
  if (typeof abrirDesdobradorMetasIA === "function") abrirDesdobradorMetasIA();
}

function edDefinirAnalise(a) {
  estadoEdital.analise = a;
  estadoEdital.plano = null;
  if (a && a.dataProva && !estadoEdital.cfg.dataProva) estadoEdital.cfg.dataProva = a.dataProva;
}

async function edAnalisar() {
  const st = estadoEdital;
  const ta = document.getElementById("ed-texto");
  if (ta) st.texto = ta.value;
  if (st.texto.trim().length < 20) {
    st.msg = "Cole o texto do edital (ou escolha uma prova acima).";
    return atualizarAbaEdital();
  }
  st.carregando = true;
  st.msg = "";
  atualizarAbaEdital();
  const a = await analisarEdital(st.texto, edHoje());
  st.carregando = false;
  if (!a.materias.length) {
    st.msg =
      "Não achei disciplinas com tópicos nesse texto. Confira se colou o conteúdo programático (disciplinas em linhas separadas).";
    st.analise = null;
  } else {
    edDefinirAnalise(a);
    st.msg = `Encontrei ${a.materias.length} disciplinas e ${a.materias.reduce((x, m) => x + m.topicos.length, 0)} tópicos. Confira, ajuste o peso e gere o cronograma.`;
  }
  atualizarAbaEdital();
}

function edGerar() {
  const st = estadoEdital;
  const di = document.getElementById("ed-data");
  if (di) st.cfg.dataProva = di.value;
  const r = gerarCronogramaEdital({
    materias: st.analise.materias,
    horasDia: st.cfg.horasDia,
    diasSemana: st.cfg.diasSemana,
    dataProva: st.cfg.dataProva,
    inicio: edHoje()
  });
  if (r.erro) {
    st.msg = r.erro;
    st.plano = null;
  } else {
    st.plano = r;
    st.msg = "";
  }
  atualizarAbaEdital();
}

/** Guarda o cronograma completo (compacto) no estado e cria as tarefas dos próximos dias */
function importarCronogramaEdital(plano, nome, dias = 14) {
  if (typeof S === "undefined" || !S || !plano || !Array.isArray(plano.dias)) return { ok: false, n: 0 };
  if (!Array.isArray(S.tasks)) S.tasks = [];
  if (!Array.isArray(S.subjects)) S.subjects = [];
  const hoje = edHoje();
  const guardado =
    S.cronogramaEdital && S.cronogramaEdital.dias && S.cronogramaEdital.nome === (nome || "Edital")
      ? S.cronogramaEdital
      : null;
  S.cronogramaEdital = {
    nome: edLimparStr(nome || "Edital", 80),
    prova: plano.resumo.prova || "",
    criado: hoje,
    materias: plano.materias,
    dias: plano.dias.map(d => ({ d: d.data, b: d.blocos.map(b => [b.materia, b.tipo, b.titulo, b.min]) })),
    importadoAte: guardado ? guardado.importadoAte : ""
  };
  return importarProximosDiasEdital(dias);
}

function importarProximosDiasEdital(dias = 14) {
  if (typeof S === "undefined" || !S || !S.cronogramaEdital) return { ok: false, n: 0 };
  const c = S.cronogramaEdital;
  const hoje = edHoje();
  const de = c.importadoAte && c.importadoAte >= hoje ? edSomarDias(c.importadoAte, 1) : hoje;
  const ate = edSomarDias(de, dias - 1);
  const cores =
    typeof SUBJ_COLORS !== "undefined" && Array.isArray(SUBJ_COLORS)
      ? SUBJ_COLORS
      : ["#2F6FD6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#6366F1"];
  (c.materias || []).forEach(nome => {
    if (!S.subjects.some(s => edNorm(s.name) === edNorm(nome))) {
      S.subjects.push({
        id: typeof newId === "function" ? newId() : "s_" + Math.random().toString(36).slice(2, 9),
        name: nome,
        color: cores[S.subjects.length % cores.length]
      });
    }
  });
  let n = 0;
  c.dias.forEach(dia => {
    if (dia.d < de || dia.d > ate) return;
    dia.b.forEach((b, i) => {
      const id = `ed_${dia.d}_${i}`;
      if (S.tasks.some(t => t.id === id)) return;
      const rotulo = ED_ROTULO[b[1]] || String(b[1]).toUpperCase();
      S.tasks.push({
        id,
        title: edLimparStr(`[${rotulo}] ${b[0]}: ${b[2]} (${b[3]}m)`, 140),
        date: dia.d,
        done: false,
        area: "estudos",
        prio: b[1] === "simulado" ? 3 : b[1] === "questoes" ? 2 : 1,
        sub: [],
        xp: b[1] === "simulado" ? 60 : b[1] === "questoes" ? 40 : 30,
        tag: "estudo"
      });
      n++;
    });
  });
  c.importadoAte = ate;
  if (typeof commit === "function") commit();
  return { ok: true, n, ate };
}

function edAposImportar(r) {
  if (typeof toast === "function") {
    toast(
      r.n
        ? `📄 ${r.n} blocos de estudo foram para a sua agenda até ${r.ate.split("-").reverse().slice(0, 2).join("/")}.`
        : "Esses dias já estavam na agenda.",
      false,
      "happy"
    );
  }
  if (typeof fecharDesdobradorMetasIA === "function") fecharDesdobradorMetasIA();
  if (typeof render === "function") render();
}

/** Cartão da aba Hoje: avisa quando as tarefas importadas estão acabando */
function cartaoEditalHojeHTML() {
  if (typeof S === "undefined" || !S || !S.cronogramaEdital || !Array.isArray(S.cronogramaEdital.dias))
    return "";
  const c = S.cronogramaEdital;
  const hoje = edHoje();
  const restam = c.dias.filter(d => d.d > (c.importadoAte || hoje)).length;
  const diasProva = c.prova ? Math.round((edIsoParaData(c.prova) - edIsoParaData(hoje)) / 864e5) : null;
  if (diasProva !== null && diasProva < 0) return "";
  const precisa = restam > 0 && (!c.importadoAte || c.importadoAte < edSomarDias(hoje, 3));
  return `<div class="card ed-card-hoje"><div><b>📄 ${edEsc(c.nome)}</b>${diasProva !== null ? ` · faltam ${diasProva} dias para a prova` : ""}</div>${
    precisa
      ? `<button class="btn small primary" data-edital-act="importar-mais">Importar mais 2 semanas</button>`
      : `<span class="note">Cronograma em dia na agenda.</span>`
  }</div>`;
}

if (typeof document !== "undefined") {
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-edital-act]");
    if (!b) return;
    const st = estadoEdital;
    const act = b.getAttribute("data-edital-act");
    if (act === "abrir") return abrirEditalPrumo();
    if (act === "importar-mais") {
      const r = importarProximosDiasEdital(14);
      if (typeof toast === "function")
        toast(r.n ? `📄 Mais ${r.n} blocos na agenda.` : "Nada novo para importar.", false, "happy");
      if (typeof render === "function") render();
      return;
    }
    if (act === "preset") {
      const ta = document.getElementById("ed-texto");
      if (ta) st.texto = ta.value;
      const p = montarPresetEdital(b.getAttribute("data-k"));
      if (p) {
        edDefinirAnalise(p);
        st.msg = `${p.nome}: usei o modelo da prova. Cole o edital oficial para um cronograma exato.`;
      }
      return atualizarAbaEdital();
    }
    if (act === "analisar") return edAnalisar();
    if (act === "remover") {
      st.analise.materias.splice(+b.getAttribute("data-i"), 1);
      st.plano = null;
      if (!st.analise.materias.length) st.analise = null;
      return atualizarAbaEdital();
    }
    if (act === "horas") {
      st.cfg.horasDia = +b.getAttribute("data-v");
      const di = document.getElementById("ed-data");
      if (di) st.cfg.dataProva = di.value;
      return atualizarAbaEdital();
    }
    if (act === "dias") {
      st.cfg.diasSemana = +b.getAttribute("data-v");
      const di = document.getElementById("ed-data");
      if (di) st.cfg.dataProva = di.value;
      return atualizarAbaEdital();
    }
    if (act === "gerar") return edGerar();
    if (act === "importar" && st.plano) {
      const nome = (st.analise && st.analise.nome) || "Edital";
      return edAposImportar(importarCronogramaEdital(st.plano, nome, 14));
    }
    if (act === "copiar" && st.plano) {
      const t = edTextoPlano(st.plano, (st.analise && st.analise.nome) || "Edital");
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(t).catch(() => {});
      if (typeof toast === "function") toast("📋 Cronograma copiado!", false, "happy");
    }
  });
  document.addEventListener("input", e => {
    if (e.target && e.target.id === "ed-texto") estadoEdital.texto = e.target.value;
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (!t) return;
    if (t.id === "ed-data") estadoEdital.cfg.dataProva = t.value;
    if (t.hasAttribute && t.hasAttribute("data-edital-peso") && estadoEdital.analise) {
      const m = estadoEdital.analise.materias[+t.getAttribute("data-edital-peso")];
      if (m) m.peso = edClamp(+t.value || 1, 1, 3);
      estadoEdital.plano = null;
    }
    if (t.id === "ed-arquivo" && t.files && t.files[0]) {
      const f = t.files[0];
      if (f.size > 1.5 * 1024 * 1024) {
        estadoEdital.msg = "Arquivo grande demais. Cole só o conteúdo programático.";
        return atualizarAbaEdital();
      }
      const fr = new FileReader();
      fr.onload = () => {
        estadoEdital.texto = String(fr.result || "").slice(0, 60000);
        estadoEdital.msg = `Arquivo "${edLimparStr(f.name, 60)}" aberto. Toque em Analisar edital.`;
        atualizarAbaEdital();
      };
      fr.readAsText(f);
    }
  });
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    TOPICOS_PADRAO,
    EXAMES_EDITAIS,
    buscarTopicosPadrao,
    montarPresetEdital,
    analisarEditalLocal,
    analisarEdital,
    edValidarResultadoIA,
    gerarCronogramaEdital,
    edTextoPlano,
    renderAbaEditalHTML,
    abrirEditalPrumo,
    importarCronogramaEdital,
    importarProximosDiasEdital,
    cartaoEditalHojeHTML,
    estadoEdital
  });
}
