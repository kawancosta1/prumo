/*
  motor-exportacao.js - Motor de Exportação e Relatórios Tabulados em PDF (Module B).
  Serializa o estado filtrado da UI/Catálogo/Tarefas em relatório A4 pronto para impressão/PDF.
*/
"use strict";

const REGISTRO_EXPORTACOES = new Map();

/**
 * Monta o documento HTML completo e estilizado do relatório tabulado.
 */
function gerarHtmlRelatorioTabulado({
  titulo = "Relatório Executivo",
  subtitulo = "Visão Tabulada do Sistema",
  colunas = [],
  linhas = [],
  filtros = {},
  autor = "Prumo System"
} = {}) {
  const escStr =
    typeof esc === "function"
      ? esc
      : s =>
          String(s).replace(
            /[&<>"']/g,
            c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
          );
  const agora = new Date();
  const dataFormatada =
    agora.toLocaleDateString("pt-BR") +
    " às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const filtrosTexto = Object.entries(filtros)
    .filter(([, v]) => v && v !== "todas" && v !== "todos")
    .map(([k, v]) => `<b>${escStr(k)}:</b> ${escStr(v)}`)
    .join(" &nbsp;·&nbsp; ");

  const cabecalhosHtml = colunas.map(c => `<th>${escStr(c.label || c.nome || c)}</th>`).join("");

  const linhasHtml =
    linhas.length === 0
      ? `<tr><td colspan="${Math.max(1, colunas.length)}" style="text-align:center;padding:20px;color:#94a3b8;">Nenhum registro encontrado para os filtros aplicados.</td></tr>`
      : linhas
          .map(lin => {
            const celulas = Array.isArray(lin)
              ? lin.map(v => `<td>${escStr(v != null ? v : "")}</td>`).join("")
              : colunas
                  .map(col => {
                    const chave = col.key || col.chave || col;
                    const val = lin[chave] != null ? lin[chave] : "";
                    return `<td>${escStr(val)}</td>`;
                  })
                  .join("");
            return `<tr>${celulas}</tr>`;
          })
          .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escStr(titulo)} - Prumo Export</title>
  <style>
    @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11pt; }
    .header { border-bottom: 2px solid #2f6fd6; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 18pt; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .subtitle { font-size: 10pt; color: #475569; margin: 0; }
    .meta { font-size: 9pt; color: #64748b; text-align: right; }
    .filtros-box { background: #f8fafc; border-left: 4px solid #2f6fd6; padding: 8px 12px; font-size: 9pt; margin-bottom: 16px; border-radius: 0 4px 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 9.5pt; }
    th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 8.5pt; letter-spacing: 0.5px; }
    td { border: 1px solid #e2e8f0; padding: 7px 10px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">📄 ${escStr(titulo)}</h1>
      <p class="subtitle">${escStr(subtitulo)}</p>
    </div>
    <div class="meta">
      <div><b>Emissão:</b> ${dataFormatada}</div>
      <div><b>Autor:</b> ${escStr(autor)}</div>
      <div><b>Total de Itens:</b> ${linhas.length}</div>
    </div>
  </div>

  ${filtrosTexto ? `<div class="filtros-box">🔍 <b>Parâmetros de Filtro:</b> ${filtrosTexto}</div>` : ""}

  <table>
    <thead><tr>${cabecalhosHtml}</tr></thead>
    <tbody>${linhasHtml}</tbody>
  </table>

  <div class="footer">
    <span>Prumo MVP - Sistema de Gestão e Rotina com Mascote</span>
    <span>Documento Oficial Serializado · Impresso via Engine Prumo</span>
  </div>
</body>
</html>`;
}

/**
 * Dispara o processo de exportação do relatório PDF abrindo janela de impressão ou iframe.
 */
function exportarRelatorioPDF(opcoes) {
  const html = gerarHtmlRelatorioTabulado(opcoes);

  if (typeof window === "undefined") return html;

  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        setTimeout(() => {
          win.print();
        }, 300);
      };
      return html;
    }
  } catch (e) {}

  // Fallback para iframe embutido
  let iframe = document.getElementById("iframe-export-pdf");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "iframe-export-pdf";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
  }
  const doc = iframe.contentWindow || iframe.contentDocument;
  const d = doc.document || doc;
  d.open();
  d.write(html);
  d.close();
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {}
  }, 400);

  return html;
}

/**
 * Componente <ExportButton>: Devolve o botão HTML configurado para exportação rápida.
 */
function ExportButton({
  id = "exp_" + Math.random().toString(36).slice(2, 9),
  rotulo = "Exportar PDF",
  classe = "btn small ghost",
  dadosFn
} = {}) {
  if (typeof dadosFn === "function") {
    REGISTRO_EXPORTACOES.set(id, dadosFn);
  }
  return `<button type="button" class="${classe}" data-export-relatorio="${id}">📄 ${rotulo}</button>`;
}

// Delegador global de clique para botões com [data-export-relatorio]
if (typeof document !== "undefined") {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-export-relatorio]");
    if (!btn) return;
    const exportId = btn.getAttribute("data-export-relatorio");
    const fn = REGISTRO_EXPORTACOES.get(exportId);
    if (typeof fn === "function") {
      const opcoes = fn();
      if (opcoes) exportarRelatorioPDF(opcoes);
    }
  });
}

if (typeof window !== "undefined") {
  window.gerarHtmlRelatorioTabulado = gerarHtmlRelatorioTabulado;
  window.exportarRelatorioPDF = exportarRelatorioPDF;
  window.ExportButton = ExportButton;
  window.REGISTRO_EXPORTACOES = REGISTRO_EXPORTACOES;
}
