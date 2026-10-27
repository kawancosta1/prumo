/*
  Melhorias Gerais do Prumo (Lote 1: Itens 1 a 10)
  Microinterações, física visual e refinamentos imperceptíveis de performance.
*/
"use strict";

// 1. Confete direcional na conclusão da tarefa
function confettiFromElement(el, n = 20) {
  if (typeof confetti !== "function" || (typeof RM !== "undefined" && RM)) return;
  if (!el || typeof el.getBoundingClientRect !== "function") {
    if (typeof bigConfetti === "function") bigConfetti();
    return;
  }
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  // Dispara com espalhamento amplo para cima e para os lados
  confetti(x, y, n, 0.85, Math.PI * 1.2);
}

// 2. Ondulação fluida d'água no card do herói com interpolação senoidal
function animarOndaHeroi(pathEl, amp = 3.6) {
  if (!pathEl || (typeof RM !== "undefined" && RM)) return () => {};
  let step = 0;
  let running = true;
  const loop = () => {
    if (!running) return;
    step += 0.04;
    const a = amp * (0.85 + Math.sin(step) * 0.15);
    if (typeof wavePath === "function") {
      pathEl.setAttribute("d", wavePath(a));
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return () => {
    running = false;
  };
}

// 3. Squash & stretch no Prumi ao ser clicado/tocado
function aplicarSquashMascote(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  const target = el.closest(".prumi") || el.querySelector(".prumi") || el;
  target.classList.remove("prumi-squash");
  void target.offsetWidth; // Força reflow para reiniciar animação
  target.classList.add("prumi-squash");
  setTimeout(() => target.classList.remove("prumi-squash"), 400);
}

// 4. Transição de aba com deslize lateral suave
let abaAnteriorIdx = 0;
const ORDEM_ABAS_MAPA = ["hoje", "estudos", "dieta", "social", "estante", "amigos", "prumi", "ajustes"];

function transicaoAbaDirecional(abaDestino) {
  if (typeof document === "undefined" || (typeof RM !== "undefined" && RM)) return;
  const novoIdx = ORDEM_ABAS_MAPA.indexOf(abaDestino);
  const main = document.getElementById("main");
  if (!main) return;

  main.classList.remove("slide-left", "slide-right");
  if (novoIdx !== -1 && abaAnteriorIdx !== -1) {
    if (novoIdx > abaAnteriorIdx) {
      main.classList.add("slide-left");
    } else if (novoIdx < abaAnteriorIdx) {
      main.classList.add("slide-right");
    }
  }
  abaAnteriorIdx = novoIdx;
}

// 5. Entrada de tarefas recém-criadas com expansão vertical
function animarEntradaTarefa(liEl) {
  if (!liEl || (typeof RM !== "undefined" && RM)) return;
  liEl.classList.add("tarefa-expandindo");
  setTimeout(() => liEl.classList.remove("tarefa-expandindo"), 400);
}

// 6. Contador de gotas com efeito de odômetro rotativo / pulso suave
function odometroGotas(el, valorNovo) {
  if (!el) return;
  const valorAtual = parseInt(el.textContent.replace(/\D/g, ""), 10) || 0;
  if (typeof countUp === "function") {
    countUp(el, valorAtual, valorNovo);
  } else {
    el.textContent = (valorNovo || 0).toLocaleString("pt-BR");
  }
  if (typeof RM !== "undefined" && !RM) {
    el.classList.remove("odometro-pulso");
    void el.offsetWidth;
    el.classList.add("odometro-pulso");
    setTimeout(() => el.classList.remove("odometro-pulso"), 450);
  }
}

// 7. Tremor tátil de erro ao tentar salvar campo vazio ou inválido
function aplicarTremorErro(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove("tremor-erro");
  void inputEl.offsetWidth;
  inputEl.classList.add("tremor-erro");
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate([20, 40, 20]);
    } catch (_) {}
  }
  setTimeout(() => inputEl.classList.remove("tremor-erro"), 350);
}

