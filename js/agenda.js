/*
  Lembretes: Google Agenda por link, Samsung/Apple por arquivo .ics com alarme.
*/
"use strict";

/* ---------- agenda: Google por link, Samsung/Apple por arquivo .ics com alarme ---------- */
const CALS = { google: "Google Agenda", samsung: "Samsung Calendar", apple: "Calendário da Apple" };

function icsFor(o) {
  const p2 = pad,
    utc = d =>
      `${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}T${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}00Z`;
  const escI = s =>
    String(s || "")
      .replace(/\\/g, "\\\\")
      .replace(/([,;])/g, "\\$1")
      .replace(/\n/g, "\\n");
  const [y, m, d] = o.date.split("-").map(Number),
    L = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Prumo//PT-BR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + newId() + "@prumo",
      "DTSTAMP:" + utc(new Date())
    ];
  if (o.time) {
    const [h, mi] = o.time.split(":").map(Number);
    const s = new Date(Date.UTC(y, m - 1, d, h + 3, mi)),
      e = new Date(s.getTime() + (o.dur || 60) * 6e4);
    L.push("DTSTART:" + utc(s), "DTEND:" + utc(e));
  } else {
    const s = `${y}${p2(m)}${p2(d)}`,
      n = new Date(Date.UTC(y, m - 1, d + 1));
    L.push(
      "DTSTART;VALUE=DATE:" + s,
      "DTEND;VALUE=DATE:" + `${n.getUTCFullYear()}${p2(n.getUTCMonth() + 1)}${p2(n.getUTCDate())}`
    );
  }
  if (o.recur) L.push(o.recur);
  L.push("SUMMARY:" + escI(o.title), "DESCRIPTION:" + escI(o.details || "Criado no Prumo"));
  if (o.location) L.push("LOCATION:" + escI(o.location));
  L.push(
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + escI(o.title),
    o.time ? "TRIGGER:-PT10M" : "TRIGGER;RELATED=START:PT9H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  );
  return L.join("\r\n");
}

async function saveIcs(o) {
  const slug =
    norm(o.title)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "lembrete";
  try {
    const dl = window.claude && (await window.claude.use("downloads"));
    if (dl) {
      await dl.save({ filename: slug + ".ics", data: icsFor(o) });
      toast(
        S.calendar === "apple"
          ? "Abra o arquivo baixado para adicionar ao Calendário"
          : "Abra o arquivo baixado para adicionar ao Samsung Calendar",
        false,
        "happy"
      );
      return;
    }
  } catch (e) {
    if (e && e.code === "declined") return;
  }
  toast("Não foi possível transferir o arquivo. Configure o Google Agenda em Ajustes.", false, "worried");
}

function calLink(o, label) {
  const lb = label || "Adicionar ao " + (CALS[S.calendar] || CALS.google);
  if (S.calendar === "samsung" || S.calendar === "apple")
    return `<button class="icon cal" data-act="ics" data-ev="${esc(JSON.stringify(o))}" title="${esc(lb)}" aria-label="${esc(lb)}">${ICON.cal}</button>`;
  return `<a class="icon cal" href="${esc(gcal(o))}" target="_blank" rel="noopener" title="${esc(lb)}" aria-label="${esc(lb)}">${ICON.cal}</a>`;
}

function calBtn(o, text) {
  if (S.calendar === "samsung" || S.calendar === "apple")
    return `<button class="btn small" data-act="ics" data-ev="${esc(JSON.stringify(o))}">${esc(text)}</button>`;
  return `<a class="btn small" href="${esc(gcal(o))}" target="_blank" rel="noopener">${esc(text)}</a>`;
}
