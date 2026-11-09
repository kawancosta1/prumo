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
  "vendas e negociacao": [
    "Estratégias de marketing, segmentação de mercado e composto mercadológico (4 Ps)",
    "Qualidade em serviços bancários, satisfação, valor e retenção de clientes",
    "Técnicas de vendas de produtos e serviços financeiros (cross-selling e up-selling)",
    "Negociação, manejo de objeções e experiência do cliente (Customer Experience)",
    "Ética em vendas, conduta comercial e autorregulação bancária (SARB/FEBRABAN)",
    "Código de Defesa do Consumidor (Lei 8.078/1990) e Resolução CMN nº 4.949/2021",
    "Estatuto da Pessoa com Deficiência (Lei 13.146/2015) e Ouvidoria Bancária",
    "Canais digitais, atendimento omnichannel e marketing digital bancário"
  ],
  "atualidades do mercado financeiro": [
    "Os bancos na Era Digital: internet banking, mobile banking e bancos digitais",
    "Open Finance (Sistema Financeiro Aberto) e compartilhamento de dados",
    "Pix, arranjos de pagamento instantâneo e Drex (Real Digital)",
    "Fintechs, startups financeiras, SCD e SEP",
    "Marketplace, correspondente bancário e shadow banking",
    "Moedas digitais, blockchain, criptoativos e cibersegurança financeira",
    "Transformação digital, ESG e finanças sustentáveis no setor bancário"
  ],
  estatistica: [
    "Medidas de posição e dispersão",
    "Probabilidade",
    "Distribuições",
    "Amostragem e inferência",
    "Correlação e regressão"
  ],
  "administracao financeira e orcamentaria": [
    "Orçamento público: conceitos, princípios e ciclo orçamentário",
    "PPA, LDO e LOA na Constituição Federal",
    "Receita pública: classificação, estágios e renúncia de receita",
    "Despesa pública: classificação, empenho, liquidação e pagamento",
    "Restos a pagar, despesas de exercícios anteriores e suprimento de fundos",
    "Créditos adicionais (suplementares, especiais e extraordinários)",
    "Lei de Responsabilidade Fiscal (LC 101/2000) e Lei 4.320/1964"
  ],
  "direito processual civil": [
    "Normas processuais civis, jurisdição e ação",
    "Competência, partes, procuradores e litisconsórcio",
    "Intervenção de terceiros, juiz e Ministério Público",
    "Atos processuais, prazos, citações e intimações",
    "Tutela provisória (urgência e evidência)",
    "Procedimento comum: petição inicial, contestação, provas e sentença",
    "Cumprimento de sentença e processo de execução",
    "Recursos no Processo Civil e processos nos tribunais"
  ],
  "direitos humanos": [
    "Teoria geral, histórico e gerações/dimensões dos Direitos Humanos",
    "Declaração Universal dos Direitos Humanos (1948)",
    "Convenção Americana sobre Direitos Humanos (Pacto de São José da Costa Rica)",
    "Incorporação de tratados internacionais de Direitos Humanos no Direito Brasileiro",
    "Sistema Global (ONU) e Sistema Interamericano de Proteção",
    "Grupos vulneráveis, igualdade racial e proteção às minorias"
  ],
  "legislacao do sus": [
    "Seguridade Social e Saúde na Constituição Federal (arts. 196 a 200)",
    "Lei Orgânica da Saúde (Lei 8.080/1990): princípios, diretrizes e atribuições",
    "Participação da comunidade e financiamento do SUS (Lei 8.142/1990)",
    "Decreto 7.508/2011: regiões de saúde, redes de atenção e COAP",
    "Política Nacional de Atenção Básica (PNAB) e Estratégia Saúde da Família",
    "Vigilância epidemiológica, sanitária, ambiental e saúde do trabalhador"
  ],
  "conhecimentos pedagogicos": [
    "Lei de Diretrizes e Bases da Educação Nacional (LDB - Lei 9.394/1996)",
    "Estatuto da Criança e do Adolescente (ECA - Lei 8.069/1990)",
    "Base Nacional Comum Curricular (BNCC) e Diretrizes Curriculares Nacionais",
    "Tendências pedagógicas e teorias da aprendizagem (Piaget, Vygotsky, Wallon)",
    "Didática, planejamento escolar e Projeto Político-Pedagógico (PPP)",
    "Avaliação da aprendizagem: diagnóstica, formativa e somativa",
    "Educação inclusiva e atendimento educacional especializado"
  ],
  arquivologia: [
    "Conceitos fundamentais de Arquivologia e teoria das três idades",
    "Gestão de documentos: protocolo, classificação e ordenação",
    "Tabela de temporalidade e destinação de documentos",
    "Preservação, conservação, microfilmagem e digitalização de acervos"
  ],
  "redacao oficial": [
    "Atributos da Redação Oficial: clareza, precisão, objetividade, concisão e impessoalidade",
    "Uso dos pronomes de tratamento e endereçamento",
    "Padrão Ofício, memorando, exposição de motivos e mensagem",
    "Manual de Redação da Presidência da República"
  ]
};