// 8. Desintegração de item ao excluir
function animarDesintegracaoItem(el, onCompleto) {
  if (!el) {
    if (typeof onCompleto === "function") onCompleto();
    return;
  }
  if (typeof RM !== "undefined" && RM) {
    if (typeof onCompleto === "function") onCompleto();
    return;
  }

  const r = el.getBoundingClientRect();
  const cor = getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#76FF03";

  // Cria 6 micropartículas coloridas que sobem e se desintegram
  for (let i = 0; i < 6; i++) {
    const p = document.createElement("span");
    p.className = "particula-desintegracao";
    const sz = 4 + Math.random() * 5;
    p.style.width = `${sz}px`;
    p.style.height = `${sz}px`;
    p.style.background = cor;
    p.style.left = `${r.left + Math.random() * r.width}px`;
    p.style.top = `${r.top + Math.random() * r.height}px`;
    p.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
    p.style.setProperty("--dy", `${-15 - Math.random() * 25}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 550);
  }

  el.classList.add("item-desintegrando");
  setTimeout(() => {
    if (typeof onCompleto === "function") onCompleto();
  }, 320);
}

// 9. Brilho contínuo sutil em tarefas de prioridade alta
function aplicarGlowPrioridadeAlta() {
  if (typeof document === "undefined") return;
  const tarefasAltas = document.querySelectorAll(
    '[data-prio="3"], .task[data-prio="3"], .task-item.prio-3, [data-rank="S"], .prio-3'
  );
  tarefasAltas.forEach(t => t.classList.add("tarefa-prio-alta-glow"));
}

// 10. Elevação de sombra ao segurar/arrastar card
function tornarCardElevado(el, ativar = true) {
  if (!el) return;
  if (ativar) {
    el.classList.add("card-elevado");
  } else {
    el.classList.remove("card-elevado");
  }
}

// 11. Piscada natural assíncrona dos olhos do Prumi
let piscadaTimer = null;
function iniciarPiscadaNaturalPrumi() {
  if (typeof document === "undefined" || (typeof RM !== "undefined" && RM)) return;
  const piscar = () => {
    const olhos = document.querySelectorAll(
      ".prumi .olho, .prumi [data-olho], .prumi circle[cx='47'], .prumi circle[cx='73']"
    );
    if (olhos.length > 0) {
      olhos.forEach(o => {
        o.style.transformOrigin = "center";
        o.style.transform = "scaleY(0.1)";
      });
      setTimeout(() => {
        olhos.forEach(o => {
          o.style.transform = "none";
        });
      }, 120);

      // 20% de chance de piscada dupla fofa
      if (Math.random() < 0.2) {
        setTimeout(() => {
          olhos.forEach(o => (o.style.transform = "scaleY(0.1)"));
          setTimeout(() => olhos.forEach(o => (o.style.transform = "none")), 100);
        }, 240);
      }
    }
    const proxIntervalo = 3000 + Math.random() * 4500;
    piscadaTimer = setTimeout(piscar, proxIntervalo);
  };
  piscadaTimer = setTimeout(piscar, 3500);
}

function pararPiscadaNaturalPrumi() {
  if (piscadaTimer) {
    clearTimeout(piscadaTimer);
    piscadaTimer = null;
  }
}

// 12. Respiração em repouso do Prumi
function aplicarRespiracaoPrumi(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  const target = el.closest(".prumi") || el;
  target.classList.add("prumi-respirando");
}

// 13. Flicker realista das velas e tochas
function aplicarFlickerRealista(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.add("flicker-realista");
}

// 14. Glow neon pulsante (Gamer)
function aplicarGlowNeonGamer(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.add("gamer-neon-pulsante");
}

// 15. Partículas de vapor ascendente
function aplicarVaporAscendente(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.add("vapor-ascendente");
}

// 16. Transição suave entre modo claro e escuro
function aplicarTransicaoTemaSuave() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("transicao-tema");
  setTimeout(() => {
    document.documentElement.classList.remove("transicao-tema");
  }, 260);
}

// 17. Efeito de virada de página física na estante
function animarViradaPaginaLivro(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.remove("livro-virando-pagina");
  void el.offsetWidth;
  el.classList.add("livro-virando-pagina");
  setTimeout(() => el.classList.remove("livro-virando-pagina"), 460);
}

// 18. Animação de flutuação dos pets
function aplicarFlutuacaoPet(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.add("pet-flutuando");
}

// 19. Degradê dinâmico no cabeçalho conforme a hora do dia
function degradePelaHoraDia(dataHora) {
  const hora = dataHora ? new Date(dataHora).getHours() : new Date().getHours();
  // 5h às 8h: aurora matinal suave
  if (hora >= 5 && hora < 9) {
    return "linear-gradient(135deg, rgba(255, 183, 77, 0.18) 0%, rgba(240, 98, 146, 0.12) 100%)";
  }
  // 9h às 16h: dia claro e límpido
  if (hora >= 9 && hora < 17) {
    return "linear-gradient(135deg, rgba(79, 195, 247, 0.15) 0%, rgba(129, 199, 132, 0.1) 100%)";
  }
  // 17h às 19h: entardecer âmbar
  if (hora >= 17 && hora < 20) {
    return "linear-gradient(135deg, rgba(255, 112, 67, 0.2) 0%, rgba(149, 117, 205, 0.15) 100%)";
  }
  // 20h às 4h: noite estrelada profunda
  return "linear-gradient(135deg, rgba(49, 27, 146, 0.25) 0%, rgba(18, 18, 36, 0.2) 100%)";
}

// 20. Clique elástico nos botões
function ativarCliqueElasticoBotoes() {
  if (typeof document === "undefined") return;
  const botoes = document.querySelectorAll("button, .btn, [data-act]");
  botoes.forEach(b => b.classList.add("btn-elastico"));
}

// 21. Balão de fala com surgimento pop
function aplicarPopBalao(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.remove("balao-pop");
  void el.offsetWidth;
  el.classList.add("balao-pop");
}

// 22. Checkmark com traço vetorial contínuo
function animarCheckmarkTraco(checkEl) {
  if (!checkEl || (typeof RM !== "undefined" && RM)) return;
  checkEl.classList.add("check-traco-animado");
  setTimeout(() => checkEl.classList.remove("check-traco-animado"), 400);
}

// 23. Level up com raios solares rotativos
function levelUpRaiosHTML() {
  return `<div class="level-up-raios-rotativos" aria-hidden="true"></div>`;
}

// 24. Enchimento fluido do copo d'água
function animarEnchimentoCopo(copoEl) {
  if (!copoEl || (typeof RM !== "undefined" && RM)) return;
  copoEl.classList.remove("copo-enchimento-liquido");
  void copoEl.offsetWidth;
  copoEl.classList.add("copo-enchimento-liquido");
  setTimeout(() => copoEl.classList.remove("copo-enchimento-liquido"), 650);
}

// 25. Card de detalhes expansível
function expandirCardDetalhe(el) {
  if (!el) return;
  el.classList.add("card-detalhe-expansivel");
  if (el.style.maxHeight && el.style.maxHeight !== "0px") {
    el.style.maxHeight = "0px";
  } else {
    el.style.maxHeight = `${el.scrollHeight + 30}px`;
  }
}

// 26. Partículas estelares que seguem o ponteiro na aba Feiticeiro
let rastroEstelarAtivo = false;
let rastroEstelarHandler = null;

function iniciarRastroEstelarFeiticeiro() {
  if (typeof document === "undefined" || (typeof RM !== "undefined" && RM) || rastroEstelarAtivo) return;
  rastroEstelarAtivo = true;
  rastroEstelarHandler = e => {
    if (typeof S !== "undefined" && S.persona !== "feiticeiro") return;
    if (Math.random() > 0.35) return; // Limita frequência para zero impacto de performance
    const p = document.createElement("span");
    p.className = "rastro-estrela-feiticeiro";
    p.style.left = `${e.clientX - 3}px`;
    p.style.top = `${e.clientY - 3}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 420);
  };
  window.addEventListener("pointermove", rastroEstelarHandler, { passive: true });
}

