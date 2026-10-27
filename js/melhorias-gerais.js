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

// 111. Árvore de evolução visual do Prumi por nível
function nivelEvolucaoPrumi(nivel) {
  const n = Math.max(1, parseInt(nivel, 10) || 1);
  if (n < 5) {
    return { estagio: "Bebê", titulo: "Prumi Curioso", aura: "suave", escala: 0.9 };
  } else if (n < 10) {
    return { estagio: "Aprendiz", titulo: "Prumi Esforçado", aura: "brilho", escala: 1.0 };
  } else if (n < 20) {
    return { estagio: "Explorador", titulo: "Prumi Aventureiro", aura: "dourada", escala: 1.1 };
  }
  return { estagio: "Mestre", titulo: "Prumi Iluminado", aura: "cosmica", escala: 1.2 };
}

// 112. Guarda-roupa com prévia dinâmica ao vivo
function previaRoupaAoVivo(itemRoupa, elPreview) {
  if (!elPreview || !itemRoupa) return;
  const slot = String(itemRoupa.slot || "geral");
  let slotEl = elPreview.querySelector(`[data-slot="${slot}"]`);
  if (!slotEl) {
    slotEl = document.createElement("div");
    slotEl.setAttribute("data-slot", slot);
    elPreview.appendChild(slotEl);
  }
  slotEl.textContent = itemRoupa.nome || "";
  slotEl.setAttribute("data-item-id", itemRoupa.id || "");
}

// 113. Camadas livres de roupas com ordenação de z-index
function sistemaCamadasRoupas(pecas) {
  if (!Array.isArray(pecas)) return [];
  const pesos = {
    corpo: 0,
    calca: 10,
    camisa: 20,
    casaco: 30,
    pes: 40,
    acessorio: 50,
    chapeu: 60
  };
  return [...pecas].sort((a, b) => {
    const pesoA = pesos[a.slot] !== undefined ? pesos[a.slot] : 25;
    const pesoB = pesos[b.slot] !== undefined ? pesos[b.slot] : 25;
    return pesoA - pesoB;
  });
}

// 114. Personalidade customizável do pet
function definirTemperamentoPet(pet, temperamento) {
  if (!pet || typeof pet !== "object") return pet;
  const temperamentosValidos = ["brincalhao", "sereno", "comilao", "estudioso"];
  const temp = temperamentosValidos.includes(temperamento) ? temperamento : "sereno";
  pet.temperamento = temp;
  if (temp === "brincalhao") {
    pet.falaFavorita = "Vamos pular e bater recordes!";
  } else if (temp === "comilao") {
    pet.falaFavorita = "Já pegou um petisco depois dessa tarefa?";
  } else if (temp === "estudioso") {
    pet.falaFavorita = "Foco total na próxima meta!";
  } else {
    pet.falaFavorita = "Respire fundo e mantenha o equilíbrio.";
  }
  return pet;
}

// 115. Eventos sazonais automáticos para cada estação
function obterEstacaoAnoAtual(data) {
  const d = data instanceof Date ? data : new Date();
  const mes = d.getMonth() + 1;
  const dia = d.getDate();

  // Hemisfério Sul:
  // Verão: 21/dez a 20/mar
  // Outono: 21/mar a 20/jun
  // Inverno: 21/jun a 22/set
  // Primavera: 23/set a 20/dez
  const md = mes * 100 + dia;
  if (md >= 1221 || md < 321) {
    return { id: "verao", nome: "Verão", icone: "☀️", bonusGotas: 1.2 };
  } else if (md >= 321 && md < 621) {
    return { id: "outono", nome: "Outono", icone: "🍂", bonusGotas: 1.0 };
  } else if (md >= 621 && md < 923) {
    return { id: "inverno", nome: "Inverno", icone: "❄️", bonusGotas: 1.0 };
  }
  return { id: "primavera", nome: "Primavera", icone: "🌸", bonusGotas: 1.1 };
}

// 116. Missões diárias rotativas com desafios temáticos
function gerarMissoesRotativasDia(dataStr, mundo) {
  const d = String(dataStr || "2026-10-26");
  const m = String(mundo || "padrao");
  let seed = 0;
  for (let i = 0; i < d.length; i++) seed += d.charCodeAt(i);

  const banco = [
    { id: "agua", texto: "Beba 4 copos de água hoje", gotas: 5 },
    { id: "tarefa", texto: "Conclua 3 tarefas prioritárias", gotas: 8 },
    { id: "habito", texto: "Mantenha a sequência de 1 hábito", gotas: 4 },
    { id: "leitura", texto: "Leia ao menos 10 páginas", gotas: 6 },
    { id: "pet", texto: "Faça carinho no pet 3 vezes", gotas: 3 }
  ];

  const idx1 = seed % banco.length;
  const idx2 = (seed + 1) % banco.length;
  const idx3 = (seed + 2) % banco.length;

  return [banco[idx1], banco[idx2], banco[idx3]].map((mis, pos) => ({
    ...mis,
    id: `${mis.id}_${m}_${pos}`,
    concluida: false
  }));
}

// 117. Cofre de gotas com juros de produtividade
function pouparGotasCofre(saldoCofre, sequenciaDias) {
  const saldo = Math.max(0, parseInt(saldoCofre, 10) || 0);
  const seq = Math.max(0, parseInt(sequenciaDias, 10) || 0);
  // Rendimento diário proporcional à sequência (0.5% a cada 7 dias de streak, max 5%)
  const taxaPercentual = Math.min(5, Math.floor(seq / 7) * 0.5 + 1);
  const rendimento = Math.floor((saldo * taxaPercentual) / 100);
  return {
    saldoNovo: saldo + rendimento,
    rendimentoGotas: rendimento,
    taxaPercentual
  };
}

// 118. Minigame retrô de 8 bits no mundo Gamer
function minigameGamer8BitHTML() {
  return (
    `<div class="minigame-8bit-container">` +
    `<div class="minigame-8bit-tela" id="tela-8bit">SCORE: 0000 | LVL: 1<br/>PRESS START TO FOCUS</div>` +
    `<div style="display:flex; justify-content:space-between; margin-top:8px;">` +
    `<button class="btn-8bit" data-btn="a">A</button>` +
    `<button class="btn-8bit" data-btn="b">B</button>` +
    `</div>` +
    `</div>`
  );
}

// 119. Fitas cassete colecionáveis no mundo Emo
function fitaCasseteEmoHTML(titulo, artista, duracaoMin) {
  const t = sanitizarHTMLSeguro(titulo || "Mixtape Emo");
  const a = sanitizarHTMLSeguro(artista || "Various Artists");
  const d = parseInt(duracaoMin, 10) || 45;
  return (
    `<div class="fita-cassete-emo">` +
    `<div style="display:flex; justify-content:space-around; align-items:center;">` +
    `<span class="fita-bobina"></span>` +
    `<div style="font-size:12px; font-weight:bold;">${t}</div>` +
    `<span class="fita-bobina"></span>` +
    `</div>` +
    `<div style="font-size:10px; color:#a1a1aa; text-align:center; margin-top:4px;">${a} (${d} min)</div>` +
    `</div>`
  );
}

// 120. Viola afinável interativa no mundo Sertanejo
function tocarViolaSertanejo(cordaNota) {
  const ctx = obterContextoAudioSeguro();
  if (!ctx) return;
  const afinações = {
    mi: 329.63,
    si: 246.94,
    solSust: 207.65,
    re: 146.83,
    la: 110.0
  };
  const freq = afinações[cordaNota] || afinações.mi;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

// 121. Console interativo de comandos no mundo Programador
function executarComandoConsole(cmd, estado) {
  const c = String(cmd || "")
    .trim()
    .toLowerCase();
  const est = estado || {};
  if (c === "help") {
    return "Comandos disponíveis: status, gotas, tarefas, clear, ping";
  }
  if (c === "status") {
    const tarefasFeitas = Array.isArray(est.tarefas) ? est.tarefas.filter(t => t.feita).length : 0;
    return `STATUS: OK | Tarefas feitas: ${tarefasFeitas} | Conexão: Local`;
  }
  if (c === "gotas") {
    const gotas = typeof est.gotas === "number" ? est.gotas : 0;
    return `GOTAS: ${gotas}💧 disponíveis`;
  }
  if (c === "ping") {
    return "PONG! 0ms latência";
  }
  if (c === "clear") {
    return "";
  }
  return `Comando desconhecido: "${c}". Digite "help" para ver as opções.`;
}

// 122. Jardim zen com pedras empilháveis
function jardimZenPedrasHTML(qtdPedras) {
  const n = Math.min(7, Math.max(1, parseInt(qtdPedras, 10) || 3));
  let pedrasHTML = "";
  for (let i = 0; i < n; i++) {
    const largura = 70 - i * 8;
    const altura = 16 - i * 1.5;
    pedrasHTML += `<div class="pedra-zen" style="width:${largura}px; height:${altura}px;"></div>`;
  }
  return `<div class="jardim-zen-pedras" aria-label="Torre de equilíbrio">${pedrasHTML}</div>`;
}

// 123. Bateria de dedilhado rápido no mundo Roqueiro
function bateriaRockDedilhado(peca) {
  const ctx = obterContextoAudioSeguro();
  if (!ctx) return false;
  const p = String(peca || "caixa").toLowerCase();
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = p === "bumbo" ? 75 : p === "prato" ? 1200 : 250;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    return true;
  } catch (_) {
    return false;
  }
}

// 124. Livro de receitas de chás e bolos no mundo Vovó
function receitasVovoHTML(filtro) {
  const receitas = [
    { nome: "Chá de Camomila Calmante", gotas: 2, efeito: "Alivia ansiedade de prazos" },
    { nome: "Bolo de Fubá com Erva-Doce", gotas: 5, efeito: "Dobra gotas da próxima tarefa" },
    { nome: "Chá de Hortelã Refrescante", gotas: 3, efeito: "Foco revigorado por 25 min" }
  ];
  const f = String(filtro || "").toLowerCase();
  const filtradas = receitas.filter(r => !f || r.nome.toLowerCase().includes(f));
  let itens = "";
  filtradas.forEach(r => {
    itens +=
      `<div style="border-bottom:1px dashed #cbd5e1; padding:6px 0;">` +
      `<strong>${sanitizarHTMLSeguro(r.nome)}</strong> (Custo: ${r.gotas}💧)<br/>` +
      `<span style="font-size:12px; color:#64748b;">${sanitizarHTMLSeguro(r.effect || r.efeito)}</span>` +
      `</div>`;
  });
  return `<div class="receitas-vovo-container" style="font-size:13px;">${itens}</div>`;
}

// 125. Painel de metas SMART e gráficos de linha no mundo Coach
function painelCoachMetasHTML(metas) {
  const lista = Array.isArray(metas) ? metas : [];
  let cards = "";
  lista.forEach(m => {
    const pct = Math.min(100, Math.max(0, parseInt(m.progresso, 10) || 0));
    cards +=
      `<div style="margin-bottom:8px;">` +
      `<div style="display:flex; justify-content:space-between; font-size:12px;">` +
      `<span>${sanitizarHTMLSeguro(m.titulo || "Meta")}</span>` +
      `<strong>${pct}%</strong>` +
      `</div>` +
      `<div style="background:#e2e8f0; border-radius:4px; height:8px; overflow:hidden;">` +
      `<div style="width:${pct}%; background:#22c55e; height:100%;"></div>` +
      `</div>` +
      `</div>`;
  });
  return `<div class="painel-coach-metas">${cards || "<p>Nenhuma meta ativa.</p>"}</div>`;
}

// 126. Pista de dança ritmada no mundo Forrozeiro
function pistaForroHTML(ritmo) {
  const r = String(ritmo || "xote");
  return (
    `<div class="pista-forro" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; max-width:180px; margin:auto;">` +
    `<div style="background:#fbbf24; height:32px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:11px;">1-2</div>` +
    `<div style="background:#f59e0b; height:32px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:11px;">Gira</div>` +
    `<div style="background:#d97706; height:32px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:11px;">${sanitizarHTMLSeguro(r)}</div>` +
    `</div>`
  );
}

