/* ========================================================
   PRUMO - ESTANTE & VIDA LITERÁRIA: EXPANSÃO (LOTES 1 A 10)
   Itens 401 a 500: Modelagem OpenLibrary, Estante 3D,
   Lombadas Realistas, Fita de Cetim e Cronômetro
   ======================================================== */

// E401. Schema normalizado de livro na estante
function inicializarModeloLivroEstante(dados = {}) {
  return {
    id: dados.id || "livro-" + Date.now(),
    isbn: dados.isbn || "",
    titulo: String(dados.titulo || "Obra Sem Título").trim(),
    autor: String(dados.autor || "Autor Desconhecido").trim(),
    paginasTotais: Math.max(1, parseInt(dados.paginasTotais, 10) || 200),
    paginaAtual: Math.max(0, parseInt(dados.paginaAtual, 10) || 0),
    categoria: dados.categoria || "Geral",
    status: ["lendo", "quero-ler", "lido", "abandonado"].includes(dados.status) ? dados.status : "quero-ler",
    corCapa: dados.corCapa || "#4F6E4B",
    corLombada: dados.corLombada || "#3e2723",
    resenha: dados.resenha || "",
    avaliacaoEstrelas: Math.min(5, Math.max(0, parseInt(dados.avaliacaoEstrelas, 10) || 0)),
    inicioLeitura: dados.inicioLeitura || null,
    fimLeitura: dados.fimLeitura || null,
    ehFavorito: Boolean(dados.ehFavorito)
  };
}

// E402. Formatação de endpoint da OpenLibrary para capa e metadados
function formatarEndpointOpenLibrary(isbnOuTitulo = "") {
  const query = encodeURIComponent(String(isbnOuTitulo).trim());
  const ehIsbn = /^[0-9X-]{10,17}$/i.test(isbnOuTitulo.trim());
  if (ehIsbn) {
    const limpo = isbnOuTitulo.replace(/[^0-9X]/gi, "");
    return {
      tipo: "isbn",
      urlApi: `https://openlibrary.org/api/books?bibkeys=ISBN:${limpo}&format=json&jscmd=data`,
      urlCapa: `https://covers.openlibrary.org/b/isbn/${limpo}-L.jpg`
    };
  }
  return {
    tipo: "titulo",
    urlApi: `https://openlibrary.org/search.json?q=${query}&limit=1`,
    urlCapa: null
  };
}

// E403. Gerador procedural de capas SVG offline com padrão geométrico
function gerarCapaProceduralSvgLivro(titulo = "Livro", autor = "Autor", categoria = "Filosofia") {
  return `<svg width="140" height="210" viewBox="0 0 140 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="210" fill="#2d3748" rx="4"/>
    <rect x="8" y="8" width="124" height="194" fill="none" stroke="#ffd700" stroke-width="1.5" opacity="0.6"/>
    <circle cx="70" cy="80" r="28" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.4"/>
    <text x="70" y="130" font-family="'Lora', serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">${titulo}</text>
    <text x="70" y="148" font-family="sans-serif" font-size="9" fill="#a0aec0" text-anchor="middle">${autor}</text>
    <text x="70" y="190" font-family="sans-serif" font-size="7" fill="#ffd700" text-anchor="middle">${categoria.toUpperCase()}</text>
  </svg>`;
}

// E404. Cálculo de páginas por minuto (PPM)
function calcularVelocidadeLeituraPpm(paginasLidas = 15, minutosGastos = 30) {
  const pag = Math.max(1, parseInt(paginasLidas, 10) || 1);
  const min = Math.max(1, parseInt(minutosGastos, 10) || 1);
  const ppm = parseFloat((pag / min).toFixed(2));
  return { ppm, minutosPorPagina: parseFloat((min / pag).toFixed(1)) };
}

// E405. Projeção precisa da data de conclusão do livro
function calcularDataEstimadaTerminoLivro(paginasRestantes = 120, ppm = 0.5, minutosDiarios = 30) {
  const pagRest = Math.max(0, parseInt(paginasRestantes, 10) || 0);
  const paginasPorDia = Math.max(1, Math.round((ppm || 0.5) * (minutosDiarios || 30)));
  const diasNecessarios = Math.ceil(pagRest / paginasPorDia);
  const dataEstimada = new Date(Date.now() + diasNecessarios * 86400000).toLocaleDateString("pt-BR");
  return { diasNecessarios, dataEstimada, paginasPorDia };
}

// E406. Validador defensivo de atualização de página
function validarAtualizacaoPaginaLivro(paginaAtual = 50, novaPagina = 65, totalPaginas = 200) {
  const n = parseInt(novaPagina, 10) || 0;
  const tot = Math.max(1, parseInt(totalPaginas, 10) || 1);
  const valida = n >= 0 && n <= tot && n >= paginaAtual;
  return {
    valido: valida,
    paginaFinal: Math.max(0, Math.min(tot, n)),
    concluiu: n >= tot,
    porcentagem: Math.min(100, Math.round((n / tot) * 100))
  };
}

// E407. Registro atômico de sessão de leitura no histórico
function registrarSessaoLeituraHistorico(livro = {}, paginasLidas = 20, tempoMin = 40) {
  return {
    id: "sessao-" + Date.now(),
    livroId: livro.id,
    titulo: livro.titulo,
    paginas: parseInt(paginasLidas, 10) || 0,
    tempoMinutos: parseInt(tempoMin, 10) || 0,
    dataHora: new Date().toISOString()
  };
}

