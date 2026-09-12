# workflow-talk deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `workflow-talk` Reveal.js deck, its STORYBOARD.md, 15 nano-banana images and headless screenshots for the "Write YAML, get the UI" Workflow video.

**Architecture:** A new deck under `decks/workflow-talk`, cloned from `decks/mcp`'s scaffold (Vite 8 + Reveal 6 + `@presentations/theme`). Slides are sparse `<section>`s with image backgrounds or figures; talking points live in `<aside class="notes">`, mirrored from STORYBOARD.md. Images come from the `generate_image` MCP tool and are saved to `public/images/`.

**Tech Stack:** Reveal.js 6, Vite 8, pnpm workspace, `generate_image` (google/nano-banana-2), `localdev-tools/shot.mjs` (Playwright).

**Spec:** `docs/plans/2026-09-12-workflow-deck-design.md`

## Global Constraints

- Deck name `workflow-talk`; domain `workflow-talk.bffless.dev`; dev port **5182**.
- Vite `base: './'`; all asset refs relative (`images/x.jpg`, never `/images/x.jpg`).
- Theme import order: reveal.css → theme/black.css → highlight css → `@presentations/theme/theme.css`.
- Images: shared style anchor + palette + negatives from the spec; ≤ 5 words of in-image text; saved as `decks/workflow-talk/public/images/<file>` within the hour; never leave a Replicate URL in source.
- Slides: headline + image + ≤ one label line. Rich talking points only in notes.
- Verification = `pnpm --filter workflow-talk build` green + `shot.mjs` with `consoleErrors:0, failedRequests:0`.
- **Never push to main without asking** — a push touching `decks/workflow-talk/**` is a live deploy.

---

### Task 1: Scaffold the deck

**Files:**
- Create: `decks/workflow-talk/{package.json,vite.config.js,src/main.js,index.html}`
- Create: `decks/workflow-talk/public/{favicon.svg,logo.svg}` (copied from `decks/mcp/public`)
- Modify: `package.json` (root scripts)

**Interfaces:** Produces the 13-scene section skeleton with stable `id`s (`s1-cold-open` … `s13-outro`) that later tasks fill.

- [ ] Copy `decks/mcp/{package.json,vite.config.js,src/main.js}`; set `name: "workflow-talk"`, description "Write YAML, get the UI — the Workflow harness", port 5182.
- [ ] Write `index.html`: one `<section id="s…">` per storyboard scene (Part kicker slides between parts), each with a headline and a notes aside.
- [ ] Root scripts: `workflow-talk:dev|build|preview`.
- [ ] `pnpm install && pnpm --filter workflow-talk build` → green.
- [ ] `pnpm --filter workflow-talk dev` then `node shot.mjs http://localhost:5182/ --out …/title.png --width 1280 --height 720` → 0 errors.
- [ ] Commit `feat(workflow-talk): scaffold deck`.

### Task 2: STORYBOARD.md

**Files:** Create `decks/workflow-talk/STORYBOARD.md`

- [ ] For each of the 13 scenes: shot type, on-screen content (slide id or URL + click path), talking points (3–6 bullets, in the user's voice from the capture transcript), target duration, assets used.
- [ ] Copy talking points into the matching slide's notes.
- [ ] Commit `docs(workflow-talk): storyboard`.

### Task 3: Images (15, scene order)

**Files:** Create `decks/workflow-talk/public/images/*.jpg`; Modify `index.html`

- [ ] For each row of the spec's image table: write the 8-part prompt, call `generate_image`, `curl -sL -o public/images/<file> "<url>"` immediately, report path + prompt.
- [ ] Wire: title/recap as `data-background-image` + `.scrim`; concept images as a full-width `<img class="figure">` under the headline.
- [ ] Re-roll only when an image misses the brief (wrong subject, garbled text, unreadable on ink); report each re-roll.
- [ ] Build + shot the affected slides.
- [ ] Commit `feat(workflow-talk): generated imagery`.

### Task 4: Screenshots

**Files:** Create `decks/workflow-talk/public/shots/*.png`; Modify `index.html`, `STORYBOARD.md`

- [ ] Shoot public pages at 1280×720: GitHub `bffless/workflow-implementations` tree + `workflows/workflow-studio/.bffless/workflows/studio.workflow.yaml`, `workflows/hello`.
- [ ] Try workflow.j5s.dev / workflow.bffless.dev / studio.bffless.dev; if gated, record each missing shot as a named placeholder in STORYBOARD.md ("Needs you: …").
- [ ] Commit `feat(workflow-talk): screenshots`.

### Task 5: Verify every slide

- [ ] Build, run dev, shot every slide (`#/n` and vertical `#/n/m`) into scratchpad.
- [ ] Review each image for legibility/overflow; fix CSS (scrim, figure max-height) in-deck, or in `packages/theme` only if reusable.
- [ ] Commit fixes.

### Task 6: Deploy wiring (gated on user yes)

**Files:** Create `.github/workflows/{deploy,preview}-workflow-talk.yml` (copy mcp's, s/mcp/workflow-talk/)

- [ ] Write the two workflow files; commit locally.
- [ ] **Ask the user** before `git push` (live deploy) and before creating the `workflow-talk.bffless.dev` domain (admin.bffless.dev, project `bffless/presentations`, alias `workflow-talk`, path `/decks/workflow-talk/dist`).
