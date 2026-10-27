// Testes Melhorias Gerais: Lote 5 (Itens 41 a 50)
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

  // 41. Iframe isolado e seguro
  const ifr = ev("criarIframeSeguro('https://termos.prumo.app', 'Termos')");
  ok(
    ifr && ifr.getAttribute("sandbox").includes("allow-scripts"),
    "41. Iframe com atributo sandbox criado com sucesso"
  );

  // 42. Validação rigorosa de cores hex
  ok(ev("validarCorHexSegura('#76FF03') === true"), "42. Cor hexadecimal válida aprovada");
  ok(ev("validarCorHexSegura('red; url(x)') === false"), "42. Tentativa de injeção em cor CSS rejeitada");

  // 43. Silenciamento de logs em produção
  ok(ev("typeof silenciarConsoleProducao === 'function'"), "43. Função silenciarConsoleProducao disponível");

  // 44. Rate limiting local
  ev(`
    window._r1 = verificarLimiteTaxa('acao_teste', 2, 500);
    window._r2 = verificarLimiteTaxa('acao_teste', 2, 500);
    window._r3 = verificarLimiteTaxa('acao_teste', 2, 500);
  `);
  ok(
    ev("window._r1 === true && window._r2 === true"),
    "44. Duas primeiras tentativas permitidas dentro da janela"
  );
  ok(ev("window._r3 === false"), "44. Terceira tentativa bloqueada pelo rate limit");

  // 45. Proteção contra Clickjacking
  ok(ev("protegerContraClickjacking() === true"), "45. Proteção contra clickjacking validada");

  // 46. Sanitização de CSV Injection
  const csvPerigoso = ev("sanitizarCelulaCSV('=cmd|\"/C calc\"!A0')");
  const csvNormal = ev("sanitizarCelulaCSV('Tarefa Comum')");
  ok(csvPerigoso.startsWith("'="), "46. Célula com fórmula perigosa neutralizada com aspa simples");
  ok(csvNormal === "Tarefa Comum", "46. Célula normal mantida sem alterações");

  // 47. Solicitação contextual de notificações
  ok(
    ev("typeof solicitarNotificacaoContextual === 'function'"),
    "47. Função de notificação contextual disponível"
  );

  // 48. Comparação de tempo constante
  ok(
    ev("compararTempoConstante('pin1234', 'pin1234') === true"),
    "48. PINs idênticos validados corretamente"
  );
  ok(
    ev("compararTempoConstante('pin1234', 'pin9999') === false"),
    "48. PINs diferentes rejeitados corretamente"
  );

  // 49. Limpeza segura de sessão
  ok(ev("limparSessaoSegura() === true"), "49. Rotina de limpeza segura de sessão executada");

  // 50. Validação estrita de formato de data ISO
  ok(ev("validarFormatoDataISO('2026-10-26') === true"), "50. Data válida 2026-10-26 aprovada");
  ok(ev("validarFormatoDataISO('2026-02-31') === false"), "50. Data inválida 31 de fevereiro rejeitada");

  fechar();
  return erros;
};