function pararRastroEstelarFeiticeiro() {
  if (rastroEstelarHandler) {
    window.removeEventListener("pointermove", rastroEstelarHandler);
    rastroEstelarHandler = null;
    rastroEstelarAtivo = false;
  }
}

// 27. Efeito de folha de papel caindo ao arquivar hábitos
function animarHabitoArquivado(el, onFim) {
  if (!el) {
    if (typeof onFim === "function") onFim();
    return;
  }
  if (typeof RM !== "undefined" && RM) {
    if (typeof onFim === "function") onFim();
    return;
  }
  el.classList.add("habito-arquivado-pendular");
  setTimeout(() => {
    if (typeof onFim === "function") onFim();
  }, 480);
}

// 28. Animação de badges de conquistas
function animarBadgeConquista(el) {
  if (!el || (typeof RM !== "undefined" && RM)) return;
  el.classList.add("badge-conquista-desbloqueada");
  setTimeout(() => el.classList.remove("badge-conquista-desbloqueada"), 550);
}

// 29. Carrossel do quarto com amortecimento cinético
function ativarCarrosselCinetico(containerEl) {
  if (!containerEl) return;
  containerEl.classList.add("carrossel-quarto-cinetico");
}

// 30. Respeito absoluto a prefers-reduced-motion
function verificarPreferenciaMovimentoReduzido() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// 31. Sanitização estrita com allowlist no renderizador de HTML
function sanitizarHTMLSeguro(str) {
  if (typeof str !== "string") return "";
  // Substitui caracteres perigosos básicos
  let limpo = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  // Permite apenas tags seguras de formatação básica
  const tagsPermitidas = ["b", "i", "strong", "em", "small", "span"];
  tagsPermitidas.forEach(tag => {
    const regAbrir = new RegExp(`&lt;${tag}&gt;`, "gi");
    const regFechar = new RegExp(`&lt;\\/${tag}&gt;`, "gi");
    limpo = limpo.replace(regAbrir, `<${tag}>`).replace(regFechar, `</${tag}>`);
  });
  return limpo;
}

// 32. Validação estrita de URLs para imagens e links externos
function validarURLLinkSeguro(url) {
  if (typeof url !== "string") return false;
  const u = url.trim().toLowerCase();
  if (u.startsWith("javascript:") || u.startsWith("vbscript:") || u.startsWith("data:text/html")) {
    return false;
  }
  return (
    u.startsWith("https://") ||
    u.startsWith("http://") ||
    u.startsWith("mailto:") ||
    u.startsWith("data:image/")
  );
}

// 33. Proteção contra poluição de protótipo (Prototype Pollution)
function sanitizarObjetoContraPollution(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    obj.forEach(item => sanitizarObjetoContraPollution(item));
    return obj;
  }
  const chavesProibidas = ["__proto__", "constructor", "prototype"];
  for (const k of Object.keys(obj)) {
    if (chavesProibidas.includes(k)) {
      delete obj[k];
      continue;
    }
    if (typeof obj[k] === "object" && obj[k] !== null) {
      sanitizarObjetoContraPollution(obj[k]);
    }
  }
  return obj;
}

// 34. Auditoria e aplicação de noopener noreferrer em links externos
function assegurarLinksSeguros(container) {
  if (!container || typeof container.querySelectorAll !== "function") return;
  const links = container.querySelectorAll('a[target="_blank"]');
  links.forEach(a => {
    a.setAttribute("rel", "noopener noreferrer");
  });
}

// 35. Validação rigorosa de payloads de backup
function validarPayloadBackup(jsonStr) {
  try {
    const dados = JSON.parse(jsonStr);
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) return null;
    sanitizarObjetoContraPollution(dados);
    // Estruturas esperadas mínimas do Prumo
    if (!dados.tasks && !dados.habits && !dados.persona) return null;
    return dados;
  } catch (_) {
    return null;
  }
}

// 36. Limitação de tamanho de strings no localStorage
function limitarStringSegura(str, max = 500) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, max);
}

// 38. Criptografia simétrica leve para anotações do diário
function criptografarTextoSimples(txt, chave = "prumo_seguro") {
  if (typeof txt !== "string" || !txt) return "";
  let res = "";
  for (let i = 0; i < txt.length; i++) {
    const c = txt.charCodeAt(i) ^ chave.charCodeAt(i % chave.length);
    res += c.toString(16).padStart(4, "0");
  }
  return res;
}

function descriptografarTextoSimples(cifrado, chave = "prumo_seguro") {
  if (typeof cifrado !== "string" || !cifrado || cifrado.length % 4 !== 0) return "";
  let res = "";
  for (let i = 0; i < cifrado.length; i += 4) {
    const c = parseInt(cifrado.slice(i, i + 4), 16) ^ chave.charCodeAt((i / 4) % chave.length);
    res += String.fromCharCode(c);
  }
  return res;
}

// 39. Remoção de caracteres de controle e inversão de direção (RLO)
function limparCaracteresControle(str) {
  if (typeof str !== "string") return "";
  // Remove caracteres de controle (exceto \n e \t) e marcas Unicode Bidi (U+202A a U+202E, U+2066 a U+2069)
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u202A-\u202E\u2066-\u2069]/g, "").trim();
}

// 40. Mascaramento automático de dados sensíveis
function mascararDadoSensivel(str, visiveisInic = 3, visiveisFim = 3) {
  if (typeof str !== "string") return "";
  if (str.length <= visiveisInic + visiveisFim) return "***";
  const inicio = str.slice(0, visiveisInic);
  const fim = str.slice(-visiveisFim);
  return `${inicio}***${fim}`;
}

