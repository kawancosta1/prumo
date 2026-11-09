/*
  Motor NLU (Natural Language Understanding) de Captura Rápida de Tarefas do Prumo.
  Entende frases naturais variadas como:
  - "vu estudar calcula amanha umas 16:00 durante 1 hora e meia"
  - "preciso fazer lista de fisica sexta que vem das 14h as 16h urgente"
  - "me lembra de treinar perna depois de amanha 4 e meia da tarde por 45 min"
  - "estudar amanhã 19h #estudo !1"
*/
"use strict";

/* ================= captura rápida (linguagem natural) ================= */
const WD = {
  segunda: 0,
  seg: 0,
  terca: 1,
  ter: 1,
  quarta: 2,
  qua: 2,
  quinta: 3,
  qui: 3,
  sexta: 4,
  sex: 4,
  sabado: 5,
  sab: 5,
  domingo: 6,
  dom: 6
};

const WD_RE = "(segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo|seg|ter|qua|qui|sex|s[áa]b|dom)";

const B = "(?<![\\p{L}\\d])",
  E = "(?![\\p{L}\\d])";

function nextWd(i, base, forceNextWeek = false) {
  const b = base || today();
  let diff = (i - wIdx(b) + 7) % 7;
  if (forceNextWeek && diff === 0) diff = 7;
  return addDays(b, diff);
}

const NUM_EXTENSO = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  três: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  quinze: 15,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50
};

const MESES_MAP = {
  janeiro: 1,
  jan: 1,
  fevereiro: 2,
  fev: 2,
  marco: 3,
  março: 3,
  mar: 3,
  abril: 4,
  abr: 4,
  maio: 5,
  mai: 5,
  junho: 6,
  jun: 6,
  julho: 7,
  jul: 7,
  agosto: 8,
  ago: 8,
  setembro: 9,
  set: 9,
  outubro: 10,
  out: 10,
  novembro: 11,
  nov: 11,
  dezembro: 12,
  dez: 12
};

function numDeToken(tok) {
  if (!tok) return NaN;
  const limpo = norm(String(tok).trim());
  if (limpo in NUM_EXTENSO) return NUM_EXTENSO[limpo];
  const n = parseInt(limpo, 10);
  return Number.isNaN(n) ? NaN : n;
}

function ajustarHoraPeriodo(h, periodo) {
  if (!periodo) return h;
  const p = norm(periodo);
  if ((p.includes("tarde") || p.includes("noite")) && h >= 1 && h <= 11) return h + 12;
  if (p.includes("madrugada") && h === 12) return 0;
  return h;
}

// Dicionário de correção ortográfica de termos frequentes em tarefas e matérias
const CORRECOES_TERMOS = [
  [/\b(calcula|calculo|caklculo|cauculo|caucúlo)\b/gi, "Cálculo"],
  [/\b(fisica|fízica)\b/gi, "Física"],
  [/\b(quimica|kímica)\b/gi, "Química"],
  [/\b(matematica|matematíca)\b/gi, "Matemática"],
  [/\b(biologia)\b/gi, "Biologia"],
  [/\b(historia|estoria)\b/gi, "História"],
  [/\b(geografia)\b/gi, "Geografia"],
  [/\b(portugues|portuges)\b/gi, "Português"],
  [/\b(ingles|inglês)\b/gi, "Inglês"],
  [/\b(programacao|programacão)\b/gi, "Programação"],
  [/\b(estatistica)\b/gi, "Estatística"],
  [/\b(redacao|redacão)\b/gi, "Redação"],
  [/\b(filosofia)\b/gi, "Filosofia"],
  [/\b(sociologia)\b/gi, "Sociologia"],
  [/\b(anatomia)\b/gi, "Anatomia"],
  [/\b(exercicios|exercicos|exercios)\b/gi, "exercícios"],
  [/\b(exercicio|exercico)\b/gi, "exercício"],
  [/\b(revisao|revizao|revizão)\b/gi, "revisão"],
  [/\b(reuniao|reunião)\b/gi, "reunião"],
  [/\b(medico|médico)\b/gi, "médico"],
  [/\b(remedio|remédio)\b/gi, "remédio"],
  [/\b(almoco|almoço)\b/gi, "almoço"],
  [/\b(aniversario|aniversário)\b/gi, "aniversário"],
  [/\b(capitulos)\b/gi, "capítulos"],
  [/\b(capitulo)\b/gi, "capítulo"],
  [/\b(paginas)\b/gi, "páginas"],
  [/\b(questoes)\b/gi, "questões"]
];

