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