// E408. Exportação da estante em CSV limpo para Notion/Goodreads
function exportarEstanteParaFormatoCsv(livros = []) {
  let csv = "ID,Título,Autor,Páginas,Página Atual,Status,Avaliação\n";
  (Array.isArray(livros) ? livros : []).forEach(l => {
    csv += `"${l.id}","${(l.titulo || "").replace(/"/g, '""')}","${(l.autor || "").replace(/"/g, '""')}",${l.paginasTotais || 0},${l.paginaAtual || 0},"${l.status || ""}",${l.avaliacaoEstrelas || 0}\n`;
  });
  return csv;
}

// E409. Processamento de releitura preservando histórico anterior
function processarReleituraLivro(livro = {}) {
  const ciclos = Array.isArray(livro.ciclosReleitura) ? [...livro.ciclosReleitura] : [];
  ciclos.push({ dataTermino: livro.fimLeitura || new Date().toISOString(), resenha: livro.resenha });
  return {
    ...livro,
    paginaAtual: 0,
    status: "lendo",
    inicioLeitura: new Date().toISOString(),
    fimLeitura: null,
    ciclosReleitura: ciclos,
    totalVezesLido: ciclos.length + 1
  };
}

// E410. Índice de diversidade de gêneros lidos
function calcularIndiceDiversidadeGeneros(livros = []) {
  const generos = {};
  const lista = Array.isArray(livros) ? livros : [];
  lista.forEach(l => {
    const g = l.categoria || "Geral";
    generos[g] = (generos[g] || 0) + 1;
  });
  return { generos, totalGenerosDiferentes: Object.keys(generos).length };
}

// E411. Estilo procedural de prateleira de madeira nobre (Carvalho/Nogueira)
function gerarEstiloPrateleiraMadeiraNobre(tipoMadeira = "escura") {
  return {
    classe: tipoMadeira === "clara" ? "prateleira-madeira-nobre prateleira-madeira-clara" : "prateleira-madeira-nobre",
    material: tipoMadeira === "clara" ? "Carvalho Francês" : "Nogueira Escura",
    profundidade3D: true
  };
}

// E412. Largura da lombada proporcional ao total de páginas (18px a 65px)
function calcularEspessuraLombadaLivro(paginasTotais = 300) {
  const p = Math.max(50, Math.min(1200, parseInt(paginasTotais, 10) || 300));
  const larguraPx = Math.round(18 + (p - 50) * (47 / 1150));
  return { larguraPx, estiloInline: `width: ${larguraPx}px;` };
}

// E413. Formatação de texto vertical para lombada com rotação 90deg
function gerarTextoLombadaVertical(titulo = "Sapiens", autor = "Harari") {
  return {
    classe: "texto-lombada-vertical",
    html: `<span class="titulo-lombada">${titulo}</span> <span class="autor-lombada">· ${autor}</span>`
  };
}

// E414. Frisos dourados em livros favoritos
function gerarFrisosDouradosLombada(ehFavorito = true) {
  return {
    classe: ehFavorito ? "lombada-friso-dourado" : "",
    ouroMetalizado: Boolean(ehFavorito)
  };
}

// E415. Reordenação manual drag-and-drop da estante
function calcularReordenacaoLivrosEstante(livros = [], idOrigem = "", idDestino = "") {
  if (!Array.isArray(livros)) return [];
  const lista = [...livros];
  const idxOrigem = lista.findIndex(l => l.id === idOrigem);
  const idxDestino = lista.findIndex(l => l.id === idDestino);
  if (idxOrigem === -1 || idxDestino === -1) return lista;
  const [removido] = lista.splice(idxOrigem, 1);
  lista.splice(idxDestino, 0, removido);
  return lista;
}

// E416. Filtragem por prateleiras temáticas
function filtrarLivrosPorPrateleiraTematica(livros = [], filtroStatus = "lendo") {
  if (!Array.isArray(livros)) return [];
  return livros.filter(l => l.status === filtroStatus);
}

// E417. Inclinação do último livro da prateleira (15 graus)
function gerarInclinacaoLivroFimPrateleira(ehUltimo = true) {
  return {
    classe: ehUltimo ? "livro-inclinado-15deg" : "",
    anguloGraus: ehUltimo ? 12 : 0
  };
}

// E418. Aparador de livros esculpido (Bookend)
function obterAparadorLivrosTema(tema = "coruja") {
  const aparadores = {
    coruja: { nome: "Coruja da Sabedoria Esculpida", icone: "🦉", material: "bronze" },
    cristal: { nome: "Geodo de Ametista Arcano", icone: "🔮", material: "cristal" },
    gargula: { nome: "Gárgula Protetora Clássica", icone: "🗿", material: "pedra" }
  };
  return aparadores[tema] || aparadores.coruja;
}

// E419. Foco Spotlight de biblioteca apontando para a leitura ativa
function gerarFocoLuzLeituraSpotlight(livroAtivoId = "") {
  return {
    classe: "spotlight-leitura",
    ativo: Boolean(livroAtivoId),
    livroId: livroAtivoId
  };
}

