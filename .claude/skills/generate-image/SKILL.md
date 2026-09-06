---
name: generate-image
description: Generate a real image for a slide with the `images` MCP server's generate_image tool (Replicate google/nano-banana-2) and save it into the deck. Use when the user asks for a hero image, cover, illustration, background, or "generate an image" for a deck — never for inline SVG diagrams, which stay hand-authored (DESIGN.md).
---

# Generate an image for a deck

`generate_image` (MCP server `images`, declared in `.mcp.json`) renders one image with
google/nano-banana-2 on Replicate and returns a delivery URL that is valid for about an hour.
Nothing is stored server-side. **Every call costs money.**

## The one rule: ask first, one image per yes

Never call `generate_image` unprompted, and never call it twice for one yes. Before every call:

1. Draft the full prompt (anatomy below) and pick the aspect ratio.
2. Show the person the prompt and the ratio, and say plainly that this is one paid Replicate
   generation.
3. Wait for an explicit yes. A "make it more X" is a new prompt and a new yes.

If the server is not connected yet, run `/mcp` → `images` → Authenticate. The consent page on
admin.bffless.dev asks for the `images:generate` scope; the tool is also limited to admins.

## Writing the prompt

Condensed from Studio's `image-prompts` skill. Hit these in order; skipping sections is what
produces vague, re-roll-heavy results.

```
1. Format — aspect ratio + medium ("16:9 full-bleed slide background", "1:1 panel illustration")
2. Style anchor — one sentence naming a visual reference, not adjectives
3. Composition — what sits where; leave the area the slide's text will cover empty
4. Text — the exact words to render, if any (≤ 5 words; usually none — slides carry their own text)
5. Subject — the focal artwork, with specific objects
6. Palette — 3–4 colours with hex codes, from DESIGN.md
7. Style descriptors — a few adjectives that reinforce the anchor
8. Negatives — what to avoid (the highest-leverage section)
```

House palette (DESIGN.md, `packages/theme/theme.css`): ink `#14161a`, panel `#1e2127`, text
`#e8e6e3`, coral `#c95c54` / `#e57368` (emphasis), teal `#4fb8a8` (retrieval/search), violet
`#8b7ec8` (models/vectors), wire `#4a4a4a`. Decks are dark and committed, so backgrounds should
read on `--bff-ink` and keep contrast for overlaid text. Default negatives for this house:
neon glow, gradient mesh, photorealistic people, generic cloud icons, stock-photo gloss, busy
backgrounds, rendered UI chrome, watermarks.

Aspect ratio: `16:9` for full-bleed backgrounds and title slides, `1:1` for a `.panel`
illustration, `21:9` for a wide strip. Pass up to three `reference_images` (https URLs) when
the person wants a style or subject matched.

## Calling and saving

```
generate_image({ prompt, aspect_ratio: "16:9" })
```

The result's text line carries the URL and the structured content carries `url`, `model`,
`aspect_ratio`, and `prompt`. **Save it within the hour** into the deck, then reference it
relatively — Vite's `base: './'` means absolute paths break on alias previews:

```bash
curl -sL -o decks/<deck>/public/images/<slug>.png "<url>"
```

```html
<section data-background-image="images/<slug>.png" data-background-size="cover">
```

Then report the saved path and the prompt used, so a re-roll can edit the prompt rather than
start over.

## Do not

- Call the tool to "see what it looks like" — draft, ask, then call.
- Generate diagrams: those are inline SVG (DESIGN.md), not raster images.
- Put more than a few words of text in the image; the slide carries the copy.
- Leave the URL in the deck source; it expires. The file in `public/images/` is the asset.
