/*
  Telas de amigos (só com a conta Google):
  - viewAmigos: convite (link e QR), adicionar por @ ou código, pedidos, lista de amigos, privacidade e bloqueados.
    Com um amigo aberto, mostra o perfil dele: Prumi, status do MSN, livro atual, estante, Fotolog,
    comunidades, Top 8, depoimentos e os botões de mimo, recado, depoimento, par, desfazer e bloquear.
  - viewAvisos: o sininho do topo (pedidos de amizade, recados, depoimentos, mimos e pedidos de par).
  A lógica fica em js/amigos.js.
*/
"use strict";

let qrSvg = ""; // QR code do convite, gerado quando a pessoa pede

const linhaAmigoHTML = (uid, extra = "") => {
  const i = amigosInfo[uid] || {},
    v = i.vitrine || {},
    p = i.perfil || {};
  const st = statusDoAmigo(v);
  const cor = (STATUS_MSN[st.st] || STATUS_MSN.offline).cor;
  const ehPar = S.parceria.id === uid && parceriaAtiva();
  return `<li><button class="item amigo-linha" data-act="amigo-abrir" data-id="${esc(uid)}">${prumi({ mood: humorOk(v.humor && v.humor.rosto), size: 44, eq: v.equip || equipOk(p.equip), p: mundoOk(v.persona || p.persona) })}
    <span class="main"><span class="title"><i class="msn-bola" style="--c:${cor}"></i>${esc(v.nome || p.nome || "Amigo")}${ehPar ? ` <span class="tag on">${S.parceria.tipo === "amizade" ? "Melhor amigo" : "Par"}</span>` : ""}</span>
    <span class="meta">${p.usuario || v.usuario ? "@" + esc(p.usuario || v.usuario) + " · " : ""}${esc(st.texto)}${v.livroAtual ? ` · lendo ${esc(v.livroAtual.titulo)}` : ""}</span>
    ${v.subnick ? `<span class="meta subnick">${esc(v.subnick)}</span>` : ""}</span>${extra}</button></li>`;
};

