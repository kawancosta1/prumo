// Testes Novas Melhorias Gerais: Lote 15 (Itens 141 a 150)
const { abrir } = require("./ambiente");

module.exports = async url => {
  const { w, ev, erros, ok, espera, fechar } = await abrir(url);
  const D = w.document;

  ev(`
    S.onboarded = true;
    S.semConta = true;
    tab = "hoje";
    commit();
    render();
  `);
  await espera(30);

  // 141. Nível de afeto e amizade acumulada com o mascote Prumi
  const res141 = ev(`
    (() => {
      const aInic = calcularNivelAmizadePrumi(2, 5);
      const aTop = calcularNivelAmizadePrumi(60, 50);
      return aInic.nivel === 1 && aTop.nivel === 4 && aTop.titulo === "Melhores Amigos";
    })()
  `);
  ok(res141, "141. calcularNivelAmizadePrumi escalou afeto por assiduidade e carinhos");

  // 142. Falas personalizadas e afetuosas por nível de amizade
  const res142 = ev(`
    (() => {
      const f1 = obterFalasPorNivelAmizade(1);
      const f4 = obterFalasPorNivelAmizade(4);
      return typeof f1 === "string" && f1 !== f4 && f4.includes("dupla");
    })()
  `);
  ok(res142, "142. obterFalasPorNivelAmizade forneceu falas mais íntimas nos níveis altos");

  // 143. Micro-movimentos e animações dos Pets companheiros
  const res143 = ev(`
    (() => {
      const aM = gerarAnimacaoPetCompanheiro("morcego");
      const aG = gerarAnimacaoPetCompanheiro("gato");
      return aM.classe.includes("flutuando") && aG.classe.includes("cauda");
    })()
  `);
  ok(res143, "143. gerarAnimacaoPetCompanheiro mapeou micro-movimentos dos pets");

  // 144. Desbloqueio e verificação de conquistas secretas/ocultas
  const res144 = ev(`
    (() => {
      const d1 = verificarConquistasSecretas({ horaFechamento: 3 });
      return d1.length === 1 && d1[0].id === "coruja_madrugada" && d1[0].segredo === true;
    })()
  `);
  ok(res144, "144. verificarConquistasSecretas destravou conquistas ocultas por gatilhos raros");

  // 145. Cálculo do valor de revenda de roupas usadas (50% do preço)
  const res145 = ev(`
    (() => {
      const v = calcularValorRevendaItem(80);
      return v === 40;
    })()
  `);
  ok(res145, "145. calcularValorRevendaItem retornou 50% de cashback em gotas");

  // 146. Álbum de lembranças comemorativas de metas batidas
  const res146 = ev(`
    (() => {
      const p = gerarAlbumLembrancasMeta("meta_agua", "2026-10-27");
      return p.formato === "polaroid-vintage" && p.salvo === true;
    })()
  `);
  ok(res146, "146. gerarAlbumLembrancasMeta gravou card polaroid comemorativo");

  // 147. Detecção automática de épocas e temas sazonais no calendário
  const res147 = ev(`
    (() => {
      const tOut = obterTemaSazonalData("2026-10-25");
      const tDez = obterTemaSazonalData("2026-12-20");
      return tOut.evento === "halloween" && tDez.evento === "natal";
    })()
  `);
  ok(res147, "147. obterTemaSazonalData detectou festividades e eventos sazonais");

  // 148. Metas de desafios comunitários semanais temáticos
  const res148 = ev(`
    (() => {
      const d = gerarDesafioComunitarioSemanal("sem_3");
      return d.objetivoLitrosTotal === 20 && d.recompensaGotas === 100;
    })()
  `);
  ok(res148, "148. gerarDesafioComunitarioSemanal estruturou desafio coletivo com meta e bônus");

  // 149. Evolução e detalhes estéticos extras no corpo do Prumi por nível
  const res149 = ev(`
    (() => {
      const e1 = calcularEvolucaoVisualMascote(5);
      const e50 = calcularEvolucaoVisualMascote(55);
      return e1.aura === "nenhuma" && e50.aura.includes("dourada");
    })()
  `);
  ok(res149, "149. calcularEvolucaoVisualMascote concedeu auras e detalhes em níveis avançados");

  // 150. Configuração de fala audível do Prumi via SpeechSynthesis
  const res150 = ev(`
    (() => {
      return typeof gerarSinteseVozMascote === "function";
    })()
  `);
  ok(res150, "150. gerarSinteseVozMascote disponível para síntese de voz nativa fofa");

  await fechar();
  return erros;
};