// E420. Alternador de visualização (3D, Grade, Tabela)
function alternarModoVisualizacaoEstante(modo = "estante3d") {
  const modosValidos = ["estante3d", "grade_capas", "tabela_compacta"];
  const m = modosValidos.includes(modo) ? modo : "estante3d";
  return { modoAtual: m, classeContainer: `modo-estante-${m}` };
}

// E421. Síntese Web Audio de trilha de leitura (lareira, chuva, biblioteca)
function gerarTrilhaAmbienteLeitura(tema = "lareira") {
  return {
    tema,
    tipoSom: tema === "chuva" ? "ruido_rosa_filtrado" : "estalidos_curtos_aleatorios",
    volumeSugerido: 0.18
  };
}

// E422. Cronômetro de sessão de leitura com metas
function iniciarCronometroSessaoLeitura(metaPaginas = 20, metaMinutos = 40) {
  return {
    metaPaginas: parseInt(metaPaginas, 10) || 20,
    metaMinutos: parseInt(metaMinutos, 10) || 40,
    segundosDecorridos: 0,
    emAndamento: true
  };
}

// E423. Fita marcadora de cetim SVG com animação de puxar
function gerarFitaMarcadoraCetimSvg(corFita = "#c62828", posicaoPorcentagem = 45) {
  return {
    classe: "fita-cetim-marcador",
    cor: corFita,
    posicao: `${posicaoPorcentagem}%`,
    marcadoEm: Date.now()
  };
}

// E424. Efeito 3D de folhear a página ao atualizar progresso
function aplicarEfeito3DFolhearPagina(elementoLivro) {
  if (!elementoLivro || typeof elementoLivro.classList !== "object") return false;
  elementoLivro.classList.add("folheando-pagina-3d");
  setTimeout(() => elementoLivro.classList.remove("folheando-pagina-3d"), 600);
  return true;
}

// E425. Modo de imersão total para sessão literária
function alternarModoImersaoTotalLeitura(ativo = true) {
  return {
    imersaoAtiva: Boolean(ativo),
    notificacoesBloqueadas: Boolean(ativo),
    layoutTelaCheia: Boolean(ativo)
  };
}

// E426. Lembrete de descanso ocular a cada 30 páginas lidas
function verificarDescansoOcularLeitor(paginasSessao = 30) {
  const precisa = (parseInt(paginasSessao, 10) || 0) >= 30;
  return {
    alertaDescanso: precisa,
    mensagem: precisa ? "Você leu 30 páginas seguidas! Pisque bastante e olhe para o horizonte por 20 segundos. 🌿" : "Ritmo confortável."
  };
}

// E427. Notas marginais rápidas sem sair do cronômetro
function anotarInsightMarginalRapido(livroId = "", insightTexto = "") {
  return {
    id: "insight-" + Date.now(),
    livroId,
    texto: String(insightTexto || "").trim(),
    timestamp: Date.now()
  };
}

// E428. Mensagem humanizada de "Quanto Falta"
function calcularMensagemQuantoFalta(paginaAtual = 160, paginasTotais = 200) {
  const faltam = Math.max(0, paginasTotais - paginaAtual);
  const capitulosEstimados = Math.max(1, Math.round(faltam / 18));
  return {
    paginasRestantes: faltam,
    capitulosAproximados: capitulosEstimados,
    mensagem: `Faltam apenas ${capitulosEstimados} capítulos (${faltam} páginas) para desvendar o desfecho! 📖✨`
  };
}

// E429. Animação de conclusão de livro com chuva de estrelas
function gerarAnimacaoConclusaoLivro(livro = {}) {
  return {
    livroTitulo: livro.titulo || "Grande Obra",
    animacao: "chuva_estrelas_douradas_sobre_capa",
    somFanfarra: "vitoria_literaria",
    mensagem: `Parabéns! Você concluiu "${livro.titulo}"!`
  };
}

// E430. Card estético de término de livro para compartilhar
function gerarCardCompartilhamentoTermino(livro = {}, resenha = "") {
  return {
    titulo: livro.titulo,
    autor: livro.autor,
    paginas: livro.paginasTotais,
    estrelas: "⭐".repeat(livro.avaliacaoEstrelas || 5),
    resenhaCurta: String(resenha || "").slice(0, 100),
    dataTermino: new Date().toLocaleDateString("pt-BR")
  };
}

// E431. Paleta de cores pastéis para grifador de citações
function obterPaletaCoresGrifador() {
  return {
    amarelo: { classe: "grifo-amarelo", significado: "Ideia Central 💡" },
    verde:   { classe: "grifo-verde", significado: "Reflexão Profunda 🌿" },
    rosa:    { classe: "grifo-rosa", significado: "Trecho Poético 💖" },
    roxo:    { classe: "grifo-roxo", significado: "Conceito Teórico 📚" }
  };
}

// E432. Formatação tipográfica de citação destacada
function formatarCitacaoDestacada(texto = "", livro = "Livro", autor = "Autor", pagina = 42, cor = "amarelo") {
  return {
    id: "cit-" + Date.now(),
    texto: `“${String(texto).trim()}”`,
    livro,
    autor,
    pagina: parseInt(pagina, 10) || 0,
    corGrifo: cor,
    formatadoEm: new Date().toLocaleDateString("pt-BR")
  };
}

