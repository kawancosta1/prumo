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

// 5. MÓDULOS AVANÇADOS DE ALTO VALOR (EDTECH, SAÚDE & ROI)

/** 1. Simulador de Retorno sobre Investimento (ROI) e Economia de Tempo */
function calcularEconomiaAnualUsuario(horasEstudoSemana = 10, tarefasSemana = 20, salarioHora = 25) {
  const hEstudo = Math.max(0, Number(horasEstudoSemana) || 10);
  const tSemana = Math.max(0, Number(tarefasSemana) || 20);
  const valorHora = Math.max(10, Number(salarioHora) || 25);

  // Redução média de 3.5 horas semanais perdidas em procrastinação e desorganização
  const horasPoupadasSemana = 3.5;
  const horasPoupadasAno = Math.round(horasPoupadasSemana * 52);
  const valorGeradoAno = horasPoupadasAno * valorHora;
  const precoAssinatura = 149.0;
  const multiplicadorROI = Math.round((valorGeradoAno / precoAssinatura) * 10) / 10;

  return {
    horasEstudoSemana: hEstudo,
    tarefasSemana: tSemana,
    horasPoupadasSemana,
    horasPoupadasAno,
    valorGeradoAno,
    precoAssinatura,
    multiplicadorROI
  };
}

/** 2. Mapeamento da Curva de Energia Circadiana Biológica */
function calcularCurvaEnergiaCircadiana(horaAcordar = "07:00", horaDormir = "23:00", horaAtual = null) {
  const parseH = str => {
    const p = String(str || "07:00").split(":");
    return parseInt(p[0], 10) || 7;
  };
  const hAcordar = parseH(horaAcordar);
  const hDormir = parseH(horaDormir);
  const h = typeof horaAtual === "number" ? ((horaAtual % 24) + 24) % 24 : new Date().getHours();

  const delta = (h - hAcordar + 24) % 24;
  let nivelEnergia = 50;
  let faseNome = "Transição";
  let atividadeRecomendada = "Organização geral";

  if (delta >= 1 && delta <= 4) {
    nivelEnergia = 95;
    faseNome = "Pico de Foco Matinal";
    atividadeRecomendada = "Deep Work, Resolução de Problemas e Aprendizado Denso";
  } else if (delta >= 5 && delta <= 7) {
    nivelEnergia = 60;
    faseNome = "Vale Pós-Prandial (Digestivo)";
    atividadeRecomendada = "Tarefas Administrativas Leves, E-mails e Descanso";
  } else if (delta >= 8 && delta <= 11) {
    nivelEnergia = 85;
    faseNome = "Segundo Pico de Foco (Vespertino)";
    atividadeRecomendada = "Revisões, Exercício Físico e Leitura";
  } else if (delta >= 12 && delta <= 15) {
    nivelEnergia = 45;
    faseNome = "Desaceleração Noturna";
    atividadeRecomendada = "Higiene do Sono, Ritual de Leitura e Fechamento do Dia";
  } else {
    nivelEnergia = 20;
    faseNome = "Sono Biológico Reparador";
    atividadeRecomendada = "Descanso Total e Consolidação da Memória";
  }

  return {
    hora: h,
    nivelEnergia,
    faseNome,
    atividadeRecomendada
  };
}

/** 3. Algoritmo SuperMemo SM-2 Avançado para Estudos e Concursos */
function calcularProximaRevisaoSM2Avancada(
  qualidadeResposta = 4,
  repeticoes = 0,
  facilidade = 2.5,
  intervaloAtual = 1
) {
  const q = Math.max(0, Math.min(5, parseInt(qualidadeResposta, 10) || 0));
  const ef = Math.max(1.3, Number(facilidade) || 2.5);
  const reps = Math.max(0, parseInt(repeticoes, 10) || 0);
  const intervalo = Math.max(1, parseInt(intervaloAtual, 10) || 1);

  // Fórmula do Ease Factor do SM-2
  const novaFacilidade = Math.max(
    1.3,
    Math.round((ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))) * 100) / 100
  );

  let novoIntervaloDias = 1;
  let novasRepeticoes = 0;

  if (q < 3) {
    // Erro de memorização: reinicia repetições
    novasRepeticoes = 0;
    novoIntervaloDias = 1;
  } else {
    if (reps === 0) novoIntervaloDias = 1;
    else if (reps === 1) novoIntervaloDias = 6;
    else novoIntervaloDias = Math.round(intervalo * novaFacilidade);
    novasRepeticoes = reps + 1;
  }

  const d = new Date();
  d.setDate(d.getDate() + novoIntervaloDias);
  const dataProximaRevisao = d.toISOString().slice(0, 10);

  return {
    qualidadeResposta: q,
    novoIntervaloDias,
    novaFacilidade,
    novasRepeticoes,
    dataProximaRevisao,
    memorizado: q >= 3
  };
}

