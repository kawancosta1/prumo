const { abrir } = require("./ambiente");

module.exports = async function (url) {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    // 1. Frase exata do usuário com erro de digitação, data, hora aproximada e duração composta
    const p1 = ev(`parseQuick("vu estudar calcula amanha umas 16:00 durante 1 hora e meia")`);
    const amanha = ev(`addDays(today(), 1)`);
    ok(p1.title === "Estudar Cálculo", "corrige 'vu estudar calcula' para 'Estudar Cálculo': " + p1.title);
    ok(p1.date === amanha, "entende 'amanha' como data de amanhã: " + p1.date);
    ok(p1.time === "16:00", "entende 'umas 16:00' como 16:00: " + p1.time);
    ok(p1.dur === 90, "entende 'durante 1 hora e meia' como 90 min: " + p1.dur);
    ok(p1.area === "estudo", "infere área 'estudo' automaticamente: " + p1.area);

    // 2. Frases variadas em linguagem natural coloquial
    const p2 = ev(
      `parseQuick("vou revisar fisica depois de amanha as 4 e meia da tarde por 45 min urgente")`
    );
    const depAmanha = ev(`addDays(today(), 2)`);
    ok(p2.title === "Revisar Física", "corrige 'vou revisar fisica' para 'Revisar Física': " + p2.title);
    ok(p2.date === depAmanha, "entende 'depois de amanha': " + p2.date);
    ok(p2.time === "16:30", "entende 'as 4 e meia da tarde' como 16:30: " + p2.time);
    ok(p2.dur === 45, "entende 'por 45 min' como 45: " + p2.dur);
    ok(p2.prio === 3, "entende 'urgente' como prioridade alta (3): " + p2.prio);

    // 3. Intervalo de horário ("das 14h às 15h30")
    const p3 = ev(`parseQuick("tenho que treinar academia hj das 14h às 15h30")`);
    ok(p3.time === "14:00" && p3.dur === 90, "calcula início 14:00 e duração 90 min em 'das 14h às 15h30'");
    ok(p3.area === "dieta", "infere área 'dieta' para treino/academia: " + p3.area);

    // 4. Múltiplas tarefas na mesma frase
    const multi = ev(
      `extrairTarefasDeFrase("estudar calculo amanha as 16h por 1h30 e revisar ingles as 19h por 40 min")`
    );
    ok(
      Array.isArray(multi) && multi.length === 2,
      "separa 2 tarefas conectadas na mesma frase: " + multi.length
    );
    ok(
      multi[0].title === "Estudar Cálculo" && multi[0].time === "16:00" && multi[0].dur === 90,
      "primeira tarefa múltipla com título, hora e duração corretos"
    );
    ok(
      multi[1].title === "Revisar Inglês" &&
        multi[1].date === amanha &&
        multi[1].time === "19:00" &&
        multi[1].dur === 40,
      "segunda tarefa múltipla herda a data (amanhã) e aplica hora 19:00 e duração 40 min"
    );

    // 5. Criação automática de tarefa pela IA no chat e card de ação
    const qtdAntes = ev(`S.tasks.length`);
    const respIA = ev(
      `gerarRespostaAutonomaIA("vu estudar calcula amanha umas 16:00 durante 1 hora e meia")`
    );
    const qtdDepois = ev(`S.tasks.length`);
    ok(qtdDepois === qtdAntes + 1, "IA cria a tarefa automaticamente em S.tasks ao receber comando natural");
    ok(
      respIA && respIA.texto && respIA.texto.includes("[[ACAO_TAREFA_CRIADA:"),
      "resposta da IA inclui marcador de card interativo da tarefa criada"
    );
    const htmlCard = ev(`formatarTextoMensagemIA(${JSON.stringify(respIA.texto)})`);
    ok(
      htmlCard.includes("ia-focar-tarefa-chat") && htmlCard.includes("Estudar Cálculo"),
      "formatarTextoMensagemIA renderiza card com a tarefa criada e botão Focar"
    );

    // 6. Clicar em focar tarefa usa a duração (90 min) no cronômetro Pomodoro
    const ultimaId = ev(`S.tasks[S.tasks.length - 1].id`);
    ev(`ACOES_EXTRAS["ia-focar-tarefa-chat"]({ dataset: { id: ${JSON.stringify(ultimaId)} } })`);
    const metaTimer = ev(`timer.goal`);
    ok(metaTimer === 90, "iniciar foco na tarefa ajusta meta do cronômetro para 90 min: " + metaTimer);

    // 7. Dificuldade em matéria + instituição (ex: Cálculo no ICMC) com pesquisa online e modo offline
    ev(
      `window.__mockPesquisaAcademicaOnline = async () => "O ICMC-USP em São Carlos é referência nacional em Matemática e Computação, ministrando SMA0301 Cálculo I."`
    );
    const respDiagOnline = await ev(
      `chamarProvedorLLM("to com dificuldade em me organizar em calculo no icmc", [])`
    );
    ok(
      respDiagOnline &&
        respDiagOnline.texto.includes("ICMC-USP") &&
        respDiagOnline.texto.includes("SMA0301") &&
        respDiagOnline.texto.includes("Guidorizzi") &&
        respDiagOnline.texto.includes("Posso organizar a sua semana"),
      "IA analisa Cálculo no ICMC-USP (código SMA0301 + bibliografia) e pergunta se pode organizar a semana"
    );
    ok(
      respDiagOnline.texto.includes("referência nacional em Matemática"),
      "IA incorpora dados da pesquisa online quando há internet disponível"
    );
    const htmlProposta = ev(`formatarTextoMensagemIA(${JSON.stringify(respDiagOnline.texto)})`);
    ok(
      htmlProposta.includes("ia-confirmar-blocos-semana") &&
        htmlProposta.includes("Sim, organizar minha semana em blocos"),
      "formatarTextoMensagemIA renderiza botão interativo para confirmar organização da semana"
    );

    // 8. Modo 100% offline funciona mesmo sem internet
    ev(`window.__mockPesquisaAcademicaOnline = null;`);
    const respDiagOffline = ev(
      `gerarRespostaAutonomaIA("to com dificuldade em me organizar em calculo no icmc")`
    );
    ok(
      respDiagOffline &&
        respDiagOffline.texto.includes("ICMC-USP") &&
        respDiagOffline.texto.includes("Posso organizar a sua semana"),
      "modo offline também analisa Cálculo no ICMC-USP e pergunta se pode organizar a semana"
    );

    // 9. Confirmar ("sim, pode organizar") cria os 4 blocos de estudo na semana em S.tasks
    const antesBlocos = ev(`S.tasks.length`);
    const respConfirma = await ev(`chamarProvedorLLM("sim, pode organizar", [])`);
    const depoisBlocos = ev(`S.tasks.length`);
    ok(
      depoisBlocos === antesBlocos + 4,
      "confirmar organização cria os 4 blocos semanais de estudo em S.tasks: +" + (depoisBlocos - antesBlocos)
    );
    ok(
      respConfirma &&
        respConfirma.texto.includes("Semana organizada com sucesso") &&
        respConfirma.texto.includes("[[ACAO_TAREFA_CRIADA:"),
      "IA confirma a organização dos blocos semanais e exibe cards das tarefas criadas"
    );
    const temMateriaICMC = ev(`S.subjects.some(s => s.name.includes("Cálculo") && s.name.includes("ICMC"))`);
    ok(temMateriaICMC, "cadastra a matéria 'Cálculo (ICMC-USP)' automaticamente em S.subjects");

    // 10. Envio de PDF de Edital no Chat da IA -> extração de matérias, cronograma e importação para Tarefas
    const textoExtraidoPDF = await ev(`(async () => {
      const pdfStr = [
        "%PDF-1.4",
        "1 0 obj << /Length 260 >> stream",
        "BT",
        "(EDITAL CONCURSO PUBLICO 2027) Tj T*",
        "(Prova objetiva em 15/12/2027) Tj T*",
        "(LINGUA PORTUGUESA) Tj T*",
        "(1. Interpretacao de textos; 2. Concordancia verbal; 3. Crase.) Tj T*",
        "(DIREITO CONSTITUCIONAL) Tj T*",
        "(1. Direitos e garantias fundamentais; 2. Organizacao do Estado.) Tj",
        "ET",
        "endstream endobj",
        "%%EOF"
      ].join("\\n");
      const bytes = new Uint8Array(pdfStr.length);
      for (let i = 0; i < pdfStr.length; i++) bytes[i] = pdfStr.charCodeAt(i) & 0xff;
      const fakeFile = {
        name: "edital-concurso.pdf",
        type: "application/pdf",
        size: bytes.byteLength,
        arrayBuffer: async () => bytes.buffer
      };
      const txt = await extrairTextoDePDF(fakeFile);
      await processarArquivoEditalNoChatIA(fakeFile);
      return txt;
    })()`);
    ok(
      textoExtraidoPDF.includes("LINGUA PORTUGUESA") && textoExtraidoPDF.includes("DIREITO CONSTITUCIONAL"),
      "extrairTextoDePDF decodifica operadores de texto de arquivo PDF nativamente"
    );
    const qtdDiscEdital = ev(
      `estadoEdital && estadoEdital.analise && estadoEdital.analise.materias ? estadoEdital.analise.materias.length : 0`
    );
    ok(
      qtdDiscEdital >= 2 &&
        ev(`!!(estadoEdital && estadoEdital.plano && estadoEdital.plano.dias.length > 0)`),
      "processarArquivoEditalNoChatIA extrai as matérias do PDF e gera o cronograma automaticamente: " +
        qtdDiscEdital +
        " matérias"
    );
    const ultimaMsgChat = ev(
      `chatIaHistorico[chatIaHistorico.length - 1] ? chatIaHistorico[chatIaHistorico.length - 1].texto : ""`
    );
    ok(
      ultimaMsgChat.includes("[[ACAO_CRONOGRAMA_EDITAL_PDF]]"),
      "chat exibe o resumo do edital com o card interativo [[ACAO_CRONOGRAMA_EDITAL_PDF]]"
    );
    const htmlCardEdital = ev(`formatarTextoMensagemIA(${JSON.stringify(ultimaMsgChat)})`);
    ok(
      htmlCardEdital.includes("ia-importar-edital-chat") &&
        htmlCardEdital.includes("Importar para minhas Tarefas"),
      "card do PDF no chat renderiza botão para importar o cronograma para as Tarefas"
    );
    const antesImportEdital = ev(`S.tasks.length`);
    ev(`ACOES_EXTRAS["ia-importar-edital-chat"]()`);
    const depoisImportEdital = ev(`S.tasks.length`);
    ok(
      depoisImportEdital > antesImportEdital,
      "clicar em importar cronograma do PDF no chat adiciona os blocos de estudo em S.tasks: +" +
        (depoisImportEdital - antesImportEdital)
    );

    // 11. Edital completo estilo Banco do Brasil (Cesgranrio): ignora seções burocráticas, pula para Anexo III, aplica Peso 3 em Vendas/Bancários e permite alternar entre Agente Comercial e Agente de Tecnologia
    await ev(`(async () => {
      const editalBB = [
        "%PDF-1.4",
        "1 0 obj << /Length 1200 >> stream",
        "BT",
        "(BANCO DO BRASIL S.A. - EDITAL N 01/2027 - SELECAO EXTERNA ESCRITURARIO) Tj T*",
        "(3. DAS INSCRICOES NO PROCESSO SELETIVO) Tj T*",
        "(3.1 A inscricao do candidato implicara o conhecimento das presentes instrucoes.) Tj T*",
        "(4. DAS PESSOAS COM DEFICIENCIA) Tj T*",
        "(4.1 As pessoas com deficiencia e assegurado o direito de inscricao.) Tj T*",
        "(8. DA PRESTACAO DAS PROVAS OBJETIVAS E DE REDACAO) Tj T*",
        "(8.1 As provas objetivas serao aplicadas em 21/03/2027.) Tj T*",
        "(8.4 Os conteudos programaticos constam no Anexo III deste Edital, disponivel no site da banca.) Tj T*",
        "(ANEXO III - CONTEUDOS PROGRAMATICOS) Tj T*",
        "(CONHECIMENTOS BASICOS) Tj T*",
        "(LINGUA PORTUGUESA: 1 Compreensao e interpretacao de textos; 2 Ortografia oficial; 3 Concordancia.) Tj T*",
        "(LINGUA INGLESA: 1 Conhecimento de vocabulario fundamental; 2 Aspectos gramaticais basicos.) Tj T*",
        "(MATEMATICA: 1 Numeros inteiros, racionais e reais; 2 Razoes e proporcoes; 3 Funcoes.) Tj T*",
        "(ATUALIDADES DO MERCADO FINANCEIRO: 1 Os bancos na Era Digital; 2 Open Finance; 3 Pix; 4 Fintechs.) Tj T*",
        "(CONHECIMENTOS ESPECIFICOS) Tj T*",
        "(AGENTE COMERCIAL) Tj T*",
        "(MATEMATICA FINANCEIRA: 1 Juros simples e compostos; 2 Sistemas de amortizacao.) Tj T*",
        "(CONHECIMENTOS BANCARIOS: 1 Sistema Financeiro Nacional; 2 Produtos Bancarios; 3 Lavagem de dinheiro; 4 LGPD.) Tj T*",
        "(CONHECIMENTOS DE INFORMATICA: 1 Sistemas operacionais; 2 Seguranca da informacao; 3 Redes de computadores.) Tj T*",
        "(VENDAS E NEGOCIACAO: 1 Estrategia empresarial; 2 Segmentacao de mercado; 3 Tecnicas de vendas; 4 CDC.) Tj T*",
        "(AGENTE DE TECNOLOGIA) Tj T*",
        "(PROBABILIDADE E ESTATISTICA: 1 Medidas de tendencia central; 2 Probabilidade; 3 Inferencia.) Tj T*",
        "(CONHECIMENTOS BANCARIOS: 1 Sistema Financeiro Nacional; 2 Mercado financeiro; 3 Pix e LGPD.) Tj T*",
        "(TECNOLOGIA DA INFORMACAO: 1 Aprendizado de maquina; 2 Banco de dados; 3 Java, Python e TypeScript.) Tj",
        "ET",
        "endstream endobj",
        "%%EOF"
      ].join("\\n");
      const bytes = new Uint8Array(editalBB.length);
      for (let i = 0; i < editalBB.length; i++) bytes[i] = editalBB.charCodeAt(i) & 0xff;
      const fakeBB = {
        name: "edital-banco-do-brasil.pdf",
        type: "application/pdf",
        size: bytes.byteLength,
        arrayBuffer: async () => bytes.buffer
      };
      await processarArquivoEditalNoChatIA(fakeBB);
    })()`);
    const analiseBB = ev(`estadoEdital.analise`);
    ok(
      analiseBB &&
        !analiseBB.materias.some(m => /inscri|deficien/i.test(m.nome)) &&
        analiseBB.materias.some(m => /vendas/i.test(m.nome) && m.peso === 3) &&
        analiseBB.materias.some(m => /bancarios/i.test(m.nome) && m.peso === 3),
      "edital BB ignora capítulos burocráticos (Inscrições/PcD) e atribui Peso 3 para Vendas e Conhecimentos Bancários"
    );
    ok(
      Array.isArray(analiseBB.cargos) &&
        analiseBB.cargos.length === 2 &&
        analiseBB.cargoSelecionado === "Agente Comercial",
      "edital BB detecta os 2 cargos (Agente Comercial e Agente de Tecnologia) separadamente"
    );
    ev(`ACOES_EXTRAS["ia-trocar-cargo-edital-chat"]({ dataset: { idx: "1" } })`);
    const cargoDepoisTroca = ev(`estadoEdital.analise.cargoSelecionado`);
    const temTI = ev(`estadoEdital.analise.materias.some(m => /tecnologia da informa/i.test(m.nome))`);
    const temVendas = ev(`estadoEdital.analise.materias.some(m => /vendas/i.test(m.nome))`);
    ok(
      cargoDepoisTroca === "Agente de Tecnologia" && temTI && !temVendas,
      "trocar para Agente de Tecnologia no chat atualiza as matérias (inclui TI e remove Vendas)"
    );
  } finally {
    fechar();
  }
  return erros;
};
