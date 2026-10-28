/* ===================================================================
   pets-1930-sprites.js - Catálogo e Motor de Sprites Artesanais 1930s (Cuphead)
   Sprites pintados em guache sobre papel envelhecido com contorno de nanquim.
   =================================================================== */
"use strict";

const PETS_1930_CATALOGO = {
  cachorro: {
    parado: "imagens/pets/cachorro/parado.png",
    andando: [
      "imagens/pets/cachorro/caminhada-1.png",
      "imagens/pets/cachorro/caminhada-2.png",
      "imagens/pets/cachorro/caminhada-3.png",
      "imagens/pets/cachorro/caminhada-4.png"
    ],
    correndo: [
      "imagens/pets/cachorro/caminhada-1.png",
      "imagens/pets/cachorro/caminhada-2.png",
      "imagens/pets/cachorro/caminhada-3.png",
      "imagens/pets/cachorro/caminhada-4.png"
    ],
    pulando: [
      "imagens/pets/cachorro/pulo-1.png",
      "imagens/pets/cachorro/pulo-2.png",
      "imagens/pets/cachorro/pulo-3.png",
      "imagens/pets/cachorro/pulo-4.png",
      "imagens/pets/cachorro/pulo-5.png",
      "imagens/pets/cachorro/pulo-6.png"
    ],
    truque: [
      "imagens/pets/cachorro/pulo-1.png",
      "imagens/pets/cachorro/pulo-2.png",
      "imagens/pets/cachorro/pulo-3.png",
      "imagens/pets/cachorro/pulo-4.png",
      "imagens/pets/cachorro/pulo-5.png",
      "imagens/pets/cachorro/pulo-6.png"
    ],
    feliz: [
      "imagens/pets/cachorro/acenando-1.png",
      "imagens/pets/cachorro/acenando-2.png",
      "imagens/pets/cachorro/feliz.png"
    ],
    abracando: "imagens/pets/cachorro/feliz.png",
    ronronando: "imagens/pets/cachorro/feliz.png",
    comendo: "imagens/pets/cachorro/parado.png",
    dormindo: "imagens/pets/cachorro/parado.png"
  },
  coelho: {
    parado: "imagens/pets/coelho/parado.png",
    andando: [
      "imagens/pets/coelho/pulo-1.png",
      "imagens/pets/coelho/pulo-2.png",
      "imagens/pets/coelho/pulo-3.png",
      "imagens/pets/coelho/pulo-4.png"
    ],
    correndo: [
      "imagens/pets/coelho/pulo-1.png",
      "imagens/pets/coelho/pulo-2.png",
      "imagens/pets/coelho/pulo-3.png",
      "imagens/pets/coelho/pulo-4.png"
    ],
    pulando: [
      "imagens/pets/coelho/pulo-1.png",
      "imagens/pets/coelho/pulo-2.png",
      "imagens/pets/coelho/pulo-3.png",
      "imagens/pets/coelho/pulo-4.png"
    ],
    truque: [
      "imagens/pets/coelho/pulo-1.png",
      "imagens/pets/coelho/pulo-2.png",
      "imagens/pets/coelho/pulo-3.png",
      "imagens/pets/coelho/pulo-4.png"
    ],
    comendo: [
      "imagens/pets/coelho/comendo-1.png",
      "imagens/pets/coelho/comendo-2.png"
    ],
    pastando: [
      "imagens/pets/coelho/comendo-1.png",
      "imagens/pets/coelho/comendo-2.png"
    ],
    feliz: "imagens/pets/coelho/feliz.png",
    abracando: "imagens/pets/coelho/feliz.png",
    ronronando: "imagens/pets/coelho/feliz.png",
    dormindo: "imagens/pets/coelho/parado.png"
  },
  coruja: {
    parado: "imagens/pets/coruja/parado.png",
    andando: "imagens/pets/coruja/magia.png",
    correndo: "imagens/pets/coruja/magia.png",
    pulando: "imagens/pets/coruja/magia.png",
    magia: "imagens/pets/coruja/magia.png",
    truque: "imagens/pets/coruja/magia.png",
    lendo: [
      "imagens/pets/coruja/lendo-1.png",
      "imagens/pets/coruja/lendo-2.png",
      "imagens/pets/coruja/lendo-3.png"
    ],
    estudando: [
      "imagens/pets/coruja/lendo-1.png",
      "imagens/pets/coruja/lendo-2.png",
      "imagens/pets/coruja/lendo-3.png"
    ],
    feliz: "imagens/pets/coruja/feliz.png",
    abracando: "imagens/pets/coruja/feliz.png",
    dormindo: "imagens/pets/coruja/parado.png"
  },
  gato: {
    parado: "imagens/pets/gato/parado.png",
    dormindo: "imagens/pets/gato/dormindo.png",
    fingindo: "imagens/pets/gato/dormindo.png",
    soneca: "imagens/pets/gato/dormindo.png",
    comendo: "imagens/pets/gato/comendo.png",
    pastando: "imagens/pets/gato/comendo.png",
    andando: "imagens/pets/gato/caminhada.png",
    correndo: "imagens/pets/gato/caminhada.png",
    brincando: "imagens/pets/gato/brincando.png",
    pulando: "imagens/pets/gato/brincando.png",
    truque: "imagens/pets/gato/brincando.png",
    feliz: "imagens/pets/gato/feliz.png",
    abracando: "imagens/pets/gato/feliz.png",
    ronronando: "imagens/pets/gato/feliz.png"
  },
  hamster: {
    parado: "imagens/pets/hamster/parado.png",
    dormindo: "imagens/pets/hamster/dormindo.png",
    fingindo: "imagens/pets/hamster/dormindo.png",
    soneca: "imagens/pets/hamster/dormindo.png",
    comendo: "imagens/pets/hamster/comendo.png",
    pastando: "imagens/pets/hamster/comendo.png",
    andando: "imagens/pets/hamster/andando.png",
    correndo: "imagens/pets/hamster/andando.png",
    pulando: "imagens/pets/hamster/andando.png",
    truque: "imagens/pets/hamster/andando.png",
    feliz: "imagens/pets/hamster/feliz.png",
    abracando: "imagens/pets/hamster/feliz.png"
  }
};

/** Renderiza o sprite 1930s ou ciclo de frames dentro de uma tag <g> SVG */
function renderPet1930(especie, pose = "parado") {
  const esp = PETS_1930_CATALOGO[especie];
  if (!esp) return null;
  const item = esp[pose] || esp.parado;
  if (!item) return null;

  if (Array.isArray(item)) {
    const qtd = item.length;
    const imgs = item
      .map(
        (url, i) =>
          `<image href="${url}" xlink:href="${url}" class="p-frame pf-${i}" x="6" y="2" width="38" height="36" preserveAspectRatio="xMidYMid meet"/>`
      )
      .join("");
    return `<g class="pet-sprite-frames anim-frames-${qtd}">${imgs}</g>`;
  } else {
    return `<g class="pet-sprite-single"><image href="${item}" xlink:href="${item}" class="p-single-sprite" x="6" y="2" width="38" height="36" preserveAspectRatio="xMidYMid meet"/></g>`;
  }
}
