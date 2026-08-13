# Design

Visual system for BFFless presentation decks (Reveal.js). Source of truth:
`packages/theme/theme.css`, layered over Reveal's black theme.

## Color

Dark, committed. Near-black ground with the brand coral carrying emphasis; teal and violet as
secondary diagram roles. Color is never the only channel — diagrams pair it with labels/shape.

| Token | Value | Role |
| ----- | ----- | ---- |
| `--bff-ink` | `#14161a` | slide background |
| `--bff-panel` | `#1e2127` | panels, diagram surfaces |
| `--bff-text` | `#e8e6e3` | body text |
| `--bff-muted` | `#9a9691` | secondary text (large sizes only) |
| `--bff-coral` / `--bff-coral-bright` | `#c95c54` / `#e57368` | brand accent, primary emphasis |
| `--bff-teal` | `#4fb8a8` | secondary accent (retrieval / search roles) |
| `--bff-violet` | `#8b7ec8` | tertiary accent (model / embedding roles) |
| `--bff-wire` | `#4a4a4a` | strokes, connectors, borders |

Diagram role convention (keep consistent across decks): **coral = the thing being emphasized /
the query**, **teal = retrieval & search machinery**, **violet = models & vectors**, **wire gray
= structure**.

## Typography

System humanist sans (`Avenir Next` → `Segoe UI` → system-ui) in two weights; mono
(`JetBrains Mono` fallback chain) strictly for code and literal identifiers (`CLAUDE.md`,
`(lat, lng)`, `vector_search`). Base 38px; headings bold, tight (-0.02em), sentence case.
No display serif, no font pairing games — the deck is projected, legibility wins.

## Slide components

Defined in `packages/theme/theme.css`:

- `.kicker` — part-number label, used ONLY on the four part-divider slides (a deliberate,
  bounded sequence — not per-slide scaffolding).
- `.panel` — raised surface (`--bff-panel`, 1px `#2c3038` border, 12px radius).
- `.cols` — flex two-up layout.
- `.statement` — large declarative claim line.
- `.accent` / `.teal` / `.violet` / `.muted` — inline color roles.
- `.center-slide` — centered layout for title/divider/recap slides.

## Diagrams

Inline SVG, hand-authored, in-slide (no external images). Conventions:

- `viewBox` around 960×N, `width: 100%`, height auto; text inside SVG ≥17px at viewBox scale
  (renders ≥24px projected).
- Stroke-first construction: `--bff-wire` strokes, panel fills, sparse color per the role
  convention above.
- Fonts inside SVG inherit the deck stack; labels always accompany color coding.
- Reveal `.fragment` may stage *emphasis* (highlights, callouts) but the diagram must read
  complete with zero fragments shown (headless renders, printed exports).

## Motion

Reveal's `slide` transition between slides; fragments for presenter-paced build-ups only.
No autoplaying animation. Anything animated beyond Reveal must carry a
`prefers-reduced-motion: reduce` fallback.
