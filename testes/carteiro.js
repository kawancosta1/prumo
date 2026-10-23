// Carteiro dos lembretes (.github/lembretes/enviar.js) com um Firebase de mentira
const Module = require("module");
const path = require("path");
module.exports = () => new Promise(fim => {
const erros = [];
const agora = Date.now();
const docs = [
  { id: "u1", data: { tokens: ["tokenvalido-aaaaaaaaaaaaaaaaaaaaaa", "tokenmorto-bbbbbbbbbbbbbbbbbbbbbbbb"], itens: [
    { em: agora - 25 * 60e3, titulo: "Hora da água", corpo: "x", tag: "agua-a", aba: "dieta" },
    { em: agora - 5 * 60e3, titulo: "Hora da água", corpo: "y", tag: "agua-b", aba: "dieta" },
    { em: agora - 2 * 60e3, titulo: "Tarefa agora", corpo: "Estudar", tag: "tarefa-1-d", aba: "hoje" },
    { em: agora + 60e3, titulo: "futuro", corpo: "", tag: "tarefa-2-d" },
    { em: agora - 2 * 3600e3, titulo: "velho", corpo: "", tag: "agua-velho" } ], enviados: { "tarefa-9": agora - 5 * 864e5 } } },
  { id: "u2", data: { tokens: [], itens: [{ em: agora - 1000, tag: "agua-z", titulo: "a" }] } }
];
const mandados = [], updates = [];
const fake = {
  initializeApp() {}, credential: { applicationDefault: () => ({}) },
  firestore: () => ({ collection: () => ({ get: async () => ({ size: docs.length, docs: docs.map(d => ({ data: () => d.data, ref: { update: async u => updates.push([d.id, u]) } })) }) }) }),
  messaging: () => ({ sendEachForMulticast: async m => { mandados.push(m); return { successCount: 1, failureCount: 1, responses: [{ success: true }, { success: false, error: { code: "messaging/registration-token-not-registered" } }] }; } })
};
const orig = Module._load;
Module._load = function (req, ...a) { return req === "firebase-admin" ? fake : orig.call(this, req, ...a); };
require(path.join(__dirname, "../.github/lembretes/enviar.js"));
setTimeout(() => {
  const tags = mandados.map(m => m.data.tag);
  const ok = (c, m) => (c ? console.log("  ok  " + m) : erros.push("FALHOU: " + m));
  ok(JSON.stringify(tags) === JSON.stringify(["agua-b", "tarefa-1-d"]), "manda só a água mais recente e a tarefa vencida: " + tags);
  const u = updates.find(x => x[0] === "u1")[1];
  ok(u.enviados["agua-a"] && u.enviados["agua-b"] && u.enviados["tarefa-1-d"] && !u.enviados["tarefa-2-d"] && !u.enviados["tarefa-9"], "marca enviados e esquece os antigos");
  ok(u.tokens.length === 1 && u.tokens[0].startsWith("tokenvalido"), "remove aparelho que não existe mais");
  ok(!updates.find(x => x[0] === "u2"), "sem aparelho, não mexe");
  Module._load = orig;
  fim(erros);
}, 300);
});
