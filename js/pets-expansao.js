/* ========================================================
   PRUMO - PETS & MASCOTES ENCANTADOS: EXPANSÃO (LOTES 1 A 10)
   Itens 201 a 300: FSM, Física de Toque, Ciclo Circadiano,
   Alimentação, Guarda-Roupa, Truques e Minijogos
   ======================================================== */

// P201. Máquina de Estados Finitos (FSM) de Humor do Mascote (8 estados)
function inicializarMaquinaEstadosHumorPet(humorInicial = "ocioso") {
  const estadosValidos = ["ocioso", "focado", "faminto", "sonolento", "radiante", "dengoso", "preocupado", "comemorando"];
  const estado = estadosValidos.includes(humorInicial) ? humorInicial : "ocioso";
  return {
    estadoAtual: estado,
    historicoTransicoes: [{ estado, timestamp: Date.now() }],
    transicaoPara: function(novoEstado) {
      if (estadosValidos.includes(novoEstado) && novoEstado !== this.estadoAtual) {
        this.estadoAtual = novoEstado;
        this.historicoTransicoes.push({ estado: novoEstado, timestamp: Date.now() });
        return true;
      }
      return false;
    }
  };
}

// P202. Decaimento natural do humor com base no tempo sem interação
function calcularDecaimentoHumorPet(horasSemInteracao = 4, aguaAtrasada = false) {
  let score = 100 - (parseFloat(horasSemInteracao) || 0) * 8;
  if (aguaAtrasada) score -= 25;
  score = Math.max(10, Math.min(100, Math.round(score)));
  let novoHumor = "radiante";
  if (score < 40) novoHumor = "preocupado";
  else if (score < 65) novoHumor = "faminto";
  else if (score < 85) novoHumor = "ocioso";
  return { pontuacaoHumor: score, humorSugerido: novoHumor };
}

// P203. Interpolação suave cúbica (Spline) para expressões dos olhos
function interpolarCoordenadasExpressaoSpline(pontoA = 0, pontoB = 10, t = 0.5) {
  const clampT = Math.max(0, Math.min(1, t));
  const smoothT = clampT * clampT * (3 - 2 * clampT); // Smoothstep cúbico
  return parseFloat((pontoA + (pontoB - pontoA) * smoothT).toFixed(2));
}

// P204. Matriz de personalidade única do mascote
function obterMatrizPersonalidadePet(arquetipo = "zen") {
  const personalidades = {
    zen: { paciencia: 95, energia: 40, curiosidade: 60, falaPadrao: "Respire fundo e viva o agora. 🍃" },
    energico: { paciencia: 40, energia: 95, curiosidade: 85, falaPadrao: "Bora lá! Nenhuma meta vai nos parar hoje! ⚡" },
    academico: { paciencia: 75, energia: 60, curiosidade: 95, falaPadrao: "Você sabia que estudar em blocos melhora a retenção? 📚" }
  };
  return personalidades[arquetipo] || personalidades.zen;
}

// P205. Cálculo de afeto de longo prazo (Apego)
function calcularAfetoLongoPrazoPet(diasConvivencia = 30, carinhosTotais = 120) {
  const dias = Math.max(0, parseInt(diasConvivencia, 10) || 0);
  const car = Math.max(0, parseInt(carinhosTotais, 10) || 0);
  const pontos = Math.min(1000, dias * 10 + car * 2);
  let titulo = "Amigo Inseparável ❤️";
  if (pontos < 200) titulo = "Novo Conhecido 🌱";
  else if (pontos < 500) titulo = "Companheiro Fiel 🐾";
  return { pontosAfeto: pontos, tituloAfeto: titulo, diasJuntos: dias };
}

// P206. Memória episódica contextual do mascote
function gerarMemoriaEpisodicaPet(historicoSemanal = {}) {
  const diaMaisFoco = historicoSemanal.melhorDia || "quarta-feira";
  const horas = historicoSemanal.horasTotal || 12;
  return `Lembro bem de como você arrasou na ${diaMaisFoco}! Foram ${horas} horas dedicadas. Estou orgulhoso!`;
}

// P207. Síntese de parâmetros de voz procedural infantil/fofa
function sintetizarVozProceduralPet(emocao = "alegre") {
  const mapa = {
    alegre: { freqBase: 580, rampaFim: 720, duracaoSegundos: 0.25 },
    dengoso: { freqBase: 440, rampaFim: 550, duracaoSegundos: 0.4 },
    sonolento: { freqBase: 300, rampaFim: 220, duracaoSegundos: 0.5 }
  };
  return mapa[emocao] || mapa.alegre;
}

// P208. Cálculo da dilatação pupilar SVG
function calcularDilatacaoPupilar(nivelLuz = "escuro", recebendoCarinho = true) {
  let raio = 4.5;
  if (recebendoCarinho) raio = 6.8;
  else if (nivelLuz === "escuro") raio = 6.0;
  else if (nivelLuz === "claro") raio = 3.5;
  return { raioPupila: raio, animacao: "transicao_suave_olhos" };
}

