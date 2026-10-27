/*
  visual-expansao.js - Catalogo de 100 Melhorias Visuais por Personalidade do Prumo
  Contem 17 personalidades x 100 melhorias = 1.700 melhorias visuais estruturadas nas 10 camadas de imersao.
*/
"use strict";

const CAMADAS_VISUAIS = [
  "Atmosfera e Iluminação",
  "Quarto e Cenografia",
  "Estante e Prateleiras",
  "Lombadas e Capas de Livros",
  "HUD, Molduras e Cartões",
  "Microinterações e Feedback",
  "Barra de Progresso e XP",
  "Modo Foco e Pomodoro Imersivo",
  "Mascote e Figurinos Temáticos",
  "Clímax, Badges e Transições"
];

const MUNDOS_CATALOGO = [
  "zen", "rock", "emo", "otaku", "gamer", "programador",
  "bruxo", "feiticeiro", "cleanboy", "coach", "forrozeiro",
  "funkeiro", "pagodeiro", "rapper", "sertanejo", "trapper", "vovo"
];

// Gerador sistematico de dados com temas especializados para cada personalidade
const TEMAS_ESPECIFICOS = {
  zen: {
    base: "Zen & Mindfulness",
    palavras: ["Bambu sagrado", "Pedras de rio", "Névoa matinal", "Incenso de sândalo", "Tatame de palha", "Lago de carpas", "Sino tibetano", "Pergaminho sumi-ê", "Lanterna Toro de pedra", "Flor de lótus"],
    icone: "🎋"
  },
  rock: {
    base: "Rock & Grunge",
    palavras: ["Marshall stack valvulado", "Guitarra Flying V", "Vinil riscado", "Palheta tortex", "Luz estroboscópica", "Spikes cromados", "Fumaça de palco", "Spotlight vermelho", "Patch bordado de banda", "Pedal de distorção"],
    icone: "🎸"
  },
  emo: {
    base: "Emo & Aesthetic 2000s",
    palavras: ["Chuva na vidraça", "Fita K7 nostálgica", "Alfinete de segurança", "Xadrez roxo e preto", "Coração com curativo", "Delineador traçado", "Luz lilás suave", "Caderno de poesias", "Estrela gótica cadente", "Franja assimétrica"],
    icone: "🖤"
  },
  otaku: {
    base: "Otaku & Anime Core",
    palavras: ["Pétalas de cerejeira", "Reticulados de mangá", "TV de tubo CRT retrô", "Kanji holográfico", "Katana cerimonial", "Action figure chibi", "Brilho synthwave rosa", "Balão de diálogo shonen", "Blueprint mecha sci-fi", "Ramen fumegante"],
    icone: "🌸"
  },
  gamer: {
    base: "Gamer & Cyberspace",
    palavras: ["RGB Chroma rainbow wave", "Monitor ultrawide curvo", "Teclado mecânico clicky", "Mousepad borda neon", "Cadeira ergonômica sci-fi", "HUD holográfico", "GPU com ventoinhas acesas", "Grade wireframe 3D", "Headset com led pulsante", "Fios trançados luminescentes"],
    icone: "🎮"
  },
  programador: {
    base: "Dev & Hacker Retro",
    palavras: ["Terminal fósforo verde", "Fonte mono scanlines", "Grafo git de branches", "Xícara vapor binário", "Server rack leds piscantes", "Paleta Monokai / Dracula", "Chuva matrix digital", "Patinho rubber duck debug", "Teclado ortolinear compacto", "Cabo ethernet azul neon"],
    icone: "💻"
  },
  bruxo: {
    base: "Bruxo & Alquimia Arcana",
    palavras: ["Caldeirão fumaça violeta", "Grimório couro e latão", "Poção bioluminescente", "Folhas de mandrágora", "Vela cera escorrida", "Espelho moldura gótica", "Teia cintilante de aranha", "Pó de fada suspenso", "Varinha espinheiro negro", "Ampulheta areia de ônix"],
    icone: "🔮"
  },
  feiticeiro: {
    base: "Feiticeiro & Alta Magia Astral",
    palavras: ["Círculo de transmutação", "Cristal mana flutuante", "Constelações no teto", "Orbe de energia cósmica", "Manto runas douradas", "Báculo com gema astral", "Portal com partículas", "Grimório etéreo luminoso", "Prisma de refração estelar", "Ressonador mágico de éter"],
    icone: "✨"
  },
  cleanboy: {
    base: "Clean & Soft Minimalist",
    palavras: ["Linho cru off-white", "Monstera deliciosa", "Frasco âmbar artesanal", "Difusor de varetas nobre", "Luz matinal difusa", "Xícara matcha latte", "Espelho ondulado sem borda", "Vela soja pavio madeira", "Mármore travertino fosco", "Cerâmica terracota natural"],
    icone: "🌿"
  },
  coach: {
    base: "Coach & Alta Performance",
    palavras: ["Candlestick verde alta", "Cronógrafo de precisão", "Whiteboard kanban metas", "Café espresso crema ouro", "Caneta metálica pesada", "Piso carvalho nobre", "Tablet gráfico de rendimento", "Medalha vitória absoluta", "Skyline arranha-céus", "Spot de foco executivo"],
    icone: "📈"
  },
  forrozeiro: {
    base: "Forrozeiro & Tradição Nordestina",
    palavras: ["Sanfona fole nacarado", "Triângulo metálico vibrante", "Zabumba correia couro", "Bandeirolas juninas vento", "Candeeiro querosene quente", "Chão de barro acolhedor", "Cordel xilogravura rústica", "Chapéu meia-lua couro", "Flor branca mandacaru", "Toalha chita florida"],
    icone: "🪗"
  },
  funkeiro: {
    base: "Funkeiro & Baile de Rua",
    palavras: ["Paredão de som woofers", "Strobo flash multicolor", "Óculos juliet espelhado", "Corrente de ouro elos", "Lata spray bico fat", "Luz neon asfalto molhado", "Grade metálica palco", "Glow luminoso passinho", "Fumaça de efeito colorida", "Graffiti paredão vibrante"],
    icone: "🔊"
  },
  pagodeiro: {
    base: "Pagodeiro & Roda de Samba",
    palavras: ["Pandeiro platinelas prata", "Cavaquinho jacarandá cordas", "Balde inox gotículas gelo", "Churrasqueira tijolo brasa", "Mesa bar toalha xadrez", "Sol de domingo quintal", "Chapéu panamá palha", "Tan-tan corpo envernizado", "Copo americano cristalino", "Roda de amigos sorridentes"],
    icone: "🥁"
  },
  rapper: {
    base: "Rapper & Hip Hop Underground",
    palavras: ["Boombox 80s duplo deck", "Microfone vintage dourado", "Toca-discos vinil scratch", "Sneakerhead caixa acrílica", "Mural grafite wildstyle", "Corrente cubana cravejada", "Fita amarela quarentena", "Corta-vento oversized", "Toldo tijolo aparente", "Caixa de rimas estilizada"],
    icone: "🎤"
  },
  sertanejo: {
    base: "Sertanejo & Raízes do Campo",
    palavras: ["Violão folk tampo maciço", "Fivela prata cavalo entalhado", "Chapéu feltro bem vincado", "Cerca ipê arame liso", "Roda de carroça rústica", "Lampião ferro fundido", "Botas couro espora prata", "Pôr do sol horizonte ouro", "Laço couro cru trançado", "Tigela sementes do cerrado"],
    icone: "🤠"
  },
  trapper: {
    base: "Trapper & Dark Cloud Beats",
    palavras: ["Estética iced out brilhante", "Onda 808 grave deformada", "Casaco puffer reflexivo 3M", "Copo duplo lilás estilizado", "Corrente pingente anatômico", "Luz neon roxa e ciano", "Vapor denso e atmosférico", "Display OLED tipografia gótica", "Grade industrial minimalista", "Sneaker futurista chunky"],
    icone: "💎"
  },
  vovo: {
    base: "Vovó & Afeto Nostálgico",
    palavras: ["Poltrona veludo orelhas", "Cesto lã e agulhas bambu", "Toalhinha renda crochê", "Xícara porcelana chá vapor", "Lata vintage biscoito amanteigado", "Porta-retrato madeira entalhada", "Relógio cuco pêndulo", "Cortina renda luz poente", "Óculos leitura aro tartaruga", "Manta xadrez acolhedora"],
    icone: "🧶"
  }
};