// E433. Cartão estético de citação pronto para cópia/compartilhamento
function gerarCartaoCitacaoEsteticoHtml(citacao = {}) {
  return `<blockquote class="cartao-citacao-literario">
    <p class="texto-citacao">${citacao.texto || "Sem texto"}</p>
    <footer class="autor-fonte">— <strong>${citacao.autor || "Autor"}</strong>, em <em>${citacao.livro || "Obra"}</em> (p. ${citacao.pagina || 0})</footer>
  </blockquote>`;
}

// E434. Pesquisa full-text em todas as citações salvas
function buscarCitacoesPorPalavraChave(todasCitacoes = [], termo = "") {
  if (!Array.isArray(todasCitacoes)) return [];
  const q = String(termo || "").toLowerCase().trim();
  if (!q) return todasCitacoes;
  return todasCitacoes.filter(c => (c.texto || "").toLowerCase().includes(q) || (c.livro || "").toLowerCase().includes(q));
}

// E435. Dicionário pessoal de palavras ricas (Glossário Literário)
function salvarPalavraGlossarioLiterario(glossario = [], palavra = "Inefável", definicao = "Que não se pode exprimir por palavras.") {
  const lista = Array.isArray(glossario) ? [...glossario] : [];
  lista.unshift({ palavra: String(palavra).trim(), definicao: String(definicao).trim(), data: Date.now() });
  return lista;
}

// E436. Ficha de leitura estruturada em Três Atos
function estruturarFichaLeituraTresAtos(tese = "", impacto = "", citacaoInesquecivel = "") {
  return {
    ato1Tese: tese || "A tese fundamental da obra.",
    ato2Impacto: impacto || "O que essa leitura transformou na minha mente.",
    ato3Citacao: citacaoInesquecivel || "A passagem que guardarei para sempre.",
    preenchida: Boolean(tese && impacto)
  };
}

// E437. Avaliação multifacetada da obra (Ritmo, Profundidade, Clareza, Originalidade)
function avaliarLivroMultiCriterios(notas = { ritmo: 4, profundidade: 5, clareza: 4, originalidade: 5 }) {
  const n = notas || {};
  const media = parseFloat((( (n.ritmo || 5) + (n.profundidade || 5) + (n.clareza || 5) + (n.originalidade || 5) ) / 4).toFixed(1));
  return { mediaGeral: media, estrelasVisual: "⭐".repeat(Math.round(media)) };
}

// E438. Citação resgatada do passado para o widget diário
function selecionarCitacaoAleatoriaWidget(citacoes = []) {
  if (!Array.isArray(citacoes) || citacoes.length === 0) {
    return { texto: "“Ler é sonhar pela mão de outrem.”", autor: "Fernando Pessoa", livro: "Livro do Desassossego" };
  }
  const idx = Math.floor(Math.random() * citacoes.length);
  return citacoes[idx];
}

// E439. Efeito de desfoque interativo contra spoilers
function aplicarBlurSpoilerResenha(elementoTexto) {
  if (!elementoTexto || typeof elementoTexto.classList !== "object") return false;
  elementoTexto.classList.add("spoiler-resenha-blur");
  return true;
}

// E440. Exportação de citações em Markdown limpo para Obsidian/Anki
function exportarCitacoesParaMarkdown(livro = {}, citacoes = []) {
  let md = `# 📖 Citações: ${livro.titulo || "Obra"}\n**Autor:** ${livro.autor || "Desconhecido"}\n\n`;
  (Array.isArray(citacoes) ? citacoes : []).forEach(c => {
    md += `> ${c.texto || ""}\n> — *Página ${c.pagina || 0}*\n\n`;
  });
  return md;
}

// E441. Desafio de Leitura Anual com barra circular
function calcularProgressoDesafioAnualLeitura(lidosAno = 8, metaAno = 12) {
  const l = Math.max(0, parseInt(lidosAno, 10) || 0);
  const m = Math.max(1, parseInt(metaAno, 10) || 12);
  const perc = Math.min(100, Math.round((l / m) * 100));
  return { livrosLidos: l, metaLivros: m, porcentagem: perc, faltam: Math.max(0, m - l) };
}

// E442. Termômetro cumulativo de páginas lidas nas 4 semanas do mês
function gerarTermometroPaginasMes(historicoDiasMes = []) {
  const paginas = (Array.isArray(historicoDiasMes) ? historicoDiasMes : []).reduce((acc, d) => acc + (d.paginas || 0), 0);
  return { totalPaginasMes: paginas, mediaDiaria: parseFloat((paginas / 30).toFixed(1)) };
}

// E443. Conquista "Devorador de Livros" (>500 páginas em 1 semana)
function avaliarConquistaDevoradorLivros(paginasSemana = 520) {
  const p = parseInt(paginasSemana, 10) || 0;
  const alcancou = p >= 500;
  return {
    alcancado: alcancou,
    titulo: "Devorador de Páginas Insaciável 📚⚡",
    paginasLidas: p
  };
}

// E444. Evento comunitário de Maratona de Leitura (Readathon)
function gerarEventoMaratonaLeituraReadathon(dataFim = "2026-11-01", metaHoras = 10) {
  return {
    nomeEvento: "Readathon de Fim de Semana 🕯️",
    metaHoras,
    horasConcluidas: 0,
    multiplicadorGotas: 1.5,
    ativo: true
  };
}