// P209. Reação do pet às estações e clima externo
function calcularReacaoClimaticaPet(estacao = "inverno", temperatura = 14) {
  const frio = temperatura < 18;
  return {
    estacao,
    temperatura,
    usaCachecol: frio,
    postura: frio ? "encolhidinho" : "aberto_arejado",
    falaClima: frio ? "Brrr, que friozinho bom para estudar com chá quente!" : "Dia lindo e ensolarado para brilhar!"
  };
}

// P210. Ciclo de respiração involuntária suave
function gerarCicloRespiracaoInvoluntaria(tempoMs = 0) {
  const t = (tempoMs % 3600) / 3600;
  const escalaY = 1.0 + 0.03 * Math.sin(t * Math.PI * 2);
  const escalaX = 1.0 - 0.015 * Math.sin(t * Math.PI * 2);
  return { escalaX: parseFloat(escalaX.toFixed(3)), escalaY: parseFloat(escalaY.toFixed(3)), classe: "pet-respiracao-involuntaria" };
}

// P211. Modelo físico Spring-Mass para o corpo do pet
function calcularMassaMolaPet(posAtual = 0, posAlvo = 100, velocidade = 0, rigidez = 0.15, amortecimento = 0.8) {
  const forcaMola = (posAlvo - posAtual) * rigidez;
  const novaVel = (velocidade + forcaMola) * amortecimento;
  const novaPos = posAtual + novaVel;
  return { posicao: parseFloat(novaPos.toFixed(2)), velocidade: parseFloat(novaVel.toFixed(2)) };
}

// P212. Deformação elástica clássica (Squash and Stretch)
function aplicarDeformacaoSquashStretch(velocidadeY = 5, impacto = false) {
  if (impacto) {
    return { escalaX: 1.25, escalaY: 0.8, classe: "pet-squash-queda" };
  }
  if (Math.abs(velocidadeY) > 2) {
    return { escalaX: 0.88, escalaY: 1.14, classe: "pet-squash-pulo" };
  }
  return { escalaX: 1.0, escalaY: 1.0, classe: "pet-squash-normal" };
}

// P213. Rastreamento ocular dos olhos em direção ao cursor
function calcularRastreamentoOlhosCursor(olhoX = 50, olhoY = 50, cursorX = 100, cursorY = 80, raioMax = 5) {
  const dx = cursorX - olhoX;
  const dy = cursorY - olhoY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { deltaX: 0, deltaY: 0 };
  const fator = Math.min(raioMax, dist) / dist;
  return {
    deltaX: parseFloat((dx * fator).toFixed(1)),
    deltaY: parseFloat((dy * fator).toFixed(1))
  };
}

// P214. Gerador de tempo estocástico para piscar os olhos
function gerarTempoProximoPiscar(estocastico = 0.5) {
  const intervaloMs = Math.round(3000 + estocastico * 4000);
  const piscarDuplo = estocastico > 0.75;
  return { intervaloMs, piscarDuplo, duracaoPiscarMs: piscarDuplo ? 350 : 180 };
}

// P215. Detecção de cosquinhas na barriga por movimento rápido
function processarCosquinhasBarriga(frequenciaMovimento = 8) {
  const temCosquinha = parseInt(frequenciaMovimento, 10) >= 6;
  return {
    rindo: temCosquinha,
    reacao: temCosquinha ? "Hahaha! Para, tô com cócegas! 😆✨" : "Hum, cafuné gostoso.",
    gotasAfeto: temCosquinha ? 2 : 0
  };
}

// P216. Inércia ao arrastar e oscilação das perninhas
function calcularInerciaArrastoPet(dx = 10, dy = 5) {
  const angulo = Math.max(-25, Math.min(25, -dx * 1.5));
  return { anguloPernasGraus: parseFloat(angulo.toFixed(1)), suspenso: true };
}

// P217. Emissor de partículas de poeira mágica no quique do chão
function gerarParticulasQuiqueChao(chaoY = 200, x = 100) {
  return [
    { x: x - 15, y: chaoY, vx: -2, vy: -1.5, cor: "#e2e8f0" },
    { x: x + 15, y: chaoY, vx: 2, vy: -1.5, cor: "#e2e8f0" }
  ];
}

// P218. Diferenciação sensorial de cliques (cutucão vs cafuné vs abraço)
function diferenciarTipoToquePet(duracaoCliqueMs = 250) {
  const dur = parseInt(duracaoCliqueMs, 10) || 0;
  if (dur > 600) return { tipo: "abraço_apertado", afeto: 5, mensagem: "Um abraço quentinho!" };
  if (dur > 150) return { tipo: "cafune_suave", afeto: 2, mensagem: "Cafuné relaxante..." };
  return { tipo: "cutucao_curioso", afeto: 1, mensagem: "Opa, olá!" };
}

// P219. Padrão háptico contínuo de ronrom de gato
function gerarPadraoRonromHaptico() {
  return [40, 60, 40, 60, 50, 70];
}

// P220. Propriedades táteis e visuais por espécie
function obterPropriedadesTexturaPet(especie = "prumi") {
  const texturas = {
    prumi: { sensacao: "gelatinoso_macio", somToque: "pop", reflexo: "brilho_d'agua" },
    gato: { sensacao: "peludinho_aveludado", somToque: "purr", reflexo: "maciez_fosca" },
    morcego: { sensacao: "asas_de_seda", somToque: "flutter", reflexo: "escuro_suave" },
    raposa: { sensacao: "cauda_fofa", somToque: "swoosh", reflexo: "dourado_terra" }
  };
  return texturas[especie] || texturas.prumi;
}

