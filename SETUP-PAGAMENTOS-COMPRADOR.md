# 💳 Configuração de Pagamentos para o Novo Proprietário (Turnkey Setup)

Este guia é exclusivo para quem adquiriu o **Prumo**. Em menos de **5 minutos**, todo o faturamento por Pix (Mercado Pago) e Cartão/Apple Pay internacional (Stripe) passará a cair **diretamente na sua conta bancária**.

---

## 1. Como Funciona a Rotação de Receita
O código do Prumo foi construído dentro das melhores práticas de segurança de M&A da nuvem Google (Google Secret Manager). 
- **Nenhuma chave ou conta bancária antiga está embutida no código-fonte.**
- Você só precisa injetar as **suas chaves** nos segredos do Firebase.

---

## 2. Passo a Passo: Mercado Pago (Pix Automático no Brasil)

1. Acesse o portal de desenvolvedores do Mercado Pago com sua conta:
   👉 [https://www.mercadopago.com.br/developers/panel](https://www.mercadopago.com.br/developers/panel)
2. Crie uma aplicação (ou use uma existente) e acesse **Credenciais de Produção**.
3. Copie o seu **Access Token** (começa com `APP_USR-...`).
4. (Opcional para webhooks) Copie a **Chave Secreta de Webhook** (Webhook Secret).
5. No terminal da sua máquina, dentro da pasta do projeto, execute:
   ```bash
   firebase functions:secrets:set MP_ACCESS_TOKEN
   # Cole o seu Access Token quando solicitado

   firebase functions:secrets:set MP_WEBHOOK_SECRET
   # Cole a chave de assinatura de webhook (ou uma string aleatória se for testar)
   ```

---

## 3. Passo a Passo: Stripe (Faturamento Global em Dólar / Cartões)

1. Acesse o painel da sua conta Stripe:
   👉 [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copie a sua **Secret key** (começa com `sk_live_...` ou `sk_test_...`).
3. Em *Developers -> Webhooks*, adicione um endpoint apontando para a sua Cloud Function:
   `https://southamerica-east1-<SEU-PROJETO>.cloudfunctions.net/webhookStripe`
4. Copie o **Signing secret** do webhook (`whsec_...`).
5. No terminal, execute:
   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY
   # Cole sua Secret Key

   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Cole o Signing secret do Webhook
   ```

---

## 4. Publicando a Troca (Deploy em 30 segundos)

Após definir as chaves acima, execute o deploy das funções:
```bash
firebase deploy --only functions
```

✅ **Pronto!**
A partir deste momento:
- Qualquer usuário que assinar o Prumo PRO via Pix terá o valor creditado instantaneamente na **sua conta do Mercado Pago**.
- Qualquer usuário internacional que assinar em Dólar/Euro terá o valor creditado na **sua conta Stripe**.
- A liberação do plano PRO, geração de relatórios e ativação dos 17 mundos e pets no app acontecem 100% de forma automatizada pelo servidor.