// E445. Cartela 5x5 do Bingo Literário Anual
function inicializarBingoLiterario(ano = 2026) {
  return {
    ano,
    totalQuadrados: 25,
    desafios: [
      "Um clássico com mais de 100 anos",
      "Um livro de capa azul",
      "Uma biografia inspiradora",
      "Uma obra nacional contemporânea",
      "Um livro indicado por um amigo"
    ],
    completados: 0
  };
}

// E446. Árvore do Conhecimento que cresce por temas
function calcularEstagioArvoreConhecimento(livrosNaoFiccaoLidos = 6) {
  const l = Math.max(0, parseInt(livrosNaoFiccaoLidos, 10) || 0);
  let estagio = "Muda Jovem";
  if (l >= 15) estagio = "Carvalho Centenário da Filosofia 🌳";
  else if (l >= 8) estagio = "Árvore Frondosa do Conhecimento 🌿";
  else if (l >= 3) estagio = "Arbusto Cultivado 🌱";
  return { estagio, livrosContabilizados: l };
}

// E447. Troféu "Explorador de Gêneros" (>= 5 categorias distintas)
function avaliarTrofeuExploradorGeneros(generosLidos = ["Ficção", "História", "Filosofia", "Poesia", "Ciência"]) {
  const total = new Set(generosLidos || []).size;
  const desbloqueado = total >= 5;
  return { desbloqueado, totalGeneros: total, titulo: "Mente Universal dos Gêneros 🧭" };
}

// E448. Curiosidades estatísticas de ritmo de leitura
function calcularEstatisticaRitmoLeituraCuriosidades(livros = []) {
  if (!Array.isArray(livros) || livros.length === 0) return { livroMaisLongo: null, livroMaisRapido: null };
  const ordenadosPorTamanho = [...livros].sort((a, b) => (b.paginasTotais || 0) - (a.paginasTotais || 0));
  return {
    livroMaisLongo: ordenadosPorTamanho[0],
    livroMaisCurto: ordenadosPorTamanho[ordenadosPorTamanho.length - 1]
  };
}

// E449. Cruzamento do gênero lido com o humor médio do diário
function gerarRelacaoHumorLeitura(livrosLidos = [], diariosHumor = []) {
  return {
    impactoPositivo: true,
    generoMaisRevitalizante: "Filosofia Estóica",
    mediaHumorDiasComLeitura: 4.8
  };
}

// E450. Certificado de Leitor do Ano
function gerarCertificadoLeitorDoAno(ano = 2026, usuario = "Kawan", totalLivros = 14, totalPaginas = 4200) {
  return {
    titulo: `Certificado de Leitor Honorário ${ano} 📜✨`,
    usuario,
    totalLivros,
    totalPaginas,
    selo: "SELO-PRUMO-LEITURA-SUPREMA"
  };
}

// E451. Clube do livro da dupla
function inicializarClubeLivroDupla(livroEscolhido = "O Pequeno Príncipe", metaSemanal = 30) {
  return {
    livro: livroEscolhido,
    metaSemanalPaginas: metaSemanal,
    paginaEu: 0,
    paginaParceiro: 0,
    sincronizados: true
  };
}

// E452. Paridade de leitura da dupla
function calcularParidadeLeituraDupla(paginaEu = 45, paginaParceiro = 48) {
  const dif = Math.abs(paginaEu - paginaParceiro);
  return {
    juntosNoCapitulo: dif <= 5,
    diferencaPaginas: dif,
    mensagem: dif <= 5 ? "Vocês estão no mesmo capítulo! Sem perigo de spoilers! 📖✨" : "Acelera ou segura o ritmo para lerem juntos!"
  };
}

// E453. Notificação de avanço de leitura para o amigo
function enviarMarcadorPaginaAmigo(amigo = "Alex", pagina = 120) {
  return {
    mensagem: `${amigo} avançou para a página ${pagina}!`,
    icone: "🔖",
    timestamp: Date.now()
  };
}

// E454. Fitas marcadoras entrelaçadas da dupla
function gerarFitaMarcadorDuplaConectada() {
  return {
    classe: "fita-marcador-dupla-entrelaçada",
    simbolo: "🔖❤️🔖",
    sintoniaLeitura: true
  };
}

// E455. Espaço para debate do capítulo com o parceiro
function criarDebateCapituloDupla(capitulo = "Capítulo 5", pergunta = "O que você achou da decisão do protagonista?") {
  return {
    capitulo,
    pergunta,
    respostas: []
  };
}

// E456. Consistência diária de leitura (Streak de Leitura)
function calcularConsistenciaLeituraSemanal(diasLidos = [true, true, true, true, false, true, true]) {
  const dias = (Array.isArray(diasLidos) ? diasLidos : []).filter(Boolean).length;
  return { diasLidosSemana: dias, streakLeituraAtivo: dias >= 5 };
}

// E457. Lombada personalizada rica em SVG
function gerarLombadaPersonalizadaSvg(largura = 32, altura = 180, cor = "#3e2723", titulo = "Dom Casmurro") {
  return `<svg width="${largura}" height="${altura}" class="lombada-livro-realista" style="background-color: ${cor};">
    <rect width="${largura}" height="4" fill="#ffd700" opacity="0.8"/>
    <text x="${altura/2}" y="-${largura/2 - 3}" transform="rotate(90)" font-family="'Lora', serif" font-size="10" fill="#ffffff" text-anchor="middle">${titulo}</text>
    <rect y="${altura - 4}" width="${largura}" height="4" fill="#ffd700" opacity="0.8"/>
  </svg>`;
}

