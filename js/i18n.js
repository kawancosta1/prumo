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

    // Admin & Export
    admin: "Admin Panel",
    catalogo: "Catalog",
    exportarRelatorio: "Export Report",

    // Language
    idiomaNome: "English (US)",
    idiomaSelecionar: "Interface Language"
  }
};

DICIONARIO_I18N["pt-BR"] = DICIONARIO_I18N.pt;
DICIONARIO_I18N["en-US"] = DICIONARIO_I18N.en;

/** Retorna a tradução correspondente ao idioma atual ou o fallback */
function traduzir(chave, fallback = "") {
  const idioma = typeof S !== "undefined" && S.idioma ? S.idioma : "pt";
  const dic = DICIONARIO_I18N[idioma] || DICIONARIO_I18N["pt-BR"] || DICIONARIO_I18N.pt;
  return dic[chave] || fallback || chave;
}

/** Altera o idioma ativo e persiste no estado */
function definirIdioma(novoIdioma) {
  const normalizado = novoIdioma && novoIdioma.toLowerCase().startsWith("en") ? "en" : "pt";
  if (!DICIONARIO_I18N[normalizado]) return;
  if (typeof S !== "undefined" && S) {
    S.idioma = normalizado;
    if (typeof commit === "function") commit();
    if (typeof render === "function") render();
  }
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", normalizado === "en" ? "en" : "pt-BR");
  }
}

/** Hook / Helper useTranslation compatível com padrão i18next */
function useTranslation() {
  const idioma = typeof S !== "undefined" && S.idioma ? S.idioma : "pt";
  return {
    t: traduzir,
    i18n: {
      language: idioma === "en" ? "en-US" : "pt-BR",
      changeLanguage: definirIdioma
    }
  };
}

/** Componente <LanguageSwitcher> para troca rápida de idioma */
function LanguageSwitcher({ classe = "language-switcher-pill" } = {}) {
  const atual = typeof S !== "undefined" && S.idioma ? S.idioma : "pt";
  return `
    <div class="${classe}" role="group" aria-label="Seletor de idioma / Language Switcher" style="display:inline-flex;gap:4px;align-items:center;">
      <button type="button" class="btn small ${atual === "pt" ? "primary" : "ghost"}" data-act="idioma" data-l="pt" aria-pressed="${atual === "pt"}">🇧🇷 PT</button>
      <button type="button" class="btn small ${atual === "en" ? "primary" : "ghost"}" data-act="idioma" data-l="en" aria-pressed="${atual === "en"}">🇺🇸 EN</button>
    </div>
  `;
}

const I18N = {
  t: traduzir,
  useTranslation,
  LanguageSwitcher,
  definir: definirIdioma,
  dicionarios: DICIONARIO_I18N,
  idiomaAtual: () => (typeof S !== "undefined" && S.idioma ? S.idioma : "pt")
};

if (typeof window !== "undefined") {
  window.traduzir = traduzir;
  window.t = traduzir;
  window.useTranslation = useTranslation;
  window.LanguageSwitcher = LanguageSwitcher;
  window.definirIdioma = definirIdioma;
  window.I18N = I18N;
}
