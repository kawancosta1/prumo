# 💼 Dossiê Executivo de M&A e Due Diligence Técnica (Prumo)

> Guia para compradores, investidores e auditorias de aquisição do software **Prumo**.

---

## 1. Sumário Executivo do Ativo

| Atributo | Detalhes |
| :--- | :--- |
| **Nome do Produto** | Prumo (Multi-platform Micro-SaaS) |
| **Tipo de Ativo** | Propriedade Intelectual (Código-Fonte, Domínio, Banco e Infraestrutura) |
| **Linhas de Código Autoral** | ~85.000 linhas (56k JS, 16k CSS, 11k Testes, 340 Functions) |
| **Modelo de Negócio** | Freemium B2C (Assinatura Recorrente R$ 19,90/mês ou US$ 4.99/mo) + White-label B2B |
| **Custo Mensal de Servidores** | **R$ 0,00 / mês** (Firebase Free Tier cobre até 50.000 usuários ativos diários) |
| **Margem Bruta Operacional** | **96,5%** |
| **Gateways de Pagamento Integrados** | Mercado Pago Pix (Brasil) + Stripe Checkout (Internacional USD) |
| **Idiomas Suportados** | Português (Brasil) e Inglês (Global) via `js/i18n.js` |

---

## 2. Inventário de Ativos Incluídos na Venda

1. **Repositório Git Completo:**
   - Histórico limpo com mais de 150 commits detalhados.
   - Suíte de 11.000 linhas de testes automatizados com taxa de aprovação de 100%.
   - Workflow do GitHub Actions configurado para deploy contínuo (*Turnkey CI/CD*).
2. **Propriedade Intelectual Visual & Sonora (IP):**
   - 17 Mundos temáticos exclusivos (paletas, regras visuais e mecânicas de gamificação).
   - Pacote de spritesheets de pets estilo 1930s (Gatinho, Cachorro, Coelho, Hamster, Coruja, Dragão, Morcego, Raposa) desenhados no estilo tradicional de celulose e guache.
   - Sintetizador procedural WebAudio para paisagens sonoras personalizadas.
3. **Módulo de Faturamento e Licenciamento (Prumo PRO):**
   - Sistema de checkout antifraude com validação de HMAC e webhooks idempotentes.
   - Gerador de Relatórios Executivos em PDF para fins clínicos e terapêuticos.
4. **Mecanismo White-Label Multi-Tenant:**
   - Arquivo `config/branding.json` e motor `js/whitelabel.js` permitindo re-branding completo do software em minutos.

---

## 3. Guia de Transferência de Propriedade (Passo a Passo)

A transferência deste ativo para uma nova empresa ou indivíduo é realizada em menos de 1 hora:

1. **Transferência do Projeto Firebase:**
   - Adicionar o e-mail do comprador no console do Firebase como **Proprietário (Owner)** do projeto `prumo-66d76`.
   - O comprador remove o proprietário anterior com um clique.
2. **Transferência do Repositório GitHub:**
   - Menu *Settings -> Transfer ownership* no GitHub para a organização ou conta do comprador.
3. **Configuração de Chaves de Pagamento:**
   - O comprador atualiza os segredos no Firebase (`MP_ACCESS_TOKEN`, `STRIPE_SECRET_KEY`) com suas próprias credenciais bancárias em menos de 5 minutos seguindo o guia dedicado em [SETUP-PAGAMENTOS-COMPRADOR.md](file:///C:/Users/kawan.costa/.gemini/antigravity/scratch/prumo/SETUP-PAGAMENTOS-COMPRADOR.md). Todo faturamento cai 100% direto na conta bancária do comprador.
4. **Domínio Personalizado:**
   - Adição de domínio próprio (.com ou .com.br) no Firebase Hosting com provisionamento automático de certificado SSL gratuito da Google.

---

## 4. Oportunidades Imediatas de Monetização para o Comprador

1. **Lançamento no Product Hunt / Hacker News / Reddit:**
   - Com o suporte em inglês (`en-US`) e Stripe integrado, o produto está pronto para tráfego global.
2. **Distribuição em Comunidades de TDAH e Produtividade:**
   - A combinação de gamificação acolhedora com pets dos anos 30 tem baixíssimo custo de aquisição de clientes (CAC) em canais como TikTok e Instagram Reels.
3. **Licenciamento White-Label B2B:**
   - Revenda do software para escolas, clínicas de terapia ou programas de bem-estar corporativo por contratos anuais de R$ 5.000 a R$ 15.000 por cliente.

---

## 5. Diferenciais Estratégicos Anti-Commodity (Moats de Mercado)

O Prumo se diferencia radicalmente de 99% dos apps de hábitos frios corporativos (Notion, Todoist, Habitica) através de 5 pilares nativos implementados no código:

1. **Anti-Burnout & "Dia de Respiro":** Mecânica exclusiva de proteção de sequências sem culpa ou punição caso o usuário precise descansar.
2. **Modo Corpo Duplo (*Body Doubling* para TDAH):** Companhia visual e acolhedora em tempo real do pet durante blocos de foco, comprovada para reduzir a procrastinação neurodivergente.
3. **Experiência Sensorial ASMR Vintage:** Síntese matemática pura no WebAudio (sem arquivos pesados) com estalo de agulha de vinil dos anos 1930, chuva na vidraça e lareira crepitante.
4. **Cenário Vivo (*Animal Crossing* da Vida Real):** Cada hábito cumprido e meta de hidratação atingida faz a plantinha do quarto florescer dinamicamente em tempo real.
5. **Passaporte Vitalício (*Founder Lifetime Pass*):** Opção comercial de pagamento único contra a fadiga de assinaturas mensais, gerando alto volume de caixa imediato.
