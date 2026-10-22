/*
  Tela de Ajustes.
*/
"use strict";

function viewAjustes() {
  return `
  <section class="block"><h1 class="h1">Ajustes<small>Metas, horários e seus dados</small></h1></section>
  <section class="block">
    <h2 class="h2">Você</h2>
    <div class="setbox">
      <div class="setrow"><div class="lbl"><b>Aparência</b><span class="note">Automático segue o tema do aparelho.</span></div><div class="seg" role="group">${[
        ["auto", "Auto"],
        ["light", "Claro"],
        ["dark", "Escuro"]
      ]
        .map(([k, l]) => `<button data-act="mode" data-m="${k}" aria-pressed="${S.mode === k}">${l}</button>`)
        .join("")}</div></div>
      <div class="setrow"><div class="lbl"><b>Agenda dos lembretes</b><span class="note">Google abre o evento num toque. Samsung e Apple baixam um arquivo com alarme.</span></div><select id="set-cal" data-change="set-cal">${Object.entries(
        CALS
      )
        .map(([k, v]) => `<option value="${k}" ${S.calendar === k ? "selected" : ""}>${v}</option>`)
        .join("")}</select></div>
      <div class="setrow"><div class="lbl"><b>Rever boas-vindas</b><span class="note">Abre de novo a apresentação do Prumi.</span></div><button class="btn small" data-act="reonb">Abrir</button></div>
      <div class="setrow"><div class="lbl"><b>Como o Prumi te chama</b><span class="note">Aparece nas mensagens do mascote.</span></div><input id="set-name" type="text" value="${esc(S.name)}" data-change="set-name" maxlength="30" style="width:160px" autocomplete="off"></div>
      <div class="setrow"><div class="lbl"><b>Tratamento</b><span class="note">Como o Prumi se refere a você nas falas.</span></div><div class="seg" role="group"><button data-act="gender" data-g="m" aria-pressed="${(S.gender || 'm') === 'm'}">Ele/Dele</button><button data-act="gender" data-g="f" aria-pressed="${S.gender === 'f'}">Ela/Dela</button><button data-act="gender" data-g="n" aria-pressed="${S.gender === 'n'}">Neutro</button></div></div>
    </div>
  </section>
  <section class="block">
    <h2 class="h2">Água</h2>
    <div class="setbox">
      <div class="setrow"><div class="lbl"><b>Meta diária</b><span class="note">Em mL. Você pode subir ou descer quando quiser.</span></div><input id="set-goal" type="number" min="500" max="8000" step="50" value="${S.waterGoal}" data-change="set-goal" style="width:110px"></div>
      <div class="setrow"><div class="lbl"><b>Botões rápidos</b><span class="note">Os 4 volumes que aparecem para tocar (mL).</span></div><div class="row" style="gap:6px">${S.cups.map((c, i) => `<input id="set-cup${i}" type="number" min="10" max="3000" step="10" value="${c}" data-change="set-cup" data-i="${i}" style="width:76px" aria-label="Botão ${i + 1}">`).join("")}</div></div>
      <div class="setrow"><div class="lbl"><b>Acordo às</b><span class="note">Usado no ritmo de água e nos lembretes.</span></div><input id="set-wake" type="time" value="${esc(S.wake)}" data-change="set-wake"></div>
      <div class="setrow"><div class="lbl"><b>Durmo às</b></div><input id="set-sleep" type="time" value="${esc(S.sleep)}" data-change="set-sleep"></div>
    </div>
  </section>
  <section class="block">
    <h2 class="h2">Seus dados</h2>
    <div class="setbox">
      <div class="setrow"><div class="lbl"><b>Onde fica salvo</b><span class="note">${ref ? "Na sua conta Claude. Abrindo este mesmo link no celular e no PC você vê tudo igual." : "Só neste navegador. Abra o Prumo logado na sua conta Claude para sincronizar entre aparelhos."}</span></div></div>
      <div class="setrow"><div class="lbl"><b>Fazer backup</b><span class="note">Baixa um arquivo .json com tudo.</span></div><button class="btn small" data-act="export">Baixar backup</button></div>
      <div class="setrow"><div class="lbl"><b>Restaurar backup</b><span class="note">Substitui os dados atuais pelos do arquivo. Dá para desfazer logo depois.</span></div><button class="btn small" data-act="import">Escolher arquivo</button></div>
      <div class="setrow"><div class="lbl"><b>Apagar tudo</b><span class="note">Remove todas as tarefas, matérias, registros e listas.</span></div><button class="btn small danger" data-act="wipe">${wipeArmed ? "Toque de novo para confirmar" : "Apagar tudo"}</button></div>
    </div>
    <textarea id="exportbox" hidden readonly aria-label="Backup em texto"></textarea>
  </section>
  <section class="block">
    <h2 class="h2">Como usar a captura rápida</h2>
    <div class="card" style="font-size:14px">
      <span><b>Datas:</b> hoje, amanhã, depois de amanhã, segunda… domingo, 25/12, dia 15</span>
      <span><b>Horário:</b> 19h, 19h30, 19:30, às 7h, meio-dia</span>
      <span><b>Área:</b> #estudo, #dieta, #social, #geral</span>
      <span><b>Prioridade:</b> !1 alta, !2 média, !3 baixa</span>
      <span><b>Repetir:</b> todo dia, dias úteis, toda segunda, toda semana, todo mês</span>
    </div>
  </section>`;
}