function perfilAmigoHTML(uid) {
  const i = amigosInfo[uid] || {},
    v = i.vitrine;
  if (!v) return `<div class="empty">Carregando o perfil...</div>`;
  const st = statusDoAmigo(v);
  const mimos = MIMOS.amizade
    .concat([["beijinho", "Beijinho"]])
    .filter(([k], n, a) => a.findIndex(x => x[0] === k) === n);
  const ehPar = S.parceria.id === uid;
  const fotos = v.fotolog || [];
  return `<div class="perfil-ms" data-layout="${esc(v.layout)}">
    <div class="row"><button class="btn small ghost" data-act="amigo-fechar">← Amigos</button></div>
    <div class="ms-topo">
      <div class="ms-foto">${prumi({ mood: humorOk(v.humor && v.humor.rosto === "cry" ? "sad" : "happy"), fill: (v.agua || 0) / 100, size: 104, eq: v.equip, p: v.persona })}</div>
      <div class="ms-info">
        <span class="ms-nome glitter">${esc(v.nome || "Amigo")}</span>
        ${v.usuario ? `<span class="note">@${esc(v.usuario)}</span>` : ""}
        ${v.subnick ? `<span class="subnick letreiro"><span>${esc(v.subnick)}</span></span>` : ""}
        <span><i class="msn-bola" style="--c:${(STATUS_MSN[st.st] || STATUS_MSN.offline).cor}"></i> ${esc(st.texto)}</span>
        ${v.ouvindo ? `<span><b>Ouvindo:</b> ♪ ${esc(v.ouvindo)}</span>` : ""}
        ${v.humor ? `<span><b>Humor:</b> ${esc(v.humor.nivel)} · água ${v.agua}%</span>` : ""}
        <span><b>Mundo:</b> ${esc(PERSONAS[v.persona].name)} · <b>Nível</b> ${v.nivel}</span>
      </div>
    </div>
    <div class="ms-visitas">Visitante nº ${contadorHTML(v.visitas || 0)}</div>

    <div class="ms-bloco"><span class="ms-titulo">Mimos</span>
      <div class="mimos">${mimos.map(([k, l]) => `<button class="btn small" data-act="amigo-mimo" data-id="${esc(uid)}" data-t="${k}">${l}</button>`).join("")}</div>
      ${typeof presenteHTML === "function" ? presenteHTML(uid) : ""}
      <span class="note">Até ${MIMOS_DIA} por dia pra cada amigo. ${mimosHoje(uid) ? `Hoje você já mandou ${mimosHoje(uid)}.` : ""}</span>
    </div>

    ${v.pet && typeof petSVG === "function" ? `<div class="ms-bloco pet-amigo"><span class="ms-titulo">Pet</span><div class="row">${petSVG(v.pet, { pose: "feliz", tam: 70 })}<span><b>${esc(v.pet.nome)}</b><br><span class="note">${esc(ESPECIES_PET[v.pet.especie].nome)} ${esc(PERSONALIDADES_PET[v.pet.personalidade].nome.toLowerCase())}</span></span></div></div>` : ""}
    ${v.sobre ? `<div class="ms-bloco"><span class="ms-titulo">Sobre</span><p class="sobre">${esc(v.sobre)}</p></div>` : ""}

    ${
      v.estante
        ? `<div class="ms-bloco"><span class="ms-titulo">Estante (${v.estante.totalLidos} lidos)</span>
        ${v.livroAtual ? `<span><b>Lendo agora:</b> ${esc(v.livroAtual.titulo)}${v.livroAtual.autor ? ` · ${esc(v.livroAtual.autor)}` : ""} · ${v.livroAtual.progresso}%</span>` : ""}
        <div class="estante-quadro">${casaSVG({ lidos: v.estante.lidos, lendo: v.estante.lendo, decor: v.estante.decor, equip: v.equip, persona: v.persona, meu: false, pet: v.pet })}</div>
        ${v.estante.lidos.length ? `<details class="more"><summary>Livros que leu</summary><ul class="list livros">${v.estante.lidos.map(l => `<li><div class="item">${capaHTML(l, 34)}<span class="main"><span class="title">${esc(l.titulo)}</span><span class="meta">${esc(l.autor || "")}</span>${l.nota ? notaHTML(l, false) : ""}</span></div></li>`).join("")}</ul></details>` : ""}
      </div>`
        : ""
    }

    ${v.mixtape && v.mixtape.faixas.length ? `<div class="ms-bloco"><span class="ms-titulo">Mixtape: ${esc(v.mixtape.nome || "sem nome")}</span><ol class="faixas">${v.mixtape.faixas.map(f => `<li><span>${esc(f)}</span></li>`).join("")}</ol></div>` : ""}
    ${v.ingressos && v.ingressos.ultimos.length && typeof ingressoHTML === "function" ? `<div class="ms-bloco"><span class="ms-titulo">Ingressos (${v.ingressos.total})</span><div class="ing-lista">${v.ingressos.ultimos.map(i => ingressoHTML(i, true)).join("")}</div></div>` : ""}
    ${fotos.length ? `<div class="ms-bloco"><span class="ms-titulo">Fotolog</span><div class="fl-galeria">${fotos.map(f => `<div class="fl-mini">${fotoHTML(f, false)}</div>`).join("")}</div></div>` : ""}

    ${
      v.comunidades.length
        ? `<div class="ms-bloco"><span class="ms-titulo">Comunidades (${v.comunidades.length})</span><div class="comunidades">${COMUNIDADES.filter(
            c => v.comunidades.includes(c.ach)
          )
            .map(c => `<span class="comunidade">${comunidadeIcone(c)}<span>${esc(c.nome)}</span></span>`)
            .join("")}</div></div>`
        : ""
    }

    ${v.top8.length ? `<div class="ms-bloco"><span class="ms-titulo">Top 8</span><div class="top8">${v.top8.map(t => `<div class="top8-item">${prumi({ mood: "happy", size: 52, eq: t.equip, p: t.persona })}<span>${esc(t.nome)}</span></div>`).join("")}</div></div>` : ""}

    <div class="ms-bloco"><span class="ms-titulo">Depoimentos</span>
      ${v.depoAceitos.length ? `<ul class="recados depos">${v.depoAceitos.map(d => `<li><b>${esc(d.de)}</b> <span class="note">${d.em ? fmtShort(ymd(new Date(d.em))) : ""}</span><p>${esc(d.texto)}</p></li>`).join("")}</ul>` : `<span class="note">Nenhum depoimento ainda.</span>`}
      <form class="col" data-form="amigo-depoimento" data-id="${esc(uid)}"><textarea id="ad-txt" maxlength="600" placeholder="Escreva um depoimento. Só aparece depois que ${esc(v.nome || "a pessoa")} aprovar." required></textarea><div><button class="btn small" type="submit">Enviar depoimento</button></div></form>
    </div>

    <div class="ms-bloco"><span class="ms-titulo">Deixar um recado</span>
      <form class="row" data-form="amigo-recado" data-id="${esc(uid)}"><input id="ar-txt" type="text" maxlength="600" placeholder="Recado para ${esc(v.nome || "seu amigo")}" style="flex:1" autocomplete="off" required><button class="btn small primary" type="submit">Enviar</button></form>
    </div>

    <div class="ms-bloco"><span class="ms-titulo">Amizade</span>
      ${
        ehPar
          ? `<span class="note">${parceriaAtiva() ? `Vocês são ${S.parceria.tipo === "amizade" ? "melhores amigos" : "par"}: os dois Prumis aparecem juntos na Hoje.` : "Pedido de par enviado, esperando aceitar."}</span><div><button class="btn small ghost" data-act="desfazer">Desfazer par</button></div>`
          : `<div class="row"><button class="btn small" data-act="amigo-par" data-id="${esc(uid)}" data-t="namoro">${textoMundo("pedirPar", "Pedir pra ser meu par")}</button><button class="btn small" data-act="amigo-par" data-id="${esc(uid)}" data-t="amizade">Melhor amigo</button></div><span class="note">O par aparece junto com você na aba Hoje.</span>`
      }
      <div class="row">${S.perfil.top8.includes(uid) ? `<button class="btn small ghost" data-act="top8" data-id="${esc(uid)}">Tirar do meu Top 8</button>` : `<button class="btn small" data-act="top8" data-id="${esc(uid)}">Pôr no meu Top 8</button>`}</div>
      <div class="row"><button class="btn small ghost" data-act="amigo-remover" data-id="${esc(parId(meuId, uid))}">Desfazer amizade</button><button class="btn small ghost danger" data-act="amigo-bloquear" data-id="${esc(uid)}">Bloquear</button></div>
    </div>
  </div>`;
}