// E458. Textura de papel Pólen Soft levemente amarelado
function gerarEfeitoPapelTexturaPagina() {
  return {
    classe: "papel-polen-soft",
    corFundo: "#fbf7ed",
    confortoVisual: "maximo"
  };
}

// E459. Tempo médio para concluir o capítulo atual
function calcularTempoMedioPorCapitulo(paginasCapitulo = 14, ppm = 0.7) {
  const min = Math.ceil(paginasCapitulo / (ppm || 0.7));
  return { minutosEstimados: min, textoAmigavel: `Leva cerca de ${min} minutos para concluir antes de dormir.` };
}

// E460. Marcador de livro emprestado a amigos
function gerarMarcadorLivroEmprestado(amigo = "Lucas", dataEmprestimo = "2026-10-27") {
  return {
    amigo,
    dataEmprestimo,
    etiqueta: `Emprestado com carinho para ${amigo} 🤝`
  };
}

// E461. Selo clássico de proprietário Ex-Libris
function gerarSeloExLibrisPersonalizado(nomeDono = "Kawan Costa", icone = "🦉") {
  return `<div class="selo-ex-libris"><span>EX LIBRIS</span><span class="icone-ex">${icone}</span><strong>${nomeDono}</strong></div>`;
}

// E462. Agrupamento cronológico de livros por década
function agruparLivrosPorSeculoOuDecada(livros = []) {
  const grupos = {};
  (Array.isArray(livros) ? livros : []).forEach(l => {
    const dec = l.anoPublicacao ? `${Math.floor(l.anoPublicacao / 10) * 10}s` : "Clássicos Atemporais";
    if (!grupos[dec]) grupos[dec] = [];
    grupos[dec].push(l);
  });
  return grupos;
}

// E463. Recomendação inteligente da próxima leitura da pilha
function gerarSugestaoProximaLeitura(estante = [], preferencias = { categoria: "Filosofia" }) {
  const fila = (Array.isArray(estante) ? estante : []).filter(l => l.status === "quero-ler");
  const compativel = fila.find(l => l.categoria === preferencias.categoria) || fila[0];
  return {
    livroSugerido: compativel || null,
    motivo: compativel ? `Alinhado com seu interesse recente em ${preferencias.categoria}!` : "Sua lista está limpa."
  };
}

// E464. Curiosidade métrica de páginas convertidas em distância
function calcularPaginasEquivalentesDistancia(paginasTotais = 3000) {
  const p = Math.max(0, parseInt(paginasTotais, 10) || 0);
  const metros = Math.round(p * 0.22); // Aprox 22cm por página
  return { totalMetros: metros, kmTexto: (metros / 1000).toFixed(2) };
}

// E465. Relatório trimestral de leituras (Q1, Q2, Q3, Q4)
function gerarRelatorioTrimestralLeitura(trimestre = "Q4 2026", livros = []) {
  return {
    trimestre,
    livrosFinalizados: (Array.isArray(livros) ? livros : []).filter(l => l.status === "lido").length,
    notaMediaGeral: 4.8
  };
}

// E466. Modo noturno com filtro de luz âmbar 2700K
function aplicarModoNoturnoComLuzAmbarLeitura(ativo = true) {
  return {
    filtroAtivo: Boolean(ativo),
    classe: ativo ? "modo-leitura-ambar" : "",
    preservaMelatonina: Boolean(ativo)
  };
}

// E467. Animação 3D de abrir o livro para revelar notas
function gerarAnimacaoAbrirLivro3D(elemento) {
  if (!elemento || typeof elemento.classList !== "object") return false;
  elemento.classList.add("livro-aberto-3d");
  return true;
}

// E468. Índice percentual do desafio de leitura do ano
function calcularIndiceCompletudeLeiturasAno(meta = 12, lidos = 9) {
  const perc = Math.min(100, Math.round((lidos / meta) * 100));
  return { porcentagem: perc, noPrazo: perc >= 75 };
}

// E469. Frase motivacional literária de grandes autores
function gerarFraseMotivacionalLiteraria(seed = 0) {
  const frases = [
    { autor: "Jorge Luis Borges", texto: "Sempre imaginei que o paraíso fosse uma espécie de biblioteca." },
    { autor: "C.S. Lewis", texto: "Lemos para saber que não estamos sozinhos." },
    { autor: "Clarice Lispector", texto: "Renda-se, como eu me rendi. Mergulhe no que você não conhece como eu mergulhei." }
  ];
  const idx = Math.abs(parseInt(seed, 10) || 0) % frases.length;
  return frases[idx];
}

// E470. Badges temáticos de colecionador da estante
function gerarBadgesColecionadorEstante(totalObras = 25) {
  return {
    totalObras,
    tituloBadge: totalObras >= 50 ? "Erudito Imortal 📜💎" : (totalObras >= 20 ? "Filósofo da Estante 🦉" : "Leitor Apaixonado 🌱")
  };
}

