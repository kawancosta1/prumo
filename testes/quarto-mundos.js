// Teste: Quarto por mundo - Quarto inicial correspondente a cada estilo do Prumi e loja de decoração
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => D.getElementById("main").innerHTML;

  ev(`S.onboarded = true; S.semConta = true; S.leitura.saldo = 5000; commit();`);

  const mundos = [
    "emo",
    "rock",
    "otaku",
    "feiticeiro",
    "bruxo",
    "gamer",
    "zen",
    "sertanejo",
    "cleanboy",
    "programador",
    "rapper",
    "trapper",
    "pagodeiro",
    "funkeiro",
    "forrozeiro",
    "vovo",
    "coach"
  ];

  // 1. Todos os 17 mundos têm quarto padrão configurado
  ok(
    mundos.every(m => ev(`!!QUARTO_PADRAO_MUNDO["${m}"]`)),
    "todos os 17 mundos têm quarto inicial configurado em QUARTO_PADRAO_MUNDO"
  );

  // 2. Cada mundo tem todos os slots principais definidos (chão, janela, cama, tapete, luz, poster)
  const slotsPrincipais = ["chao", "janela", "cama", "tapete", "luz", "poster"];
  mundos.forEach(m => {
    const qm = ev(`QUARTO_PADRAO_MUNDO["${m}"]`);
    const temTodos = slotsPrincipais.every(s => qm && qm[s]);
    ok(temTodos, `mundo ${m} tem todos os slots principais no quarto inicial`);
  });

  // 3. Itens iniciais têm preco 0 e estão em ITEM_QUARTO
  mundos.forEach(m => {
    const qm = ev(`QUARTO_PADRAO_MUNDO["${m}"]`);
    const validos = slotsPrincipais.every(s => {
      const item = ev(`ITEM_QUARTO["${qm[s]}"]`);
      return item && item.slot === s && item.preco === 0 && item.mundo === m;
    });
    ok(validos, `itens iniciais do mundo ${m} são válidos, gratuitos e pertencem ao mundo`);
  });

  // 4. Sem duplicatas de ID nos novos itens
  const dupes = ev(`(() => {
    const ids = new Set();
    const rep = [];
    QUARTO_MUNDOS_NOVOS.forEach(i => {
      if (ids.has(i.id)) rep.push(i.id);
      ids.add(i.id);
    });
    return rep;
  })()`);
  ok(dupes.length === 0, `nenhum id de item repetido nos novos quartos (duplicados: ${dupes.join(", ")})`);

  // 5. quartoSVG renderiza o quarto inicial do estilo ativo automaticamente
  for (const m of ["emo", "otaku", "feiticeiro", "bruxo", "gamer"]) {
    ev(`setPersona("${m}"); S.leitura.decor.quarto = {}; commit();`);
    const svg = ev(
      `quartoSVG({ lidos: [], lendo: [], decor: { enfeites: [] }, equip: {}, persona: "${m}", meu: true })`
    );
    ok(
      svg.includes("q-cama") && svg.includes("q-janela") && svg.includes("q-luz"),
      `quartoSVG desenha os slots do mundo ${m}`
    );
  }

  // 6. Ao abrir Decorar na estante, o quarto inicial mostra Usando para os itens do mundo
  ev(`setPersona("emo"); tab = "estante"; estanteTab = "decorar"; render();`);
  await espera(30);
  ok(
    /Usando/.test(M()) && M().includes("Assoalho preto e roxo"),
    "quarto emo inicial aparece como Usando na loja"
  );

  // 7. Loja mostra itens do mundo para comprar com páginas
  ev(`setPersona("otaku"); tab = "estante"; estanteTab = "decorar"; render();`);
  await espera(30);
  ok(M().includes("Tatame de palha tradicional"), "item inicial otaku presente");
  ok(M().includes("Janela Neo Tóquio neon"), "item extra otaku disponível para compra");

  // 8. Trocar para feiticeiro e comprar um item do quarto
  ev(`setPersona("feiticeiro"); tab = "estante"; estanteTab = "decorar"; render();`);
  await espera(30);
  ok(M().includes("Pedra azul da torre estelar"), "quarto do feiticeiro ativo");
  const saldoAntes = ev("S.leitura.saldo");
  const buyBtn = D.querySelector('[data-act="quarto"][data-id="q_tapete_feiticeiro_mandala"]');
  if (buyBtn) {
    buyBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    await espera(30);
    ok(
      ev("S.leitura.decor.quarto.tapete === 'q_tapete_feiticeiro_mandala'"),
      "comprou e equipou tapete de feiticeiro"
    );
    ok(ev("S.leitura.saldo") < saldoAntes, "páginas foram debitadas da estante");
  } else {
    erros.push("botão de compra de tapete do feiticeiro não encontrado");
  }

  fechar();
  return erros;
};
