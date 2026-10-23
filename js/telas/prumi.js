/*
  Aba Prumi (loja, temas, conquistas, personalidade).
*/
"use strict";

/* ---------- aba Prumi ---------- */
let prumiTab = "visual",
  slotSel = "hat",
  tryItem = null,
  tryPal = null;

const DROP =
  '<svg class="drop" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5s-6.5 7.2-6.5 12a6.5 6.5 0 0 0 13 0c0-4.8-6.5-12-6.5-12z"/></svg>';

const owns = i => S.owned.includes(i.id) || (i.ach && !!S.ach[i.ach]);

function itemState(i) {
  if (owns(i)) return S.equip[i.slot] === i.id ? "on" : "own";
  if (i.ach) return "lock";
  if (i.evento && !eventoAtivo(i)) return "fora"; // evento já acabou
  return "buy";
}
/** Itens que aparecem na loja: os do mundo atual + itens de evento (ativos ou já comprados). */
const itensDaLoja = () =>
  ITEMS.filter(i => i.p === S.persona || (i.p === "*" && (eventoAtivo(i) || owns(i))));

function viewPrumi() {
  const L = levelOf(S.xp),
    eq = { ...S.equip };
  if (tryItem) eq[ITEM[tryItem].slot] = tryItem;
  const th = TH(),
    ti = tryItem ? ITEM[tryItem] : null,
    tp = tryPal ? th.vars.find(v => v.id === tryPal) : null,
    P0 = P();
  const mine = itensDaLoja(),
    ownedCount = mine.filter(owns).length,
    achCount = Object.keys(S.ach).length;
  const slots = SLOTS_EQ.filter(([k]) => mine.some(i => i.slot === k));
  if (!slots.some(([k]) => k === slotSel)) slotSel = slots[0][0];
  let body = "";
  if (prumiTab === "visual") {
    const list = mine.filter(i => i.slot === slotSel);
    const eventos = eventosHoje();
    body = `${eventos.map(([, ev]) => `<div class="evento-aviso"><b>${esc(ev.nome)}</b> Itens por tempo limitado, até ${ev.prazo()}. Procure o selo nas categorias.</div>`).join("")}
    <span class="note">Itens exclusivos do mundo <b>${esc(P0.name)}</b>. ${ownedCount} de ${mine.length} conquistados.</span>
    <div class="chips" role="group" aria-label="Categoria">${slots.map(([k, l]) => `<button class="chipbtn" data-act="slot" data-s="${k}" aria-pressed="${slotSel === k}">${l}${S.equip[k] ? '<i class="dotm"></i>' : ""}</button>`).join("")}</div>
    <div class="shop">${list
      .map(i => {
        const st = itemState(i),
          e2 = { ...S.equip, [i.slot]: i.id };
        const foot =
          st === "on"
            ? `<span class="tag on">Usando</span>`
            : st === "own"
              ? `<span class="tag">Usar</span>`
              : st === "lock"
                ? `<span class="tag lock">${ICON.lock} Lendário</span>`
                : `<span class="tag price ${S.coins < i.price ? "short" : ""}">${DROP}${i.price}</span>`;
        const selo = i.evento ? `<span class="selo-evento">${esc(EVENTOS[i.evento].nome)}</span>` : "";
        return `<button class="sitem ${st} ${i.ach ? "legend" : ""} ${i.evento ? "do-evento" : ""} ${tryItem === i.id ? "trying" : ""}" data-act="item" data-id="${i.id}" aria-label="${esc(i.name)}">${selo}${prumi({ mood: "idle", fill: 0, size: 62, eq: e2 })}<span class="sname">${esc(i.name)}</span>${foot}</button>`;
      })
      .join("")}</div>
    ${S.equip[slotSel] ? `<div><button class="btn small ghost" data-act="unequip" data-s="${slotSel}">Tirar ${esc(ITEM[S.equip[slotSel]].name.toLowerCase())}</button></div>` : ""}`;
  } else if (prumiTab === "temas") {
    const cur = S.themeBy[S.persona] || "base",
      dk = isDark() ? 1 : 0;
    body = `<div class="card"><span class="label">Aparência</span><div class="seg" role="group">${[
      ["auto", "Automático"],
      ["light", "Claro"],
      ["dark", "Escuro"]
    ]
      .map(([k, l]) => `<button data-act="mode" data-m="${k}" aria-pressed="${S.mode === k}">${l}</button>`)
      .join("")}</div><span class="note">Automático segue o tema do seu aparelho.</span></div>
    <span class="note">Temas do mundo <b>${esc(P0.name)}</b>. A água do Prumi muda com o tema.</span>
    <div class="shop pal">${th.vars
      .map(v => {
        const own =
            v.id === "base" || S.themeOwned.includes(S.persona + ":" + v.id) || (v.ach && S.ach[v.ach]),
          on = cur === v.id;
        const base = dk ? v.D || th.D : v.L || th.L,
          a = v.a ? v.a[dk] : base[3],
          w = v.w ? v.w[dk] : base[4];
        const foot = on
          ? `<span class="tag on">Usando</span>`
          : own
            ? `<span class="tag">Usar</span>`
            : v.ach
              ? `<span class="tag lock">${ICON.lock} Lendário</span>`
              : `<span class="tag price ${S.coins < v.price ? "short" : ""}">${DROP}${v.price}</span>`;
        return `<button class="sitem ${on ? "on" : ""} ${tryPal === v.id ? "trying" : ""}" data-act="tvar" data-id="${v.id}"><span class="swatch" style="background:${base[0]}"><i style="background:${a}"></i><i class="w" style="background:${w}"></i></span><span class="sname">${esc(v.name)}</span>${foot}</button>`;
      })
      .join("")}</div>`;
  } else if (prumiTab === "pet") {
    body = petPainelHTML(); // js/pets.js
  } else if (prumiTab === "perfil") {
    body = perfilHTML(); // js/telas/perfil.js
  } else if (prumiTab === "conquistas") {
    body = `<ul class="list">${ACHS.map(a => {
      const c = Math.min(a.goal, a.cur()),
        done = !!S.ach[a.id],
        li = a.legend ? ITEMS.find(i => i.p === S.persona && i.ach === a.id) : null,
        rw = li ? li.name + " (lendário)" : a.theme ? "Tema lendário" : "";
      const escondida = a.secreta && !done; // conquista secreta: só mostra depois de descoberta
      return `<li class="${done ? "achdone" : ""}"><div class="item"><span class="trophy ${done ? "on" : ""}">${done ? ICON.trophy : ICON.lock}</span><div class="main"><span class="title"><b>${escondida ? "???" : esc(textoMundo("conquista_" + a.id, a.name))}</b></span><span class="meta">${escondida ? "Conquista secreta. Explore o Prumi..." : esc(a.desc)}</span>
        ${done ? `<span class="meta" style="color:var(--ok);font-weight:600">Conquistada em ${fmtShort(S.ach[a.id])}</span>` : escondida ? "" : `<div class="progress" style="margin-top:6px"><span style="width:${Math.round((c / a.goal) * 100)}%"></span></div><span class="meta mono">${a.fmt ? a.fmt(c) : c} / ${a.fmt ? a.fmt(a.goal) : a.goal}</span>`}</div>
        <span class="reward">${DROP}${a.reward}${rw ? `<small>+ ${esc(rw)}</small>` : ""}</span></div></li>`;
    }).join("")}</ul>
    <span class="note">Conquistas valem para todas as personalidades: o item ou tema lendário fica liberado em cada mundo.</span>`;
  } else {
    body = `<span class="note">Cada personalidade é um mundo: muda o jeito de falar, as cores, a água do Prumi e os itens da loja. Ao trocar, seus itens ficam guardados e voltam quando você voltar.</span>
    <ul class="list">${Object.entries(PERSONAS)
      .map(([k, p]) => {
        const e2 = {
          ...((S.persona === k ? S.equip : S.equipBy[k]) ||
            Object.fromEntries(p.starter.map(i => [ITEM[i].slot, i])))
        };
        const t = TH(k),
          dk = isDark() ? 1 : 0,
          c = dk ? t.D : t.L;
        const have = ITEMS.filter(i => i.p === k && owns(i)).length,
          tot = ITEMS.filter(i => i.p === k).length;
        return `<li class="${S.persona === k ? "psel" : ""}"><button class="prow" data-act="persona" data-id="${k}">${prumi({ mood: "happy", size: 52, eq: e2, p: k })}<span class="main"><span class="title"><b style="font-family:${esc(t.font)},sans-serif;font-size:${Math.round(16 * t.ds)}px">${p.name}</b>${S.persona === k ? ' <span class="tag on" style="margin-left:6px">Atual</span>' : ""}</span><span class="meta">${p.desc}</span><span class="meta"><span class="wdot" style="background:${c[3]}"></span><span class="wdot" style="background:${c[4]}"></span>${esc(t.water.name)} · ${have}/${tot} itens</span></span></button></li>`;
      })
      .join("")}</ul>`;
  }
  return `
  <section class="block"><h1 class="h1">Prumi<small>Mundo ${esc(P0.name)} · ${ownedCount} de ${mine.length} itens · ${achCount} de ${ACHS.length} conquistas</small></h1></section>
  <section class="block">
    <div class="stage">
      <button class="mslot" data-kind="stage" data-size="130" data-act="poke" data-eq="${esc(JSON.stringify(eq))}" aria-label="Prumi"></button>
      <div class="stageinfo">
        <span class="lvl">Nível <b class="mono">${L.lvl}</b></span>
        <div class="progress xp"><span style="width:${Math.round((L.cur / L.need) * 100)}%"></span></div>
        <span class="note mono">${L.cur}/${L.need} XP</span>
        <span class="bal">${DROP}<b class="mono">${S.coins}</b> gotas</span>
      </div>
    </div>
    ${ti ? `<div class="trybar"><span>Provando: <b>${esc(ti.name)}</b></span><div class="row"><button class="btn small ghost" data-act="untry">Tirar</button><button class="btn small primary" data-act="buy" data-id="${ti.id}" ${S.coins < ti.price ? "disabled" : ""}>${S.coins < ti.price ? `Faltam ${ti.price - S.coins} gotas` : `Comprar por ${ti.price}`}</button></div></div>` : ""}
    ${tp ? `<div class="trybar"><span>Provando o tema <b>${esc(tp.name)}</b></span><div class="row"><button class="btn small ghost" data-act="untry">Voltar</button><button class="btn small primary" data-act="buytvar" data-id="${tp.id}" ${S.coins < tp.price ? "disabled" : ""}>${S.coins < tp.price ? `Faltam ${tp.price - S.coins} gotas` : `Comprar por ${tp.price}`}</button></div></div>` : ""}
    <div class="seg wide" role="group">${[
      ["visual", "Visual"],
      ["pet", "Pet"],
      ["temas", "Temas"],
      ["perfil", "Perfil"],
      ["conquistas", "Conquistas"],
      ["persona", "Jeito"]
    ]
      .map(([k, l]) => `<button data-act="ptab" data-t="${k}" aria-pressed="${prumiTab === k}">${l}</button>`)
      .join("")}</div>
  </section>
  <section class="block">${body}</section>
  <section class="block"><details class="more"><summary>Como ganhar gotas</summary><div class="earnlist">
    <span>Concluir tarefa <b>+5</b> (prioridade alta <b>+8</b>)</span><span>Marcar hábito <b>+5</b></span><span>Bater a meta de água <b>+20</b></span>
    <span>Revisão espaçada <b>+8</b></span><span>Foco: <b>+2</b> a cada 5 min</span><span>Fechar o dia <b>+10</b></span><span>Falar com alguém <b>+3</b></span><span>${textoMundo("diaPerfeito", "Dia perfeito")} <b>+25</b></span><span>Conquistas dão bônus e itens exclusivos</span></div></details></section>`;
}