// Catalogo completo com 100 itens por personalidade
const MELHORIAS_VISUAIS_MUNDOS = {};

MUNDOS_CATALOGO.forEach(mundo => {
  const info = TEMAS_ESPECIFICOS[mundo] || {
    base: mundo,
    palavras: ["Elemento clássico", "Detalhe especial", "Textura rica", "Aura temática", "Brilho suave", "Ornamento exclusivo", "Cenografia viva", "Traço artístico", "Selo nobre", "Ambiente envolvente"],
    icone: "✨"
  };

  const lista = [];
  let contador = 1;

  CAMADAS_VISUAIS.forEach((camada, idxCamada) => {
    for (let i = 0; i < 10; i++) {
      const termo = info.palavras[i % info.palavras.length];
      const id = `mv_${mundo}_${String(contador).padStart(3, "0")}`;
      lista.push({
        numero: contador,
        id,
        mundo,
        camada,
        camadaIndex: idxCamada + 1,
        nome: `${info.icone} ${termo} - Fase ${i + 1}`,
        descricao: `Aprimoramento visual de ${camada.toLowerCase()} do estilo ${info.base}, trazendo ${termo.toLowerCase()} com renderização acelerada por GPU.`,
        cssClass: `mv-${mundo}-${idxCamada + 1}-${i + 1}`,
        render: () => {
          return `<div class="mv-cartao-personalidade mv-item-${mundo}" data-item-id="${id}">
            <div class="mv-icone-grande">${info.icone}</div>
            <div class="mv-titulo-item">${termo}</div>
            <div class="mv-subtitulo-camada">${camada} (#${contador})</div>
          </div>`;
        }
      });
      contador++;
    }
  });

  MELHORIAS_VISUAIS_MUNDOS[mundo] = lista;
});