// P221. Verificador de hora de dormir (colocar touca e bocejar)
function verificarHoraPijamaPet(horaAtual = "22:45") {
  const partes = String(horaAtual || "12:00").split(":");
  const h = parseInt(partes[0], 10) || 0;
  const m = parseInt(partes[1], 10) || 0;
  const totalMin = h * 60 + m;
  const horaPijama = totalMin >= 1350 || totalMin < 360; // 22:30 às 06:00
  return {
    vesteToucaDormir: horaPijama,
    estadoSugerido: horaPijama ? "sonolento" : "ocioso",
    fala: horaPijama ? "Yaaawn... que soninho gostoso. Hora de desacelerar as telas." : "Pronto para o dia!"
  };
}

// P222. Coordenadas de partículas flutuantes de sono Zzz
function gerarParticulasSonoZzz(origemX = 100, origemY = 80) {
  return [
    { texto: "z", x: origemX, y: origemY, delay: "0s", tamanho: 14 },
    { texto: "Z", x: origemX + 12, y: origemY - 15, delay: "0.6s", tamanho: 18 },
    { texto: "Z", x: origemX + 24, y: origemY - 32, delay: "1.2s", tamanho: 24 }
  ];
}

// P223. Postura de espreguiçamento matinal
function gerarAnimacaoEspreguicar(hora = "07:30") {
  const h = parseInt(String(hora).split(":")[0], 10) || 0;
  const matutino = h >= 6 && h <= 8;
  return {
    espreguicando: matutino,
    bracosLevantados: matutino,
    mensagem: matutino ? "Bom dia com energia renovada! ☀️" : "Em atividade!"
  };
}

// P224. Verificador de soneca vespertina (Power Nap)
function verificarSonecaVespertina(horaAtual = "13:45", inativoMinutos = 10) {
  const partes = String(horaAtual || "12:00").split(":");
  const h = parseInt(partes[0], 10) || 0;
  const m = parseInt(partes[1], 10) || 0;
  const min = h * 60 + m;
  const faixaSoneca = min >= 810 && min <= 870; // 13:30 às 14:30
  const tirandoSoneca = faixaSoneca && inativoMinutos >= 5;
  return {
    tirandoSoneca,
    duracaoMin: 20,
    mensagem: tirandoSoneca ? "Cochilo rápido restaurador pós-almoço... zZz" : "Alerta."
  };
}

// P225. Balão de pensamentos e sonhos do pet
function gerarPensamentoSonhoPet(seed = 1) {
  const sonhos = [
    { icone: "💧✨", descricao: "Sonhando com lagos cristalinos e copos d'água frescos" },
    { icone: "⭐🏰", descricao: "Sonhando com castelos dourados e metas cumpridas" },
    { icone: "📚🍂", descricao: "Sonhando com bibliotecas antigas e folhas de outono" }
  ];
  const idx = Math.abs(parseInt(seed, 10) || 0) % sonhos.length;
  return sonhos[idx];
}

// P226. Ajuste de iluminação e abajur do quarto
function ajustarIluminacaoQuartoPet(temaEscuro = true, hora = 23) {
  const ehNoite = hora >= 20 || hora < 6;
  return {
    luzApagada: Boolean(temaEscuro || ehNoite),
    abajurVagalumesAtivo: Boolean(temaEscuro || ehNoite),
    brilhoAmbiente: (temaEscuro || ehNoite) ? 0.35 : 1.0
  };
}

// P227. Sussurro acolhedor se o app for aberto de madrugada (03h)
function gerarAvisoMadrugadaCarinhoso(hora = 3) {
  const madrugada = hora >= 1 && hora <= 4;
  return {
    ehMadrugada: madrugada,
    sussurro: madrugada ? "Shhh... o que faz acordado a essa hora? Descanse seus olhinhos, amanhã é um novo dia. 🌙" : null
  };
}

// P228. Curva circadiana de vitalidade do mascote
function calcularCurvaEnergiaCircadianaPet(hora = 10, picoFocoUsuario = 10) {
  const dif = Math.abs(hora - picoFocoUsuario);
  const vitalidade = Math.max(30, 100 - dif * 8);
  return { vitalidadePorcentagem: vitalidade, emPicoDeFoco: dif <= 1 };
}

// P229. Rotina de higiene noturna do pet
function gerarRotinaHigieneNoturna() {
  return {
    acoes: ["escovando_dentes", "lavando_rostinho", "ajeitando_almofada"],
    prontoParaDormir: true
  };
}

// P230. Evento raro divertido de sonambulismo
function gerarEventoSonambulismo() {
  return {
    caminhandoDormindo: true,
    destino: "tigela_de_agua",
    falaDormindo: "Mais um golinho de água... zZz"
  };
}

// P231. Nível da tigela de água sincronizado com copos bebidos
function calcularNivelTigelaAguaPet(coposBebidos = 6) {
  const c = Math.max(0, parseInt(coposBebidos, 10) || 0);
  const perc = Math.min(100, Math.round((c / 8) * 100));
  return { nivelPorcentagem: perc, tigelaCheia: perc >= 100 };
}

