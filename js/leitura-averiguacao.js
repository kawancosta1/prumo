/*
  leitura-averiguacao.js - Sistema Lúdico de Averiguação da Leitura do Prumo
  Torna a verificação do que foi lido uma experiência divertida e afetiva com o Mascote,
  concedendo petiscos literários, carimbos com impacto e figurinhas colecionáveis na estante.
*/
"use strict";

const CARTAS_DESAFIO_LEITURA = [
  {
    id: "spoiler_emojis",
    icone: "🎭",
    titulo: "Spoiler sem Contexto",
    sub: "Resuma o trecho em 3 emojis e poucas palavras!",
    placeholder: "Ex: 🧙‍♂️⚔️💍 - Jogaram o anel no vulcão e salvaram a terra média!"
  },
  {
    id: "conselho_autor",
    icone: "☕",
    titulo: "Papo com o Autor",
    sub: "Se o autor tomasse um café com você, que conselho ele te daria?",
    placeholder: "Ex: Pare de reclamar do trânsito e comece a ler na fila."
  },
  {
    id: "super_poder",
    icone: "⚡",
    titulo: "Super Poder Prático",
    sub: "Qual ideia ou habilidade desse livro você vai aplicar na vida real?",
    placeholder: "Ex: A regra dos 2 minutos: se demora menos de 2min, faço na hora."
  },
  {
    id: "pet_papagaio",
    icone: "🦜",
    titulo: "Ensine para o Mascote",
    sub: "Explique o conceito em 1 frase simples para seu bichinho!",
    placeholder: "Ex: A gravidade não é uma força, é a dobra que as massas fazem no espaço!"
  }
];

const HUMORES_LIVRO = [
  { id: "mindblown", label: "🤯 Explodiu a Mente" },
  { id: "wisdom", label: "💡 Pura Sabedoria" },
  { id: "emotional", label: "😭 Lágrimas & Emoção" },
  { id: "hype", label: "🚀 Adrenalina Pura" },
  { id: "chill", label: "☕ Calmo & Poético" }
];

const PETISCOS_LITERARIOS = {
  ficcao: { nome: "Biscoito Galáctico Estelar", icone: "🍪✨", xp: 35 },
  filosofia: { nome: "Pão de Sabedoria Dourado", icone: "🥖🌟", xp: 40 },
  romance: { nome: "Morango Encantado", icone: "🍓💖", xp: 30 },
  autoajuda: { nome: "Elixir do Foco e Energia", icone: "🧪⚡", xp: 35 },
  geral: { nome: "Petisco Mágico da Leitura", icone: "🧁🎉", xp: 30 }
};

let _cartaSelecionadaId = "spoiler_emojis";
let _humorSelecionadoId = "mindblown";
let _livroAveriguandoId = null;

function obterAveriguacaoLivro(livroId) {
  if (typeof S === "undefined" || !S.averiguacoes) return null;
  return S.averiguacoes[livroId] || null;
}