const ALIAS_DISCIPLINAS = {
  portugues: "lingua portuguesa",
  rlm: "raciocinio logico",
  "raciocinio logico matematico": "raciocinio logico",
  "raciocinio logico e matematico": "raciocinio logico",
  "matematica e suas tecnologias": "matematica",
  "tecnologia da informacao": "informatica",
  ti: "informatica",
  "nocoes de informatica": "informatica",
  "conhecimentos de informatica": "informatica",
  "conhecimentos basicos de informatica": "informatica",
  "conhecimentos basicos bancarios": "conhecimentos bancarios",
  "etica profissional": "etica no servico publico",
  "etica e legislacao": "etica no servico publico",
  "lingua inglesa": "ingles",
  "probabilidade e estatistica": "estatistica",
  "atendimento e vendas": "vendas e negociacao",
  vendas: "vendas e negociacao",
  afo: "administracao financeira e orcamentaria",
  "orcamento publico": "administracao financeira e orcamentaria",
  "administracao financeira e orcamentaria afo": "administracao financeira e orcamentaria",
  dpc: "direito processual civil",
  "processo civil": "direito processual civil",
  "processo penal": "direito processual penal",
  "saude publica": "legislacao do sus",
  sus: "legislacao do sus",
  "sistema unico de saude": "legislacao do sus",
  "legislacao educacional": "conhecimentos pedagogicos",
  pedagogia: "conhecimentos pedagogicos",
  didatica: "conhecimentos pedagogicos",
  "nocoes de arquivologia": "arquivologia",
  "nocoes de administracao": "administracao publica",
  "administracao geral": "administracao publica",
  "administracao geral e publica": "administracao publica"
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
      ["Vendas e Negociação", 3],
      ["Conhecimentos Bancários", 3],
      ["Informática", 3],
      ["Língua Portuguesa", 2],
      ["Matemática Financeira", 2],
      ["Matemática", 1],
      ["Atualidades do Mercado Financeiro", 1],
      ["Língua Inglesa", 1, "ingles"]
    ]
  },
  bb_comercial: {
    nome: "Banco do Brasil (Agente Comercial)",
    materias: [
      ["Vendas e Negociação", 3],
      ["Conhecimentos Bancários", 3],
      ["Conhecimentos de Informática", 3, "informatica"],
      ["Língua Portuguesa", 2],
      ["Matemática Financeira", 2],
      ["Matemática", 1],
      ["Atualidades do Mercado Financeiro", 1],
      ["Língua Inglesa", 1, "ingles"]
    ]
  },
  bb_ti: {
    nome: "Banco do Brasil (Agente de TI)",
    materias: [
      ["Tecnologia da Informação", 3, "informatica"],
      ["Conhecimentos Bancários", 2],
      ["Probabilidade e Estatística", 2, "estatistica"],
      ["Língua Portuguesa", 2],
      ["Matemática", 1],
      ["Atualidades do Mercado Financeiro", 1],
      ["Língua Inglesa", 1, "ingles"]
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
  /^(anexo|edital|concurso|selecao|processo\s+seletivo|prefeitura|tribunal|governo|ministerio|secretaria|banco\s+do\s+brasil|cargo|perfil|opcao|inscri|isen|cota|reserva|deficien|atendimento\s+especial|prova|etapa|fase|quadro|tabela|requisitos|atribui|remunera|vagas|cronograma|bibliografia|referencias|observa|disposicoes|pagina|capitulo|titulo|sumario|conhecimentos\s+basicos$|conhecimentos\s+especificos$|conhecimentos\s+gerais$|parte\s+[ivx\d]+|bloco\s+[ivx\d]+|modulo\s+[ivx\d]+|d[ao]s?\s+(?:inscri|vagas|provas|pessoas|candidat|recursos|classifica|contrata|disposicoes|etapas|avaliac|requisitos|atribui|remunera|homologa|convoca|atendimento|objetos\s+de\s+avaliac))\b/;
const ED_PALAVRAS_DISCIPLINA =
  /^(lingua|portugues|matematica|raciocinio|informatica|tecnologia|direito|direitos|legislacao|conhecimentos|atualidades|vendas|negociacao|atendimento|marketing|probabilidade|fisica|quimica|biologia|historia|geografia|filosofia|sociologia|ingles|espanhol|redacao|literatura|contabilidade|administracao|orcamento|afo|economia|estatistica|etica|nocoes|arquivologia|auditoria|gestao|ciencias|educacao|pedagogia|didatica|enfermagem|saude|sus|medicina|criminologia|engenharia|arquitetura|banco|financas|computacao|programacao|algoritmos|redes|seguranca|sistemas|governanca|politicas\s+publicas|eixo\s+tematico)\b/;
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

/**
 * Detecta se uma linha indica início de bloco comum, bloco de conhecimentos específicos
 * ou um cargo/área/especialidade (qualquer banca: Cebraspe, FGV, FCC, Vunesp, Cesgranrio, Tribunais, Polícias, Prefeituras, Bancos).
 */
function edDetectarCargo(l) {
  const semNum = l.replace(/^(?:\d{1,2}[.)]|[IVX]{1,4}\s*[-–.)])\s+/, "").trim();
  const n = edNorm(semNum.replace(/:$/, ""));
  if (
    /^(?:conhecimentos\s+basicos|conhecimentos\s+gerais|disciplinas\s+comuns|parte\s+comum|comum\s+a\s+todos|modulo\s+[ivx\d]+\s*[-–:]?\s*conhecimentos\s+(?:basicos|gerais))\b/.test(
      n
    )
  ) {
    return { tipo: "comum" };
  }
  if (/^(?:conhecimentos\s+especificos|parte\s+especifica|disciplinas\s+especificas)$/.test(n)) {
    return { tipo: "especificos" };
  }
  const mCargoExplicito =
    /^(?:cargo|cargos|perfil|op[cç][aã]o|fun[cç][aã]o|emprego|especialidade|[aá]rea(?:\s+de\s+atua[cç][aã]o|\s+de\s+conhecimento)?|habilita[cç][aã]o|conhecimentos\s+espec[ií]ficos(?:\s+para\s+o\s+cargo(?:\s+de)?)?)(?:\s+\d+)?\s*[:–—-]\s*(.{3,75})$/i.exec(
      semNum
    );
  if (mCargoExplicito) {
    const cand = mCargoExplicito[1].trim();
    const nCand = edNorm(cand);
    if (!TOPICOS_PADRAO[nCand] && !ALIAS_DISCIPLINAS[nCand] && !ED_PALAVRAS_DISCIPLINA.test(nCand)) {
      return { tipo: "cargo", nome: edTitulo(cand) };
    }
  }
  // Nomes de cargos de qualquer carreira (Tribunais, Polícias, Fiscais, Bancos, Prefeituras, Saúde, Educação, Autarquias)
  if (
    semNum.length <= 80 &&
    !/[.;]$/.test(semNum) &&
    (edRazaoMaiuscula(semNum) >= 0.8 || /:$/.test(semNum)) &&
    !TOPICOS_PADRAO[n] &&
    !ALIAS_DISCIPLINAS[n] &&
    !ED_PALAVRAS_DISCIPLINA.test(n) &&
    !/^agentes?\s+publicos?\b/.test(n)
  ) {
    const mCarreira =
      /^(?:cargo\s*\d*\s*[-–—:.\s]*)?(?:escritur[aá]rio\s*[-–—:]\s*)?((?:analista|t[eé]cnico|auditor(?:[- ]fiscal)?|agente|escriv[aã]o|delegado|inspetor|investigador|perito|papiloscopista|procurador|defensor|promotor|juiz|oficial|assistente|auxiliar|especialista|fiscal|gestor|contador|enfermeiro|m[eé]dico|professor|pedagogo|engenheiro|arquiteto|advogado|psic[oó]logo|farmac[eê]utico|odont[oó]logo|cirurgi[aã]o|nutricionista|fisioterapeuta|motorista|guarda|soldado)\b.{0,65}?)\s*:?$/i.exec(
        semNum
      );
    if (mCarreira) {
      return { tipo: "cargo", nome: edTitulo(mCarreira[1]) };
    }
  }
  return null;
}

