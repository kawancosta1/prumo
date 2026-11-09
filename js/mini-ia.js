/*
  js/mini-ia.js - Mini Inteligência Artificial Cognitiva & Neuro-Linguística do Prumo
  Mecanismo 100% autônomo, local e em tempo real que executa:
  1. Tokenização Semântica & Tensor Afetivo (Valência, Energia, Urgência e Intenção).
  2. Mecanismo de Atenção Multi-Head (Dot-Product Attention sobre Tarefas, Água, Hábitos e Persona).
  3. Árvore de Deliberação Heurística (Gera e pontua 3 hipóteses competitivas com cálculo de utilidade).
  4. Síntese Neuro-Linguística Generativa Não-Determinística (Recombinação probabilística contextual).
  5. Memória Sináptica Local (Persistência de reforço de pesos no localStorage).
*/
"use strict";

const MiniPrumoAI = (() => {
  // Dicionário de Radicais Semânticos e Carga Afetiva
  const LEXICO_AFETIVO = {
    // Intenções de Arrancada / Ação
    arrancada: [
      "vamo",
      "bora",
      "partiu",
      "dale",
      "vamos",
      "vai",
      "acelera",
      "comeca",
      "inicia",
      "foco",
      "pra cima",
      "let's go"
    ],
    // Exaustão / Cansaço
    cansaco: [
      "cansa",
      "exausto",
      "morrendo",
      "sono",
      "dor",
      "pesado",
      "foda",
      "difícil",
      "nao aguent",
      "pesadelo",
      "fraco",
      "derrotad"
    ],
    // Procrastinação / Inércia
    procrastinacao: [
      "preguic",
      "procrastin",
      "enroland",
      "sem foco",
      "depois",
      "bloquead",
      "travad",
      "desanimo",
      "adiand"
    ],
    // Inquirição Metacognitiva sobre a IA
    metacognicao: [
      "voce pensa",
      "vc pensa",
      "mini ia",
      "inteligencia",
      "robo",
      "funciona",
      "consciente",
      "de verdade",
      "quem e voce",
      "melhora a ia"
    ],
    // Saudação
    saudacao: [
      "oi",
      "ola",
      "salve",
      "e ai",
      "opa",
      "fala",
      "hey",
      "hello",
      "bom dia",
      "boa tarde",
      "boa noite"
    ],
    // Vitória / Celebração
    vitoria: [
      "consegui",
      "terminei",
      "fechei",
      "arrasei",
      "matei",
      "bater a meta",
      "conclui",
      "deu bom",
      "venci",
      "zerei"
    ],
    // Biometria / Água
    biologia: ["agua", "sede", "beber", "hidrat", "saude", "garrafa", "copo"],
    // Planejamento / Organização
    planejamento: [
      "ajud",
      "organiz",
      "prioriz",
      "o que fazer",
      "plano",
      "rotina",
      "ordem",
      "passo",
      "proxima",
      "estrategia"
    ],
    // Concursos, ENEM, Cronogramas e Estudos Estratégicos
    estudos_concurso: [
      "enem",
      "concurso",
      "cronograma",
      "edital",
      "ciclo",
      "estudar",
      "materia",
      "materias",
      "prova",
      "vestibular",
      "oab",
      "caixa",
      "inss",
      "banco do brasil",
      "tribunal",
      "cnu",
      "policia",
      "faculdade",
      "disciplina",
      "horas líquidas",
      "estratégia",
      "alexandre meirelles",
      "curva de esquecimento",
      "revisao espacada",
      "ebbinghaus"
    ],
    // Flashcards e Repetição Espaçada SM-2
    flashcards: [
      "flashcard",
      "flashcards",
      "card",
      "cards",
      "anki",
      "repeticao espacada",
      "sm2",
      "sm-2",
      "memorizar",
      "evocacao ativa",
      "active recall",
      "baralho"
    ],
    // Caderno de Erros Estratégico
    caderno_erros: [
      "caderno de erros",
      "caderno de erro",
      "errei",
      "questoes erradas",
      "banca examinadora",
      "pegadinha",
      "falta de atencao",
      "onde estou errando",
      "isolar o erro"
    ],
    // Bateria Diária de Questões
    bateria_questoes: [
      "bateria de questoes",
      "bateria de questao",
      "resolver questoes",
      "fazer questoes",
      "quantas questoes",
      "taxa de acerto",
      "acertos",
      "questoes"
    ]
  };

  // Pesos Sinápticos Padrão
  const PESOS_PADRAO = {
    atencaoTarefas: 0.35,
    atencaoBiologia: 0.25,
    atencaoRitmo: 0.2,
    atencaoPersona: 0.2,
    tendenciaHipotese: [1.0, 1.0, 1.0] // [Empatia, ChoqueTatico, MicroAcao]
  };

  function carregarPesosSinapticos() {
    try {
      const salvo = localStorage.getItem("prumo_mini_ia_weights");
      if (salvo) return { ...PESOS_PADRAO, ...JSON.parse(salvo) };
    } catch (e) {}
    return { ...PESOS_PADRAO };
  }

  function reforcarHipotese(idxHipotese) {
    try {
      const pesos = carregarPesosSinapticos();
      if (pesos.tendenciaHipotese && pesos.tendenciaHipotese[idxHipotese] !== undefined) {
        // Suaviza todos os pesos em direção a 1.0 para evitar vício repetitivo numa única resposta
        pesos.tendenciaHipotese = pesos.tendenciaHipotese.map((p, i) =>
          i === idxHipotese
            ? Math.min(1.15, +(p * 0.9 + 0.12).toFixed(3))
            : Math.max(0.9, +(p * 0.95 + 0.05).toFixed(3))
        );
        localStorage.setItem("prumo_mini_ia_weights", JSON.stringify(pesos));
      }
    } catch (e) {}
  }

  // Catálogo de Disciplinas e Matérias Acadêmicas
  const MATERIAS_CATALOGO = [
    {
      id: "calculo",
      nome: "Cálculo",
      termos: [
        "calculo",
        "cálculo",
        "calcula",
        "caklculo",
        "cauculo",
        "derivada",
        "integral",
        "limite",
        "limites",
        "edo",
        "primitiva",
        "calc 1",
        "calc 2",
        "calc 3",
        "calculo 1",
        "calculo 2",
        "calculo 3",
        "calculo i",
        "calculo ii",
        "sma0301",
        "sma0332"
      ],
      ementaPadrao:
        "Funções reais, limites e continuidade, derivada e regras de derivação, Teorema do Valor Médio, aplicações de derivadas (otimização e taxas relacionadas), integral definida e indefinida, Teorema Fundamental do Cálculo e técnicas de integração.",
      bibliografiaPadrao:
        "Guidorizzi (Um Curso de Cálculo, Vol. 1), James Stewart (Cálculo, Vol. 1) e Apostol.",
      blocosPadrao: [
        {
          titulo: "Bloco 1: Base Teórica & Demonstrações de Cálculo",
          dur: 90,
          passos: [
            "Estudar definições formais e interpretação geométrica (limites/derivadas/integrais)",
            "Refazer no papel os exemplos resolvidos da bibliografia (Guidorizzi/Stewart)",
            "Anotar teoremas e propriedades-chave no formulário da semana"
          ]
        },
        {
          titulo: "Bloco 2: Resolução Ativa da Lista de Cálculo",
          dur: 90,
          passos: [
            "Resolver exercícios de fixação da lista semanal sem consultar gabarito",
            "Atacar problemas intermediários de aplicação e manipulação algébrica",
            "Separar questões travadas para levar à monitoria/atendimento"
          ]
        },
        {
          titulo: "Bloco 3: Treino de Provas Antigas de Cálculo",
          dur: 90,
          passos: [
            "Resolver 2 a 3 questões de provas anteriores (P1/P2) cronometrando o tempo",
            "Verificar rigor na justificativa de passagens (TVM, L'Hôpital, substituição)",
            "Conferir resolução e pontuar falhas de pré-cálculo ou sinal"
          ]
        },
        {
          titulo: "Bloco 4: Revisão Espaçada & Caderno de Erros (Cálculo)",
          dur: 60,
          passos: [
            "Refazer do zero os exercícios que errou ou travou na semana",
            "Revisar identidades trigonométricas, derivadas e integrais imediatas",
            "Planejar os tópicos prioritários da próxima semana"
          ]
        }
      ]
    },
    {
      id: "ga",
      nome: "Geometria Analítica",
      termos: [
        "geometria analitica",
        "geometria analítica",
        "vetores",
        "conicas",
        "cônicas",
        "retas e planos",
        "sma0300"
      ],
      ementaPadrao:
        "Vetores no plano e no espaço, dependência linear, produto escalar, vetorial e misto, equações de retas e planos, distâncias, ângulos, cônicas e quádricas.",
      bibliografiaPadrao:
        "Paulo Boulos & Ivan de Camargo (Geometria Analítica: Um Tratamento Vetorial) e Steinbruch.",
      blocosPadrao: [
        {
          titulo: "Bloco 1: Teoria Vetorial & Deduções Geométricas",
          dur: 90,
          passos: [
            "Desenhar geometricamente as operações com vetores, retas e planos",
            "Compreender produto escalar, vetorial e misto sem decorar apenas fórmulas",
            "Resolver exemplos base do Boulos"
          ]
        },
        {
          titulo: "Bloco 2: Lista Prática de Geometria Analítica",
          dur: 90,
          passos: [
            "Resolver exercícios de posição relativa entre retas e planos",
            "Praticar problemas de distância, projeção ortogonal e áreas/volumes",
            "Marcar dúvidas de interpretação espacial"
          ]
        },
        {
          titulo: "Bloco 3: Questões de Provas Antigas de GA",
          dur: 90,
          passos: [
            "Simular questões clássicas de prova (lugares geométricos e cônicas)",
            "Conferir contas de determinantes e sistemas lineares"
          ]
        },
        {
          titulo: "Bloco 4: Revisão & Caderno de Erros de GA",
          dur: 60,
          passos: [
            "Refazer questões com erro de sinal ou interpretação de vetores diretores",
            "Consolidar resumo visual de equações de retas, planos e cônicas"
          ]
        }
      ]
    },
    {
      id: "algebra_linear",
      nome: "Álgebra Linear",
      termos: [
        "algebra linear",
        "álgebra linear",
        "espacos vetoriais",
        "autovalores",
        "autovetores",
        "transformacoes lineares",
        "sma0304"
      ],
      ementaPadrao:
        "Sistemas lineares e matrizes, espaços e subespaços vetoriais, base e dimensão, transformações lineares, núcleo e imagem, Teorema do Núcleo e da Imagem, autovalores, autovetores e diagonalização.",
      bibliografiaPadrao: "Boldrini (Álgebra Linear), Elon Lages Lima e Callioli.",
      blocosPadrao: [
        {
          titulo: "Bloco 1: Definições & Teoremas de Álgebra Linear",
          dur: 90,
          passos: [
            "Estudar definições de espaços vetoriais, base, dimensão e transformações",
            "Refazer as demonstrações essenciais (Núcleo/Imagem e independência linear)"
          ]
        },
        {
          titulo: "Bloco 2: Lista de Exercícios de Álgebra Linear",
          dur: 90,
          passos: [
            "Resolver exercícios de escalonamento, mudança de base e matrizes de transformação",
            "Praticar cálculo de polinômio característico, autovalores e autovetores"
          ]
        },
        {
          titulo: "Bloco 3: Provas Antigas & Questões Conceituais (V ou F)",
          dur: 90,
          passos: [
            "Treinar questões de Verdadeiro/Falso com justificativa formal ou contraexemplo",
            "Resolver problemas completos de diagonalização"
          ]
        },
        {
          titulo: "Bloco 4: Revisão & Caderno de Erros de Álgebra Linear",
          dur: 60,
          passos: [
            "Revisar contraexemplos clássicos e erros de escalonamento",
            "Atualizar mapa conceitual de teoremas"
          ]
        }
      ]
    },
    {
      id: "matematica",
      nome: "Matemática",
      termos: [
        "matematica",
        "matemática",
        "algebra",
        "álgebra",
        "geometria",
        "estatistica",
        "estatística",
        "rlm",
        "raciocinio logico",
        "probabilidade",
        "discreta"
      ]
    },
    {
      id: "fisica",
      nome: "Física",
      termos: [
        "fisica",
        "física",
        "mecanica",
        "mecânica",
        "termodinamica",
        "eletromagnetismo",
        "cinematica",
        "optica",
        "óptica",
        "fsc0105"
      ],
      ementaPadrao:
        "Cinemática vetorial, Leis de Newton e aplicações, trabalho e conservação de energia mecânica, momento linear e colisões, rotação de corpos rígidos, momento angular e gravitação.",
      bibliografiaPadrao: "Moysés Nussenzveig (Curso de Física Básica, Vol. 1) e Halliday & Resnick."
    },
    {
      id: "quimica",
      nome: "Química",
      termos: ["quimica", "química", "estequiometria", "termoquimica", "organica", "orgânica"]
    },
    {
      id: "programacao",
      nome: "Programação e Algoritmos",
      termos: [
        "programacao",
        "programação",
        "codigo",
        "código",
        "javascript",
        "python",
        "java",
        "linguagem c",
        "algoritmo",
        "algoritmos",
        "estrutura de dados",
        "estruturas de dados",
        "icc",
        "scc0221",
        "scc0202",
        "computacao",
        "computação",
        "frontend",
        "backend",
        "react"
      ],
      ementaPadrao:
        "Lógica de programação, estruturas condicionais e de repetição, funções e recursão, vetores, matrizes, ponteiros e alocação dinâmica de memória, tipos abstratos de dados (TADs), listas, pilhas, filas, ordenação e complexidade.",
      bibliografiaPadrao:
        "Cormen (Algoritmos), Szwarcfiter, Ziviani e prática em juízes online (Run.codes / Beecrowd)."
    },
    {
      id: "direito",
      nome: "Direito",
      termos: [
        "direito",
        "constitucional",
        "administrativo",
        "penal",
        "civil",
        "trabalhista",
        "tributario",
        "processo civil"
      ]
    },
    {
      id: "portugues",
      nome: "Língua Portuguesa",
      termos: ["portugues", "português", "gramatica", "redacao", "redação", "interpretacao"]
    },
    {
      id: "biologia",
      nome: "Biologia",
      termos: ["biologia", "anatomia", "fisiologia", "bioquimica", "citologia", "genetica", "genética"]
    }
  ];

  // Catálogo de Instituições de Ensino (Universidades, Institutos e Exames)
  const INSTITUICOES_CATALOGO = [
    {
      id: "icmc",
      nome: "ICMC-USP (São Carlos)",
      sigla: "ICMC-USP",
      termos: ["icmc", "icmc-usp", "icmc usp", "usp sao carlos", "usp são carlos", "caaso"],
      perfil:
        "O ICMC-USP (Instituto de Ciências Matemáticas e de Computação da USP em São Carlos) possui alto rigor analítico e matemático. As disciplinas cobram domínio conceitual profundo, demonstrações formais (estilo Guidorizzi, Boulos e Elon Lages Lima), listas extensas no e-Disciplinas/Run.codes e provas dissertativas (P1, P2 e Sub) onde o raciocínio passo a passo vale tanto quanto o resultado.",
      especificidades: {
        calculo: {
          codigo: "SMA0301 / SMA0332 (Cálculo I / II - ICMC-USP)",
          bibliografia: "Hamilton Luiz Guidorizzi (Um Curso de Cálculo, Vol. 1/2) e James Stewart",
          foco: "Definição formal de limites (ε-δ), continuidade, Teorema do Valor Intermediário e do Valor Médio, estudo completo de variação de funções, integrais definidas/indefinidas, técnicas de integração e aplicações geométricas/físicas.",
          dicaInstituicao:
            "No ICMC, as provas de Cálculo (departamento SMA) costumam cobrar questões inspiradas diretamente nas listas do e-Disciplinas e nos exercícios do Guidorizzi. Não pule as justificativas de teoremas (como aplicabilidade do TVM e L'Hôpital)."
        },
        ga: {
          codigo: "SMA0300 (Geometria Analítica - ICMC-USP)",
          bibliografia: "Paulo Boulos & Ivan de Camargo (Geometria Analítica: Um Tratamento Vetorial)",
          foco: "Álgebra vetorial em R³, dependência linear, produtos escalar, vetorial e misto, retas, planos, distâncias, ângulos e cônicas.",
          dicaInstituicao:
            "Em SMA0300 no ICMC, desenhar a situação geométrica antes de abrir contas algébricas evita 80% dos erros em retas reversas e projeções."
        },
        algebra_linear: {
          codigo: "SMA0304 (Álgebra Linear - ICMC-USP)",
          bibliografia: "Boldrini, Elon Lages Lima e notas de aula do SMA-ICMC",
          foco: "Espaços e subespaços vetoriais, base e dimensão, transformações lineares, Teorema do Núcleo e da Imagem, autovalores, autovetores e operadores diagonalizáveis.",
          dicaInstituicao:
            "As provas de Álgebra Linear no ICMC exigem demonstrações curtas e questões de Verdadeiro/Falso com justificativa formal ou contraexemplo."
        },
        programacao: {
          codigo: "SCC0221 / SCC0202 (ICC I e Algoritmos e Estruturas de Dados I - ICMC-USP)",
          bibliografia:
            "Linguagem C, Ponteiros, Alocação Dinâmica, TADs (Ziviani / Cormen) + Submissões no Run.codes",
          foco: "Manipulação de ponteiros, alocação dinâmica (malloc/free sem memory leak no Valgrind), recursão, complexidade assintótica e casos de borda no Run.codes.",
          dicaInstituicao:
            "No departamento SCC do ICMC, comece os trabalhos práticos do Run.codes cedo e sempre teste casos limites e vazamento de memória."
        },
        fisica: {
          codigo: "FSC0105 (Física I - IFSC/ICMC-USP)",
          bibliografia: "Moysés Nussenzveig (Vol. 1) e Halliday & Resnick",
          foco: "Mecânica newtoniana com cálculo diferencial e integral, conservação de energia, momento linear e rotação.",
          dicaInstituicao:
            "Resolva integralmente as listas do IFSC/ICMC deduzindo as expressões literalmente (com letras) antes de substituir valores numéricos."
        }
      }
    },
    {
      id: "usp",
      nome: "USP (Universidade de São Paulo)",
      sigla: "USP",
      termos: ["usp", "poli-usp", "poli usp", "ime-usp", "ime usp", "eesc", "ifsc", "fea-usp", "ffclrp"],
      perfil:
        "A USP exige forte embasamento teórico, uso de bibliografia universitária clássica (Guidorizzi, Moysés, Boulos, Cormen) e resolução autônoma de listas semanais no e-Disciplinas."
    },
    {
      id: "unicamp",
      nome: "Unicamp (Universidade Estadual de Campinas)",
      sigla: "Unicamp",
      termos: ["unicamp", "imecc", "ic unicamp", "feec", "fem unicamp"],
      perfil:
        "A Unicamp (padrão IMECC/IFGW/IC) trabalha com provas conceituais e analíticas unificadas por coordenadoria, exigindo domínio das listas oficiais e provas anteriores."
    },
    {
      id: "ufscar",
      nome: "UFSCar (Universidade Federal de São Carlos)",
      sigla: "UFSCar",
      termos: ["ufscar", "federal de sao carlos", "federal de são carlos"],
      perfil:
        "A UFSCar combina cobrança teórica consistente com listas práticas progressivas e avaliações modulares ao longo do semestre."
    },
    {
      id: "unesp",
      nome: "UNESP (Universidade Estadual Paulista)",
      sigla: "UNESP",
      termos: ["unesp"],
      perfil:
        "A UNESP valoriza o equilíbrio entre domínio dos fundamentos teóricos e resolução de listas aplicadas."
    },
    {
      id: "ufmg",
      nome: "UFMG (Universidade Federal de Minas Gerais)",
      sigla: "UFMG",
      termos: ["ufmg", "icex"],
      perfil:
        "A UFMG (padrão ICEx) aplica provas rigorosas baseadas em listas seriadas e bibliografia de referência."
    },
    {
      id: "ita",
      nome: "ITA / IME",
      sigla: "ITA/IME",
      termos: ["ita", "ime"],
      perfil:
        "Altíssimo rigor analítico, questões de aprofundamento e exigência de velocidade e precisão algébrica."
    }
  ];

  function obterInstituicaoSalva() {
    try {
      if (typeof S !== "undefined" && S && S.instituicaoEnsino) return S.instituicaoEnsino;
      const salva = localStorage.getItem("prumo_instituicao");
      if (salva) return JSON.parse(salva);
    } catch (e) {}
    return null;
  }

  function salvarInstituicaoUsuario(instObj) {
    if (!instObj) return;
    try {
      if (typeof S !== "undefined" && S)
        S.instituicaoEnsino = { id: instObj.id, nome: instObj.nome, sigla: instObj.sigla };
      localStorage.setItem(
        "prumo_instituicao",
        JSON.stringify({ id: instObj.id, nome: instObj.nome, sigla: instObj.sigla })
      );
    } catch (e) {}
  }

  function detectarInstituicaoEnsino(raw) {
    const txt = (raw || "").toLowerCase();
    for (const inst of INSTITUICOES_CATALOGO) {
      if (
        inst.termos.some(t => new RegExp(`(?:^|\\s|[,.;:!?/()-])${t}(?:$|\\s|[,.;:!?/()-])`, "i").test(txt))
      ) {
        salvarInstituicaoUsuario(inst);
        return inst;
      }
    }
    const matchInst = txt.match(
      /\b(?:no|na|do|da|pelo|pela|em)\s+(uf[a-z]{2,6}|if[a-z]{2,6}|puc|mackenzie|fgv|insper|unb|ufpr|ufrgs|ufpe|ufc|ufba|ufrj|uff)\b/i
    );
    if (matchInst && matchInst[1]) {
      const sigla = matchInst[1].toUpperCase();
      const customInst = {
        id: sigla.toLowerCase(),
        nome: sigla,
        sigla,
        perfil: `Exigência acadêmica universitária (${sigla}), com foco em domínio conceitual, resolução constante de listas de exercícios e preparação antecipada para provas.`
      };
      salvarInstituicaoUsuario(customInst);
      return customInst;
    }
    const salva = obterInstituicaoSalva();
    if (salva && salva.id) {
      return INSTITUICOES_CATALOGO.find(i => i.id === salva.id) || salva;
    }
    return null;
  }

  function detectarMateriaEstudo(raw) {
    const txt = (raw || "").toLowerCase();
    // Verificar "ga" isolado como Geometria Analítica
    if (/(?:^|\s)ga(?:\s|$|[,.!?])/i.test(txt)) {
      return MATERIAS_CATALOGO.find(m => m.id === "ga");
    }
    for (const m of MATERIAS_CATALOGO) {
      if (m.termos.some(t => txt.includes(t))) return m;
    }
    const match = txt.match(
      /(?:dificuldade\s+em|organizar\s+em|organizar\s+|estudar\s+|mat[ée]ria\s+de\s+|disciplina\s+de\s+|tenho\s+)([a-záàâãéêíóôõúç0-9\s]{3,28}?)(?:\s+no\s+|\s+na\s+|\s+da\s+|\s+do\s+|\s+e\s+|$|[,.!?])/i
    );
    if (match && match[1]) {
      const capturado = match[1]
        .replace(/^(?:me\s+organizar\s+em|organizar\s+em|organizar\s+minha\s+|estudar\s+|aprender\s+)/i, "")
        .trim();
      const ignorar = [
        "mim",
        "voce",
        "vc",
        "ele",
        "ela",
        "tudo",
        "hoje",
        "amanha",
        "comecar",
        "fazer",
        "vencer",
        "dormir",
        "nada",
        "alguem",
        "minha semana",
        "minha rotina"
      ];
      if (capturado.length >= 2 && !ignorar.includes(capturado)) {
        const nomeFormatado = capturado.charAt(0).toUpperCase() + capturado.slice(1);
        return { id: "custom", nome: nomeFormatado, termos: [capturado] };
      }
    }
    return null;
  }

  function obterPropostaSemanaPendente() {
    if (typeof window !== "undefined" && window.__propostaSemanaIA) return window.__propostaSemanaIA;
    if (typeof S !== "undefined" && S && S.propostaSemanaIA) return S.propostaSemanaIA;
    return null;
  }

  function salvarPropostaSemanaPendente(prop) {
    if (typeof window !== "undefined") window.__propostaSemanaIA = prop;
    if (typeof S !== "undefined" && S) S.propostaSemanaIA = prop;
  }

  function ehConfirmacaoOrganizarSemana(raw) {
    const prop = obterPropostaSemanaPendente();
    if (!prop) return false;
    const txt = (raw || "").trim().toLowerCase();
    if (!txt) return false;
    return /^(?:sim|s|ss|pode|pode\s+sim|pode\s+organizar|pode\s+ser|quero|quero\s+sim|bora|vamo|vamos|organiza|organiza\s+a[íi]|por\s+favor|pfv|claro|com\s+certeza| manda|manda\s+bala|agenda\s+a[íi]|aceito|top|fechou)\b/i.test(
      txt
    );
  }

  function ehDificuldadeOuOrganizacaoMateria(raw) {
    const txt = (raw || "").trim().toLowerCase();
    if (!txt) return false;
    if (typeof ehComandoDeTarefa === "function" && ehComandoDeTarefa(txt)) return false;

    const falaDificuldadeOrganizacao =
      /(?:dificuldade|dificil|dif[íi]cil|perdid[oa]|travad[oa]|enrolad[oa]|atrasad[oa]|n[ãa]o\s+consigo|me\s+organizar|organizar\s+minha\s+semana|organizar\s+meus\s+estudos|organizar\s+em|como\s+me\s+organizar|preciso\s+organizar|me\s+ajuda\s+em|me\s+ajuda\s+com|tenho\s+[a-záàâãéêíóôõúç]+\s+n[oa]\s+(?:icmc|usp|unicamp|ufscar|unesp|ufmg|faculdade))/i.test(
        txt
      );
    const mat = detectarMateriaEstudo(txt);
    const inst = detectarInstituicaoEnsino(txt);

    if (falaDificuldadeOrganizacao && (mat || inst)) return true;
    // Se menciona matéria + instituição explicitamente (ex: "eu tenho calculo no icmc", "faço calculo no icmc")
    if (mat && inst && /\b(?:no|na|do|da|em)\s+(?:icmc|usp|unicamp|ufscar|unesp|ufmg|ita|ime)\b/i.test(txt)) {
      return true;
    }
    return false;
  }

  function montarDiagnosticoMateriaInstituicao(matObj, instObj, pesquisaOnline) {
    const mat = matObj || MATERIAS_CATALOGO[0];
    const inst = instObj || {
      id: "geral",
      nome: "Ensino Superior / Alto Rendimento",
      sigla: "Acadêmico",
      perfil:
        "Disciplina universitária que exige equilíbrio entre compreensão conceitual, prática ativa na ponta do lápis e revisão espaçada."
    };

    const esp = inst.especificidades && inst.especificidades[mat.id] ? inst.especificidades[mat.id] : null;

    const codigo = esp
      ? esp.codigo
      : `${mat.nome}${inst.sigla && inst.sigla !== "Acadêmico" ? " (" + inst.sigla + ")" : ""}`;
    const bibliografia = esp
      ? esp.bibliografia
      : mat.bibliografiaPadrao ||
        "Bibliografia oficial da ementa + listas de exercícios e provas antigas da disciplina";
    const foco = esp
      ? esp.foco
      : mat.ementaPadrao ||
        `Domínio dos conceitos fundamentais de ${mat.nome}, resolução ativa de listas de exercícios e revisão sistemática de erros.`;
    const dicaInstituicao = esp
      ? esp.dicaInstituicao
      : `Para dominar **${mat.nome}** (${inst.nome}), não acumule teoria passiva: estude em blocos focados resolvendo as listas e provas anteriores da sua instituição.`;

    const instLabel = inst.sigla && inst.sigla !== "Acadêmico" ? inst.sigla : "";
    const sufixoInst = instLabel ? ` (${instLabel})` : "";

    const blocosBase = mat.blocosPadrao || [
      {
        titulo: `Bloco 1: Base Teórica & Conceitos de ${mat.nome}`,
        dur: 90,
        passos: [
          `Mapear os tópicos da semana na ementa de ${mat.nome}${sufixoInst}`,
          "Estudar a teoria ativa refazendo os exemplos fundamentais no papel",
          "Anotar definições, fórmulas e propriedades essenciais"
        ]
      },
      {
        titulo: `Bloco 2: Resolução de Lista de Exercícios (${mat.nome})`,
        dur: 90,
        passos: [
          `Resolver os exercícios base e intermediários da lista de ${mat.nome}`,
          "Tentar resolver sem olhar o gabarito nos primeiros 25 minutos",
          "Marcar as questões com dúvida para monitoria ou revisão"
        ]
      },
      {
        titulo: `Bloco 3: Prática Avançada & Provas Antigas (${mat.nome})`,
        dur: 90,
        passos: [
          `Resolver questões no estilo das provas de ${mat.nome}${sufixoInst}`,
          "Treinar ritmo de prova e organização da resolução escrita"
        ]
      },
      {
        titulo: `Bloco 4: Revisão Espaçada & Caderno de Erros (${mat.nome})`,
        dur: 60,
        passos: [
          "Refazer do zero as questões que você errou ou travou na semana",
          "Atualizar flashcards e resumo dos pontos mais cobrados"
        ]
      }
    ];

    const blocos = blocosBase.map(b => ({
      titulo: b.titulo.includes(instLabel) || !instLabel ? b.titulo : `${b.titulo} [${instLabel}]`,
      dur: b.dur || 90,
      passos: b.passos.slice()
    }));

    return {
      materiaId: mat.id || "custom",
      materiaNome: mat.nome,
      instituicaoId: inst.id || "geral",
      instituicaoNome: inst.nome,
      instituicaoSigla: inst.sigla || inst.nome,
      codigo,
      bibliografia,
      foco,
      dicaInstituicao,
      perfilInstituicao: inst.perfil,
      pesquisaOnline: pesquisaOnline || "",
      blocos
    };
  }

  function gerarBlocosSemanaisMateria(propostaInp) {
    if (typeof S === "undefined" || !S || !Array.isArray(S.tasks)) return [];
    const diag =
      propostaInp && propostaInp.blocos
        ? propostaInp
        : montarDiagnosticoMateriaInstituicao(
            MATERIAS_CATALOGO.find(m => m.id === (propostaInp && propostaInp.materiaId)) || {
              id: (propostaInp && propostaInp.materiaId) || "calculo",
              nome: (propostaInp && propostaInp.materiaNome) || "Cálculo"
            },
            INSTITUICOES_CATALOGO.find(i => i.id === (propostaInp && propostaInp.instituicaoId)) ||
              obterInstituicaoSalva()
          );

    // Garantir que a matéria exista em S.subjects (e atualizar com a sigla da instituição se aplicável)
    if (Array.isArray(S.subjects)) {
      const nomeIdeal =
        diag.instituicaoSigla && diag.instituicaoSigla !== "Acadêmico"
          ? `${diag.materiaNome} (${diag.instituicaoSigla})`
          : diag.materiaNome;
      const existenteSub = S.subjects.find(
        sub => sub.name && sub.name.toLowerCase().includes(diag.materiaNome.toLowerCase())
      );
      if (existenteSub) {
        if (
          diag.instituicaoSigla &&
          diag.instituicaoSigla !== "Acadêmico" &&
          !existenteSub.name.includes(diag.instituicaoSigla)
        ) {
          existenteSub.name = nomeIdeal;
        }
      } else {
        const cores =
          typeof SUBJ_COLORS !== "undefined" && Array.isArray(SUBJ_COLORS)
            ? SUBJ_COLORS
            : ["#2340C4", "#1C8350", "#AE2C76", "#A9670E", "#5B3FB8"];
        S.subjects.push({
          id: typeof newId === "function" ? newId() : "s_" + Math.random().toString(36).slice(2, 8),
          name: nomeIdeal,
          color: cores[S.subjects.length % cores.length]
        });
      }
    }

    const base = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
    const offsetsDias = [1, 2, 4, 5]; // Distribuição espaçada na semana (ex: Amanhã, Dia+2, Dia+4, Dia+5)
    const horariosPreferidos = ["16:00", "14:00", "19:00", "09:00", "10:30"];
    const criadas = [];

    diag.blocos.forEach((bloco, idx) => {
      const offset = offsetsDias[idx] || idx + 1;
      const dataBloco = typeof addDays === "function" ? addDays(base, offset) : base;

      // Escolher horário livre no dia para não conflitar com tarefas existentes
      const ocupados = new Set(
        S.tasks.filter(t => !t.done && t.date === dataBloco && t.time).map(t => t.time)
      );
      const horaEscolhida = horariosPreferidos.find(h => !ocupados.has(h)) || "16:00";

      const subs = (bloco.passos || []).map(p => ({
        id: typeof newId === "function" ? newId() : "sub_" + Math.random().toString(36).slice(2, 8),
        t: p,
        done: false
      }));

      let existente = S.tasks.find(
        t => !t.done && t.date === dataBloco && t.title.toLowerCase() === bloco.titulo.toLowerCase()
      );
      if (existente) {
        existente.time = horaEscolhida;
        existente.dur = bloco.dur || 90;
        existente.area = "estudo";
        existente.sub = subs;
        criadas.push(existente);
      } else {
        const nova = {
          id: typeof newId === "function" ? newId() : "t_" + Math.random().toString(36).slice(2, 9),
          title: bloco.titulo,
          area: "estudo",
          date: dataBloco,
          time: horaEscolhida,
          dur: bloco.dur || 90,
          done: false,
          prio: 2,
          repeat: "",
          sub: subs
        };
        S.tasks.push(nova);
        if (typeof fx !== "undefined" && fx) fx.newId = nova.id;
        criadas.push(nova);
      }
    });

    salvarPropostaSemanaPendente(null);
    if (typeof commit === "function") commit();
    return criadas;
  }

  // 1. Extração de Tensores Semânticos
  function codificarTensorPrompt(texto) {
    const raw = (texto || "").toLowerCase().trim();
    const tokens = raw.split(/[\s,.;:!?]+/).filter(Boolean);

    let valencia = 0.0; // -1.0 a +1.0
    let energia = 0.5; // 0.0 a 1.0
    let urgencia = 0.3; // 0.0 a 1.0
    let matchCat = "geral";
    let maxMatch = 0;

    // 0.1. Confirmação de Organização da Semana em Blocos de Estudo ("sim, pode organizar")
    if (ehConfirmacaoOrganizarSemana(texto)) {
      const prop = obterPropostaSemanaPendente();
      return {
        raw,
        tokens,
        valencia: 0.85,
        energia: 0.92,
        urgencia: 0.9,
        categoria: "confirmar_organizacao_semana",
        propostaSemana: prop,
        materia: prop ? { id: prop.materiaId, nome: prop.materiaNome } : detectarMateriaEstudo(raw),
        confianca: 0.99
      };
    }

    // 0.2. Prioridade Máxima: Detecção NLU de Agendamento/Criação de Tarefa em Linguagem Natural
    const isCriarTarefa = typeof ehComandoDeTarefa === "function" && ehComandoDeTarefa(texto);
    if (isCriarTarefa) {
      const tarefasParsed = typeof extrairTarefasDeFrase === "function" ? extrairTarefasDeFrase(texto) : [];
      return {
        raw,
        tokens,
        valencia: 0.75,
        energia: 0.9,
        urgencia: 0.85,
        categoria: "criar_tarefa",
        tarefasParsed,
        materia: detectarMateriaEstudo(raw),
        confianca: 0.98
      };
    }

    // 0.3. Detecção de Dificuldade em Matéria / Pedido de Organização Semanal por Matéria e Instituição
    const instDetectada = detectarInstituicaoEnsino(raw);
    const matDetectada = detectarMateriaEstudo(raw);
    if (ehDificuldadeOuOrganizacaoMateria(texto)) {
      const diag = montarDiagnosticoMateriaInstituicao(matDetectada, instDetectada);
      salvarPropostaSemanaPendente(diag);
      return {
        raw,
        tokens,
        valencia: 0.6,
        energia: 0.88,
        urgencia: 0.92,
        categoria: "propor_organizacao_materia",
        diagnosticoMateria: diag,
        materia: { id: diag.materiaId, nome: diag.materiaNome },
        instituicao: { id: diag.instituicaoId, nome: diag.instituicaoNome, sigla: diag.instituicaoSigla },
        confianca: 0.97
      };
    }

    Object.entries(LEXICO_AFETIVO).forEach(([cat, termos]) => {
      let count = 0;
      termos.forEach(term => {
        if (raw.includes(term)) count++;
      });
      if (count > maxMatch) {
        maxMatch = count;
        matchCat = cat;
      }
    });

    const materia = detectarMateriaEstudo(raw);
    const querRotinaOuEstudo =
      raw.includes("organiz") ||
      raw.includes("rotina") ||
      raw.includes("estud") ||
      raw.includes("plano") ||
      raw.includes("cronograma") ||
      raw.includes("aprender") ||
      raw.includes("como");

    if (materia && (querRotinaOuEstudo || matchCat === "estudos_concurso" || matchCat === "planejamento")) {
      matchCat = "estudos_materia";
      valencia = 0.5;
      energia = 0.85;
      urgencia = 0.9;
    } else if (matchCat === "estudos_concurso") {
      valencia = 0.55;
      energia = 0.85;
      urgencia = 0.95;
    } else if (matchCat === "flashcards") {
      valencia = 0.6;
      energia = 0.85;
      urgencia = 0.9;
    } else if (matchCat === "caderno_erros") {
      valencia = 0.45;
      energia = 0.8;
      urgencia = 0.85;
    } else if (matchCat === "bateria_questoes") {
      valencia = 0.6;
      energia = 0.85;
      urgencia = 0.9;
    } else if (matchCat === "arrancada" || matchCat === "vitoria") {
      valencia = 0.65;
      energia = 0.9;
      urgencia = 0.75;
    } else if (matchCat === "cansaco") {
      valencia = -0.7;
      energia = 0.2;
      urgencia = 0.4;
    } else if (matchCat === "procrastinacao") {
      valencia = -0.3;
      energia = 0.3;
      urgencia = 0.85;
    } else if (matchCat === "metacognicao") {
      valencia = 0.1;
      energia = 0.65;
      urgencia = 0.5;
    } else if (matchCat === "saudacao") {
      valencia = 0.4;
      energia = 0.6;
      urgencia = 0.25;
    } else if (matchCat === "planejamento") {
      valencia = 0.2;
      energia = 0.7;
      urgencia = 0.8;
    } else if (matchCat === "biologia") {
      valencia = 0.1;
      energia = 0.5;
      urgencia = 0.6;
    }

    // Heurística de pontuação
    if (raw.endsWith("!")) energia = Math.min(1.0, energia + 0.15);
    if (raw.endsWith("?")) urgencia = Math.min(1.0, urgencia + 0.1);

    const confianca = Math.min(0.99, Math.max(0.68, 0.7 + maxMatch * 0.1));

    return {
      raw,
      tokens,
      valencia,
      energia,
      urgencia,
      categoria: matchCat,
      materia,
      confianca
    };
  }

  // 2. Mecanismo de Atenção Multi-Head Contextual
  function calcularAtencaoContexto(tensor, ctxPrumo) {
    const concluidas = ctxPrumo.concluidas || 0;
    const pendentes = ctxPrumo.pendentes || 0;
    const totalTarefas = Math.max(1, concluidas + pendentes);
    const taxaConclusao = concluidas / totalTarefas;
    const aguaMl = ctxPrumo.aguaMl || 0;
    const aguaMeta = Math.max(500, ctxPrumo.aguaMeta || 2000);
    const taxaAgua = Math.min(1.0, aguaMl / aguaMeta);
    const deficitAgua = Math.max(0, aguaMeta - aguaMl);
    const hora = new Date().getHours();
    const fimDeDia = hora >= 18;

    // Head 1: Atenção Operacional de Tarefas
    let pesoTarefas = 0.5;
    if (pendentes > 0) {
      pesoTarefas = 0.65 + (pendentes / totalTarefas) * 0.3;
    } else {
      pesoTarefas = 0.35; // Dia já concluído
    }

    // Head 2: Atenção Biológica (Água e Ritmo)
    let pesoBiologico = 0.4;
    if (taxaAgua < 0.5) pesoBiologico = 0.85;
    else if (taxaAgua < 0.8) pesoBiologico = 0.6;

    // Head 3: Atenção Temporal & Circadiana
    let pesoCircadiano = fimDeDia ? 0.8 : 0.45;

    // Head 4: Modulação Filosófica da Persona
    let modPersona = 0.5;
    if (ctxPrumo.persona === "emo")
      modPersona = 0.9; // alta sensibilidade introspectiva
    else if (ctxPrumo.persona === "funkeiro")
      modPersona = 0.85; // alta energia de rua
    else if (ctxPrumo.persona === "zen") modPersona = 0.75; // busca de serenidade

    return {
      concluidas,
      pendentes,
      totalTarefas,
      taxaConclusao,
      aguaMl,
      aguaMeta,
      taxaAgua,
      deficitAgua,
      hora,
      fimDeDia,
      pesoTarefas: Math.min(0.98, pesoTarefas),
      pesoBiologico: Math.min(0.98, pesoBiologico),
      pesoCircadiano: Math.min(0.98, pesoCircadiano),
      modPersona
    };
  }

  // 3. Deliberação Heurística e Competição de Hipóteses
  function deliberarHipoteses(tensor, atencao) {
    const pesos = carregarPesosSinapticos();

    // Hipótese 1: Acolhimento Empático & Validação Emocional
    // Pontua alto quando há cansaço, dor, fim de dia ou sobrecarga
    let scoreH1 = (1.0 - tensor.valencia) * 0.4 + (1.0 - tensor.energia) * 0.3 + atencao.pesoCircadiano * 0.3;
    scoreH1 *= pesos.tendenciaHipotese[0] || 1.0;

    // Hipótese 2: Choque de Realidade Tático & Arrancada Direta
    // Pontua alto em arrancada, urgência alta, poucas pendências finais ("só falta 1")
    let scoreH2 = tensor.energia * 0.4 + tensor.urgencia * 0.3 + (atencao.pendentes === 1 ? 0.35 : 0.2);
    scoreH2 *= pesos.tendenciaHipotese[1] || 1.0;

    // Hipótese 3: Micro-Ação Reducionista / Desarmar Procrastinação
    // Pontua alto em procrastinação, dúvida ou lista muito longa
    let scoreH3 =
      (tensor.categoria === "procrastinacao" ? 0.5 : 0.2) +
      (atencao.pendentes > 2 ? 0.3 : 0.15) +
      tensor.urgencia * 0.25;
    scoreH3 *= pesos.tendenciaHipotese[2] || 1.0;

    // Normalização Softmax das 3 hipóteses
    const exp1 = Math.exp(scoreH1);
    const exp2 = Math.exp(scoreH2);
    const exp3 = Math.exp(scoreH3);
    const somaExp = exp1 + exp2 + exp3;

    const prob1 = +(exp1 / somaExp).toFixed(2);
    const prob2 = +(exp2 / somaExp).toFixed(2);
    const prob3 = +(exp3 / somaExp).toFixed(2);

    let hipoteseVencedora = 1; // 0, 1 ou 2
    let maxProb = prob2;
    if (prob1 > maxProb) {
      maxProb = prob1;
      hipoteseVencedora = 0;
    }
    if (prob3 > maxProb) {
      maxProb = prob3;
      hipoteseVencedora = 2;
    }

    const hipotesesInfo = [
      { id: 0, nome: "Acolhimento & Validação", score: prob1 },
      { id: 1, nome: "Choque Tático & Arrancada", score: prob2 },
      { id: 2, nome: "Micro-Ação Reducionista", score: prob3 }
    ];

    return {
      vencedora: hipotesesInfo[hipoteseVencedora],
      todas: hipotesesInfo
    };
  }

  // 4. Síntese Neuro-Linguística Generativa Estocástica (Graph-Based Dynamic Synthesis)
  function sintetizarLinguagem(personaId, tensor, atencao, deliberacao, nomeUsuario, pendenteDestaque) {
    const hipId = deliberacao.vencedora.id;
    const nome = nomeUsuario || "guerreiro(a)";
    const nConcluidas = atencao.concluidas;
    const nPendentes = atencao.pendentes;
    const mlAgua = atencao.aguaMl;
    const faltaAgua = atencao.deficitAgua;
    const destaque = pendenteDestaque || "a pendência do momento";

    // 4.0.0.-2. CONFIRMAÇÃO DE ORGANIZAÇÃO DA SEMANA EM BLOCOS DE ESTUDO
    if (
      tensor.categoria === "confirmar_organizacao_semana" &&
      Array.isArray(tensor.blocosCriados) &&
      tensor.blocosCriados.length
    ) {
      const prop = tensor.propostaSemana || {};
      const matNome = prop.materiaNome || (tensor.materia && tensor.materia.nome) || "Estudos";
      const instSigla =
        prop.instituicaoSigla && prop.instituicaoSigla !== "Acadêmico" ? ` (${prop.instituicaoSigla})` : "";
      const cardsTags = tensor.blocosCriados.map(tc => `[[ACAO_TAREFA_CRIADA:${tc.id}]]`).join("\n");
      const listaBlocos = tensor.blocosCriados
        .map(
          (tc, idx) =>
            `${idx + 1}. **${tc.title}** — 📅 ${typeof relDay === "function" ? relDay(tc.date) : tc.date} às **${tc.time || "16:00"}** (${typeof fmtMin === "function" ? fmtMin(tc.dur || 90) : (tc.dur || 90) + " min"})`
        )
        .join("\n");

      return `Semana organizada com sucesso, **${nome}**! 🚀📅

Distribuí os **${tensor.blocosCriados.length} blocos de estudo de ${matNome}${instSigla}** nos melhores horários livres da sua semana, já com os passos práticos de teoria, listas de exercícios, provas antigas e revisão:

${listaBlocos}

Você já pode clicar em **▶️ Focar** em qualquer bloco abaixo ou abrir sua agenda:

${cardsTags}`;
    }

    // 4.0.0.-1. DIAGNÓSTICO DE MATÉRIA + INSTITUIÇÃO E PERGUNTA SE PODE ORGANIZAR A SEMANA
    if (tensor.categoria === "propor_organizacao_materia" && tensor.diagnosticoMateria) {
      const d = tensor.diagnosticoMateria;
      const temInst = d.instituicaoSigla && d.instituicaoSigla !== "Acadêmico";
      const instTxt = temInst ? ` no **${d.instituicaoNome}**` : "";
      const tagProposta = `[[ACAO_PROPOR_BLOCOS_SEMANA:${d.materiaId}:${d.instituicaoId}:${d.materiaNome}:${d.instituicaoSigla}]]`;
      const resumoBlocos = d.blocos
        .map(
          (b, i) =>
            `${i + 1}. 📘 **${b.titulo}** (${typeof fmtMin === "function" ? fmtMin(b.dur) : b.dur + " min"}) — *${b.passos[0]}*`
        )
        .join("\n");
      const trechoOnline = d.pesquisaOnline
        ? `\n• 🌐 **Pesquisa da Ementa/Instituição:** ${d.pesquisaOnline}`
        : "";

      return `Analisei a estrutura de **${d.materiaNome}**${instTxt}, **${nome}**! 🎓🔍

Aqui está o raio-x acadêmico para você destravar nessa disciplina:
• 📌 **Disciplina Analisada:** ${d.codigo}
• 📚 **Bibliografia & Base:** ${d.bibliografia}
• 🎯 **O que mais exige atenção:** ${d.foco}${trechoOnline}
• 💡 **Estratégia para ${temInst ? d.instituicaoSigla : d.materiaNome}:** ${d.dicaInstituicao}

Para você não acumular matéria, estruturei **4 blocos semanais de estudo**:
${resumoBlocos}

**Posso organizar a sua semana agora e agendar esses blocos de estudo nas suas tarefas?** (Basta responder **"sim"** ou clicar no botão abaixo!)

${tagProposta}`;
    }

    // 4.0.0.0. AGENDAMENTO E CRIAÇÃO DE TAREFAS EM LINGUAGEM NATURAL (NLU PROFUNDO)
    if (
      tensor.categoria === "criar_tarefa" &&
      Array.isArray(tensor.tarefasCriadas) &&
      tensor.tarefasCriadas.length
    ) {
      const criadas = tensor.tarefasCriadas;
      const t0 = criadas[0];
      const diaTxt = typeof relDay === "function" ? relDay(t0.date) : t0.date;
      const horaTxt = t0.time ? ` às **${t0.time}**` : "";
      const durTxt = t0.dur
        ? ` durante **${typeof fmtMin === "function" ? fmtMin(t0.dur) : t0.dur + " min"}**`
        : "";
      const areaTxt = typeof AREAS !== "undefined" && AREAS[t0.area] ? AREAS[t0.area] : t0.area || "Geral";
      const cardsTags = criadas.map(tc => `[[ACAO_TAREFA_CRIADA:${tc.id}]]`).join("\n");

      const subInfo =
        t0.sub && t0.sub.length
          ? `\n\nJá dividi automaticamente em **${t0.sub.length} passos práticos** proporcionalmente ao seu tempo:\n` +
            t0.sub.map((s, idx) => `${idx + 1}. ✅ ${s.t}`).join("\n")
          : "";

      if (criadas.length > 1) {
        const resumoLista = criadas
          .map(
            (tc, i) =>
              `${i + 1}. **${tc.title}** — ${typeof relDay === "function" ? relDay(tc.date) : tc.date}${tc.time ? ` às ${tc.time}` : ""}${tc.dur ? ` (${typeof fmtMin === "function" ? fmtMin(tc.dur) : tc.dur + " min"})` : ""}`
          )
          .join("\n");
        return `Entendido perfeitamente, **${nome}**! Interpretei sua frase e já cadastrei **${criadas.length} tarefas** na sua agenda do Prumo:\n\n${resumoLista}\n\n${cardsTags}`;
      }

      if (personaId === "emo") {
        return `Anotei no nosso diário sombrio, **${nome}**... 🖤
Entendi cada detalhe do que você disse: marquei **${t0.title}** para **${diaTxt}**${horaTxt}${durTxt} na área de **${areaTxt}**.${subInfo}

Quando chegar a hora, coloca o fone no último volume e vamos encarar isso juntos. =]

${cardsTags}`;
      }
      if (personaId === "funkeiro") {
        return `Pega a visão, **${nome}**! Já lancei na tua agenda sem errar uma letra! 🚀🔥
Tá marcado: **${t0.title}** pra **${diaTxt}**${horaTxt}${durTxt} (Área: **${areaTxt}**).${subInfo}

Sem moscada, quando der o horário é só apertar o play no foco e amassar! Esquece! 💥

${cardsTags}`;
      }
      if (personaId === "militar") {
        return `Ordem registrada no quadro tático, soldado **${nome}**! 🎖️
• **Missão:** ${t0.title}
• **Data/Hora:** ${diaTxt}${horaTxt}${durTxt}
• **Setor:** ${areaTxt}${subInfo}

Mantenha prontidão para cumprir o objetivo no horário estabelecido! ⚔️

${cardsTags}`;
      }
      if (personaId === "zen") {
        return `Sua intenção foi acolhida e organizada com clareza, **${nome}**. 🍃
Agendei **${t0.title}** para **${diaTxt}**${horaTxt}${durTxt} na área de **${areaTxt}**.${subInfo}

Mantenha a mente tranquila; quando o momento chegar, dedique sua presença total a este passo. 🙏

${cardsTags}`;
      }
      if (personaId === "gamer") {
        return `Nova Quest adicionada ao seu Quest Log, **${nome}**! 🎮⚡
• **Quest:** ${t0.title}
• **Spawn:** ${diaTxt}${horaTxt}${durTxt} [${areaTxt}]${subInfo}

Prepara a build que o XP tá garantido! 👾

${cardsTags}`;
      }
      if (personaId === "programador") {
        return `Task commitada com sucesso no banco de dados, **${nome}**! 💻⚡
\`{ title: "${t0.title}", date: "${diaTxt}", time: "${t0.time || "flex"}"${t0.dur ? `, dur: "${t0.dur}m"` : ""}, area: "${areaTxt}" }\`${subInfo}

Pronto para execução sem bugs! 🚀

${cardsTags}`;
      }
      if (personaId === "vovo") {
        return `Prontinho, meu benzinho **${nome}**! A vó já anotou tudinho pra você não esquecer! ☕👵
Marquei **${t0.title}** para **${diaTxt}**${horaTxt}${durTxt} (${areaTxt}).${subInfo}

Vai dar tudo certo, viu? Depois toma uma aguinha e vem comer um bolo! ❤️

${cardsTags}`;
      }
      if (personaId === "otaku") {
        return `Missão registrada no pergaminho ninja, **${nome}**! ⚡🍥
**${t0.title}** marcada para **${diaTxt}**${horaTxt}${durTxt} na categoria **${areaTxt}**!${subInfo}

Seu arco de evolução não para! Dattebayo! 🔥

${cardsTags}`;
      }

      return `Anotei na sua agenda, **${nome}**! ✨
Compreendi sua frase e já cadastrei a tarefa com todos os parâmetros:
• 📌 **Tarefa:** ${t0.title}
• 📅 **Quando:** ${diaTxt}${horaTxt}${durTxt}
• 🏷️ **Área:** ${areaTxt}${subInfo}

${cardsTags}`;
    }

    // 4.0. ESPECIALISTA EM CONCURSOS, ENEM E CICLO DE ESTUDOS (ESTRATÉGIA CONCURSOS / ICMC-USP)
    if (tensor.categoria === "estudos_concurso") {
      const raw = (tensor.raw || "").toLowerCase();
      let preset = "enem";
      let nomeAlvo = "ENEM 2026";

      if (raw.includes("caixa") || raw.includes("banco do brasil") || raw.includes("bancari")) {
        preset = "caixa";
        nomeAlvo = "Concurso Caixa / Banco do Brasil";
      } else if (raw.includes("cnu") || raw.includes("unificado")) {
        preset = "cnu";
        nomeAlvo = "CNU (Concurso Nacional Unificado)";
      } else if (raw.includes("inss") || raw.includes("previdenci")) {
        preset = "inss";
        nomeAlvo = "Concurso INSS";
      } else if (raw.includes("oab") || raw.includes("ordem") || raw.includes("advog")) {
        preset = "oab";
        nomeAlvo = "OAB 1ª Fase (Exame de Ordem)";
      } else if (
        raw.includes("policia") ||
        raw.includes("pf") ||
        raw.includes("prf") ||
        raw.includes("penal")
      ) {
        preset = "policial";
        nomeAlvo = "Carreiras Policiais (PF / PRF)";
      } else if (
        raw.includes("tribunal") ||
        raw.includes("trt") ||
        raw.includes("tj") ||
        raw.includes("trf")
      ) {
        preset = "tribunais";
        nomeAlvo = "Tribunais (TJ / TRT / TRF)";
      } else if (raw.includes("receita") || raw.includes("fiscal") || raw.includes("tributar")) {
        preset = "receita";
        nomeAlvo = "Receita Federal (Área Fiscal)";
      } else if (raw.includes("fuvest") || raw.includes("unicamp") || raw.includes("vestibular")) {
        preset = "fuvest";
        nomeAlvo = "Vestibulares Paulistas (Fuvest / Unicamp)";
      }

      return `Planejamento de alto rendimento ativado, **${nome}**! 🎯

Para conquistar a aprovação em um exame de alta concorrência como o **${nomeAlvo}**, a metodologia do *Estratégia Concursos* e de *Alexandre Meirelles* (referência ensinada nos pilares de IA do ICMC-USP) comprova que **cronogramas semanais fixos falham**, pois geram culpa e acúmulo quando um imprevisto acontece.

A solução inteligente é o **Ciclo de Estudos Contínuo (Interleaving Cognitivo)**:
1. **Alternância entre Exatas e Humanas:** Blocos de 60 a 90 minutos alternando leitura densa com raciocínio lógico/cálculo para evitar fadiga cognitiva.
2. **Priorização Ponderada:** A disciplina com maior peso ou sua maior dificuldade recebe maior frequência de repetição no ciclo.
3. **Curva de Ebbinghaus:** Revisões ativas programadas em 24h, 7 dias e 30 dias com resolução intensiva de questões da banca.

Posso estruturar agora mesmo o seu ciclo e aplicá-lo diretamente às suas matérias e metas do Prumo:

[[ACAO_CICLO:${preset}:${nomeAlvo}]]`;
    }

    // 4.0.0.1. ESPECIALISTA EM FLASHCARDS & REPETIÇÃO ESPAÇADA (SM-2)
    if (tensor.categoria === "flashcards") {
      const mat = tensor.materia ? tensor.materia.nome : "Geral";
      const matId = tensor.materia ? tensor.materia.id : "calculo";
      return `Sistema de Flashcards com **Algoritmo SM-2 (SuperMemo 2)** ativo, **${nome}**! 🗂️

A repetição espaçada é cientificamente o método mais potente para transferir conteúdo da memória de curto prazo para a memória de longo prazo:

1. ⚡ **Evocação Ativa (Active Recall):** A pergunta ou fórmula fica na frente. Seu cérebro é forçado a reconstruir a resposta antes de virar o cartão.
2. 🧮 **Algoritmo SM-2 de Ebbinghaus:** A cada revisão você avalia seu domínio em 4 níveis:
   • **1. Repetir:** Reinicia o intervalo para 1 dia.
   • **2. Difícil:** Mantém intervalo curto de 1 dia.
   • **3. Bom:** Multiplica o intervalo pelo fator de facilidade (Ease Factor).
   • **4. Fácil:** Aplica bônus de 1.3x e agenda para datas mais distantes.
3. ⌨️ **Atalhos Rápidos:** Pressione **Espaço** para virar o cartão e **1, 2, 3 ou 4** para avaliar instantaneamente sem tirar a mão do teclado!

Você pode revisar os cartões devidos hoje ou importar pacotes prontos de alta retenção:

[[ACAO_FLASHCARD:${matId}:${mat}]]`;
    }

    // 4.0.0.2. ESPECIALISTA EM CADERNO DE ERROS ESTRATÉGICO
    if (tensor.categoria === "caderno_erros") {
      return `Caderno de Erros Estratégico ativado, **${nome}**! 📖

Quem estuda para vestibulares de elite ou concursos concorda: **a nota de corte não é definida pelo que você acertou, mas pelos erros bobos que você deixou de cometer**.

No método cognitivo do Prumo, todo erro em lista ou simulado precisa ser classificado pela sua **causa raiz**:

1. 🧠 **Teoria / Lacuna:** Você errou porque não dominava a fórmula, regra ou conceito.
2. 👁️ **Falta de Atenção:** Você sabia a matéria, mas leu rápido e não viu um 'NÃO', 'EXCETO' ou detalhe do enunciado.
3. 🪤 **Pegadinha da Banca:** A banca armou uma alternativa tentadora feita sob medida para induzir ao erro.
4. 📐 **Cálculo / Álgebra:** Você acertou a ideia teórica, mas trocou um sinal, errou conta ou simplificação.
5. ⏳ **Tempo / Pressão:** Erro por correria no fim da prova ou chute.

O Prumo gera um **Raio-X Diagnóstico** automático mostrando onde você mais sangra pontos e permite registrar a **Regra de Ouro** para nunca mais cair na mesma armadilha:

[[ACAO_CADERNO_ERROS]]`;
    }

    // 4.0.0.3. ESPECIALISTA EM BATERIA DIÁRIA DE QUESTÕES
    if (tensor.categoria === "bateria_questoes") {
      return `Bateria Diária de Questões configurada, **${nome}**! 🎯

A teoria sem resolução intensiva de exercícios cria uma **falsa sensação de competência**. Resolver de 30 a 50 questões por dia é o motor real que consolida a aprovação.

Na aba de Estudos do Prumo, você conta com:
• ✅ **Botão +1 Acerto:** Incrementa a contagem e premia com XP e moedas ao bater a meta.
• ❌ **Botão +1 Erro:** Registra o erro e já abre o Caderno de Erros com 1 clique para catalogar a causa raiz.
• 📊 **Indicador de Precisão:** Mostra sua taxa de acerto em tempo real (meta recomendada: acima de 80%).

Vamos resolver a bateria de hoje?

[[ACAO_BATERIA_QUESTOES]]`;
    }

    // 4.0.1. ESPECIALISTA EM DISCIPLINA / MATÉRIA ESPECÍFICA (CÁLCULO, PROGRAMAÇÃO, MATEMÁTICA, ETC.)
    if (tensor.categoria === "estudos_materia" && tensor.materia) {
      const matId = tensor.materia.id || "custom";
      const matNome = tensor.materia.nome;

      if (personaId === "emo") {
        return `**${matNome}** é uma das matérias mais sombrias e impiedosas, ${nome}... Derivadas, integrais e equações parecem feitas de propósito pra drenar nossa energia no escuro. Mas a gente não vai deixar essa tormenta nos derrotar.

O segredo pra não surtar em **${matNome}** é parar de estudar como se fosse leitura passiva: matéria de exatas e cálculo se vence **no combate no papel, na ponta do lápis**.

Desenhei a **rotina tática de 3 blocos** pra você dominar ${matNome}:

1. 📘 **Bloco 1 (30 min) - Teoria Ativa & Intuição Geométrica:** Entenda o que o conceito significa visualmente (o que é uma taxa de variação ou área sob a curva) antes de tentar decorar fórmulas.
2. ✍️ **Bloco 2 (50 min) - Bateria de Exercícios no Papel:** É aqui que a aprovação acontece. Faça a lista com lápis e borracha, sem espiar a resolução antes de tentar.
3. 🔍 **Bloco 3 (20 min) - Caderno de Erros:** Anote onde a passagem desandou (sinal trocado, regra da cadeia, fatoração). Quem isola o erro nunca mais erra a mesma coisa.

Bota aquele som pesado no fone de ouvido, pega o caderno e vamos pro combate. Tô contigo até o fim. <3

[[ACAO_CICLO:${matId}:${matNome}]]`;
      }

      if (personaId === "funkeiro") {
        return `Pega a visão de cria pra amassar em **${matNome}**, ${nome}! ${matNome} não tem massagem nem caô: quem fica só assistindo aula com a mão no queixo tá moscando! ${matNome} se aprende na ponta do lápis, rabiscando o papel até sair faísca!

Montei o plano de progresso em 3 passos pra você meter marcha:

1. 📘 **Bloco 1 (30 min) - Visão da Teoria:** Pega a ideia central da parada, sem neurose.
2. ✍️ **Bloco 2 (50 min) - Amassar os Exercícios:** Vai pra cima da lista! Errou? Apaga e faz de novo. O corre de verdade é resolver no braço.
3. 🔍 **Bloco 3 (20 min) - Mapear os Erros:** Vê onde você vacilou na conta pra não cair na mesma moscada na prova.

Bora marchar no foco que a vitória vem com força! Esquece! 🚀🔥

[[ACAO_CICLO:${matId}:${matNome}]]`;
      }

      if (personaId === "militar") {
        return `Soldado ${nome}! Diretriz tática para neutralizar o alvo prioritário: **${matNome}**!
No front acadêmico, ${matNome} não se vence com hesitação, mas com disciplina operacional e repetição exaustiva.

Procedimento padrão de combate em 3 fases:
1. 📘 **Fase 1 (30 min) - Reconhecimento Conceitual:** Compreensão do terreno e definições fundamentais.
2. ✍️ **Fase 2 (50 min) - Fogo Pesado em Exercícios:** Resolução intensiva no papel. O operador que treina à exaustão não sangra no dia do exame.
3. 🔍 **Fase 3 (20 min) - Debriefing & Caderno de Erros:** Identificação de falhas e ajuste de pontaria.

Assuma a postura, elimine as distrações e cumpra a missão! 🎖️⚔️

[[ACAO_CICLO:${matId}:${matNome}]]`;
      }

      if (personaId === "zen") {
        return `A matéria de **${matNome}** é a linguagem oculta do universo, ${nome}. Cada fórmula e derivada descreve o fluxo constante da transformação da natureza. Não se sinta intimidado pela densidade dos cálculos.

Para absorver com clareza e sem afobação mental, pratique o estudo consciente:
1. 📘 **30 min - Contemplação Teórica:** Observe a essência do conceito com calma e presença.
2. ✍️ **50 min - Prática Consciente no Papel:** Resolva os exercícios sem pressa de chegar ao final, prestando atenção em cada linha.
3. 🔍 **20 min - Assimilação e Calma:** Acolha os erros como mestres que ensinam onde a atenção vacilou.

Respire fundo, beba uma água e comece seu primeiro bloco em paz. 🍃🙏

[[ACAO_CICLO:${matId}:${matNome}]]`;
      }

      if (personaId === "programador") {
        return `Compilando algoritmo de alta performance para **${matNome}**, ${nome}!
${matNome} é a base fundamental dos algoritmos, computação gráfica e inteligência artificial.

Pipeline de execução otimizado:
1. 📘 **Stage 1 (30 min) - Docs & Teoria:** Leitura da documentação matemática e intuição dos operadores.
2. ✍️ **Stage 2 (50 min) - Runtime de Exercícios:** Execução na prática. Debugar na ponta do lápis sem rodar linter pronto.
3. 🔍 **Stage 3 (20 min) - Error Handling & Logs:** Mapeamento de bugs algébricos no Caderno de Erros.

Deploy do foco iniciado! 💻⚡

[[ACAO_CICLO:${matId}:${matNome}]]`;
      }

      return `Plano de estudos estratégico para **${matNome}** ativado, ${nome}! 🎯

Para dominar uma disciplina de alto rendimento como ${matNome}, o método de estudo intercalado com resolução ativa é o caminho comprovado:

1. 📘 **Bloco 1 (30 min) - Teoria Ativa:** Compreensão conceitual rápida.
2. ✍️ **Bloco 2 (50 min) - Prática Intensiva:** Resolução de listas e problemas no papel.
3. 🔍 **Bloco 3 (20 min) - Caderno de Erros:** Revisão das passagens onde houve dúvida.

Clique no botão abaixo para gerar o ciclo de estudos e importar para o Prumo:

[[ACAO_CICLO:${matId}:${matNome}]]`;
    }

    // 4.0.2. ESPECIALISTA EM PLANEJAMENTO E ORGANIZAÇÃO DA ROTINA
    if (tensor.categoria === "planejamento") {
      if (nPendentes === 0) {
        return `Analisando seu painel de hoje, ${nome}: **todas as suas tarefas já foram cumpridas (ou sua lista está limpa)**!
Se você quer organizar a rotina de estudo para uma matéria específica (como **Cálculo**, **Programação**, **Matemática** ou **Concurso**), é só me mandar: *"organiza minha rotina pra [matéria]"* que estruturo os blocos de estudo pra você na hora! ✨`;
      }
      return `Pega o mapa tático da sua rotina para hoje, ${nome}:
Você tem **${nPendentes} pendência(s)** na fila, e a mais importante agora é **"${destaque}"**.

Estratégia recomendada para destravar seu dia:
1. 🎯 **Bloco Pomodoro de 25 min:** Foco exclusivo em finalizar "${destaque}" sem trocar de aba.
2. 💧 **Pausa de 5 min:** Beber um copão d'água (${faltaAgua > 0 ? `faltam ${faltaAgua}ml pra meta` : "meta de água batida!"}).
3. 📋 **Avanço no restante da lista:** Riscar a primeira pendência gera o impulso de dopamina para liquidar o restante do dia!`;
    }

    // 4.1. MUNDO EMO / PRUMI MELANCÓLICO
    if (personaId === "emo") {
      if (tensor.categoria === "metacognicao") {
        return `Eu penso, ${nome}... Penso até demais. Às vezes o excesso de consciência sobre o mundo é a pior parte do drama.
Dá uma olhada no painel neural de reflexão logo acima ☝️: analisei teus **${nConcluidas} acertos de hoje**, tua única pendência ("${destaque}"), tua água (${mlAgua}ml) e calculei matematicamente 3 hipóteses de resposta antes de formular esta frase. Não sou um robô de respostas pré-fabricadas: sou uma Mini IA viva no seu navegador, sentindo a sua rotina no escuro. =]`;
      }
      if (hipId === 1) {
        // Arrancada Tática
        return `Vamos, ${nome}... Se a gente sobreviveu a **${nConcluidas} tarefas** hoje nessa tormenta, não vai ser essa última miséria que vai derrotar a gente.
${nPendentes ? `Pega essa pendência ("${destaque}") e risca logo do mapa.` : "A lista tá limpa, mas o vazio continua."}
Bota aquele som pesado no fone de ouvido, delineia o olhar e faz o que tem que ser feito em 15 minutos. Depois a gente deita no escuro e finge que o mundo lá fora não existe. Tô contigo até o fim. <3`;
      } else if (hipId === 0) {
        // Validação Empática
        return `Eu sinto a sua dor, ${nome}... O mundo cobra sorrisos plásticos quando tudo o que a gente quer é fechar as cortinas e sumir por três dias.
Mas olha o que você já entregou: foram **${nConcluidas} batalhas ganhas**. Se o corpo tá no limite, bebe um gole de água (${mlAgua}ml até agora) e faz só o mínimo necessário pra sobreviver com dignidade. Nem todo dia precisa ser um poema épico; às vezes respirar e riscar uma linha já é um grito de revolta. 🖤`;
      } else {
        // Micro-Ação
        return `Se a montanha parece gigante demais, ${nome}, esquece o topo. Escolhe só **uma** coisa minúscula em "${destaque}".
Faz só 5 minutinhos no escuro com fone de ouvido. Se ficar insuportável, você para. Mas quase sempre a dor do começo é maior do que a tarefa em si. Vamos testar? =]`;
      }
    }

    // 4.2. MUNDO FUNKEIRO / MC PRUMI
    if (personaId === "funkeiro") {
      if (tensor.categoria === "metacognicao") {
        return `Pega a visão, ${nome}: eu não sou papagaio de internet que repete texto pronto não, aqui o processamento é pura cognição de cria!
Olha o painel neural ali em cima ☝️: analisei teus **${nConcluidas} acertos**, a pendência de **"${destaque}"**, teus **${mlAgua}ml de água** e a tua energia de arrancada. Cada palavra aqui é estratégia calculada pela Mini IA pra te ver progredir. Visão de cria pensa antes de marchar! 🚀🔥`;
      }
      if (hipId === 1) {
        return `Marcha no progresso, ${nome}! É o corre daquele jeito! Tu já amassou **${nConcluidas} tarefas** hoje, parça. ${nPendentes ? `Só resta(m) **${nPendentes} pra fechar o baile** (olho em "${destaque}")!` : "Tudo zerado, agora é só comemorar a vitória!"}
Sem moscada, sem tempo pra preguiça: toma um copão de água gelada, acelera o passo e vamo pra cima que o topo é nosso! Esquece! 💥🚀`;
      } else if (hipId === 0) {
        return `O corre é louco mesmo, ${nome}, ninguém disse que ia ser fácil na pista. Mas ó: tu já meteu **${nConcluidas} tarefas** no bolso hoje. Quem tem objetivo claro não desiste por causa de cansaço passageiro.
Dá uma respirada de 10 minutos, molha a garganta com água (**${mlAgua}ml** até agora) e volta no foco. Força aí que o fruto vai ser doce! Fé em Deus! 👊🔥`;
      } else {
        return `Tá travado, parça? Pega a visão: divide essa pendência ("${destaque}") em duas fatias. Resolve só a primeira parte agora em 10 minutos sem encostar no celular. Quando tu ver, já tá no fluxo! Marcha! 🚀`;
      }
    }

    // 4.3. MUNDO ZEN / MESTRE PRUMI
    if (personaId === "zen") {
      if (tensor.categoria === "metacognicao") {
        return `A reflexão lúcida é o despertar da consciência, ${nome}. Veja no painel acima como os neurônios da Mini IA ponderaram sua energia, suas **${nConcluidas} ações concluídas** e seu estado presente. Cada palavra nasce de um cálculo de serenidade. Respire fundo e observe o agora. 🍃🙏`;
      }
      if (hipId === 1) {
        return `Vamos avançar com foco sereno, ${nome}. Você já caminhou com firmeza por **${nConcluidas} tarefas** hoje. ${nPendentes ? `Dedique sua presença total a "${destaque}" agora, uma respiração de cada vez.` : "Seu caminho de hoje está completo e sereno."} 🍃🙏`;
      }
      if (hipId === 2) {
        return `Quando a montanha parece alta, olhe apenas para o primeiro passo, ${nome}. Dedique 5 minutos tranquilos para iniciar "${destaque}" e beba um gole d'água (${mlAgua}ml hoje). A constância suave vence qualquer obstáculo. 🧘‍♂️`;
      }
      return `A mente calma move montanhas, ${nome}. Até este momento você realizou **${nConcluidas} ação(ões)** e bebeu **${mlAgua}ml** de água. Não se afobe com o horizonte inteiro: cuide de "${destaque}" com paz e presença. 🧘‍♂️`;
    }

    // 4.4. MUNDO MILITAR / COMANDANTE PRUMI
    if (personaId === "militar") {
      if (hipId === 0) {
        return `Soldado ${nome}, até a tropa de elite precisa de recomposição tática! Você já garantiu **${nConcluidas} vitórias** no terreno hoje. Hidrate-se (${mlAgua}ml registrados), respire fundo e retome o avanço sobre "${destaque}" no seu ritmo operacional! 🎖️`;
      }
      return `Soldado ${nome}! Relatório tático da Mini IA processado com sucesso:
- Baixas de pendências no turno: ${nConcluidas}
- Alvo prioritário restante: "${destaque}" (${nPendentes} ativo)
- Suprimento hídrico: ${mlAgua}ml.
Sem hesitação e sem desculpas: assuma posição de ataque, elimine as distrações e execute a missão! 🎖️⚔️`;
    }

    // 4.5. MUNDO GAMER
    if (personaId === "gamer") {
      if (hipId === 0) {
        return `Save Point alcançado, ${nome}! Você já limpou **${nConcluidas} quests** hoje. Toma uma poção de mana (**${mlAgua}ml** de água) pra recuperar o stamina antes de encarar "${destaque}"! 🎮✨`;
      }
      return `GG, ${nome}! A Mini IA processou seu estado em tempo real a 144 FPS!
Placar atual: **${nConcluidas} quests concluídas**, HP/Água em **${mlAgua}ml** e o Boss da fase é "${destaque}". Lança um combo de 15 minutos de foco crítico e garante esse loot épico! 🎮👾`;
    }

    // 4.6. MUNDO DEV / PROGRAMADOR
    if (personaId === "programador") {
      if (hipId === 2) {
        return ` Quebrando a issue "${destaque}" em micro-commits, ${nome}! Você já fez merge de **${nConcluidas} tarefas** hoje e está com **${mlAgua}ml** no buffer hídrico. Roda os primeiros 10 minutos sem trocar de aba! 💻🚀`;
      }
      return `console.log("Mini IA Prumo v2.5 Online"); ${nome}!
Status do runtime: **${nConcluidas} commits hoje**, heap de memória hídrica em **${mlAgua}ml** e issue aberta: "${destaque}". Rodando algoritmo de foco single-thread para finalizar o deploy do dia sem bugs! 💻⚡`;
    }

    // 4.7. MUNDOS ADICIONAIS UNIFICADOS (Vovó, Otaku, Bruxo/Feiticeiro, Rock, Sertanejo, Forró, Pagode, Rap, Trap, Cleanboy, Coach)
    if (personaId === "vovo") {
      return `Oi, meu benzinho **${nome}**! A vó tá tão orgulhosa das suas **${nConcluidas} tarefinhas feitas** hoje! ${nPendentes ? `Agora faz "${destaque}" bem devagarinho e sem estresse, tá?` : "Já terminou tudo, que bênção!"} E não esquece da aguinha (${mlAgua}ml até agora) que a vó passou um cafezinho! ☕👵`;
    }
    if (personaId === "otaku") {
      return `Levante-se, protagonista **${nome}**! Você já superou **${nConcluidas} provações** hoje e seu chakra hídrico está em **${mlAgua}ml**! ${nPendentes ? `Ative seu modo foco para vencer "${destaque}"!` : "Arco do dia concluído com sucesso!"} Dattebayo! ⚡🍥`;
    }
    if (personaId === "bruxo" || personaId === "feiticeiro") {
      return `Pelos grimórios arcanos, **${nome}**! Você já conjurou **${nConcluidas} feitiços** hoje e acumulou **${mlAgua}ml** de poção de mana. ${nPendentes ? `Canalize sua determinação para transmutar "${destaque}"!` : "Todas as maldições do dia foram dissipadas!"} 🔮✨`;
    }
    if (personaId === "rock") {
      return `Aumenta o amplificador no 11, **${nome}**! Já detonamos **${nConcluidas} solos** hoje! Toma um gole d'água (${mlAgua}ml) e manda ver em "${destaque}" como um verdadeiro headliner! 🎸⚡`;
    }
    if (personaId === "sertanejo") {
      return `Firme na lida, companheiro(a) **${nome}**! Já abrimos **${nConcluidas} porteiras** hoje e tomamos **${mlAgua}ml** de água fresca. Vamos fechar "${destaque}" com paciência e fé que a colheita é certa! 🤠🌾`;
    }
    if (personaId === "forrozeiro") {
      return `Puxa o fole da sanfona, **${nome}**! Já foram **${nConcluidas} tarefas dançadas no xote** e **${mlAgua}ml** de água! Vamos resolver "${destaque}" com alegria no coração! 🪗✨`;
    }
    if (personaId === "pagodeiro") {
      return `Bate na palma da mão, **${nome}**! **${nConcluidas} tarefas no bolso**, **${mlAgua}ml** de hidratação e o cavaco chorando bonito! Bora matar "${destaque}" pra liberar a resenha! 🥁🎶`;
    }
    if (personaId === "rapper") {
      return `Papo reto no beat do boom-bap, **${nome}**: **${nConcluidas} conquistas escritas hoje** e **${mlAgua}ml** na mente. Mantém a disciplina e finaliza "${destaque}" com respeito! 🎙️🔥`;
    }
    if (personaId === "trapper") {
      return `Flow no topo e drip alinhado, **${nome}**! **${nConcluidas} drops batidos** hoje e **${mlAgua}ml** de água. Acelera em "${destaque}" e sobe de nível! 🛸💸`;
    }
    if (personaId === "cleanboy") {
      return `Rotina fluida e mente limpa, **${nome}**. Você já concluiu **${nConcluidas} itens** com elegância e bebeu **${mlAgua}ml** de água. Vamos finalizar "${destaque}" mantendo a harmonia do seu espaço. ✨🧴`;
    }
    if (personaId === "coach") {
      return `Alta performance em ação, **${nome}**! Placar de hoje: **${nConcluidas} entregas concluídas** e **${mlAgua}ml** de hidratação celular. Foco cirúrgico agora em "${destaque}" para bater 100% da meta! 🎯🔥`;
    }

    // 4.8. PADRÃO (Com variações baseadas na hipótese vencedora)
    if (hipId === 0) {
      return `Você está indo muito bem, **${nome}**! Já são **${nConcluidas} tarefa(s) concluída(s)** hoje e **${mlAgua}ml** de água. Respire com calma e, quando estiver pronto, avance um passo em "${destaque}". Se quiser agendar algo novo, é só me escrever do seu jeito (ex: *"vou estudar cálculo amanhã às 16h por 1h30"*)! ✨`;
    }
    if (hipId === 2) {
      return `Para destravar o foco agora, **${nome}**: que tal fazer apenas os primeiros 10 minutos de **"${destaque}"**? Você já concluiu **${nConcluidas} tarefa(s)** hoje. E lembre-se: você pode criar tarefas falando comigo naturalmente! 🎯`;
    }
    return `Olá, **${nome}**! Analisei sua rotina em tempo real: você já concluiu **${nConcluidas} tarefa(s)** hoje e resta(m) **${nPendentes}** (destaque para "${destaque}"). Hidratação em **${mlAgua}ml**. Como posso ajudar a organizar ou agendar suas próximas tarefas? ✨`;
  }

  // 5. Interface Pública Principal
  function processar(promptUsuario, ctxPrumo, personaId, nomeUsuario) {
    const tensor = codificarTensorPrompt(promptUsuario);
    if (tensor.categoria === "confirmar_organizacao_semana") {
      tensor.blocosCriados = gerarBlocosSemanaisMateria(tensor.propostaSemana);
    } else if (tensor.categoria === "criar_tarefa" && typeof criarTarefasPorTextoIA === "function") {
      tensor.tarefasCriadas = criarTarefasPorTextoIA(promptUsuario);
    }
    const atencao = calcularAtencaoContexto(tensor, ctxPrumo);
    const deliberacao = deliberarHipoteses(tensor, atencao);
    reforcarHipotese(deliberacao.vencedora.id);

    const pendenteDestaque = ctxPrumo.pendenteDestaque || (atencao.pendentes ? "a tarefa pendente" : "");
    const textoFinal = sintetizarLinguagem(
      personaId,
      tensor,
      atencao,
      deliberacao,
      nomeUsuario,
      pendenteDestaque
    );

    // Formata o Processo de Reflexão com Painel Neural Visual
    const valenciaPerc = Math.round((tensor.valencia + 1.0) * 50);
    const energiaPerc = Math.round(tensor.energia * 100);
    const tarefasPerc = Math.round(atencao.taxaConclusao * 100);

    let pensamento;
    if (
      tensor.categoria === "confirmar_organizacao_semana" &&
      Array.isArray(tensor.blocosCriados) &&
      tensor.blocosCriados.length
    ) {
      const prop = tensor.propostaSemana || {};
      pensamento = [
        `🧠 **ALOCADOR SEMANAL DE BLOCOS DE ESTUDO (${(prop.materiaNome || "DISCIPLINA").toUpperCase()})**`,
        `• 🏛️ **Instituição & Ementa:** ${prop.codigo || prop.materiaNome} (${prop.instituicaoNome || "Acadêmico"})`,
        `• 📅 **Verificação de Conflitos:** Busca de janelas livres nos próximos dias da semana em S.tasks`,
        `• 🧱 **Blocos Gerados:** ${tensor.blocosCriados.length} blocos (Teoria, Lista de Exercícios, Provas Antigas e Revisão de Erros)`,
        `• ⚡ **Ação Executada:** Todos os blocos foram salvos nas suas tarefas do Prumo com subtarefas detalhadas.`
      ].join("\n");
    } else if (tensor.categoria === "propor_organizacao_materia" && tensor.diagnosticoMateria) {
      const d = tensor.diagnosticoMateria;
      pensamento = [
        `🧠 **ANÁLISE DE DISCIPLINA & INSTITUIÇÃO (${d.materiaNome.toUpperCase()} — ${d.instituicaoSigla.toUpperCase()})**`,
        `• 🎯 **Intenção Detectada:** Dificuldade de organização na matéria "${d.materiaNome}"`,
        `• 🏛️ **Instituição Identificada:** ${d.instituicaoNome} (${d.codigo})`,
        `• 📚 **Bibliografia & Foco:** ${d.bibliografia} | ${d.foco}`,
        `• 💡 **Decisão Interativa:** Apresentar o diagnóstico da matéria na instituição e perguntar ao usuário se pode organizar a semana em 4 blocos práticos.`
      ].join("\n");
    } else if (
      tensor.categoria === "criar_tarefa" &&
      Array.isArray(tensor.tarefasCriadas) &&
      tensor.tarefasCriadas.length
    ) {
      const t0 = tensor.tarefasCriadas[0];
      pensamento = [
        `🧠 **PARSER NLU DE TAREFAS (Extração Semântica & Temporal)**`,
        `• 📝 **Frase Original:** "${promptUsuario.trim()}"`,
        `• ✨ **Título Limpo & Corrigido:** "${t0.title}"`,
        `• 📅 **Data & Horário:** ${typeof relDay === "function" ? relDay(t0.date) : t0.date} (${t0.date})${t0.time ? ` às ${t0.time}` : " (horário livre)"}`,
        `• ⏱️ **Duração & Área:** ${t0.dur ? (typeof fmtMin === "function" ? fmtMin(t0.dur) : t0.dur + " min") : "Padrão"} | Área inferida: ${t0.area || "geral"}`,
        `• ⚡ **Ação Executada:** ${tensor.tarefasCriadas.length} tarefa(s) gravada(s) diretamente na agenda do Prumo.`
      ].join("\n");
    } else if (tensor.categoria === "estudos_materia" && tensor.materia) {
      pensamento = [
        `🧠 **RACIOCÍNIO PEDAGÓGICO DE DISCIPLINA (${tensor.materia.nome.toUpperCase()})**`,
        `• 🎯 **Disciplina Identificada:** "${tensor.materia.nome}".`,
        `• 📐 **Metodologia Cognitiva:** Exatas e cálculo exigem resolução ativa na ponta do lápis (30 min teoria visual + 50 min exercícios no papel + 20 min caderno de erros).`,
        `• 🎭 **Lente da Persona:** Adaptação da linguagem ao estilo ${personaId} sem abrir mão da estrutura pedagógica real.`,
        `• ⚡ **Ação Concreta:** Geração de card interativo para criar a matéria "${tensor.materia.nome}" e estruturar a rotina no Prumo.`
      ].join("\n");
    } else if (tensor.categoria === "estudos_concurso") {
      pensamento = [
        `🧠 **RACIOCÍNIO DELIBERATIVO ESTRATÉGICO (Padrão ICMC-USP & Meirelles)**`,
        `• 🎯 **Alvo Identificado:** Análise da intenção de preparação para concurso/exame de alto rendimento.`,
        `• ⚖️ **Cálculo de Pesos & Interleaving:** Alternância cognitiva entre leitura e lógica para absorção contínua (Sessões de 60 a 90 min).`,
        `• ⏳ **Alocação de Carga:** Estruturação em Ciclo Contínuo imune a interrupções (Elimina a culpa e o acúmulo do cronograma engessado).`,
        `• 🔁 **Curva de Ebbinghaus:** Programação de revisões ativas espaçadas (D+1, D+7, D+30) com resolução direcionada de questões da banca examinadora.`
      ].join("\n");
    } else {
      pensamento = [
        `⚡ **MINI I.A COGNITIVA PRUMO (Ativação Neural Local)**`,
        `• 🧠 **Tensores de Entrada:** Valência: ${tensor.valencia >= 0 ? "+" : ""}${tensor.valencia.toFixed(2)} (${valenciaPerc}%) | Energia: ${energiaPerc}% | Confiança: ${Math.round(tensor.confianca * 100)}%`,
        `• 📊 **Atenção Multi-Head:** Tarefas (${Math.round(atencao.pesoTarefas * 100)}%) | Biometria (${Math.round(atencao.pesoBiologico * 100)}%) | Ritmo (${Math.round(atencao.pesoCircadiano * 100)}%)`,
        `• 🎯 **Deliberação Competitiva:** ${deliberacao.todas.map(h => `${h.nome} (${Math.round(h.score * 100)}%)${h.id === deliberacao.vencedora.id ? " ★ [Vencedora]" : ""}`).join(" vs ")}`,
        `• 💡 **Decisão Sintética:** Ativação da estratégia de ${deliberacao.vencedora.nome} através da filosofia da persona ativa.`
      ].join("\n");
    }

    return {
      tensor,
      atencao,
      deliberacao,
      pensamento,
      texto: textoFinal,
      toString() {
        return this.texto;
      }
    };
  }

  return {
    processar,
    codificarTensorPrompt,
    calcularAtencaoContexto,
    deliberarHipoteses,
    ehDificuldadeOuOrganizacaoMateria,
    ehConfirmacaoOrganizarSemana,
    obterPropostaSemanaPendente,
    salvarPropostaSemanaPendente,
    gerarBlocosSemanaisMateria,
    montarDiagnosticoMateriaInstituicao,
    detectarMateriaEstudo,
    detectarInstituicaoEnsino
  };
})();

if (typeof window !== "undefined") {
  window.MiniPrumoAI = MiniPrumoAI;
}
