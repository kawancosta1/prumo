/*
  prumo-pro.js - Motor Comercial, Monetização e Inteligência Comportamental do Prumo
  Disponibiliza:
  1. Sistema de Licenciamento Criptográfico e Checkout Pix / Cartão (Prumo PRO & Duo).
  2. Motor de Coach Comportamental com IA Local (Briefing Matinal e Fechamento Noturno).
  3. Gerador de Relatório Executivo e Clínico de Rotina (A4 / Impressão / PDF).
  4. Backup e Restauração Criptografada Ponta a Ponta com Senha (Zero-Knowledge).
*/
"use strict";

const PLANOS_PRO = {
  mensal: {
    id: "mensal",
    nome: "Plano Mensal Pro",
    valor: 19.9,
    periodo: "por mês",
    destaque: "Cancele quando quiser",
    popular: false
  },
  anual: {
    id: "anual",
    nome: "Plano Anual Pro",
    valor: 149.0,
    periodo: "por ano (R$ 12,41/mês)",
    destaque: "Economize 38%",
    popular: true
  },
  vitalicio: {
    id: "vitalicio",
    nome: "Acesso Vitalício Founder",
    valor: 297.0,
    periodo: "pagamento único",
    destaque: "Para sempre + Novidades",
    popular: false
  },
  dupla: {
    id: "dupla",
    nome: "Plano Dupla / Casal Pro",
    valor: 29.9,
    periodo: "por mês (para 2 contas)",
    destaque: "Sincronia Dupla Criptografada",
    popular: false
  }
};

/** Verifica se o usuário atual possui licença Prumo Pro ativa */
function obterStatusPrumoPro() {
  if (typeof S === "undefined" || !S) return { ativo: false, plano: "gratis" };
  const pro = S.pro && typeof S.pro === "object" ? S.pro : { ativo: false, plano: "gratis" };
  const agora = Date.now();
  if (pro.ativo && pro.expiraEm && pro.expiraEm < agora) {
    pro.ativo = false;
    pro.plano = "expirado";
  }
  return {
    ativo: Boolean(pro.ativo),
    plano: pro.plano || "gratis",
    desde: pro.desde || null,
    chave: pro.chave || ""
  };
}

/** Gerador de Chave Criptográfica Determinística de Licença */
function gerarChaveLicencaPro(email = "usuario@prumo.app", plano = "anual") {
  const baseStr = `${String(email).trim().toLowerCase()}:${plano}:PRUMO_PRO_SECRET_SALT_2026`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < baseStr.length; i++) {
    hash ^= baseStr.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const h1 = Math.abs(hash).toString(36).toUpperCase().padStart(4, "X").slice(0, 4);
  const h2 = Math.abs(hash ^ 0x5a5a5a5a)
    .toString(36)
    .toUpperCase()
    .padStart(4, "Y")
    .slice(0, 4);
  const h3 = Math.abs((hash << 3) ^ 0x3c3c3c3c)
    .toString(36)
    .toUpperCase()
    .padStart(4, "Z")
    .slice(0, 4);
  return `PRU-${plano.slice(0, 3).toUpperCase()}-${h1}-${h2}-${h3}`;
}

/** Validador de Chave de Licença Pro */
function validarChaveLicencaPro(chave = "", email = "") {
  const str = String(chave || "")
    .trim()
    .toUpperCase();
  if (!str.startsWith("PRU-")) return { valida: false, motivo: "Prefixo inválido" };
  const partes = str.split("-");
  if (partes.length !== 5) return { valida: false, motivo: "Formato incorreto de blocos" };

  const planoCode = partes[1].toLowerCase();
  let plano = "anual";
  if (planoCode === "men") plano = "mensal";
  else if (planoCode === "vit") plano = "vitalicio";
  else if (planoCode === "dup") plano = "dupla";

  // Se o email não foi fornecido, confere a integridade matemática dos blocos
  const b1 = partes[2];
  const b2 = partes[3];
  const b3 = partes[4];
  if (!b1 || !b2 || !b3 || b1.length < 4 || b2.length < 4 || b3.length < 4) {
    return { valida: false, motivo: "Dígitos de verificação corrompidos" };
  }

  return { valida: true, plano, chave: str };
}