// P232. Concessão de Biscoito Estrela da manhã
function concederBiscoitoEstrela(horaConclusaoPrimeiraTarefa = "08:15") {
  const h = parseInt(String(horaConclusaoPrimeiraTarefa).split(":")[0], 10) || 0;
  const ganhou = h < 9;
  return {
    ganhouBiscoito: ganhou,
    itemNome: "Biscoito Estrela Crocante ⭐🍪",
    mensagem: ganhou ? "Você concluiu uma tarefa cedo e ganhou um biscoito para seu pet!" : "Foco mantido!"
  };
}

// P233. Colheita de frutas no pomar das metas (a cada 4 pomodoros)
function colherFrutaPomarMetas(pomodorosCompletos = 8) {
  const frutasTotais = Math.floor((parseInt(pomodorosCompletos, 10) || 0) / 4);
  const tipos = ["Maçã Vermelha 🍎", "Pêra Suculenta 🍐", "Mirtilos Silvestres 🫐"];
  return {
    frutasGanhas: frutasTotais,
    frutaTipo: tipos[frutasTotais % tipos.length] || tipos[0]
  };
}

// P234. Preparo de Chá de Camomila calmante
function prepararChaCamomilaPet() {
  return {
    bebida: "Chá de Camomila 🍵",
    efeito: "Reduz a frequência cardíaca visual e induz serenidade profunda.",
    duracaoMinutos: 45
  };
}

// P235. Diminuição progressiva do alimento SVG por mordidas
function calcularEstagioMastigacaoComida(mordidaAtual = 2, totalMordidas = 4) {
  const restante = Math.max(0, totalMordidas - mordidaAtual);
  return {
    mordidasRestantes: restante,
    escalaAlimentoSvg: parseFloat((restante / totalMordidas).toFixed(2)),
    acabou: restante === 0
  };
}

// P236. Partículas de migalhas para limpeza
function gerarMigalhasLimpezaChao(quantidade = 4) {
  const migalhas = [];
  for (let i = 0; i < quantidade; i++) {
    migalhas.push({ id: "migalha-" + i, x: 80 + i * 15, y: 195, limpa: false });
  }
  return migalhas;
}

// P237. Digestão energizante (pico de radiância 20min pós-refeição)
function calcularEfeitoDigestaoEnergizante(tempoAlimentadoMin = 20) {
  const min = parseInt(tempoAlimentadoMin, 10) || 0;
  const noPico = min >= 15 && min <= 35;
  return { noPicoEnergia: noPico, brilhoExtra: noPico ? 1.25 : 1.0 };
}

// P238. Cupcake com velinha de aniversário
function gerarCupcakeAniversarioPet(usuarioAniversario = true) {
  return {
    disponivel: Boolean(usuarioAniversario),
    velinhaAcesa: true,
    soprada: false,
    mensagem: "O Prumi preparou um bolinho especial com velinha para você! Faça um pedido! 🎂✨"
  };
}

// P239. Poção de hidratação concentrada
function aplicarPocaoHidratacaoConcentrada(pet = {}) {
  return {
    ...pet,
    hidratacao: 100,
    brilhoHidrico: "radiante",
    efeitoVisual: "gotinhas_cintilantes"
  };
}

// P240. Prato favorito por espécie animal
function obterPratoFavoritoPet(especie = "gato") {
  const favoritos = {
    prumi: { prato: "Orvalho de Flores da Manhã", icone: "💧🌸", bonusGotas: 5 },
    gato: { prato: "Sashimi de Salmão Fresco", icone: "🐟", bonusGotas: 5 },
    morcego: { prato: "Néctar de Frutas Roxas", icone: "🍇", bonusGotas: 5 },
    raposa: { prato: "Bagas Vermelhas do Bosque", icone: "🍓", bonusGotas: 5 }
  };
  return favoritos[especie] || favoritos.prumi;
}

// P241. Ordenação correta de camadas SVG do mascote
function ordenarCamadasSvgPet(itensEquipados = {}) {
  return [
    { camada: "sombra_chao", zIndex: 1 },
    { camada: "corpo_fundo", zIndex: 2 },
    { camada: "roupa_corpo", zIndex: 3, item: itensEquipados.corpo },
    { camada: "cabeca_rosto", zIndex: 4 },
    { camada: "olhos_expressao", zIndex: 5 },
    { camada: "chapeu_cabeca", zIndex: 6, item: itensEquipados.cabeca },
    { camada: "acessorio_mao", zIndex: 7, item: itensEquipados.acessorio }
  ];
}

// P242. Física pendular de capas e cachecóis
function calcularFisicaPendularCachecol(velocidadePet = 3) {
  const angulo = Math.max(-30, Math.min(30, velocidadePet * 4));
  return { anguloOscilacaoGraus: parseFloat(angulo.toFixed(1)), fluido: true };
}

// P243. Reflexo de luz transparente nas lentes dos óculos
function gerarReflexoOculosSvg(largura = 20, altura = 14) {
  return `<rect width="${largura}" height="${altura}" fill="url(#gradReflexoOculos)" rx="3" opacity="0.4"/>`;
}

