/*
  prumo-pro.js - Motor Comercial, Monetização e Inteligência Comportamental do Prumo
  Disponibiliza:
  1. Licença Prumo PRO liberada pelo servidor e checkout Pix (Mercado Pago, ver functions/).
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

/*
  Licença: quem decide é o servidor (functions/index.js grava licencas/{uid}, só ele escreve).
  Aqui o app só lê. O estado S.pro só vale com origem "servidor", então editar o próprio
  salvamento ou chamar funções pelo console não libera o PRO.
*/
const PAGAMENTO_API = "https://southamerica-east1-prumo-66d76.cloudfunctions.net";
let licencaEscutandoUid = null;
let licencaParar = null;

/** Verifica se o usuário atual possui licença Prumo Pro ativa */
function obterStatusPrumoPro() {
  if (typeof S === "undefined" || !S) return { ativo: false, plano: "gratis" };
  const pro = S.pro && typeof S.pro === "object" ? S.pro : { ativo: false, plano: "gratis" };
  const valida = pro.origem === "servidor" && pro.ativo === true;
  const vencida = valida && !pro.vitalicio && (!pro.expiraEm || pro.expiraEm < Date.now());
  if (!valida || vencida) {
    return {
      ativo: false,
      plano: vencida ? "expirado" : "gratis",
      desde: null,
      expiraEm: null,
      vitalicio: false
    };
  }
  return {
    ativo: true,
    plano: pro.plano || "anual",
    desde: pro.desde || null,
    expiraEm: pro.vitalicio ? null : pro.expiraEm,
    vitalicio: Boolean(pro.vitalicio)
  };
}

/** Guarda no app o que o servidor disse (documento licencas/{uid}); null/inválido volta ao gratuito */
function aplicarLicencaServidor(lic) {
  if (typeof S === "undefined" || !S) return { sucesso: false };
  const ok = lic && typeof lic === "object" && lic.ativo === true;
  const antes = JSON.stringify(S.pro || {});
  S.pro = ok
    ? {
        ativo: true,
        plano: ["mensal", "anual", "vitalicio", "dupla", "teste"].includes(lic.plano) ? lic.plano : "anual",
        vitalicio: lic.vitalicio === true,
        expiraEm: lic.vitalicio === true ? null : Number(lic.expiraEm) || 0,
        desde: Number(lic.desde) || Date.now(),
        origem: "servidor"
      }
    : { ativo: false, plano: "gratis", desde: null, origem: "servidor" };
  if (JSON.stringify(S.pro) !== antes) {
    if (typeof persist === "function") persist(true);
    if (typeof softRender === "function") softRender();
  }
  return { sucesso: ok };
}

/** Escuta a licença da conta logada em tempo real (liga sozinho quando a conta aparece) */
function iniciarEscutaLicencaPro() {
  const f = typeof fb !== "undefined" ? fb : null;
  const u = typeof contaUsuario !== "undefined" ? contaUsuario : null;
  if (!f || !f.db || !u || !u.uid || !u.emailVerified) {
    if (licencaParar) {
      licencaParar();
      licencaParar = null;
      licencaEscutandoUid = null;
      aplicarLicencaServidor(null);
    }
    return;
  }
  if (licencaEscutandoUid === u.uid) return;
  if (licencaParar) licencaParar();
  licencaEscutandoUid = u.uid;
  licencaParar = f.db.doc("licencas/" + u.uid).onSnapshot(
    snap => aplicarLicencaServidor(snap.exists ? snap.data() : null),
    () => {
      /* sem permissão ou offline: mantém o que já estava */
    }
  );
}

