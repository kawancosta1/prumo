# 🚀 Prumo: Production-Grade Gamified AI Productivity & Study Micro-SaaS

> **A turnkey, high-performance Progressive Web Application (PWA) with zero runtime dependencies. Combines daily habit tracking, adaptive hydration, gamified mascot mechanics across 17 aesthetic worlds, an automated Exam Syllabus-to-Schedule AI engine, and real-time cloud synchronization.**

[![Automated Tests](https://img.shields.io/badge/tests-100%25%20passing-brightgreen.svg)](#testing-and-quality-assurance)
[![PWA Ready](https://img.shields.io/badge/pwa-offline--first-blue.svg)](#offline-first-pwa-architecture)
[![Zero Framework Churn](https://img.shields.io/badge/dependencies-zero%20frontend%20bloat-success.svg)](#zero-framework-architecture)
[![License](https://img.shields.io/badge/license-commercial%20turnkey-orange.svg)](#commercialization-and-monetization)

---

## 1. Executive Summary & Product Vision

**Prumo** is built for students, competitive exam candidates (civil service, bar exams, university entrance), and productivity enthusiasts who want structure without boring corporate interfaces.

Instead of generic checklist apps, Prumo blends **gamification, vintage 1930s animation aesthetics, and actionable AI**:

- **Interactive SVG Mascot ("Prumi"):** Reacts to the user's progress, mood, hydration, and study streaks with dynamic emotional states, outfits, and procedural WebAudio soundscapes.
- **17 Collectible Aesthetic Worlds:** Rocker, Emo, Otaku, Gamer, Programmer, Witch, Wizard, Zen, Coach, Pagode, and more. Each world customizes the color scheme, background audio, typography, and exclusive shop items.
- **Exam Syllabus-to-Schedule AI Engine:** Users paste or upload raw contest or academic exam syllabi. The engine parses disciplines, calculates weights, and creates a balanced daily schedule (theory, practice questions, weekly spaced reviews, and full-length mocks), automatically importing rolling two-week blocks into the user's agenda.
- **Mini Gemini Generative AI Assistant:** Secure serverless proxy to `gemini-2.0-flash` with Markdown rendering, syntax-highlighted code with copy buttons, tables, and daily quota limits (Free vs. PRO tiers).
- **Enterprise CRUD DataGrid & PDF Reporting:** Dedicated `/admin` route with real-time Firestore sync and single-click A4 PDF Executive Report generation with active search filter headers.
- **Bilingual & Dynamic Theming:** Native support for English (`en-US`) and Portuguese (`pt-BR`) with automatic system preference detection and dark mode contrast variants.

---

## 2. Key Features

### 📄 1. Automated Syllabus & Exam Schedule Planner (`js/edital.js`)

- **Multi-Format Input:** Paste raw exam text or upload `.txt` documents.
- **Hybrid Parser:** Uses Google Gemini 2.0 Flash on the backend when connected, with an immediate, zero-latency local fallback parser when offline.
- **Built-in Presets:** Pre-configured exam templates (ENEM, Fuvest, Unicamp, civil service, police, banking, and general competitions).
- **Balanced Pacing:** Automatically allocates theory blocks, question drills, cumulative weekly reviews, and final review weeks before the exam date.
- **Rolling Import:** Imports the upcoming 14 days of study tasks directly into the user's agenda without cluttering or duplicating tasks.

### 🤖 2. Mini Gemini Generative AI Assistant (`js/ia-prumo.js`, `functions/ia.js`)

- Generalist study tutor that answers any academic or productivity query, generates essay prompts, explains complex problems step-by-step, and formats code snippets.
- **Secure Markdown Renderer:** Escapes malicious HTML while rendering headers, numbered lists, markdown tables, and syntax code boxes with one-click copy.
- **Serverless Rate Limiting:** Manages daily query quotas (15 queries/day for free users, 300 queries/day for PRO subscribers) resetting automatically at midnight.

### 🎮 3. Interactive Mascot & 17 Dynamic Worlds (`js/mascote/`, `js/mundos/`)

- Pure procedural SVG mascot with customizable clothing slots (hats, shirts, jackets, handheld items, glasses, pets).
- 17 distinct persona environments:
  - **Emo:** Midnight study cards, falling rain on glass during focus timer, future letters, and locked PIN diary.
  - **Rocker:** Stage setlists, rhythm mini-game rehearsal, custom bandmates, and collectible gig tickets.
  - **Otaku, Gamer, Programmer, Wizard, Zen:** Dedicated sound effects, custom visual shaders, and exclusive interactive items.

### 🛡️ 4. Enterprise Admin Panel & DataGrid (`js/telas/admin.js`)

- Protected route (`#admin`) guarded by `AuthGuard` ensuring only authorized accounts access system controls.
- Full CRUD DataGrid table allowing administrators to search, filter by category or persona, create new entities, update prices, and delete catalog items.
- Real-time `onSnapshot` Firestore persistence with instant reactive updates across active clients.

### 📊 5. A4 PDF Export Engine (`js/motor-exportacao.js`)

- Serializes active filtered states (catalog, tasks, or study schedules) into printable, high-resolution A4 PDF reports.
- Includes active search parameters, timestamps, user branding, and zebra-striped data tables formatted for desktop printing or PDF saving.

### 🌓 6. Dynamic Theming & Dark Mode (`js/theme-provider.js`)

- Auto-detects OS preference via `window.matchMedia('(prefers-color-scheme: dark)')` and persists user override in `prumo-theme`.
- Automatically toggles `.dark` and `data-theme="dark"` on `<html>`.
- Features high-contrast variants for vector mascots, cards, and carousels.

### 🌐 7. Internationalization (i18n) (`js/i18n.js`)

- Dual-namespace dictionary supporting **English (`en-US`)** and **Portuguese (`pt-BR`)**.
- `useTranslation()` hook and `<LanguageSwitcher>` component.
- Automatically selects language based on browser locale or user preference.

---

## 3. Zero-Framework Architecture

Unlike typical React or Next.js applications that require constant `npm audit` fixes, complex build chains, and frequent breaking changes, Prumo is built on **pure W3C standards**:

- **Vanilla JavaScript (ES6+):** Ultra-fast execution, zero hydration lag, no virtual DOM overhead.
- **Instant Cold Start:** First Contentful Paint (FCP) under 350ms on mobile 4G networks.
- **Offline-First PWA:** Service Worker (`sw.js`) caches the entire application locally. Works smoothly in subway tunnels, flights, or off-grid areas.
- **Predictable Global State (`S`):** All application state is stored in a single object `S` in `js/estado.js`. Mutations call `commit()`, which persists to `localStorage` (and syncs with Firebase Firestore when authenticated) before triggering an atomic `render()`.

```
User Action  ──>  js/acoes.js updates S  ──>  commit()  ──>  Persist Local & Cloud  ──>  render()  ──>  Updated UI
```

---

## 4. Codebase Structure & File Map

Scripts are loaded sequentially in `index.html`. Every file safely builds upon symbols defined previously:

| Directory / File                         | Description                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| `index.html`                             | Semantic shell, PWA manifest, font imports, and ordered script loader                     |
| `js/util.js`                             | Date helpers (`today()`, `addDays()`), secure HTML sanitization (`esc()`), calendar links |
| `js/captura-rapida.js`                   | Natural language task parser (e.g. `read chapter 3 tomorrow 8pm #study !1`)               |
| `js/estado.js`                           | Central reactive state `S`, migration normalization, persistence, and `toast()`           |
| `js/calculos.js`                         | Water intake calculations, habit streak logic, spaced repetition scheduling               |
| `js/componentes.js`                      | Reusable UI atoms: task rows, water widgets, progress charts                              |
| `js/i18n.js`                             | Internationalization engine, dictionaries (`en-US`, `pt-BR`), and `LanguageSwitcher`      |
| `js/temas.js` & `js/theme-provider.js`   | Dynamic color themes, palette mixers, dark mode root controller                           |
| `js/mascote/desenho.js`                  | Vector SVG mascot renderer (`prumi()`), facial rigging, and outfit layering               |
| `js/mundos/*.js`                         | 17 distinct personality worlds with exclusive soundscapes, themes, and shop items         |
| `js/conta.js`                            | Firebase Authentication (Google OAuth and Email/Password), user handle reservation        |
| `js/servicos-firebase.js`                | `AuthGuard` route protector, real-time Firestore catalog listeners (`onSnapshot`)         |
| `js/telas/admin.js`                      | Enterprise DataGrid CRUD table with live search and entity modal editor                   |
| `js/motor-exportacao.js`                 | Tabulated PDF report generator and `<ExportButton>` component                             |
| `js/markdown-ia.js`                      | XSS-safe Markdown renderer with syntax-highlighted code and copy buttons                  |
| `js/ia-servidor.js`                      | HTTPS client for cloud Gemini AI endpoint with rate limit detection                       |
| `js/ia-prumo.js`                         | AI study coach, conversation modal, and study cycle generator                             |
| `js/edital.js`                           | Complete syllabus parser, study pacing calculator, and rolling agenda importer            |
| `js/telas/*.js`                          | View functions (`viewHoje`, `viewEstudos`, `viewEstante`, `viewAdmin`, `viewAjustes`)     |
| `js/render.js`                           | Central render coordinator and tab navigation controller                                  |
| `js/acoes.js`                            | Central event delegator mapping `data-act` attributes to business logic                   |
| `functions/index.js` & `functions/ia.js` | Cloud Functions backend for Gemini 2.0 Flash proxy, rate limiting, and payments           |
| `testes/rodar.js`                        | Test runner executing 50+ test suites in headless jsdom                                   |

---

## 5. Getting Started & Running Locally

Because Prumo has **zero build dependencies**, running it locally is instant:

### Running the Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/kawancosta1/prumo.git
   cd prumo
   ```
2. Serve using any static file server:
   ```bash
   # Using Python
   python -m http.server 8080

   # Or using Node.js
   npx serve .
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 6. Testing & Quality Assurance

Prumo includes an exhaustive automated testing suite executing in headless JSDOM:

- **Global Scope Collision Audit (`testes/globais.js`):** Parses every JavaScript file using `acorn` to guarantee zero variable collisions across classic script scopes.
- **50+ Integration Test Suites:** Validates Auth, Routine Coaching, Water Goals, Emo/Rocker/Otaku/Witch Worlds, 1930s Cuphead Animations, Leitner Spaced Repetition, Cognitive WCAG 2.2 accessibility, Mini Gemini Markdown, Exam Syllabus generation, AuthGuard, and Admin DataGrid CRUD.

To run the entire test suite:

```bash
cd testes
npm install
node rodar.js
```

All suites will execute in sequence and conclude with:

```
Tudo certo. (All tests passed cleanly with 0 errors)
```

---

## 7. Cloud Infrastructure & Deployment

### Firebase Hosting

The site is hosted globally on Firebase Hosting (`prumo-66d76.web.app`) with custom CDN caching headers and strict Content Security Policy (CSP):

```bash
firebase deploy --only hosting
```

### Firebase Cloud Functions (Serverless Backend)

Houses the Gemini 2.0 Flash AI proxy and webhook listeners:

```bash
firebase deploy --only functions
```

### Firestore Security Rules (`firestore.rules`)

Guarantees strict tenant isolation: users can only read and write their own documents (`request.auth.uid == userId`), while license tiers and global catalog items are validated server-side.

```bash
firebase deploy --only firestore:rules
```

---

## 8. Commercialization & Monetization

Prumo is 100% ready to generate revenue:

- **Subscription Tiers:** Free (15 AI queries/day, core habits and tasks) vs. PRO (300 AI queries/day, full exam syllabus importer, advanced cognitive reports, executive PDF exports).
- **Payment Gateway Architecture:** Includes serverless webhook processors for recurring subscription verification via Pix / Mercado Pago and Stripe.
- **White-Labeling Potential:** Perfect for educational influencers, exam preparation academies, or SaaS entrepreneurs looking to rebrand a fully tested, engaging product.

---

## 9. License & Authorship

Developed and engineered by **Kawan Costa**.  
Commercial asset rights and full intellectual property are available for transfer and acquisition.