// 127. Roda de samba interativa no mundo Pagodeiro
function rodaSambaHTML(instrumentosAtivos) {
  const ativos = Array.isArray(instrumentosAtivos) ? instrumentosAtivos : ["pandeiro"];
  const insts = [
    { id: "pandeiro", nome: "Pandeiro" },
    { id: "cavaquinho", nome: "Cavaquinho" },
    { id: "tanta", nome: "Tantã" }
  ];
  let chips = "";
  insts.forEach(ins => {
    const ligado = ativos.includes(ins.id);
    const bg = ligado ? "#10b981" : "#94a3b8";
    chips +=
      `<span style="background:${bg}; color:#fff; padding:4px 8px; border-radius:12px; font-size:12px; margin-right:4px;">` +
      `${ins.nome} ${ligado ? "🎵" : ""}` +
      `</span>`;
  });
  return `<div class="roda-samba">${chips}</div>`;
}

// 128. Paredão de som com equalizador visual no mundo Funkeiro
function paredaoFunkHTML(frequencias) {
  const barras = Array.isArray(frequencias) && frequencias.length ? frequencias : [12, 20, 8, 24, 16];
  let eqHTML = "";
  barras.forEach(h => {
    eqHTML += `<span class="eq-barra" style="height:${h}px;"></span>`;
  });
  return (
    `<div class="paredao-funk">` +
    `<div style="font-weight:bold; font-size:12px; color:#ec4899; margin-bottom:6px;">PAREDÃO DO PRUMO</div>` +
    `<div>${eqHTML}</div>` +
    `</div>`
  );
}

// 129. Vitrine de sneakers e correntes no mundo Trapper
function vitrineSneakersHTML(sneakers) {
  const lista = Array.isArray(sneakers)
    ? sneakers
    : [
        { id: "sneaker_dourado", nome: "Sneaker Dourado" },
        { id: "corrente_gelo", nome: "Corrente de Gelo" }
      ];
  let cards = "";
  lista.forEach(s => {
    cards +=
      `<div style="display:inline-block; border:1px solid #475569; border-radius:6px; padding:6px; margin:4px; font-size:11px; background:#1e293b; color:#f8fafc;">` +
      `👟 ${sanitizarHTMLSeguro(s.nome)}` +
      `</div>`;
  });
  return `<div class="vitrine-sneakers">${cards}</div>`;
}

// 130. Rotina de skincare matinal e noturna no mundo Cleanboy
function rotinaSkincareHTML(etapa, feita) {
  const e = sanitizarHTMLSeguro(etapa || "Gel de Limpeza");
  const f = Boolean(feita);
  return (
    `<div class="card-skincare" style="display:flex; align-items:center; justify-content:space-between;">` +
    `<div>` +
    `<span style="font-size:11px; color:#64748b;">AUTOCUIDADO</span><br/>` +
    `<strong>${e}</strong>` +
    `</div>` +
    `<span style="font-size:18px;">${f ? "✨" : "💧"}</span>` +
    `</div>`
  );
}

// 131. Estatísticas de afeição do pet
function estatisticasAfeicaoPet(pet) {
  const carinho = pet && typeof pet.carinho === "number" ? pet.carinho : 0;
  const diasJuntos = pet && typeof pet.diasJuntos === "number" ? pet.diasJuntos : 1;
  const nivelApego = Math.min(10, Math.floor(carinho / 10) + 1);
  const bonusFocoMinutos = Math.min(15, nivelApego * 1.5);
  return {
    nivelApego,
    carinhoTotal: carinho,
    diasJuntos,
    bonusFocoMinutos
  };
}

// 132. Itens de quarto interativos
function interagirItemQuarto(itemId, estado) {
  const id = String(itemId || "");
  const est = estado || {};
  if (!est.itensQuarto) est.itensQuarto = {};
  const statusAtual = Boolean(est.itensQuarto[id]);
  est.itensQuarto[id] = !statusAtual;
  return {
    itemId: id,
    ativo: !statusAtual,
    mensagem: !statusAtual ? `Você ativou ${id}!` : `Você desativou ${id}.`
  };
}

// 133. Visita surpresa de amigos no quarto
function visitaAmigoQuartoHTML(amigo) {
  const nome = sanitizarHTMLSeguro((amigo && amigo.nome) || "Um amigo");
  const recado = sanitizarHTMLSeguro((amigo && amigo.recado) || "Passando para desejar foco!");
  return (
    `<div class="balao-visita-amigo">` +
    `<span>👋</span>` +
    `<div><strong>${nome}</strong>: "${recado}"</div>` +
    `</div>`
  );
}

// 134. Fotolog com filtros temáticos
function aplicarFiltroFotolog(tipoFiltro, imgEl) {
  const filtro = String(tipoFiltro || "vintage").toLowerCase();
  const classesValidas = {
    vintage: "filtro-fotolog-vintage",
    neon: "filtro-fotolog-neon",
    bw: "filtro-fotolog-bw"
  };
  const classeAplicar = classesValidas[filtro] || classesValidas.vintage;
  if (imgEl && imgEl.classList) {
    Object.values(classesValidas).forEach(c => imgEl.classList.remove(c));
    imgEl.classList.add(classeAplicar);
  }
  return classeAplicar;
}

// 135. Títulos de nobreza e conquistas no perfil
function obterTituloPerfil(tarefasFeitas, diasStreak) {
  const t = Math.max(0, parseInt(tarefasFeitas, 10) || 0);
  const s = Math.max(0, parseInt(diasStreak, 10) || 0);
  if (t >= 100 && s >= 30) return "Lorde da Disciplina";
  if (t >= 50 && s >= 14) return "Cavaleiro do Foco";
  if (t >= 20 || s >= 7) return "Aprendiz Dedicado";
  return "Iniciante Constante";
}

// 136. Assistente de divisão de tarefas complexas
function quebrarTarefaEmPassos(tituloTarefa) {
  const titulo = String(tituloTarefa || "").trim();
  if (!titulo) return [];
  return [
    { titulo: `Planejar e estruturar: ${titulo}`, concluido: false },
    { titulo: `Executar núcleo: ${titulo}`, concluido: false },
    { titulo: `Revisar e finalizar: ${titulo}`, concluido: false }
  ];
}

// 137. Modo Pomodoro com transição automática estudo/pausa
function pomodoroComTransicao(cicloAtual) {
  const c = Math.max(1, parseInt(cicloAtual, 10) || 1);
  const isPausaLonga = c % 4 === 0;
  return {
    ciclo: c,
    minutosFoco: 25,
    minutosPausa: isPausaLonga ? 15 : 5,
    proximaPausaLongaEm: isPausaLonga ? 4 : 4 - (c % 4)
  };
}

// 138. Lembretes recorrentes a cada X dias
function habitoRecorrenciaFlexivel(dataUltima, intervaloDias, dataHoje) {
  const intv = Math.max(1, parseInt(intervaloDias, 10) || 1);
  if (!dataUltima) return true;
  const diff = memoDiffDays(dataUltima, dataHoje);
  return diff >= intv;
}

// 139. Gráfico quadriculado estilo GitHub para hábitos
function quadriculadoHabitosAnual(historicoDias) {
  const dias = Array.isArray(historicoDias) ? historicoDias : [];
  let celulas = "";
  dias.forEach(d => {
    const qtd = Math.min(3, Math.max(0, parseInt(d.quantidade, 10) || 0));
    celulas += `<div class="celula-habito" data-nivel="${qtd}" title="${d.data || ""}: ${qtd} concluídos"></div>`;
  });
  return `<div class="quadriculado-habitos-grid">${celulas}</div>`;
}

// 140. Calculadora de ritmo de leitura na Estante
function calcularRitmoLeitura(paginasLidas, minutosGastos, totalPaginas) {
  const pag = Math.max(0, parseInt(paginasLidas, 10) || 0);
  const min = Math.max(1, parseInt(minutosGastos, 10) || 1);
  const tot = Math.max(pag, parseInt(totalPaginas, 10) || pag);
  const paginasPorHora = Math.round((pag / min) * 60);
  const paginasRestantes = tot - pag;
  const minutosRestantes = paginasPorHora > 0 ? Math.round((paginasRestantes / paginasPorHora) * 60) : 0;
  return {
    paginasPorHora,
    paginasRestantes,
    horasRestantesEstimadas: Math.round((minutosRestantes / 60) * 10) / 10
  };
}

// 141. Fichas de estudo com repetição espaçada SM-2
function calcularProximaRevisaoSM2(fatorFacilidade, repeticoes, intervalo, qualidade) {
  const q = Math.min(5, Math.max(0, parseInt(qualidade, 10) || 0));
  let ef = typeof fatorFacilidade === "number" ? fatorFacilidade : 2.5;
  let reps = typeof repeticoes === "number" ? repeticoes : 0;
  let intv = typeof intervalo === "number" ? intervalo : 1;

  if (q >= 3) {
    if (reps === 0) {
      intv = 1;
    } else if (reps === 1) {
      intv = 6;
    } else {
      intv = Math.round(intv * ef);
    }
    reps++;
  } else {
    reps = 0;
    intv = 1;
  }

  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return {
    fatorFacilidade: Math.round(ef * 100) / 100,
    repeticoes: reps,
    intervaloDias: intv
  };
}

// 142. Modo Prova com contagem regressiva e distribuição
function planoRevisaoProva(diasAteProva, topicos) {
  const dias = Math.max(1, parseInt(diasAteProva, 10) || 1);
  const lista = Array.isArray(topicos) ? topicos : [];
  const topicosPorDia = Math.max(1, Math.ceil(lista.length / dias));
  const cronograma = [];
  for (let d = 1; d <= dias; d++) {
    const inicio = (d - 1) * topicosPorDia;
    const fim = inicio + topicosPorDia;
    const itensDia = lista.slice(inicio, fim);
    cronograma.push({
      dia: d,
      ehSimulado: d === dias,
      topicos: itensDia.length ? itensDia : ["Revisão Geral e Simulado"]
    });
  }
  return cronograma;
}

// 143. Histórico comparativo de hidratação semanal
function comparativoAguaSemanal(diasSemana, metaDiaria) {
  const meta = Math.max(1, parseInt(metaDiaria, 10) || 2000);
  const arr = Array.isArray(diasSemana) ? diasSemana : [];
  const total = arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
  const media = arr.length ? Math.round(total / arr.length) : 0;
  const melhor = arr.length ? Math.max(...arr.map(Number)) : 0;
  return {
    total,
    mediaDiaria: media,
    melhorDia: melhor,
    percentualMetaSemanal: Math.round((total / (meta * (arr.length || 7))) * 100)
  };
}

// 144. Rotina matinal guiada no Hoje
function rotinaMatinalHojeHTML(passos) {
  const lista = Array.isArray(passos)
    ? passos
    : ["Beber 1 copo de água", "Alongar por 3 minutos", "Listar 3 metas principais"];
  let itens = "";
  lista.forEach((p, idx) => {
    itens += `<div style="margin:4px 0;">✓ ${sanitizarHTMLSeguro(p)}</div>`;
  });
  return (
    `<div class="card-rotina-matinal">` +
    `<strong style="font-size:12px;">☀️ BOM DIA! SUA ROTINA MATINAL</strong>` +
    `<div style="margin-top:6px; font-size:12px;">${itens}</div>` +
    `</div>`
  );
}

// 145. Resumo executivo de encerramento do dia
function resumoEncerramentoDiaHTML(resumo) {
  const r = resumo || {};
  const tarefas = r.tarefasFeitas || 0;
  const gotas = r.gotasGanhas || 0;
  return (
    `<div class="card-resumo-encerramento">` +
    `<strong style="font-size:13px;">🌙 DIA CONCLUÍDO COM SUCESSO</strong>` +
    `<p style="margin:6px 0 0; font-size:12px;">Você concluiu <strong>${tarefas}</strong> tarefas e ganhou <strong>${gotas}💧</strong> hoje. Descanse bem!</p>` +
    `</div>`
  );
}

