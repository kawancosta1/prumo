# Prumo: Technical Instructions & Developer Guide

Prumo is a gamified personal productivity companion (tasks, study routines, hydration, habits, bookshelf, and social duos) featuring the interactive mascot Prumi.
Owner: Kawan Costa.
Production Site: https://prumo-66d76.web.app (deployed automatically from branch `main`).

## Workflow & Git Policy

- Standard flow: Implement requested features, run the full test suite, format with Prettier, and push directly to `main` (the GitHub Action runs the test suites and deploys Hosting, Functions, and Firestore rules upon 100% pass).
- Clear, concise commit messages detailing the changes.

## Architecture

- Pure HTML5, CSS3, and Vanilla JavaScript. Zero build steps, zero framework churn, zero runtime package bloat.
- Scripts in `index.html` load in a fixed sequence: each script utilizes symbols declared by preceding files.
- Classic scripts (shared scope): top-level `const`, `let`, and `class` declarations are checked for collisions via `testes/globais.js`.
- Reactive state: all data resides in the central `S` object (`js/estado.js`). Mutate `S` and call `commit()` (which saves locally and syncs to cloud before triggering `render()`).
- Views: every tab is a `view...()` function in `js/telas/` returning semantic HTML strings. Interactive buttons utilize `data-act` attributes handled in `js/acoes.js` or via `ACOES_EXTRAS`.
- Persona worlds: isolated under `js/mundos/` injecting dialogues, theme colors, and wardrobe items.
- Mascot: vector SVG generated procedurally by `prumi()` in `js/mascote/desenho.js` (viewport 120 x 154).
- Security: always sanitize user-supplied text with `esc()` before interpolating into HTML.

## Testing & Verification

- Run test suites: `node testes/rodar.js` (checks global variables, general usage, auth, worlds, AI edital, and upgrade MVP in jsdom).
- Run Prettier before committing: `npx prettier --write "js/**/*.js" "estilos/*.css"`.
- Ensure zero errors before pushing.