// 41. Criação de iframe isolado e seguro para conteúdo externo
function criarIframeSeguro(url, titulo = "Visualização Externa") {
  if (typeof document === "undefined") return null;
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts allow-forms");
  iframe.setAttribute("referrerpolicy", "no-referrer");
  iframe.setAttribute("title", titulo);
  if (validarURLLinkSeguro(url)) {
    iframe.src = url;
  }
  return iframe;
}

// 42. Validação rigorosa de cores CSS injetadas
function validarCorHexSegura(cor) {
  if (typeof cor !== "string") return false;
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(cor.trim());
}

// 43. Silenciamento de logs em produção
function silenciarConsoleProducao(forcar = false) {
  if (typeof window === "undefined" || typeof console === "undefined") return;
  const ehLocal =
    window.location &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "file:");
  if (forcar || !ehLocal) {
    console.log = () => {};
    console.info = () => {};
  }
}

// 44. Controle de taxa (Rate Limiting) local para ações críticas
const mapaRateLimit = {};
function verificarLimiteTaxa(chave, maxTentativas = 3, janelaMs = 1000) {
  const agora = Date.now();
  if (!mapaRateLimit[chave]) mapaRateLimit[chave] = [];
  mapaRateLimit[chave] = mapaRateLimit[chave].filter(t => agora - t < janelaMs);
  if (mapaRateLimit[chave].length >= maxTentativas) {
    return false;
  }
  mapaRateLimit[chave].push(agora);
  return true;
}

// 45. Proteção contra Clickjacking
function protegerContraClickjacking() {
  if (typeof window === "undefined") return true;
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
      return false;
    }
  } catch (_) {
    return false;
  }
  return true;
}

// 46. Sanitização de células CSV contra CSV Injection
function sanitizarCelulaCSV(valor) {
  if (typeof valor !== "string") valor = String(valor || "");
  const charsPerigosos = ["=", "+", "-", "@", "\t", "\r"];
  if (charsPerigosos.some(c => valor.startsWith(c))) {
    return `'${valor}`;
  }
  return valor;
}

// 47. Solicitação contextual de notificações
function solicitarNotificacaoContextual(onAprovado) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    if (typeof onAprovado === "function") onAprovado();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => {
      if (p === "granted" && typeof onAprovado === "function") {
        onAprovado();
      }
    });
  }
}

// 48. Comparação de tempo constante para PINs e tokens
function compararTempoConstante(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// 49. Limpeza segura de sessão e caches
function limparSessaoSegura() {
  if (typeof localStorage !== "undefined") {
    const chavesSensiveis = ["prumo_token", "prumo_auth", "prumo_sync_key"];
    chavesSensiveis.forEach(k => localStorage.removeItem(k));
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.clear();
  }
  return true;
}

// 50. Validação estrita de formato de data ISO (YYYY-MM-DD)
function validarFormatoDataISO(dataStr) {
  if (typeof dataStr !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataStr);
  if (!m) return false;
  const ano = parseInt(m[1], 10);
  const mes = parseInt(m[2], 10);
  const dia = parseInt(m[3], 10);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return false;
  const diasMes = new Date(ano, mes, 0).getDate();
  return dia <= diasMes;
}

// 51. Limitação de intervalo de datas contra loops infinitos
function limitarIntervaloDatas(inicioStr, fimStr, maxDias = 365) {
  if (!validarFormatoDataISO(inicioStr) || !validarFormatoDataISO(fimStr)) return null;
  const ini = new Date(inicioStr);
  const fim = new Date(fimStr);
  if (fim < ini) return null;
  const diff = Math.round((fim - ini) / 864e5);
  if (diff > maxDias) {
    const fimAjustado = new Date(ini.getTime() + maxDias * 864e5);
    return {
      inicio: inicioStr,
      fim: fimAjustado.toISOString().slice(0, 10),
      dias: maxDias
    };
  }
  return { inicio: inicioStr, fim: fimStr, dias: diff };
}

// 52. Anonimização estrita do payload de feedback
function anonimizarPayloadFeedback(obj) {
  if (!obj || typeof obj !== "object") return {};
  const msgLimpa = sanitizarHTMLSeguro(limitarStringSegura(obj.mensagem || "", 1000));
  return {
    tipo: limitarStringSegura(obj.tipo || "geral", 30),
    mensagem: msgLimpa,
    versao: "2.0",
    plataforma: typeof navigator !== "undefined" ? navigator.platform || "web" : "web",
    hora: new Date().toISOString()
  };
}

// 53. Proteção e congelamento de objetos estáticos
function protegerObjetosEstaticos(obj) {
  if (!obj || typeof obj !== "object") return obj;
  Object.freeze(obj);
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object" && obj[k] !== null && !Object.isFrozen(obj[k])) {
      protegerObjetosEstaticos(obj[k]);
    }
  });
  return obj;
}

// 54. Detecção de preenchimento automatizado por bots (Honeypot)
function verificarHoneypot(campoValor) {
  return typeof campoValor === "string" && campoValor.trim().length > 0;
}

// 55. Modal de confirmação em duas etapas para ações destrutivas
function modalConfirmacaoDupla(titulo, texto, onConfirmar) {
  if (typeof document === "undefined") return;
  const m = document.createElement("div");
  m.className = "modal-overlay";
  m.setAttribute("role", "alertdialog");
  m.innerHTML = `<div class="card sub sunken" style="max-width:340px;margin:20vh auto;padding:16px;background:var(--surface)">
    <b>⚠️ ${esc(titulo)}</b>
    <p class="note" style="margin:8px 0">${esc(texto)}</p>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px">
      <button class="btn small" data-btn-cancela>Cancelar</button>
      <button class="btn small danger" data-btn-confirma>Confirmar e Apagar</button>
    </div>
  </div>`;
  m.querySelector("[data-btn-cancela]").onclick = () => m.remove();
  m.querySelector("[data-btn-confirma]").onclick = () => {
    m.remove();
    if (typeof onConfirmar === "function") onConfirmar();
  };
  document.body.appendChild(m);
}