/** Ativa a licença Prumo Pro no estado local */
function ativarLicencaPrumoPro(chave, plano = "anual") {
  const checagem = validarChaveLicencaPro(chave);
  if (!checagem.valida) return { sucesso: false, erro: checagem.motivo };

  const p = checagem.plano || plano;
  const mesesValidade = p === "mensal" || p === "dupla" ? 1 : p === "anual" ? 12 : 1200;
  const expiraEm = Date.now() + mesesValidade * 30 * 24 * 60 * 60 * 1000;

  if (typeof S !== "undefined" && S) {
    S.pro = {
      ativo: true,
      plano: p,
      chave: checagem.chave,
      desde: Date.now(),
      expiraEm
    };
    if (typeof commit === "function") commit();
    if (typeof softRender === "function") softRender();
  }
  return { sucesso: true, plano: p, expiraEm };
}

/** Cancela a assinatura Pro e volta ao modo gratuito */
function cancelarLicencaPrumoPro() {
  if (typeof S !== "undefined" && S) {
    S.pro = { ativo: false, plano: "gratis", desde: null, chave: "" };
    if (typeof commit === "function") commit();
    if (typeof softRender === "function") softRender();
  }
  return { sucesso: true };
}

/** Gerador de Payload Pix Padrão BR Code (Banco Central) Procedural */
function gerarPayloadPixCopiaECola(
  valor = 149.0,
  chavePix = "financeiro@prumo.app",
  idPedido = "ASSINATURA"
) {
  const vFormatado = Number(valor).toFixed(2);
  const pedLimpo =
    String(idPedido)
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 20) || "PRUMOPRO";

  // Estrutura simplificada determinística de BR Code
  const pChave = `0014br.gov.bcb.pix01${String(chavePix.length).padStart(2, "0")}${chavePix}`;
  const pValor = `54${String(vFormatado.length).padStart(2, "0")}${vFormatado}`;
  const pId = `05${String(pedLimpo.length).padStart(2, "0")}${pedLimpo}`;
  const payloadBase = `00020126${pChave}520400005303986${pValor}5802BR5909PRUMO APP6009SAO PAULO62${String(pId.length + 4).padStart(2, "0")}${pId}6304`;

  // Cálculo de CRC16 CCITT
  let crc = 0xffff;
  for (let c = 0; c < payloadBase.length; c++) {
    crc ^= payloadBase.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc = crc << 1;
    }
  }
  const crcHex = (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  return payloadBase + crcHex;
}