// 146. Agrupamento de tarefas por contexto e tags
function agruparTarefasPorTags(tarefas) {
  const lista = Array.isArray(tarefas) ? tarefas : [];
  const grupos = { geral: [] };
  lista.forEach(t => {
    const match = (t.titulo || "").match(/#([a-zA-Z0-9_-]+)/);
    if (match) {
      const tag = match[1].toLowerCase();
      if (!grupos[tag]) grupos[tag] = [];
      grupos[tag].push(t);
    } else {
      grupos.geral.push(t);
    }
  });
  return grupos;
}

// 147. Exportação e importação em formato Markdown
function exportarTarefasMarkdown(tarefas) {
  const lista = Array.isArray(tarefas) ? tarefas : [];
  return lista
    .map(t => `- [${t.feita ? "x" : " "}] ${t.titulo || ""}${t.prio ? ` (prio: ${t.prio})` : ""}`)
    .join("\n");
}

function importarTarefasMarkdown(mdTexto) {
  if (typeof mdTexto !== "string") return [];
  const linhas = mdTexto.split("\n");
  const tarefas = [];
  linhas.forEach((linha, idx) => {
    const m = /^\s*-\s*\[([ xX])\]\s*(.+)$/.exec(linha);
    if (m) {
      const feita = m[1].toLowerCase() === "x";
      const titulo = m[2].trim();
      tarefas.push({
        id: `t_md_${Date.now()}_${idx}`,
        titulo,
        feita
      });
    }
  });
  return tarefas;
}

// 148. Pareamento rápido entre dispositivos via QR Code ou Link seguro
function gerarPayloadPareamento(estado) {
  const dados = {
    tarefas: (estado && estado.tarefas) || [],
    habitos: (estado && estado.habitos) || [],
    gotas: (estado && estado.gotas) || 0,
    exportadoEm: Date.now()
  };
  const json = JSON.stringify(dados);
  return comprimirTextoLZW(json);
}

// 149. Resolução visual de conflitos de sincronia
function resolverConflitoSincronia(versaoLocal, versaoRemota, estrategia) {
  const loc = Array.isArray(versaoLocal) ? versaoLocal : [];
  const rem = Array.isArray(versaoRemota) ? versaoRemota : [];
  if (estrategia === "manterLocal") return [...loc];
  if (estrategia === "manterRemoto") return [...rem];

  // Estratégia padrão: fusão inteligente por id
  const mapa = new Map();
  rem.forEach(t => {
    if (t && t.id) mapa.set(t.id, t);
  });
  loc.forEach(t => {
    if (t && t.id) {
      const anterior = mapa.get(t.id);
      if (!anterior || (t.atualizadoEm || 0) >= (anterior.atualizadoEm || 0)) {
        mapa.set(t.id, t);
      }
    }
  });
  return Array.from(mapa.values());
}

// 150. Música ambiente binaural sintetizada para estudos
function iniciarSonsBinaurais(frequenciaBase, diferencaHz) {
  const ctx = obterContextoAudioSeguro();
  if (!ctx) return null;
  const base = typeof frequenciaBase === "number" ? frequenciaBase : 200;
  const diff = typeof diferencaHz === "number" ? diferencaHz : 10;
  try {
    const oscEsq = ctx.createOscillator();
    const oscDir = ctx.createOscillator();
    const gain = ctx.createGain();

    oscEsq.frequency.setValueAtTime(base, ctx.currentTime);
    oscDir.frequency.setValueAtTime(base + diff, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);

    oscEsq.connect(gain);
    oscDir.connect(gain);
    gain.connect(ctx.destination);

    oscEsq.start();
    oscDir.start();

    return {
      parar: () => {
        try {
          oscEsq.stop();
          oscDir.stop();
        } catch (_) {}
      }
    };
  } catch (_) {
    return null;
  }
}

// 151. Clube do livro compartilhado sem spoilers
function clubeLivroSemSpoilerHTML(comentarios, paginaAtualUsuario) {
  const pagUsuario = Math.max(0, parseInt(paginaAtualUsuario, 10) || 0);
  const lista = Array.isArray(comentarios) ? comentarios : [];
  let html = "";
  lista.forEach(c => {
    const pagComentario = parseInt(c.pagina, 10) || 0;
    const ehSpoiler = pagComentario > pagUsuario;
    const autor = sanitizarHTMLSeguro(c.autor || "Leitor");
    const texto = sanitizarHTMLSeguro(c.texto || "");
    if (ehSpoiler) {
      html +=
        `<div style="margin-bottom:8px; font-size:12px;">` +
        `<strong>${autor}</strong> (Pág. ${pagComentario}): ` +
        `<span class="spoiler-oculto" title="Spoiler: clique para ver">${texto}</span>` +
        `</div>`;
    } else {
      html +=
        `<div style="margin-bottom:8px; font-size:12px;">` +
        `<strong>${autor}</strong> (Pág. ${pagComentario}): <span>${texto}</span>` +
        `</div>`;
    }
  });
  return `<div class="clube-livro-comentarios">${html}</div>`;
}

// 152. Metas de leitura compartilhadas colaborativas
function metaLeituraColaborativa(metaTotal, paginasLidasMembros) {
  const meta = Math.max(1, parseInt(metaTotal, 10) || 100);
  const membros = Array.isArray(paginasLidasMembros) ? paginasLidasMembros : [];
  const totalLido = membros.reduce((acc, m) => acc + (Number(m.paginas) || 0), 0);
  const progressoPct = Math.min(100, Math.round((totalLido / meta) * 100));

  let medalha = "Início";
  if (progressoPct >= 100) medalha = "Diamante 💎";
  else if (progressoPct >= 75) medalha = "Ouro 🥇";
  else if (progressoPct >= 50) medalha = "Prata 🥈";
  else if (progressoPct >= 25) medalha = "Bronze 🥉";

  return {
    metaTotal: meta,
    totalLido,
    progressoPct,
    medalha
  };
}

// 153. Empréstimo de livros com data de devolução
function registrarEmprestimoLivro(livroId, amigoNome, dataLimite) {
  const id = String(livroId || "");
  const amigo = sanitizarHTMLSeguro(amigoNome || "Amigo");
  const dataHoje = new Date().toISOString().substring(0, 10);
  const limite = dataLimite || dataHoje;
  const atrasado = limite < dataHoje;
  return {
    livroId: id,
    amigoNome: amigo,
    dataLimite: limite,
    emprestadoEm: dataHoje,
    atrasado
  };
}

// 154. Feed de reações carinhosas com gotas mágicas
function reagirComGotasAmigo(amigoId, gotas, mensagem) {
  const qtd = Math.max(1, parseInt(gotas, 10) || 1);
  const msg = sanitizarHTMLSeguro(mensagem || "Parabéns pelo foco!");
  return {
    amigoId: String(amigoId || ""),
    gotasEnviadas: qtd,
    mensagem: msg,
    timestamp: Date.now()
  };
}

// 155. Desafio semanal de produtividade em dupla
function desafioProdutividadeDupla(duplaA, duplaB, metaSemanal) {
  const ptsA = Math.max(0, (duplaA && duplaA.pontos) || 0);
  const ptsB = Math.max(0, (duplaB && duplaB.pontos) || 0);
  const meta = Math.max(1, parseInt(metaSemanal, 10) || 50);
  const total = ptsA + ptsB;
  return {
    totalPontos: total,
    metaSemanal: meta,
    atingida: total >= meta,
    percentual: Math.min(100, Math.round((total / meta) * 100))
  };
}

// 156. Calculadora de ingestão ideal de água por peso
function calcularMetaAguaPeso(pesoKg, nivelAtividade) {
  const peso = Math.max(20, Math.min(200, Number(pesoKg) || 70));
  let baseMl = Math.round(peso * 35);
  const nivel = String(nivelAtividade || "leve").toLowerCase();
  if (nivel === "moderado") baseMl += 500;
  if (nivel === "intenso") baseMl += 1000;
  return {
    pesoKg: peso,
    metaDiariaMl: baseMl,
    coposRecomendados: Math.ceil(baseMl / 250)
  };
}

// 157. Busca com pesquisa fonética e aproximada
function buscaFoneticaAproximada(termo, lista) {
  const t = String(termo || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!t) return [];
  const itens = Array.isArray(lista) ? lista : [];

  return itens.filter(item => {
    const texto = String(typeof item === "string" ? item : item.titulo || item.nome || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (texto.includes(t)) return true;

    // Distância Levenshtein leve para palavras de tamanho similar
    if (Math.abs(texto.length - t.length) <= 2) {
      let diff = 0;
      const minLen = Math.min(texto.length, t.length);
      for (let i = 0; i < minLen; i++) {
        if (texto[i] !== t[i]) diff++;
      }
      diff += Math.abs(texto.length - t.length);
      return diff <= 2;
    }
    return false;
  });
}

// 158. Agendamento visual em linha do tempo diária
function linhaDoTempoTarefasHTML(tarefasComHorario) {
  const lista = Array.isArray(tarefasComHorario) ? [...tarefasComHorario] : [];
  lista.sort((a, b) => String(a.hora || "").localeCompare(String(b.hora || "")));
  let itensHTML = "";
  lista.forEach(t => {
    const hora = sanitizarHTMLSeguro(t.hora || "--:--");
    const titulo = sanitizarHTMLSeguro(t.titulo || "Tarefa");
    itensHTML +=
      `<div class="timeline-item">` +
      `<span class="timeline-hora">${hora}</span> - ` +
      `<strong>${titulo}</strong>` +
      `</div>`;
  });
  return `<div class="timeline-container">${itensHTML || "<p>Nenhuma tarefa agendada.</p>"}</div>`;
}

// 159. Notificações inteligentes baseadas no horário de sono
function horarioPermitidoNotificar(horaAtual, horaDormir, horaAcordar) {
  const h = Number(horaAtual) || 0;
  const dormir = Number(horaDormir) !== undefined ? Number(horaDormir) : 23;
  const acordar = Number(horaAcordar) !== undefined ? Number(horaAcordar) : 7;

  // Janela que cruza meia-noite (ex: 23h às 7h)
  if (dormir > acordar) {
    if (h >= dormir || h < acordar) return false;
  } else {
    if (h >= dormir && h < acordar) return false;
  }
  return true;
}

// 160. Modo offline total com fila resiliente de sincronização
function filaOfflineSincronia(filaAtual, novaAcao) {
  const fila = Array.isArray(filaAtual) ? [...filaAtual] : [];
  if (!novaAcao || typeof novaAcao !== "object") return fila;

  // Deduplicação idempotente: atualiza ação se for sobre a mesma entidade
  const idx = fila.findIndex(
    a => a.tipo === novaAcao.tipo && a.idEntidade && a.idEntidade === novaAcao.idEntidade
  );

  const acaoFormatada = {
    ...novaAcao,
    timestamp: Date.now(),
    tentativas: 0
  };

  if (idx >= 0) {
    fila[idx] = acaoFormatada;
  } else {
    fila.push(acaoFormatada);
  }
  return fila;
}

// ========================================================
// NOVAS 260 MELHORIAS GERAIS - LOTE 1 (ITENS 1 A 10)
// ========================================================

// G1. Transição de fade suave ao trocar de aba sem saltos na rolagem
function aplicarFadeTransicaoAba(container) {
  if (!container || typeof container.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  container.classList.remove("fade-transicao-aba");
  // Força refluxo leve para reiniciar animação
  void container.offsetWidth;
  container.classList.add("fade-transicao-aba");
}

// G2. Efeito de brilho perolado nas gotas quando a meta diária for batida
function aplicarBrilhoPeroladoGotas(elGotas, ativo) {
  if (!elGotas || typeof elGotas.classList !== "object") return;
  if (ativo) {
    elGotas.classList.add("brilho-perolado-gotas");
  } else {
    elGotas.classList.remove("brilho-perolado-gotas");
  }
}

// G3. Micro-salto elástico do Prumi quando você adiciona uma nova tarefa
function animarSaltoElasticoPrumi(elPrumi) {
  if (!elPrumi || typeof elPrumi.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elPrumi.classList.remove("salto-elastico-prumi");
  void elPrumi.offsetWidth;
  elPrumi.classList.add("salto-elastico-prumi");
  setTimeout(() => {
    if (elPrumi) elPrumi.classList.remove("salto-elastico-prumi");
  }, 400);
}

// G4. Animação de poeira mágica ao subir de nível no perfil
function animarPoeiraMagicaLevelUp(elementoAlvo, qtdParticulas) {
  if (typeof document === "undefined" || !elementoAlvo) return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const qtd = Math.min(16, Math.max(4, parseInt(qtdParticulas, 10) || 8));
  const ret = elementoAlvo.getBoundingClientRect
    ? elementoAlvo.getBoundingClientRect()
    : { left: 0, top: 0, width: 40, height: 40 };
  const particulas = [];

  for (let i = 0; i < qtd; i++) {
    const p = document.createElement("div");
    p.className = "particula-poeira-magica";
    const angulo = (i / qtd) * 2 * Math.PI;
    const dist = 20 + Math.random() * 25;
    const dx = Math.cos(angulo) * dist;
    const dy = Math.sin(angulo) * dist - 15;
    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);
    p.style.left = `${ret.left + ret.width / 2}px`;
    p.style.top = `${ret.top + ret.height / 2}px`;
    document.body.appendChild(p);
    particulas.push(p);
    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 750);
  }
  return particulas;
}

// G5. Ondulação concêntrica ao tocar no botão de beber água
function animarOndulacaoConcentricaAgua(botaoEl, clientX, clientY) {
  if (!botaoEl || typeof botaoEl.appendChild !== "function") return null;
  if (verificarPreferenciaMovimentoReduzido()) return null;
  botaoEl.classList.add("ondulacao-concentrica-agua");
  const onda = document.createElement("span");
  onda.className = "ondulacao-onda";

  const ret = botaoEl.getBoundingClientRect();
  const tamanho = Math.max(ret.width, ret.height);
  onda.style.width = `${tamanho}px`;
  onda.style.height = `${tamanho}px`;

  const x = (typeof clientX === "number" && clientX > 0 ? clientX - ret.left : ret.width / 2) - tamanho / 2;
  const y = (typeof clientY === "number" && clientY > 0 ? clientY - ret.top : ret.height / 2) - tamanho / 2;
  onda.style.left = `${x}px`;
  onda.style.top = `${y}px`;

  botaoEl.appendChild(onda);
  setTimeout(() => {
    if (onda.parentNode) onda.parentNode.removeChild(onda);
  }, 550);
  return onda;
}

// G6. Vibração sutil no card ao arrastar para reordenar itens
function aplicarVibracaoArrastoCard(cardEl, ativo) {
  if (!cardEl || typeof cardEl.classList !== "object") return;
  if (ativo && !verificarPreferenciaMovimentoReduzido()) {
    cardEl.classList.add("card-vibrando-arrasto");
  } else {
    cardEl.classList.remove("card-vibrando-arrasto");
  }
}

// G7. Efeito de desdobrar pergaminho ao abrir notas longas do diário
function animarDesdobrarPergaminho(elementoNota) {
  if (!elementoNota || typeof elementoNota.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elementoNota.classList.remove("desdobrar-pergaminho");
  void elementoNota.offsetWidth;
  elementoNota.classList.add("desdobrar-pergaminho");
}

// G8. Brilho metálico sutil nos selos de conquistas recém-desbloqueadas
function aplicarBrilhoMetalicoSelo(seloEl) {
  if (!seloEl || typeof seloEl.classList !== "object") return;
  seloEl.classList.add("brilho-metalico-selo");
}

// G9. Rastro de faíscas ao concluir todas as tarefas de prioridade alta
function animarRastroFaiscasConclusao(elementoAlvo) {
  if (typeof document === "undefined" || !elementoAlvo) return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const ret = elementoAlvo.getBoundingClientRect
    ? elementoAlvo.getBoundingClientRect()
    : { left: 0, top: 0, width: 20, height: 20 };
  const faiscas = [];

  for (let i = 0; i < 6; i++) {
    const f = document.createElement("div");
    f.className = "particula-faisca-conclusao";
    const fx = (Math.random() - 0.5) * 40;
    const fy = -10 - Math.random() * 25;
    f.style.setProperty("--fx", `${fx}px`);
    f.style.setProperty("--fy", `${fy}px`);
    f.style.left = `${ret.left + ret.width / 2}px`;
    f.style.top = `${ret.top + ret.height / 2}px`;
    document.body.appendChild(f);
    faiscas.push(f);
    setTimeout(() => {
      if (f.parentNode) f.parentNode.removeChild(f);
    }, 500);
  }
  return faiscas;
}

// G10. Transição fluida entre modo claro e escuro em todos os elementos
function aplicarTransicaoModoEscuroSuave(duracaoMs) {
  if (typeof document === "undefined" || !document.documentElement) return;
  const d = Math.max(100, parseInt(duracaoMs, 10) || 250);
  document.documentElement.classList.add("transicao-tema-ativa");
  setTimeout(() => {
    if (document.documentElement) {
      document.documentElement.classList.remove("transicao-tema-ativa");
    }
  }, d + 50);
}

// ========================================================
// NOVAS 260 MELHORIAS GERAIS - LOTE 2 (ITENS 11 A 20)
// ========================================================

// G11. Confete direcionado brotando do elemento clicado
function dispararConfeteBrotandoElemento(elOrigem, cores) {
  if (typeof document === "undefined" || !elOrigem) return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const palette =
    Array.isArray(cores) && cores.length ? cores : ["#38bdf8", "#ec4899", "#84cc16", "#f59e0b", "#a855f7"];
  const ret = elOrigem.getBoundingClientRect
    ? elOrigem.getBoundingClientRect()
    : { left: 0, top: 0, width: 40, height: 40 };
  const confetes = [];

  for (let i = 0; i < 10; i++) {
    const c = document.createElement("div");
    c.className = "particula-confete-brotando";
    c.style.backgroundColor = palette[i % palette.length];
    const cx = (Math.random() - 0.5) * 80;
    const cy = -25 - Math.random() * 50;
    const rot = Math.floor(Math.random() * 360);
    c.style.setProperty("--cx", `${cx}px`);
    c.style.setProperty("--cy", `${cy}px`);
    c.style.setProperty("--rot", `${rot}deg`);
    c.style.left = `${ret.left + ret.width / 2}px`;
    c.style.top = `${ret.top + ret.height / 2}px`;
    document.body.appendChild(c);
    confetes.push(c);
    setTimeout(() => {
      if (c.parentNode) c.parentNode.removeChild(c);
    }, 750);
  }
  return confetes;
}

// G12. Ícone de cadeado que gira e abre suavemente ao autenticar
function animarCadeadoAutenticacao(elCadeado) {
  if (!elCadeado || typeof elCadeado.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elCadeado.classList.remove("cadeado-girando-abre");
  void elCadeado.offsetWidth;
  elCadeado.classList.add("cadeado-girando-abre");
  setTimeout(() => {
    if (elCadeado) elCadeado.classList.remove("cadeado-girando-abre");
  }, 450);
}

// G13. Movimento de folhas caindo ao arquivar um hábito antigo
function animarFolhasCaindoHabito(elHabito) {
  if (typeof document === "undefined" || !elHabito) return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const ret = elHabito.getBoundingClientRect
    ? elHabito.getBoundingClientRect()
    : { left: 0, top: 0, width: 40, height: 20 };
  const folhas = [];

  for (let i = 0; i < 4; i++) {
    const f = document.createElement("div");
    f.className = "particula-folha-caindo";
    const fx = (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20);
    f.style.setProperty("--fx", `${fx}px`);
    f.style.left = `${ret.left + (ret.width * (i + 1)) / 5}px`;
    f.style.top = `${ret.top + ret.height / 2}px`;
    document.body.appendChild(f);
    folhas.push(f);
    setTimeout(() => {
      if (f.parentNode) f.parentNode.removeChild(f);
    }, 850);
  }
  return folhas;
}

// G14. Pulso rítmico no cronômetro Pomodoro no minuto final
function aplicarPulsoMinutoFinalPomodoro(elTimer, ativo) {
  if (!elTimer || typeof elTimer.classList !== "object") return;
  if (ativo && !verificarPreferenciaMovimentoReduzido()) {
    elTimer.classList.add("pomodoro-pulso-urgente");
  } else {
    elTimer.classList.remove("pomodoro-pulso-urgente");
  }
}

// G15. Efeito de carimbo com tinta seca ao marcar meta como concluída
function animarCarimboMetaConcluida(elCard, textoCarimbo) {
  if (!elCard || typeof elCard.appendChild !== "function") return null;
  const texto = sanitizarHTMLSeguro(textoCarimbo || "CONCLUÍDO");
  let carimbo = elCard.querySelector(".carimbo-meta-concluida");
  if (!carimbo) {
    carimbo = document.createElement("div");
    carimbo.className = "carimbo-meta-concluida";
    carimbo.style.cssText =
      "position:absolute; right:12px; top:8px; border:2px solid #22c55e; color:#22c55e; " +
      "font-weight:900; font-size:11px; padding:2px 6px; border-radius:4px; text-transform:uppercase; pointer-events:none;";
    elCard.style.position = "relative";
    elCard.appendChild(carimbo);
  }
  carimbo.textContent = texto;
  return carimbo;
}

// G16. Piscar de olhos sincronizado entre o Prumi e o pet
function sincronizarPiscadaPrumiPet(elPrumi, elPet) {
  if (verificarPreferenciaMovimentoReduzido()) return;
  const elementos = [elPrumi, elPet].filter(el => el && typeof el.classList === "object");
  elementos.forEach(el => {
    el.classList.remove("olho-piscando-sincrono");
    void el.offsetWidth;
    el.classList.add("olho-piscando-sincrono");
    setTimeout(() => {
      if (el) el.classList.remove("olho-piscando-sincrono");
    }, 250);
  });
}

// G17. Balanço de cauda do pet ao receber carinho contínuo
function animarBalancoCaudaPet(elPet, ativo) {
  if (!elPet || typeof elPet.classList !== "object") return;
  if (ativo && !verificarPreferenciaMovimentoReduzido()) {
    elPet.classList.add("pet-cauda-balancando");
  } else {
    elPet.classList.remove("pet-cauda-balancando");
  }
}

// G18. Efeito de fita métrica desenhando o progresso nos hábitos
function animarFitaProgressoHabito(elBarra, percentual) {
  if (!elBarra || typeof elBarra.style !== "object") return;
  const pct = Math.min(100, Math.max(0, Number(percentual) || 0));
  elBarra.classList.add("fita-progresso-animada");
  elBarra.style.width = `${pct}%`;
}

// G19. Nuvem de fumaça fofa de desenho animado ao excluir item
function animarFumacaExclusao(elAlvo) {
  if (typeof document === "undefined" || !elAlvo) return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const ret = elAlvo.getBoundingClientRect
    ? elAlvo.getBoundingClientRect()
    : { left: 0, top: 0, width: 30, height: 30 };
  const bolhas = [];

  for (let i = 0; i < 5; i++) {
    const b = document.createElement("div");
    b.className = "particula-fumaca-fofa";
    const tamanho = 12 + Math.random() * 14;
    b.style.width = `${tamanho}px`;
    b.style.height = `${tamanho}px`;
    const sx = (i - 2) * 12;
    const sy = -10 - Math.random() * 15;
    b.style.setProperty("--sx", `${sx}px`);
    b.style.setProperty("--sy", `${sy}px`);
    b.style.left = `${ret.left + ret.width / 2 - tamanho / 2}px`;
    b.style.top = `${ret.top + ret.height / 2 - tamanho / 2}px`;
    document.body.appendChild(b);
    bolhas.push(b);
    setTimeout(() => {
      if (b.parentNode) b.parentNode.removeChild(b);
    }, 500);
  }
  return bolhas;
}

// G20. Expansão circular estilo revelação ao abrir modais em tela cheia
function animarRevelacaoCircularModal(modalEl, centroX, centroY) {
  if (!modalEl || typeof modalEl.style !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  const cx = typeof centroX === "number" ? `${centroX}px` : "50%";
  const cy = typeof centroY === "number" ? `${centroY}px` : "50%";
  modalEl.style.setProperty("--cx", cx);
  modalEl.style.setProperty("--cy", cy);
  modalEl.classList.remove("modal-revelacao-circular");
  void modalEl.offsetWidth;
  modalEl.classList.add("modal-revelacao-circular");
}

// ========================================================
// NOVAS 260 MELHORIAS GERAIS - LOTE 3 (ITENS 21 A 30)
// ========================================================

// G21. Efeito de água enchendo a tela de baixo para cima na meta batida
function animarOndaTelaCheiaAguaBatida() {
  if (typeof document === "undefined" || !document.body) return null;
  if (verificarPreferenciaMovimentoReduzido()) return null;
  let onda = document.getElementById("prumo-onda-meta-cheia");
  if (!onda) {
    onda = document.createElement("div");
    onda.id = "prumo-onda-meta-cheia";
    onda.className = "onda-tela-cheia-agua";
    document.body.appendChild(onda);
    setTimeout(() => {
      if (onda && onda.parentNode) onda.parentNode.removeChild(onda);
    }, 1450);
  }
  return onda;
}

// G22. Troca de roupa do Prumi com efeito de giro rápido de 360 graus
function animarGiroTrocaRoupaPrumi(elPrumi) {
  if (!elPrumi || typeof elPrumi.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elPrumi.classList.remove("prumi-giro-360");
  void elPrumi.offsetWidth;
  elPrumi.classList.add("prumi-giro-360");
  setTimeout(() => {
    if (elPrumi) elPrumi.classList.remove("prumi-giro-360");
  }, 450);
}

// G23. Estrelas cadentes de fundo quando for noite e tudo estiver feito
function gerarEstrelasCadentesNoite(container, qtd) {
  if (typeof document === "undefined") return [];
  if (verificarPreferenciaMovimentoReduzido()) return [];
  const raiz = container || document.body;
  const total = Math.min(6, Math.max(1, parseInt(qtd, 10) || 3));
  const estrelas = [];

  for (let i = 0; i < total; i++) {
    const e = document.createElement("div");
    e.className = "estrela-cadente-noite";
    const x = Math.random() * 80;
    const y = Math.random() * 40;
    e.style.left = `${x}%`;
    e.style.top = `${y}%`;
    e.style.animationDelay = `${i * 0.25}s`;
    raiz.appendChild(e);
    estrelas.push(e);
    setTimeout(
      () => {
        if (e.parentNode) e.parentNode.removeChild(e);
      },
      1100 + i * 250
    );
  }
  return estrelas;
}

// G24. Transição de texto numérico com rolagem de odômetro vertical
function animarOdometroVerticalGotas(elOdometro, valorNovo) {
  if (!elOdometro || typeof elOdometro.innerHTML === "undefined") return;
  const num = Math.max(0, parseInt(valorNovo, 10) || 0);
  elOdometro.classList.add("odometro-coluna-numerica");
  elOdometro.textContent = String(num);
  elOdometro.setAttribute("data-valor", String(num));
}

// G25. Sombra projetada dinâmica que muda de ângulo com a hora do dia
function calcularAnguloSombraHoraDia(hora) {
  const h = typeof hora === "number" ? hora : new Date().getHours();
  // 6h manhã: sombra longa para a esquerda (-45deg, 6px)
  // 12h meio-dia: sombra vertical curta (0deg, 2px)
  // 18h entardecer: sombra longa para a direita (45deg, 6px)
  // Noite: sombra suave central
  if (h < 6 || h >= 19) {
    return { offsetX: 0, offsetY: 2, blur: 6, opacidade: 0.12 };
  }
  const progresso = (h - 6) / 12; // 0 a 1
  const offsetX = Math.round((progresso - 0.5) * 12);
  const offsetY = Math.round(2 + Math.abs(progresso - 0.5) * 4);
  const opacidade = Math.round((0.15 + (1 - Math.abs(progresso - 0.5) * 0.4) * 0.1) * 100) / 100;
  return { offsetX, offsetY, blur: 6, opacidade };
}

// G26. Balanço de corda suspensa nas placas dos mundos na loja
function animarPlacaMundoBalancando(elPlaca, ativo) {
  if (!elPlaca || typeof elPlaca.classList !== "object") return;
  if (ativo && !verificarPreferenciaMovimentoReduzido()) {
    elPlaca.classList.add("placa-mundo-balancando");
  } else {
    elPlaca.classList.remove("placa-mundo-balancando");
  }
}

// G27. Deslize elástico no rodapé quando o usuário chega ao fim da página
function aplicarDeslizeElasticoRodape(elRodape) {
  if (!elRodape || typeof elRodape.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elRodape.classList.remove("rodape-deslize-elastico");
  void elRodape.offsetWidth;
  elRodape.classList.add("rodape-deslize-elastico");
}

// G28. Pulso de alerta vermelho suave em tarefas atrasadas há mais de 3 dias
function aplicarAlertaAtrasoLongoSutil(cardEl, diasAtraso) {
  if (!cardEl || typeof cardEl.classList !== "object") return;
  const dias = parseInt(diasAtraso, 10) || 0;
  if (dias >= 3 && !verificarPreferenciaMovimentoReduzido()) {
    cardEl.classList.add("alerta-atraso-vermelho-sutil");
    cardEl.setAttribute("data-dias-atraso", String(dias));
  } else {
    cardEl.classList.remove("alerta-atraso-vermelho-sutil");
  }
}

// G29. Efeito de abrir cortina no quarto ao iniciar o dia pela primeira vez
function animarAberturaCortinaQuarto(elCortina) {
  if (!elCortina || typeof elCortina.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elCortina.classList.add("cortina-abrindo-quarto");
}

// G30. Efeito de fechar persiana no quarto ao bater a meta noturna
function animarFechamentoPersianaQuarto(elPersiana) {
  if (!elPersiana || typeof elPersiana.classList !== "object") return;
  if (verificarPreferenciaMovimentoReduzido()) return;
  elPersiana.classList.add("persiana-fechando-quarto");
}

// G31. Otimização no carregamento de fontes secundárias sem bloquear pintura
function otimizarCarregamentoFontesSecundarias(idLink = "fontes-mundos") {
  if (typeof document === "undefined") return false;
  const link = document.getElementById(idLink);
  if (link && link.media === "print") {
    link.media = "all";
    return true;
  }
  return false;
}

// G32. Preservação de foco ativo ao re-renderizar conteúdo
function preservarFocoElemento(container, fnAcao) {
  if (typeof document === "undefined") return null;
  const ativo = document.activeElement;
  const seletor =
    ativo && ativo.id
      ? `#${ativo.id}`
      : ativo && ativo.getAttribute && ativo.getAttribute("data-tab")
        ? `[data-tab="${ativo.getAttribute("data-tab")}"]`
        : null;
  if (typeof fnAcao === "function") fnAcao();
  if (seletor && container && typeof container.querySelector === "function") {
    const novo = container.querySelector(seletor);
    if (novo && typeof novo.focus === "function") {
      novo.focus();
      return novo;
    }
  }
  return null;
}

// G33. Preservação da posição de rolagem em containers de tarefas
function preservarPosicaoScrollContainer(container, fnAcao) {
  if (!container || typeof container !== "object") return 0;
  const topo = container.scrollTop || 0;
  if (typeof fnAcao === "function") fnAcao();
  container.scrollTop = topo;
  return topo;
}

// G34. Pool de contexto 2D e dimensões de Canvas para partículas
const _canvasPoolCache = new WeakMap();
function obterPoolCanvasParticulas(canvas) {
  if (!canvas || typeof canvas.getContext !== "function") return null;
  if (_canvasPoolCache.has(canvas)) return _canvasPoolCache.get(canvas);
  const ctx = canvas.getContext("2d");
  const info = { ctx, largura: canvas.width || 0, altura: canvas.height || 0 };
  _canvasPoolCache.set(canvas, info);
  return info;
}

// G35. Cache seletivo em Map de elementos DOM frequentes
const _domCacheMap = new Map();
function obterElementoCache(id) {
  if (typeof document === "undefined" || !id) return null;
  if (_domCacheMap.has(id)) {
    const el = _domCacheMap.get(id);
    if (el && el.isConnected) return el;
  }
  const el = document.getElementById(id);
  if (el) _domCacheMap.set(id, el);
  return el;
}

// G36. Download nativo de backup JSON no navegador via Blob
function baixarBackupJsonNavegador(dados, nomeArquivo) {
  if (typeof Blob === "undefined" || typeof document === "undefined") return false;
  try {
    const texto = typeof dados === "string" ? dados : JSON.stringify(dados, null, 2);
    const blob = new Blob([texto], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo || "prumo-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (e) {
    return false;
  }
}

// G37. Download nativo de arquivo de calendário ICS via Blob
function baixarArquivoIcsNavegador(conteudoIcs, nomeArquivo) {
  if (typeof Blob === "undefined" || typeof document === "undefined") return false;
  try {
    const blob = new Blob([conteudoIcs || ""], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo || "lembrete.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (e) {
    return false;
  }
}

// G38. Cálculo correto de prioridades por quantidade de pontos de exclamação
function calcularPrioridadeExclamacoes(textoExclamacao) {
  const str = String(textoExclamacao || "").trim();
  if (str === "!!!") return 3; // alta
  if (str === "!!") return 2;  // média
  if (str === "!") return 1;   // baixa
  return 0;
}

// G39. Verificação de cota excedida de armazenamento no LocalStorage
function verificarCotaArmazenamento(erro) {
  if (!erro || typeof erro !== "object") return { excedeu: false, mensagem: "" };
  const nome = erro.name || "";
  const codigo = erro.code || 0;
  const ehCota =
    nome === "QuotaExceededError" ||
    nome === "NS_ERROR_DOM_QUOTA_REACHED" ||
    codigo === 22 ||
    codigo === 1014;
  return {
    excedeu: ehCota,
    mensagem: ehCota ? "Armazenamento cheio no navegador. Exporte um backup." : (erro.message || "")
  };
}

// G40. Tratamento global de atalhos de teclado (1-5 abas, N nova tarefa, Esc fechar)
function tratarAtalhoTecladoGeral(evento, callbackAba, callbackNova, callbackFechar) {
  if (!evento || typeof evento !== "object") return null;
  const target = evento.target;
  const isInput =
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable);

  if (evento.key === "Escape") {
    if (typeof callbackFechar === "function") callbackFechar();
    return "escape";
  }

  if (isInput || evento.ctrlKey || evento.metaKey || evento.altKey) return null;

  if (evento.key === "n" || evento.key === "N") {
    if (typeof callbackNova === "function") callbackNova();
    return "nova";
  }

  const mapaAbas = { "1": "hoje", "2": "estudos", "3": "dieta", "4": "social", "5": "prumi" };
  if (mapaAbas[evento.key]) {
    const aba = mapaAbas[evento.key];
    if (typeof callbackAba === "function") callbackAba(aba);
    return aba;
  }

  return null;
}
// G41. Fatiamento em chunks de listas longas de tarefas para renderização fluida
function fatiarListaTarefasVisiveis(lista, pagina = 1, porPagina = 20) {
  if (!Array.isArray(lista)) return [];
  const p = Math.max(1, parseInt(pagina, 10) || 1);
  const qtd = Math.max(1, parseInt(porPagina, 10) || 20);
  const inicio = (p - 1) * qtd;
  return lista.slice(inicio, inicio + qtd);
}

// G42. Efeito de descompressão elástica ao puxar para atualizar (Pull-to-refresh)
function aplicarEfeitoPullParaAtualizar(container, offsetY) {
  if (!container || typeof container.style !== "object") return 0;
  if (verificarPreferenciaMovimentoReduzido()) return 0;
  const dist = Math.max(0, Math.min(80, offsetY || 0));
  const escala = 1 + dist * 0.0015;
  container.style.transform = `translateY(${dist}px) scale(${escala})`;
  container.classList.add("pull-atualizar-indicador");
  return dist;
}

// G43. Vibração tátil sutil (Haptic Feedback) com navigator.vibrate
function dispararVibracaoTatil(tipo = "suave") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return false;
  try {
    if (tipo === "suave") return navigator.vibrate(10);
    if (tipo === "conclusao") return navigator.vibrate([15, 30, 20]);
    if (tipo === "alerta") return navigator.vibrate([30, 40, 30]);
    return navigator.vibrate(15);
  } catch (e) {
    return false;
  }
}

// G44. Sanitização defensiva contra injeções de HTML, SVG e caracteres perigosos
function sanitizarTextoSeguro(texto) {
  if (texto == null) return "";
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
}

// G45. Validação rigorosa de URLs para links e imagens de perfil
function validarUrlSegura(url) {
  if (!url || typeof url !== "string") return false;
  const limpa = url.trim();
  if (!limpa) return false;
  // Permite protocolos seguros https:, http:, mailto: ou imagens base64/data
  const padraoSeguro = /^(https?:\/\/|mailto:[^@\s]+@[^@\s]+\.[^@\s]+|data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,)/i;
  return padraoSeguro.test(limpa);
}

// G46. Indicador pulsante de contagem regressiva crítica no Pomodoro (< 60s)
function aplicarPulsoContagemCritica(elRelogio, segundosRestantes) {
  if (!elRelogio || typeof elRelogio.classList !== "object") return false;
  const s = parseInt(segundosRestantes, 10) || 0;
  if (s > 0 && s <= 60 && !verificarPreferenciaMovimentoReduzido()) {
    elRelogio.classList.add("pomodoro-critico-pulso");
    return true;
  }
  elRelogio.classList.remove("pomodoro-critico-pulso");
  return false;
}

// G47. Contador de caracteres restantes em notas e títulos com alerta aos 90%
function atualizarContadorCaracteres(inputEl, maximo = 60) {
  if (!inputEl) return { restantes: maximo, critico: false };
  const atual = (inputEl.value || "").length;
  const max = Math.max(1, parseInt(maximo, 10) || 60);
  const restantes = Math.max(0, max - atual);
  const critico = restantes <= Math.ceil(max * 0.1);
  if (inputEl.classList) {
    if (critico) inputEl.classList.add("contador-caracteres-aviso");
    else inputEl.classList.remove("contador-caracteres-aviso");
  }
  return { restantes, critico };
}

// G48. Suporte a tema escuro/claro com transição suave sem piscar
function aplicarTransicaoModoAparencia(elemento, modo) {
  if (!elemento || typeof elemento.classList !== "object") return modo;
  elemento.classList.add("transicao-tema-suave");
  if (modo === "light" || modo === "claro") {
    elemento.setAttribute("data-tema-modo", "light");
  } else {
    elemento.setAttribute("data-tema-modo", "dark");
  }
  setTimeout(() => elemento.classList.remove("transicao-tema-suave"), 350);
  return modo;
}

// G49. Calculadora de meta de hidratação por peso corporal e atividade
function calcularMetaAguaPorPeso(pesoKg, nivelAtividade = "moderado") {
  const peso = Math.max(30, Math.min(250, parseFloat(pesoKg) || 70));
  // Base médica padrão: 35 mL por kg corporal
  let meta = peso * 35;
  if (nivelAtividade === "intenso") meta += 600;
  else if (nivelAtividade === "leve") meta -= 200;
  // Arredonda para múltiplos de 50 mL
  return Math.round(meta / 50) * 50;
}

// G50. Indicador amigável de tarefas recorrentes com badge de frequência
function obterBadgeFrequenciaTarefa(tipoRepeticao) {
  const r = String(tipoRepeticao || "").trim().toLowerCase();
  const mapa = {
    daily: { rotulo: "Todo dia", classe: "badge-frequencia-chip", icone: "🔄" },
    weekdays: { rotulo: "Dias úteis", classe: "badge-frequencia-chip", icone: "💼" },
    weekly: { rotulo: "Toda semana", classe: "badge-frequencia-chip", icone: "📅" },
    monthly: { rotulo: "Todo mês", classe: "badge-frequencia-chip", icone: "🗓️" }
  };
  return mapa[r] || { rotulo: "Única", classe: "", icone: "" };
}
// G51. Alerta sonoro com sintetizador nativo Web Audio API sem arquivos externos
let _sharedAudioCtx = null;
function tocarSomSintetizado(tipo = "click") {
  if (typeof window === "undefined") return false;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  try {
    if (!_sharedAudioCtx) _sharedAudioCtx = new AudioCtx();
    if (_sharedAudioCtx.state === "suspended") _sharedAudioCtx.resume();
    const ctx = _sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const agora = ctx.currentTime;

    if (tipo === "conclusao") {
      // Arpejo de duas notas alegres (C5 -> G5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, agora);
      osc.frequency.exponentialRampToValueAtTime(783.99, agora + 0.12);
      gain.gain.setValueAtTime(0.08, agora);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.28);
      osc.start(agora);
      osc.stop(agora + 0.28);
    } else if (tipo === "aviso") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(349.23, agora);
      osc.frequency.setValueAtTime(261.63, agora + 0.15);
      gain.gain.setValueAtTime(0.1, agora);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.35);
      osc.start(agora);
      osc.stop(agora + 0.35);
    } else {
      // Click sutil
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, agora);
      gain.gain.setValueAtTime(0.04, agora);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.05);
      osc.start(agora);
      osc.stop(agora + 0.05);
    }
    return true;
  } catch (e) {
    return false;
  }
}

// G52. Medidor de intensidade de hábitos com gradiente de medalha/metal
function obterCorIntensidadeHabito(diasSeguidos) {
  const d = parseInt(diasSeguidos, 10) || 0;
  if (d >= 60) return { classe: "habito-gradiente-diamante", nivel: "Diamante", dias: d };
  if (d >= 21) return { classe: "habito-gradiente-ouro", nivel: "Ouro", dias: d };
  if (d >= 7) return { classe: "habito-gradiente-prata", nivel: "Prata", dias: d };
  if (d >= 3) return { classe: "habito-gradiente-bronze", nivel: "Bronze", dias: d };
  return { classe: "", nivel: "Iniciando", dias: d };
}

// G53. Estimativa de tempo total de tarefas do dia
function calcularTempoTotalEstimadoMinutos(tarefas) {
  if (!Array.isArray(tarefas)) return { minutos: 0, formatado: "0 min" };
  let total = 0;
  tarefas.forEach(t => {
    if (!t) return;
    const texto = `${t.title || ""} ${t.dur || ""}`;
    // Procura padrões como "30min", "45m", "1h", "1h30", "2h45m"
    const mH = texto.match(/(\d+)\s*h(?:oras?)?(?:\s*(\d+)\s*m)?/i);
    const mM = texto.match(/(\d+)\s*(?:min|m)(?!h)/i);
    if (mH) {
      total += parseInt(mH[1], 10) * 60 + (mH[2] ? parseInt(mH[2], 10) : 0);
    } else if (mM) {
      total += parseInt(mM[1], 10);
    }
  });
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  const formatado =
    horas > 0 ? `${horas}h${mins > 0 ? ` ${mins}min` : ""}` : `${mins} min`;
  return { minutos: total, formatado };
}

// G54. Formatação humanizada de datas relativas com Intl.RelativeTimeFormat
function formatarDataRelativaIntl(dataAlvo, dataBase) {
  if (!dataAlvo) return "";
  try {
    const parseData = str => {
      if (str instanceof Date) return str;
      const partes = String(str).split("-").map(Number);
      return new Date(partes[0], partes[1] - 1, partes[2]);
    };
    const dtAlvo = parseData(dataAlvo);
    const dtBase = dataBase ? parseData(dataBase) : new Date();
    const diffDias = Math.round((dtAlvo - dtBase) / (1000 * 60 * 60 * 24));
    if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
      return rtf.format(diffDias, "day");
    }
    if (diffDias === 0) return "hoje";
    if (diffDias === 1) return "amanhã";
    if (diffDias === -1) return "ontem";
    return diffDias > 0 ? `em ${diffDias} dias` : `há ${Math.abs(diffDias)} dias`;
  } catch (e) {
    return String(dataAlvo);
  }
}

// G55. Modo foco estrito: recolhimento de distrações
function aplicarModoFocoEstrito(container, ativo = true) {
  const el = container || (typeof document !== "undefined" ? document.body : null);
  if (!el || typeof el.classList !== "object") return false;
  if (ativo) {
    el.classList.add("modo-foco-estrito-ativo");
  } else {
    el.classList.remove("modo-foco-estrito-ativo");
  }
  return ativo;
}

// G56. Agrupamento de tarefas por período do dia (Manhã, Tarde, Noite)
function agruparTarefasPorPeriodo(tarefas) {
  const grupos = { manha: [], tarde: [], noite: [], flexivel: [] };
  if (!Array.isArray(tarefas)) return grupos;
  tarefas.forEach(t => {
    if (!t) return;
    const hora = t.time ? parseInt(t.time.split(":")[0], 10) : NaN;
    if (isNaN(hora)) grupos.flexivel.push(t);
    else if (hora < 12) grupos.manha.push(t);
    else if (hora < 18) grupos.tarde.push(t);
    else grupos.noite.push(t);
  });
  return grupos;
}

// G57. Comparativo de hidratação semanal com média diária
function calcularMediaAguaSemanal(historicoAgua, metaDiaria = 2500, dias = 7) {
  if (!historicoAgua || typeof historicoAgua !== "object") {
    return { mediaML: 0, porcentagemMeta: 0, totalML: 0 };
  }
  const meta = Math.max(500, parseInt(metaDiaria, 10) || 2500);
  const chaves = Object.keys(historicoAgua).sort().slice(-dias);
  if (!chaves.length) return { mediaML: 0, porcentagemMeta: 0, totalML: 0 };
  let soma = 0;
  chaves.forEach(d => {
    const copos = historicoAgua[d];
    if (Array.isArray(copos)) {
      copos.forEach(c => (soma += c.ml || 0));
    }
  });
  const mediaML = Math.round(soma / chaves.length);
  const porcentagemMeta = Math.min(100, Math.round((mediaML / meta) * 100));
  return { mediaML, porcentagemMeta, totalML: soma };
}

// G58. Detecção e aviso de sono irregular
function verificarJanelaSonoSaudavel(horaAcordar = "07:00", horaDormir = "23:00") {
  const toMin = h => {
    const [hh, mm] = String(h || "00:00").split(":").map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };
  const minAcordar = toMin(horaAcordar);
  const minDormir = toMin(horaDormir);
  let duracaoMin = minAcordar - minDormir;
  if (duracaoMin <= 0) duracaoMin += 24 * 60;
  const horas = Math.round((duracaoMin / 60) * 10) / 10;
  const saudavel = horas >= 7 && horas <= 9.5;
  const aviso =
    horas < 6
      ? `Sono curto (${horas}h). Tente dormir um pouco mais cedo.`
      : horas > 10
        ? `Sono longo (${horas}h). Cuidado com o cansaço excessivo.`
        : `Janela saudável (${horas}h). Ritmo excelente!`;
  return { horas, saudavel, aviso };
}

// G59. Indicador de checklist/subtarefas com barra de preenchimento
function gerarBarraProgressoSubtarefas(subtarefas) {
  if (!Array.isArray(subtarefas) || !subtarefas.length) {
    return { total: 0, concluidas: 0, porcentagem: 0, rotulo: "" };
  }
  const total = subtarefas.length;
  const concluidas = subtarefas.filter(s => s && s.done).length;
  const porcentagem = Math.round((concluidas / total) * 100);
  const rotulo = `${concluidas}/${total} concluídas (${porcentagem}%)`;
  return { total, concluidas, porcentagem, rotulo };
}

// G60. Sistema de Desfazer em fila (Undo Stack com histórico de até N ações)
function criarFilaDesfazer(tamanhoMaximo = 5) {
  const pilha = [];
  const max = Math.max(1, parseInt(tamanhoMaximo, 10) || 5);
  return {
    push(estado) {
      if (estado == null) return;
      pilha.push(typeof estado === "object" ? JSON.stringify(estado) : String(estado));
      if (pilha.length > max) pilha.shift();
    },
    pop() {
      const item = pilha.pop();
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    },
    tamanho() {
      return pilha.length;
    },
    limpar() {
      pilha.length = 0;
    }
  };
}
// G61. Algoritmo SM-2 para Repetição Espaçada com intervalos dinâmicos
function calcularRevisaoEspacadaSM2(passoAtual = 0, notaFacilidade = 4, fatorFacilidade = 2.5) {
  const nota = Math.max(1, Math.min(5, parseInt(notaFacilidade, 10) || 4));
  let ff = Math.max(1.3, fatorFacilidade + (0.1 - (5 - nota) * (0.08 + (5 - nota) * 0.02)));
  let proximoPasso = passoAtual + 1;
  let intervaloDias = 1;
  if (nota < 3) {
    proximoPasso = 0;
    intervaloDias = 1;
  } else if (proximoPasso === 1) {
    intervaloDias = 1;
  } else if (proximoPasso === 2) {
    intervaloDias = 6;
  } else {
    intervaloDias = Math.round(6 * Math.pow(ff, proximoPasso - 2));
  }
  return { passo: proximoPasso, intervaloDias, fatorFacilidade: Math.round(ff * 100) / 100 };
}

// G62. Distribuição percentual de tempo de estudo por disciplina
function calcularDistribuicaoTempoEstudo(sessoes) {
  if (!Array.isArray(sessoes) || !sessoes.length) return [];
  const mapSubj = {};
  let total = 0;
  sessoes.forEach(s => {
    if (!s) return;
    const sid = s.subjectId || "geral";
    const min = parseInt(s.min, 10) || 0;
    mapSubj[sid] = (mapSubj[sid] || 0) + min;
    total += min;
  });
  if (total === 0) return [];
  return Object.entries(mapSubj).map(([sid, min]) => ({
    subjectId: sid,
    minutos: min,
    porcentagem: Math.round((min / total) * 100)
  })).sort((a, b) => b.minutos - a.minutos);
}

// G63. Grade horária semanal organizada por dia e horário
function gerarGradeHorariaSemanal(aulas) {
  const grade = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  if (!Array.isArray(aulas)) return grade;
  aulas.forEach(a => {
    if (!a) return;
    const dia = parseInt(a.day, 10);
    if (grade[dia]) grade[dia].push(a);
  });
  Object.keys(grade).forEach(d => {
    grade[d].sort((a, b) => String(a.start || "").localeCompare(String(b.start || "")));
  });
  return grade;
}

// G64. Contador de ciclos de Pomodoro com indicação para pausa longa
function calcularContadorCiclosPomodoro(sessoesHoje, cicloMax = 4) {
  const n = Math.max(0, parseInt(sessoesHoje, 10) || 0);
  const max = Math.max(1, parseInt(cicloMax, 10) || 4);
  const cicloAtual = (n % max) + 1;
  const pausaLonga = n > 0 && n % max === 0;
  return { sessoesTotais: n, cicloAtual, pausaLonga, totalCiclos: Math.floor(n / max) };
}

// G65. Gerador de som de foco (ruído suave senoidal) via Web Audio
function obterRuidoBrancoFoco(tipo = "suave") {
  if (typeof window === "undefined") return false;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = tipo === "binaural" ? 220 : 400;
    noise.connect(filter);
    filter.connect(ctx.destination);
    noise.start();
    return () => {
      try { noise.stop(); ctx.close(); } catch (e) {}
    };
  } catch (e) {
    return false;
  }
}

// G66. Avaliação de taxa de retenção e acertos em revisões do mês
function avaliarDesempenhoRevisao(revisoes) {
  if (!Array.isArray(revisoes) || !revisoes.length) return { taxa: 0, concluidas: 0, total: 0 };
  const concluidas = revisoes.filter(r => r && r.done).length;
  const taxa = Math.round((concluidas / revisoes.length) * 100);
  return { taxa, concluidas, total: revisoes.length };
}

// G67. Contagem regressiva em dias até a data da prova
function calcularContadorDiasAteProva(dataProva, dataAtual) {
  if (!dataProva) return 0;
  const dP = new Date(String(dataProva).replace(/-/g, "/"));
  const dA = dataAtual ? new Date(String(dataAtual).replace(/-/g, "/")) : new Date();
  const diffTime = dP.getTime() - dA.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// G68. Checklist e progresso percentual de conteúdos para prova
function gerarChecklistConteudoProva(topicos) {
  if (!Array.isArray(topicos) || !topicos.length) return { total: 0, estudados: 0, porcentagem: 0 };
  const estudados = topicos.filter(t => t && (t.done || t.estudado)).length;
  const porcentagem = Math.round((estudados / topicos.length) * 100);
  return { total: topicos.length, estudados, porcentagem };
}

// G69. Calculadora de nota necessária em prova final
function calcularMediaNecessariaProva(nota1, nota2, peso1 = 2, peso2 = 3, mediaAlvo = 6.0) {
  const n1 = parseFloat(nota1) || 0;
  const n2 = parseFloat(nota2) || 0;
  const p1 = parseFloat(peso1) || 1;
  const p2 = parseFloat(peso2) || 1;
  const alvo = parseFloat(mediaAlvo) || 6.0;
  const pesoFinal = 3;
  const somaAtual = n1 * p1 + n2 * p2;
  const somaTotalPesos = p1 + p2 + pesoFinal;
  const necessaria = (alvo * somaTotalPesos - somaAtual) / pesoFinal;
  return Math.max(0, Math.round(necessaria * 10) / 10);
}

// G70. Snapshot estruturado de sessão de estudo para log histórico
function gerarSnapshotSessaoFoco(materiaId, duracaoMin, notas = "") {
  return {
    id: "sess_" + Date.now(),
    subjectId: materiaId || "geral",
    minutos: Math.max(1, parseInt(duracaoMin, 10) || 25),
    notas: String(notas || "").trim(),
    concluidoEm: new Date().toISOString()
  };
}

// G71. Meta dinâmica de hidratação esperada para o horário atual
function calcularHidratacaoHorarioRitmo(metaTotal = 2500, horaAcordar = "07:00", horaDormir = "23:00", horaAtual) {
  const toMin = h => {
    const [hh, mm] = String(h || "00:00").split(":").map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };
  const minAcordar = toMin(horaAcordar);
  const minDormir = toMin(horaDormir);
  let janelaMin = minDormir - minAcordar;
  if (janelaMin <= 0) janelaMin += 24 * 60;
  const d = horaAtual ? (horaAtual instanceof Date ? horaAtual : new Date()) : new Date();
  const minAtual = d.getHours() * 60 + d.getMinutes();
  let decorrido = minAtual - minAcordar;
  if (decorrido < 0) decorrido = 0;
  if (decorrido > janelaMin) decorrido = janelaMin;
  const proporcao = decorrido / janelaMin;
  return Math.round(metaTotal * proporcao);
}

// G72. Estrutura organizada de refeições diárias
function gerarDiarioAlimentarRefeicao(refeicoes = {}, dia = 0) {
  const diaObj = refeicoes[dia] || {};
  return {
    cafe: diaObj.cafe || "",
    almoco: diaObj.almoco || "",
    lanche: diaObj.lanche || "",
    jantar: diaObj.jantar || "",
    registrado: !!(diaObj.cafe || diaObj.almoco || diaObj.lanche || diaObj.jantar)
  };
}

// G73. Medição de consumo de cafeína com alerta de horário
function calcularConsumoCafeinaDia(xicarasCafe = 0, horaUltimaXicara = 12) {
  const x = Math.max(0, parseInt(xicarasCafe, 10) || 0);
  const mgTotal = x * 80;
  const hora = parseInt(horaUltimaXicara, 10) || 12;
  const alertaSono = hora >= 16 && x > 0;
  const excesso = mgTotal > 400;
  return { xicaras: x, cafeinaMg: mgTotal, alertaSono, excesso };
}

// G74. Estado visual de hidratação do Prumi
function obterStatusDesidratacaoPrumi(mlIngerido, mlEsperado) {
  const ing = Math.max(0, parseInt(mlIngerido, 10) || 0);
  const esp = Math.max(1, parseInt(mlEsperado, 10) || 1);
  const pct = ing / esp;
  if (pct >= 1.0) return { status: "radiante", humor: "party", label: "Meta batida ou no ritmo!" };
  if (pct >= 0.75) return { status: "hidratado", humor: "happy", label: "Boa hidratação" };
  if (pct >= 0.45) return { status: "seco", humor: "normal", label: "Hora de beber água" };
  return { status: "murcho", humor: "worried", label: "Abaixo da meta!" };
}

// G75. Matriz mensal de atingimento de água para heatmap
function gerarHistoricoMensalAguaHeatmap(historicoAgua = {}, mes, ano, metaDiaria = 2500) {
  const m = mes != null ? mes : new Date().getMonth();
  const y = ano != null ? ano : new Date().getFullYear();
  const diasNoMes = new Date(y, m + 1, 0).getDate();
  const matriz = [];
  for (let d = 1; d <= diasNoMes; d++) {
    const chave = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const lista = historicoAgua[chave] || [];
    const total = Array.isArray(lista) ? lista.reduce((acc, c) => acc + (c.ml || 0), 0) : 0;
    const porcentagem = Math.min(100, Math.round((total / metaDiaria) * 100));
    matriz.push({ dia: d, data: chave, totalML: total, porcentagem });
  }
  return matriz;
}

// G76. Fator de compensação de hidratação por clima quente
function calcularFatorCompensacaoClima(temperaturaC = 25, mlBase = 2500) {
  const temp = parseFloat(temperaturaC) || 25;
  if (temp > 30) return mlBase + 600;
  if (temp > 26) return mlBase + 300;
  return mlBase;
}

// G77. Agrupamento de itens de lista de compras por categoria
function gerarListaComprasAgrupada(itens = []) {
  const categorias = { hortifruti: [], mercearia: [], laticinios: [], limpeza: [], outros: [] };
  if (!Array.isArray(itens)) return categorias;
  itens.forEach(it => {
    if (!it) return;
    const cat = it.categoria && categorias[it.categoria] ? it.categoria : "outros";
    categorias[cat].push(it);
  });
  return categorias;
}

// G78. Verificação de alimentos próximos ao vencimento
function verificarValidadeAlimentos(dispensa = [], dataAtual) {
  if (!Array.isArray(dispensa)) return [];
  const dA = dataAtual ? new Date(String(dataAtual).replace(/-/g, "/")) : new Date();
  return dispensa.filter(item => {
    if (!item || !item.validade) return false;
    const dV = new Date(String(item.validade).replace(/-/g, "/"));
    const diffDias = Math.ceil((dV.getTime() - dA.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias <= 3;
  });
}

// G79. Sequência contínua de dias cumprindo a meta de água
function calcularSequenciaDiasAguaBatida(historicoAgua = {}, metaDiaria = 2500, dataBase) {
  const meta = Math.max(500, parseInt(metaDiaria, 10) || 2500);
  const parseDt = s => new Date(String(s).replace(/-/g, "/"));
  let d = dataBase ? parseDt(dataBase) : new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const copos = historicoAgua[chave];
    const total = Array.isArray(copos) ? copos.reduce((acc, c) => acc + (c.ml || 0), 0) : 0;
    if (total >= meta) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// G80. Dicas contextuais de saúde baseadas no ritmo do dia
function gerarDicaSaudeDia(humor = "normal", nivelAguaPct = 50, tarefasFeitas = 0) {
  if (nivelAguaPct < 40) return "Dica: tome um copo d'água agora para manter o foco afiado!";
  if (tarefasFeitas >= 5 && humor === "party") return "Produtividade lá no alto! Lembre-se de descansar a vista e alongar.";
  if (humor === "worried") return "Respira fundo: priorize só o essencial hoje e deixe o resto para amanhã.";
  return "Mantenha o ritmo leve: um passo de cada vez constrói sua rotina.";
}

// G81. Congelamento de sequência de hábito usando moedas/gotas
function aplicarCongelamentoHabito(habito, saldoGotas = 0, custo = 50) {
  if (!habito) return { sucesso: false, saldoRestante: saldoGotas };
  if (saldoGotas < custo) return { sucesso: false, saldoRestante: saldoGotas, motivo: "Gotas insuficientes" };
  habito.congeladoAte = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return { sucesso: true, saldoRestante: saldoGotas - custo, habito };
}

// G82. Índice percentual de consistência de hábitos nos últimos 30 dias
function calcularIndiceConsistenciaHabito(logsHabito = {}, dias = 30) {
  let concluidos = 0;
  const d = new Date();
  for (let i = 0; i < dias; i++) {
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (logsHabito[chave]) concluidos++;
    d.setDate(d.getDate() - 1);
  }
  return Math.round((concluidos / dias) * 100);
}

// G83. Agrupamento de contatos sociais por status de periodicidade
function agruparContatosPorFrequencia(pessoas = [], dataAtual) {
  const grupos = { hoje: [], emDia: [], atrasados: [] };
  if (!Array.isArray(pessoas)) return grupos;
  const hojeStr = dataAtual || new Date().toISOString().slice(0, 10);
  pessoas.forEach(p => {
    if (!p) return;
    const frequencia = parseInt(p.every, 10) || 0;
    if (!frequencia) { grupos.emDia.push(p); return; }
    if (!p.last) { grupos.atrasados.push(p); return; }
    const dLast = new Date(String(p.last).replace(/-/g, "/"));
    const dHoje = new Date(String(hojeStr).replace(/-/g, "/"));
    const diffDias = Math.floor((dHoje - dLast) / (1000 * 60 * 60 * 24));
    if (diffDias === frequencia) grupos.hoje.push(p);
    else if (diffDias > frequencia) grupos.atrasados.push(p);
    else grupos.emDia.push(p);
  });
  return grupos;
}

// G84. Cálculo da idade que o contato completará no próximo aniversário
function calcularIdadeAniversariante(dataNascimento, dataAtual) {
  if (!dataNascimento) return 0;
  const dNasc = new Date(String(dataNascimento).replace(/-/g, "/"));
  const dRef = dataAtual ? new Date(String(dataAtual).replace(/-/g, "/")) : new Date();
  let idade = dRef.getFullYear() - dNasc.getFullYear();
  return Math.max(0, idade);
}

// G85. Templates simpáticos de felicitações de aniversário
function gerarTemplateMensagemAniversario(nomePessoa = "amigo", estilo = "amigo") {
  const nome = String(nomePessoa || "").trim();
  if (estilo === "formal") return `Parabéns pelo seu dia, ${nome}! Muita saúde, sucesso e realizações. Um forte abraço!`;
  if (estilo === "parceiro") return `Feliz aniversário, meu amor! Que alegria celebrar sua vida hoje e sempre. Amo você, ${nome}!`;
  return `Feliz aniversário, ${nome}! 🎉 Tudo de melhor hoje e sempre, muita saúde e conquistas! Bora comemorar!`;
}

// G86. Média e distribuição de humores do fechamento do dia no mês
function analisarHumorDiarioMensal(diarios = {}) {
  const entradas = Object.values(diarios || {});
  if (!entradas.length) return { media: 0, total: 0 };
  let soma = 0;
  let contagem = 0;
  entradas.forEach(e => {
    if (e && e.humor != null) {
      soma += parseInt(e.humor, 10) || 3;
      contagem++;
    }
  });
  return { media: contagem ? Math.round((soma / contagem) * 10) / 10 : 0, total: contagem };
}

// G87. Perguntas reflexivas guiadas rotativas para fechamento noturno
function obterPerguntasReflexivasDiario(diaIndice = 0) {
  const perguntas = [
    "Pelo que você é mais grato no dia de hoje?",
    "Qual foi a vitória ou aprendizado que mais te marcou hoje?",
    "O que você faria diferente se pudesse recomeçar o dia?",
    "Quem fez o seu dia mais leve ou mereceu um agradecimento?",
    "Qual é a sua principal intenção ou prioridade para amanhã?"
  ];
  const idx = Math.abs(parseInt(diaIndice, 10) || 0) % perguntas.length;
  return perguntas[idx];
}

// G88. Sequência de noites fechando o dia no diário
function calcularDiasSeguidosFechandoDia(diarios = {}, dataAtual) {
  const parseDt = s => new Date(String(s).replace(/-/g, "/"));
  let d = dataAtual ? parseDt(dataAtual) : new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (diarios[chave] && diarios[chave].closed) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// G89. Ficha de ideias de presentes e preferências anotadas para contatos
function gerarCartaoPresenteContato(contato = {}, novasSugestoes = []) {
  const presentes = Array.isArray(contato.presentes) ? [...contato.presentes] : [];
  if (Array.isArray(novasSugestoes)) {
    novasSugestoes.forEach(s => { if (s && !presentes.includes(s)) presentes.push(s); });
  }
  return { id: contato.id, nome: contato.name || "Contato", sugestoes: presentes };
}

// G90. Resumo consolidado de rotina semanal
function formatarRelatorioRotinaSemanal(dados = {}) {
  const tarefasFeitas = parseInt(dados.tarefasFeitas, 10) || 0;
  const aguaMediaML = parseInt(dados.aguaMediaML, 10) || 0;
  const minutosFoco = parseInt(dados.minutosFoco, 10) || 0;
  const habitosConsistentes = parseInt(dados.habitosConsistentes, 10) || 0;
  return {
    titulo: "Resumo Semanal",
    tarefasFeitas,
    horasFoco: Math.round((minutosFoco / 60) * 10) / 10,
    aguaMediaLitros: Math.round((aguaMediaML / 1000) * 10) / 10,
    habitosConsistentes
  };
}

// G91. Curva progressiva suave de nível e XP (nível 1 ao 100)
function calcularNivelXPProgressivo(xpTotal = 0) {
  const xp = Math.max(0, parseInt(xpTotal, 10) || 0);
  const nivel = Math.floor(Math.sqrt(xp / 50)) + 1;
  const xpBaseNivel = Math.pow(nivel - 1, 2) * 50;
  const xpProximoNivel = Math.pow(nivel, 2) * 50;
  const progressoPct = Math.min(100, Math.round(((xp - xpBaseNivel) / (xpProximoNivel - xpBaseNivel || 1)) * 100));
  return { nivel, xpAtual: xp, xpProximoNivel, progressoPct };
}

// G92. Prévia de provador de roupa e cenário antes de comprar
function gerarPreviaProvadorItem(item = {}, mascoteEstado = {}) {
  if (!item || !item.id) return mascoteEstado;
  const slot = item.slot || "top";
  const novoEquip = Object.assign({}, mascoteEstado.equip || {});
  novoEquip[slot] = item.id;
  return Object.assign({}, mascoteEstado, { equip: novoEquip, provando: item.id });
}

// G93. Filtro avançado do catálogo da loja por categoria, preço e busca
function filtrarCatalogoLoja(itens = [], { categoria = "todos", busca = "", maxPreco = Infinity } = {}) {
  if (!Array.isArray(itens)) return [];
  const term = String(busca || "").toLowerCase().trim();
  return itens.filter(it => {
    if (!it) return false;
    if (categoria !== "todos" && it.slot !== categoria && it.categoria !== categoria) return false;
    if (it.price != null && it.price > maxPreco) return false;
    if (term && !String(it.name || "").toLowerCase().includes(term)) return false;
    return true;
  });
}

// G94. Estatísticas de coleção e guarda-roupa desbloqueado
function calcularEstatisticaColecaoItens(itensPossuidos = [], totalCatalogo = 100) {
  const qtd = Array.isArray(itensPossuidos) ? itensPossuidos.length : 0;
  const total = Math.max(1, parseInt(totalCatalogo, 10) || 100);
  const pct = Math.min(100, Math.round((qtd / total) * 100));
  return { possuidos: qtd, total, porcentagem: pct };
}

// G95. Animações e respostas físicas de interação com o mascote
function obterAnimacaoInteracaoMascote(tipoToque = "barriga") {
  const mapa = {
    barriga: { animacao: "prumi-risada", som: "risada", humor: "happy", fala: "Hehe, isso faz cócegas!" },
    cabeca: { animacao: "prumi-carinho", som: "ronronar", humor: "party", fala: "Adoro um carinho na cabeça!" },
    agitar: { animacao: "prumi-tonto", som: "tonto", humor: "worried", fala: "Opa, que tontura!" }
  };
  return mapa[tipoToque] || mapa.barriga;
}

// G96. Verificação do horário de sono do mascote para animação "Zzz"
function verificarHorarioDormirMascote(horaAtual, horaDormir = "23:00", horaAcordar = "07:00") {
  const d = horaAtual ? (horaAtual instanceof Date ? horaAtual : new Date()) : new Date();
  const hora = d.getHours() + d.getMinutes() / 60;
  const [hD] = horaDormir.split(":").map(Number);
  const [hA] = horaAcordar.split(":").map(Number);
  const dormindo = hD > hA ? (hora >= hD || hora < hA) : (hora >= hD && hora < hA);
  return { dormindo, classeAnimacao: dormindo ? "prumi-dormindo-zzz" : "" };
}

// G97. Gerador de missões diárias com recompensas em gotas
function gerarMissoesDiariasAleatorias(dataSeed = "2026-10-27") {
  const pool = [
    { id: "m_agua", desc: "Bater a meta de água antes das 20h", recompensa: 25 },
    { id: "m_foco", desc: "Completar 45 minutos de foco no timer", recompensa: 30 },
    { id: "m_tarefas", desc: "Concluir 3 tarefas prioritárias", recompensa: 35 },
    { id: "m_habito", desc: "Completar todos os hábitos do dia", recompensa: 20 },
    { id: "m_diario", desc: "Fechar o dia com uma nota no diário", recompensa: 15 }
  ];
  let hash = 0;
  for (let i = 0; i < dataSeed.length; i++) hash = (hash * 31 + dataSeed.charCodeAt(i)) % pool.length;
  const m1 = pool[hash % pool.length];
  const m2 = pool[(hash + 1) % pool.length];
  const m3 = pool[(hash + 2) % pool.length];
  return [m1, m2, m3];
}

// G98. Recompensa e títulos honorários em conquistas
function calcularRecompensaConquista(conquistaId, jaDesbloqueada = false) {
  if (jaDesbloqueada) return { liberada: false, recompensaGotas: 0 };
  const recompensas = {
    produtivo: { gotas: 150, titulo: "Mestre da Execução" },
    oasis: { gotas: 100, titulo: "Hidratado Supremo" },
    monge_foco: { gotas: 120, titulo: "Mente Inabalável" }
  };
  const r = recompensas[conquistaId] || { gotas: 50, titulo: "Conquistador" };
  return { liberada: true, recompensaGotas: r.gotas, titulo: r.titulo };
}

// G99. Mini-jogo rápido para pausa ativa de Pomodoro
function gerarMiniJogoPausaFoco(semente = 1) {
  const jogos = [
    { nome: "Respiração Guiada (4-7-8)", duracaoMin: 3, tipo: "respiracao" },
    { nome: "Alongamento Rápido de Ombros", duracaoMin: 3, tipo: "fisico" },
    { nome: "Descanso Visual 20-20-20", duracaoMin: 2, tipo: "olhos" }
  ];
  const idx = Math.abs(parseInt(semente, 10) || 0) % jogos.length;
  return jogos[idx];
}

// G100. Emblema vetorial comemorativo de metas concluídas
function gerarSeloComemorativoMeta(titulo = "Meta Batida", valor = "100%", mascoteHumor = "party") {
  return {
    titulo,
    valor,
    humor: mascoteHumor,
    classeHtml: "selo-comemorativo-emblema",
    dataCriacao: new Date().toISOString()
  };
}