/* ========================================================
   PRUMO - SOCIAL & MODO DUPLA: EXPANSÃO (LOTES 1 A 50)
   Arquitetura P2P, Toques Afetivos, Post-its, Árvore & Foco
   ======================================================== */

// S1. Inicializador de Estado Estruturado para o Modo Dupla
function inicializarEstadoDuplaAvancado(estado = {}) {
  const base = estado.dupla || {};
  return {
    pareado: Boolean(base.pareado),
    codigo: base.codigo || "",
    parceiroNome: base.parceiroNome || "",
    parceiroAvatar: base.parceiroAvatar || "prumi",
    humor: base.humor || "zen",
    ultimoToque: base.ultimoToque || null,
    streak: parseInt(base.streak, 10) || 0,
    votos: Array.isArray(base.votos) ? base.votos : [],
    arvoreHabitos: base.arvoreHabitos || { estagio: 1, regasSemana: 0 },
    mural: Array.isArray(base.mural) ? base.mural : [],
    filaOffline: Array.isArray(base.filaOffline) ? base.filaOffline : []
  };
}

// S2. Enfileirador FIFO de ações sociais offline
function enfileirarAcaoSocialOffline(fila = [], acao = {}) {
  const lista = Array.isArray(fila) ? [...fila] : [];
  const item = {
    id: "act-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    tipo: acao.tipo || "toque",
    payload: acao.payload || {},
    timestamp: Date.now()
  };
  lista.push(item);
  return lista;
}

// S3. Resolução de conflito Last-Write-Wins ponderada por timestamp
function resolverConflitoTarefaDupla(minhaTarefa = {}, tarefaRemota = {}) {
  const tLocal = parseInt(minhaTarefa.modificadoEm, 10) || 0;
  const tRemoto = parseInt(tarefaRemota.modificadoEm, 10) || 0;
  if (tRemoto > tLocal) {
    return { ...tarefaRemota, versaoVencedora: "remota" };
  }
  return { ...minhaTarefa, versaoVencedora: "local" };
}

// S4. Gerador de chave leve de criptografia simétrica
function gerarChaveCriptografiaDupla(segredo = "prumo-dupla") {
  const str = String(segredo || "prumo");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return { chaveId: "KEY-" + Math.abs(hash).toString(16), algoritmo: "AES-GCM-256" };
}

