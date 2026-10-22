/*
  Configuração do Firebase (Console do Firebase → Configurações do projeto → Seus apps → app Web).
  Enquanto for null, o Prumo funciona só no aparelho, como sempre.
  Essa configuração não é senha: ela fica pública no site. Quem protege os dados são as regras
  do Firestore (arquivo firestore.rules na raiz do repositório).
*/
"use strict";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBBS4UyTDoBQmqF8B3udSRWCW99eioJOKI",
  authDomain: "prumo-66d76.firebaseapp.com",
  projectId: "prumo-66d76",
  storageBucket: "prumo-66d76.firebasestorage.app",
  messagingSenderId: "240385413893",
  appId: "1:240385413893:web:fcbe9d887c0063a0f25d6c"
};

/*
  App Check (proteção contra robôs usando o seu Firebase). Desligado enquanto for null.
  Para ligar: Console do Firebase → App Check → registrar o app Web com reCAPTCHA v3,
  colar aqui a "chave do site" e, depois de uns dias funcionando, clicar em "Aplicar" no Firestore.
*/
const FIREBASE_APPCHECK_CHAVE = null;