function viewAmigos() {
  if (!modoFirebase())
    return `<section class="block"><h1 class="h1">Amigos</h1><div class="empty"><strong>${textoMundo("conviteTitulo", "Amigos precisam de conta.")}</strong>Entre com Google em Ajustes para adicionar amigos, trocar recados e ver a estante deles.${conviteRecebido ? `<br>Você recebeu um convite de <b>${esc(conviteRecebido)}</b>: ele aparece aqui depois do login.` : ""}<div><button class="btn primary" data-act="conta-entrar">Entrar com Google</button></div></div></section>`;
  if (amigoAberto) return `<section class="block">${perfilAmigoHTML(amigoAberto)}</section>`;
  const amigos = amigosAceitos().sort(
    (a, b) =>
      ((amigosInfo[b.uid] || {}).vitrine || {}).visto - ((amigosInfo[a.uid] || {}).vitrine || {}).visto || 0
  );
  const pv = S.privacidade;
  return `
  <section class="block"><h1 class="h1">Amigos<small>${amigos.length} ${amigos.length === 1 ? "amigo" : "amigos"}${S.perfil.usuario ? ` · você é @${esc(S.perfil.usuario)}` : ""}</small></h1></section>
  ${
    conviteRecebido
      ? `<section class="block"><div class="card pedido"><span>Você abriu um convite de <b>${esc(conviteRecebido)}</b>. Quer adicionar?</span><div class="row"><button class="btn small primary" data-act="convite-aceitar">Adicionar</button><button class="btn small ghost" data-act="convite-ignorar">Agora não</button></div></div></section>`
      : ""
  }
  ${
    pedidosRecebidos().length
      ? `<section class="block"><h2 class="h2">Pedidos <span class="count">${pedidosRecebidos().length}</span></h2><ul class="list">${pedidosRecebidos()
          .map(a =>
            linhaAmigoHTML(a.uid)
              .replace('data-act="amigo-abrir"', 'data-act="nada"')
              .replace(
                "</button></li>",
                `</button><div class="row" style="padding:0 12px 10px"><button class="btn small primary" data-act="amigo-aceitar" data-id="${esc(a.id)}">Aceitar</button><button class="btn small ghost" data-act="amigo-remover" data-id="${esc(a.id)}">Recusar</button></div></li>`
              )
          )
          .join("")}</ul></section>`
      : ""
  }
  ${
    avisoRegras
      ? `<section class="block"><div class="card aviso-regras"><b>O Firebase está bloqueando os amigos.</b><span class="note">As regras do banco estão desatualizadas. No console do Firebase, abra Firestore → Regras, apague tudo, cole o conteúdo do arquivo <span class="mono">firestore.rules</span> do repositório e clique em Publicar. Depois recarregue o Prumo.</span></div></section>`
      : ""
  }
  <section class="block"><h2 class="h2">Adicionar</h2>
    <form class="add" data-form="amigo-add"><input id="amigo-quem" class="grow" type="text" placeholder="@usuario ou código" autocomplete="off" autocapitalize="off" required><button class="btn primary" type="submit">Adicionar</button></form>
    <div class="card convite">
      <span>Seu código: <b class="mono codigo">${esc(S.codigo)}</b>${S.perfil.usuario ? ` · <b>@${esc(S.perfil.usuario)}</b>` : ` · <span class="note">escolha seu @ em Ajustes</span>`}</span>
      <div class="row"><button class="btn small" data-act="convite-copiar">Copiar link de convite</button><button class="btn small" data-act="convite-qr">${qrSvg ? "Esconder QR code" : "Mostrar QR code"}</button></div>
      ${qrSvg ? `<div class="qr">${qrSvg}</div><span class="note">Quem escanear abre o Prumo já com o seu convite.</span>` : ""}
    </div>
    ${
      pedidosEnviados().length
        ? `<span class="note">Esperando aceitar: ${pedidosEnviados()
            .map(a => esc(nomeDe(a.uid)))
            .join(", ")}</span>`
        : ""
    }
  </section>
  ${typeof socialMaisHTML === "function" ? socialMaisHTML(amigos) : ""}
  <section class="block"><h2 class="h2">Seus amigos</h2>
    ${amigos.length ? `<ul class="list">${amigos.map(a => linhaAmigoHTML(a.uid)).join("")}</ul>` : `<div class="empty">Nenhum amigo ainda. Mande seu link de convite pra alguém!</div>`}
  </section>
  <section class="block"><h2 class="h2">O que seus amigos veem</h2>
    <div class="setbox">${[
      ["status", "Status do MSN e o que está ouvindo"],
      ["humor", "Humor do Prumi e água do dia"],
      ["estante", "Estante e livro atual"],
      ["fotolog", "Fotolog"]
    ]
      .map(
        ([k, l]) =>
          `<div class="setrow"><div class="lbl"><b>${l}</b></div><button class="btn small ${pv[k] ? "" : "ghost"}" data-act="privacidade" data-k="${k}" aria-pressed="${!!pv[k]}">${pv[k] ? "Amigos veem" : "Escondido"}</button></div>`
      )
      .join("")}</div>
    <span class="note">Tarefas, água detalhada, diário e hábitos nunca aparecem pra ninguém.</span>
  </section>
  ${
    bloqueados().length
      ? `<section class="block"><details class="more"><summary>Bloqueados (${bloqueados().length})</summary><ul class="list">${bloqueados()
          .map(
            a =>
              `<li><div class="item"><span class="main"><span class="title">${esc(nomeDe(a.uid))}</span></span><button class="btn small" data-act="amigo-remover" data-id="${esc(a.id)}">Desbloquear</button></div></li>`
          )
          .join("")}</ul></details></section>`
      : ""
  }`;
}

