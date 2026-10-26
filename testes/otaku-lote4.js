// Testes do Mundo Otaku: Lote 4 (Itens 31 a 40)
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
    `S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; S.pets = S.pets || {}; S.pets.fantasia = false; S.tasks = [{ id: "t1", title: "Treinar Shuriken", area: "geral", date: today(), done: false, prio: 3, sub: [] }]; commit(); render();`
  );
  await espera(30);

  // 31. Missões rank S/A/B/C com selo colorido na tarefa
  const rowS = ev(
    `taskRow({ id: "t_rank_s", title: "Derrotar Akatsuki", area: "geral", date: today(), done: false, prio: 3, sub: [] })`
  );
  ok(
    rowS.includes("selo-rank rank-s") && rowS.includes("Rank S"),
    "31. Tarefa de prioridade 3 tem selo Rank S"
  );
  const rowC = ev(
    `taskRow({ id: "t_rank_c", title: "Comprar Lámen", area: "geral", date: today(), done: false, prio: 0, sub: [] })`
  );
  ok(
    rowC.includes("selo-rank rank-c") && rowC.includes("Rank C"),
    "31. Tarefa sem prioridade tem selo Rank C"
  );

  // 32. Filler: dia sem tarefas vira episódio filler
  ok(
    ev("textoMundo('vazioHoje').includes('Episódio filler')"),
    "32. Dia sem tarefas traz texto de episódio filler"
  );

  // 33. Flashback: tarefa atrasada há 7+ dias ganha borda sépia e selo flashback
  const rowFlashback = ev(
    `taskRow({ id: "t_antiga", title: "Promessa da infância", area: "geral", date: addDays(today(), -8), done: false, prio: 1, sub: [] })`
  );
  ok(
    rowFlashback.includes("flashback") && rowFlashback.includes("selo-flashback"),
    "33. Tarefa atrasada há 8 dias ganha selo e classe flashback"
  );

  // 34. Arco de treinamento: hábito com 21 dias vira técnica dominada
  ok(
    ev(
      "typeof tecnicaDominadaOtaku('Corrida ninja') === 'string' && tecnicaDominadaOtaku('Corrida ninja').includes('Corrida ninja')"
    ),
    "34. Função de técnica dominada gera nome"
  );
  ev(`S.habits = [{ id: "h21", name: "Flexão Ninja", days: [0,1,2,3,4,5,6] }];
      const t = today();
      S.habitLog = S.habitLog || {};
      for (let i = 0; i < 25; i++) {
        S.habitLog[addDays(t, -i)] = ["h21"];
      }
      commit();`);
  const rowH = ev(`habitRow(S.habits[0], true)`);
  ok(
    rowH.includes("chip-tecnica") && /técnica dominada/i.test(rowH),
    "34. Hábito de 21 dias vira técnica dominada com chip especial"
  );

  // 35. Torneio da semana
  ok(
    ev("typeof torneioOtakuAtual === 'function' && torneioOtakuAtual().chave.length === 4"),
    "35. Torneio da semana com chave de 4 tarefas"
  );
  ok(/cm-torneio/.test(M()), "35. Card do torneio renderizado no Hoje");
  const tId = ev("torneioOtakuAtual().chave[0].id");
  ev(`MUNDO_FX.otaku.aoConcluir({ id: "${tId}", title: torneioOtakuAtual().chave[0].title, prio: 1 });`);
  ok(ev("torneioOtakuAtual().chave[0].feita === true"), "35. Concluir tarefa avança chave do torneio");

  // 36. Cena pós-créditos ao fechar o dia
  ev(`S.journal[today()] = { closed: true }; tab = "hoje"; render();`);
  ok(/cena-pos-creditos/.test(M()), "36. Cena pós-créditos aparece ao fechar o dia");

  // 37. Brilho kira nas gotas
  ev("efeitoKiraGotas()");
  ok(
    D.getElementById("coins").classList.contains("kira-otaku"),
    "37. Brilho kira adicionado ao contador de gotas"
  );

  // 38. Barra de progresso HP
  ok(D.querySelector(".progress"), "38. Barra de progresso presente");

  // 39. Corte de cena tema mangá
  ev("S.themeBy = S.themeBy || {}; S.themeBy.otaku = 'manga'; applyTheme(); viradaPaginaManga();");
  ok(!!D.getElementById("virada-manga-fx"), "39. Efeito de virada de página do tema Mangá acionado");

  // 40. Tela de Level Up de anime
  ev("telaLevelUpAnime(5)");
  ok(
    !!D.getElementById("levelup-modal-anime") &&
      D.getElementById("levelup-modal-anime").textContent.includes("LEVEL UP!"),
    "40. Modal de Level Up com moldura de anime exibido"
  );
  clicar('[data-act="fechar-levelup-anime"]');
  ok(!D.getElementById("levelup-modal-anime"), "40. Fechar modal de level up remove elemento");

  fechar();
  return erros;
};