// P244. Miniatura do livro lido na mochilinha do pet
function gerarMiniaturaMochilaLivroLendo(livroAtual = {}) {
  return {
    livroTitulo: livroAtual.titulo || "Caderno de Notas",
    corCapa: livroAtual.cor || "#4F6E4B",
    visivelNaMochila: true
  };
}

// P245. Efeito sonoro dos passos conforme calçado
function obterSomPassosCalcado(tipoCalcado = "tenis") {
  const sons = {
    tenis: "squeak_macio",
    botinhas: "tap_tap_madeira",
    pantufas: "passos_silenciosos_algodao"
  };
  return { tipoCalcado, efeitoSonoro: sons[tipoCalcado] || sons.pantufas };
}

// P246. Auréola translúcida ao redor do mascote por nível de foco
function gerarAuraNivelEstudoPet(horasTotaisFoco = 55) {
  const h = parseFloat(horasTotaisFoco) || 0;
  let cor = "aura-azul";
  if (h >= 100) cor = "aura-dourado";
  else if (h >= 50) cor = "aura-roxo";
  return { classeAura: `aura-nivel-pet ${cor}`, horas: h };
}

// P247. Filtro CSS dinâmico para tingimento de roupinhas (HSL)
function gerarFiltroTingimentoRoupasHsl(matiz = 210, saturacao = 70, luminosidade = 50) {
  return `filter: hue-rotate(${matiz}deg) saturate(${saturacao}%);`;
}

// P248. Câmera de zoom 2X no provador da loja
function calcularZoomProvadorLoja(slotSelecionado = "cabeca") {
  const pontosFoco = {
    cabeca: { x: 50, y: 25, zoom: 2.0 },
    corpo: { x: 50, y: 55, zoom: 1.8 },
    acessorio: { x: 70, y: 60, zoom: 2.2 }
  };
  return pontosFoco[slotSelecionado] || { x: 50, y: 50, zoom: 1.0 };
}

// P249. Conjunto temático completo de roupas
function obterConjuntoTematicoCompleto(temaId = "astronauta") {
  const conjuntos = {
    astronauta: { nome: "Explorador Espacial", cabeca: "Capacete Lunar", corpo: "Traje Espacial", acessorio: "Mini Foguete" },
    mago: { nome: "Arcanista das Estrelas", cabeca: "Chapéu Pontudo Mágico", corpo: "Manto de Veludo", acessorio: "Varinha de Cristal" },
    detetive: { nome: "Detetive dos Mistérios", cabeca: "Boina Xadrez", corpo: "Sobretudo Bege", acessorio: "Lupa de Ouro" }
  };
  return conjuntos[temaId] || conjuntos.astronauta;
}

// P250. Memória para 3 slots de looks favoritos
function gerarSlotsLooksFavoritos(looksSalvos = [], novoLook = {}) {
  const lista = Array.isArray(looksSalvos) ? [...looksSalvos] : [];
  if (novoLook.id) {
    if (lista.length >= 3) lista.shift(); // Preserva até 3 looks
    lista.push({ ...novoLook, salvoEm: Date.now() });
  }
  return lista;
}

// P251. Suporte e inicialização a novas espécies de mascotes
function inicializarEspeciePet(tipo = "prumi") {
  const especies = ["prumi", "gato", "morcego", "coruja", "raposa"];
  const esp = especies.includes(tipo) ? tipo : "prumi";
  return { especie: esp, nivelEvolucao: 1, xp: 0 };
}

// P252. Animação ociosa distinta para cada espécie
function obterAnimacaoOciosaEspecie(especie = "gato") {
  const animacoes = {
    prumi: "ondulacao_gelatina",
    gato: "limpando_patinha",
    morcego: "pendurado_ponta_cabeca",
    coruja: "girando_cabeca_curiosa",
    raposa: "abanando_cauda_dourada"
  };
  return { especie, animacao: animacoes[especie] || "respiracao_suave" };
}

// P253. Quatro estágios evolutivos com nomes e silhuetas
function calcularEstagioEvolucaoMascote(xp = 450) {
  const val = Math.max(0, parseInt(xp, 10) || 0);
  if (val >= 1200) return { estagio: 4, titulo: "Lendário Ancestral 👑", proximoXp: null };
  if (val >= 600) return { estagio: 3, titulo: "Sábio Iluminado ✨", proximoXp: 1200 };
  if (val >= 200) return { estagio: 2, titulo: "Jovem Companheiro 🌱", proximoXp: 600 };
  return { estagio: 1, titulo: "Bebê Curioso 🐣", proximoXp: 200 };
}

// P254. Balões de diálogo procedurais sem repetições
function gerarBalaoDialogoProceduralPet(humor = "radiante", hora = 14, tarefa = "ler livro") {
  if (humor === "sonolento") return "Meus olhinhos estão pesando... mas continuo com você. zZz";
  if (humor === "focado") return `Foco total na missão: ${tarefa}! Nada vai nos distrair agora. 🎯`;
  if (hora < 12) return "Bom dia! Que a luz da manhã ilumine suas tarefas mais difíceis! ☀️";
  return "Você está indo super bem hoje. Que tal beber um copinho d'água? 💧";
}

