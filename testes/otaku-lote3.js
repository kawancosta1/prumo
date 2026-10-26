// Testes do Mundo Otaku: Lote 3 (Itens 21 a 30)
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

  ev(
    `S.onboarded = true; S.semConta = true; S.name = "Kawan"; setPersona("otaku"); applyTheme(); tab = "hoje"; S.pets = S.pets || {}; S.pets.fantasia = false; S.tasks = [{ id: "t1", title: "Tarefa otaku", area: "geral", date: today(), done: false, prio: 0, sub: [] }]; commit(); render();`
  );
  await espera(30);

  // 21. Álbum 2 (12 figurinhas com raras)
  ok(
    ev("FIGURINHAS_ALBUM2.length === 12 && FIGURINHAS_ALBUM2.some(f => f.rara)"),
    "21. Álbum 2 com 12 figurinhas incluindo raras brilhantes"
  );
  ok(/cm-album2/.test(M()), "21. Álbum 2 aparece no Hoje");

  // 22. Gacha diário com tiro grátis e tiros adicionais
  ok(/cm-gacha/.test(M()), "22. Gacha diário presente no Hoje");
  const g0 = ev("S.coins");
  clicar('[data-act="otaku-gacha"]');
  await espera(20);
  ok(ev("dadosMundo('otaku').gachaDia === today()"), "22. Tiro grátis do dia utilizado");

  // 23. Mais 3 temas: isekai, sliceoflife, idol
  for (const tid of ["isekai", "sliceoflife", "idol"]) {
    ok(
      ev(`THEMES.otaku.vars.some(v => v.id === "${tid}")`),
      "23. Tema " + tid + " presente em THEMES.otaku.vars"
    );
  }

  // 24. Roupas lendárias
  for (const rid of ["otaku_kimono_dourado", "otaku_olhos_especiais", "otaku_asas_anjodemonio"]) {
    ok(ev(`ITEMS.some(i => i.id === "${rid}")`), "24. Roupa lendária " + rid + " presente");
  }

  // 25. Mascotes novos
  for (const pid of ["otaku_pet_tanuki", "otaku_pet_minimecha", "otaku_pet_gatoespirito"]) {
    ok(ev(`ITEMS.some(i => i.id === "${pid}" && i.slot === "pet")`), "25. Mascote " + pid + " presente");
  }

  // 26. Parceiro de anime: pose no Hoje
  ok(
    ev(
      "POSES.namoro.some(p => p.nome === 'Parceiros de anime') && POSES.amizade.some(p => p.nome === 'Parceiros de anime')"
    ),
    "26. Pose de parceiros de anime cadastrada nas duas modalidades"
  );

  // 27. Pet com bandana ninja e som Nya
  ok(
    ev("estiloMundoPet({ especie: 'gato', acess: {} }).includes('pet-bandana-ninja')"),
    "27. Pet usa bandana ninja no mundo otaku"
  );
  ok(
    ev("comentarioTarefa({ especie: 'gato' }, 'tarefa genérica').includes('Nya~!')"),
    "27. Pet mia Nya~! ao comentar tarefas no mundo otaku"
  );

  // 28. Tarefa nova mostra rank (S/A/B/C) na captura rápida
  ok(
    ev("parsedPills({ date: today(), prio: 3 }, 'estudar !3').includes('Missão Rank S')"),
    "28. Prioridade 3 vira Missão Rank S"
  );
  ok(
    ev("parsedPills({ date: today(), prio: 0 }, 'estudar').includes('Missão Rank C')"),
    "28. Tarefa sem prioridade mostra Missão Rank C"
  );

  // 29. Pergunta de anime do dia
  ok(/cm-quiz-anime/.test(M()), "29. Quiz de anime do dia renderizado");
  const g1 = ev("S.coins");
  const btnQuiz = D.querySelector('[data-act="otaku-quiz"][data-opt="0"]');
  if (btnQuiz) {
    btnQuiz.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    await espera(20);
    ok(ev("dadosMundo('otaku').quiz.respondido === true"), "29. Pergunta respondida e registrada");
    ok(ev("S.coins") >= g1 + 5, "29. Acertar quiz dá +5 gotas");
  }

  // 30. Kit de quarto otaku / enfeites na estante
  for (const eid of ["figure_otaku", "prateleira_manga", "poster_otaku"]) {
    ok(
      ev(`ENFEITES.some(e => e.id === "${eid}" && e.mundo === "otaku")`),
      "30. Enfeite otaku " + eid + " presente"
    );
  }

  fechar();
  return erros;
};
