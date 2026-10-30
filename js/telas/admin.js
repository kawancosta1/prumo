/*
  telas/admin.js - Painel de Administração e DataGrid CRUD do Catálogo com Firestore.
*/
"use strict";

let filtroAdminBusca = "";
let filtroAdminCategoria = "todas";
let itemAdminEdicao = null;
let modalAdminAberto = false;

function renderConteudoPainelAdmin() {
  const itens = typeof obterCatalogoAtual === "function" ? obterCatalogoAtual() : [];
  const q = filtroAdminBusca.toLowerCase().trim();
  const filtrados = itens.filter(it => {
    const bateTexto =
      !q ||
      it.nome.toLowerCase().includes(q) ||
      it.id.toLowerCase().includes(q) ||
      (it.categoria && it.categoria.toLowerCase().includes(q));
    const bateCat = filtroAdminCategoria === "todas" || it.categoria === filtroAdminCategoria;
    return bateTexto && bateCat;
  });

  const categorias = ["todas", ...new Set(itens.map(it => it.categoria).filter(Boolean))];

  return `
    <div class="admin-wrap">
      <div class="admin-header">
        <div>
          <h1 class="h1" style="margin-bottom:4px;">Painel Administrativo</h1>
          <p class="note">DataGrid CRUD e Gestão de Entidades com Persistência Firestore</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn small primary" data-act="admin-novo-modal">
            ➕ Novo Item
          </button>
          <button type="button" class="btn small ghost" data-act="admin-sincronizar">
            🔄 Sincronizar
          </button>
          ${
            typeof ExportButton === "function"
              ? ExportButton({
                  id: "exp_admin_catalogo",
                  rotulo: "Exportar Catálogo PDF",
                  classe: "btn small ghost",
                  dadosFn: () => ({
                    titulo: "Relatório de Entidades do Catálogo",
                    subtitulo: "Inventário Geral e Dados Comerciais Prumo",
                    colunas: [
                      { key: "id", label: "ID" },
                      { key: "nome", label: "Nome da Entidade" },
                      { key: "categoria", label: "Categoria" },
                      { key: "preco", label: "Preço (Gotas)" },
                      { key: "mundo", label: "Mundo" },
                      { key: "status", label: "Status" }
                    ],
                    linhas: filtrados.map(it => ({
                      id: it.id,
                      nome: it.nome,
                      categoria: (it.categoria || "geral").toUpperCase(),
                      preco: "💧 " + (it.preco || 0),
                      mundo: it.mundo || "todos",
                      status: it.ativo !== false ? "Ativo" : "Inativo"
                    })),
                    filtros: {
                      "Termo de busca": filtroAdminBusca || "Nenhum",
                      "Categoria selecionada": filtroAdminCategoria || "Todas"
                    },
                    autor: typeof S !== "undefined" && S.name ? S.name : "Administrador"
                  })
                })
              : ""
          }
        </div>
      </div>

      <div class="admin-toolbar">
        <input 
          type="text" 
          id="admin-busca" 
          class="admin-search-input" 
          placeholder="Buscar por ID, nome ou categoria..." 
          value="${typeof esc === "function" ? esc(filtroAdminBusca) : filtroAdminBusca}"
        />
        <select id="admin-filtro-cat" class="btn small ghost" style="padding:8px 12px;border-radius:8px;">
          ${categorias.map(cat => `<option value="${cat}" ${filtroAdminCategoria === cat ? "selected" : ""}>Categoria: ${cat.toUpperCase()}</option>`).join("")}
        </select>
        <span class="note" style="margin-left:auto;">${filtrados.length} de ${itens.length} itens</span>
      </div>

      <div class="admin-datagrid-container">
        <table class="admin-datagrid">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da Entidade</th>
              <th>Categoria</th>
              <th>Preço (Gotas)</th>
              <th>Mundo</th>
              <th>Status</th>
              <th style="text-align:right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${
              filtrados.length === 0
                ? `<tr><td colspan="7" style="text-align:center;padding:32px;" class="note">Nenhum item encontrado no catálogo.</td></tr>`
                : filtrados
                    .map(it => {
                      const escStr = typeof esc === "function" ? esc : s => String(s);
                      return `
                  <tr>
                    <td><code>${escStr(it.id)}</code></td>
                    <td><b>${escStr(it.nome)}</b></td>
                    <td><span class="admin-chip">${escStr(it.categoria || "geral")}</span></td>
                    <td>💧 ${it.preco || 0}</td>
                    <td>${escStr(it.mundo || "todos")}</td>
                    <td>${it.ativo !== false ? '<span style="color:#16a34a;font-weight:700;">● Ativo</span>' : '<span style="color:#94a3b8;">○ Inativo</span>'}</td>
                    <td style="text-align:right;">
                      <div class="admin-acoes-col" style="justify-content:flex-end;">
                        <button type="button" class="btn small ghost" data-act="admin-editar" data-id="${escStr(it.id)}">Editar</button>
                        <button type="button" class="btn small ghost" data-act="admin-excluir" data-id="${escStr(it.id)}" style="color:#ef4444;">Excluir</button>
                      </div>
                    </td>
                  </tr>
                `;
                    })
                    .join("")
            }
          </tbody>
        </table>
      </div>

      ${renderModalItemAdminHTML()}
    </div>
  `;
}