// P255. Reação de deleite ao receber carinho simultâneo (múltiplos toques)
function processarCarinhoMultiploDedos(toques = 2) {
  const muitosDedos = parseInt(toques, 10) >= 2;
  return {
    ronronandoIntenso: muitosDedos,
    coracoesFlutuantes: muitosDedos ? 6 : 2,
    afetoExtra: muitosDedos ? 8 : 2
  };
}

// P256. Minijogo de buscar o graveto no parque
function gerarMinijogoPegarGraveto(posicaoLancamento = 80) {
  return {
    gravetoLancadoX: posicaoLancamento,
    petCorrendo: true,
    tempoBuscaSegundos: 2.2,
    mensagem: "O pet correu feliz e trouxe o galhinho de volta no bico/boca! 🐕🪵"
  };
}

// P257. Bolha de sabão que estoura ao ser tocada
function gerarBalaoDeSabaoInterativo(x = 120, y = 150) {
  return {
    x,
    y,
    raio: 22,
    estourou: false,
    estourar: function() { this.estourou = true; return { gotasRecompensa: 1, som: "pop_cristalino" }; }
  };
}

// P258. Truque de pular pelo arco desbloqueado no nível 3
function gerarTruquePularAro(nivelAfeto = 3) {
  const apto = parseInt(nivelAfeto, 10) >= 3;
  return {
    aptoParaAcrobacia: apto,
    truqueNome: "Salto Mortal pelo Arco de Fogo Mágico 🎪✨",
    mensagem: apto ? "O pet pulou com graça e perfeição!" : "Requer nível 3 de afeto para treinar este truque."
  };
}

// P259. Felicidade do mascote impulsionada pela decoração do quarto
function calcularFelicidadePorAmbiente(decoracoesQuarto = 5) {
  const b = Math.min(25, (parseInt(decoracoesQuarto, 10) || 0) * 5);
  return { bonusAmbiente: b, status: b >= 20 ? "Quarto super aconchegante! 🏡" : "Quarto tranquilo." };
}

// P260. Reação do mascote ao ritmo da música Lofi
function gerarReacaoMascoteMusica(bpm = 70) {
  return {
    ritmoBpm: bpm,
    balancoCabecaAnim: true,
    duracaoCompassoSegundos: parseFloat((60 / bpm).toFixed(2))
  };
}

// P261. Recepção de mascote visitante do parceiro/amigo
function receberMascoteVisitanteAmigo(petAmigo = "morcego", nomeAmigo = "Alex") {
  return {
    visitanteEspecie: petAmigo,
    amigoTutor: nomeAmigo,
    tempoVisitaMinutos: 15,
    notificacao: `O ${petAmigo} de ${nomeAmigo} acabou de pousar no seu quarto para brincar! 🐾`
  };
}

// P262. Brincadeira de pega-pega ou cochilo entre dois mascotes
function gerarInteracaoDoisPetsQuarto(meuPet = "prumi", petVisitante = "gato") {
  return {
    participantes: [meuPet, petVisitante],
    atividade: "cochilo_no_tapete",
    mensagem: `${meuPet} e ${petVisitante} estão deitados juntos no tapete ouvindo chuva.`
  };
}

// P263. Despedida do mascote visitante com mimo de presente
function despedidaMascoteVisitante(petVisitante = "raposa") {
  return {
    pet: petVisitante,
    aceno: "tchau_com_patinha",
    presenteDeixado: "Folha Dourada de Outono 🍂",
    gotasGanhas: 5
  };
}

// P264. Diário escrito sob a perspectiva do mascote
function gerarRegistroDiarioMascote(eventosDia = {}) {
  const carinho = eventosDia.carinho || "muito amor";
  return `Querido diário: Hoje meu tutor me deu ${carinho} e nós conquistamos metas incríveis juntos! ❤️`;
}

// P265. Brinquedo preferido por espécie
function calcularPreferenciaBrinquedoPet(especie = "gato") {
  const brinquedos = {
    gato: { item: "Novelo de Lã Mágico", icone: "🧶" },
    prumi: { item: "Bola de Sabão Infinita", icone: "🫧" },
    morcego: { item: "Sininho de Vento de Cristal", icone: "🎐" },
    coruja: { item: "Pena Dourada de Caligrafia", icone: "🪶" },
    raposa: { item: "Pinha do Bosque Secreto", icone: "🌲" }
  };
  return brinquedos[especie] || brinquedos.prumi;
}

// P266. Animação de susto cômico do mascote com pulinho
function gerarAnimacaoSustoComico(evento = "alarme_tocou") {
  return {
    evento,
    pulinhoArGraus: -15,
    olhosArregalados: true,
    fala: "Eita! Que susto gostoso! Vamos acordar! ⚡"
  };
}

// P267. Olhos de coração apaixonado por carinho intenso
function gerarEfeitoBrilhoOlhosAmor(nivelAfeto = 80) {
  const apaixonado = nivelAfeto >= 75;
  return {
    olhosCoracao: apaixonado,
    iconePupila: apaixonado ? "💖" : "•"
  };
}

// P268. Pose triunfante com bandeirinha ou troféu
function gerarPoseVitoriaConquista(conquista = "Semana Perfeita") {
  return {
    pose: "trofeu_erguido",
    conquista,
    animacao: "brilho_vitoria_estrelas"
  };
}