function abrirModalAveriguacao(livroId, tituloLivro = "Livro") {
  _livroAveriguandoId = livroId;
  _cartaSelecionadaId = "spoiler_emojis";
  _humorSelecionadoId = "mindblown";

  if (typeof document === "undefined") return;

  const modalExistente = document.getElementById("modal-averiguacao-leitura");
  if (modalExistente) modalExistente.remove();

  const petNome = (typeof S !== "undefined" && S.pet && S.pet.nome) ? S.pet.nome : "Seu Mascote";
  const petIcone = (typeof S !== "undefined" && S.pet && S.pet.tipo === "gato") ? "🐱" : "🐶";

  const modalHtml = `
    <div id="modal-averiguacao-leitura" class="modal-averiguacao-fundo" onclick="fecharModalAveriguacaoSeFundo(event)">
      <div class="modal-averiguacao-caixa" onclick="event.stopPropagation()">
        <div class="pet-conversa-cabecalho">
          <div class="pet-avatar-animado">${petIcone}</div>
          <div class="pet-fala-balao">
            <strong>${petNome}:</strong> "Oba, hora da leitura! O que a gente acabou de aprender em <em>${tituloLivro}</em>? Escolha um desafio rápido!"
          </div>
        </div>

        <div class="grade-cartas-desafio">
          ${CARTAS_DESAFIO_LEITURA.map(c => `
            <button type="button" class="carta-desafio-btn ${c.id === _cartaSelecionadaId ? 'ativa' : ''}" 
                    data-carta-id="${c.id}" onclick="trocarCartaDesafio('${c.id}')">
              <span class="carta-icone">${c.icone}</span>
              <span class="carta-titulo">${c.titulo}</span>
              <span class="carta-sub">${c.sub}</span>
            </button>
          `).join("")}
        </div>

        <textarea id="resposta-averiguacao-txt" class="campo-resposta-averiguacao" 
                  placeholder="${CARTAS_DESAFIO_LEITURA[0].placeholder}"></textarea>

        <div class="tags-humor-livro">
          ${HUMORES_LIVRO.map(h => `
            <button type="button" class="btn-tag-humor ${h.id === _humorSelecionadoId ? 'ativa' : ''}" 
                    data-humor-id="${h.id}" onclick="trocarHumorLivro('${h.id}')">
              ${h.label}
            </button>
          `).join("")}
        </div>

        <button type="button" class="btn-carimbar-leitura" onclick="confirmarAveriguacao()">
          <span>🔏 Carimbar Estante & Alimentar Pet!</span>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function fecharModalAveriguacao() {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("modal-averiguacao-leitura");
  if (modal) modal.remove();
}

function fecharModalAveriguacaoSeFundo(e) {
  if (e.target && e.target.classList.contains("modal-averiguacao-fundo")) {
    fecharModalAveriguacao();
  }
}

function trocarCartaDesafio(cartaId) {
  _cartaSelecionadaId = cartaId;
  const carta = CARTAS_DESAFIO_LEITURA.find(c => c.id === cartaId);
  const txtArea = document.getElementById("resposta-averiguacao-txt");
  if (txtArea && carta) {
    txtArea.placeholder = carta.placeholder;
  }
  document.querySelectorAll(".carta-desafio-btn").forEach(btn => {
    btn.classList.toggle("ativa", btn.getAttribute("data-carta-id") === cartaId);
  });
}

function trocarHumorLivro(humorId) {
  _humorSelecionadoId = humorId;
  document.querySelectorAll(".btn-tag-humor").forEach(btn => {
    btn.classList.toggle("ativa", btn.getAttribute("data-humor-id") === humorId);
  });
}

function confirmarAveriguacao() {
  const txtArea = document.getElementById("resposta-averiguacao-txt");
  const resposta = txtArea ? txtArea.value.trim() : "";

  const dados = {
    livroId: _livroAveriguandoId || "livro_demo",
    cartaId: _cartaSelecionadaId,
    humorId: _humorSelecionadoId,
    resposta: resposta || "Leitura absorvida com sucesso!",
    data: new Date().toISOString(),
    petiscoConcedido: "Petisco Mágico da Leitura"
  };

  salvarAveriguacaoNoEstado(dados);
  fecharModalAveriguacao();

  // Toast comemorativo de feedback
  if (typeof window !== "undefined" && typeof window.toast === "function") {
    window.toast("🎉 Leitura averiguada! Seu mascote adorou o petisco!");
  }
}

function salvarAveriguacaoNoEstado(dados) {
  if (typeof S === "undefined") return dados;

  if (!S.averiguacoes) S.averiguacoes = {};
  S.averiguacoes[dados.livroId] = dados;

  // Beneficiar o Pet
  if (S.pet) {
    S.pet.fome = Math.max(0, (S.pet.fome || 50) - 25);
    S.pet.felicidade = Math.min(100, (S.pet.felicidade || 50) + 20);
    S.pet.xp = (S.pet.xp || 0) + 35;
  }

  // Dar gotas de recompensa
  S.coins = (S.coins || 0) + 15;

  if (typeof commit === "function") commit();
  return dados;
}

function renderizarSeloEstante(livroId) {
  const averig = obterAveriguacaoLivro(livroId);
  if (!averig) return "";

  const humor = HUMORES_LIVRO.find(h => h.id === averig.humorId) || HUMORES_LIVRO[0];

  return `
    <div class="selo-carimbo-verificado" title="${averig.resposta}">
      <span>✓ VERIFICADO</span>
    </div>
    <div class="figurinha-estante-colecao">
      ${humor.label.split(" ")[0]} Coleção Ouro
    </div>
  `;
}

function lancarDesafioRelampagoPet() {
  if (typeof S === "undefined" || !S.averiguacoes) return null;
  const chaves = Object.keys(S.averiguacoes);
  if (!chaves.length) return null;

  const sorteada = chaves[Math.floor(Math.random() * chaves.length)];
  const item = S.averiguacoes[sorteada];
  const petNome = (S.pet && S.pet.nome) ? S.pet.nome : "Mascote";

  return {
    titulo: `Desafio Relâmpago do ${petNome}!`,
    pergunta: `Você se lembra da reflexão que anotamos para este livro?`,
    respostaOculta: item.resposta,
    livroId: item.livroId
  };
}

// Exportacao universal
if (typeof window !== "undefined") {
  window.CARTAS_DESAFIO_LEITURA = CARTAS_DESAFIO_LEITURA;
  window.HUMORES_LIVRO = HUMORES_LIVRO;
  window.PETISCOS_LITERARIOS = PETISCOS_LITERARIOS;
  window.obterAveriguacaoLivro = obterAveriguacaoLivro;
  window.abrirModalAveriguacao = abrirModalAveriguacao;
  window.fecharModalAveriguacao = fecharModalAveriguacao;
  window.trocarCartaDesafio = trocarCartaDesafio;
  window.trocarHumorLivro = trocarHumorLivro;
  window.confirmarAveriguacao = confirmarAveriguacao;
  window.salvarAveriguacaoNoEstado = salvarAveriguacaoNoEstado;
  window.renderizarSeloEstante = renderizarSeloEstante;
  window.lancarDesafioRelampagoPet = lancarDesafioRelampagoPet;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CARTAS_DESAFIO_LEITURA,
    HUMORES_LIVRO,
    PETISCOS_LITERARIOS,
    obterAveriguacaoLivro,
    salvarAveriguacaoNoEstado,
    renderizarSeloEstante,
    lancarDesafioRelampagoPet
  };
}