/**
 * Localiza o início real do Conteúdo Programático em editais extensos de qualquer banca
 * (Cesgranrio, Cebraspe/CESPE "Objetos de Avaliação", FGV, FCC, Vunesp, CNU, Prefeituras)
 * e descarta anexos administrativos posteriores (modelos de atestado, autodeclaração, cronograma, vagas).
 */
function edRecortarConteudoProgramatico(bruto) {
  const txt = String(bruto || "");
  if (txt.length < 600) return txt;
  const reHeading =
    /^[ \t]*(?:(?:anexo\s+[ivx\d]+|\d{1,2}(?:\.\d{1,2})?)\s*[-–—:.\s]*)?(?:d[ao]s?\s+)?(?:conte[uú]dos?\s+program[aá]ticos?|objetos?\s+de\s+avalia[cç][aã]o|programa\s+d[ea]s?\s+(?:provas?|disciplinas?)|rela[cç][aã]o\s+d[ea]s?\s+(?:mat[eé]rias|disciplinas))\b[^\n]*$/gim;
  let ultimoIndiceValido = -1;
  let m;
  while ((m = reHeading.exec(txt))) {
    const linha = m[0].trim();
    if (linha.length <= 105 && !/[.;]$/.test(linha) && txt.length - m.index >= 120) {
      ultimoIndiceValido = m.index;
    }
  }
  let recorte = ultimoIndiceValido > 0 ? txt.slice(ultimoIndiceValido) : txt;

  // Cortar anexos administrativos posteriores que vêm depois do conteúdo programático
  const reAnexoPosterior =
    /^[ \t]*anexo\s+[ivx\d]+\s*[-–—:.\s]+(?:modelo|declara[cç][aã]o|autodeclara[cç][aã]o|formul[aá]rio|requerimento|cronograma|quadro\s+de\s+vagas|atribui[cç][oõ]es|descri[cç][aã]o\s+sum[aá]ria|endere[cç]os|avalia[cç][aã]o\s+de\s+t[ií]tulos|prova\s+de\s+t[ií]tulos)\b[^\n]*$/gim;
  const mFim = reAnexoPosterior.exec(recorte.slice(120));
  if (mFim && mFim.index > 80) {
    recorte = recorte.slice(0, mFim.index + 120);
  }
  return recorte;
}

