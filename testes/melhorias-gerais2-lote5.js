// Testes Novas Melhorias Gerais: Lote 5 (Itens 41 a 50)
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

  // 41. Fatiamento em chunks de listas longas de tarefas para renderização fluida
  const res41 = ev(`
    (() => {
      const lista = Array.from({ length: 45 }, (_, i) => ({ id: i }));
      const pag1 = fatiarListaTarefasVisiveis(lista, 1, 20);
      const pag3 = fatiarListaTarefasVisiveis(lista, 3, 20);
      return pag1.length === 20 && pag3.length === 5;
    })()
  `);
  ok(res41, "41. fatiarListaTarefasVisiveis fatiou lista em páginas de 20 itens");

  // 42. Efeito de descompressão elástica ao puxar para atualizar (Pull-to-refresh)
  const res42 = ev(`
    (() => {
      const container = document.createElement("div");
      const dist = aplicarEfeitoPullParaAtualizar(container, 35);
      const temClasse = container.classList.contains("pull-atualizar-indicador");
      return dist === 35 && temClasse;
    })()
  `);
  ok(res42, "42. aplicarEfeitoPullParaAtualizar adicionou translação e classe elástica");

  // 43. Vibração tátil sutil (Haptic Feedback) com navigator.vibrate
  const res43 = ev(`
    (() => {
      return typeof dispararVibracaoTatil === "function";
    })()
  `);
  ok(res43, "43. dispararVibracaoTatil disponível para feedback capacitivo");

  // 44. Sanitização defensiva contra injeções de HTML, SVG e caracteres perigosos
  const res44 = ev(`
    (() => {
      const sujo = '<script>alert("xss")</script> & "aspas" e \'simples\' e \`crase\`';
      const limpo = sanitizarTextoSeguro(sujo);
      return !limpo.includes("<script>") && limpo.includes("&lt;script&gt;") && limpo.includes("&quot;");
    })()
  `);
  ok(res44, "44. sanitizarTextoSeguro protegeu contra injeção de HTML e scripts");

  // 45. Validação rigorosa de URLs para links e imagens de perfil
  const res45 = ev(`
    (() => {
      const ok1 = validarUrlSegura("https://exemplo.com/foto.png");
      const ok2 = validarUrlSegura("data:image/png;base64,iVBORw0KGgo=");
      const ruim = validarUrlSegura("javascript:alert(1)");
      return ok1 && ok2 && !ruim;
    })()
  `);
  ok(res45, "45. validarUrlSegura filtrou protocolos perigosos permitindo https e data:");

  // 46. Indicador pulsante de contagem regressiva crítica no Pomodoro (< 60s)
  const res46 = ev(`
    (() => {
      const relogio = document.createElement("div");
      const critico = aplicarPulsoContagemCritica(relogio, 45);
      const okCritico = relogio.classList.contains("pomodoro-critico-pulso");
      const normal = aplicarPulsoContagemCritica(relogio, 300);
      const okNormal = !relogio.classList.contains("pomodoro-critico-pulso");
      return critico && okCritico && !normal && okNormal;
    })()
  `);
  ok(res46, "46. aplicarPulsoContagemCritica alertou visualmente últimos 60 segundos");

  // 47. Contador de caracteres restantes em notas e títulos com alerta aos 90%
  const res47 = ev(`
    (() => {
      const input = document.createElement("input");
      input.value = "Texto de teste com mais de cinquenta e quatro caracteres no campo!";
      const { restantes, critico } = atualizarContadorCaracteres(input, 60);
      return critico === true && restantes === 0;
    })()
  `);
  ok(res47, "47. atualizarContadorCaracteres sinalizou limite atingido");

  // 48. Suporte a tema escuro/claro com transição suave sem piscar
  const res48 = ev(`
    (() => {
      const wrap = document.createElement("div");
      aplicarTransicaoModoAparencia(wrap, "claro");
      return wrap.getAttribute("data-tema-modo") === "light" && wrap.classList.contains("transicao-tema-suave");
    })()
  `);
  ok(res48, "48. aplicarTransicaoModoAparencia alternou tema com transição suave");

  // 49. Calculadora de meta de hidratação por peso corporal e atividade
  const res49 = ev(`
    (() => {
      const meta70 = calcularMetaAguaPorPeso(70, "moderado"); // 70 * 35 = 2450
      const metaIntensa = calcularMetaAguaPorPeso(70, "intenso"); // 2450 + 600 = 3050
      return meta70 === 2450 && metaIntensa === 3050;
    })()
  `);
  ok(res49, "49. calcularMetaAguaPorPeso calculou dosagem em mL por massa corporal");

  // 50. Indicador amigável de tarefas recorrentes com badge de frequência
  const res50 = ev(`
    (() => {
      const bDaily = obterBadgeFrequenciaTarefa("daily");
      const bWeek = obterBadgeFrequenciaTarefa("weekly");
      const bNone = obterBadgeFrequenciaTarefa("");
      return bDaily.rotulo === "Todo dia" && bWeek.rotulo === "Toda semana" && bNone.rotulo === "Única";
    })()
  `);
  ok(res50, "50. obterBadgeFrequenciaTarefa mapeou tipos de repetição com rótulos e ícones");

  await fechar();
  return erros;
};
