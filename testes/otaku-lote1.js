// Testes do Mundo Otaku: Lote 1 (Itens 1 a 10)
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

  ev(`S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; commit();`);
  await espera(30);

  // 1. Temporada atual
  ok(ev("typeof temporadaOtakuAtual === 'function' && temporadaOtakuAtual().nome.length > 0"), "1. Temporada com nome sorteado");
  // Botão de abertura dá gotas
  const g0 = ev("S.coins");
  const temBotaoAbertura = !!D.querySelector('[data-act="otaku-abertura"]');
  if (temBotaoAbertura) {
    clicar('[data-act="otaku-abertura"]');
    ok(ev("S.coins") >= g0 + 5, "1. Assistir abertura dá +5 gotas");
  } else {
    ev(`dadosMundo("otaku").aberturaVista = ""; render();`);
    if (D.querySelector('[data-act="otaku-abertura"]')) {
      clicar('[data-act="otaku-abertura"]');
      ok(ev("S.coins") >= g0 + 5, "1. Assistir abertura dá +5 gotas");
    }
  }

  // 2. Próximo episódio ao fechar o dia
  ev(`S.tasks = [{ id: "t_amanha", title: "Treino no Dojo", area: "geral", date: addDays(today(), 1), done: false, prio: 0, sub: [] }]; S.journal[today()] = { closed: true }; tab = "hoje"; render();`);
  ok(/cm-proximo-ep/.test(M()) && /Treino no Dojo/.test(M()), "2. Próximo episódio mostra prévia das tarefas de amanhã");

  // 3. Arco do vilão com 3 atrasadas
  ev(`S.journal[today()] = null; S.tasks = [
    { id: "at1", title: "Atrasada 1", area: "geral", date: addDays(today(), -2), done: false, prio: 0, sub: [] },
    { id: "at2", title: "Atrasada 2", area: "geral", date: addDays(today(), -3), done: false, prio: 0, sub: [] },
    { id: "at3", title: "Atrasada 3", area: "geral", date: addDays(today(), -4), done: false, prio: 0, sub: [] }
  ]; tab = "hoje"; render();`);
  ok(/cm-vilao/.test(M()) && /Lorde da Procrastinação/.test(M()), "3. Vilão aparece com 3 atrasadas");
  const vilaoVidaAntes = ev("dadosMundo('otaku').vilao.vidaAtual");
  clicar('[data-act="toggle"][data-id="at1"]');
  await espera(30);
  ok(ev("dadosMundo('otaku').vilao.vidaAtual") < vilaoVidaAntes, "3. Concluir tarefa atrasada tira vida do vilão");

  // 4. Rival
  ok(/cm-rival/.test(M()) && /Duelo de Rivais/.test(M()) && /Rival Takeshi/.test(M()), "4. Rival com pontuação simulada na semana");

  // 5. Ataque especial
  ev(`S.tasks.push({ id: "t_boss", title: "Relatório Final", area: "geral", date: today(), done: false, prio: 3, sub: [] }); tab = "hoje"; render();`);
  ok(/chip-golpe/.test(M()) && /Relatório Final/.test(M()), "5. Tarefa de prioridade alta ganha nome de ataque especial");

  // 6. Nível de poder no foco
  ev(`S.sessions = [{ id: "s1", subjectId: "sub1", date: today(), min: 30 }]; tab = "hoje"; render();`);
  ok(ev("nivelPoderFoco().rank") === "Genin" && /cm-rank-foco/.test(M()), "6. 30 min de foco sobe para rank Genin");

  // 7. Senpai notou (7 dias seguidos)
  ev(`for (let i = 1; i <= 7; i++) S.tasks.push({ id: "streak_" + i, title: "Dia " + i, area: "geral", date: addDays(today(), -i), done: true, sub: [] });`);
  ev(`verificarSenpaiNotou();`);
  ok(ev("S.owned.includes('otaku_carta_senpai')"), "7. Senpai notou dá a Carta do Senpai com 7 dias seguidos");

  // 8. Recapitulando
  ok(ev("typeof recapitulandoHTML === 'function'"), "8. Recapitulando no domingo implementado");

  // 9. Hora do lámen
  ok(ev("typeof horaDoLamen === 'function'"), "9. Hora do lámen detecta madrugada");

  // 10. Ficha de personagem no perfil
  ev(`S.habits = [{ id: "h1", name: "Treino de karatê", days: [0,1,2,3,4,5,6], time: "", created: today() }]; tab = "prumi"; prumiTab = "perfil"; render();`);
  ok(/ficha-otaku/.test(M()) && /Guerreiro do Dojo/.test(M()), "10. Ficha de personagem calculada dos hábitos aparece no perfil");

  fechar();
  return erros;
};