/** Devolve o nome da disciplina se a linha for um cabeçalho; "" se for conteúdo; null se for separador */
function edCabecalho(l) {
  let m = /^(?:disciplina|mat[eé]ria)\s*[:\-–]\s*(.{3,80})$/i.exec(l);
  if (m) return edTitulo(m[1]);
  const semNum = l.replace(/^(?:\d{1,2}[.)]|[IVX]{1,4}\s*[-–.)])\s+/, "").trim();
  const n = edNorm(semNum.replace(/:$/, ""));
  if (edDetectarCargo(l)) return null;
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
    // Suporta tanto separação por ";" / "." quanto numeração inline estilo Cebraspe ("1 Tópico A. 2 Tópico B. 3.1 Tópico C")
    const temMarcadorInline = /(?:^|[.;]\s+|\s+)\d{1,2}(?:\.\d{1,2}){0,2}[.)]?\s+[A-ZÀ-Ý]/.test(it);
    const partes =
      it.length > 140 || it.includes(";") || temMarcadorInline
        ? it.split(
            /;|\.\s+(?=(?:\d{1,2}(?:\.\d{1,2}){0,2}[.)]?\s+)?[A-ZÀ-Ý])|\s+(?=\d{1,2}(?:\.\d{1,2}){0,2}[.)]?\s+[A-ZÀ-Ý][a-zà-ÿ]{2,})/
          )
        : [it];
    partes.forEach(p => {
      const t = p
        .replace(/\s+/g, " ")
        .replace(ED_MARCADOR, "")
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

function edPesoPadrao(nome, ehEspecifico) {
  const n = edNorm(nome);
  if (
    ehEspecifico ||
    /vendas|negociacao|conhecimentos bancarios|conhecimentos basicos bancarios|tecnologia da informacao|conhecimentos de informatica|conhecimentos basicos de informatica|especific|redacao$|direito penal|direito processual|direito tributario|direito civil|direito previdenciario|contabilidade|auditoria|orcamento|afo|legislacao do sus|conhecimentos pedagogicos|eixo tematico/.test(
      n
    )
  ) {
    return 3;
  }
  if (
    /portugues|matematica|raciocinio|direito constitucional|direito administrativo|probabilidade|estatistica|informatica|administracao|economia|arquivologia|fisica|quimica|biologia|historia|geografia/.test(
      n
    )
  ) {
    return 2;
  }
  return 1;
}

/** Decodifica strings literais (texto) e hexadecimais <FEFF...> de operadores de texto PDF (Tj / TJ) */
function edDecodificarLiteralPDF(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "\\" && i + 1 < str.length) {
      const nx = str[i + 1];
      if (nx >= "0" && nx <= "7") {
        const oct = str.slice(i + 1, i + 4).match(/^[0-7]{1,3}/)[0];
        out += String.fromCharCode(parseInt(oct, 8));
        i += oct.length;
      } else if (nx === "n") {
        out += "\n";
        i++;
      } else if (nx === "r") {
        out += "\r";
        i++;
      } else if (nx === "t") {
        out += " ";
        i++;
      } else if (nx === "\n" || nx === "\r") {
        i++;
      } else {
        out += nx;
        i++;
      }
    } else {
      out += ch;
    }
  }
  return out;
}

