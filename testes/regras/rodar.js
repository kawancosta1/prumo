// Testa o firestore.rules no emulador do Firebase. Roda na Action antes de publicar as regras:
// se algo aqui falhar, as regras novas não sobem (e ninguém fica trancado para fora).
// Local: cd testes/regras && npm install && npm run testar   (precisa de Java; usa o firebase.json da raiz)
const fs = require("fs");
const path = require("path");
const { initializeTestEnvironment, assertSucceeds, assertFails } = require("@firebase/rules-unit-testing");
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } = require("firebase/firestore");

const falhas = [];
let total = 0;
async function caso(nome, fn) {
  total++;
  try {
    await fn();
    console.log("  ok  " + nome);
  } catch (e) {
    falhas.push(`${nome}: ${(e && e.message) || e}`.slice(0, 300));
    console.log("  FALHOU  " + nome);
  }
}

const perfil = (nome = "Bia", usuario = "bia") => ({ nome, usuario, codigo: "ABC123", persona: "emo", equip: {}, atualizado: 1 });
const vitrine = (extra = {}) => ({
  nome: "Bia", usuario: "bia", persona: "emo", equip: {}, visto: 0, nivel: 1, visitas: 0,
  sobre: "", status: "online", comunidades: [], top8: [], depoAceitos: [], ...extra
});
const par = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`);

(async () => {
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080").split(":");
  const env = await initializeTestEnvironment({
    projectId: "demo-prumo",
    firestore: { rules: fs.readFileSync(path.join(__dirname, "../../firestore.rules"), "utf8"), host, port: +port }
  });
  const conta = (uid, verificado = true) => env.authenticatedContext(uid, { email_verified: verificado }).firestore();
  const ana = conta("ana"), bia = conta("bia"), leo = conta("leo"), semEmail = conta("zeca", false), anonimo = env.unauthenticatedContext().firestore();
  const semRegras = fn => env.withSecurityRulesDisabled(ctx => fn(ctx.firestore()));
  const amigos = (a, b) => semRegras(db => setDoc(doc(db, "amizades", par(a, b)), { uids: [a, b], de: a, estado: "aceita" }));

  console.log("\nDados pessoais");
  await caso("dono lê e grava os próprios dados", async () => {
    await assertSucceeds(setDoc(doc(ana, "usuarios/ana"), { state: { x: 1 }, updatedAt: 1 }));
    await assertSucceeds(getDoc(doc(ana, "usuarios/ana")));
  });
  await caso("ninguém lê os dados de outra pessoa", () => assertFails(getDoc(doc(bia, "usuarios/ana"))));
  await caso("email não confirmado não grava", () => assertFails(setDoc(doc(semEmail, "usuarios/zeca"), { state: {} })));
  await caso("sem login não lê nada", () => assertFails(getDoc(doc(anonimo, "usuarios/ana"))));

  console.log("\nPerfil público e @");
  await caso("perfil válido grava", () => assertSucceeds(setDoc(doc(ana, "perfis/ana"), perfil("Ana", "ana"))));
  await caso("perfil com campo extra é barrado", () => assertFails(setDoc(doc(ana, "perfis/ana"), { ...perfil(), email: "x@y" })));
  await caso("não grava perfil de outra pessoa", () => assertFails(setDoc(doc(bia, "perfis/ana"), perfil())));
  await caso("pegar @ livre para si", () => assertSucceeds(setDoc(doc(ana, "nomes/ana_123"), { uid: "ana" })));
  await caso("@ em nome de outra pessoa é barrado", () => assertFails(setDoc(doc(bia, "nomes/bia_x"), { uid: "ana" })));
  await caso("@ com letra proibida é barrado", () => assertFails(setDoc(doc(bia, "nomes/Bia!"), { uid: "bia" })));

  console.log("\nAmizade e vitrine");
  await caso("mandar pedido de amizade", () =>
    assertSucceeds(setDoc(doc(ana, "amizades", par("ana", "leo")), { uids: ["ana", "leo"], de: "ana", estado: "pendente" }))
  );
  await caso("quem mandou não aceita o próprio pedido", () => assertFails(updateDoc(doc(ana, "amizades", par("ana", "leo")), { estado: "aceita" })));
  await caso("quem recebeu aceita", () => assertSucceeds(updateDoc(doc(leo, "amizades", par("ana", "leo")), { estado: "aceita" })));
  await caso("não cria amizade já aceita", () =>
    assertFails(setDoc(doc(ana, "amizades", par("ana", "bia")), { uids: ["ana", "bia"], de: "ana", estado: "aceita" }))
  );
  await caso("vitrine válida grava", () => assertSucceeds(setDoc(doc(ana, "vitrines/ana"), vitrine({ nome: "Ana", usuario: "ana", semana: { paginas: 3 } }))));
  await caso("vitrine com pet grava", () => assertSucceeds(setDoc(doc(ana, "vitrines/ana"), vitrine({ nome: "Ana", usuario: "ana", pet: { especie: "gato", cor: "preto", nome: "Paçoca" } }))));
  await caso("vitrine com campo estranho é barrada", () => assertFails(setDoc(doc(ana, "vitrines/ana"), vitrine({ senha: "x" }))));
  await caso("amigo lê a vitrine", () => assertSucceeds(getDoc(doc(leo, "vitrines/ana"))));
  await caso("quem não é amigo não lê a vitrine", () => assertFails(getDoc(doc(bia, "vitrines/ana"))));

  console.log("\nCaixa de avisos");
  const item = (de, tipo = "recado") => ({ de, tipo, texto: "oi", visto: false, em: 1 });
  await caso("amigo manda recado", () => assertSucceeds(setDoc(doc(leo, "caixa/ana/itens/r1"), item("leo"))));
  await caso("amigo recomenda livro", () => assertSucceeds(setDoc(doc(leo, "caixa/ana/itens/r2"), item("leo", "livro"))));
  await caso("tipo desconhecido é barrado", () => assertFails(setDoc(doc(leo, "caixa/ana/itens/r3"), item("leo", "virus"))));
  await caso("quem não é amigo não manda", () => assertFails(setDoc(doc(bia, "caixa/ana/itens/r4"), item("bia"))));
  await caso("não manda em nome de outra pessoa", () => assertFails(setDoc(doc(leo, "caixa/ana/itens/r5"), item("bia"))));
  await caso("só o dono lê a caixa", async () => {
    await assertSucceeds(getDoc(doc(ana, "caixa/ana/itens/r1")));
    await assertFails(getDoc(doc(leo, "caixa/ana/itens/r1")));
  });

  console.log("\nClube do livro");
  await amigos("ana", "bia");
  const clube = { nome: "Duna", livro: { titulo: "Duna" }, membros: ["ana", "bia", "leo"], dono: "ana", criado: 1 };
  await caso("criar clube sendo dono", () => assertSucceeds(setDoc(doc(ana, "clubes/c1"), clube)));
  await caso("criar clube em nome de outro é barrado", () => assertFails(setDoc(doc(bia, "clubes/c2"), { ...clube, dono: "ana" })));
  await caso("membro lê o clube", () => assertSucceeds(getDoc(doc(bia, "clubes/c1"))));
  await caso("quem não é membro não lê", () => assertFails(getDoc(doc(conta("zé"), "clubes/c1"))));
  await caso("membro lista os próprios clubes", () =>
    assertSucceeds(getDocs(query(collection(bia, "clubes"), where("membros", "array-contains", "bia"))))
  );
  await caso("membro não tira outra pessoa", () => assertFails(updateDoc(doc(bia, "clubes/c1"), { membros: ["ana", "bia"] })));
  await caso("membro não muda o nome do clube", () => assertFails(updateDoc(doc(bia, "clubes/c1"), { nome: "Meu" })));
  await caso("membro sai do clube", () => assertSucceeds(updateDoc(doc(leo, "clubes/c1"), { membros: ["ana", "bia"] })));
  await caso("dono adiciona gente", () => assertSucceeds(updateDoc(doc(ana, "clubes/c1"), { membros: ["ana", "bia", "leo"] })));
  await caso("membro marca a própria página", () =>
    assertSucceeds(setDoc(doc(bia, "clubes/c1/membros/bia"), { pagina: 120, nome: "Bia", em: 1 }))
  );
  await caso("membro não marca página de outro", () => assertFails(setDoc(doc(bia, "clubes/c1/membros/ana"), { pagina: 1, nome: "Ana", em: 1 })));
  await caso("membro comenta", () =>
    assertSucceeds(setDoc(doc(bia, "clubes/c1/comentarios/k1"), { de: "bia", deNome: "Bia", pagina: 60, texto: "Que livro!", em: 1 }))
  );
  await caso("comentário longo demais é barrado", () =>
    assertFails(setDoc(doc(bia, "clubes/c1/comentarios/k2"), { de: "bia", deNome: "Bia", pagina: 60, texto: "x".repeat(501), em: 1 }))
  );
  await caso("não apaga comentário dos outros", () => assertFails(deleteDoc(doc(leo, "clubes/c1/comentarios/k1"))));
  await caso("só o dono apaga o clube", async () => {
    await assertFails(deleteDoc(doc(bia, "clubes/c1")));
    await assertSucceeds(deleteDoc(doc(ana, "clubes/c1")));
  });

  console.log("\nRelato de erro e lembretes");
  const erro = { msg: "TypeError: x is undefined", onde: "js/hoje.js:10", versao: "abc", em: 1, navegador: "Chrome" };
  await caso("logado manda relato de erro", () => assertSucceeds(setDoc(doc(ana, "erros/e1"), erro)));
  await caso("relato com campo estranho é barrado", () => assertFails(setDoc(doc(ana, "erros/e2"), { ...erro, extra: 1 })));
  await caso("ninguém lê os relatos pelo app", () => assertFails(getDoc(doc(ana, "erros/e1"))));
  const lembretes = { tokens: ["t1"], itens: [{ em: 1, titulo: "Água", corpo: "Beba" }], fuso: "America/Sao_Paulo", atualizado: 1 };
  await caso("dono grava os próprios lembretes", () => assertSucceeds(setDoc(doc(ana, "lembretes/ana"), lembretes)));
  await caso("ninguém grava lembretes de outro", () => assertFails(setDoc(doc(bia, "lembretes/ana"), lembretes)));
  await caso("ninguém lê lembretes de outro", () => assertFails(getDoc(doc(bia, "lembretes/ana"))));

  console.log("\nResto fechado");
  await caso("coleção não listada é fechada", () => assertFails(setDoc(doc(ana, "qualquer/coisa"), { a: 1 })));

  await env.cleanup();
  console.log(falhas.length ? `\n${falhas.length} de ${total} falharam.` : `\nRegras: ${total} casos certos.`);
  if (falhas.length) {
    console.log("::error title=Regras do Firestore::" + falhas.join("%0A"));
    process.exit(1);
  }
  process.exit(0);
})().catch(e => {
  console.log("::error title=Regras do Firestore::" + String((e && e.stack) || e).replace(/\n/g, "%0A"));
  process.exit(1);
});
