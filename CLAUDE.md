# CLAUDE.md — presentations

Guidance for Claude Code in the BFFless presentations monorepo.

## What this repo is

Reveal.js slide decks, one per `decks/<name>/`, each deployed as a static site to
`https://<name>.bffless.dev` on the **admin.bffless.dev** BFFless instance (project
`bffless/presentations`). No app backend — pure static deploys via `bffless/upload-artifact`.
The only server-side piece is the `images` proxy rule set (below), the project's default set.

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

## Generating images (`images` MCP server)

`.bffless/proxy-rules/images/` is a rules-as-code set: one `mcp_handler` endpoint at
`POST /api/mcp` exposing `generate_image` (Replicate `google/nano-banana-2`), its sibling tool
rule, and the OAuth discovery document. It is the project's **default** rule set, so it
answers on every deck host; `.mcp.json` points Claude Code at `rag.bffless.dev/api/mcp` and
`/mcp` → Authenticate runs the OAuth consent on admin.bffless.dev (scope `images:generate`,
admins only). The `generate-image` skill (`.claude/skills/`) is the workflow: **ask before
every paid call**, then `curl` the returned URL into `decks/<deck>/public/images/` within the
hour — nothing is stored server-side.

- `npx bffless rules test .bffless/proxy-rules/images` runs the handler fixtures;
  `rules validate` / `rules build` check the set; `rules push --dry-run` diffs against live
  (needs `BFFLESS_API_KEY` for admin.bffless.dev).
- Rules sync on push to `main` touching `.bffless/**` (`deploy-rules.yml`). One-time setup
  and the full design: `docs/plans/2026-09-06-images-mcp-layout.md`.

## Validating slides headlessly

This VPS has no GUI. Screenshot a running deck with the workspace tooling:

```bash
cd /home/rico/bffless/localdev-tools
node shot.mjs http://localhost:5180/ --out /tmp/deck.png --width 1280 --height 720
# individual slides: append #/2, #/2/1 etc. to the URL
```