function edDecodificarHexPDF(hex) {
  const limpo = hex.replace(/[^0-9A-Fa-f]/g, "");
  if (!limpo) return "";
  if (limpo.toUpperCase().startsWith("FEFF")) {
    let out = "";
    for (let i = 4; i + 3 < limpo.length; i += 4) {
      out += String.fromCharCode(parseInt(limpo.slice(i, i + 4), 16));
    }
    return out;
  }
  let out = "";
  for (let i = 0; i + 1 < limpo.length; i += 2) {
    out += String.fromCharCode(parseInt(limpo.slice(i, i + 2), 16));
  }
  return out;
}

function edExtrairOperadoresTextoPDF(conteudoStream) {
  const linhas = [];
  let linhaAtual = "";
  const temBT = /(?:^|[\s\r\n])BT(?=[\s\r\n([]|$)/.test(conteudoStream);
  let dentroBT = !temBT;
  const reToken = /\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]+>|\[(?:\\.|[^\]])*\]\s*TJ|\b(?:BT|ET|Td|TD)\b|T\*|'/g;
  let m;
  while ((m = reToken.exec(conteudoStream))) {
    const tok = m[0];
    if (tok === "BT") {
      dentroBT = true;
      continue;
    }
    if (tok === "ET") {
      if (linhaAtual.trim()) {
        linhas.push(linhaAtual.trim());
        linhaAtual = "";
      }
      if (temBT) dentroBT = false;
      continue;
    }
    if (!dentroBT) continue;
    if (tok === "Td" || tok === "TD" || tok === "T*" || tok === "'") {
      if (linhaAtual.trim()) {
        linhas.push(linhaAtual.trim());
        linhaAtual = "";
      }
    } else if (tok.startsWith("(") && tok.endsWith(")")) {
      linhaAtual += edDecodificarLiteralPDF(tok.slice(1, -1));
    } else if (tok.startsWith("<") && tok.includes(">")) {
      linhaAtual += edDecodificarHexPDF(tok.slice(1, tok.indexOf(">")));
    } else if (tok.startsWith("[")) {
      const subRe = /\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]+>|(-?\d+(?:\.\d+)?)/g;
      let sm;
      while ((sm = subRe.exec(tok))) {
        const st = sm[0];
        if (st.startsWith("(")) {
          linhaAtual += edDecodificarLiteralPDF(st.slice(1, -1));
        } else if (st.startsWith("<")) {
          linhaAtual += edDecodificarHexPDF(st.slice(1, -1));
        } else if (sm[1] && parseFloat(sm[1]) < -120) {
          linhaAtual += " ";
        }
      }
    }
  }
  if (linhaAtual.trim()) {
    linhas.push(linhaAtual.trim());
  }
  return linhas.join("\n");
}

function edBytesParaLatin1(bytes) {
  if (typeof TextDecoder !== "undefined") {
    try {
      return new TextDecoder("latin1").decode(bytes);
    } catch (_) {}
  }
  let out = "";
  const tam = bytes.length;
  const bloco = 8192;
  for (let i = 0; i < tam; i += bloco) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + bloco, tam)));
  }
  return out;
}

async function edDescomprimirBytes(bytes, formato) {
  if (typeof DecompressionStream === "undefined") return null;
  try {
    const ds = new DecompressionStream(formato);
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();
    const resp = new Response(ds.readable);
    const ab = await resp.arrayBuffer();
    return new Uint8Array(ab);
  } catch (_) {
    return null;
  }
}

/**
 * Extrai o texto de um arquivo PDF (ou .txt/.md), funcionando tanto online (via pdf.js quando disponível)
 * quanto 100% offline no navegador/dispositivo via parser nativo de streams PDF.
 */