function viewAvisos() {
  if (!modoFirebase())
    return `<section class="block"><h1 class="h1">Avisos</h1><div class="empty">Entre com Google em Ajustes para receber avisos dos amigos.</div></section>`;
  const pedidos = pedidosRecebidos();
  const itens = caixaItens.filter(i => i.tipo !== "visita");
  const desc = i => {
    const quem = `<b>${esc(i.deNome || nomeDe(i.de))}</b>`;
    if (i.tipo === "recado") return `${quem} deixou um recado<p>${esc(i.texto)}</p>`;
    if (i.tipo === "depoimento") return `${quem} escreveu um depoimento pra você<p>${esc(i.texto)}</p>`;
    if (i.tipo === "mimo") return `${quem} ${esc(MIMO_TEXTO[i.mimo] || "te mandou um mimo")}`;
    if (i.tipo === "par") return `${quem} quer ser seu ${i.texto === "amizade" ? "melhor amigo" : "par"}`;
    if (i.tipo === "livro") {
      const [titulo, ...resto] = String(i.texto || "").split("\n");
      return `${quem} te recomendou <b>${esc(titulo)}</b>${resto.length ? `<p>${esc(resto.join(" "))}</p>` : ""}`;
    }
    if (i.tipo === "clube") return `${quem} te chamou para o clube do livro <b>${esc(i.texto)}</b>`;
    if (i.tipo === "reacao")
      return i.reacao === "foco"
        ? `${quem} focou junto com você`
        : `${quem} reagiu ${(typeof REACOES === "object" && REACOES[i.reacao]) || "👏"} à sua conquista <b>${esc(i.texto)}</b>`;
    if (i.tipo === "mixtape") {
      const [nomeFita, ...faixas] = String(i.texto || "").split("\n");
      return `${quem} te mandou uma mixtape: <b>${esc(nomeFita || "Mixtape")}</b><ol class="faixas">${faixas
        .slice(0, 10)
        .map(f => `<li><span>${esc(f)}</span></li>`)
        .join("")}</ol>`;
    }
    return quem;
  };
  const acoes = i => {
    if (i.tipo === "depoimento" && !S.perfil.depoVistos.includes(i.em))
      return `<div class="row"><button class="btn small primary" data-act="depo-caixa" data-id="${esc(i.id)}" data-ok="1">Aprovar</button><button class="btn small ghost" data-act="depo-caixa" data-id="${esc(i.id)}" data-ok="0">Recusar</button></div>`;
    if (i.tipo === "par" && S.parceria.id !== i.de)
      return `<div class="row"><button class="btn small primary" data-act="par-aceitar" data-id="${esc(i.id)}">Aceitar</button></div>`;
    if (i.tipo === "livro")
      return `<div class="row"><button class="btn small primary" data-act="rec-guardar" data-id="${esc(i.id)}">Pôr em Quero ler</button></div>`;
    if (i.tipo === "clube")
      return `<div class="row"><button class="btn small primary" data-act="ir-juntos">Ver o clube</button></div>`;
    if (i.tipo === "recado" && ehAmigo(i.de))
      return `<div class="row"><button class="btn small ghost" data-act="amigo-abrir" data-id="${esc(i.de)}">Responder</button></div>`;
    return "";
  };
  // ao abrir a tela, tudo vira "visto" (menos depoimentos esperando decisão)
  setTimeout(() => marcarVisto(caixaItens.filter(i => !i.visto && i.tipo !== "depoimento")), 400);
  return `<section class="block"><h1 class="h1">Avisos<small>${totalAvisos() ? `${totalAvisos()} novidades` : "Tudo em dia"}</small></h1></section>
  ${pedidos.length ? `<section class="block"><h2 class="h2">Pedidos de amizade</h2><ul class="list">${pedidos.map(a => `<li><div class="item"><span class="main"><span class="title"><b>${esc(nomeDe(a.uid))}</b> quer ser seu amigo</span></span><button class="btn small primary" data-act="amigo-aceitar" data-id="${esc(a.id)}">Aceitar</button><button class="btn small ghost" data-act="amigo-remover" data-id="${esc(a.id)}">Recusar</button></div></li>`).join("")}</ul></section>` : ""}
  <section class="block">${
    itens.length
      ? `<ul class="list avisos">${itens.map(i => `<li class="${i.visto ? "" : "novo"}"><div class="aviso"><span class="note">${fmtShort(ymd(new Date(i.em)))} · ${String(new Date(i.em).getHours()).padStart(2, "0")}:${String(new Date(i.em).getMinutes()).padStart(2, "0")}</span><span>${desc(i)}</span>${acoes(i)}</div></li>`).join("")}</ul>`
      : `<div class="empty">Nada por aqui ainda. Quando um amigo mandar recado, mimo ou depoimento, aparece aqui.</div>`
  }</section>`;
}

