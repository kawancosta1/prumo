/* ===================================================================
   whitelabel.js - Motor de Customização White-Label e Multi-Tenant
   Permite reconfigurar o logotipo, nome, cores e módulos do aplicativo
   sem alterar o núcleo de engenharia, viabilizando vendas B2B e M&A.
   =================================================================== */
"use strict";

const CONFIG_WHITELABEL = {
  appName: "Prumo",
  tagline: "Hábitos, Rotina, Leituras e Pets Vintage",
  primaryColor: "#3F7FD9",
  accentColor: "#2340C4",
  customLogoUrl: null,
  modulesEnabled: {
    pets: true,
    bookshelf: true,
    habits: true,
    focus: true,
    social: true,
    pro: true
  }
};

/** Aplica as configurações de marca na interface */
function aplicarWhiteLabel(configuracao = {}) {
  const cfg = Object.assign({}, CONFIG_WHITELABEL, configuracao);

  // Aplica tokens CSS dinamicos
  if (cfg.primaryColor && typeof document !== "undefined") {
    document.documentElement.style.setProperty("--accent", cfg.accentColor || cfg.primaryColor);
    document.documentElement.style.setProperty("--theme-brand", cfg.primaryColor);
  }

  // Atualiza título da aplicação
  if (cfg.appName && typeof document !== "undefined") {
    const brandEl = document.querySelector(".brand");
    if (brandEl) {
      const proBadge = brandEl.querySelector(".badge-pro-vip");
      brandEl.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("Prumo")) {
          node.textContent = cfg.appName + " ";
        }
      });
      if (proBadge && !brandEl.contains(proBadge)) {
        brandEl.appendChild(proBadge);
      }
    }
  }

  return cfg;
}

const WHITELABEL = {
  aplicar: aplicarWhiteLabel,
  config: CONFIG_WHITELABEL
};