async function extrairTextoDePDF(entrada) {
  if (!entrada) return "";
  if (typeof entrada === "string") {
    if (!entrada.startsWith("%PDF-")) return entrada;
    return edExtrairOperadoresTextoPDF(entrada);
  }

  // Se for arquivo de texto simples (.txt / .md)
  if (
    entrada &&
    typeof entrada.name === "string" &&
    /\.(txt|md)$/i.test(entrada.name) &&
    typeof entrada.text === "function"
  ) {
    return await entrada.text();
  }

  let bytes;
  if (entrada instanceof Uint8Array) {
    bytes = entrada;
  } else if (entrada instanceof ArrayBuffer) {
    bytes = new Uint8Array(entrada);
  } else if (entrada && typeof entrada.arrayBuffer === "function") {
    bytes = new Uint8Array(await entrada.arrayBuffer());
  } else if (typeof FileReader !== "undefined" && entrada instanceof Blob) {
    bytes = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(new Uint8Array(fr.result));
      fr.onerror = () => reject(new Error("Falha ao ler arquivo"));
      fr.readAsArrayBuffer(entrada);
    });
  } else {
    return "";
  }

  // Verificar assinatura %PDF-
  const cabecalhoAscii = String.fromCharCode(...bytes.slice(0, Math.min(8, bytes.length)));
  if (!cabecalhoAscii.startsWith("%PDF-")) {
    try {
      return new TextDecoder("utf-8").decode(bytes);
    } catch (_) {
      return String.fromCharCode(...bytes.slice(0, 60000));
    }
  }

  // 1. Se pdfjsLib estiver carregado na janela, usar extração completa página a página
  if (typeof window !== "undefined" && window.pdfjsLib && typeof window.pdfjsLib.getDocument === "function") {
    try {
      const doc = await window.pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      const paginasTxt = [];
      const maxPag = Math.min(doc.numPages || 1, 250);
      for (let p = 1; p <= maxPag; p++) {
        const page = await doc.getPage(p);
        const tc = await page.getTextContent();
        let ultY = null;
        let buf = "";
        for (const item of tc.items || []) {
          const y = item.transform ? Math.round(item.transform[5]) : null;
          if (ultY !== null && y !== null && Math.abs(y - ultY) > 4) {
            paginasTxt.push(buf.trim());
            buf = "";
          }
          buf += (buf && !buf.endsWith(" ") ? " " : "") + (item.str || "");
          ultY = y;
        }
        if (buf.trim()) paginasTxt.push(buf.trim());
      }
      const juntado = paginasTxt.filter(Boolean).join("\n");
      if (juntado.trim().length > 20) return juntado;
    } catch (_) {}
  }

  // 2. Extrator PDF Nativo Offline (Lê streams comprimidos FlateDecode e não-comprimidos)
  const latin1 = edBytesParaLatin1(bytes);
  const partesTexto = [];
  const reStream = /stream\r?\n/g;
  let m;
  while ((m = reStream.exec(latin1))) {
    const startIdx = m.index + m[0].length;
    const endIdx = latin1.indexOf("endstream", startIdx);
    if (endIdx === -1) break;
    let fimReal = endIdx;
    if (latin1[fimReal - 1] === "\n") fimReal--;
    if (latin1[fimReal - 1] === "\r") fimReal--;

    const dictAntes = latin1.slice(Math.max(0, m.index - 260), m.index);
    const fatia = bytes.slice(startIdx, fimReal);
    let conteudoStr = "";

    if (/\/FlateDecode\b/.test(dictAntes)) {
      let decomp = await edDescomprimirBytes(fatia, "deflate");
      if (!decomp) decomp = await edDescomprimirBytes(fatia, "deflate-raw");
      if (decomp) {
        conteudoStr = edBytesParaLatin1(decomp);
      }
    } else if (!/\/(?:DCTDecode|JPXDecode|JBIG2Decode|CCITTFaxDecode)\b/.test(dictAntes)) {
      conteudoStr = latin1.slice(startIdx, fimReal);
    }

    if (
      conteudoStr &&
      (conteudoStr.includes("Tj") || conteudoStr.includes("TJ") || conteudoStr.includes("BT"))
    ) {
      const extraido = edExtrairOperadoresTextoPDF(conteudoStr);
      if (extraido.trim()) partesTexto.push(extraido.trim());
    }
    reStream.lastIndex = endIdx + 9;
  }

  if (partesTexto.length) {
    return partesTexto.join("\n");
  }

  // Fallback: extrair operadores do corpo inteiro
  return edExtrairOperadoresTextoPDF(latin1);
}

function edFormatarMateriaExtraida(m) {
  const sugerido = m.topicos.length < 3;
  const topicos = sugerido ? [...new Set([...m.topicos, ...buscarTopicosPadrao(m.nome)])] : m.topicos;
  return { nome: m.nome, peso: edPesoPadrao(m.nome, m.especifico), topicos, sugerido };
}

