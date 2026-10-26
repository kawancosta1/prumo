// Testes Feiticeiro: Lote 5 (Itens 41 a 50)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    setPersona("feiticeiro");
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 41. Som de varinha ao abrir
  ok(ev("typeof somVarinhaAbrir === 'function'"), "41. Função somVarinhaAbrir definida");
  ok(ev("typeof SONS_MUNDO.feiticeiro.abrir === 'function'"), "41. Som de abertura registrado");

  // 42. Gongo místico
  ok(ev("typeof somGongoMistico === 'function'"), "42. Função somGongoMistico definida");

  // 43. Conquistas do mundo
  ok(ev("ACHS_FEITICEIRO.length === 3"), "43. Três conquistas próprias do Feiticeiro definidas");
  ev(`
    const d = dadosFeit();
    d.ceu.mapa = [0];
    commit();
    checarConquistasFeiticeiro();
  `);
  ok(
    ev("dadosFeit().conquistas.includes('feit_primeira_constelacao')"),
    "43. Conquista de primeira constelação desbloqueada"
  );

  // 44. Varinhas colecionáveis
  const varinha = ev("forjarVarinhaFeiticeiro()");
  ok(
    varinha && varinha.madeira && varinha.nucleo,
    "44. Varinha mágica forjada com combinação de madeira e núcleo"
  );
  ok(ev("dadosFeit().varinhasColecao.length >= 1"), "44. Varinha guardada na coleção do mago");

  // 45. Roupas lendárias
  const itemIds = ev("ITEMS.map(i => i.id)");
  ok(itemIds.includes("feit_manto_galaxia"), "45. Roupa lendária feit_manto_galaxia presente");
  ok(itemIds.includes("feit_coroa_cometas"), "45. Roupa lendária feit_coroa_cometas presente");

  // 46. Cartões de constelação no perfil
  const cartoes = ev("cartoesConstelacaoPerfil()");
  ok(cartoes && cartoes.length >= 1 && cartoes[0].nome, "46. Cartões de constelação gerados para o perfil");

  // 47. Duelo amistoso
  const duelo = ev("dueloAmistosoFeiticeiro('Merlin')");
  ok(duelo && duelo.amigo === "Merlin" && duelo.vencedor, "47. Duelo amistoso com amigo avaliado");

  // 48. Biblioteca compartilhada
  const biblioHtml = ev("bibliotecaCompartilhadaHTML()");
  ok(biblioHtml.includes("feit-biblio-compartilhada"), "48. HTML da biblioteca compartilhada gerado");

  // 49. Coruja-correio animada
  ev("animarCorujaCorreio()");
  ok(D.querySelector(".feit-coruja-correio"), "49. Elemento da coruja-correio renderizado na tela");

  // 50. Pet truque levitar
  ev(`
    const petBox = document.createElement("div");
    petBox.className = "pet-box";
    document.body.appendChild(petBox);
    truquePetLevitar();
  `);
  ok(D.querySelector(".feit-pet-levitando"), "50. Classe de levitação aplicada ao pet");

  fechar();
  return erros;
};
