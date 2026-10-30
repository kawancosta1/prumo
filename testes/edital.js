// IA do Prumo (mini Gemini), Markdown seguro, Edital -> Cronograma e remoção do player de música
const { abrir } = require("./ambiente");
const ia = require("../functions/ia");

const EDITAL = `EDITAL Nº 01/2026
A PROVA OBJETIVA será aplicada em 15/11/2026, às 9h.
CONHECIMENTOS BÁSICOS
LÍNGUA PORTUGUESA
1. Compreensão e interpretação de textos de gêneros variados.
2. Reconhecimento de tipos e gêneros textuais.
3. Domínio da ortografia oficial.
4. Emprego das classes de palavras.
RACIOCÍNIO LÓGICO
1 Estruturas lógicas.
2 Lógica de argumentação.
3 Diagramas lógicos.
DIREITO CONSTITUCIONAL
Princípios fundamentais; direitos e garantias fundamentais; organização do Estado; Poder Legislativo.
ANEXO II
Tabela de vagas e salários que não deve virar disciplina.`;

module.exports = async url => {
  const erros = [];
  const okLocal = (c, m) => (c ? console.log("  ok  " + m) : erros.push("FALHOU: " + m));

  // ---- regras do servidor de IA (node puro) ----
  okLocal(
    ia.limparTexto("a\u0000b\u202ec" + "x".repeat(10), 5) === "abc" + "xx".slice(0, 0) + "xx".slice(0, 0) ||
      ia.limparTexto("a\u0000b\u202ec", 10) === "abc",
    "servidor limpa caracteres de controle e inversão de texto"
  );
  okLocal(ia.limparTexto("x".repeat(50), 10).length === 10, "servidor corta o texto no limite");
  const agora = Date.parse("2026-11-01T15:00:00Z");
  let uso = null;
  let r = ia.contarUso(uso, agora, false);
  okLocal(
    r.ok && r.uso.n === 1 && r.restantes === ia.LIMITE_GRATIS - 1,
    "cota: primeira mensagem do dia conta 1"
  );
  uso = { dia: ia.diaBrasilia(agora), n: ia.LIMITE_GRATIS };
  okLocal(ia.contarUso(uso, agora, false).ok === false, "cota: grátis para no limite");
  okLocal(ia.contarUso(uso, agora, true).ok === true, "cota: PRO tem limite maior");
  okLocal(ia.contarUso(uso, agora + 24 * 3600 * 1000, false).ok === true, "cota: zera no dia seguinte");
  okLocal(
    ia.diaBrasilia(Date.parse("2026-11-01T02:30:00Z")) === "2026-10-31",
    "cota: o dia vira à meia-noite de Brasília"
  );
  const c = ia.montarContents(
    [
      { role: "model", texto: "oi, sou o Prumi" },
      { role: "user", texto: "pergunta 1" },
      { role: "user", texto: "continuação" },
      { role: "model", texto: "resposta 1" },
      { role: "user", texto: "sem resposta" }
    ],
    "pergunta atual"
  );
  okLocal(
    c[0].role === "user" &&
      c[c.length - 1].role === "user" &&
      c[c.length - 1].parts[0].text === "pergunta atual",
    "histórico começa e termina em user"
  );
  okLocal(
    c.every((x, i) => i === 0 || x.role !== c[i - 1].role),
    "histórico alterna user e model"
  );
  const sis = ia.montarSistemaChat("fala como pirata", "tarefas: 3");
  okLocal(
    sis.includes("qualquer assunto") && sis.includes("pirata") && sis.includes("tarefas: 3"),
    "instrução do sistema é generalista e leva persona e contexto"
  );

  const { ev, ok, fechar } = await abrir(url);
  try {
    // ---- música removida ----
    okLocal(
      ev(
        `!document.getElementById("btn-musica-topo") && typeof abrirPlayerMusica === "undefined" && typeof tocarMusicaPrumo === "undefined"`
      ),
      "player de música saiu do topo e do app"
    );
    okLocal(
      ev(
        `(() => { const h = typeof renderVitrolaEstudoHTML === "function" ? renderVitrolaEstudoHTML() : ""; return !h.includes("abrir-player-musica") && !h.includes("selecionar-faixa") && !h.includes("alternar-musica"); })()`
      ),
      "vitrola dos estudos não tem mais botões de música"
    );

    // ---- Markdown seguro ----
    ok(
      ev(`(() => {
        const x = renderizarMarkdownSeguro('<script>alert(1)</script> <img src=x onerror=alert(1)>');
        const l = renderizarMarkdownSeguro('- a\\n- b\\n\\n1. um\\n2. dois');
        const cod = renderizarMarkdownSeguro('\`\`\`js\\nlet x = 1 < 2;\\n\`\`\`');
        const tab = renderizarMarkdownSeguro('| A | B |\\n|---|---|\\n| 1 | 2 |');
        const js = renderizarMarkdownSeguro('[clique](javascript:alert(1)) e [ok](https://exemplo.com)');
        const b = renderizarMarkdownSeguro('**forte** e *leve* e \`cod\`');
        const t = renderizarMarkdownSeguro('# Título\\ntexto');
        return !x.includes("<script") && !x.includes("<img") && x.includes("&lt;script") &&
          l.includes("<ul><li>a</li><li>b</li></ul>") && l.includes("<ol><li>um</li><li>dois</li></ol>") &&
          cod.includes('class="ia-code"') && cod.includes("1 &lt; 2") && cod.includes("ia-copiar-codigo") &&
          tab.includes("<table>") && tab.includes("<th>A</th>") && tab.includes("<td>2</td>") &&
          !js.includes('href="javascript') && js.includes('href="https://exemplo.com"') && js.includes('rel="noopener noreferrer"') &&
          b.includes("<strong>forte</strong>") && b.includes("<em>leve</em>") && b.includes("<code>cod</code>") &&
          t.includes("<h4");
      })()`),
      "Markdown: escapa HTML, faz listas, tabela, código, links https e bloqueia javascript:"
    );
    ok(
      ev(
        `formatarTextoMensagemIA("Veja:\\n- item **um**\\n- item dois").includes("<li>item <strong>um</strong></li>")`
      ),
      "mensagens do chat usam o Markdown novo"
    );

    // ---- IA do Prumo (servidor) ----
    const resChat = await ev(`
      (async () => {
        S.iaConfig = { provedor: "prumo", chave: "", modelo: "", temperatura: 0.7 };
        const original = window.chamarServidorIA;
        const casos = {};
        window.chamarServidorIA = async () => ({ semConta: true, erro: "Entre" });
        casos.semConta = String((await chamarProvedorLLM("oi", [])).texto);
        window.chamarServidorIA = async (p) => ({ texto: "**Resposta** do Gemini", restantes: 2, limite: 15, _modo: p.modo, _estilo: p.estilo.length > 10, _hist: p.historico.length });
        const r2 = await chamarProvedorLLM("qual a capital da França?", [{ remetente: "ia", texto: "oi" }, { remetente: "user", texto: "qual a capital da França?" }]);
        casos.ok = r2.texto;
        window.chamarServidorIA = async () => ({ cota: true, erro: "Você usou as 15 mensagens grátis de hoje." });
        casos.cota = (await chamarProvedorLLM("mais uma", [])).texto;
        window.chamarServidorIA = async () => ({ rede: true, erro: "x" });
        casos.rede = String((await chamarProvedorLLM("oi", [])).texto);
        window.chamarServidorIA = original;
        return casos;
      })()
    `);
    okLocal(
      resChat.semConta.includes("Entre na sua conta"),
      "chat sem conta responde offline e convida a entrar"
    );
    okLocal(
      resChat.ok.includes("Gemini") && resChat.ok.includes("Restam 2"),
      "chat com conta usa a resposta do servidor e avisa quando a cota está acabando"
    );
    okLocal(resChat.cota.includes("15 mensagens"), "chat mostra a mensagem de limite diário");
    okLocal(resChat.rede.includes("offline"), "chat cai no modo offline se o servidor falhar");

    // ---- leitor de edital (local) ----
    const lido = ev(`analisarEditalLocal(${JSON.stringify(EDITAL)}, "2026-01-01")`);
    okLocal(
      lido.materias.length === 3,
      "edital: achou 3 disciplinas e ignorou cabeçalhos e anexo (achou " +
        lido.materias.map(m => m.nome).join(", ") +
        ")"
    );
    const port = lido.materias.find(m => /portugu/i.test(m.nome));
    okLocal(
      port && port.topicos.length === 4 && port.topicos[0].startsWith("Compreensão"),
      "edital: tópicos numerados viram itens separados"
    );
    const dc = lido.materias.find(m => /constitucional/i.test(m.nome));
    okLocal(dc && dc.topicos.length === 4, "edital: tópicos separados por ponto e vírgula também");
    okLocal(lido.dataProva === "2026-11-15", "edital: achou a data da prova (" + lido.dataProva + ")");
    okLocal(
      ev(
        `analisarEditalLocal("", "2026-01-01").materias.length === 0 && analisarEditalLocal("só um texto qualquer sem disciplinas", "2026-01-01").materias.length === 0`
      ),
      "edital: texto sem disciplinas não inventa nada"
    );
    okLocal(
      ev(
        `(() => { const a = analisarEditalLocal("MATEMÁTICA\\nxyz", "2026-01-01"); return a.materias.length === 0 || a.materias[0].sugerido === true; })()`
      ),
      "edital: disciplina conhecida sem tópicos recebe os da biblioteca (marcados como sugeridos)"
    );

    // resposta da IA é validada
    const val = ev(`
      (() => {
        const bom = edValidarResultadoIA({ nome: "X", dataProva: "2099-01-01", materias: [{ nome: "Física", peso: 9, topicos: ["a b c", "d e f", "g h i"] }, { nome: "", topicos: ["x"] }, null, { nome: "Vazia", topicos: [] }] }, "2026-01-01");
        const ruim = edValidarResultadoIA({ materias: "oi" }, "2026-01-01");
        const html = edValidarResultadoIA({ materias: [{ nome: "<b>Hack</b>", topicos: ["<img src=x>", "tópico dois", "tópico três"] }] }, "2026-01-01");
        return bom && bom.materias.length === 1 && bom.materias[0].peso === 3 && bom.dataProva === "2099-01-01" && bom.fonte === "ia" && ruim === null && html.materias[0].nome.includes("Hack");
      })()
    `);
    okLocal(val, "edital: resposta da IA é limpa e validada (peso, data, lixo descartado)");

    // IA lê o edital; se falhar, usa o leitor local
    const viaIA = await ev(`
      (async () => {
        const original = window.chamarServidorIA;
        const texto = ${JSON.stringify(EDITAL + "\n" + "x".repeat(200))};
        window.chamarServidorIA = async p => ({ texto: JSON.stringify({ nome: "Concurso Teste", dataProva: "2099-05-05", materias: [{ nome: "Informática", peso: 2, topicos: ["Redes", "Segurança", "Windows"] }] }), _modo: p.modo });
        const a = await analisarEdital(texto, "2026-01-01");
        window.chamarServidorIA = async () => ({ rede: true, erro: "x" });
        const b = await analisarEdital(texto, "2026-01-01");
        window.chamarServidorIA = original;
        return { fonteA: a.fonte, nomeA: a.materias[0].nome, fonteB: b.fonte, nB: b.materias.length };
      })()
    `);
    okLocal(
      viaIA.fonteA === "ia" && viaIA.nomeA === "Informática",
      "edital: com a IA disponível, usa a leitura da IA"
    );
    okLocal(viaIA.fonteB === "local" && viaIA.nB === 3, "edital: se a IA falhar, cai no leitor local");

    // ---- presets ----
    okLocal(
      ev(
        `(() => { const e = montarPresetEdital("enem"); return e.materias.length >= 8 && e.materias.every(m => m.topicos.length >= 3) && montarPresetEdital("fuvest").materias.length >= 8 && montarPresetEdital("naoexiste") === null; })()`
      ),
      "presets ENEM e Fuvest vêm com disciplinas e tópicos"
    );

    // ---- gerador de cronograma ----
    const plano = ev(`
      (() => {
        const a = analisarEditalLocal(${JSON.stringify(EDITAL)}, "2026-01-01");
        const p = gerarCronogramaEdital({ materias: a.materias, horasDia: 3, diasSemana: 6, dataProva: "2026-11-30", inicio: "2026-11-02" });
        const datas = p.dias.map(d => d.data);
        const teoria = new Set();
        p.dias.forEach(d => d.blocos.forEach(b => b.tipo === "teoria" && b.titulo.split("; ").forEach(t => teoria.add(t))));
        const todos = a.materias.reduce((x, m) => x + m.topicos.length, 0);
        return {
          erro: p.erro || "",
          primeiro: datas[0], ultimo: datas[datas.length - 1],
          ordenado: datas.every((d, i) => i === 0 || d > datas[i - 1]),
          antesDaProva: datas.every(d => d < "2026-11-30"),
          cobertura: p.resumo.cobertura, topicosTeoria: teoria.size, todos,
          tipos: [...new Set(p.dias.flatMap(d => d.blocos.map(b => b.tipo)))].sort().join(","),
          vespera: p.dias[p.dias.length - 1].blocos[0].tipo,
          domingosEstudo: p.dias.filter(d => new Date(d.data + "T12:00:00Z").getUTCDay() === 0 && d.blocos.some(b => b.tipo !== "descanso")).length,
          blocosPorDia: Math.max(...p.dias.map(d => d.blocos.length)),
          minValidos: p.dias.every(d => d.blocos.every(b => b.min >= 25 && b.min <= 180))
        };
      })()
    `);
    okLocal(
      !plano.erro && plano.primeiro === "2026-11-02" && plano.ordenado && plano.antesDaProva,
      "cronograma começa na data certa, em ordem, e termina antes da prova"
    );
    okLocal(
      plano.cobertura === 100 && plano.topicosTeoria === plano.todos,
      "cronograma cobre 100% dos tópicos do edital (" + plano.topicosTeoria + "/" + plano.todos + ")"
    );
    okLocal(
      plano.tipos.includes("revisao_semanal") &&
        plano.tipos.includes("questoes") &&
        plano.tipos.includes("teoria"),
      "cronograma tem teoria, questões e revisão semanal (" + plano.tipos + ")"
    );
    okLocal(
      plano.vespera === "descanso" && plano.domingosEstudo === 0 && plano.minValidos,
      "véspera de descanso, sem domingos com 6 dias por semana, blocos com tempo razoável"
    );

    const apertado = ev(`
      (() => {
        const m = montarPresetEdital("enem").materias;
        const p = gerarCronogramaEdital({ materias: m, horasDia: 2, diasSemana: 3, dataProva: "2026-11-12", inicio: "2026-11-02" });
        return { erro: p.erro || "", avisos: p.avisos.length, dias: p.dias.length };
      })()
    `);
    okLocal(
      !apertado.erro && apertado.avisos >= 1,
      "prazo curto gera cronograma com aviso de tempo apertado"
    );
    okLocal(
      ev(
        `gerarCronogramaEdital({ materias: [], inicio: "2026-11-02" }).erro.length > 0 && gerarCronogramaEdital({ materias: montarPresetEdital("enem").materias, inicio: "lixo" }).erro.length > 0`
      ),
      "cronograma recusa entradas inválidas"
    );
    okLocal(
      ev(
        `(() => { const p = gerarCronogramaEdital({ materias: montarPresetEdital("fuvest").materias, horasDia: 4, diasSemana: 6, dataProva: "", inicio: "2026-11-02" }); return !p.erro && p.resumo.totalDias > 60 && p.avisos.some(a => a.includes("12 semanas")); })()`
      ),
      "sem data de prova monta 12 semanas e avisa"
    );
    okLocal(
      ev(
        `(() => { const p = gerarCronogramaEdital({ materias: montarPresetEdital("enem").materias, horasDia: 4, diasSemana: 6, dataProva: "2027-06-30", inicio: "2026-11-02" }); return !p.erro && p.resumo.totalDias <= 400 && p.resumo.cobertura === 100 && p.dias.some(d => d.blocos.some(b => b.tipo === "simulado")); })()`
      ),
      "prova distante: cobre tudo, entra fase de revisão com simulados"
    );

    // ---- agenda ----
    const agenda = ev(`
      (() => {
        S.tasks = []; S.subjects = []; S.cronogramaEdital = null;
        const a = analisarEditalLocal(${JSON.stringify(EDITAL)}, "2026-01-01");
        const inicio = edHoje();
        const prova = (() => { const d = new Date(inicio + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 60); return d.toISOString().slice(0, 10); })();
        const p = gerarCronogramaEdital({ materias: a.materias, horasDia: 3, diasSemana: 6, dataProva: prova, inicio });
        const r1 = importarCronogramaEdital(p, "Concurso X", 14);
        const n1 = S.tasks.length;
        const limite = (() => { const d = new Date(inicio + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 13); return d.toISOString().slice(0, 10); })();
        const dentro = S.tasks.every(t => t.date >= inicio && t.date <= limite);
        const r2 = importarProximosDiasEdital(14);
        const n2 = S.tasks.length;
        const r3 = importarProximosDiasEdital(14);
        const ids = new Set(S.tasks.map(t => t.id));
        return {
          ok1: r1.ok && n1 > 0, dentro, mais: r2.n > 0 && n2 > n1, semDuplicar: ids.size === S.tasks.length,
          materias: S.subjects.length, guardado: !!S.cronogramaEdital && S.cronogramaEdital.dias.length === p.dias.length,
          tag: S.tasks.every(t => t.tag === "estudo" && t.title.length <= 140 && t.done === false),
          card: cartaoEditalHojeHTML().includes("Concurso X")
        };
      })()
    `);
    okLocal(agenda.ok1 && agenda.dentro, "importar cria só as tarefas das próximas 2 semanas");
    okLocal(
      agenda.mais && agenda.semDuplicar,
      "importar mais 2 semanas continua de onde parou, sem duplicar"
    );
    okLocal(
      agenda.materias === 3 && agenda.guardado && agenda.tag,
      "disciplinas viram matérias do Prumo e o cronograma inteiro fica guardado"
    );
    okLocal(agenda.card, "aba Hoje mostra o cartão do cronograma do edital");

    // ---- tela ----
    const tela = await ev(`
      (async () => {
        const espera = ms => new Promise(r => setTimeout(r, ms));
        S.tasks = []; S.cronogramaEdital = null;
        estadoEdital.analise = null; estadoEdital.plano = null; estadoEdital.texto = "";
        abrirEditalPrumo();
        const abriu = !!document.getElementById("modal-desdobrador-ia") && !!document.getElementById("ed-texto");
        const ta = document.getElementById("ed-texto");
        ta.value = ${JSON.stringify(EDITAL)};
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector('[data-edital-act="analisar"]').click();
        await espera(80);
        const materias = document.querySelectorAll(".ed-materia").length;
        document.querySelector('[data-edital-peso="0"]').value = "3";
        document.querySelector('[data-edital-peso="0"]').dispatchEvent(new Event("change", { bubbles: true }));
        const peso = estadoEdital.analise.materias[0].peso;
        document.querySelector('[data-edital-act="remover"][data-i="2"]').click();
        const restou = document.querySelectorAll(".ed-materia").length;
        document.querySelector('[data-edital-act="horas"][data-v="4"]').click();
        document.querySelector('[data-edital-act="gerar"]').click();
        const dias = document.querySelectorAll(".ed-dia").length;
        document.querySelector('[data-edital-act="importar"]').click();
        await espera(30);
        return { abriu, materias, peso, restou, dias, tarefas: S.tasks.length, fechou: !document.getElementById("modal-desdobrador-ia") };
      })()
    `);
    okLocal(tela.abriu, "aba Edital abre dentro do planejador");
    okLocal(
      tela.materias === 3 && tela.peso === 3 && tela.restou === 2,
      "tela: analisa, mostra as disciplinas, muda peso e remove"
    );
    okLocal(
      tela.dias > 0 && tela.tarefas > 0 && tela.fechou,
      "tela: gera o cronograma, importa para a agenda e fecha"
    );
    okLocal(
      ev(
        `(() => { abrirEditalPrumo(); const t = document.getElementById("ed-texto"); t.value = "pouco"; t.dispatchEvent(new Event("input", { bubbles: true })); estadoEdital.analise = null; document.querySelector('[data-edital-act="analisar"]').click(); const m = document.querySelector(".ed-msg"); fecharDesdobradorMetasIA(); return !!m && m.textContent.includes("Cole o texto"); })()`
      ),
      "tela: texto vazio pede para colar o edital"
    );
    okLocal(
      ev(
        `(() => { const h = renderAbaEditalHTML(); estadoEdital.texto = '<img src=x onerror=alert(1)>'; const h2 = renderAbaEditalHTML(); estadoEdital.texto = ""; return !h2.includes("<img src=x") && h2.includes("&lt;img"); })()`
      ),
      "tela: texto colado é escapado"
    );
  } finally {
    fechar();
  }
  return erros;
};