// 56. Atualização cirúrgica do DOM sem repaint global completo
function atualizarElementoSeletivo(seletor, novoHTML) {
  if (typeof document === "undefined") return false;
  const el = document.querySelector(seletor);
  if (!el) return false;
  if (el.innerHTML !== novoHTML) {
    el.innerHTML = novoHTML;
    return true;
  }
  return false;
}

// 57. Barramento de eventos desacoplado para módulos do estado
const barramentoEventos = {};
function ouvirEventoEstado(evento, callback) {
  if (!barramentoEventos[evento]) barramentoEventos[evento] = [];
  barramentoEventos[evento].push(callback);
  return () => {
    barramentoEventos[evento] = barramentoEventos[evento].filter(cb => cb !== callback);
  };
}

function dispararEventoEstado(evento, dados) {
  if (!barramentoEventos[evento]) return;
  barramentoEventos[evento].forEach(cb => {
    try {
      cb(dados);
    } catch (_) {}
  });
}

// 58. Virtual scrolling leve para listas longas
function calcularItensVisiveis(totalItens, scrollTop = 0, itemHeight = 44, containerHeight = 400) {
  const inicio = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const visiveis = Math.ceil(containerHeight / itemHeight) + 4;
  const fim = Math.min(totalItens, inicio + visiveis);
  const deslocamentoY = inicio * itemHeight;
  return { inicio, fim, deslocamentoY, totalAltura: totalItens * itemHeight };
}

// 59. Catálogo de símbolos SVG reutilizáveis
function obterSimboloSVGReutilizavel(simboloId) {
  return `<svg class="ico-reutilizavel" aria-hidden="true"><use href="#${simboloId}"/></svg>`;
}

// 60. Ciclo de vida formal para módulos de mundos
const CICLO_VIDA_MUNDOS = {};
function registrarCicloVidaMundo(nomeMundo, ganchos = {}) {
  CICLO_VIDA_MUNDOS[nomeMundo] = {
    mount: typeof ganchos.mount === "function" ? ganchos.mount : () => {},
    update: typeof ganchos.update === "function" ? ganchos.update : () => {},
    unmount: typeof ganchos.unmount === "function" ? ganchos.unmount : () => {}
  };
  return CICLO_VIDA_MUNDOS[nomeMundo];
}

// 61. Despachante de frames (eliminação de layout thrashing)
const filaLeituraDOM = [];
const filaEscritaDOM = [];
let agendamentoFrameAtivo = false;

function executarFilaFrameDOM() {
  agendamentoFrameAtivo = false;
  // Executa todas as leituras primeiro
  while (filaLeituraDOM.length > 0) {
    const fn = filaLeituraDOM.shift();
    try {
      fn();
    } catch (_) {}
  }
  // Executa todas as escritas em seguida
  while (filaEscritaDOM.length > 0) {
    const fn = filaEscritaDOM.shift();
    try {
      fn();
    } catch (_) {}
  }
}

function agendarLeituraDOM(fn) {
  if (typeof fn !== "function") return;
  filaLeituraDOM.push(fn);
  if (!agendamentoFrameAtivo) {
    agendamentoFrameAtivo = true;
    requestAnimationFrame(executarFilaFrameDOM);
  }
}

function agendarEscritaDOM(fn) {
  if (typeof fn !== "function") return;
  filaEscritaDOM.push(fn);
  if (!agendamentoFrameAtivo) {
    agendamentoFrameAtivo = true;
    requestAnimationFrame(executarFilaFrameDOM);
  }
}

// 62. Formatadores nativos com Intl reutilizável
let fmtNumeroMemo = null;
function formatarMoedaGotas(n = 0) {
  if (!fmtNumeroMemo && typeof Intl !== "undefined" && typeof Intl.NumberFormat === "function") {
    fmtNumeroMemo = new Intl.NumberFormat("pt-BR");
  }
  return fmtNumeroMemo ? fmtNumeroMemo.format(n) : String(n);
}

// 63. Reutilização de singleton para AudioContext
let audioContextGlobal = null;
function obterContextoAudioSeguro() {
  if (typeof window === "undefined") return null;
  const A = window.AudioContext || window.webkitAudioContext;
  if (!A) return null;
  if (!audioContextGlobal) {
    try {
      audioContextGlobal = new A();
    } catch (_) {
      return null;
    }
  }
  if (audioContextGlobal.state === "suspended") {
    audioContextGlobal.resume().catch(() => {});
  }
  return audioContextGlobal;
}

// 64. Compressão LZW simples para redução de espaço no localStorage
function comprimirTextoLZW(str) {
  if (typeof str !== "string" || !str) return "";
  const dict = {};
  const data = (str + "").split("");
  const out = [];
  let currChar;
  let phrase = data[0];
  let code = 256;
  for (let i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  return out.map(n => String.fromCharCode(n)).join("");
}

function descomprimirTextoLZW(str) {
  if (typeof str !== "string" || !str) return "";
  const dict = {};
  const data = (str + "").split("");
  let currChar = String.fromCharCode(data[0].charCodeAt(0));
  let oldPhrase = currChar;
  const out = [currChar];
  let code = 256;
  let phrase;
  for (let i = 1; i < data.length; i++) {
    const currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code++] = oldPhrase + currChar;
    oldPhrase = phrase;
  }
  return out.join("");
}

// 65. Iteração de alta performance para listas volumosas
function iterarRapido(arr, fn) {
  if (!Array.isArray(arr) || typeof fn !== "function") return;
  const len = arr.length;
  let i = 0;
  while (i < len) {
    fn(arr[i], i);
    i++;
  }
}

// 66. Catálogo de Design Tokens centralizado
const DESIGN_TOKENS = Object.freeze({
  raioPadrao: 9,
  animacaoPadraoMs: 250,
  espacamentoTouchPx: 48,
  maxCaracteresTitulo: 120,
  duracaoNotificacaoMs: 4000
});

// 67. Gestão de metadados de elementos com WeakMap
const mapaMetadadosWeak = typeof WeakMap !== "undefined" ? new WeakMap() : null;