/** Lê o texto do edital sem internet. Devolve { nome, dataProva, materias:[{nome,peso,topicos,sugerido}], cargos?, cargoSelecionado?, fonte } */
function analisarEditalLocal(texto, ref) {
  const bruto = String(texto || "");
  const todasLinhas = bruto
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(l => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const nomeLinha =
    todasLinhas.find(
      l =>
        l.length <= 100 &&
        /edital|concurso|processo seletivo|sele[cç][aã]o externa|vestibular|banco do brasil|tribunal|prefeitura|pol[ií]cia|secretaria|minist[eé]rio/i.test(
          l
        )
    ) || "";
  const dataDetectada = edDetectarData(bruto, ref);

  const recorteProgramatico = edRecortarConteudoProgramatico(bruto);
  const linhasBrutas = recorteProgramatico
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(l => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  // Expandir linhas onde o PDF juntou "DISCIPLINA: 1. Tópico A; 2. Tópico B" na mesma linha
  const linhas = [];
  for (const l of linhasBrutas) {
    const mInline = /^([A-ZÀ-Ýa-zà-ÿ\s()–-]{3,65}?)\s*[:–-]\s*(.+)$/.exec(l);
    if (mInline && !edDetectarCargo(l)) {
      const possivelCab = mInline[1].trim();
      const resto = mInline[2].trim();
      const nCab = edNorm(possivelCab.replace(/^(?:\d{1,2}[.)]|[IVX]{1,4}\s*[-–.)])\s+/, ""));
      const ehConhecida =
        Boolean(TOPICOS_PADRAO[nCab] || ALIAS_DISCIPLINAS[nCab]) ||
        (edRazaoMaiuscula(possivelCab) >= 0.85 && ED_PALAVRAS_DISCIPLINA.test(nCab));
      if (ehConhecida && resto.length >= 8) {
        linhas.push(possivelCab + ":");
        linhas.push(resto);
        continue;
      }
    }
    linhas.push(l);
  }

  const secoes = [];
  let atual = null;
  let cargoAtual = null;
  let blocoEspecifico = false;
  for (const l of linhas) {
    const infoCargo = edDetectarCargo(l);
    if (infoCargo) {
      atual = null;
      if (infoCargo.tipo === "comum") {
        cargoAtual = null;
        blocoEspecifico = false;
      } else if (infoCargo.tipo === "especificos") {
        blocoEspecifico = true;
      } else if (infoCargo.tipo === "cargo") {
        cargoAtual = infoCargo.nome;
        blocoEspecifico = true;
      }
      continue;
    }
    const cab = edCabecalho(l);
    if (cab === null) {
      atual = null;
      continue;
    }
    if (cab) {
      atual = { nome: cab, cargo: cargoAtual, especifico: blocoEspecifico, linhas: [] };
      secoes.push(atual);
      continue;
    }
    if (atual) atual.linhas.push(l);
  }

  const agruparSecoes = listaSecoes => {
    const mapa = new Map();
    listaSecoes.forEach(s => {
      const topicos = edExtrairTopicos(s.linhas);
      if (!topicos.length) return;
      const k = edNorm(s.nome);
      if (mapa.has(k)) {
        const m = mapa.get(k);
        if (s.especifico) m.especifico = true;
        topicos.forEach(t => {
          if (!m.topicos.some(x => edNorm(x) === edNorm(t))) m.topicos.push(t);
        });
      } else {
        mapa.set(k, { nome: s.nome, especifico: Boolean(s.especifico), topicos: topicos.slice() });
      }
    });
    return [...mapa.values()].slice(0, 40).map(edFormatarMateriaExtraida);
  };

  const nomesCargos = [...new Set(secoes.filter(s => s.cargo).map(s => s.cargo))];
  if (nomesCargos.length >= 2) {
    const comuns = agruparSecoes(secoes.filter(s => !s.cargo));
    const cargos = nomesCargos
      .map(nomeCargo => {
        const especificas = agruparSecoes(secoes.filter(s => s.cargo === nomeCargo));
        if (!especificas.length) return null;
        const combinadas = [...comuns.map(m => ({ ...m, topicos: m.topicos.slice() }))];
        especificas.forEach(esp => {
          const idx = combinadas.findIndex(c => edNorm(c.nome) === edNorm(esp.nome));
          if (idx >= 0) {
            combinadas[idx] = esp;
          } else {
            combinadas.push(esp);
          }
        });
        return { nome: nomeCargo, materias: combinadas };
      })
      .filter(Boolean);

    if (cargos.length >= 2) {
      return {
        nome: nomeLinha.slice(0, 80),
        dataProva: dataDetectada,
        materias: cargos[0].materias.map(m => ({ ...m, topicos: m.topicos.slice() })),
        cargos,
        cargoSelecionado: cargos[0].nome,
        fonte: "local"
      };
    }
  }

  const materias = agruparSecoes(secoes);
  return { nome: nomeLinha.slice(0, 80), dataProva: dataDetectada, materias, fonte: "local" };
}

