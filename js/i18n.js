/* ===================================================================
   i18n.js - Motor de Internacionalização e Localização (PT-BR & EN-US)
   Permite alternar o idioma do Prumo entre Português e Inglês,
   multiplicando o alcance de mercado e a liquidez de venda em dólar.
   =================================================================== */
"use strict";

const DICIONARIO_I18N = {
  pt: {
    // Navegação
    hoje: "Hoje",
    estante: "Estante",
    estudos: "Estudos",
    prumi: "Prumi",
    ajustes: "Ajustes",
    amigos: "Amigos",
    avisos: "Avisos",
    gotas: "Gotas",
    buscar: "Buscar",
    
    // Áreas de vida
    geral: "Geral",
    saude: "Saúde",
    trabalho: "Trabalho",
    social: "Social",
    leitura: "Leitura",
    
    // Ações comuns
    salvar: "Salvar",
    cancelar: "Cancelar",
    concluir: "Concluir",
    editar: "Editar",
    apagar: "Apagar",
    fechar: "Fechar",
    copiar: "Copiar",
    adicionar: "Adicionar",
    
    // Pets
    adotarPet: "Adotar Pet",
    alimentar: "Alimentar",
    carinho: "Fazer carinho",
    brincar: "Brincar",
    soneca: "Hora da soneca",
    
    // PRO e Comercial
    proBadge: "⭐ PRO",
    assinarPro: "Garantir Prumo PRO",
    relatorioExecutivo: "Relatório Executivo",
    
    // Idioma
    idiomaNome: "Português (Brasil)",
    idiomaSelecionar: "Idioma da Interface"
  },
  en: {
    // Navigation
    hoje: "Today",
    estante: "Bookshelf",
    estudos: "Focus",
    prumi: "Mascot",
    ajustes: "Settings",
    amigos: "Friends",
    avisos: "Notifications",
    gotas: "Drops",
    buscar: "Search",
    
    // Areas of life
    geral: "General",
    saude: "Health",
    trabalho: "Work",
    social: "Social",
    leitura: "Reading",
    
    // Common Actions
    salvar: "Save",
    cancelar: "Cancel",
    concluir: "Complete",
    editar: "Edit",
    apagar: "Delete",
    fechar: "Close",
    copiar: "Copy",
    adicionar: "Add",
    
    // Pets
    adotarPet: "Adopt Pet",
    alimentar: "Feed",
    carinho: "Pet",
    brincar: "Play",
    soneca: "Nap time",
    
    // PRO & Commercial
    proBadge: "⭐ PRO",
    assinarPro: "Upgrade to Prumo PRO",
    relatorioExecutivo: "Executive Report",
    
    // Language
    idiomaNome: "English (US)",
    idiomaSelecionar: "Interface Language"
  }
};

/** Retorna a tradução correspondente ao idioma atual ou o fallback */
function traduzir(chave, fallback = "") {
  const idioma = (typeof S !== "undefined" && S.idioma) ? S.idioma : "pt";
  const dic = DICIONARIO_I18N[idioma] || DICIONARIO_I18N.pt;
  return dic[chave] || fallback || chave;
}

/** Altera o idioma ativo e persiste no estado */
function definirIdioma(novoIdioma) {
  if (!DICIONARIO_I18N[novoIdioma]) return;
  if (typeof S !== "undefined") {
    S.idioma = novoIdioma;
    if (typeof commit === "function") commit();
    if (typeof render === "function") render();
  }
  document.documentElement.setAttribute("lang", novoIdioma === "en" ? "en" : "pt-BR");
}

const I18N = {
  t: traduzir,
  definir: definirIdioma,
  dicionarios: DICIONARIO_I18N,
  idiomaAtual: () => ((typeof S !== "undefined" && S.idioma) ? S.idioma : "pt")
};