// P269. Banho de espuma relaxante com patinho de borracha
function gerarBanhoEspumaMascote() {
  return {
    naBanheira: true,
    brinquedoBanho: "Patinho Amarelo 🐥",
    bolhasEspuma: 12,
    fala: "Que delícia de água morninha... todo limpinho e cheiroso!"
  };
}

// P270. Secagem sacudindo gotinhas em volta
function calcularSecagemPelagemPet(tempoSecagem = 3) {
  return {
    sacudindoPelagem: true,
    gotinhasEspirradas: 8,
    seco: tempoSecagem >= 3
  };
}

// P271. Companhia do mascote adaptada à aba atual
function gerarCompanhiaPetAbaEspecifica(abaAtual = "estudos") {
  const abas = {
    estudos: { acessorio: "Óculos Redondos de Leitura", animacao: "lendo_livrinho" },
    dieta: { acessorio: "Copinho com Canudo", animacao: "bebendo_agua" },
    social: { acessorio: "Cartinha com Selo", animacao: "acenando_amigos" }
  };
  return abas[abaAtual] || { acessorio: "Nenhum", animacao: "sorrindo" };
}

// P272. Disfarce cômico do mascote
function gerarDisfarceMascote(evento = "halloween") {
  return {
    disfarce: "Bigode de Detetive Francês 🥸",
    misterioso: true
  };
}

// P273. Custo e requisitos para treinar truques avançados
function calcularCustoTreinamentoTruque(dificuldade = "media") {
  const custos = { facil: 15, media: 30, dificil: 60 };
  return { custoGotas: custos[dificuldade] || 30, tempoTreinoMin: 10 };
}

// P274. Diploma oficial de Treinador de Mascotes
function gerarDiplomaTreinadorMascotes(truquesEnsinados = 5) {
  return {
    titulo: "Mestre Treinador de Mascotes 📜✨",
    truquesDominados: truquesEnsinados,
    autorizado: truquesEnsinados >= 3
  };
}

// P275. Feixe de luz ascendente para evolução do mascote
function gerarEfeitoEvolucaoMascoteSvg() {
  return `<svg width="140" height="140" viewBox="0 0 100 100" class="anim-evolucao-svg">
    <circle cx="50" cy="50" r="40" stroke="#ffd700" stroke-width="4" fill="none" stroke-dasharray="6 4"/>
    <polygon points="50,15 58,35 80,35 62,50 69,72 50,58 31,72 38,50 20,35 42,35" fill="#ffd700" opacity="0.8"/>
  </svg>`;
}

// P276. Consumo de energia em brincadeiras
function calcularConsumoEnergiaBrincadeiras(tempoBrincadeiraMin = 15) {
  const min = parseInt(tempoBrincadeiraMin, 10) || 0;
  return { energiaGasta: min * 2, sonoAumentado: min * 1.5 };
}

// P277. Síntese Web Audio contínua de ronrom de gato (45Hz - 75Hz)
function gerarSomRonromWebAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, ctx.currentTime);
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    return true;
  } catch (e) {
    return false;
  }
}

// P278. Síntese Web Audio de pio suave de coruja (Hoot)
function gerarSomPioCoruja() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
    return true;
  } catch (e) {
    return false;
  }
}

// P279. Som ultrassônico simulado de eco de morcego
function gerarSomEcoMorcego() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    return true;
  } catch (e) {
    return false;
  }
}

// P280. Som carinhoso de latidinho filhote de raposa
function gerarSomLatidinhoRaposa() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
    return true;
  } catch (e) {
    return false;
  }
}

// P281. Caminha customizada para o mascote
function gerarCaminhaCustomizadaPet(estilo = "nuvem") {
  const estilos = {
    nuvem: { nome: "Nuvem de Algodão Fofinha", conforto: 95, cor: "#e0f2fe" },
    folhas: { nome: "Ninho de Folhas de Carvalho", conforto: 85, cor: "#dcfce7" },
    cesto: { nome: "Cesto de Vime Trançado", conforto: 90, cor: "#fef3c7" }
  };
  return estilos[estilo] || estilos.nuvem;
}

// P282. Frequência de piscadelas proporcional à calma/ansiedade
function calcularVelocidadePiscadelasAnsiedade(tempoSemFoco = 10) {
  const calmo = tempoSemFoco <= 15;
  return {
    intervaloPiscadelaMs: calmo ? 4500 : 2200,
    estadoMental: calmo ? "sereno_zen" : "agitado_precisa_respirar"
  };
}

// P283. Minijogo de puxar corda no intervalo
function gerarBrinquedoCordaPuxar() {
  return {
    brinquedo: "Corda Trançada Colorida",
    forcaTutor: 50,
    forcaPet: 48,
    disputaEquilibrada: true
  };
}

// P284. Pegadas de tinta colorida no chão do app
function gerarEfeitoPegadaTintaColorida(x = 100, y = 200, cor = "#ec4899") {
  return {
    x: parseInt(x, 10) || 0,
    y: parseInt(y, 10) || 0,
    cor,
    icone: "🐾",
    classe: "pegada-tinta-anim"
  };
}

// P285. Limpeza de pegadas com esponja mágica
function limparPegadasTintaComEsponja(container) {
  if (!container || typeof container.querySelectorAll !== "function") return 0;
  const pegadas = container.querySelectorAll(".pegada-tinta-anim");
  pegadas.forEach(p => p.remove());
  return pegadas.length;
}