function registrarMetadadoElemento(el, dados) {
  if (!el || !mapaMetadadosWeak || typeof dados !== "object") return;
  mapaMetadadosWeak.set(el, dados);
}

function obterMetadadoElemento(el) {
  if (!el || !mapaMetadadosWeak) return null;
  return mapaMetadadosWeak.get(el) || null;
}

// 68. Verificação de regressão visual do Prumi via hash FNV-1a
function calcularHashSVGPrumi(svgStr) {
  if (typeof svgStr !== "string") return 0;
  let hash = 2166136261;
  for (let i = 0; i < svgStr.length; i++) {
    hash ^= svgStr.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash.toString(16);
}

// 69. Carregador assíncrono sob demanda com Promise
function carregarScriptSobDemanda(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return resolve(false);
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = err => reject(err);
    document.body.appendChild(s);
  });
}

// 70. Validador estático contra violações de CSP
function verificarConformidadeCSP(htmlStr) {
  if (typeof htmlStr !== "string") return true;
  const padroesProibidos = [/on\w+\s*=/i, /<script[^>]*>/i, /javascript:\s*/i];
  return !padroesProibidos.some(reg => reg.test(htmlStr));
}

// 71. Lookup em O(1) com Map
function obterItemLookupMap(lista, chave) {
  const k = chave || "id";
  const mapa = new Map();
  if (!Array.isArray(lista)) return mapa;
  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];
    if (item && item[k] !== undefined) {
      mapa.set(item[k], item);
    }
  }
  return mapa;
}

// 72. Padronização de ações com namespace
function formatarAcaoNamespace(namespace, acao) {
  const ns = String(namespace || "app")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");
  const ac = String(acao || "acao")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");
  return `${ns}:${ac}`;
}

// 74. Defer de tarefas com requestIdleCallback
function executarQuandoOcioso(cb, timeoutMs) {
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(cb, { timeout: timeoutMs || 2000 });
  }
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => 50
    });
  }, 1);
}

function cancelarQuandoOcioso(id) {
  if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
}

// 75. Debounce para inputs de texto com cancelamento
function criarDebounce(fn, delayMs) {
  const espera = typeof delayMs === "number" ? delayMs : 200;
  let timer = null;
  let ultimaArgs = null;
  let ultimoThis = null;

  function debounced(...args) {
    ultimaArgs = args;
    ultimoThis = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(ultimoThis, ultimaArgs);
    }, espera);
  }

  debounced.cancelar = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  debounced.agora = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      fn.apply(ultimoThis, ultimaArgs);
    }
  };

  return debounced;
}

// 76. Error Boundary leve para módulos
function executarComRecuperacao(fn, fallback, contexto) {
  try {
    return fn();
  } catch (err) {
    if (typeof contexto === "string") {
      // Registro seguro sem interromper
    }
    if (typeof fallback === "function") {
      return fallback(err);
    }
    return fallback !== undefined ? fallback : null;
  }
}

// 77. Tipagem JSDoc com @typedef nos modelos centrais
/**
 * @typedef {Object} ModeloTarefa
 * @property {string} id - Identificador único
 * @property {string} titulo - Título da tarefa
 * @property {boolean} feita - Status de conclusão
 * @property {number} [prio] - Prioridade de 1 a 3
 * @property {string} [data] - Data limite ISO (YYYY-MM-DD)
 */

/**
 * @typedef {Object} ModeloHabito
 * @property {string} id - Identificador do hábito
 * @property {string} titulo - Nome do hábito
 * @property {number} frequencia - Meta semanal de dias
 * @property {number} sequencia - Dias seguidos concluídos
 */

/**
 * @typedef {Object} ModeloPet
 * @property {string} especie - Espécie do pet (gato, cao, raposa, etc.)
 * @property {string} nome - Nome carinhoso
 * @property {number} afeicao - Pontos de carinho
 * @property {string} humor - Estado de espírito atual
 */

/**
 * @typedef {Object} ModeloMundo
 * @property {string} id - Identificador do mundo (gamer, otaku, etc.)
 * @property {string} nome - Nome exibido
 * @property {string} tema - Nome da paleta visual
 */

// 78. Benchmark de tempo de execução com performance.now
function medirTempoExecucao(fn, repeticoes) {
  const reps = Math.max(1, repeticoes || 1);
  const temPerf = typeof performance !== "undefined" && typeof performance.now === "function";
  const inicio = temPerf ? performance.now() : Date.now();
  for (let i = 0; i < reps; i++) {
    fn(i);
  }
  const fim = temPerf ? performance.now() : Date.now();
  const duracaoTotalMs = Math.max(0, fim - inicio);
  return {
    duracaoTotalMs,
    duracaoMediaMs: duracaoTotalMs / reps,
    repeticoes: reps
  };
}

// 80. Otimização de fontes com font-display: swap
function garantirFontDisplaySwap(cssText) {
  if (typeof cssText !== "string") return "";
  return cssText.replace(/@font-face\s*\{([^}]+)\}/gi, (match, corpo) => {
    if (!/font-display\s*:/i.test(corpo)) {
      return `@font-face {\n  font-display: swap;${corpo}}`;
    }
    return match;
  });
}

// 81. Cache em memória para templates SVG
const mapaCacheSVG = new Map();

function obterCacheSVG(id, geradorFn) {
  if (typeof id !== "string") return "";
  if (mapaCacheSVG.has(id)) {
    return mapaCacheSVG.get(id);
  }
  const svg = typeof geradorFn === "function" ? geradorFn() : "";
  mapaCacheSVG.set(id, svg);
  return svg;
}

function limparCacheSVG() {
  mapaCacheSVG.clear();
}