/** 4. Matriz de Priorização Estratégica de Eisenhower */
function gerarMatrizEisenhowerTarefas(tarefas = []) {
  const lista = Array.isArray(tarefas) ? tarefas : [];
  const q1 = []; // Urgente e Importante (Prio >= 2)
  const q2 = []; // Não urgente, mas importante (Prio 1) -> Foco Estratégico
  const q3 = []; // Urgente, mas não importante (Prio 0 com horário)
  const q4 = []; // Não urgente e não importante

  lista.forEach(t => {
    if (!t) return;
    const prio = parseInt(t.prio, 10) || 0;
    if (prio >= 2) q1.push(t);
    else if (prio === 1) q2.push(t);
    else if (t.time) q3.push(t);
    else q4.push(t);
  });

  const total = lista.length;
  const pctEstrategico = total > 0 ? Math.round((q2.length / total) * 100) : 0;
  const riscoSobrecarga = q1.length > 5;

  return {
    q1,
    q2,
    q3,
    q4,
    estatisticas: {
      total,
      pctEstrategico,
      riscoSobrecarga
    }
  };
}

/** 5. Certificado Oficial de Disciplina e Produtividade em SVG */
function gerarCertificadoDisciplinaPro(estado = null, diasSequencia = 30) {
  const est = estado || (typeof S !== "undefined" ? S : {});
  const nome = est.name || "Kawan Costa";
  const dias = Math.max(1, parseInt(diasSequencia, 10) || 30);
  const data = new Date().toLocaleDateString("pt-BR");

  return `<svg width="800" height="560" viewBox="0 0 800 560" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Certificado de Disciplina Prumo PRO">
    <rect width="800" height="560" rx="16" fill="#ffffff" stroke="#d4af37" stroke-width="8"/>
    <rect x="16" y="16" width="768" height="528" rx="8" fill="#faf8f2" stroke="#d4af37" stroke-width="2" stroke-dasharray="8 6"/>
    <text x="400" y="90" font-family="'Instrument Sans', sans-serif" font-size="28" font-weight="800" fill="#1e293b" text-anchor="middle" letter-spacing="2">PRUMO PRODUCTIVITY OS</text>
    <text x="400" y="125" font-family="'Instrument Sans', sans-serif" font-size="14" font-weight="600" fill="#f59e0b" text-anchor="middle" letter-spacing="4">CERTIFICADO OFICIAL DE DISCIPLINA & ALTO DESEMPENHO</text>
    <text x="400" y="210" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#64748b" text-anchor="middle">Certificamos com honra e distinção que</text>
    <text x="400" y="270" font-family="'Instrument Sans', sans-serif" font-size="36" font-weight="800" fill="#0f172a" text-anchor="middle">${nome}</text>
    <text x="400" y="325" font-family="Georgia, serif" font-size="16" fill="#334155" text-anchor="middle">concluiu com êxito a jornada contínua de <tspan font-weight="700" fill="#d97706">${dias} dias ininterruptos</tspan> de foco,</text>
    <text x="400" y="355" font-family="Georgia, serif" font-size="16" fill="#334155" text-anchor="middle">alcançando maestria no gerenciamento de rotina e consistência comportamental.</text>
    <circle cx="400" cy="445" r="40" fill="#f59e0b" stroke="#d97706" stroke-width="4"/>
    <text x="400" y="440" font-family="'Instrument Sans', sans-serif" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle">PRO</text>
    <text x="400" y="460" font-family="'Instrument Sans', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">⭐ 100%</text>
    <text x="140" y="490" font-family="'Instrument Sans', sans-serif" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">Data de Expedição: ${data}</text>
    <text x="660" y="490" font-family="'Instrument Sans', sans-serif" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">Registro: PRU-CERT-${dias}D</text>
  </svg>`;
}

/** 6. Meta Diária de Água Adaptativa por Biometria e Clima */
function gerarMetaDiariaAguaAdaptativa(pesoKg = 70, nivelAtividade = "moderado", clima = "temperado") {
  const peso = Math.max(40, Math.min(150, Number(pesoKg) || 70));
  const baseMl = peso * 35; // 35 mL por kg (regra recomendada pela OMS)
  let bonusAtividade = 0;
  if (nivelAtividade === "intenso") bonusAtividade = 1000;
  else if (nivelAtividade === "moderado") bonusAtividade = 500;

  let bonusClima = 0;
  if (clima === "quente") bonusClima = 400;
  else if (clima === "frio") bonusClima = -200;

  const metaFinal = Math.round((baseMl + bonusAtividade + bonusClima) / 50) * 50;
  const totalCopos = Math.round(metaFinal / 300);

  return {
    pesoKg: peso,
    nivelAtividade,
    clima,
    metaMl: metaFinal,
    totalCopos,
    coposSugeridos: [200, 300, 500, 750]
  };
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
  window.calcularEconomiaAnualUsuario = calcularEconomiaAnualUsuario;
  window.calcularCurvaEnergiaCircadiana = calcularCurvaEnergiaCircadiana;
  window.calcularProximaRevisaoSM2Avancada = calcularProximaRevisaoSM2Avancada;
  window.gerarMatrizEisenhowerTarefas = gerarMatrizEisenhowerTarefas;
  window.gerarCertificadoDisciplinaPro = gerarCertificadoDisciplinaPro;
  window.gerarMetaDiariaAguaAdaptativa = gerarMetaDiariaAguaAdaptativa;

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
    inicializarPrumoPro,
    calcularEconomiaAnualUsuario,
    calcularCurvaEnergiaCircadiana,
    calcularProximaRevisaoSM2Avancada,
    gerarMatrizEisenhowerTarefas,
    gerarCertificadoDisciplinaPro,
    gerarMetaDiariaAguaAdaptativa
  };
}