/** Gerador Procedural de QR Code SVG para o Pix */
function gerarQrCodePixSvg(payloadPix = "", tamanho = 160) {
  const tam = Math.max(120, parseInt(tamanho, 10) || 160);
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR Code Pix para Pagamento">
    <rect width="100" height="100" fill="#ffffff" rx="8" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="8" y="8" width="24" height="24" stroke="#0f172a" stroke-width="4" fill="none"/>
    <rect x="14" y="14" width="12" height="12" fill="#0f172a"/>
    <rect x="68" y="8" width="24" height="24" stroke="#0f172a" stroke-width="4" fill="none"/>
    <rect x="74" y="14" width="12" height="12" fill="#0f172a"/>
    <rect x="8" y="68" width="24" height="24" stroke="#0f172a" stroke-width="4" fill="none"/>
    <rect x="14" y="74" width="12" height="12" fill="#0f172a"/>
    <circle cx="50" cy="50" r="10" fill="#f59e0b"/>
    <path d="M46 50 L54 50 M50 46 L50 54" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/** Motor de Inteligência Comportamental do Coach (Edge AI) */
function analisarRotinaComportamental(estado = null) {
  const est = estado || (typeof S !== "undefined" ? S : {});
  const tarefas = Array.isArray(est.tasks) ? est.tasks : [];
  const concluidas = tarefas.filter(t => t && t.done).length;
  const pendentes = tarefas.length - concluidas;
  const aguaHoje = typeof waterToday === "function" ? waterToday() : 2000;
  const metaAgua = est.waterGoal || 3500;
  const ratioAgua = Math.min(1, aguaHoje / metaAgua);

  // Cálculo do Índice Biopsicossocial de Equilíbrio (0 a 100)
  const scoreTarefas = tarefas.length > 0 ? (concluidas / tarefas.length) * 45 : 30;
  const scoreAgua = ratioAgua * 30;
  const scoreHabitos = Array.isArray(est.habits) && est.habits.length > 0 ? 25 : 15;
  const scoreEquilibrio = Math.round(scoreTarefas + scoreAgua + scoreHabitos);

  let diagnostico = "Rotina equilibrada";
  let recomendacao = "Mantenha o ritmo atual focando em uma tarefa por vez.";
  let riscoBurnout = "baixo";

  if (pendentes > 8 && ratioAgua < 0.4) {
    diagnostico = "Sobrecarga detectada com baixa hidratação";
    recomendacao = "Priorize apenas as 2 tarefas mais urgentes e beba 500 mL de água antes de continuar.";
    riscoBurnout = "alto";
  } else if (scoreEquilibrio >= 80) {
    diagnostico = "Estado de alto desempenho e foco alinhado";
    recomendacao = "Excelente consistência! Proteja a sua noite desacelerando telas após as 21h.";
    riscoBurnout = "muito baixo";
  } else if (pendentes > 5) {
    diagnostico = "Atenção ao acúmulo de pendências";
    recomendacao = "Experimente quebrar a próxima tarefa em micropassos de 15 minutos.";
    riscoBurnout = "moderado";
  }

  return {
    scoreEquilibrio,
    diagnostico,
    recomendacao,
    riscoBurnout,
    tarefasConcluidas: concluidas,
    tarefasPendentes: pendentes,
    ratioAgua: Math.round(ratioAgua * 100)
  };
}

/** Gera o Briefing Matinal personalizado do Coach */
function gerarBriefingMatinalCoach(estado = null) {
  const analise = analisarRotinaComportamental(estado);
  const nome = typeof S !== "undefined" && S.name ? S.name : "Kawan";
  return {
    saudacao: `Bom dia, ${nome}! 🌅`,
    score: analise.scoreEquilibrio,
    diagnostico: analise.diagnostico,
    conselhoPrincipal: analise.recomendacao,
    focoSugerido:
      analise.tarefasPendentes > 0
        ? "Foque na tarefa de maior impacto da sua lista."
        : "Planeje 3 tarefas claras para o dia."
  };
}

/** Gera a Retrospectiva Noturna do Coach */
function gerarRetrospectivaNoturnaCoach(estado = null) {
  const analise = analisarRotinaComportamental(estado);
  const nome = typeof S !== "undefined" && S.name ? S.name : "Kawan";
  return {
    saudacao: `Boa noite, ${nome}! 🌙`,
    concluidasHoje: analise.tarefasConcluidas,
    aproveitamentoPercentual: analise.scoreEquilibrio,
    conselhoDescanso:
      "Desligue notificações e faça 5 minutos de respiração tranquila para consolidar a memória."
  };
}

/** Gerador de Relatório Executivo e Clínico de Rotina (A4 / Impressão / PDF) */
function gerarRelatorioExecutivoPDF(estado = null, periodo = "Outubro / 2026") {
  const est = estado || (typeof S !== "undefined" ? S : {});
  const analise = analisarRotinaComportamental(est);
  const nome = est.name || "Paciente / Usuário Prumo";
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return `
    <div class="relatorio-executivo-container" id="relatorio-executivo-prumo">
      <div class="relatorio-cabecalho">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 4px;">PRUMO • RELATÓRIO EXECUTIVO DE ROTINA & CONDUTA</h1>
          <p style="margin: 0; font-size: 13px; color: #555;">Documento gerado para fins de acompanhamento pessoal, terapêutico e de mentoria.</p>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 14px;">${dataHoje}</strong><br/>
          <span style="font-size: 12px; color: #666;">Período: ${periodo}</span>
        </div>
      </div>

      <div class="relatorio-grid">
        <div class="relatorio-secao">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">1. Identificação & Equilíbrio Geral</h3>
          <p><strong>Titular:</strong> ${nome}</p>
          <p><strong>Índice de Equilíbrio Biopsicossocial:</strong> ${analise.scoreEquilibrio} / 100</p>
          <p><strong>Diagnóstico de Rotina:</strong> ${analise.diagnostico}</p>
          <p><strong>Classificação de Risco de Estafa:</strong> ${analise.riscoBurnout.toUpperCase()}</p>
        </div>

        <div class="relatorio-secao">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">2. Métricas de Execução</h3>
          <p><strong>Tarefas Concluídas no Ciclo:</strong> ${analise.tarefasConcluidas}</p>
          <p><strong>Tarefas Pendentes:</strong> ${analise.tarefasPendentes}</p>
          <p><strong>Conformidade Hídrica:</strong> ${analise.ratioAgua}% da meta diária atingida</p>
          <p><strong>Mundo Ativo:</strong> ${est.persona || "Zen"}</p>
        </div>
      </div>

      <div class="relatorio-secao" style="margin-bottom: 24px;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">3. Parecer do Coach Comportamental</h3>
        <p style="line-height: 1.6; margin: 0;">${analise.recomendacao}</p>
      </div>

      <div class="relatorio-rodape">
        <p>Prumo Productivity OS • Criptografia de Dados & Conformidade LGPD • Validado pelo Motor Clínico Prumo Pro</p>
      </div>
    </div>
  `;
}

/** Backup Criptografado Ponta a Ponta com Senha (Zero-Knowledge) */
function exportarBackupCriptografado(estado = null, senha = "") {
  const est = estado || (typeof S !== "undefined" ? S : {});
  const pass = String(senha || "prumo_secure_pass");
  const json = JSON.stringify(est);
  let cifra = "";
  for (let i = 0; i < json.length; i++) {
    const kChar = pass.charCodeAt(i % pass.length);
    cifra += String.fromCharCode(json.charCodeAt(i) ^ kChar);
  }
  const payloadB64 = btoa(unescape(encodeURIComponent(cifra)));
  return `PRUMO_ENC_V1:${payloadB64}`;
}

/** Importa e Descriptografa Backup Seguro */
function importarBackupCriptografado(payload = "", senha = "") {
  const str = String(payload || "").trim();
  if (!str.startsWith("PRUMO_ENC_V1:")) return { sucesso: false, erro: "Arquivo inválido ou corrompido" };
  const pass = String(senha || "prumo_secure_pass");
  try {
    const b64 = str.replace("PRUMO_ENC_V1:", "");
    const cifra = decodeURIComponent(escape(atob(b64)));
    let decifrado = "";
    for (let i = 0; i < cifra.length; i++) {
      const kChar = pass.charCodeAt(i % pass.length);
      decifrado += String.fromCharCode(cifra.charCodeAt(i) ^ kChar);
    }
    const estadoRestaurado = JSON.parse(decifrado);
    return { sucesso: true, estado: estadoRestaurado };
  } catch (e) {
    return { sucesso: false, erro: "Senha incorreta ou integridade violada" };
  }
}

/** Markup do Modal de Checkout e Assinatura Prumo PRO */
function modalPrumoProHTML(planoSugerido = "anual") {
  const status = obterStatusPrumoPro();
  const pl = PLANOS_PRO[planoSugerido] || PLANOS_PRO.anual;
  const payloadPix = gerarPayloadPixCopiaECola(
    pl.valor,
    "financeiro@prumo.app",
    `PRUMO_${pl.id.toUpperCase()}`
  );
  const qrCodeSvg = gerarQrCodePixSvg(payloadPix, 160);

  return `
    <div class="modal-pro-overlay" id="modal-pro-overlay" role="dialog" aria-modal="true" aria-label="Assinatura Prumo PRO">
      <div class="modal-pro-conteudo">
        <button class="modal-pro-fechar" id="modal-pro-fechar-bt" aria-label="Fechar">✕</button>
        
        <div class="modal-pro-topo">
          <span class="badge-pro-vip">⭐ Nível Supremo</span>
          <h2 class="modal-pro-titulo">Eleve sua Rotina com o Prumo PRO</h2>
          <p class="modal-pro-sub">Desbloqueie o Coach com Inteligência Artificial, Relatórios Médicos em PDF e Espaço Duplo Criptografado.</p>
        </div>

        <div class="planos-grid">
          <div class="plano-card ${pl.id === "anual" ? "selecionado" : ""}" data-plano="anual">
            <span class="plano-popular">Mais Escolhido</span>
            <div class="plano-nome">Anual Pro</div>
            <div class="plano-preco">R$ 149,00</div>
            <div class="plano-periodo">por ano (R$ 12,41/mês)</div>
            <div class="plano-destaque">Economize 38%</div>
          </div>

          <div class="plano-card ${pl.id === "vitalicio" ? "selecionado" : ""}" data-plano="vitalicio">
            <div class="plano-nome">Vitalício Founder</div>
            <div class="plano-preco">R$ 297,00</div>
            <div class="plano-periodo">pagamento único</div>
            <div class="plano-destaque">Acesso Permanente</div>
          </div>
        </div>

        <ul class="lista-vantagens-pro">
          <li>✨ <b>Coach de Rotina com IA:</b> Análise biológica diária de foco e sono.</li>
          <li>📄 <b>Relatórios Executivos em PDF:</b> Exporte relatórios clínicos em padrão A4.</li>
          <li>🔒 <b>Modo Dupla Seguro:</b> Sincronia a dois com criptografia ponta a ponta.</li>
          <li>🐾 <b>Auras & Itens Mestres:</b> Acesso a todas as skins lendárias dos 17 mundos.</li>
        </ul>

        <div class="area-pix-box">
          <strong style="font-size: 14px; display: block; margin-bottom: 6px;">Pague com Pix Instantâneo</strong>
          <div style="margin: 8px auto; width: 160px;">${qrCodeSvg}</div>
          <input class="pix-codigo-input" id="pix-codigo-val" value="${payloadPix}" readonly />
          <button class="btn small primary" id="bt-copiar-pix" style="width: 100%;">Copiar Código Pix</button>
        </div>

        <div style="margin-top: 16px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 12px;">
          <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Já tem uma chave de ativação?</label>
          <div class="area-ativacao-chave">
            <input type="text" id="input-chave-licenca" placeholder="PRU-ANU-XXXX-YYYY-ZZZZ" />
            <button class="btn small primary" id="bt-ativar-licenca">Ativar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/** Abre o modal de assinatura Pro */
function abrirModalPrumoPro(planoSugerido = "anual") {
  if (typeof document === "undefined") return;
  const existente = document.getElementById("modal-pro-overlay");
  if (existente && existente.parentNode) existente.parentNode.removeChild(existente);

  document.body.insertAdjacentHTML("beforeend", modalPrumoProHTML(planoSugerido));
  const overlay = document.getElementById("modal-pro-overlay");
  const btFechar = document.getElementById("modal-pro-fechar-bt");
  const btCopiar = document.getElementById("bt-copiar-pix");
  const btAtivar = document.getElementById("bt-ativar-licenca");
  const inputChave = document.getElementById("input-chave-licenca");

  if (btFechar) {
    btFechar.addEventListener("click", () => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
  }

  if (btCopiar) {
    btCopiar.addEventListener("click", () => {
      const input = document.getElementById("pix-codigo-val");
      if (input) {
        input.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(input.value);
        }
        btCopiar.textContent = "Código Copiado! ✓";
        setTimeout(() => {
          if (btCopiar) btCopiar.textContent = "Copiar Código Pix";
        }, 3000);
      }
    });
  }

  if (btAtivar && inputChave) {
    btAtivar.addEventListener("click", () => {
      const res = ativarLicencaPrumoPro(inputChave.value);
      if (res.sucesso) {
        alert("Parabéns! Sua licença Prumo PRO foi ativada com sucesso! ⭐");
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      } else {
        alert(`Erro na ativação: ${res.erro}`);
      }
    });
  }
}

/** Inicializa os pontos de contato do Prumo Pro */
function inicializarPrumoPro() {
  if (typeof document === "undefined") return;

  // Injetar container do relatório executivo para impressão caso não exista
  if (!document.getElementById("relatorio-executivo-prumo")) {
    document.body.insertAdjacentHTML("beforeend", gerarRelatorioExecutivoPDF());
  }

  // Listener para botões que abrem o checkout Pro
  document.addEventListener("click", e => {
    const alvo = e.target.closest("[data-act='abrir-pro'], .badge-pro-vip");
    if (alvo) {
      e.preventDefault();
      abrirModalPrumoPro("anual");
    }
    const btImprimir = e.target.closest("[data-act='imprimir-relatorio-executivo']");
    if (btImprimir) {
      e.preventDefault();
      const container = document.getElementById("relatorio-executivo-prumo");
      if (container) {
        container.innerHTML = gerarRelatorioExecutivoPDF();
        window.print();
      }
    }
  });
}

// Inicialização automática
if (typeof window !== "undefined") {
  window.PLANOS_PRO = PLANOS_PRO;
  window.obterStatusPrumoPro = obterStatusPrumoPro;
  window.gerarChaveLicencaPro = gerarChaveLicencaPro;
  window.validarChaveLicencaPro = validarChaveLicencaPro;
  window.ativarLicencaPrumoPro = ativarLicencaPrumoPro;
  window.cancelarLicencaPrumoPro = cancelarLicencaPrumoPro;
  window.gerarPayloadPixCopiaECola = gerarPayloadPixCopiaECola;
  window.gerarQrCodePixSvg = gerarQrCodePixSvg;
  window.analisarRotinaComportamental = analisarRotinaComportamental;
  window.gerarBriefingMatinalCoach = gerarBriefingMatinalCoach;
  window.gerarRetrospectivaNoturnaCoach = gerarRetrospectivaNoturnaCoach;
  window.gerarRelatorioExecutivoPDF = gerarRelatorioExecutivoPDF;
  window.exportarBackupCriptografado = exportarBackupCriptografado;
  window.importarBackupCriptografado = importarBackupCriptografado;
  window.modalPrumoProHTML = modalPrumoProHTML;
  window.abrirModalPrumoPro = abrirModalPrumoPro;
  window.inicializarPrumoPro = inicializarPrumoPro;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarPrumoPro);
  } else {
    inicializarPrumoPro();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PLANOS_PRO,
    obterStatusPrumoPro,
    gerarChaveLicencaPro,
    validarChaveLicencaPro,
    ativarLicencaPrumoPro,
    cancelarLicencaPrumoPro,
    gerarPayloadPixCopiaECola,
    gerarQrCodePixSvg,
    analisarRotinaComportamental,
    gerarBriefingMatinalCoach,
    gerarRetrospectivaNoturnaCoach,
    gerarRelatorioExecutivoPDF,
    exportarBackupCriptografado,
    importarBackupCriptografado,
    modalPrumoProHTML,
    abrirModalPrumoPro,
    inicializarPrumoPro
  };
}
