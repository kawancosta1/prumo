/*
  Versões guardadas neste aparelho: uma cópia por dia e uma antes de cada vez que juntamos com outro aparelho.
  Ficam compactadas no localStorage (até 6) e aparecem em Ajustes → Seus dados → "Voltar no tempo".
  É a rede de segurança caso alguma sincronização dê errado: dá pra voltar e desfazer logo depois.
*/
"use strict";

const LS_VERSOES = "prumo-versoes";
const MAX_VERSOES = 6;

function lerVersoes() {
  try {
    const v = JSON.parse(lsGet(LS_VERSOES) || "[]");
    return Array.isArray(v)
      ? v.filter(x => x && typeof x.dados === "string" && typeof x.em === "number")
      : [];
  } catch (e) {
    return [];
  }
}
const bytesParaB64 = bytes => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const passarPorStream = async (bytes, stream) =>
  new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
/** Texto → "z..." (gzip em base64) ou "p..." (puro, quando o navegador não compacta). */
async function compactarVersao(texto) {
  if (typeof CompressionStream !== "function") return "p" + texto;
  return (
    "z" + bytesParaB64(await passarPorStream(new TextEncoder().encode(texto), new CompressionStream("gzip")))
  );
}
async function abrirVersao(dados) {
  if (dados[0] === "p") return JSON.parse(dados.slice(1));
  const s = atob(dados.slice(1));
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(await passarPorStream(b, new DecompressionStream("gzip"))));
}

/** Guarda uma cópia de S como está AGORA (o texto é tirado antes de qualquer espera). */
async function guardarVersao(motivo) {
  if (!S.onboarded) return;
  const texto = JSON.stringify(S),
    tarefas = S.tasks.length,
    em = Date.now();
  let dados;
  try {
    dados = await compactarVersao(texto);
  } catch (e) {
    dados = "p" + texto;
  }
  if (dados.length > 900000) return; // grande demais pra guardar aqui
  const lista = lerVersoes();
  lista.push({ em, motivo: String(motivo).slice(0, 60), tarefas, dados });
  while (lista.length > MAX_VERSOES) lista.shift();
  // sem espaço: vai largando as mais antigas
  while (lista.length) {
    try {
      localStorage.setItem(LS_VERSOES, JSON.stringify(lista));
      return;
    } catch (e) {
      lista.shift();
    }
  }
}

/** Uma cópia por dia, um pouco depois de abrir. */
function versaoDoDia() {
  const l = lerVersoes();
  const ultimaDoDia = l.filter(v => v.motivo === "cópia do dia").pop();
  if (ultimaDoDia && new Date(ultimaDoDia.em).toDateString() === new Date().toDateString()) return;
  guardarVersao("cópia do dia");
}
document.addEventListener("DOMContentLoaded", () => setTimeout(versaoDoDia, 8000));

let versaoArmada = null;
function versoesAjustesHTML() {
  const l = lerVersoes().slice().reverse();
  if (!l.length)
    return `<div class="setrow"><div class="lbl"><b>Voltar no tempo</b><span class="note">O Prumo guarda aqui uma cópia por dia. A primeira aparece amanhã.</span></div></div>`;
  return `<div class="setrow versoes"><div class="lbl"><b>Voltar no tempo</b><span class="note">Cópias guardadas neste aparelho (uma por dia e antes de juntar com outro aparelho). Restaurar dá pra desfazer logo depois.</span>
    <ul class="versoes-lista">${l
      .map(v => {
        const d = new Date(v.em);
        const quando = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} às ${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
        return `<li><span><b>${quando}</b> · ${esc(v.motivo)} · ${v.tarefas} ${v.tarefas === 1 ? "tarefa" : "tarefas"}</span><button class="btn small ${versaoArmada === v.em ? "danger" : "ghost"}" data-act="versao-restaurar" data-id="${v.em}">${versaoArmada === v.em ? "Confirmar" : "Restaurar"}</button></li>`;
      })
      .join("")}</ul></div></div>`;
}

ACOES_EXTRAS["versao-restaurar"] = async (b, id) => {
  const em = Number(id);
  if (versaoArmada !== em) {
    versaoArmada = em;
    render();
    setTimeout(() => {
      if (versaoArmada === em) {
        versaoArmada = null;
        render();
      }
    }, 5000);
    return;
  }
  versaoArmada = null;
  const v = lerVersoes().find(x => x.em === em);
  if (!v) return render();
  try {
    const estado = await abrirVersao(v.dados);
    snapUndo();
    S = normalize(estado);
    applyTheme();
    commit();
    toast("Pronto, voltou no tempo", true);
  } catch (e) {
    toast("Não consegui abrir essa cópia", false, "worried");
  }
};