function renderModalItemAdminHTML() {
  if (!modalAdminAberto) return "";
  const it = itemAdminEdicao || {
    id: "",
    nome: "",
    categoria: "estudos",
    preco: 50,
    mundo: "todos",
    ativo: true
  };
  const escStr = typeof esc === "function" ? esc : s => String(s);

  return `
    <div class="modal-bg" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;">
      <div class="modal-card" style="background:var(--card,#fff);max-width:440px;width:90%;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <h2 class="h2" style="margin-bottom:12px;">${itemAdminEdicao ? "Editar Item" : "Novo Item no Catálogo"}</h2>
        <form id="form-item-admin" onsubmit="return false;" style="display:flex;flex-direction:column;gap:12px;">
          <input type="hidden" id="form-item-id" value="${escStr(it.id)}" />
          <label style="display:flex;flex-direction:column;gap:4px;font-size:0.85rem;font-weight:600;">
            Nome da Entidade:
            <input type="text" id="form-item-nome" value="${escStr(it.nome)}" required maxlength="80" style="padding:8px 10px;border-radius:8px;border:1px solid var(--borda,#ccc);" />
          </label>
          <div style="display:flex;gap:10px;">
            <label style="flex:1;display:flex;flex-direction:column;gap:4px;font-size:0.85rem;font-weight:600;">
              Categoria:
              <input type="text" id="form-item-categoria" value="${escStr(it.categoria)}" style="padding:8px 10px;border-radius:8px;border:1px solid var(--borda,#ccc);" />
            </label>
            <label style="flex:1;display:flex;flex-direction:column;gap:4px;font-size:0.85rem;font-weight:600;">
              Preço (Gotas):
              <input type="number" id="form-item-preco" value="${it.preco || 0}" min="0" style="padding:8px 10px;border-radius:8px;border:1px solid var(--borda,#ccc);" />
            </label>
          </div>
          <label style="display:flex;flex-direction:column;gap:4px;font-size:0.85rem;font-weight:600;">
            Mundo / Personalidade:
            <input type="text" id="form-item-mundo" value="${escStr(it.mundo)}" style="padding:8px 10px;border-radius:8px;border:1px solid var(--borda,#ccc);" />
          </label>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
            <button type="button" class="btn ghost small" data-act="admin-modal-fechar">Cancelar</button>
            <button type="button" class="btn primary small" data-act="admin-modal-salvar">Salvar Entidade</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function viewAdmin() {
  if (typeof AuthGuard === "function") {
    return AuthGuard(renderConteudoPainelAdmin, {
      titulo: "Painel Administrativo Prumo",
      subtitulo: "Faça login para acessar o DataGrid corporativo com suporte a Firestore."
    });
  }
  return renderConteudoPainelAdmin();
}

function inicializarAdminEventos() {
  if (typeof window === "undefined") return;

  // Ouvinte de busca e filtro
  document.addEventListener("input", e => {
    if (e.target && e.target.id === "admin-busca") {
      filtroAdminBusca = e.target.value;
      if (typeof render === "function" && typeof tab !== "undefined" && tab === "admin") render();
    }
  });

  document.addEventListener("change", e => {
    if (e.target && e.target.id === "admin-filtro-cat") {
      filtroAdminCategoria = e.target.value;
      if (typeof render === "function" && typeof tab !== "undefined" && tab === "admin") render();
    }
  });

  // Ouvinte de rota #admin no hash
  window.addEventListener("hashchange", () => {
    if (location.hash === "#admin" && typeof tab !== "undefined") {
      tab = "admin";
      if (typeof render === "function") render();
    }
  });
  if (location.hash === "#admin" && typeof tab !== "undefined") {
    tab = "admin";
  }

  window.ACOES_EXTRAS = window.ACOES_EXTRAS || {};
  window.ACOES_EXTRAS["admin-novo-modal"] = () => {
    itemAdminEdicao = null;
    modalAdminAberto = true;
    if (typeof render === "function") render();
  };

  window.ACOES_EXTRAS["admin-modal-fechar"] = () => {
    modalAdminAberto = false;
    itemAdminEdicao = null;
    if (typeof render === "function") render();
  };

  window.ACOES_EXTRAS["admin-modal-salvar"] = async () => {
    const nomeEl = document.getElementById("form-item-nome");
    const idEl = document.getElementById("form-item-id");
    const catEl = document.getElementById("form-item-categoria");
    const precoEl = document.getElementById("form-item-preco");
    const mundoEl = document.getElementById("form-item-mundo");

    const nome = nomeEl ? nomeEl.value.trim() : "";
    if (!nome) {
      if (typeof toast === "function") toast("Informe o nome do item");
      return;
    }

    const payload = {
      id: idEl && idEl.value ? idEl.value : undefined,
      nome,
      categoria: catEl ? catEl.value.trim() : "geral",
      preco: precoEl ? Number(precoEl.value) || 0 : 0,
      mundo: mundoEl ? mundoEl.value.trim() : "todos",
      ativo: true
    };

    if (typeof salvarItemCatalogo === "function") {
      await salvarItemCatalogo(payload);
      if (typeof toast === "function") toast("Entidade salva no catálogo!", false, "happy");
    }
    modalAdminAberto = false;
    itemAdminEdicao = null;
    if (typeof render === "function") render();
  };

  window.ACOES_EXTRAS["admin-editar"] = (btn, id) => {
    const itens = typeof obterCatalogoAtual === "function" ? obterCatalogoAtual() : [];
    const alvo = itens.find(x => x.id === id);
    if (alvo) {
      itemAdminEdicao = { ...alvo };
      modalAdminAberto = true;
      if (typeof render === "function") render();
    }
  };

  window.ACOES_EXTRAS["admin-excluir"] = async (btn, id) => {
    if (!id) return;
    if (typeof excluirItemCatalogo === "function") {
      await excluirItemCatalogo(id);
      if (typeof toast === "function") toast("Item removido do catálogo.", false, "worried");
    }
  };

  window.ACOES_EXTRAS["admin-sincronizar"] = () => {
    if (typeof escutarCatalogoFirestore === "function") {
      escutarCatalogoFirestore(() => {
        if (typeof toast === "function")
          toast("Catálogo sincronizado em tempo real com Firestore!", false, "happy");
        if (typeof render === "function" && typeof tab !== "undefined" && tab === "admin") render();
      });
    }
  };

  window.ACOES_EXTRAS["entrar-google"] = () => {
    if (typeof entrarComGoogle === "function") entrarComGoogle();
  };

  window.ACOES_EXTRAS["abrir-painel-entrar"] = () => {
    if (typeof abrirTelaEntrada === "function") abrirTelaEntrada();
  };
}

if (typeof window !== "undefined") {
  window.viewAdmin = viewAdmin;
  window.renderConteudoPainelAdmin = renderConteudoPainelAdmin;
  inicializarAdminEventos();
}
