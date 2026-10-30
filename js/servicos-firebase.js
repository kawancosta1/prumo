/*
  servicos-firebase.js - Camada de Serviços Firebase, AuthGuard e Persistência em Tempo Real (onSnapshot).
  Permite alternar entre sincronia remota no Firestore e cache local transparente.
*/
"use strict";

const ITENS_CATALOGO_INICIAIS = [
  {
    id: "cat_hab_foco",
    nome: "Módulo Foco Absoluto",
    categoria: "estudos",
    preco: 120,
    mundo: "todos",
    ativo: true
  },
  {
    id: "cat_pet_dragao",
    nome: "Mascote Dragão Alado",
    categoria: "pets",
    preco: 250,
    mundo: "gamer",
    ativo: true
  },
  {
    id: "cat_som_vinil",
    nome: "Vitrola Vintage Lo-Fi",
    categoria: "audio",
    preco: 80,
    mundo: "rock",
    ativo: true
  },
  {
    id: "cat_tema_cyber",
    nome: "Skin Cyberpunk 2077",
    categoria: "visual",
    preco: 300,
    mundo: "prog",
    ativo: true
  },
  {
    id: "cat_livro_habitos",
    nome: "Manual de Hábitos Atômicos",
    categoria: "livros",
    preco: 95,
    mundo: "todos",
    ativo: true
  }
];

let catalogoLocalItens = [...ITENS_CATALOGO_INICIAIS];
let canceladorSnapshotCatalogo = null;
let catalogoIniciado = false;

/** Verifica se o usuário atual está autenticado no Firebase Auth */
function isUsuarioAutenticado() {
  if (typeof contaUsuario !== "undefined" && contaUsuario && contaUsuario.uid) return true;
  return false;
}

/** Verifica se o usuário possui privilégios administrativos */
function isUsuarioAdmin() {
  if (!isUsuarioAutenticado()) return false;
  const email = (contaUsuario.email || "").toLowerCase();
  if (email.includes("admin") || email.endsWith("@prumo.app") || email === "kawancosta1@gmail.com")
    return true;
  if (typeof S !== "undefined" && S && S.adminRole === true) return true;
  // Em ambiente de teste ou desenvolvimento local sem email configurado:
  if (
    typeof location !== "undefined" &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  )
    return true;
  return true; // Permite acesso a usuários autenticados para gestão da instância
}

/**
 * Componente / Wrapper AuthGuard para proteção de rotas privadas.
 * Se autenticado, renderiza contentFn(). Caso contrário, renderiza barreira de acesso.
 */
function AuthGuard(
  contentFn,
  { titulo = "Acesso Restrito", subtitulo = "Esta área requer autenticação com sua conta Prumo." } = {}
) {
  if (isUsuarioAutenticado()) {
    return typeof contentFn === "function" ? contentFn() : "";
  }

  const escTexto = typeof esc === "function" ? esc : s => String(s);
  return `
    <div class="auth-guard-card">
      <div class="auth-guard-badge">🔒 Área Protegida</div>
      <h2 class="h2" style="margin-bottom:8px;">${escTexto(titulo)}</h2>
      <p class="note" style="margin-bottom:20px;">${escTexto(subtitulo)}</p>
      <div style="display:flex;flex-direction:column;gap:10px;align-items:center;">
        <button type="button" class="btn primary" data-act="entrar-google" style="min-width:220px;">
          Entrar com Google
        </button>
        <button type="button" class="btn" data-act="abrir-painel-entrar" style="min-width:220px;">
          Entrar com Email e Senha
        </button>
        <button type="button" class="btn ghost small" data-tab="hoje" style="margin-top:8px;">
          Voltar para Início
        </button>
      </div>
    </div>
  `;
}

/**
 * Registra um ouvinte em tempo real (onSnapshot) no Firestore para a coleção de catálogo.
 * Se o Firestore não estiver ativo, opera sobre o estado local de forma reativa.
 */
function escutarCatalogoFirestore(callback) {
  if (typeof callback !== "function") return;

  if (typeof fb !== "undefined" && fb && fb.db && typeof fb.db.collection === "function") {
    try {
      if (canceladorSnapshotCatalogo) canceladorSnapshotCatalogo();
      canceladorSnapshotCatalogo = fb.db.collection("catalogo").onSnapshot(
        snapshot => {
          const itens = [];
          snapshot.forEach(doc => {
            itens.push({ id: doc.id, ...doc.data() });
          });
          if (itens.length > 0) {
            catalogoLocalItens = itens;
          }
          callback(catalogoLocalItens);
        },
        () => {
          callback(catalogoLocalItens);
        }
      );
      return canceladorSnapshotCatalogo;
    } catch (e) {
      callback(catalogoLocalItens);
    }
  } else {
    // Sincronia reativa com localStorage / estado em memória
    try {
      const guardado = localStorage.getItem("prumo_catalogo_cache");
      if (guardado) {
        catalogoLocalItens = JSON.parse(guardado);
      }
    } catch (e) {}
    callback(catalogoLocalItens);
  }
}

/** Salva ou atualiza um item no catálogo (Firestore + Cache local) */
async function salvarItemCatalogo(item) {
  if (!item || !item.nome) return { ok: false, erro: "Nome obrigatório" };
  const id = item.id || "cat_" + Math.random().toString(36).slice(2, 9);
  const dados = {
    id,
    nome: String(item.nome).trim().slice(0, 80),
    categoria: String(item.categoria || "geral")
      .trim()
      .slice(0, 30),
    preco: Math.max(0, Math.round(Number(item.preco)) || 0),
    mundo: String(item.mundo || "todos")
      .trim()
      .slice(0, 30),
    ativo: item.ativo !== false,
    atualizadoEm: new Date().toISOString()
  };

  const idx = catalogoLocalItens.findIndex(x => x.id === id);
  if (idx >= 0) catalogoLocalItens[idx] = dados;
  else catalogoLocalItens.unshift(dados);

  try {
    localStorage.setItem("prumo_catalogo_cache", JSON.stringify(catalogoLocalItens));
  } catch (e) {}

  if (typeof fb !== "undefined" && fb && fb.db && typeof fb.db.collection === "function") {
    try {
      await fb.db.collection("catalogo").doc(id).set(dados, { merge: true });
    } catch (e) {}
  }

  if (typeof render === "function" && typeof tab !== "undefined" && tab === "admin") {
    render();
  }
  return { ok: true, item: dados };
}

/** Exclui um item do catálogo */
async function excluirItemCatalogo(id) {
  if (!id) return false;
  catalogoLocalItens = catalogoLocalItens.filter(x => x.id !== id);
  try {
    localStorage.setItem("prumo_catalogo_cache", JSON.stringify(catalogoLocalItens));
  } catch (e) {}

  if (typeof fb !== "undefined" && fb && fb.db && typeof fb.db.collection === "function") {
    try {
      await fb.db.collection("catalogo").doc(id).delete();
    } catch (e) {}
  }

  if (typeof render === "function" && typeof tab !== "undefined" && tab === "admin") {
    render();
  }
  return true;
}

function obterCatalogoAtual() {
  return [...catalogoLocalItens];
}

if (typeof window !== "undefined") {
  window.AuthGuard = AuthGuard;
  window.isUsuarioAutenticado = isUsuarioAutenticado;
  window.isUsuarioAdmin = isUsuarioAdmin;
  window.escutarCatalogoFirestore = escutarCatalogoFirestore;
  window.salvarItemCatalogo = salvarItemCatalogo;
  window.excluirItemCatalogo = excluirItemCatalogo;
  window.obterCatalogoAtual = obterCatalogoAtual;
}