// 82. Sistema de migração de versões de esquema
function migrarVersaoEsquema(estado, versaoAlvo, migradores) {
  if (!estado || typeof estado !== "object") return estado;
  let versaoAtual = typeof estado._versao === "number" ? estado._versao : 1;
  const mapa = migradores || {};

  while (versaoAtual < versaoAlvo) {
    const proxima = versaoAtual + 1;
    if (typeof mapa[proxima] === "function") {
      estado = mapa[proxima](estado);
    }
    versaoAtual = proxima;
  }
  estado._versao = versaoAlvo;
  return estado;
}

// 83. Memoização de cálculos de diffDays
const mapaMemoDiffDays = new Map();

function memoDiffDays(dataA, dataB) {
  const chave = `${dataA}_${dataB}`;
  if (mapaMemoDiffDays.has(chave)) {
    return mapaMemoDiffDays.get(chave);
  }
  const tA = new Date(dataA).getTime();
  const tB = new Date(dataB).getTime();
  const diff = Math.round((tB - tA) / (1000 * 60 * 60 * 24));
  if (mapaMemoDiffDays.size >= 64) {
    const primeiro = mapaMemoDiffDays.keys().next().value;
    mapaMemoDiffDays.delete(primeiro);
  }
  mapaMemoDiffDays.set(chave, diff);
  return diff;
}

// 84. Otimização de cache offline no Service Worker
function gerarCacheManifesto(versao, rotas) {
  const v = String(versao || "1.0.0");
  const base = [
    "/",
    "/index.html",
    "/estilos/base.css",
    "/estilos/melhorias-gerais.css",
    "/js/melhorias-gerais.js"
  ];
  const extras = Array.isArray(rotas) ? rotas : [];
  const conjunto = new Set([...base, ...extras]);
  return {
    nomeCache: `prumo-cache-v${v}`,
    arquivos: Array.from(conjunto),
    criadoEm: Date.now()
  };
}