const CORRECOES_VERBOS_INICIO = [
  [/^(estuda|estdar|estduar|esudar)\b/i, "Estudar"],
  [/^(revisa|revizar|revisr)\b/i, "Revisar"],
  [/^(faze|faser|fzr)\b/i, "Fazer"],
  [/^(ler|le)\b/i, "Ler"],
  [/^(compra|conprar|cpmprar)\b/i, "Comprar"],
  [/^(treina|trinar)\b/i, "Treinar"],
  [/^(organiza|organisar)\b/i, "Organizar"],
  [/^(termina|trminar)\b/i, "Terminar"],
  [/^(entrega|entrg)\b/i, "Entregar"],
  [/^(responde|respnder)\b/i, "Responder"],
  [/^(liga|ligr)\b/i, "Ligar"],
  [/^(marca|mrcar)\b/i, "Marcar"],
  [/^(ir\s+n[ao]\s+acadmia|acadmia)\b/i, "Academia"]
];

function limparECorrigirTituloTarefa(rawTitle, tinhaPrefixoConversacional = false) {
  let s = (rawTitle || "").replace(/\s+/g, " ").trim();
  if (!s) return "";

  // 1. Remover prefixos conversacionais coloquiais ("vu ", "vou ", "preciso ", "tenho que ", "me lembra de ", etc.)
  const rePrefixo =
    /^(?:(?:oi|ol[áa]|salve|ei|prumi|coach)\s*[,:-]?\s*)?(?:(?:eu\s+)?(?:vou|vu|vo|v[ôo]|quero|qro|preciso|presiso|tenho\s+que|tenho\s+q|tem\s+que|tem\s+q|devo|planejo|pretendo)|(?:me\s+)?(?:lembra|lembre|lembrar)\s+(?:de\s+|que\s+)?|(?:n[ãa]o\s+|n\s+)?esquecer\s+de|(?:anota|coloca|bota|marca|agenda|adiciona|cria|poe|p[õo]e)(?:\s+a[íi]|\s+pra\s+mim|\s+na\s+agenda|\s+nas?\s+tarefas?)?(?:\s*:\s*|\s+de\s+|\s+que\s+|\s+))+/i;

  let removeuPrefixo = tinhaPrefixoConversacional;
  if (rePrefixo.test(s)) {
    const pos = s.replace(rePrefixo, "").trim();
    if (pos.length >= 2) {
      s = pos;
      removeuPrefixo = true;
    }
  }

  // 2. Limpar conectivos e preposições que sobraram nas pontas após remoção de datas/horas/durações
  s = s
    .replace(/^(?:de|para|pra|em|no|na|nos|nas|às|as|a|umas|uma|por|durante|que|e)\s+/i, "")
    .replace(
      /\s+(?:às|as|a|no|na|nos|nas|de|do|da|em|por|durante|para|pra|umas|uma|lá|la|pelas|pelo|pela|com|e|ou|até|ate)$/i,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  // Segunda passada para limpar resíduos compostos como "amanhã umas" -> "umas"
  s = s
    .replace(
      /\s+(?:às|as|a|no|na|de|em|por|durante|para|pra|umas|uma|lá\s+pelas|la\s+pelas|por\s+volta\s+das?)$/i,
      ""
    )
    .trim();

  if (!s) return "";

  // 3. Só aplica correções ortográficas de gírias/typos se não houver tags HTML
  if (!/[<>]/.test(s)) {
    for (const [re, sub] of CORRECOES_VERBOS_INICIO) {
      if (re.test(s)) {
        s = s.replace(re, sub);
        break;
      }
    }
    for (const [re, sub] of CORRECOES_TERMOS) {
      s = s.replace(re, sub);
    }
    // Se a frase começou com prefixo conversacional (ex: "vu estudar...") ou recebeu correção ortográfica, capitalizar 1ª letra
    if ((removeuPrefixo || /[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(s)) && /^[a-záàâãéêíóôõúç]/.test(s)) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  return s.trim();
}

function inferirAreaTarefa(titulo) {
  const t = norm(titulo || "");
  if (!t) return "";
  if (
    /\b(estud\w*|revis\w*|prova\w*|simulad\w*|exercic\w*|lista\s+de|aula\w*|calcul\w*|fisic\w*|quimic\w*|matematic\w*|programac\w*|direit\w*|portugues|ingles|biologi\w*|histori\w*|geografi\w*|redac\w*|filosofi\w*|sociologi\w*|anatomi\w*|estatistic\w*|faculdad\w*|tcc|artigo|capitul\w*|flashcard\w*|resum\w*|leitura|ler\s+o?\s*livro|enem|concurso|oab|vestibular)\b/.test(
      t
    )
  ) {
    return "estudo";
  }
  if (
    /\b(academi\w*|trein\w*|corr\w*|caminh\w*|medic\w*|dentist\w*|consult\w*|exame\w*|remedi\w*|vitamin\w*|creatin\w*|whey|dieta|almoc\w*|janta\w*|hidrat\w*|along\w*|yoga|natac\w*|musculac\w*|cardio|fisioterapi\w*|psicolog\w*|terapia)\b/.test(
      t
    )
  ) {
    return "dieta";
  }
  if (
    /\b(ligar\s+p\w*|mandar\s+mensagen\w*|falar\s+com|encontrar\s+|sair\s+com|aniversari\w*|visitar\s+|amig\w*|famili\w*|namorad\w*|espos\w*|marid\w*|mae|pai|vovo|av[oó])\b/.test(
      t
    )
  ) {
    return "social";
  }
  return "";
}

function parseQuick(raw, baseDate) {
  const t = today();
  const rawStr = String(raw || "");
  let s = " " + rawStr + " ";
  const o = { title: "", date: null, time: "", dur: 0, area: "", prio: 0, repeat: "" };

  const tinhaPrefixo =
    /^\s*(?:(?:eu\s+)?(?:vou|vu|vo|v[ôo]|quero|qro|preciso|presiso|tenho\s+que|tenho\s+q|tem\s+que|tem\s+q)|(?:me\s+)?(?:lembra|lembre|lembrar)\s+de|(?:anota|coloca|bota|marca|agenda|adiciona)\b)/i.test(
      rawStr
    );

  const take = (re, fn) => {
    s = s.replace(new RegExp(re, "iu"), (...m) => {
      const r = fn(m);
      return r === false ? m[0] : " ";
    });
  };

  // 1. Área explícita por hashtag (#estudo, #dieta, #social, #geral)
  take(`#(estudos?|dieta|sa[úu]de|treino|social|geral)${E}`, m => {
    const a = norm(m[1]);
    o.area = a.startsWith("estud") ? "estudo" : a === "saude" || a === "treino" ? "dieta" : a;
  });

  // 2. Prioridade explícita (!1, !2, !3, !, !!, !!!) ou natural ("urgente", "muito importante", "prioridade alta")
  take(`(?<=\\s)!([123])(?=\\s)`, m => {
    o.prio = 4 - +m[1];
  });
  take(`(?<=\\s)(!{1,3})(?=\\s)`, m => {
    o.prio = m[1].length === 1 ? 3 : m[1].length === 2 ? 2 : 3;
  });
  take(
    `${B}(?:muito\\s+importante|urgent[eí]ssim[oa]|urgente|prioridade\\s+alta|prioridade\\s+m[áa]xima|sem\\s+falta)${E}`,
    () => {
      if (!o.prio) o.prio = 3;
    }
  );
  take(`${B}(?:prioridade\\s+m[ée]dia|importante)${E}`, () => {
    if (!o.prio) o.prio = 2;
  });
  take(`${B}(?:prioridade\\s+baixa|se\\s+der\\s+tempo|quando\\s+der)${E}`, () => {
    if (!o.prio) o.prio = 1;
  });

  // 3. Repetição
  take(`${B}(todos os dias|todo dia|diariamente|toda manh[ãa]|toda tarde|toda noite)${E}`, m => {
    o.repeat = "daily";
    const sub = norm(m[1]);
    if (sub.includes("manha") && !o.time) o.time = "09:00";
    if (sub.includes("tarde") && !o.time) o.time = "15:00";
    if (sub.includes("noite") && !o.time) o.time = "20:00";
  });
  take(`${B}(dias [úu]teis|todo dia [úu]til|de segunda a sexta|seg a sex)${E}`, () => {
    o.repeat = "weekdays";
  });
  take(`${B}tod[ao]s? (?:as? |os? )?${WD_RE}s?(?:-feiras?)?${E}`, m => {
    o.repeat = "weekly";
    o.date = nextWd(WD[norm(m[1])]);
  });
  take(`${B}(toda semana|semanalmente)${E}`, () => {
    o.repeat = "weekly";
  });
  take(`${B}(todo m[êe]s|mensalmente)${E}`, () => {
    o.repeat = "monthly";
  });

  // 4. Intervalo de horário ("das 14h às 16h30", "de 16:00 até 17:30", "das 2 às 4 da tarde")
  take(
    `${B}(?:das?|de)\\s+(\\d{1,2})(?:h(\\d{2})?|:(\\d{2}))?\\s*(?:[àa]s?|at[ée]|-)\\s*(\\d{1,2})(?:h(\\d{2})?|:(\\d{2}))?(?:\\s*(?:da|de)\\s*(manh[ãa]|tarde|noite|madrugada))?${E}`,
    m => {
      let h1 = +m[1],
        m1 = +(m[2] || m[3] || 0);
      let h2 = +m[4],
        m2 = +(m[5] || m[6] || 0);
      const per = m[7] || "";
      if (per) {
        h1 = ajustarHoraPeriodo(h1, per);
        h2 = ajustarHoraPeriodo(h2, per);
      } else if (h1 >= 1 && h1 <= 11 && h2 < h1 && h2 + 12 > h1) {
        h2 += 12;
      }
      if (h1 > 23 || h2 > 23 || m1 > 59 || m2 > 59) return false;
      o.time = `${pad(h1)}:${pad(m1)}`;
      const diff = h2 * 60 + m2 - (h1 * 60 + m1);
      if (diff > 0 && diff <= 720) o.dur = diff;
    }
  );

  // 5. Duração explícita ("durante 1 hora e meia", "por 2h30", "por 45 min", "1 hora e meia", "meia hora", "1h30min")
  // 5.1. "X hora(s) e meia" (com ou sem "durante"/"por")
  const NUM_H_RE = "(\\d{1,2}|uma?|dois|duas|tr[êe]s|quatro|cinco|seis)";
  take(
    `${B}(?:(?:durante|por|pelo\\s+tempo\\s+de|com\\s+dura[çc][ãa]o\\s+de)\\s+)?${NUM_H_RE}\\s*(?:horas?|hrs?|h)\\s+e\\s+meia${E}`,
    m => {
      const h = numDeToken(m[1]);
      if (!(h > 0 && h <= 12)) return false;
      o.dur = h * 60 + 30;
    }
  );

  // 5.2. "meia hora" / "durante meia hora" / "por meia hora"
  take(`${B}(?:(?:durante|por)\\s+)?meia\\s+(?:hora|hr|h)${E}`, () => {
    if (!o.dur) o.dur = 30;
  });

  // 5.3. "durante/por X hora(s) e Y minuto(s)" ou "X hora(s) e Y min"
  take(
    `${B}(?:(?:durante|por)\\s+)?${NUM_H_RE}\\s*(?:horas?|hrs?|h)\\s+e\\s+(\\d{1,2}|quinze|vinte|trinta|quarenta|cinquenta)(?:\\s*(?:minutos?|mins?|m))?${E}`,
    m => {
      const h = numDeToken(m[1]);
      const mi = numDeToken(m[2]);
      if (!(h > 0 && h <= 12) || Number.isNaN(mi) || mi > 59) return false;
      o.dur = h * 60 + mi;
    }
  );

  // 5.4. "durante/por XhY" ou "durante/por X horas" (ex: "durante 2 horas", "por 1h30", "por 2h")
  take(
    `${B}(?:durante|por|pelo\\s+tempo\\s+de|com\\s+dura[çc][ãa]o\\s+de)\\s+${NUM_H_RE}\\s*(?:horas?|hrs?|h)(?:\\s*(\\d{1,2})\\s*(?:minutos?|mins?|m)?)?${E}`,
    m => {
      const h = numDeToken(m[1]);
      const mi = m[2] ? +m[2] : 0;
      if (!(h > 0 && h <= 16) || mi > 59) return false;
      o.dur = h * 60 + mi;
    }
  );

  // 5.5. "durante/por X minutos" ou "X minutos" explícito
  take(
    `${B}(?:(?:durante|por)\\s+)?(\\d{1,3}|quinze|vinte|trinta|quarenta|cinquenta)\\s*(?:minutos?|mins?)${E}`,
    m => {
      const mi = numDeToken(m[1]);
      if (!(mi >= 5 && mi <= 600)) return false;
      if (!o.dur) o.dur = mi;
    }
  );

  // 5.6. "uma hora", "duas horas", "três horas" solto na frase (sem "às"/"umas" antes)
  take(`(?<!(?:[àa]s|as|umas|pelas)\\s)${B}(uma|duas|tr[êe]s|quatro)\\s+(?:horas?|hrs?)${E}`, m => {
    const h = numDeToken(m[1]);
    if (!o.dur && h > 0) o.dur = h * 60;
    else return false;
  });

  // 6. Datas relativas e coloquiais
  take(`${B}(?:depois\\s+de\\s+amanh[ãa]|dps\\s+de\\s+amanh[ãa])${E}`, () => {
    o.date = addDays(t, 2);
  });
  take(`${B}(?:amanh[ãa]|amnh[ãa]?|amh)${E}`, () => {
    o.date = addDays(t, 1);
  });
  take(`${B}(?:hoje|hj|hje)${E}`, () => {
    o.date = t;
  });
  take(
    `${B}(?:daqui\\s+(?:a\\s+)?|em\\s+)(\\d{1,3}|um|uma|dois|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|quinze)\\s+dias?${E}`,
    m => {
      const d = numDeToken(m[1]);
      if (!(d >= 1 && d <= 365)) return false;
      o.date = addDays(t, d);
    }
  );
  take(`${B}(?:semana\\s+que\\s+vem|pr[óo]xima\\s+semana|daqui\\s+(?:a\\s+)?(?:1|uma)\\s+semana)${E}`, () => {
    if (!o.date) o.date = addDays(t, 7);
  });
  take(
    `${B}(?:(?:neste|nesse|no|pr[óo]ximo)\\s+)?(?:fim\\s+de\\s+semana|final\\s+de\\s+semana|fds)${E}`,
    () => {
      if (!o.date) o.date = nextWd(5, t);
    }
  );
  take(`${B}(?:m[êe]s\\s+que\\s+vem|pr[óo]ximo\\s+m[êe]s)${E}`, () => {
    if (!o.date) o.date = addDays(t, 30);
  });
  take(
    `${B}(?:(?:na|no|nesta|neste|nessa|nesse|pr[óo]xima|pr[óo]ximo|de)\\s+)?${WD_RE}(?:-feira)?(\\s+que\\s+vem)?${E}`,
    m => {
      if (o.date) return false;
      const wdKey = norm(m[1]);
      if (!(wdKey in WD)) return false;
      o.date = nextWd(WD[wdKey], t, Boolean(m[2]));
    }
  );
  // Data com mês por extenso: "dia 15 de novembro", "15 de nov"
  take(
    `${B}(?:no\\s+dia\\s+|dia\\s+|em\\s+)?(\\d{1,2})\\s+de\\s+(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)(?:\\s+de\\s+(\\d{4}))?${E}`,
    m => {
      const d = +m[1];
      const mo = MESES_MAP[norm(m[2])];
      if (!mo || d < 1 || d > 31) return false;
      const y = m[3] ? +m[3] : new Date().getFullYear();
      let s2 = `${y}-${pad(mo)}-${pad(d)}`;
      if (!m[3] && s2 < t) s2 = `${y + 1}-${pad(mo)}-${pad(d)}`;
      o.date = s2;
    }
  );
  take(`${B}(?:no\\s+dia\\s+|dia\\s+|em\\s+)?(\\d{1,2})/(\\d{1,2})(?:/(\\d{2,4}))?${E}`, m => {
    const d = +m[1],
      mo = +m[2];
    if (d < 1 || d > 31 || mo < 1 || mo > 12) return false;
    const y = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : new Date().getFullYear();
    let s2 = `${y}-${pad(mo)}-${pad(d)}`;
    if (!m[3] && s2 < t) s2 = `${y + 1}-${pad(mo)}-${pad(d)}`;
    o.date = s2;
  });
  take(`${B}(?:no\\s+)?dia\\s+(\\d{1,2})${E}`, m => {
    const d = +m[1];
    if (d < 1 || d > 31) return false;
    const n = new Date();
    let c = new Date(n.getFullYear(), n.getMonth(), d);
    if (ymd(c) < t) c = new Date(n.getFullYear(), n.getMonth() + 1, d);
    o.date = ymd(c);
  });

  // 7. Horários naturais ("umas 16:00", "às 19h30", "4 e meia da tarde", "8 da manhã", "às 16", "meio-dia")
  const PREP_HORA =
    "(?:(?:[àa]s|as|umas|uma|l[áa]\\s+pelas|pelas|por\\s+volta\\s+das?|perto\\s+das?|at[ée]\\s+as?|at[ée]|para\\s+as?|pras?)\\s+)?";

  // 7.1. "X e meia (da tarde/manhã/noite)"
  take(
    `${B}${PREP_HORA}(\\d{1,2}|uma|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)(?:h|hs|hrs|\\s+horas?)?\\s+e\\s+meia(?:\\s+(?:da|de|pela)\\s+(manh[ãa]|tarde|noite|madrugada))?${E}`,
    m => {
      let h = numDeToken(m[1]);
      if (Number.isNaN(h) || h > 23) return false;
      h = ajustarHoraPeriodo(h, m[2]);
      o.time = `${pad(h)}:30`;
    }
  );

  // 7.2. Horário explícito com ":", "h", "hs", "hrs", "horas" (ex: "umas 16:00", "às 19h", "14h30min", "16 horas")
  take(
    `${B}${PREP_HORA}(\\d{1,2})(?:\\s*(?:h|hs|hrs)\\s*(\\d{2})?|:(\\d{2})(?:\\s*h|\\s*hs|\\s*hrs)?|\\s+horas?)(?:\\s*min(?:utos?)?)?(?:\\s+(?:da|de|pela)\\s+(manh[ãa]|tarde|noite|madrugada))?${E}`,
    m => {
      let h = +m[1];
      const mi = +(m[2] || m[3] || 0);
      if (h > 23 || mi > 59) return false;
      h = ajustarHoraPeriodo(h, m[4]);
      o.time = `${pad(h)}:${pad(mi)}`;
    }
  );

  // 7.3. Horário sem "h"/":" mas seguido de período do dia ("4 da tarde", "8 da manhã", "9 da noite", "2 da madrugada")
  take(
    `${B}${PREP_HORA}(\\d{1,2}|uma|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)\\s+(?:da|de|pela)\\s+(manh[ãa]|tarde|noite|madrugada)${E}`,
    m => {
      if (o.time) return false;
      let h = numDeToken(m[1]);
      if (Number.isNaN(h) || h > 23) return false;
      h = ajustarHoraPeriodo(h, m[2]);
      o.time = `${pad(h)}:00`;
    }
  );

  // 7.4. Horário precedido de preposição clara sem "h" ("às 16", "umas 16", "lá pelas 14") desde que não seja seguido de unidade ("questões", "páginas", "dias")
  take(
    `${B}(?:[àa]s|as|umas|l[áa]\\s+pelas|pelas|por\\s+volta\\s+das)\\s+(\\d{1,2})(?!\\s*(?:quest[õo]es|p[áa]ginas|cap[íi]tulos|exerc[íi]cios|km|kg|ml|l|dias|semanas|meses|anos|vezes|min|minutos|horas|h|:|\\d))${E}`,
    m => {
      if (o.time) return false;
      const h = +m[1];
      if (h < 1 || h > 23) return false;
      o.time = `${pad(h)}:00`;
    }
  );

  // 7.5. Meio-dia, meia-noite e períodos gerais do dia ("de manhã", "à tarde", "à noite")
  take(`${B}(?:ao\\s+|umas?\\s+|pelas?\\s+)?meio[-\\s]?dia(?:\\s+e\\s+meia)?${E}`, m => {
    if (!o.time) o.time = /meia/i.test(m[0]) ? "12:30" : "12:00";
  });
  take(`${B}(?:[àa]\\s+|umas?\\s+|pelas?\\s+)?meia[-\\s]?noite(?:\\s+e\\s+meia)?${E}`, m => {
    if (!o.time) o.time = /meia/i.test(m[0]) ? "00:30" : "00:00";
  });
  take(`${B}(?:de|pela|[àa])\\s+manh[ãa]${E}`, () => {
    if (!o.time) o.time = "09:00";
  });
  take(`${B}(?:de|pela|[àa]|a)\\s+tarde${E}`, () => {
    if (!o.time) o.time = "15:00";
  });
  take(`${B}(?:de|pela|[àa]|a)\\s+noite${E}`, () => {
    if (!o.time) o.time = "20:00";
  });

  // 8. Limpeza e correção inteligente do título
  o.title = limparECorrigirTituloTarefa(s, tinhaPrefixo);

  // 9. Inferência automática da área se o usuário não passou #tag explícita
  if (!o.area && o.title) {
    o.area = inferirAreaTarefa(o.title);
  }

  if (!o.date) o.date = baseDate || t;
  return o;
}

function parsedPills(p, raw) {
  if (!raw.trim()) return "";
  const a = [];
  a.push(relDay(p.date).replace(/^./, c => c.toUpperCase()));
  if (p.time) a.push(p.time);
  if (p.dur) a.push(fmtMin(p.dur));
  if (p.area) a.push(AREAS[p.area]);
  if (S.persona === "otaku") {
    const rankNome =
      p.prio === 3
        ? "Missão Rank S"
        : p.prio === 2
          ? "Missão Rank A"
          : p.prio === 1
            ? "Missão Rank B"
            : "Missão Rank C";
    a.push(rankNome);
  } else if (p.prio) {
    a.push("Prioridade " + PRIO[p.prio].toLowerCase());
  }
  if (p.repeat) a.push(REPEAT[p.repeat]);
  return a.map(x => `<span class="pill">${esc(x)}</span>`).join("");
}

/**
 * Verifica se uma frase em linguagem natural (ex: no chat da IA) é uma intenção
 * de agendar/criar uma ou mais tarefas.
 */
function ehComandoDeTarefa(raw) {
  const txt = String(raw || "").trim();
  if (!txt || txt.length < 4) return false;
  const n = norm(txt);

  // Não tratar perguntas conceituais/gerais como comando direto de tarefa
  if (
    /^(como\s|qual\s|quais\s|por\s*que\s|pq\s|o\s+que\s+[eé]|quem\s+[eé]|voce\s+pensa|vc\s+pensa|analise\s+meu)/.test(
      n
    )
  ) {
    return false;
  }
  // Não interceptar pedidos explícitos de gerador de ciclo completo de concurso sem horário
  if (
    /\b(ciclo\s+de\s+estudos|cronograma\s+estrategico|edital)\b/.test(n) &&
    !/\d{1,2}\s*(?:h|:|horas?)/.test(n)
  ) {
    return false;
  }

  const temPrefixoIntencao =
    /^(?:(?:oi|ola|salve|ei|prumi|coach)\s*[,:-]?\s*)?(?:(?:eu\s+)?(?:vou|vu|vo|quero|qro|preciso|presiso|tenho\s+que|tenho\s+q|tem\s+que|tem\s+q|devo|planejo|pretendo)\s+|(?:me\s+)?(?:lembra|lembre|lembrar)\s+(?:de\s+|que\s+)?|(?:nao\s+|n\s+)?esquecer\s+de\s+|(?:anota|coloca|bota|marca|agenda|adiciona|cria|poe)\b)/i.test(
      n
    );

  const temMarcadorTemporal =
    /\b(amanha|amnh\w*|depois\s+de\s+amanha|hoje|hj|segunda|terca|quarta|quinta|sexta|sabado|domingo|daqui\s+(?:a\s+)?\d+|semana\s+que\s+vem|fim\s+de\s+semana|fds|durante\s+\d+|por\s+\d+\s*(?:h|hora|min)|meia\s+hora|\d{1,2}\s*(?:h\d*|:\d{2}|horas?|hrs?)|(?:as|umas|pelas)\s+\d{1,2}|(?:\d{1,2}|uma|duas|tres|quatro)\s+e\s+meia|todo\s+dia|todos\s+os\s+dias|toda\s+semana)\b/.test(
      n
    );

  const p = parseQuick(txt);
  if (!p.title || p.title.length < 2) return false;

  if (
    temPrefixoIntencao &&
    (temMarcadorTemporal || p.area || p.dur > 0 || p.time || p.title.split(/\s+/).length >= 2)
  ) {
    return true;
  }
  if (temMarcadorTemporal && (p.time || p.dur > 0 || p.repeat || p.area)) {
    return true;
  }
  return false;
}

/**
 * Divide frases compostas (ex: "estudar cálculo amanhã às 16h por 1h30 e depois treinar às 18h por 45 min")
 * em múltiplas tarefas estruturadas, herdando a data da primeira quando omitida nas seguintes.
 */
function extrairTarefasDeFrase(raw, baseDate) {
  const txt = String(raw || "").trim();
  if (!txt) return [];

  const partes = txt
    .split(
      /\s*(?:;|\be\s+depois\b|\be\s+tamb[ée]m\b|\be\s+em\s+seguida\b|\bdepois\s+(?=(?:vou|vu|vo|ir|fazer|estudar|treinar|ler|revisar|comprar|ligar)\b)|\be\s+(?=(?:vou|vu|vo|preciso|tenho\s+que|estudar|revisar|treinar|malhar|fazer|ler|assistir|praticar|resolver|comprar|pagar|ligar|limpar|arrumar|lavar|cozinhar|correr|caminhar|meditar)\b))\s*/i
    )
    .map(s => s.trim())
    .filter(Boolean);

  let dataHerdada = baseDate || today();
  const resultado = [];

  for (const parte of partes) {
    const p = parseQuick(parte, dataHerdada);
    if (p.title && p.title.length >= 2) {
      dataHerdada = p.date || dataHerdada;
      resultado.push(p);
    }
  }
  return resultado;
}

/**
 * Cria (ou atualiza se já existir idêntica) as tarefas extraídas de uma frase em S.tasks,
 * cadastrando matéria de estudo e subtarefas proporcionais quando aplicável.
 */
function criarTarefasPorTextoIA(raw, baseDate) {
  if (typeof S === "undefined" || !S || !Array.isArray(S.tasks)) return [];
  const extraidas = extrairTarefasDeFrase(raw, baseDate);
  if (!extraidas.length) return [];

  const criadas = [];
  for (const p of extraidas) {
    // Se for de estudo, verificar se há matéria conhecida no título para garantir cadastro em S.subjects
    if (p.area === "estudo" && Array.isArray(S.subjects)) {
      const mMatch = p.title.match(
        /\b(Cálculo|Física|Química|Matemática|Biologia|História|Geografia|Português|Inglês|Programação|Estatística|Redação|Filosofia|Sociologia|Anatomia|Direito)\b/i
      );
      if (mMatch) {
        const nomeMat = mMatch[1].charAt(0).toUpperCase() + mMatch[1].slice(1);
        const jaTem = S.subjects.some(sub => norm(sub.name) === norm(nomeMat));
        if (!jaTem) {
          const cores =
            typeof SUBJ_COLORS !== "undefined" && Array.isArray(SUBJ_COLORS)
              ? SUBJ_COLORS
              : ["#2340C4", "#1C8350", "#AE2C76", "#A9670E", "#5B3FB8"];
          S.subjects.push({
            id: typeof newId === "function" ? newId() : "s_" + Math.random().toString(36).slice(2, 8),
            name: nomeMat,
            color: cores[S.subjects.length % cores.length]
          });
        }
      }
    }

    // Subtarefas automáticas se tiver duração de estudo >= 45 min
    let subs = [];
    if (p.dur >= 45 && p.area === "estudo" && typeof passosPara === "function") {
      subs = passosPara(p.title, p.dur).map(passo => ({
        id: typeof newId === "function" ? newId() : "sub_" + Math.random().toString(36).slice(2, 8),
        t: passo,
        done: false
      }));
    }

    // Evitar duplicação se a mesma tarefa já foi criada na mesma data e hora
    let existente = S.tasks.find(
      t =>
        !t.done && norm(t.title) === norm(p.title) && t.date === p.date && (t.time || "") === (p.time || "")
    );

    if (existente) {
      if (p.dur) existente.dur = p.dur;
      if (p.area) existente.area = p.area;
      if (p.prio) existente.prio = p.prio;
      if (p.repeat) existente.repeat = p.repeat;
      if (subs.length && (!existente.sub || !existente.sub.length)) existente.sub = subs;
      criadas.push(existente);
    } else {
      const nova = {
        id: typeof newId === "function" ? newId() : "t_" + Math.random().toString(36).slice(2, 9),
        title: p.title,
        area: p.area || "geral",
        date: p.date,
        time: p.time || "",
        dur: p.dur || 0,
        done: false,
        prio: p.prio || 0,
        repeat: p.repeat || "",
        sub: subs
      };
      S.tasks.push(nova);
      if (typeof fx !== "undefined" && fx) fx.newId = nova.id;
      criadas.push(nova);
    }
  }

  if (criadas.length && typeof commit === "function") {
    commit();
  }
  return criadas;
}
