/* ===================================================================
   cenario-upgrade-visual.js - Upgrade Visual e Iluminação do Cenário
   Estética de Livro de Fantasia e Jogo Indie Premium (2.5D Volumétrico)
   - Luz direcional e volumétrica (God Rays) vinda da janela
   - Sombras projetadas e sombras de contato (Ambient Occlusion fake)
   - Profundidade 2.5D nos móveis (espessura, laterais, chanfros)
   - Texturas artesanais de madeira com veios, tecidos e reflexo no vidro
   =================================================================== */
"use strict";

(function () {
  /** 01. Gera o bloco <defs> com filtros e gradientes volumétricos do cenário */
  function gerarDefsCenario(id, W, H, chaoY) {
    return `
      <defs>
        <!-- Feixe de luz volumétrica suave da janela (God Rays) -->
        <linearGradient id="luz-janela-beam" x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.45"/>
          <stop offset="35%" stop-color="#FFEAA7" stop-opacity="0.28"/>
          <stop offset="70%" stop-color="#FDCB6E" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#FAD390" stop-opacity="0.0"/>
        </linearGradient>

        <!-- Luz de luar para janelas noturnas -->
        <linearGradient id="luz-luar-beam" x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stop-color="#E0E7FF" stop-opacity="0.38"/>
          <stop offset="40%" stop-color="#C7D2FE" stop-opacity="0.22"/>
          <stop offset="80%" stop-color="#818CF8" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.0"/>
        </linearGradient>

        <!-- Sombra direcional suave (40 graus) -->
        <filter id="sombra-suave-direcional" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3.5" dy="3.0" stdDeviation="2.8" flood-color="#1E1B18" flood-opacity="0.28"/>
        </filter>

        <!-- Sombra de contato (Ambient Occlusion Fake) para pés e chão -->
        <filter id="sombra-contato-ao" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.8" stdDeviation="1.6" flood-color="#0F0C0A" flood-opacity="0.42"/>
        </filter>

        <!-- Gradiente de oclusão vertical na parede (mais escuro no topo e cantos) -->
        <linearGradient id="parede-vinheta-ao" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.20"/>
          <stop offset="25%" stop-color="#000000" stop-opacity="0.04"/>
          <stop offset="75%" stop-color="#000000" stop-opacity="0.0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.24"/>
        </linearGradient>

        <!-- Gradiente de profundidade e luz rebatida no piso -->
        <linearGradient id="chao-profundidade-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.22"/>
          <stop offset="15%" stop-color="#ffffff" stop-opacity="0.08"/>
          <stop offset="65%" stop-color="#000000" stop-opacity="0.0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
        </linearGradient>

        <!-- Chanfro de luz em madeira nobre -->
        <linearGradient id="madeira-chanfro-luz" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.24"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
        </linearGradient>
      </defs>
    `;
  }

  /** 02. Feixe de luz volumétrica (God Rays) e partículas douradas de poeira mágica */
  function gerarCamadaLuzJanela(W, H, chaoY, idJanela = "") {
    const isNoite = idJanela === "q_noite" || idJanela === "q_cidade" || idJanela === "q_lua_sangue";
    const gradId = isNoite ? "luz-luar-beam" : "luz-janela-beam";
    const motesCor = isNoite ? "#E0E7FF" : "#FDE68A";

    // Polígono em leque saindo da janela (x=16 a 106, y=22 a 102) e projetando-se no quarto
    const feixe = `
      <polygon points="24,80 104,26 280,${H} 48,${H}" fill="url(#${gradId})" class="cenario-feixe-luz"/>
    `;

    // Partículas de poeira suspensa brilhando no feixe
    const motes = [
      [60, 95, 1.3, 0],
      [82, 115, 1.0, 1.2],
      [110, 135, 1.6, 2.4],
      [95, 160, 1.2, 0.8],
      [140, 155, 1.4, 3.1],
      [125, 185, 1.1, 1.9],
      [165, 190, 1.5, 0.5],
      [185, 215, 1.2, 2.8]
    ]
      .map(
        ([x, y, r, dl]) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="${motesCor}" class="cenario-poeira-mote" style="animation-delay:${dl}s"/>`
      )
      .join("");

    return `<g class="camada-luz-janela">${feixe}<g class="motes-poeira">${motes}</g></g>`;
  }

  /** 03. Sombras projetadas e de contato (Ambient Occlusion Fake) para todos os móveis */
  function gerarSombrasCenario(W, chaoY, temCama, largE, altE, petCoord, prumiCoord) {
    let s = "";

    // Sombra de contato e projeção da Cama no piso
    if (temCama) {
      s += `
        <!-- Sombra projetada suave da cama para a direita/frente -->
        <polygon points="6,${chaoY + 2} 144,${chaoY + 2} 162,${chaoY + 16} 18,${chaoY + 16}" fill="#0F0C0A" opacity="0.22" filter="blur(1.5px)"/>
        <!-- Ambient occlusion sob os pés de apoio da cama -->
        <ellipse cx="15" cy="${chaoY + 3}" rx="6.5" ry="2.2" fill="#0A0806" opacity="0.55"/>
        <ellipse cx="131" cy="${chaoY + 3}" rx="6.5" ry="2.2" fill="#0A0806" opacity="0.55"/>
      `;
    }

    // Sombra projetada e de contato da Estante
    s += `
      <!-- Sombra projetada da estante no chão à esquerda -->
      <polygon points="${W - largE - 6},${chaoY + 6} ${W},${chaoY + 6} ${W},${chaoY + 18} ${W - largE - 22},${chaoY + 18}" fill="#0F0C0A" opacity="0.25" filter="blur(2px)"/>
      <!-- Ambient occlusion nos pés da estante -->
      <ellipse cx="${W - largE + 2}" cy="${chaoY + 6}" rx="10" ry="2.5" fill="#0A0806" opacity="0.6"/>
      <ellipse cx="${W - 14}" cy="${chaoY + 6}" rx="10" ry="2.5" fill="#0A0806" opacity="0.6"/>
    `;

    // Sombra do Tapete no piso
    s += `
      <ellipse cx="95" cy="${chaoY + 31}" rx="74" ry="16" fill="#0A0806" opacity="0.16" filter="blur(2px)"/>
    `;

    // Sombra do Pet (no chão ou na cama)
    if (petCoord) {
      s += `<ellipse cx="${petCoord.x + 24}" cy="${petCoord.y + 36}" rx="15" ry="4" fill="#0A0806" opacity="0.32" filter="blur(1px)"/>`;
    }

    // Sombra do Prumi Leitor
    if (prumiCoord) {
      s += `<ellipse cx="${prumiCoord.x + 31}" cy="${prumiCoord.y + 58}" rx="22" ry="5.5" fill="#0A0806" opacity="0.34" filter="blur(1.5px)"/>`;
    }

    return `<g class="camada-sombras-cenario">${s}</g>`;
  }

  /** 04. Rodapé artesanal de madeira nobre em 2.5D com friso entalhado e luz de borda */
  function gerarRodapeArtesanal(W, chaoY) {
    return `
      <g class="rodape-artesanal">
        <!-- Base da moldura do rodapé -->
        <rect x="0" y="${chaoY - 8}" width="${W}" height="9" fill="#5C3A21" stroke="#3E2514" stroke-width="0.8"/>
        <!-- Friso superior entalhado com luz rebatida de 1px -->
        <line x1="0" y1="${chaoY - 8}" x2="${W}" y2="${chaoY - 8}" stroke="#FDE68A" stroke-opacity="0.35" stroke-width="1"/>
        <!-- Sulco de sombra esculpido no meio da moldura -->
        <line x1="0" y1="${chaoY - 4}" x2="${W}" y2="${chaoY - 4}" stroke="#2B180C" stroke-width="1.2"/>
        <line x1="0" y1="${chaoY - 3}" x2="${W}" y2="${chaoY - 3}" stroke="#784C28" stroke-width="0.8"/>
        <!-- Sombra de contato profunda no encontro do rodapé com o chão -->
        <rect x="0" y="${chaoY}" width="${W}" height="2.5" fill="#1A0E07" opacity="0.45"/>
      </g>
    `;
  }

  /** 05. Aprimora o assoalho de madeira com veios orgânicos, chanfros de luz e textura */
  function aprimorarChaoAssoalho(svgOriginal, W, h) {
    if (!svgOriginal || typeof svgOriginal !== "string") return svgOriginal;

    // Adiciona veios orgânicos de madeira e linhas de luz superior em cada tábua
    let veios = "";
    const numTabuas = Math.ceil(h / 12);
    for (let i = 0; i < numTabuas; i++) {
      const yTabua = i * 12;
      // Linha de luz biselada no topo da tábua
      veios += `<line x1="0" y1="${yTabua + 0.8}" x2="${W}" y2="${yTabua + 0.8}" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="0.8"/>`;
      // Sombra profunda na junta inferior
      veios += `<line x1="0" y1="${yTabua + 12}" x2="${W}" y2="${yTabua + 12}" stroke="#3D2314" stroke-opacity="0.45" stroke-width="1"/>`;
      // Pequenos veios curvos sutis
      veios += `<path d="M${(i * 73) % W} ${yTabua + 5} Q${(i * 73 + 30) % W} ${yTabua + 3} ${(i * 73 + 60) % W} ${yTabua + 7}" stroke="#5C381E" stroke-opacity="0.25" stroke-width="0.8" fill="none"/>`;
    }

    return `
      <g class="chao-upgrade-container">
        ${svgOriginal}
        <g class="veios-madeira-chao">${veios}</g>
        <!-- Gradiente de profundidade vertical do chão -->
        <rect width="${W}" height="${h}" fill="url(#chao-profundidade-grad)" pointer-events="none"/>
      </g>
    `;
  }

  /** 06. Aprimora a Janela com reflexos de vidro chanfrado, peitoril tridimensional e brilho */
  function aprimorarJanelaVisual(svgOriginal) {
    if (!svgOriginal || typeof svgOriginal !== "string") return svgOriginal;

    const reflexosVidro = `
      <!-- Reflexo especular duplo no vidro em ângulo de 45 graus -->
      <g class="cenario-vidro-reflexo">
        <polygon points="12,6 32,6 6,58 6,36" fill="#FFFFFF" opacity="0.18"/>
        <polygon points="40,6 68,6 18,70 6,70" fill="#FFFFFF" opacity="0.14"/>
        <!-- Reflexo do segundo painel da janela -->
        <polygon points="52,6 74,6 48,58 48,36" fill="#FFFFFF" opacity="0.16"/>
      </g>
      <!-- Sombra interna na moldura do vidro (profundidade da esquadria) -->
      <rect x="4" y="4" width="82" height="66" fill="none" stroke="#1A120B" stroke-width="1.8" opacity="0.32"/>
      <!-- Peitoril de madeira com volume 3D -->
      <rect x="0" y="68" width="90" height="2" fill="#FFFFFF" opacity="0.3"/>
      <rect x="0" y="75" width="90" height="3" fill="#1E140C" opacity="0.4"/>
    `;

    return `<g class="janela-upgrade-wrapper">${svgOriginal}${reflexosVidro}</g>`;
  }

  /** 07. Aprimora a Cama Simples tornando-a um móvel tridimensional de alta qualidade */
  function aprimorarCamaVisual(svgOriginal) {
    if (!svgOriginal || typeof svgOriginal !== "string") return svgOriginal;

    const volumeCama = `
      <g class="cama-volume-3d" pointer-events="none">
        <!-- Espessura superior da cabeceira com luz -->
        <rect x="4" y="18" width="10" height="3" rx="1" fill="#D4A373" stroke="#8A6A3A" stroke-width="0.8"/>
        <!-- Sombra da cabeceira sobre o travesseiro -->
        <rect x="14" y="28" width="4" height="20" fill="#000000" opacity="0.18" filter="blur(0.8px)"/>
        <!-- Sombra sob a dobra do edredom -->
        <path d="M50 40H136" stroke="#3B5998" stroke-width="2.2" opacity="0.4"/>
        <!-- Linha de luz na borda superior do edredom -->
        <path d="M50 38H136" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="1.2"/>
        <!-- Sombra de oclusão na base do estrado da cama -->
        <rect x="10" y="60" width="126" height="3" fill="#000000" opacity="0.25"/>
      </g>
    `;

    return `<g class="cama-upgrade-wrapper">${svgOriginal}${volumeCama}</g>`;
  }

  /** 08. Aprimora a Estante SVG adicionando profundidade às tábuas e sombras sob os livros */
  function aprimorarEstanteVisual(estanteSvgStr) {
    if (!estanteSvgStr || typeof estanteSvgStr !== "string") return estanteSvgStr;

    // Injeta linhas de luz nos topos das tábuas e sombra interna sob o teto da estante
    const sombraInterna = `
      <defs>
        <linearGradient id="estante-nicho-sombra" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0A0806" stop-opacity="0.35"/>
          <stop offset="25%" stop-color="#0A0806" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#0A0806" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
    `;

    // Adiciona sombra projetada sob a tampa superior
    return estanteSvgStr.replace(
      '<g class="lombada"',
      `${sombraInterna}<rect x="30" y="50" width="300" height="14" fill="url(#estante-nicho-sombra)" pointer-events="none"/><g class="lombada"`
    );
  }

  // Interceptar e orquestrar a renderização do quarto com as novas camadas de upgrade
  const quartoOriginal = window.quartoSVG;
  if (typeof quartoOriginal === "function") {
    window.quartoSVG = function (d) {
      const svgBase = quartoOriginal(d);
      if (!svgBase || typeof svgBase !== "string") return svgBase;

      const altChao = 64;
      const W = 360;
      const altEstMatch = /viewBox="0 0 360 (\d+)"/.exec(svgBase);
      const HMatch = /viewBox="0 0 \d+ (\d+)"/.exec(svgBase);
      const H = HMatch ? parseInt(HMatch[1], 10) : 300;
      const chaoY = H - altChao;

      const decor = (d && d.decor) || {};
      const idJanela = (decor.quarto && decor.quarto.janela) || "q_noite";

      const temCama = svgBase.includes('class="q-cama"');
      const prumiX = temCama ? 40 : 70;
      const prumiY = temCama ? chaoY - 104 : chaoY - 60;

      // Injeta defs e camadas de sombras e iluminação no ponto exato do SVG
      const defs = gerarDefsCenario("cenario_up", W, H, chaoY);
      const sombras = gerarSombrasCenario(W, chaoY, temCama, 170, 150, { x: 104, y: chaoY - 48 }, { x: prumiX, y: prumiY });
      const luzJanela = gerarCamadaLuzJanela(W, H, chaoY, idJanela);
      const rodape = gerarRodapeArtesanal(W, chaoY);

      // Substitui o rodapé simplório de 5px pelo novo rodapé artesanal 2.5D
      let svgAprimorado = svgBase.replace(
        /<rect x="0" y="[^"]+" width="[^"]+" height="5" fill="rgba\(0,0,0,\.18\)"\/>/,
        rodape
      );

      // Injeta os defs logo após a abertura da tag <svg>
      svgAprimorado = svgAprimorado.replace(
        /(<svg[^>]+>)/,
        `$1${defs}`
      );

      // Injeta as sombras de contato logo acima do chão
      svgAprimorado = svgAprimorado.replace(
        /(<g transform="translate\(0 [^"]+\)">)/,
        `${sombras}$1`
      );

      // Injeta o feixe de luz volumétrica e motes de poeira logo antes do fechamento </svg>
      svgAprimorado = svgAprimorado.replace(
        /(<\/svg>)/,
        `${luzJanela}$1`
      );

      return svgAprimorado;
    };
  }

  // Interceptar e orquestrar a renderização dos cômodos da Casa (Sótão, Sala, etc.)
  const casaOriginal = window.casaSVG;
  if (typeof casaOriginal === "function") {
    window.casaSVG = function (d) {
      const svgBase = casaOriginal(d);
      if (!svgBase || typeof svgBase !== "string") return svgBase;

      // Se for quarto, quartoSVG já cuidou do processamento
      if (svgBase.includes("quarto-svg") && !svgBase.includes("casa-")) {
        return svgBase;
      }

      // Injeta defs globais caso o cômodo ainda não possua
      let svgAprimorado = svgBase;
      if (!svgAprimorado.includes("sombra-suave-direcional")) {
        const HMatch = /viewBox="0 0 \d+ (\d+)"/.exec(svgBase);
        const H = HMatch ? parseInt(HMatch[1], 10) : 300;
        const W = 360;
        const chaoY = H - 64;
        const defs = gerarDefsCenario("casa_up", W, H, chaoY);
        svgAprimorado = svgAprimorado.replace(/(<svg[^>]+>)/, `$1${defs}`);
      }

      return svgAprimorado;
    };
  }

  // Exportar utilitários para testes e reuso
  window.gerarDefsCenario = gerarDefsCenario;
  window.gerarCamadaLuzJanela = gerarCamadaLuzJanela;
  window.gerarSombrasCenario = gerarSombrasCenario;
  window.gerarRodapeArtesanal = gerarRodapeArtesanal;
  window.aprimorarChaoAssoalho = aprimorarChaoAssoalho;
  window.aprimorarJanelaVisual = aprimorarJanelaVisual;
  window.aprimorarCamaVisual = aprimorarCamaVisual;
  window.aprimorarEstanteVisual = aprimorarEstanteVisual;
})();