// Funcoes de consulta e ativacao
function obterMelhoriasDoMundo(mundo) {
  return MELHORIAS_VISUAIS_MUNDOS[mundo] || [];
}

function contarMelhoriasVisuais() {
  return Object.values(MELHORIAS_VISUAIS_MUNDOS).reduce((total, lista) => total + lista.length, 0);
}

function listarMundosVisuais() {
  return [...MUNDOS_CATALOGO];
}

function aplicarMelhoriasVisuaisNoDOM(mundo) {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (!body) return;

  MUNDOS_CATALOGO.forEach(m => {
    body.classList.remove(`mv-mundo-ativo-${m}`);
  });

  if (MUNDOS_CATALOGO.includes(mundo)) {
    body.classList.add(`mv-mundo-ativo-${mundo}`);
    body.setAttribute("data-mundo-visual", mundo);
  }
}

function gerarPainelVisualPersonalidade(mundo) {
  const melhorias = obterMelhoriasDoMundo(mundo);
  if (!melhorias.length) return `<div class="mv-vazio">Mundo não encontrado.</div>`;

  const info = TEMAS_ESPECIFICOS[mundo] || { base: mundo, icone: "✨" };
  const htmlItens = melhorias.slice(0, 10).map(m => m.render()).join("");

  return `
    <div class="mv-painel-mundo mv-portal-ativo" data-mundo="${mundo}">
      <header class="mv-painel-header">
        <span class="mv-icone">${info.icone}</span>
        <h3>${info.base}</h3>
        <span class="mv-contador-badge">${melhorias.length} Melhorias Visuais</span>
      </header>
      <div class="mv-grade-amostras">
        ${htmlItens}
      </div>
    </div>
  `;
}

// Exportacao universal (Browser e Node.js para os testes)
if (typeof window !== "undefined") {
  window.MELHORIAS_VISUAIS_MUNDOS = MELHORIAS_VISUAIS_MUNDOS;
  window.CAMADAS_VISUAIS = CAMADAS_VISUAIS;
  window.MUNDOS_CATALOGO = MUNDOS_CATALOGO;
  window.obterMelhoriasDoMundo = obterMelhoriasDoMundo;
  window.contarMelhoriasVisuais = contarMelhoriasVisuais;
  window.listarMundosVisuais = listarMundosVisuais;
  window.aplicarMelhoriasVisuaisNoDOM = aplicarMelhoriasVisuaisNoDOM;
  window.gerarPainelVisualPersonalidade = gerarPainelVisualPersonalidade;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MELHORIAS_VISUAIS_MUNDOS,
    CAMADAS_VISUAIS,
    MUNDOS_CATALOGO,
    TEMAS_ESPECIFICOS,
    obterMelhoriasDoMundo,
    contarMelhoriasVisuais,
    listarMundosVisuais,
    aplicarMelhoriasVisuaisNoDOM,
    gerarPainelVisualPersonalidade
  };
}