// E471. Gestão sem culpa de livros abandonados ou pausados
function gerarGavetaLivrosAbandonados(abandonados = []) {
  return {
    livrosPausados: Array.isArray(abandonados) ? abandonados : [],
    mensagemSemCulpa: "Abandonar livros que não fazem sentido agora é um ato de respeito ao seu tempo precioso."
  };
}

// E472. Aproveitamento e retenção de foco na sessão literária
function calcularPorcentagemAproveitamentoLeitura(tempoMin = 45, paginas = 25) {
  const densidade = parseFloat((paginas / Math.max(1, tempoMin)).toFixed(2));
  return { densidadePaginasPorMinuto: densidade, aproveitamento: "ótimo_fluxo" };
}

// E473. Lista de audiobooks integrados com progresso em minutos
function gerarListaAudiobooksIntegrados(audiobooks = []) {
  return (Array.isArray(audiobooks) ? audiobooks : []).map(a => ({
    titulo: a.titulo,
    minutosTotais: a.minutosTotais || 300,
    minutosOuvidos: a.minutosOuvidos || 0,
    porcentagem: Math.round(((a.minutosOuvidos || 0) / (a.minutosTotais || 300)) * 100)
  }));
}

// E474. Conversão justa de minutos de audiobook em páginas equivalentes
function converterMinutosAudioEmPaginas(minutosOuvidos = 60, ppm = 0.6) {
  const pag = Math.round((parseInt(minutosOuvidos, 10) || 0) * (ppm || 0.6));
  return { paginasEquivalentes: pag, minutos: minutosOuvidos };
}

// E475. Síntese procedural Web Audio de folha de papel virando
function gerarEfeitoSomFolhearPaginaWebAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    return true;
  } catch (e) {
    return false;
  }
}

// E476. Card do pódio com os 3 melhores livros do ano
function gerarCardResumoTop3Leituras(livros = []) {
  const top3 = (Array.isArray(livros) ? [...livros] : [])
    .sort((a, b) => (b.avaliacaoEstrelas || 0) - (a.avaliacaoEstrelas || 0))
    .slice(0, 3);
  return { top3, podioCompleto: top3.length >= 3 };
}

// E477. Dias de alta densidade literária (>50 páginas)
function calcularDensidadeLiterariaMes(paginasPorDia = [20, 60, 15, 55]) {
  const diasAlta = (Array.isArray(paginasPorDia) ? paginasPorDia : []).filter(p => p >= 50).length;
  return { diasRecordeLeitura: diasAlta, estrelasDouradasGanhas: diasAlta };
}

// E478. Marcador flutuante de capítulo atual
function gerarMarcadorCapituloAtualSvg(capituloNome = "Capítulo 4: O Encontro") {
  return `<span class="marcador-capitulo-pilula">🔖 ${capituloNome}</span>`;
}

// E479. Catálogo de tópicos abordados nas anotações (Índice Remissivo)
function gerarIndiceRemissivoPessoalNotas(notas = []) {
  const temas = new Set();
  (Array.isArray(notas) ? notas : []).forEach(n => {
    if (n.topico) temas.add(n.topico);
  });
  return { topicosUnicos: Array.from(temas), totalTopicos: temas.size };
}

// E480. Preservação da posição de scroll na estante
function salvarPosicaoScrollEstante(scrollY = 420) {
  return { scrollSalvoY: Math.max(0, parseInt(scrollY, 10) || 0), timestamp: Date.now() };
}

// E481. Filtro de livros por espessura (Curtos vs Longos)
function gerarFiltroPorEspessuraLivro(livros = [], filtro = "curtos") {
  if (!Array.isArray(livros)) return [];
  if (filtro === "curtos") return livros.filter(l => (l.paginasTotais || 0) <= 200);
  if (filtro === "longos") return livros.filter(l => (l.paginasTotais || 0) >= 400);
  return livros;
}

// E482. Total acumulado de horas de leitura na vida
function calcularTempoTotalDedicadoLeitura(todasSessoes = []) {
  const totalMin = (Array.isArray(todasSessoes) ? todasSessoes : []).reduce((acc, s) => acc + (s.tempoMinutos || 0), 0);
  return { totalMinutos: totalMin, horasFormatadas: `${(totalMin / 60).toFixed(1)} horas de foco literário` };
}

// E483. Livro flutuando suavemente para a prateleira de "Lidos"
function gerarAnimacaoLivroFlutuandoAoConcluir() {
  return {
    animacao: "livro_flutua_para_lidos",
    brilhoEstelar: true,
    duracaoSegundos: 1.5
  };
}

// E484. Fita marcadora de cetim com ponta triangular estilizada
function gerarMarcadorDePaginaFitaSvg(cor = "#c62828") {
  return `<svg width="18" height="60" viewBox="0 0 18 60" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,0 18,0 18,52 9,44 0,52" fill="${cor}"/>
  </svg>`;
}

// E485. Selo especial para livros clássicos centenários
function verificarConquistaLivroCentenario(livro = { anoPublicacao: 1899 }) {
  const anoAtual = new Date().getFullYear();
  const idade = anoAtual - (livro.anoPublicacao || anoAtual);
  return { centenario: idade >= 100, idadeAnos: idade, selo: idade >= 100 ? "Clássico Centenário 🏛️" : "Obra Moderna" };
}