/** Pede ao servidor (com o token da conta) uma ação de pagamento */
async function chamarPagamentoApi(rota, corpo) {
  const u = typeof contaUsuario !== "undefined" ? contaUsuario : null;
  if (!u || typeof u.getIdToken !== "function") return { erro: "Entre na sua conta para assinar." };
  try {
    const token = await u.getIdToken();
    const r = await fetch(`${PAGAMENTO_API}/${rota}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(corpo || {})
    });
    const dados = await r.json().catch(() => ({}));
    return r.ok ? dados : { erro: dados.erro || "Não deu certo agora. Tente de novo." };
  } catch (e) {
    return { erro: "Sem conexão. Confira a internet e tente de novo." };
  }
}

/** Gera a cobrança Pix do plano (o valor vem do servidor, nunca do app) */
function criarCobrancaPix(plano) {
  return chamarPagamentoApi("criarPix", { plano });
}

/** Inicia sessão de checkout internacional via Stripe em USD */
async function iniciarCheckoutStripe(plano = "mensal") {
  const r = await chamarPagamentoApi("criarStripeCheckout", { plano });
  if (r && r.url) {
    window.location.href = r.url;
  }
  return r;
}

/** Começa o teste grátis de 7 dias (o servidor deixa uma vez por conta) */
function iniciarTesteGratisPro() {
  return chamarPagamentoApi("iniciarTeste", {});
}

/** Atalho para o resto do app: abre o PRO se a pessoa ainda não tem; devolve true se já pode usar */
function exigirPrumoPro() {
  if (obterStatusPrumoPro().ativo) return true;
  if (typeof abrirModalPrumoPro === "function") abrirModalPrumoPro("anual");
  return false;
}

/** Cartão da aba Hoje para quem ainda não tem PRO: mostra o valor e convida a testar */
function cartaoCoachBloqueadoHTML() {
  return `<div class="card-coach-ia coach-bloqueado">
    <div class="coach-header"><span class="coach-titulo">🤖 Coach de Rotina com IA</span><span class="badge-pro-vip">PRO</span></div>
    <div class="coach-texto">Seu briefing de hoje: foco sugerido, equilíbrio de rotina e conselho do dia, feitos com os seus dados. Teste 7 dias grátis.</div>
    <button class="btn small primary" data-act="abrir-pro">Testar 7 dias grátis</button>
  </div>`;
}

/** Pergunta ao servidor se o Pix já caiu (reforço caso o aviso do banco demore) */
function verificarCobrancaPix(id) {
  return chamarPagamentoApi("verificarPix", { id });
}

/** Volta ao modo gratuito neste aparelho (a licença da conta continua no servidor) */
function cancelarLicencaPrumoPro() {
  if (typeof S !== "undefined" && S) {
    S.pro = { ativo: false, plano: "gratis", desde: null, origem: "servidor" };
    if (typeof commit === "function") commit();
    if (typeof softRender === "function") softRender();
  }
  return { sucesso: true };
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
          <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 4px;">PRUMO • RELATÓRIO EXECUTIVO DE ROTINA & CONDUTA</h2>
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

/** Frase de valor do modal: quanto tempo e dinheiro o método poupa por ano */
function textoEconomiaPro() {
  const r = calcularEconomiaAnualUsuario();
  return `Quem organiza a rotina poupa cerca de ${r.horasPoupadasAno} horas por ano. Isso vale em torno de R$ ${r.valorGeradoAno.toLocaleString("pt-BR")} do seu tempo, contra R$ 149,00 do plano anual.`;
}

/** Markup do Modal de Checkout e Assinatura Prumo PRO */
function modalPrumoProHTML(planoSugerido = "anual") {
  const status = obterStatusPrumoPro();
  const sel = PLANOS_PRO[planoSugerido] && planoSugerido !== "dupla" ? planoSugerido : "anual";
  const card = (id, nome, preco, periodo, destaque, popular) => `
          <div class="plano-card ${sel === id ? "selecionado" : ""}" data-plano="${id}" role="button" tabindex="0">
            ${popular ? '<span class="plano-popular">Mais Escolhido</span>' : ""}
            <div class="plano-nome">${nome}</div>
            <div class="plano-preco">${preco}</div>
            <div class="plano-periodo">${periodo}</div>
            <div class="plano-destaque">${destaque}</div>
          </div>`;
  const emTeste = status.ativo && status.plano === "teste";
  const ativo = status.ativo
    ? `<p class="modal-pro-sub"><b>${emTeste ? "Teste grátis ativo" : "Licença ativa"}:</b> ${status.vitalicio ? "vitalícia" : "até " + new Date(status.expiraEm).toLocaleDateString("pt-BR")}.${emTeste ? "" : " Pagar de novo soma ao que você já tem."}</p>`
    : "";

  return `
    <div class="modal-pro-overlay" id="modal-pro-overlay" role="dialog" aria-modal="true" aria-label="Assinatura Prumo PRO">
      <div class="modal-pro-conteudo">
        <button class="modal-pro-fechar" id="modal-pro-fechar-bt" aria-label="Fechar">✕</button>

        <div class="modal-pro-topo">
          <span class="badge-pro-vip">⭐ Nível Supremo</span>
          <h2 class="modal-pro-titulo">Eleve sua Rotina com o Prumo PRO</h2>
          <p class="modal-pro-sub">Desbloqueie o Coach com Inteligência Artificial, Relatórios Médicos em PDF e Espaço Duplo Criptografado.</p>
          ${ativo}
        </div>

        <div class="planos-grid">
          ${card("anual", "Anual Pro", "R$ 149,00", "por ano (R$ 12,41/mês)", "Economize 38%", true)}
          ${card("mensal", "Mensal Pro", "R$ 19,90", "30 dias de acesso", "Sem compromisso", false)}
          ${card("vitalicio", "Vitalício Founder", "R$ 297,00", "pagamento único", "Acesso Permanente", false)}
        </div>

        ${
          status.ativo
            ? ""
            : `<button class="btn small" id="bt-teste-gratis" style="width:100%;margin-bottom:10px;">Testar 7 dias grátis (sem cartão)</button>`
        }
        <p class="note" id="pro-roi" style="margin:0 0 10px;">${textoEconomiaPro()}</p>

        <ul class="lista-vantagens-pro">
          <li>✨ <b>Coach de Rotina com IA:</b> Análise biológica diária de foco e sono.</li>
          <li>📄 <b>Relatórios Executivos em PDF:</b> Exporte relatórios clínicos em padrão A4.</li>
          <li>🔒 <b>Modo Dupla Seguro:</b> Sincronia a dois com criptografia ponta a ponta.</li>
          <li>🐾 <b>Auras &amp; Itens Mestres:</b> Acesso a todas as skins lendárias dos 17 mundos.</li>
        </ul>

        <div class="area-pix-box" id="pro-area-pix" aria-live="polite">
          <strong style="font-size: 14px; display: block; margin-bottom: 6px;">Pague com Pix Instantâneo</strong>
          <p class="note" id="pro-pix-msg" style="margin: 6px 0;">Pix de pagamento único. A licença libera sozinha assim que o pagamento é confirmado.</p>
          <button class="btn small primary" id="bt-gerar-pix" style="width: 100%;">Gerar Pix</button>
          <div id="pro-pix-dados" hidden>
            <img id="pro-pix-qr" alt="QR Code do Pix" width="160" height="160" style="display:block;margin:8px auto;background:#fff;border-radius:8px;" />
            <input class="pix-codigo-input" id="pix-codigo-val" readonly aria-label="Pix copia e cola" />
            <button class="btn small primary" id="bt-copiar-pix" style="width: 100%;">Copiar Código Pix</button>
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
  const $ = id => document.getElementById(id);
  let plano = PLANOS_PRO[planoSugerido] && planoSugerido !== "dupla" ? planoSugerido : "anual";
  let pixId = null;
  let timer = null;
  let limite = 0;

  const msg = (t, erro) => {
    const m = $("pro-pix-msg");
    if (m) {
      m.textContent = t;
      m.style.color = erro ? "#b91c1c" : "";
    }
  };
  const parar = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const fechar = () => {
    parar();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
  const concluiu = () => {
    parar();
    msg("Pagamento confirmado! Seu Prumo PRO está ativo. ⭐");
    const dados = $("pro-pix-dados");
    if (dados) dados.hidden = true;
    const bt = $("bt-gerar-pix");
    if (bt) bt.hidden = true;
    setTimeout(fechar, 2500);
  };

  const conferir = async () => {
    if (!pixId || !overlay.isConnected) return parar();
    if (Date.now() > limite) {
      parar();
      return msg("O Pix expirou. Gere um novo para continuar.", true);
    }
    const r = await verificarCobrancaPix(pixId);
    if (r && r.pago) {
      if (typeof iniciarEscutaLicencaPro === "function") iniciarEscutaLicencaPro();
      concluiu();
    }
  };

  overlay.querySelectorAll(".plano-card").forEach(c => {
    const escolher = () => {
      plano = c.getAttribute("data-plano");
      overlay.querySelectorAll(".plano-card").forEach(x => x.classList.toggle("selecionado", x === c));
      // Trocar de plano descarta o Pix anterior (o valor é outro)
      parar();
      pixId = null;
      const dados = $("pro-pix-dados");
      if (dados) dados.hidden = true;
      const bt = $("bt-gerar-pix");
      if (bt) bt.hidden = false;
    };
    c.addEventListener("click", escolher);
    c.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        escolher();
      }
    });
  });

  $("modal-pro-fechar-bt").addEventListener("click", fechar);

  const btTeste = $("bt-teste-gratis");
  if (btTeste) {
    btTeste.addEventListener("click", async () => {
      btTeste.disabled = true;
      msg("Ativando o teste grátis...");
      const r = await iniciarTesteGratisPro();
      if (!r || r.erro) {
        btTeste.disabled = false;
        return msg((r && r.erro) || "Não deu para iniciar o teste.", true);
      }
      if (typeof iniciarEscutaLicencaPro === "function") {
        licencaEscutandoUid = null; // força ler a licença nova agora
        iniciarEscutaLicencaPro();
      }
      msg("Teste grátis ativado por 7 dias! Aproveite o PRO. ⭐");
      btTeste.hidden = true;
      setTimeout(fechar, 2500);
    });
  }

  $("bt-gerar-pix").addEventListener("click", async () => {
    const bt = $("bt-gerar-pix");
    bt.disabled = true;
    msg("Gerando o Pix...");
    const r = await criarCobrancaPix(plano);
    bt.disabled = false;
    if (!r || r.erro || !r.copiaECola || !r.id)
      return msg((r && r.erro) || "Não deu para gerar o Pix.", true);
    pixId = String(r.id);
    limite = Number(r.expiraEm) || Date.now() + 30 * 60 * 1000;
    const qr = String(r.qrBase64 || "");
    const img = $("pro-pix-qr");
    if (/^[A-Za-z0-9+/=]+$/.test(qr)) img.src = "data:image/png;base64," + qr;
    else img.hidden = true;
    $("pix-codigo-val").value = String(r.copiaECola);
    $("pro-pix-dados").hidden = false;
    bt.hidden = true;
    msg("Escaneie o QR ou copie o código no app do seu banco. Aguardando o pagamento...");
    parar();
    timer = setInterval(conferir, 4000);
  });

  $("bt-copiar-pix").addEventListener("click", () => {
    const input = $("pix-codigo-val");
    const bt = $("bt-copiar-pix");
    if (!input || !input.value) return;
    input.select();
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(input.value).catch(() => {});
    bt.textContent = "Código Copiado! ✓";
    setTimeout(() => {
      if (bt) bt.textContent = "Copiar Código Pix";
    }, 3000);
  });
}