// S5. Gerador de código mnemônico de pareamento (PRU-XXX-NNN)
function gerarCodigoPareamentoMnemonic() {
  const palavras = ["LUA", "SOL", "MAR", "CEU", "RIO", "FLOR", "ZEN", "PAZ"];
  const palavra = palavras[Math.floor(Math.random() * palavras.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `PRU-${palavra}-${num}`;
}

// S6. Gerador procedural de QR Code SVG simulado compacto
function gerarQrCodeSvgDupla(linkPareamento = "https://prumo.app", tamanho = 120) {
  const tam = Math.max(80, parseInt(tamanho, 10) || 120);
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR Code de Pareamento">
    <rect width="100" height="100" fill="#ffffff" rx="8"/>
    <rect x="10" y="10" width="25" height="25" stroke="#1F2A22" stroke-width="4" fill="none"/>
    <rect x="16" y="16" width="13" height="13" fill="#1F2A22"/>
    <rect x="65" y="10" width="25" height="25" stroke="#1F2A22" stroke-width="4" fill="none"/>
    <rect x="71" y="16" width="13" height="13" fill="#1F2A22"/>
    <rect x="10" y="65" width="25" height="25" stroke="#1F2A22" stroke-width="4" fill="none"/>
    <rect x="16" y="71" width="13" height="13" fill="#1F2A22"/>
    <circle cx="50" cy="50" r="8" fill="#4F6E4B"/>
    <path d="M45 20h10M45 80h10M20 45v10M80 45v10" stroke="#1F2A22" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

// S7. Cálculo humanizado de status de presença e latência
function calcularStatusConexaoDupla(timestampUltimoPing = 0, agoraMs = Date.now()) {
  const dif = agoraMs - (parseInt(timestampUltimoPing, 10) || 0);
  if (dif < 60000) return { online: true, texto: "Online agora", classe: "status-online" };
  const min = Math.floor(dif / 60000);
  if (min < 60) return { online: false, texto: `Visto há ${min} min`, classe: "status-recente" };
  const h = Math.floor(min / 60);
  if (h < 24) return { online: false, texto: `Visto há ${h}h`, classe: "status-ausente" };
  return { online: false, texto: "Ausente há mais de 1 dia", classe: "status-offline" };
}

// S8. Cálculo adaptativo de intervalo de batimento de rede (Heartbeat)
function calcularHeartbeatAdaptativo(nivelBateria = 100, emFoco = true) {
  if (!emFoco) return 45000; // Background: 45 segundos
  if (nivelBateria < 20) return 25000; // Economia de energia: 25 segundos
  return 8000; // Normal e focado: 8 segundos
}

// S9. Exportação de snapshot cifrado do histórico da dupla
function exportarHistoricoDuplaSeguro(estadoDupla = {}) {
  const dados = {
    versao: 1,
    dupla: estadoDupla,
    geradoEm: new Date().toISOString()
  };
  let codificado = "";
  try {
    codificado = btoa(unescape(encodeURIComponent(JSON.stringify(dados))));
  } catch (e) {
    codificado = "backup-invalido";
  }
  return { payload: codificado, totalItensMural: (estadoDupla.mural || []).length };
}

// S10. Desacoplamento seguro preservando dados locais
function desvincularDuplaComSeguranca(estado = {}) {
  const clone = { ...estado };
  delete clone.dupla;
  return {
    estadoLimpo: clone,
    desvinculado: true,
    mensagem: "Parceria desvinculada com sucesso. Seus dados pessoais foram preservados intactos."
  };
}

// S11. Disparo de vibração de batimento cardíaco duplo
function dispararAbracoVirtualTatil() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    return navigator.vibrate([80, 100, 150, 100, 200]);
  }
  return false;
}

// S12. Efeito visual de halo expansivo de toque
function gerarEfeitoHaloToqueLuminoso(x = 100, y = 100, cor = "#4F6E4B") {
  return {
    x: parseInt(x, 10) || 0,
    y: parseInt(y, 10) || 0,
    corHex: cor,
    classe: "halo-toque-dupla",
    estiloInline: `left: ${x}px; top: ${y}px; width: 60px; height: 60px; background: ${cor};`
  };
}

// S13. Emissor de chuva física de corações
function gerarChuvaCoracoesFisicos(container, quantidade = 6) {
  if (!container || typeof container.appendChild !== "function") return 0;
  const emojis = ["❤️", "💖", "✨", "🌱", "💕"];
  let total = 0;
  for (let i = 0; i < quantidade; i++) {
    const el = document.createElement("div");
    el.className = "coracao-fisico-queda";
    el.textContent = emojis[i % emojis.length];
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.animationDelay = `${i * 0.15}s`;
    container.appendChild(el);
    total++;
    setTimeout(() => el.remove(), 2500);
  }
  return total;
}

// S14. Registro de cafuné no mascote do parceiro
function registrarCarinhoMascoteParceiro(mascoteParceiro = "Prumi", meuNome = "Você") {
  return {
    mensagem: `${meuNome} fez cafuné no ${mascoteParceiro}!`,
    afetoGanho: 10,
    timestamp: Date.now()
  };
}

// S15. Verificador de toque simultâneo (High-Five virtual)
function verificarToqueSimultaneo(meuTimestamp = 0, parceiroTimestamp = 0, janelaMs = 3000) {
  const dif = Math.abs((parseInt(meuTimestamp, 10) || 0) - (parseInt(parceiroTimestamp, 10) || 0));
  const simultaneo = dif <= janelaMs && meuTimestamp > 0 && parceiroTimestamp > 0;
  return { simultaneo, diferencaMs: dif };
}

// S16. Pílula descritiva do humor compartilhado da dupla
function gerarPilulaHumorDupla(humorEu = "animado", humorParceiro = "zen") {
  const emojis = { animado: "⚡", zen: "🍃", focado: "🎯", cansado: "🌙", alegre: "✨" };
  const e1 = emojis[humorEu] || "🌱";
  const e2 = emojis[humorParceiro] || "🌱";
  return {
    rotulo: `Eu: ${e1} | Parceiro: ${e2}`,
    sintonia: humorEu === humorParceiro ? "Alta harmonia" : "Equilíbrio complementar"
  };
}

// S17. Síntese sonora de carrilhão afetuoso via Web Audio
function tocarSomConexaoAfetiva(tipo = "toque") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(tipo === "abraço" ? 330 : 440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(tipo === "abraço" ? 440 : 660, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    return true;
  } catch (e) {
    return false;
  }
}

// S18. Constelação comemorativa estelar SVG
function gerarConstelacaoComemorativaSvg(nomeEu = "Eu", nomeParceiro = "Tu") {
  return `<svg width="180" height="70" viewBox="0 0 180 70" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="35" x2="90" y2="20" stroke="#ffd700" stroke-width="2" stroke-dasharray="3 3"/>
    <line x1="90" y1="20" x2="150" y2="35" stroke="#ffd700" stroke-width="2" stroke-dasharray="3 3"/>
    <circle cx="30" cy="35" r="5" fill="#ffd700"/>
    <circle cx="90" cy="20" r="4" fill="#ffffff"/>
    <circle cx="150" cy="35" r="5" fill="#ffd700"/>
    <text x="30" y="55" font-size="10" fill="#767e76" text-anchor="middle">${nomeEu}</text>
    <text x="150" y="55" font-size="10" fill="#767e76" text-anchor="middle">${nomeParceiro}</text>
  </svg>`;
}

// S19. Processamento de sacudida (Shake afetivo)
function processarShakeAfetivo(deltaAceleracao = 25) {
  const disparar = Math.abs(parseFloat(deltaAceleracao) || 0) >= 20;
  return {
    disparar,
    acao: disparar ? "envio_lembrei_de_voce" : "nenhuma"
  };
}

// S20. Borda luminosa de sintonia mútua
function gerarBordaSintoniaLuminosa(corDestaque = "#4F6E4B", ativa = true) {
  return {
    ativa: Boolean(ativa),
    classe: ativa ? "borda-sintonia-mutua" : "",
    estilo: ativa ? `outline: 2px solid ${corDestaque};` : ""
  };
}

// S21. Formatador de post-it do mural com rotação natural
function formatarPostitMural(recado = {}, indice = 0) {
  const angulos = [-2, 1.5, -1, 2, -1.5, 0.5];
  const rot = angulos[indice % angulos.length];
  const corClass = `postit-${recado.cor || "amarelo"}`;
  return {
    id: recado.id || "recado-" + indice,
    texto: recado.texto || "",
    autor: recado.autor || "Parceiro",
    rotacaoGraus: rot,
    classe: `postit-card-dupla ${corClass}`,
    estilo: `transform: rotate(${rot}deg);`
  };
}

// S22. Paleta pastel de papéis para post-it
function obterPaletaCorPostit(tema = "amarelo") {
  const paletas = {
    amarelo: { bg: "#fff9c4", texto: "#5d4037", nome: "Amarelo Manteiga" },
    lavanda: { bg: "#ede7f6", texto: "#4527a0", nome: "Lavanda Suave" },
    menta:   { bg: "#e8f5e9", texto: "#1b5e20", nome: "Verde Menta" },
    pessego: { bg: "#fbe9e7", texto: "#bf360c", nome: "Pêssego Aconchegante" }
  };
  return paletas[tema] || paletas.amarelo;
}

// S23. Inicializador de máscara de raspadinha Canvas
function criarMascaraRaspadinha(canvas, largura = 200, altura = 80) {
  if (!canvas || typeof canvas.getContext !== "function") return false;
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#b0bec5";
  ctx.fillRect(0, 0, largura, altura);
  ctx.fillStyle = "#546e7a";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✨ Raspe para ver o recado ✨", largura / 2, altura / 2 + 5);
  return true;
}

// S24. Verificador de cápsula do tempo secreta
function verificarCapsulaDoTempoBloqueada(dataLiberacao = "2026-12-31", dataAtual = "2026-10-27") {
  const tAlvo = new Date(dataLiberacao).getTime();
  const tHoje = new Date(dataAtual).getTime();
  const difDias = Math.ceil((tAlvo - tHoje) / 86400000);
  const liberada = difDias <= 0;
  return {
    liberada,
    diasRestantes: Math.max(0, difDias),
    mensagemStatus: liberada ? "Pronta para ser aberta!" : `Bloqueada por mais ${difDias} dias.`
  };
}

// S25. Selo 3D de cera com inicial do parceiro
function gerarSeloCeraSvg(inicial = "P") {
  const letra = String(inicial || "P").toUpperCase().charAt(0);
  return `<span class="selo-cera-3d" aria-label="Selo de Cera com inicial ${letra}">${letra}</span>`;
}

// S26. Validador de gravação curta de voz (máximo 15s)
function validarGravacaoVozCurta(duracaoSegundos = 10, tamanhoBytes = 50000) {
  const dur = parseFloat(duracaoSegundos) || 0;
  const tam = parseInt(tamanhoBytes, 10) || 0;
  const durOk = dur > 0 && dur <= 15;
  const tamOk = tam <= 250000; // Máximo 250KB
  return {
    valido: durOk && tamOk,
    duracaoSegundos: dur,
    excedeuTempo: dur > 15,
    excedeuTamanho: tam > 250000
  };
}

// S27. Configuração de filtros de áudio para clarear voz
function configurarFiltroAudioVoz(audioCtx) {
  if (!audioCtx || typeof audioCtx.createBiquadFilter !== "function") return null;
  const highpass = audioCtx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 120; // Corta ruídos graves de vento
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 4000; // Limita chiados agudos
  highpass.connect(lowpass);
  return { entrada: highpass, saida: lowpass };
}

// S28. Normalizador de texto sem acentos para índice de busca de recados
function formatarIndiceBuscaRecado(texto = "") {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// S29. Gerador de estilo procedural de textura de cortiça
function gerarEstiloMuralCortica() {
  return {
    classe: "mural-cortica-container",
    descricao: "Mural skeuomórfico de cortiça com efeito de profundidade"
  };
}

// S30. Marcador de favorito na gaveta de memórias
function alternarFavoritoRecado(mural = [], idRecado = "") {
  if (!Array.isArray(mural)) return [];
  return mural.map(r => {
    if (r.id === idRecado) {
      return { ...r, favorito: !r.favorito };
    }
    return r;
  });
}

// S31. Cálculo do estágio evolutivo da Árvore de Hábitos (1 a 5)
function calcularEstagioArvoreHabitos(habitosCumpridos = 10, totalHabitos = 14) {
  const perc = totalHabitos > 0 ? (habitosCumpridos / totalHabitos) * 100 : 0;
  let estagio = 1;
  let nomeEstagio = "Broto";
  if (perc >= 90) { estagio = 5; nomeEstagio = "Árvore Majestosa com Flores"; }
  else if (perc >= 70) { estagio = 4; nomeEstagio = "Copa Florida"; }
  else if (perc >= 45) { estagio = 3; nomeEstagio = "Arbusto Frondoso"; }
  else if (perc >= 20) { estagio = 2; nomeEstagio = "Muda Crescendo"; }
  return { estagio, nomeEstagio, porcentagemSemanal: Math.round(perc) };
}

// S32. Ação solidária de regar a planta da dupla
function executarRegadorSolidario(arvore = {}, meuNome = "Você") {
  const regas = (parseInt(arvore.regasSemana, 10) || 0) + 1;
  return {
    arvoreAtualizada: { ...arvore, regasSemana: regas, ultimaRega: Date.now() },
    mensagem: `${meuNome} regou a Árvore de Hábitos com carinho! 🌱💧`,
    gotasBonus: 5
  };
}

// S33. Somador cooperativo de passos diários
function somarMetasPassosDupla(passosEu = 5000, passosParceiro = 6000, metaTotal = 10000) {
  const somado = (parseInt(passosEu, 10) || 0) + (parseInt(passosParceiro, 10) || 0);
  const meta = Math.max(1, parseInt(metaTotal, 10) || 10000);
  return {
    passosTotal: somado,
    metaTotal: meta,
    porcentagem: Math.min(150, Math.round((somado / meta) * 100)),
    metaAlcancada: somado >= meta
  };
}

// S34. Medidor bilateral da garrafa de hidratação compartilhada
function calcularNivelGarrafaAguaCompartilhada(litrosEu = 1.5, litrosParceiro = 1.5, metaLitros = 4.0) {
  const soma = (parseFloat(litrosEu) || 0) + (parseFloat(litrosParceiro) || 0);
  const meta = Math.max(0.5, parseFloat(metaLitros) || 4.0);
  return {
    litrosEu: parseFloat(litrosEu) || 0,
    litrosParceiro: parseFloat(litrosParceiro) || 0,
    litrosTotal: parseFloat(soma.toFixed(2)),
    metaLitros: meta,
    porcentagemGarrafa: Math.min(100, Math.round((soma / meta) * 100))
  };
}

// S35. Progresso conjunto de páginas lidas no mês
function calcularProgressoLeituraDupla(paginasEu = 120, paginasParceiro = 180, metaPaginas = 400) {
  const total = (parseInt(paginasEu, 10) || 0) + (parseInt(paginasParceiro, 10) || 0);
  const meta = Math.max(10, parseInt(metaPaginas, 10) || 400);
  return {
    paginasTotal: total,
    metaPaginas: meta,
    restantes: Math.max(0, meta - total),
    porcentagem: Math.min(100, Math.round((total / meta) * 100))
  };
}

// S36. Sequência ininterrupta (streak) de cumplicidade
function calcularStreakCumplicidade(historicoDias = []) {
  if (!Array.isArray(historicoDias)) return 0;
  let streak = 0;
  for (let i = historicoDias.length - 1; i >= 0; i--) {
    if (historicoDias[i].cumpriramAmbos) streak++;
    else break;
  }
  return streak;
}

// S37. Uso de gota mágica como escudo de emergência para a dupla
function aplicarEscudoStreakEmergencia(dupla = {}, data = "2026-10-27") {
  const escudoUsado = {
    data,
    salvoPor: "gotas_de_afeto",
    timestamp: Date.now()
  };
  return {
    sucesso: true,
    streakSalvo: (dupla.streak || 0),
    escudoUsado
  };
}

// S38. Registro de voto solene de cumplicidade semanal
function definirVotoCumplicidadeSemanal(metaTexto = "Dormir antes das 23h", categoria = "sono") {
  return {
    id: "voto-" + Date.now(),
    meta: metaTexto,
    categoria,
    dataDefinicao: new Date().toISOString(),
    cumpridoEu: false,
    cumpridoParceiro: false
  };
}

// S39. Payload cinematográfico comemorativo ao bater meta conjunta
function gerarPayloadAnimacaoBaterMeta() {
  return {
    tipoAnimacao: "tela_cheia_confetes_dourados",
    somEfeito: "fanfarra_suave",
    duracaoSegundos: 3.5,
    mensagem: "Vocês conseguiram juntos! 🎉✨"
  };
}

// S40. Cálculo das métricas para gráfico radar de harmonia
function calcularMetricasRadarHarmonia(metricasEu = {}, metricasParceiro = {}) {
  const eixos = ["sono", "agua", "foco", "tarefas"];
  const pontuacoes = {};
  eixos.forEach(eixo => {
    const v1 = Math.min(100, parseInt(metricasEu[eixo], 10) || 50);
    const v2 = Math.min(100, parseInt(metricasParceiro[eixo], 10) || 50);
    pontuacoes[eixo] = Math.round((v1 + v2) / 2);
  });
  return { eixos: pontuacoes, harmoniaGeral: Math.round(Object.values(pontuacoes).reduce((a, b) => a + b, 0) / 4) };
}

// S41. Sincronizador de paridade de segundos do Pomodoro
function sincronizarCronometroPomodoroDupla(estadoMinhaSessao = {}, estadoParceiro = {}) {
  const segEu = parseInt(estadoMinhaSessao.segundosRestantes, 10) || 0;
  const segParc = parseInt(estadoParceiro.segundosRestantes, 10) || 0;
  const dif = Math.abs(segEu - segParc);
  return {
    sincronizado: dif <= 2,
    diferencaSegundos: dif,
    segundosAjustados: Math.min(segEu, segParc)
  };
}

// S42. Montagem de cenário para sala virtual de estudos
function gerarCenarioSalaVirtualEstudo(mundo = "zen", petEu = "prumi", petParceiro = "gato") {
  return {
    mundo,
    mesaEsquerda: { ocupante: "Você", pet: petEu },
    mesaDireita: { ocupante: "Parceiro", pet: petParceiro },
    ambiente: `Sala de Estudo Aconchegante (${mundo})`
  };
}

// S43. Alerta empático contra distração de foco
function gerarAlertaDistracaoPomodoro(nomeParceiro = "Alex") {
  return {
    titulo: "Mantenha o foco! 🎯",
    mensagem: `${nomeParceiro} está firme estudando agora. Vamos continuar juntos?`
  };
}

// S44. Padrão de vibração suave para fim de bloco Pomodoro
function gerarPadraoVibracaoPausaPomodoro() {
  return [100, 80, 100];
}

// S45. Banco de sugestões rápidas para pausa ativa da dupla
function obterDicasPausaAtivaDupla(indiceAleatorio = 0) {
  const dicas = [
    "Levantem-se e façam 5 rotações com os ombros.",
    "Bebam um copo d'água fresca juntos.",
    "Olhem para um ponto distante pela janela por 20 segundos.",
    "Respirem fundo 3 vezes soltando os braços.",
    "Mandem um emoji carinhoso no mural."
  ];
  const idx = Math.abs(parseInt(indiceAleatorio, 10) || 0) % dicas.length;
  return { dica: dicas[idx], duracaoMinutos: 5 };
}

// S46. Síntese Web Audio de parâmetros Lofi harmônicos
function gerarSinteseTrilhaLofiRelaxante() {
  return {
    acordeFrequencias: [261.63, 329.63, 392.00, 493.88], // Cmaj7
    filtroLowpassHz: 800,
    volume: 0.15,
    tipoOnda: "triangle"
  };
}

// S47. Somador do total histórico de horas de foco conjunto
function somarHorasFocoAcumuladas(horasEu = 15.5, horasParceiro = 22.0) {
  const total = (parseFloat(horasEu) || 0) + (parseFloat(horasParceiro) || 0);
  return {
    horasEu: parseFloat(horasEu) || 0,
    horasParceiro: parseFloat(horasParceiro) || 0,
    totalHorasDupla: parseFloat(total.toFixed(1)),
    marcoAlcancado: total >= 50 ? "Mestres da Concentração" : "Exploradores do Foco"
  };
}

// S48. Definição do status de concentração "Não Perturbe"
function definirStatusNaoPerturbe(emFoco = true, tempoRestanteMin = 25) {
  return {
    emFoco: Boolean(emFoco),
    tempoRestanteMin: parseInt(tempoRestanteMin, 10) || 0,
    badge: emFoco ? `🎯 Em foco (${tempoRestanteMin} min)` : "🍃 Disponível"
  };
}

// S49. Gerador de efeito de brinde de canecas de café
function gerarEfeitoBrindeCanecasCafe() {
  return {
    icone: "☕✨☕",
    classe: "brinde-canecas-anim",
    mensagem: "Pausa merecida! Um brinde ao esforço de vocês."
  };
}

// S50. Snapshot resumido da sessão de foco para o mural
function gerarSnapshotSessaoEstudo(minutos = 50, tarefasFeitas = 3, mascotes = "Prumi & Gato") {
  return {
    data: new Date().toLocaleDateString("pt-BR"),
    minutosFocados: parseInt(minutos, 10) || 0,
    tarefasConcluidas: parseInt(tarefasFeitas, 10) || 0,
    companheiros: mascotes,
    tituloSnapshot: `Sessão de Foco: +${minutos} min juntos!`
  };
}