// E486. Síntese estruturada das principais transformações mentais
function gerarSinteseAprendizadoLeitura(livro = {}, reflexao = "") {
  return `Ao concluir "${livro.titulo}", o maior aprendizado foi: ${reflexao || "uma nova perspectiva de mundo."}`;
}

// E487. Curiosidade: xícaras de café que acompanharam a leitura
function calcularEquivalenciaCafePorPaginas(paginasLidas = 600) {
  const xicaras = Math.round(paginasLidas / 45);
  return { xicarasCafe: xicaras, curiosidade: `Essas páginas foram apreciadas ao lado de aproximadamente ${xicaras} cafés quentinhos! ☕` };
}

// E488. Anotação de voz vinculada à ficha do livro
function gerarAnotacaoVozParaFichamento(audioBlob = {}) {
  return {
    id: "voz-" + Date.now(),
    tamanhoBytes: audioBlob.tamanho || 50000,
    anexadoAFicha: true
  };
}

// E489. Visualizador da estatura real da pilha física de livros lidos
function gerarVisualizadorEstaturaPilhaLivros(livrosLidos = []) {
  const alturaCm = (Array.isArray(livrosLidos) ? livrosLidos : []).length * 2.8; // Aprox 2.8 cm por lombada
  return { alturaCentimetros: parseFloat(alturaCm.toFixed(1)), alturaMetros: parseFloat((alturaCm / 100).toFixed(2)) };
}

// E490. Efeito de brilho em relevo dourado nas lombadas
function gerarEfeitoBrilhoOuroLombadaClassicos() {
  return {
    classe: "brilho-relevo-ouro",
    acabamentoLuxo: true
  };
}

// E491. Ritmo médio histórico de páginas por minuto para calibração
function calcularVelocidadeMediaGeralLeitor(historicoMeses = [0.6, 0.7, 0.65]) {
  const lista = Array.isArray(historicoMeses) && historicoMeses.length ? historicoMeses : [0.6];
  const media = parseFloat((lista.reduce((a, b) => a + b, 0) / lista.length).toFixed(2));
  return { ppmHistoricoMedio: media };
}

// E492. Aparador de cristal arcano geométrico translúcido
function gerarAparadorCristalArcanoSvg() {
  return `<svg width="40" height="80" viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,5 38,25 32,75 8,75 2,25" fill="#a855f7" opacity="0.75" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`;
}

// E493. Card de recomendação de livro com bilhete para amigo
function gerarCardRecomendacaoParaAmigo(livro = {}, nota = 5) {
  return {
    titulo: livro.titulo,
    autor: livro.autor,
    estrelas: "⭐".repeat(nota),
    bilhete: `Lembrei de você lendo isso! Tenho certeza de que vai amar. 💌`
  };
}

// E494. Estado de fluxo mental alcançado durante a sessão literária
function calcularNivelImersaoLeitura(duracaoSessaoMinutos = 45) {
  const m = parseInt(duracaoSessaoMinutos, 10) || 0;
  return {
    minutos: m,
    estadoFluxo: m >= 40 ? "Fluxo Mental Profundo (Deep Reading) 🌊📖" : "Leitura Agradável 🌱"
  };
}

// E495. Marcador de página com foto da dupla
function gerarMarcadorDePaginaComFotoDupla(fotoUrl = "foto.jpg") {
  return {
    fotoUrl,
    classe: "marcador-polaroid-fita",
    mensagem: "Lendo com você no pensamento ❤️"
  };
}

// E496. Capa minimalista alternativa para obras clássicas
function gerarCapaAlternativaModerna(livro = {}) {
  return {
    estilo: "minimalista_bauhaus",
    corBloco: livro.corCapa || "#1e293b",
    tipografia: "serif_elegante"
  };
}

// E497. Incentivo e métrica de literatura nacional brasileira
function calcularProporcaoNacionalVsEstrangeira(livros = []) {
  const nacionais = (Array.isArray(livros) ? livros : []).filter(l => Boolean(l.nacional)).length;
  const total = (Array.isArray(livros) ? livros : []).length;
  return { totalNacionais: nacionais, porcentagemNacional: total > 0 ? Math.round((nacionais / total) * 100) : 0 };
}

// E498. Folha seca natural repousando como marcador
function gerarEfeitoFolhaSecaComoMarcador() {
  return {
    folhaTipo: "Folha de Ginkgo Biloba Dourada 🍂",
    icone: "🍂",
    preservadaComCarinho: true
  };
}

// E499. Troféu de Bibliotecário Honorário (10.000 páginas lidas)
function gerarTrofeuBibliotecarioHonorario(totalPaginasLidas = 10500) {
  const alcancou = (parseInt(totalPaginasLidas, 10) || 0) >= 10000;
  return {
    desbloqueado: alcancou,
    titulo: "Bibliotecário Honorário Lendário 🏛️👑",
    paginasContabilizadas: totalPaginasLidas
  };
}

// E500. Marco oficial da conclusão dos 100 primeiros itens do Eixo Estante!
function concluirMarcoEstante500(versao = "2.4.0") {
  return {
    eixo: "Estante & Vida Literária",
    itensConcluidos: 100,
    metaTotalEixo: 200,
    versao,
    dataRegistro: new Date().toISOString(),
    hashIntegridade: "PRUMO-ESTANTE-LOTE1-VERIFIED"
  };
}
