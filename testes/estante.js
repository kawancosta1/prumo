// Estante: casa da leitura (cômodos) e, nas próximas partes, leitura no dia a dia, metas e amigos
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };
  ev(`S.onboarded = true; S.semConta = true; S.leitura.saldo = 100; S.leitura.total = 100; tab = "estante"; estanteTab = "estante"; commit();`);

  /* ---------- cômodos ---------- */
  ok(D.querySelectorAll(".comodo").length >= 8 && /Quarto/.test(M()) && /Sala/.test(M()), "aba Estante mostra os cômodos");
  ok(!D.querySelector('.comodo[data-id="cripta"]') && !D.querySelector('.comodo[data-id="estudio"]'), "cômodos de outros mundos não aparecem");
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "quarto" && ev("S.leitura.saldo") === 100, "sem páginas suficientes não compra");
  ev(`S.leitura.saldo = 400; render();`);
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "quarto" && /Comprar por 150/.test(D.querySelector('.comodo[data-id="sala"]').textContent), "primeiro toque pede confirmação");
  clicar('.comodo[data-id="sala"]');
  await espera(30);
  ok(ev("minhaCasa().comodo") === "sala" && ev("S.leitura.saldo") === 250 && ev("minhaCasa().tem.includes('sala')"), "segundo toque compra e muda para a sala");
  ok(!!D.querySelector(".casa-svg.casa-sala"), "desenho da sala aparece");
  clicar('[data-act="casa-op"][data-k="sofa"][data-v="azul"]');
  ok(ev("minhaCasa().opcoes.sala.sofa") === "azul" && M().includes("#33558C"), "trocar a cor do sofá");
  clicar('.comodo[data-id="quarto"]');
  ok(ev("minhaCasa().comodo") === "quarto" && ev("S.leitura.saldo") === 250 && !D.querySelector(".casa-sala"), "voltar ao quarto é grátis");
  clicar('.comodo[data-id="sala"]');
  ok(ev("minhaCasa().comodo") === "sala" && ev("S.leitura.saldo") === 250, "cômodo comprado não cobra de novo");

  // biblioteca secreta
  clicar('.comodo[data-id="biblioteca"]');
  ok(ev("minhaCasa().comodo") === "sala", "biblioteca fechada com menos de 1000 páginas");
  ev(`S.leitura.total = 1000; render();`);
  clicar('.comodo[data-id="biblioteca"]');
  ok(ev("minhaCasa().comodo") === "biblioteca" && !!D.querySelector(".casa-biblioteca"), "com 1000 páginas a biblioteca abre de graça");

  // todos os cômodos desenham, em todos os mundos que podem
  const falhos = ev(`COMODOS.filter(c => c.id !== "quarto").filter(c => { try { const d = { ...minhaEstante(), persona: c.mundo || "zen", decor: { ...S.leitura.decor, casa: { comodo: c.id, tem: [c.id], opcoes: {} } }, meu: false }; return !casaSVG(d).includes("casa-" + c.id); } catch (e) { return true; } }).map(c => c.id)`);
  ok(falhos.length === 0, "todos os cômodos desenham " + falhos.join(","));

  // mundo
  ev(`setPersona("emo"); applyTheme(); render();`);
  ok(!!D.querySelector('.comodo[data-id="cripta"]'), "no emo aparece a cripta");

  // amigos: casa vinda da vitrine é limpa
  ok(ev(`JSON.stringify(limparCasa({ comodo: "sala", tem: ["x"], opcoes: { sala: { sofa: "<b>", parede: "cinza" } } }))`) === JSON.stringify({ comodo: "sala", tem: ["sala"], opcoes: { sala: { parede: "cinza" } } }), "casa do amigo vem limpa");
  ok(ev(`limparCasa({ comodo: "<img>" }).comodo`) === "quarto", "cômodo desconhecido vira quarto");
  const amigo = ev(`casaSVG({ lidos: [], lendo: [], decor: { movel: "clara", fundo: "liso", enfeites: [], quarto: {}, casa: { comodo: "cripta", tem: ["cripta"], opcoes: {} } }, persona: "rock", equip: {}, meu: false })`);
  ok(!amigo.includes("casa-cripta"), "cripta não aparece para amigo de outro mundo");
  const vit = JSON.parse(ev("JSON.stringify(montarVitrine())"));
  ok(vit.estante && vit.estante.decor.casa.comodo === "biblioteca", "amigos veem o cômodo escolhido");

  fechar();
  return erros;
};
