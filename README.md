# BFFless Presentations

A pnpm monorepo of HTML presentations built with [Reveal.js](https://revealjs.com/) + Vite.
Each deck lives under `decks/<name>/` and deploys to its own site at `https://<name>.bffless.dev`
via [`bffless/upload-artifact`](https://github.com/bffless/upload-artifact).

## Decks

| Deck | URL | Topic |
| ---- | --- | ----- |
| `decks/rag` | [rag.bffless.dev](https://rag.bffless.dev) | Context, RAG & vector search — and how BFFless Recall implements it |

## Local development

```bash
pnpm install
pnpm rag:dev       # Vite dev server → http://localhost:5180
pnpm rag:build     # builds to decks/rag/dist
```

Press `S` in the browser for speaker notes, `Esc` for the slide overview, `F` for fullscreen.

## Shared theme

`packages/theme` holds the shared Reveal theme (`theme.css`, layered over Reveal's black theme)
and brand assets. Decks depend on it as `@presentations/theme`.

## Adding a new deck

1. Copy `decks/rag` to `decks/<name>`; update its `package.json` name and slide content.
2. Add `<name>:dev` / `<name>:build` scripts to the root `package.json`.
3. Copy `.github/workflows/deploy-rag.yml` → `deploy-<name>.yml` (and the preview workflow),
   replacing the deck name and alias.
4. On the BFFless instance (admin.bffless.dev, project `bffless/presentations`): after the first
   deploy creates the `<name>` alias, add a subdomain `<name>.bffless.dev` pointing at that alias
   with path `/decks/<name>/dist`. DNS is a wildcard; no DNS change needed.

## Deployment

- Push to `main` touching `decks/<name>/**` (or the shared theme) → deploys to the `<name>` alias.
- PRs deploy to a shared `<name>-preview` alias and get the preview URL as a PR comment.
- Repo variables/secrets: `BFFLESS_URL` (https://admin.bffless.dev), `BFFLESS_API_KEY`.
