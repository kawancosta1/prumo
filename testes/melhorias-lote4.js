// Testes Melhorias Gerais: Lote 4 (Itens 31 a 40)
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

  // 31. Sanitização estrita com allowlist
  const limpo = ev("sanitizarHTMLSeguro('<script>alert(1)</script><b>Oi</b>')");
  ok(
    !limpo.includes("<script>") && limpo.includes("<b>Oi</b>"),
    "31. Script malicioso neutralizado e tag b preservada"
  );

  // 32. Validação estrita de URLs
  ok(ev("validarURLLinkSeguro('https://prumo.app') === true"), "32. URL HTTPS aceita");
  ok(ev("validarURLLinkSeguro('javascript:alert(1)') === false"), "32. Esquema javascript: rejeitado");

  // 33. Proteção contra poluição de protótipo
  ev(`
    const sujo = JSON.parse('{"__proto__":{"admin":true},"nome":"Kaka"}');
    sanitizarObjetoContraPollution(sujo);
    window._temProto = Object.prototype.hasOwnProperty.call(sujo, '__proto__');
  `);
  ok(ev("window._temProto === false"), "33. Chave __proto__ expurgada na sanitização");

  // 34. Auditoria de noopener noreferrer em links externos
  ev(`
    const div = document.createElement("div");
    div.innerHTML = '<a href="https://externo.com" target="_blank">Link</a>';
    document.body.appendChild(div);
    assegurarLinksSeguros(div);
  `);
  ok(
    D.querySelector("a[target='_blank']").getAttribute("rel") === "noopener noreferrer",
    "34. Atributo rel noopener noreferrer aplicado a links externos"
  );

  // 35. Validação rigorosa de payloads de backup
  const bkpOk = ev('validarPayloadBackup(\'{"tasks":[],"persona":"otaku"}\')');
  const bkpRuim = ev("validarPayloadBackup('{\"malicioso\":true}')");
  ok(bkpOk && bkpOk.persona === "otaku", "35. Backup válido aprovado com sucesso");
  ok(bkpRuim === null, "35. Payload corrompido rejeitado com segurança");

  // 36. Limitação de tamanho de strings
  const strLonga = "a".repeat(800);
  const truncada = ev(`limitarStringSegura('${strLonga}', 100)`);
  ok(truncada.length === 100, "36. String truncada respeitando o limite seguro");

  // 38. Criptografia simétrica leve do diário
  const cifrado = ev("criptografarTextoSimples('Segredo do Diário', 'chave123')");
  const decifrado = ev(`descriptografarTextoSimples('${cifrado}', 'chave123')`);
  ok(cifrado !== "Segredo do Diário", "38. Texto do diário devidamente cifrado");
  ok(decifrado === "Segredo do Diário", "38. Texto do diário descriptografado fielmente com a chave");

  // 39. Limpeza de caracteres de controle e RLO
  const sujoBidi = ev("limparCaracteresControle('Nome\\u202EInvertido\\x00')");
  ok(
    !sujoBidi.includes("\u202E") && !sujoBidi.includes("\x00"),
    "39. Caracteres de controle e marcas de inversão Unicode removidos"
  );

  // 40. Mascaramento de dados sensíveis
  const masc = ev("mascararDadoSensivel('token_super_secreto_123', 3, 3)");
  ok(masc === "tok***123", "40. Dado sensível mascarado exibindo apenas extremidades seguras");

  fechar();
  return erros;
};
