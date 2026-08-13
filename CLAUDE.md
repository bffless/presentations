# CLAUDE.md — presentations

Guidance for Claude Code in the BFFless presentations monorepo.

## What this repo is

Reveal.js slide decks, one per `decks/<name>/`, each deployed as a static site to
`https://<name>.bffless.dev` on the **admin.bffless.dev** BFFless instance (project
`bffless/presentations`). No app backend, no proxy rules — pure static deploys via
`bffless/upload-artifact`.

## Commands

```bash
pnpm install
pnpm --filter <deck> dev      # Vite dev server (rag: port 5180)
pnpm --filter <deck> build    # → decks/<deck>/dist
```

Root shortcuts exist per deck (`pnpm rag:dev`, `pnpm rag:build`).

## Conventions

- **Vite `base: './'` is mandatory** in every deck: the production domain serves
  `/decks/<name>/dist` as the site root and previews are browsed via alias URLs, so asset
  paths must be relative.
- **Slides live in `index.html`** as `<section>` elements (horizontal = parts, vertical =
  detail slides). Speaker notes go in `<aside class="notes">` — keep the rich talking points
  there, keep the visible slide sparse.
- **Theme**: import order in `src/main.js` is reveal.css → theme/black.css → highlight css →
  `@presentations/theme/theme.css`. Brand tokens (`--bff-*`) and helper classes (`.kicker`,
  `.panel`, `.cols`, `.statement`, `.accent/.teal/.violet`, `.center-slide`) are defined there.
  Change shared look in `packages/theme`, not per-deck.
- **Deploy wiring per deck**: one `deploy-<name>.yml` (push to main → alias `<name>`) and one
  `preview-<name>.yml` (PRs → shared alias `<name>-preview`, PR comment). Path filters include
  `packages/theme/**` so theme changes redeploy decks.
- **Domain wiring** (one-time, via bffless MCP on admin.bffless.dev): subdomain
  `<name>.bffless.dev` → project `bffless/presentations`, alias `<name>`, path
  `/decks/<name>/dist`. `*.bffless.dev` DNS is a wildcard — creating the BFFless domain is all
  that's needed.

## Validating slides headlessly

This VPS has no GUI. Screenshot a running deck with the workspace tooling:

```bash
cd /home/rico/bffless/localdev-tools
node shot.mjs http://localhost:5180/ --out /tmp/deck.png --width 1280 --height 720
# individual slides: append #/2, #/2/1 etc. to the URL
```