function selecionarCargoEdital(indiceOuNome) {
  if (!estadoEdital || !estadoEdital.analise || !Array.isArray(estadoEdital.analise.cargos)) return null;
  const cargos = estadoEdital.analise.cargos;
  const alvo =
    typeof indiceOuNome === "number"
      ? cargos[indiceOuNome]
      : cargos.find(
          (c, idx) => String(idx) === String(indiceOuNome) || edNorm(c.nome) === edNorm(indiceOuNome)
        );
  if (!alvo) return null;
  estadoEdital.analise.cargoSelecionado = alvo.nome;
  estadoEdital.analise.materias = alvo.materias.map(m => ({ ...m, topicos: m.topicos.slice() }));
  const hoje = edHoje();
  const plano = gerarCronogramaEdital({
    materias: estadoEdital.analise.materias,
    horasDia: (estadoEdital.cfg && estadoEdital.cfg.horasDia) || 3,
    diasSemana: (estadoEdital.cfg && estadoEdital.cfg.diasSemana) || 6,
    dataProva: (estadoEdital.cfg && estadoEdital.cfg.dataProva) || estadoEdital.analise.dataProva || "",
    inicio: hoje
  });
  estadoEdital.plano = plano && !plano.erro ? plano : null;
  atualizarAbaEdital();
  return alvo;
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
  const programatico = edRecortarConteudoProgramatico(t);
  const cortado =
    programatico.length < t.length
      ? t.slice(0, 2000) + "\n...\n" + programatico.slice(0, 36000)
      : t.slice(0, 38000);
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
    if (ok) {
      if (local.cargos && local.cargos.length >= 2) {
        ok.cargos = local.cargos;
        ok.cargoSelecionado = local.cargoSelecionado;
      }
      if (!ok.dataProva && local.dataProva) ok.dataProva = local.dataProva;
      return ok;
    }
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
  const seletorCargos =
    st.analise && Array.isArray(st.analise.cargos) && st.analise.cargos.length >= 2
      ? `<div style="margin:8px 0 10px;">
          <span class="ia-label-titulo">Cargo / Perfil detectado no edital:</span>
          <div class="ia-pill-select-group" style="margin-top:6px;">
            ${st.analise.cargos
              .map(
                (c, idx) =>
                  `<button type="button" class="ia-pill-select-btn ${st.analise.cargoSelecionado === c.nome ? "ativo" : ""}" data-edital-act="cargo" data-i="${idx}">🎯 ${edEsc(c.nome)} (${c.materias.length})</button>`
              )
              .join("")}
          </div>
        </div>`
      : "";
  const mats = st.analise
    ? `<div class="ed-passo">2. Disciplinas encontradas${st.analise.fonte === "ia" ? " (lidas pela IA)" : st.analise.fonte === "preset" ? " (modelo da prova)" : ""}</div>
      ${seletorCargos}
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
      <label class="btn small" for="ed-arquivo">📎 Enviar PDF ou .txt do edital</label>
      <input type="file" id="ed-arquivo" accept=".pdf,.txt,.md,application/pdf,text/plain" hidden />
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
    if (act === "cargo") {
      selecionarCargoEdital(+b.getAttribute("data-i"));
      return;
    }
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
      if (f.size > 15 * 1024 * 1024) {
        estadoEdital.msg = "Arquivo grande demais (máx. 15 MB).";
        return atualizarAbaEdital();
      }
      estadoEdital.carregando = true;
      estadoEdital.msg = `Lendo "${edLimparStr(f.name, 60)}"...`;
      atualizarAbaEdital();
      extrairTextoDePDF(f)
        .then(txt => {
          estadoEdital.carregando = false;
          estadoEdital.texto = String(txt || "").slice(0, 60000);
          estadoEdital.msg = `Arquivo "${edLimparStr(f.name, 60)}" lido. Analisando disciplinas...`;
          atualizarAbaEdital();
          if (estadoEdital.texto.trim().length >= 20) edAnalisar();
        })
        .catch(() => {
          estadoEdital.carregando = false;
          estadoEdital.msg =
            "Não foi possível ler esse arquivo PDF. Tente colar o texto do conteúdo programático.";
          atualizarAbaEdital();
        });
    }
  });
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    TOPICOS_PADRAO,
    EXAMES_EDITAIS,
    buscarTopicosPadrao,
    montarPresetEdital,
    extrairTextoDePDF,
    edRecortarConteudoProgramatico,
    analisarEditalLocal,
    analisarEdital,
    selecionarCargoEdital,
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
