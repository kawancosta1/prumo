// Teste: Sincronia e preservação da personalidade
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { ev, erros, ok, fechar } = await abrir(url);
  try {
    ev(`S.persona = "feiticeiro"; S.onboarded = true; S.semConta = true; commit();`);
    const p1 = ev("S.persona");
    ok(p1 === "feiticeiro", "personalidade definida como feiticeiro");

    const norm = ev(`normalize({ persona: "feiticeiro", stats: {} }).persona`);
    ok(norm === "feiticeiro", "normalize preserva personalidade feiticeiro");
  } finally {
    fechar();
  }
  return erros;
};
