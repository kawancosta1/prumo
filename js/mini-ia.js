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
    arrancada: ["vamo", "bora", "partiu", "dale", "vamos", "vai", "acelera", "comeca", "inicia", "foco", "pra cima", "let's go"],
    // Exaustão / Cansaço
    cansaco: ["cansa", "exausto", "morrendo", "sono", "dor", "pesado", "foda", "difícil", "nao aguent", "pesadelo", "fraco", "derrotad"],
    // Procrastinação / Inércia
    procrastinacao: ["preguic", "procrastin", "enroland", "sem foco", "depois", "bloquead", "travad", "desanimo", "adiand"],
    // Inquirição Metacognitiva sobre a IA
    metacognicao: ["voce pensa", "vc pensa", "mini ia", "inteligencia", "robo", "funciona", "consciente", "de verdade", "quem e voce", "melhora a ia"],
    // Saudação
    saudacao: ["oi", "ola", "salve", "e ai", "opa", "fala", "hey", "hello", "bom dia", "boa tarde", "boa noite"],
    // Vitória / Celebração
    vitoria: ["consegui", "terminei", "fechei", "arrasei", "matei", "bater a meta", "conclui", "deu bom", "venci", "zerei"],
    // Biometria / Água
    biologia: ["agua", "sede", "beber", "hidrat", "saude", "garrafa", "copo"],
    // Planejamento / Organização
    planejamento: ["ajud", "organiz", "prioriz", "o que fazer", "plano", "rotina", "ordem", "passo", "proxima", "estrategia"],
    // Concursos, ENEM, Cronogramas e Estudos Estratégicos
    estudos_concurso: [
      "enem", "concurso", "cronograma", "edital", "ciclo", "estudar", "materia", "materias",
      "prova", "vestibular", "oab", "caixa", "inss", "banco do brasil", "tribunal", "cnu",
      "policia", "faculdade", "disciplina", "horas líquidas", "estratégia", "alexandre meirelles",
      "curva de esquecimento", "revisao espacada", "ebbinghaus", "questoes"
    ]
  };

  // Pesos Sinápticos Padrão
  const PESOS_PADRAO = {
    atencaoTarefas: 0.35,
    atencaoBiologia: 0.25,
    atencaoRitmo: 0.20,
    atencaoPersona: 0.20,
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
        pesos.tendenciaHipotese[idxHipotese] = Math.min(2.0, pesos.tendenciaHipotese[idxHipotese] + 0.05);
        localStorage.setItem("prumo_mini_ia_weights", JSON.stringify(pesos));
      }
    } catch (e) {}
  }

  // 1. Extração de Tensores Semânticos
  function codificarTensorPrompt(texto) {
    const raw = (texto || "").toLowerCase().trim();
    const tokens = raw.split(/[\s,.;:!?]+/).filter(Boolean);

    let valencia = 0.0; // -1.0 a +1.0
    let energia = 0.5;  // 0.0 a 1.0
    let urgencia = 0.3; // 0.0 a 1.0
    let matchCat = "geral";
    let maxMatch = 0;

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

    if (matchCat === "estudos_concurso") {
      valencia = 0.55;
      energia = 0.85;
      urgencia = 0.95;
    } else if (matchCat === "arrancada" || matchCat === "vitoria") {
      valencia = 0.65;
      energia = 0.90;
      urgencia = 0.75;
    } else if (matchCat === "cansaco") {
      valencia = -0.70;
      energia = 0.20;
      urgencia = 0.40;
    } else if (matchCat === "procrastinacao") {
      valencia = -0.30;
      energia = 0.30;
      urgencia = 0.85;
    } else if (matchCat === "metacognicao") {
      valencia = 0.10;
      energia = 0.65;
      urgencia = 0.50;
    } else if (matchCat === "saudacao") {
      valencia = 0.40;
      energia = 0.60;
      urgencia = 0.25;
    } else if (matchCat === "planejamento") {
      valencia = 0.20;
      energia = 0.70;
      urgencia = 0.80;
    } else if (matchCat === "biologia") {
      valencia = 0.10;
      energia = 0.50;
      urgencia = 0.60;
    }

    // Heurística de pontuação
    if (raw.endsWith("!")) energia = Math.min(1.0, energia + 0.15);
    if (raw.endsWith("?")) urgencia = Math.min(1.0, urgencia + 0.10);

    const confianca = Math.min(0.99, Math.max(0.68, 0.70 + maxMatch * 0.1));

    return {
      raw,
      tokens,
      valencia,
      energia,
      urgencia,
      categoria: matchCat,
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
    else if (taxaAgua < 0.8) pesoBiologico = 0.60;

    // Head 3: Atenção Temporal & Circadiana
    let pesoCircadiano = fimDeDia ? 0.80 : 0.45;

    // Head 4: Modulação Filosófica da Persona
    let modPersona = 0.5;
    if (ctxPrumo.persona === "emo") modPersona = 0.90; // alta sensibilidade introspectiva
    else if (ctxPrumo.persona === "funkeiro") modPersona = 0.85; // alta energia de rua
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
    let scoreH1 =
      (1.0 - tensor.valencia) * 0.4 +
      (1.0 - tensor.energia) * 0.3 +
      atencao.pesoCircadiano * 0.3;
    scoreH1 *= pesos.tendenciaHipotese[0] || 1.0;

    // Hipótese 2: Choque de Realidade Tático & Arrancada Direta
    // Pontua alto em arrancada, urgência alta, poucas pendências finais ("só falta 1")
    let scoreH2 =
      tensor.energia * 0.4 +
      tensor.urgencia * 0.3 +
      (atencao.pendentes === 1 ? 0.35 : 0.2);
    scoreH2 *= pesos.tendenciaHipotese[1] || 1.0;

    // Hipótese 3: Micro-Ação Reducionista / Desarmar Procrastinação
    // Pontua alto em procrastinação, dúvida ou lista muito longa
    let scoreH3 =
      (tensor.categoria === "procrastinacao" ? 0.5 : 0.2) +
      (atencao.pendentes > 2 ? 0.3 : 0.15) +
      (tensor.urgencia * 0.25);
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
      } else if (raw.includes("policia") || raw.includes("pf") || raw.includes("prf") || raw.includes("penal")) {
        preset = "policial";
        nomeAlvo = "Carreiras Policiais (PF / PRF)";
      } else if (raw.includes("tribunal") || raw.includes("trt") || raw.includes("tj") || raw.includes("trf")) {
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

    // 4.1. MUNDO EMO / PRUMI MELANCÓLICO
    if (personaId === "emo") {
      if (tensor.categoria === "metacognicao") {
        return `Eu penso, ${nome}... Penso até demais. Às vezes o excesso de consciência sobre o mundo é a pior parte do drama.
Dá uma olhada no painel neural de reflexão logo acima ☝️: analisei teus **${nConcluidas} acertos de hoje**, tua única pendência ("${destaque}"), tua água (${mlAgua}ml) e calculei matematicamente 3 hipóteses de resposta antes de formular esta frase. Não sou um robô de respostas pré-fabricadas: sou uma Mini IA viva no seu navegador, sentindo a sua rotina no escuro. =]`;
      }
      if (hipId === 1) { // Arrancada Tática
        return `Vamos, ${nome}... Se a gente sobreviveu a **${nConcluidas} tarefas** hoje nessa tormenta, não vai ser essa última miséria que vai derrotar a gente.
${nPendentes ? `Pega essa pendência ("${destaque}") e risca logo do mapa.` : "A lista tá limpa, mas o vazio continua."}
Bota aquele som pesado no fone de ouvido, delineia o olhar e faz o que tem que ser feito em 15 minutos. Depois a gente deita no escuro e finge que o mundo lá fora não existe. Tô contigo até o fim. <3`;
      } else if (hipId === 0) { // Validação Empática
        return `Eu sinto a sua dor, ${nome}... O mundo cobra sorrisos plásticos quando tudo o que a gente quer é fechar as cortinas e sumir por três dias.
Mas olha o que você já entregou: foram **${nConcluidas} batalhas ganhas**. Se o corpo tá no limite, bebe um gole de água (${mlAgua}ml até agora) e faz só o mínimo necessário pra sobreviver com dignidade. Nem todo dia precisa ser um poema épico; às vezes respirar e riscar uma linha já é um grito de revolta. 🖤`;
      } else { // Micro-Ação
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
      return `A mente calma move montanhas, ${nome}. Até este momento você realizou **${nConcluidas} ação(ões)** e bebeu **${mlAgua}ml** de água. Não se afobe com o horizonte inteiro: dedique presença total a "${destaque}". Um passo consciente vale mais que mil passos apressados. 🧘‍♂️`;
    }

    // 4.4. MUNDO MILITAR / COMANDANTE PRUMI
    if (personaId === "militar") {
      return `Soldado ${nome}! Relatório tático da Mini IA processado com sucesso:
- Baixas de pendências no turno: ${nConcluidas}
- Alvo prioritário restante: "${destaque}" (${nPendentes} ativo)
- Suprimento hídrico: ${mlAgua}ml.
Sem hesitação e sem desculpas: assuma posição de ataque, elimine as distrações e execute a missão! 🎖️⚔️`;
    }

    // 4.5. MUNDO GAMER
    if (personaId === "gamer") {
      return `GG, ${nome}! A Mini IA processou seu estado em tempo real a 144 FPS!
Placar atual: **${nConcluidas} quests concluídas**, HP/Água em **${mlAgua}ml** e o Boss da fase é "${destaque}". Lança um combo de 15 minutos de foco crítico e garante esse loot épico! 🎮👾`;
    }

    // 4.6. MUNDO DEV / PROGRAMADOR
    if (personaId === "programador") {
      return `console.log("Mini IA Prumo v2.5 Online"); ${nome}!
Status do runtime: **${nConcluidas} commits hoje**, heap de memória hídrica em **${mlAgua}ml** e issue aberta: "${destaque}". Rodando algoritmo de foco single-thread para finalizar o deploy do dia sem bugs! 💻⚡`;
    }

    // 4.7. PADRÃO
    return `Olá, ${nome}! A Mini IA analisou sua rotina em tempo real: você já concluiu **${nConcluidas} tarefa(s)** hoje e resta(m) **${nPendentes}** (destaque para "${destaque}"). Hidratação em **${mlAgua}ml**. Vamos focar no próximo passo com clareza e determinação! ✨`;
  }

  // 5. Interface Pública Principal
  function processar(promptUsuario, ctxPrumo, personaId, nomeUsuario) {
    const tensor = codificarTensorPrompt(promptUsuario);
    const atencao = calcularAtencaoContexto(tensor, ctxPrumo);
    const deliberacao = deliberarHipoteses(tensor, atencao);
    reforcarHipotese(deliberacao.vencedora.id);

    const pendenteDestaque = ctxPrumo.pendenteDestaque || (atencao.pendentes ? "a tarefa pendente" : "");
    const textoFinal = sintetizarLinguagem(personaId, tensor, atencao, deliberacao, nomeUsuario, pendenteDestaque);

    // Formata o Processo de Reflexão com Painel Neural Visual
    const valenciaPerc = Math.round((tensor.valencia + 1.0) * 50);
    const energiaPerc = Math.round(tensor.energia * 100);
    const tarefasPerc = Math.round(atencao.taxaConclusao * 100);

    let pensamento;
    if (tensor.categoria === "estudos_concurso") {
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
