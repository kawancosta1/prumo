/*
  Service worker do Prumo: guarda o app no aparelho para abrir rápido e funcionar sem internet.
  - Página (index.html): tenta a internet primeiro; sem internet, usa a cópia guardada.
  - Arquivos do app (js, css, ícones, fontes): usa a cópia guardada e atualiza por trás.
  - Firebase e APIs de livros: passam direto, nunca ficam guardados aqui.
  Para forçar todo mundo a baixar de novo, troque a VERSAO.
*/
const VERSAO = "prumo-v2";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icones/icone-192.png"])));
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
    e.respondWith(
      fetch(req)
        .then(r => {
          const copia = r.clone();
          caches.open(VERSAO).then(c => c.put("./index.html", copia));
          return r;
        })
        .catch(() => caches.match("./index.html"))
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

// Tocar na notificação abre (ou traz pra frente) o Prumo
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(janelas => {
      const aberta = janelas.find(j => "focus" in j);
      if (aberta) return aberta.focus();
      return self.clients.openWindow("./#avisos");
    })
  );
});
