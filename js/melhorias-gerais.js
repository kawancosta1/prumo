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