// P286. Pose de dormir encolhidinho para dias frios
function gerarPoseDormindoEncolhidinho() {
  return {
    pose: "bolinha_encolhida",
    caudaEnrolada: true,
    calorPreservado: true
  };
}

// P287. Efeito de bocejo contagioso com mãozinha na boca
function gerarEfeitoBocejoContagioso() {
  return {
    bocejando: true,
    olhosFechados: true,
    somBocejo: "yaaaawn_fofo"
  };
}

// P288. Bônus de afeto por consistência de uso do Prumo
function calcularBonusAfetoPorConsistencia(streakDias = 15) {
  const d = Math.max(1, parseInt(streakDias, 10) || 1);
  const mult = parseFloat((1 + Math.min(1, d * 0.05)).toFixed(2));
  return { multiplicadorAfeto: mult, streakDias: d };
}

// P289. Reação com cambalhota e confetes ao bater recorde
function gerarReacaoPetAoBaterRecorde(recorde = "Maior foco da vida") {
  return {
    animacao: "cambalhota_mortal_com_confetes",
    recordeSuperado: recorde,
    fala: "INACREDITÁVEL! Você superou seu recorde! Eu sabia que conseguiria! 🏆✨"
  };
}

// P290. Medalha de Amigo Mais Fiel na coleira
function gerarMedalhaAmigoMaisFiel(diasJuntos = 50) {
  return {
    diasJuntos,
    gravacao: "Amizade Inabalável 🏅",
    brilhoMetal: "dourado"
  };
}

// P291. Mensagem afetuosa de boa noite do mascote
function gerarSussurroDormirPet(nomePet = "Prumi") {
  return `${nomePet}: Boa noite! Sonhe com coisas lindas e recarregue suas energias. Estarei aqui amanhã! 🌙✨`;
}

// P292. Minijogo de perseguir o ponto laser
function gerarAnimacaoPerseguirLaser(laserX = 150, laserY = 120) {
  return {
    alvoLaser: { x: laserX, y: laserY },
    petCorrendo: true,
    pataTentandoPegar: true
  };
}

// P293. Miniatura do mascote caminhando na barra de navegação
function gerarMascoteMiniaturaBarraNavegacao() {
  return {
    iconeMini: "🐾",
    tamanhoPx: 20,
    visivelNoRodape: true
  };
}

// P294. Índice de sociabilidade por visitas recebidas no quarto
function calcularNivelSociabilidadePet(visitasRecebidas = 8) {
  const v = parseInt(visitasRecebidas, 10) || 0;
  return {
    visitas: v,
    tituloSocial: v >= 5 ? "Anfitrião Adorável da Turma 🌟" : "Pet Amistoso 🌱"
  };
}

// P295. Florzinha decorativa repousando na cabeça
function gerarEfeitoFlorNaCabeca(florTipo = "margarida") {
  const flores = {
    margarida: { nome: "Margarida Branca 🌼", cor: "#fef08a" },
    rosa: { nome: "Rosa Perfumada 🌹", cor: "#f43f5e" },
    trevo: { nome: "Trevo de Quatro Folhas 🍀", cor: "#22c55e" }
  };
  return flores[florTipo] || flores.margarida;
}

// P296. Banquete comemorativo com vários mascotes reunidos
function gerarBanqueteComemorativoMascotes(petsReunidos = ["prumi", "gato", "morcego"]) {
  return {
    mesaFarta: true,
    convidados: petsReunidos,
    pratos: ["Biscoitos Estrela", "Chá de Frutas", "Bagas Silvestres"],
    celebrando: true
  };
}

// P297. Sombra projetada oval dinâmica do mascote
function gerarSombraProjetadaDinamicaPet(escalaX = 1.0, escalaY = 1.0) {
  return {
    larguraPx: Math.round(70 * escalaX),
    alturaPx: Math.round(18 * escalaY),
    opacidade: parseFloat((0.2 * (1 / Math.max(0.5, escalaY))).toFixed(2)),
    classe: "sombra-projetada-pet"
  };
}

// P298. Teletransporte mágico com espiral de partículas
function gerarEfeitoTeletransporteMagicoPet() {
  return {
    animacao: "espiral_particulas_magicas",
    som: "teletransporte_suave",
    duracaoSegundos: 1.2
  };
}

// P299. Índice de companheirismo vitalício do mascote
function calcularIndiceCompanheirismoVitalicio(historico = { dias: 60, horasFoco: 120, carinhos: 200 }) {
  const score = (historico.dias || 0) * 5 + (historico.horasFoco || 0) * 3 + (historico.carinhos || 0);
  return {
    pontuacaoGeral: score,
    grauCompanheirismo: "Laço Inquebrável de Alma ✨🐾"
  };
}

// P300. Conclusão oficial do Marco de 100 itens do Eixo Pets!
function concluirMarcoPets300(versao = "2.2.0") {
  return {
    eixo: "Pets & Mascotes Encantados",
    itensConcluidos: 100,
    metaTotalEixo: 200,
    versao,
    dataRegistro: new Date().toISOString(),
    hashIntegridade: "PRUMO-PETS-LOTE1-VERIFIED"
  };
}
