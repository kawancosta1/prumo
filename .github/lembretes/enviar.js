// Carteiro dos lembretes: lê lembretes/{uid} no Firestore, manda o que venceu e marca como enviado.
// Roda na Action agendada (a cada 10 minutos). O repositório é público, então o log mostra só números,
// nunca texto de lembrete, nome ou código de aparelho.
const admin = require("firebase-admin");

const ATRASO_MAX = 45 * 60e3; // lembrete que venceu há mais que isso não vai mais (ficou velho)
const POR_PESSOA = 4; // no máximo por rodada, para não virar enxurrada depois de um atraso
const TOKEN_INVALIDO = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument"
]);

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "prumo-66d76" });
const db = admin.firestore();
const fcm = admin.messaging();

(async () => {
  const agora = Date.now();
  const docs = await db.collection("lembretes").get();
  let pessoas = 0,
    enviados = 0,
    falhas = 0,
    tokensRemovidos = 0;
  for (const doc of docs.docs) {
    const d = doc.data();
    let tokens = (Array.isArray(d.tokens) ? d.tokens : []).filter(
      t => typeof t === "string" && t.length > 20
    );
    if (!tokens.length) continue;
    const ja = d.enviados && typeof d.enviados === "object" ? { ...d.enviados } : {};
    const vencidos = (Array.isArray(d.itens) ? d.itens : [])
      .filter(i => i && typeof i.em === "number" && typeof i.tag === "string")
      .filter(i => i.em <= agora && i.em > agora - ATRASO_MAX && !ja[i.tag])
      .sort((a, b) => b.em - a.em);
    if (!vencidos.length) continue;
    pessoas++;
    // água atrasada acumulada: manda só a mais recente; tarefas, hábitos e provas vão cada um
    const agua = vencidos.find(i => i.tag.startsWith("agua-"));
    const mandar = [...(agua ? [agua] : []), ...vencidos.filter(i => !i.tag.startsWith("agua-"))].slice(
      0,
      POR_PESSOA
    );
    const invalidos = new Set();
    for (const i of mandar) {
      const r = await fcm.sendEachForMulticast({
        tokens,
        data: {
          titulo: String(i.titulo || "Prumo").slice(0, 80),
          corpo: String(i.corpo || "").slice(0, 200),
          tag: i.tag.slice(0, 60),
          aba: String(i.aba || "hoje").slice(0, 12)
        },
        webpush: { headers: { Urgency: "high", TTL: "2700" } }
      });
      enviados += r.successCount;
      falhas += r.failureCount;
      r.responses.forEach((resp, k) => {
        if (!resp.success && resp.error && TOKEN_INVALIDO.has(resp.error.code)) invalidos.add(tokens[k]);
      });
    }
    // marca todos os vencidos (inclusive os que foram juntados) e esquece marcas de mais de 3 dias
    for (const i of vencidos) ja[i.tag] = agora;
    for (const [tag, quando] of Object.entries(ja)) if (agora - quando > 3 * 864e5) delete ja[tag];
    tokensRemovidos += invalidos.size;
    tokens = tokens.filter(t => !invalidos.has(t));
    await doc.ref.update({ enviados: ja, tokens });
  }
  console.log(
    `Carteiro: ${docs.size} inscritos, ${pessoas} com lembrete agora, ${enviados} entregues, ${falhas} falhas, ${tokensRemovidos} aparelhos antigos removidos.`
  );
})().catch(e => {
  // sem permissão ainda (papéis não configurados): avisa sem quebrar a cada 10 minutos
  if (e && (e.code === 7 || /PERMISSION_DENIED|permission/i.test(String(e.message)))) {
    console.log(
      "::warning title=Carteiro dos lembretes::A chave ainda não tem permissão de ler o Firestore ou mandar notificações."
    );
    process.exit(0);
  }
  console.log("::error title=Carteiro dos lembretes::" + String((e && e.message) || e).slice(0, 300));
  process.exit(1);
});
