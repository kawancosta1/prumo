/*
  Service worker do Prumo: guarda o app no aparelho para abrir rápido e funcionar sem internet.
  - Página (index.html): tenta a internet primeiro; sem internet, usa a cópia guardada.
  - Código do app (js, css): tenta a internet primeiro; sem internet, usa a cópia guardada.
  - Ícones e fontes: usa a cópia guardada e atualiza por trás.
  - Firebase e APIs de livros: passam direto, nunca ficam guardados aqui.
  Na publicação (Firebase), a Action troca CARIMBO pelo código do commit e põe ?v=<commit> em todo js e css.
  Com isso:
  - Na instalação, o app inteiro (todos os js e css que o index.html usa) fica guardado de uma vez:
    da segunda visita em diante abre na hora, mesmo sem internet.
  - js e css com o carimbo vêm direto da cópia guardada (cada publicação tem endereços novos, nunca mistura versão).
  - Cada publicação nova apaga as cópias da anterior.
  Sem carimbo (GitHub Pages antigo, testes), continua tudo como antes: internet primeiro.
*/
const CARIMBO = "DEV";
const VERSAO = "prumo-v9-" + CARIMBO;
const COM_CARIMBO = CARIMBO !== "DEV";

/** Todos os js e css que o index.html carrega (lidos do próprio index, então nunca fica lista velha). */
async function arquivosDoApp() {
  const r = await fetch("./index.html", { cache: "no-store" });
  const html = await r.text();
  if (!r.ok) throw new Error("sem index");
  const lista = [...html.matchAll(/(?:src|href)="((?:js|estilos)\/[^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)].map(m => "./" + m[1]);
  return { lista: [...new Set(lista)] };
}

self.addEventListener("install", e => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(VERSAO);
      await c.addAll(["./manifest.webmanifest", "./icones/icone-192.png"]);
      try {
        const { lista } = await arquivosDoApp();
        await c.addAll(["./index.html", ...(COM_CARIMBO ? lista : [])]);
      } catch (e) {
        await c.addAll(["./index.html"]).catch(() => {});
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches
      .keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

const guardavel = url =>
  url.origin === self.location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || /cdnjs\.cloudflare\.com$/.test(url.hostname);

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!guardavel(url)) return; // Firebase, Google Books, Open Library: direto pra internet

  if (req.mode === "navigate") {
    // o app (raiz ou index.html) fica guardado como ./index.html; outras páginas (ex.: privacidade.html) com o próprio endereço
    const ehApp = /\/(index\.html)?$/.test(url.pathname);
    const chave = ehApp ? "./index.html" : url.pathname;
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(VERSAO).then(c => c.put(chave, copia));
          }
          return r;
        })
        .catch(() => caches.match(chave).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Código do app com carimbo: a cópia guardada vale (o endereço muda a cada publicação).
  if (COM_CARIMBO && url.origin === self.location.origin && /\.(js|css)$/.test(url.pathname) && url.searchParams.get("v") === CARIMBO) {
    e.respondWith(
      caches.match(req).then(
        guardado =>
          guardado ||
          fetch(req).then(r => {
            if (r.ok) {
              const copia = r.clone();
              caches.open(VERSAO).then(c => c.put(req, copia));
            }
            return r;
          })
      )
    );
    return;
  }

  // Código do app (js e css): internet primeiro, para nunca misturar versão nova com velha depois de um envio.
  // Sem internet, usa a cópia guardada (ignorando o ?v=, que muda a cada versão).
  if (url.origin === self.location.origin && /\.(js|css)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(VERSAO).then(c => c.put(req, copia));
          }
          return r;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(guardado => {
      const daRede = fetch(req)
        .then(r => {
          if (r.ok || r.type === "opaque") {
            const copia = r.clone();
            caches.open(VERSAO).then(c => c.put(req, copia));
          }
          return r;
        })
        .catch(() => guardado);
      return guardado || daRede;
    })
  );
});

// Lembrete com o app fechado (Firebase Cloud Messaging, mandado pela Action agendada).
// Com o Prumo aberto na tela, passa para a página mostrar o banner com som; senão, notificação do sistema.
self.addEventListener("push", e => {
  let p = {};
  try {
    p = e.data ? e.data.json() : {};
  } catch (erro) {}
  const d = p.data || p.notification || p;
  const titulo = String(d.titulo || d.title || "Prumo").slice(0, 80);
  const corpo = String(d.corpo || d.body || "").slice(0, 200);
  const aba = /^[a-z]{2,12}$/.test(d.aba || "") ? d.aba : "hoje";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(janelas => {
      const visivel = janelas.find(j => j.visibilityState === "visible");
      if (visivel) return visivel.postMessage({ tipo: "lembrete", titulo, corpo, aba });
      return self.registration.showNotification(titulo, {
        body: corpo,
        icon: "icones/icone-192.png",
        badge: "icones/icone-192.png",
        tag: String(d.tag || "prumo").slice(0, 60),
        renotify: true,
        vibrate: [20, 80, 20],
        data: { aba }
      });
    })
  );
});

// Tocar na notificação abre (ou traz pra frente) o Prumo, na aba certa
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const aba = (e.notification.data && e.notification.data.aba) || "avisos";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(janelas => {
      const aberta = janelas.find(j => "focus" in j);
      if (aberta) {
        if ("navigate" in aberta) aberta.navigate("./#" + aba).catch(() => {});
        return aberta.focus();
      }
      return self.clients.openWindow("./#" + aba);
    })
  );
});
