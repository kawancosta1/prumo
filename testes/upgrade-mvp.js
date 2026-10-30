/*
  testes/upgrade-mvp.js - Testes Automatizados dos Módulos A, B, C e D (Module E).
  Testa montagem de componentes, AuthGuard, CRUD DataGrid, exportação PDF,
  ThemeProvider dinâmico e Internacionalização (i18n).
*/
"use strict";

const { abrir } = require("./ambiente");

module.exports = async url => {
  const erros = [];
  const okLocal = (cond, msg) => {
    if (cond) {
      console.log("  ok  " + msg);
    } else {
      erros.push("FALHOU: " + msg);
      console.log("  ERRO: " + msg);
    }
  };

  const { ev, ok, fechar } = await abrir(url);
  try {
    // ==========================================
    // 1. MODULE A: FIRESTORE & AUTHENTICATION
    // ==========================================
    const modA = await ev(`
      (() => {
        // Teste de AuthGuard deslogado
        contaUsuario = null;
        window.contaUsuario = null;
        const htmlBloqueado = AuthGuard(() => "<div id='secreto'>Conteudo VIP</div>");
        const bloqueou = htmlBloqueado.includes("Área Protegida") && !htmlBloqueado.includes("Conteudo VIP");
        const temBotoes = htmlBloqueado.includes("entrar-google") && htmlBloqueado.includes("abrir-painel-entrar");

        // Teste de AuthGuard logado
        contaUsuario = { uid: "usr_123", email: "kawan@prumo.app", displayName: "Kawan" };
        window.contaUsuario = contaUsuario;
        const htmlLiberado = AuthGuard(() => "<div id='secreto'>Conteudo VIP</div>");
        const liberou = htmlLiberado.includes("Conteudo VIP");

        // Teste de CRUD do Catálogo
        const antes = obterCatalogoAtual().length;
        const resNovo = salvarItemCatalogo({ nome: "Item Teste Unitario", categoria: "estudos", preco: 99, mundo: "prog" });
        const depois = obterCatalogoAtual();
        const itemCriado = depois.find(x => x.nome === "Item Teste Unitario");
        const salvou = !!itemCriado && itemCriado.preco === 99;

        // Excluir item
        if (itemCriado) excluirItemCatalogo(itemCriado.id);
        const aposExclusao = obterCatalogoAtual().some(x => x.nome === "Item Teste Unitario");

        // Montagem do Painel Admin (DataGrid)
        const htmlAdmin = renderConteudoPainelAdmin();
        const montouTabela = htmlAdmin.includes("Painel Administrativo") &&
                             htmlAdmin.includes("admin-datagrid") &&
                             htmlAdmin.includes("admin-busca");

        return { bloqueou, temBotoes, liberou, salvou, excluiu: !aposExclusao, montouTabela };
      })()
    `);

    okLocal(
      modA.bloqueou && modA.temBotoes,
      "AuthGuard: bloqueia rota privada e exibe botões de login quando deslogado"
    );
    okLocal(modA.liberou, "AuthGuard: libera renderização do conteúdo para usuário autenticado");
    okLocal(
      modA.salvou && modA.excluiu,
      "DataGrid CRUD: cria, salva e exclui entidade do catálogo com sucesso"
    );
    okLocal(modA.montouTabela, "Admin: DataGrid corporativo monta tabela, busca e colunas de controle");

    // ==========================================
    // 2. MODULE B: EXPORT ENGINE (REPORTING)
    // ==========================================
    const modB = await ev(`
      (() => {
        // Gerador de relatório tabulado em HTML/PDF
        const htmlRelatorio = gerarHtmlRelatorioTabulado({
          titulo: "Relatório de Teste",
          subtitulo: "Auditoria MVP",
          colunas: [{ key: "id", label: "ID" }, { key: "nome", label: "Nome" }],
          linhas: [{ id: "01", nome: "Linha Teste" }],
          filtros: { Status: "Ativo" },
          autor: "Robô de Teste"
        });

        const temTitulo = htmlRelatorio.includes("Relatório de Teste");
        const temFiltro = htmlRelatorio.includes("Status") && htmlRelatorio.includes("Ativo");
        const temLinha = htmlRelatorio.includes("Linha Teste");
        const temA4 = htmlRelatorio.includes("size: A4");

        // Componente ExportButton
        let disparouCallback = false;
        const btnHtml = ExportButton({
          id: "btn_test_export",
          rotulo: "Baixar PDF",
          dadosFn: () => {
            disparouCallback = true;
            return { titulo: "X" };
          }
        });
        const temBtn = btnHtml.includes("btn_test_export") && btnHtml.includes("data-export-relatorio");

        // Simula disparo
        const fn = REGISTRO_EXPORTACOES.get("btn_test_export");
        if (fn) fn();

        return { temTitulo, temFiltro, temLinha, temA4, temBtn, disparouCallback };
      })()
    `);

    okLocal(
      modB.temTitulo && modB.temFiltro && modB.temLinha && modB.temA4,
      "Export Engine: serializa estado filtrado em relatório A4 com cabeçalhos e metadados"
    );
    okLocal(
      modB.temBtn && modB.disparouCallback,
      "ExportButton: componente renderiza e dispara extração dos dados tabulados"
    );

    // ==========================================
    // 3. MODULE C: DYNAMIC THEMING (DARK MODE)
    // ==========================================
    const modC = await ev(`
      (() => {
        // Alternância e persistência do tema
        ThemeProvider.definirTema("dark");
        const r = document.documentElement;
        const darkAtivo = r.classList.contains("dark") && r.getAttribute("data-theme") === "dark";
        const salvoDark = localStorage.getItem("prumo-theme") === "dark";

        ThemeProvider.definirTema("light");
        const lightAtivo = !r.classList.contains("dark") && r.getAttribute("data-theme") === "light";
        const salvoLight = localStorage.getItem("prumo-theme") === "light";

        const alternou = ThemeProvider.alternarTema(); // deve voltar para dark
        const voltouDark = alternou === "dark" && r.classList.contains("dark");

        return { darkAtivo, salvoDark, lightAtivo, salvoLight, voltouDark };
      })()
    `);

    okLocal(
      modC.darkAtivo && modC.salvoDark,
      "ThemeProvider: ativa classe .dark, atributo data-theme='dark' e persiste no localStorage"
    );
    okLocal(modC.lightAtivo && modC.salvoLight, "ThemeProvider: desativa modo escuro e salva light");
    okLocal(modC.voltouDark, "ThemeProvider: alternarTema() inverte tema reativamente");

    // ==========================================
    // 4. MODULE D: INTERNATIONALIZATION (I18N)
    // ==========================================
    const modD = await ev(`
      (() => {
        // Tradução padrão (pt-BR)
        definirIdioma("pt");
        const ptHoje = traduzir("hoje");
        const ptSalvar = traduzir("salvar");

        // Troca para English (en-US)
        definirIdioma("en");
        const enHoje = traduzir("hoje");
        const enSalvar = traduzir("salvar");
        const langAttr = document.documentElement.getAttribute("lang");

        // Hook useTranslation
        const { t, i18n } = useTranslation();
        const hookFunciona = t("hoje") === "Today" && i18n.language === "en-US";

        // Componente LanguageSwitcher
        const switcherHtml = LanguageSwitcher();
        const temSwitcher = switcherHtml.includes("🇧🇷 PT") && switcherHtml.includes("🇺🇸 EN");

        // Fallback de chave inexistente
        const fallback = traduzir("chave_que_nao_existe_xyz", "Padrao");

        return {
          ptValido: ptHoje === "Hoje" && ptSalvar === "Salvar",
          enValido: enHoje === "Today" && enSalvar === "Save",
          langAttr: langAttr === "en",
          hookFunciona,
          temSwitcher,
          fallbackOk: fallback === "Padrao"
        };
      })()
    `);

    okLocal(modD.ptValido && modD.enValido, "i18n: traduz chaves corretamente em pt-BR e en-US");
    okLocal(
      modD.langAttr && modD.hookFunciona,
      "i18n: useTranslation() e atributo lang refletem idioma ativo"
    );
    okLocal(
      modD.temSwitcher && modD.fallbackOk,
      "i18n: componente LanguageSwitcher e fallback de chaves operam perfeitamente"
    );
  } finally {
    fechar();
  }

  return erros;
};