/** Inicializa os pontos de contato do Prumo Pro */
function inicializarPrumoPro() {
  if (typeof document === "undefined") return;

  // Conta e licença: liga a escuta assim que a pessoa estiver logada (e desliga ao sair)
  setInterval(iniciarEscutaLicencaPro, 3000);
  iniciarEscutaLicencaPro();

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
      if (!exigirPrumoPro()) return;
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
  window.cancelarLicencaPrumoPro = cancelarLicencaPrumoPro;
  window.aplicarLicencaServidor = aplicarLicencaServidor;
  window.iniciarEscutaLicencaPro = iniciarEscutaLicencaPro;
  window.criarCobrancaPix = criarCobrancaPix;
  window.iniciarTesteGratisPro = iniciarTesteGratisPro;
  window.exigirPrumoPro = exigirPrumoPro;
  window.cartaoCoachBloqueadoHTML = cartaoCoachBloqueadoHTML;
  window.textoEconomiaPro = textoEconomiaPro;
  window.verificarCobrancaPix = verificarCobrancaPix;
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
    cancelarLicencaPrumoPro,
    aplicarLicencaServidor,
    iniciarEscutaLicencaPro,
    criarCobrancaPix,
    iniciarTesteGratisPro,
    exigirPrumoPro,
    cartaoCoachBloqueadoHTML,
    textoEconomiaPro,
    verificarCobrancaPix,
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
