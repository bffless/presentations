# BFFless Presentations

A pnpm monorepo of HTML presentations built with [Reveal.js](https://revealjs.com/) + Vite.
Each deck lives under `decks/<name>/` and deploys to its own site at `https://<name>.bffless.dev`
via [`bffless/upload-artifact`](https://github.com/bffless/upload-artifact).

## Decks

| Deck | URL | Topic |
| ---- | --- | ----- |
| `decks/rag` | [rag.bffless.dev](https://rag.bffless.dev) | Context, RAG & vector search — and how BFFless Recall implements it |
| `decks/mcp` | [mcp.bffless.dev](https://mcp.bffless.dev) | Your backend is already an MCP server — three proxy rules, no server process |

## Local development

```bash
pnpm install
pnpm rag:dev       # Vite dev server → http://localhost:5180
pnpm rag:build     # builds to decks/rag/dist
pnpm mcp:dev       # Vite dev server → http://localhost:5181
pnpm mcp:build     # builds to decks/mcp/dist
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

## Generating images

The repo ships an MCP server, `images`, that Claude Code connects to via `.mcp.json` (OAuth on
admin.bffless.dev). Its one tool, `generate_image`, renders an image with Replicate's
`google/nano-banana-2` and returns a temporary URL; the `generate-image` skill asks before each
paid call and saves the result into the deck's `public/images/`. Source:
`.bffless/proxy-rules/images/`; design notes: `docs/plans/2026-09-06-images-mcp-layout.md`.

## Deployment

- Push to `main` touching `decks/<name>/**` (or the shared theme) → deploys to the `<name>` alias.
- PRs deploy to a shared `<name>-preview` alias and get the preview URL as a PR comment.
- Repo variables/secrets: `BFFLESS_URL` (https://admin.bffless.dev), `BFFLESS_API_KEY`.