/* ---------- botões ---------- */
ACOES_EXTRAS["amigo-abrir"] = (b, id) => {
  amigoAberto = id;
  tab = "amigos";
  carregarAmigo(id, true, true);
  registrarVisita(id);
  render();
  window.scrollTo(0, 0);
};
ACOES_EXTRAS["amigo-fechar"] = () => {
  amigoAberto = null;
  render();
};
ACOES_EXTRAS["amigo-aceitar"] = (b, id) => aceitarAmigo(id);
ACOES_EXTRAS["amigo-remover"] = (b, id) => removerAmizade(id);
ACOES_EXTRAS["amigo-bloquear"] = (b, id) => {
  if (b.dataset.certeza) return bloquearAmigo(id);
  b.dataset.certeza = "1";
  b.textContent = "Toque de novo para bloquear";
};
ACOES_EXTRAS["amigo-mimo"] = (b, id) => mandarMimo(id, b.dataset.t);
ACOES_EXTRAS["amigo-par"] = (b, id) => pedirPar(id, b.dataset.t);
ACOES_EXTRAS["par-aceitar"] = (b, id) => {
  const i = caixaItens.find(x => x.id === id);
  if (i) aceitarPar(i);
};
ACOES_EXTRAS["depo-caixa"] = (b, id) => decidirDepoimentoCaixa(id, b.dataset.ok === "1");
ACOES_EXTRAS.top8 = (b, id) => {
  const t = S.perfil.top8;
  S.perfil.top8 = t.includes(id) ? t.filter(x => x !== id) : [...t, id].slice(0, 8);
  commit();
  publicarPerfil(true);
};
ACOES_EXTRAS.privacidade = b => {
  S.privacidade[b.dataset.k] = !S.privacidade[b.dataset.k];
  commit();
  publicarPerfil(true);
};
ACOES_EXTRAS["convite-copiar"] = async () => {
  const link = linkConvite();
  try {
    if (navigator.share)
      await navigator.share({
        title: "Prumo",
        text: textoMundo("conviteTexto", "Vem ser meu amigo no Prumo!"),
        url: link
      });
    else {
      await navigator.clipboard.writeText(link);
      toast("Link copiado! Manda pra quem você quiser.", false, "happy");
    }
  } catch (e) {
    prompt("Copie o link de convite:", link);
  }
};
ACOES_EXTRAS["convite-qr"] = async () => {
  qrSvg = qrSvg ? "" : await qrConvite();
  if (!qrSvg && !document.querySelector(".qr"))
    toast("Não consegui gerar o QR agora. O link funciona igual.", false, "worried");
  render();
};
ACOES_EXTRAS["convite-aceitar"] = () => {
  const q = conviteRecebido;
  conviteRecebido = null;
  adicionarAmigo(q);
  render();
};
ACOES_EXTRAS["convite-ignorar"] = () => {
  conviteRecebido = null;
  render();
};
FORMS_EXTRAS["amigo-add"] = () => {
  adicionarAmigo(getV("amigo-quem"));
};
FORMS_EXTRAS["amigo-recado"] = f => {
  mandarRecado(f.dataset.id, getV("ar-txt"));
};
FORMS_EXTRAS["amigo-depoimento"] = f => {
  mandarDepoimento(f.dataset.id, getV("ad-txt"));
};