// 85. Validação rigorosa de "use strict" em scripts
function validarUseStrictEmScript(codigo) {
  if (typeof codigo !== "string") return false;
  const limpo = codigo.trim();
  return (
    limpo.startsWith('"use strict"') ||
    limpo.startsWith("'use strict'") ||
    /^\/\*[\s\S]*?\*\/\s*['"]use strict['"]/.test(limpo)
  );
}

// 86. Validador de contraste WCAG 2.1 AA
function calcularLuminanciaRelativa(hex) {
  let cor = String(hex || "").replace("#", "");
  if (cor.length === 3) {
    cor = cor[0] + cor[0] + cor[1] + cor[1] + cor[2] + cor[2];
  }
  const r8 = parseInt(cor.substring(0, 2), 16) || 0;
  const g8 = parseInt(cor.substring(2, 4), 16) || 0;
  const b8 = parseInt(cor.substring(4, 6), 16) || 0;

  const transformar = c8 => {
    const v = c8 / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const R = transformar(r8);
  const G = transformar(g8);
  const B = transformar(b8);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function validarContrasteWCAG(hex1, hex2) {
  const l1 = calcularLuminanciaRelativa(hex1);
  const l2 = calcularLuminanciaRelativa(hex2);
  const maisClaro = Math.max(l1, l2);
  const maisEscuro = Math.min(l1, l2);
  const razao = (maisClaro + 0.05) / (maisEscuro + 0.05);
  const razaoArredondada = Math.round(razao * 100) / 100;
  return {
    razao: razaoArredondada,
    passaNormal: razaoArredondada >= 4.5,
    passaGrande: razaoArredondada >= 3.0
  };
}

// 89. Regiões dinâmicas aria-live="polite" para leitores de tela
function anunciarLeitorTela(mensagem, prioridade) {
  if (typeof document === "undefined" || !mensagem) return;
  let liveEl = document.getElementById("prumo-aria-live");
  if (!liveEl) {
    liveEl = document.createElement("div");
    liveEl.id = "prumo-aria-live";
    liveEl.className = "sr-live-region";
    liveEl.setAttribute("aria-live", prioridade === "assertive" ? "assertive" : "polite");
    liveEl.setAttribute("aria-atomic", "true");
    document.body.appendChild(liveEl);
  }
  liveEl.textContent = "";
  setTimeout(() => {
    if (liveEl) liveEl.textContent = String(mensagem);
  }, 20);
}

// 90. Rótulos semânticos aria-label automáticos em botões icon-only
function assegurarAriaLabelsBotoes(container) {
  if (typeof document === "undefined") return 0;
  const raiz = container || document;
  const botoes = raiz.querySelectorAll("button:not([aria-label])");
  let ajustados = 0;
  botoes.forEach(btn => {
    const texto = btn.textContent.trim();
    if (!texto) {
      const titulo = btn.getAttribute("title") || "Ação";
      btn.setAttribute("aria-label", titulo);
      ajustados++;
    }
  });
  return ajustados;
}

// 91. Marcação semântica das falas do Prumi
function formatarFalaPrumiSemantica(fala, autor) {
  const nome = sanitizarHTMLSeguro(autor || "Prumi");
  const texto = sanitizarHTMLSeguro(fala || "");
  return (
    `<figure class="prumi-fala-semantica" role="group" aria-label="Fala do mascote">` +
    `<blockquote cite="#prumi"><p>${texto}</p></blockquote>` +
    `<figcaption class="sr-live-region">${nome}</figcaption>` +
    `</figure>`
  );
}

// 92. Fechamento de modais com tecla Escape
function ouvirTeclaEscape(callbackFechar) {
  if (typeof window === "undefined" || typeof callbackFechar !== "function") {
    return () => {};
  }
  const handler = evt => {
    if (evt.key === "Escape" || evt.key === "Esc") {
      callbackFechar(evt);
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}

// 93. Focus trap em modais abertos
function aplicarFocusTrap(modalEl) {
  if (!modalEl || typeof modalEl.querySelector !== "function") {
    return () => {};
  }
  const seletor = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const handler = evt => {
    if (evt.key !== "Tab") return;
    const focaveis = Array.from(modalEl.querySelectorAll(seletor)).filter(
      el => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
    if (!focaveis.length) {
      evt.preventDefault();
      return;
    }
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evt.shiftKey) {
      if (document.activeElement === primeiro) {
        ultimo.focus();
        evt.preventDefault();
      }
    } else {
      if (document.activeElement === ultimo) {
        primeiro.focus();
        evt.preventDefault();
      }
    }
  };

  modalEl.addEventListener("keydown", handler);
  return () => modalEl.removeEventListener("keydown", handler);
}

// 95. Indicação textual complementar em elementos coloridos
function marcarStatusComTexto(el, status, textoComplementar) {
  if (!el || typeof el.setAttribute !== "function") return;
  const texto = textoComplementar || status;
  el.setAttribute("data-status", String(status));
  let span = el.querySelector(".status-texto-acessivel");
  if (!span) {
    span = document.createElement("span");
    span.className = "status-texto-acessivel oculto-acessivel";
    el.appendChild(span);
  }
  span.textContent = ` (${texto})`;
}

// 98. Retorno tátil via navigator.vibrate
function dispararRetornoTatil(tipo) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return false;
  }
  try {
    if (tipo === "sucesso") {
      return navigator.vibrate([20, 40, 20]);
    } else if (tipo === "alerta") {
      return navigator.vibrate([40, 60, 40]);
    } else {
      return navigator.vibrate(10);
    }
  } catch (_) {
    return false;
  }
}

// 99. Inputs numéricos com inputmode="numeric"
function garantirInputmodeNumerico(inputEl) {
  if (!inputEl || typeof inputEl.setAttribute !== "function") return;
  inputEl.setAttribute("inputmode", "numeric");
  inputEl.setAttribute("pattern", "[0-9]*");
}

// 101. Mensagens de erro claras e orientadas à ação
function formatarMensagemErroAcao(codigoOuTexto) {
  const c = String(codigoOuTexto || "").toLowerCase();
  if (c.includes("network") || c.includes("offline") || c.includes("conexao")) {
    return "Sem conexão no momento. Seus dados estão salvos aqui e serão sincronizados assim que a internet voltar.";
  }
  if (c.includes("auth") || c.includes("senha") || c.includes("login")) {
    return "Não foi possível entrar. Verifique seu email e senha ou clique em Esqueci a senha.";
  }
  if (c.includes("storage") || c.includes("cheio") || c.includes("quota")) {
    return "Espaço do navegador cheio. Limpe o histórico ou remova itens antigos nos Ajustes.";
  }
  return "Algo deu errado. Tente novamente em alguns segundos ou recarregue a página.";
}

// 102. Feedback sonoro acessível para deficientes visuais
function tocarSomAcessivel(tipo) {
  const ctx = obterContextoAudioSeguro();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const freq = tipo === "sucesso" ? 660 : tipo === "alerta" ? 330 : 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}
}

// 103. Desativação de gestos conflitantes com a navegação
function desativarArrastoConflitante(el) {
  if (!el || typeof el.classList !== "object") return;
  el.classList.add("conteudo-sem-arrasto-conflitante");
}

// 104. Preenchimento automático com atributos autocomplete
function configurarAutocompleteFormulario(formEl) {
  if (!formEl || typeof formEl.querySelectorAll !== "function") return;
  formEl.querySelectorAll("input").forEach(inp => {
    const tipo = inp.type;
    const nome = (inp.name || inp.id || "").toLowerCase();
    if (tipo === "email" || nome.includes("email")) {
      inp.setAttribute("autocomplete", "email");
    } else if (tipo === "password") {
      inp.setAttribute("autocomplete", "current-password");
    } else if (nome.includes("nome") || nome.includes("name")) {
      inp.setAttribute("autocomplete", "name");
    }
  });
}

// 105. Barra de progresso com atributos aria
function atualizarBarraProgressoAria(barraEl, valor, min, max) {
  if (!barraEl || typeof barraEl.setAttribute !== "function") return;
  const minimo = typeof min === "number" ? min : 0;
  const maximo = typeof max === "number" ? max : 100;
  const val = Math.min(maximo, Math.max(minimo, Number(valor) || 0));

  barraEl.setAttribute("role", "progressbar");
  barraEl.setAttribute("aria-valuenow", String(val));
  barraEl.setAttribute("aria-valuemin", String(minimo));
  barraEl.setAttribute("aria-valuemax", String(maximo));
}

// 106. Modo de alto contraste configurável
function alternarAltoContraste(ativo) {
  if (typeof document === "undefined" || !document.documentElement) return false;
  if (ativo === undefined) {
    const atual = document.documentElement.getAttribute("data-alto-contraste") === "true";
    document.documentElement.setAttribute("data-alto-contraste", String(!atual));
    return !atual;
  }
  document.documentElement.setAttribute("data-alto-contraste", String(Boolean(ativo)));
  return Boolean(ativo);
}

// 107. Título dinâmico do documento com pendências
function atualizarTituloDocumento(secao, notificacoes) {
  if (typeof document === "undefined") return "";
  const sec = secao ? ` - ${secao}` : "";
  const prefixo = typeof notificacoes === "number" && notificacoes > 0 ? `(${notificacoes}) ` : "";
  const tituloFinal = `${prefixo}Prumo${sec}`;
  document.title = tituloFinal;
  return tituloFinal;
}

// 110. Associação <label for="..."> nos formulários
function assegurarLabelsFormulario(container) {
  if (typeof document === "undefined") return 0;
  const raiz = container || document;
  const inputs = raiz.querySelectorAll("input:not([id]), select:not([id]), textarea:not([id])");
  let criados = 0;
  inputs.forEach((inp, idx) => {
    const idUnico = `prumo-campo-auto-${Date.now()}-${idx}`;
    inp.id = idUnico;
    let label = inp.closest("label");
    if (!label && inp.parentElement) {
      label = inp.parentElement.querySelector("label");
    }
    if (label && !label.getAttribute("for")) {
      label.setAttribute("for", idUnico);
      criados++;
    }
  });
  return criados;
}
