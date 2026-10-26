// Testes do Mundo Otaku: Lote 5 (Itens 41 a 50)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document,
    M = () => (D.getElementById("main") ? D.getElementById("main").innerHTML : "");
  const clicar = sel => {
    const b = D.querySelector(sel);
    if (!b) return erros.push("não achei " + sel);
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  };

  ev(
    `S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; S.pets = S.pets || {}; S.pets.fantasia = false; S.tasks = [{ id: "t1", title: "Tarefa otaku", area: "geral", date: today(), done: false, prio: 0, sub: [] }]; commit(); render();`
  );
  await espera(30);

  // 41. "Nya" ao fazer carinho
  ok(
    ev("typeof MUNDO_FX.otaku.aoTocar === 'function' && typeof somNyaCarinho === 'function'"),
    "41. Som Nya e gancho aoTocar presentes"
  );

  // 42. Som de power up da aura
  ok(ev("typeof somPowerUpAura === 'function'"), "42. Som de power up da aura presente");

  // 43. Coleção de cenas favoritas
  ev("guardarCenaFavoritaOtaku()");
  ok(ev("dadosMundo('otaku').cenasFavoritas.length >= 1"), "43. Cena favorita salva com sucesso");
  ok(ev("cenasFavoritasHTML().includes('cena-thumb')"), "43. Miniaturas das cenas favoritas renderizadas");

  // 44. Pacote de figurinhas por conquista
  const nFig0 = ev("dadosMundo('otaku').album2 ? dadosMundo('otaku').album2.length : 0");
  ev("pacoteFigurinhasPorConquista({ name: 'Treinamento Concluído' })");
  const nFig1 = ev("dadosMundo('otaku').album2.length");
  ok(nFig1 >= nFig0, "44. Pacote de figurinhas por conquista acionado");

  // 45. Conquistas próprias do mundo
  for (const cid of ["otaku_protagonista", "otaku_rival_derrotado", "otaku_temporada_completa"]) {
    ok(
      ev(`ACHS.some(a => a.id === "${cid}" && a.mundo === "otaku")`),
      "45. Conquista " + cid + " registrada"
    );
  }

  // 46. Roupas de cosplay genérico
  for (const rid of [
    "otaku_cosplay_ninja",
    "otaku_cosplay_garotamagica",
    "otaku_cosplay_piloto",
    "otaku_cosplay_samurai"
  ]) {
    ok(
      ev(`ITEMS.some(i => i.id === "${rid}" && i.slot === "top")`),
      "46. Roupa de cosplay " + rid + " presente"
    );
  }

  // 47. Troca de figurinhas repetidas pela caixa
  ev(`dadosMundo("otaku").album2 = [];
      const btn = document.createElement("button");
      btn.dataset.act = "aceitar-troca-fig";
      btn.dataset.fig = "shuriken";
      ACOES_EXTRAS["aceitar-troca-fig"](btn, "aviso_123");`);
  ok(
    ev("dadosMundo('otaku').album2.includes('shuriken')"),
    "47. Aceitar troca de figurinhas adiciona ao álbum"
  );

  // 48. Ranking da temporada entre amigos
  ok(/cm-ranking-temporada/.test(M()), "48. Card de ranking da temporada presente no Hoje");

  // 49. Mandar grito de incentivo
  ok(ev("typeof mandarGritoIncentivo === 'function'"), "49. Função de grito de incentivo disponível");

  // 50. Pet faz pose de vitória ao derrotar o vilão
  ev(`S.pets = { lista: [{ id: "p1", especie: "gato", nome: "Mimi", cor: "laranja", acess: {}, carinhos: {} }], ativo: "p1" };
      petPoseVitoriaVilao();`);
  ok(
    ev("petAtivo() && petAtivo().pose === 'vitoria' && dadosMundo('otaku').petVitoria === today()"),
    "50. Pet assume pose de vitória ao vencer o vilão"
  );

  fechar();
  return erros;
};
