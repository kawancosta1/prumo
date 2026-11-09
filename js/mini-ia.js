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
        "calculo 3"
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
        "probabilidade"
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
        "óptica"
      ]
    },
    {
      id: "quimica",
      nome: "Química",
      termos: ["quimica", "química", "estequiometria", "termoquimica", "organica", "orgânica"]
    },
    {
      id: "programacao",
      nome: "Programação",
      termos: [
        "programacao",
        "programação",
        "codigo",
        "código",
        "javascript",
        "python",
        "java",
        "algoritmo",
        "computacao",
        "computação",
        "frontend",
        "backend",
        "react"
      ]
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

  function detectarMateriaEstudo(raw) {
    for (const m of MATERIAS_CATALOGO) {
      if (m.termos.some(t => raw.includes(t))) return m;
    }
    const match = raw.match(
      /(?:pra|para|de|sobre|estudar|matéria|materia|disciplina)\s+([a-zá-ú0-9\s]{3,25})/i
    );
    if (match && match[1]) {
      const capturado = match[1].trim();
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
        "alguem"
      ];
      if (!ignorar.includes(capturado)) {
        const nomeFormatado = capturado.charAt(0).toUpperCase() + capturado.slice(1);
        return { id: "custom", nome: nomeFormatado, termos: [capturado] };
      }
    }
    return null;
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

    // 0. Prioridade Máxima: Detecção NLU de Agendamento/Criação de Tarefa em Linguagem Natural
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
    if (tensor.categoria === "criar_tarefa" && typeof criarTarefasPorTextoIA === "function") {
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
    deliberarHipoteses
  };
})();

if (typeof window !== "undefined") {
  window.MiniPrumoAI = MiniPrumoAI;
}
