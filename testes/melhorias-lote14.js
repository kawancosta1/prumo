// Testes Melhorias Gerais: Lote 14 (Itens 131 a 140)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 131. Estatísticas de afeição do pet
  const res131 = ev(`
    (() => {
      const stats = estatisticasAfeicaoPet({ carinho: 45, diasJuntos: 12 });
      return stats.nivelApego === 5 && stats.carinhoTotal === 45 && stats.bonusFocoMinutos > 0;
    })()
  `);
  ok(res131, "131. estatisticasAfeicaoPet computou nível de apego e bônus de foco");

  // 132. Itens de quarto interativos
  const res132 = ev(`
    (() => {
      const est = {};
      const r1 = interagirItemQuarto("abajur", est);
      const r2 = interagirItemQuarto("abajur", est);
      return r1.ativo === true && r2.ativo === false;
    })()
  `);
  ok(res132, "132. interagirItemQuarto alternou estado dos móveis interativos");

  // 133. Visita surpresa de amigos no quarto
  const res133 = ev(`
    (() => {
      const html = visitaAmigoQuartoHTML({ nome: "Marina", recado: "Você consegue!" });
      return html.includes("balao-visita-amigo") &&
        html.includes("Marina") &&
        html.includes("Você consegue!");
    })()
  `);
  ok(res133, "133. visitaAmigoQuartoHTML gerou balão acolhedor de visita");

  // 134. Fotolog com filtros temáticos
  const res134 = ev(`
    (() => {
      const img = document.createElement("img");
      const c1 = aplicarFiltroFotolog("neon", img);
      const c2 = aplicarFiltroFotolog("bw", img);
      return c1 === "filtro-fotolog-neon" &&
        c2 === "filtro-fotolog-bw" &&
        img.classList.contains("filtro-fotolog-bw");
    })()
  `);
  ok(res134, "134. aplicarFiltroFotolog aplicou classes de filtros fotográficos");

  // 135. Títulos de nobreza e conquistas no perfil
  const res135 = ev(`
    (() => {
      const t1 = obterTituloPerfil(5, 2);
      const t2 = obterTituloPerfil(30, 8);
      const t3 = obterTituloPerfil(120, 35);
      return t1 === "Iniciante Constante" &&
        t2 === "Aprendiz Dedicado" &&
        t3 === "Lorde da Disciplina";
    })()
  `);
  ok(res135, "135. obterTituloPerfil atribuiu títulos progressivos de nobreza");

  // 136. Assistente de divisão de tarefas complexas
  const res136 = ev(`
    (() => {
      const passos = quebrarTarefaEmPassos("Escrever Artigo Científico");
      return Array.isArray(passos) &&
        passos.length === 3 &&
        passos[0].titulo.includes("Planejar") &&
        passos[1].titulo.includes("Executar") &&
        passos[2].titulo.includes("Revisar");
    })()
  `);
  ok(res136, "136. quebrarTarefaEmPassos dividiu meta em etapas práticas");

  // 137. Modo Pomodoro com transição automática estudo/pausa
  const res137 = ev(`
    (() => {
      const p1 = pomodoroComTransicao(1);
      const p4 = pomodoroComTransicao(4);
      return p1.minutosPausa === 5 && p4.minutosPausa === 15;
    })()
  `);
  ok(res137, "137. pomodoroComTransicao alternou pausas curtas e longas");

  // 138. Lembretes recorrentes a cada X dias
  const res138 = ev(`
    (() => {
      const deveHoje = habitoRecorrenciaFlexivel("2026-10-20", 3, "2026-10-24");
      const aindaNao = habitoRecorrenciaFlexivel("2026-10-23", 3, "2026-10-24");
      return deveHoje === true && aindaNao === false;
    })()
  `);
  ok(res138, "138. habitoRecorrenciaFlexivel calculou periodicidades de hábitos");

  // 139. Gráfico quadriculado estilo GitHub para hábitos
  const res139 = ev(`
    (() => {
      const html = quadriculadoHabitosAnual([
        { data: "2026-10-01", quantidade: 1 },
        { data: "2026-10-02", quantidade: 3 }
      ]);
      return html.includes("quadriculado-habitos-grid") &&
        html.includes('data-nivel="1"') &&
        html.includes('data-nivel="3"');
    })()
  `);
  ok(res139, "139. quadriculadoHabitosAnual montou matriz de consistência anual");

  // 140. Calculadora de ritmo de leitura na Estante
  const res140 = ev(`
    (() => {
      const r = calcularRitmoLeitura(30, 60, 150);
      return r.paginasPorHora === 30 &&
        r.paginasRestantes === 120 &&
        r.horasRestantesEstimadas === 4;
    })()
  `);
  ok(res140, "140. calcularRitmoLeitura estimou velocidade e horas para conclusão");

  await fechar();
  return erros;
};
