# Workflow video + deck — design

Date: 2026-09-12. Source: capture run `run_01M2BPGAAXCNFKK2Z3GSYC1Y2W` (6:05 screen recording
walking Studio → Studio-as-a-workflow → `workflow-implementations` → hello on workflow.j5s.dev).

## Goal

One chaptered YouTube video (~14 min) introducing **Workflow**, plus a Reveal.js deck whose
slides are cut into the video between screen-recorded demos.

- **Pitch the video leaves behind:** *Write YAML, get the UI.*
- **Audience:** both — Part 1 for anyone (the idea + demo), Part 2 for builders (inside
  `workflow-studio`), Part 3 a closer for everyone.
- **Deck role:** interleaved. Slides carry concepts; screen recording carries demos.

## Deliverables

1. `decks/workflow-talk/` — new deck (name avoids `workflow.bffless.dev`, which is the harness
   itself). Deployed to `workflow-talk.bffless.dev` with the standard per-deck wiring
   (`deploy-workflow-talk.yml`, `preview-workflow-talk.yml`, domain → alias `workflow-talk`,
   path `/decks/workflow-talk/dist`). Dev port 5182.
2. `decks/workflow-talk/STORYBOARD.md` — the scene table below, expanded per scene with: shot
   type (slide / screen), exact on-screen content, talking points, target duration, and for
   screen scenes the URL + click path to record. Talking points are mirrored into each slide's
   `<aside class="notes">`.
3. `decks/workflow-talk/public/images/*` — nano-banana-2 images (see Visual plan).
4. `decks/workflow-talk/public/shots/*` — fresh headless screenshots (`localdev-tools/shot.mjs`,
   1280×720) of workflow.bffless.dev / workflow.j5s.dev / studio.bffless.dev / GitHub. Authed
   pages need a seeded session cookie; any shot that can't be taken becomes a named placeholder
   listed in STORYBOARD.md for the user to record.

## Storyboard

### Part 1 — The idea (~6 min)

| # | Scene | Shot | Beat |
|---|---|---|---|
| 1 | Cold open | Screen | Studio projects grid → an export, fast. "I built an app to make my videos…" |
| 2 | The problem | Slide | Every new pipeline (meetings, capture, podcasts) = another UI to build and maintain |
| 3 | The pitch | Slide | **Write YAML, get the UI.** `studio.workflow.yaml` beside its rendered graph |
| 4 | The analogy | Slide | Like GitHub Actions: `on` / `jobs` / `steps` / `matrix` / `needs`; steps `uses:` `pipeline` · `script` · `island` · `form` |
| 5 | Harness vs implementation | Slide | One harness app (`bffless/apps` → `apps/workflow`), many implementations (`workflow-implementations`). A new workflow is a folder, not an app |
| 6 | Demo: Studio as a workflow | Screen | workflow.bffless.dev → start run → recordings + direction → graph runs → cut-editor island pauses → short, title, blog, cover |

### Part 2 — Inside workflow-studio (~6 min)

| # | Scene | Shot | Beat |
|---|---|---|---|
| 7 | The job map | Slide | per-video → plan → sheets → director → per-scene → stitch → describe / blog / cover |
| 8 | Fan out | Screen (YAML) | `per-video` / `per-scene` matrices, `max-parallel`, `needs.x.outputs[...][sourceIndex]` |
| 9 | Step kinds | Slide + screen | `pipeline` = a proxy rule (`rules/scenes/post` prep/parse `.fn.js`), `script` = local TS, `island` = human-in-the-loop UI (cut-editor), `form` = cover prompts |
| 10 | Where code lives | Screen (repo tree) | `.bffless/workflows`, `proxy-rules`, `islands/`, `scripts/`, tests beside each; shipped by `publish-workflow` |
| 11 | Start with hello | Slide | hello's three workflows (hello / interactive / driven) are the on-ramp |

### Part 3 — Closer (~2 min)

| # | Scene | Shot | Beat |
|---|---|---|---|
| 12 | The meta loop | Screen + slide | Recorded a ramble → capture workflow → transcript + contact sheets → Claude read the run over MCP → planned this video |
| 13 | Outro | Slide | Links: harness, implementations, docs |

## Visual plan

**Exception to house rules (user decision, 2026-09-12):** this deck uses nano-banana-2 raster
images for concept diagrams, not only heroes — DESIGN.md's "diagrams are inline SVG" rule does
not apply to `workflow-talk`. Slides stay sparse (headline + image + ≤ one label line); exact
labels live on the slide, not in the image. The batch below was approved as one yes; each
image is generated in scene order and reported (path + prompt) after saving.

**Shared style anchor:** etched technical-manual linework (same family as the mcp deck's
`hero-pass.jpg`) on ink `#14161a`. Coral `#c95c54`/`#e57368` = human / emphasis, teal
`#4fb8a8` = pipelines / data, violet `#8b7ec8` = AI / models, wire `#4a4a4a` = structure.
In-image text ≤ 5 words. Negatives: neon glow, gradient mesh, photorealistic people, stock
gloss, rendered UI chrome, generic cloud icons, watermarks.

| File | Scene | Ratio | Subject |
|---|---|---|---|
| `hero.jpg` | 1 title | 16:9 | Film reel feeding a conveyor of job stations ending in a finished short; left clear for title |
| `ui-sprawl.jpg` | 2 | 16:9 | Workbench buried under half-built hand-soldered dashboards (Studio, meetings, capture) |
| `yaml-to-ui.jpg` | 3 | 16:9 | YAML scroll → lens → live run graph with cards and a paused step |
| `actions-twin.jpg` | 4 | 16:9 | Two blueprints (Actions-style `on/jobs/steps` and its Workflow twin), matching parts threaded |
| `step-kinds.jpg` | 4 | 21:9 | Four tool plates: pipeline (teal pipe), script (gear), island (coral hand at a screen), form (clipboard) |
| `one-stage.jpg` | 5 | 16:9 | One theatre stage (harness) with swappable scenery cartridges: studio / capture / hello |
| `studio-run.jpg` | 6 | 16:9 | Studio graph illustrated: recordings in, fan-out lanes, violet director, coral cut review, short + blog + cover out |
| `job-metro.jpg` | 7 | 16:9 | Metro map of the nine jobs, branching at the end |
| `fan-out.jpg` | 8 | 16:9 | One video splitting into parallel lanes through max-parallel gates, rejoining like rivers |
| `pipeline-cutaway.jpg` | 9 | 16:9 | Cutaway machine: request → prep.fn → violet model → parse.fn → outputs |
| `island-booth.jpg` | 9 | 16:9 | Conveyor paused at a coral-lit booth, a hand trimming a filmstrip |
| `repo-toolbox.jpg` | 10 | 16:9 | Toolbox drawers: workflows / proxy-rules / islands / scripts; a "publish" stamp press |
| `hello-seedling.jpg` | 11 | 16:9 | Tiny three-station line (greet → answer → echo) with the giant Studio line behind |
| `meta-loop.jpg` | 12 | 16:9 | Loop: person at mic → capture → sheets + transcript → violet AI reading → storyboard → back |
| `recap-plate.jpg` | 13 | 16:9 | Near-invisible line-up of all motifs along the bottom edge |

Each prompt follows the generate-image skill's 8-part anatomy. Budget: 15 generations plus
re-rolls where an image misses (a re-roll is reported, not silently repeated).

## Build order

1. Scaffold `decks/workflow-talk` from `decks/mcp` (package, vite config, main.js, index.html
   skeleton with all 13 scenes as sections + notes). Root scripts `workflow-talk:dev/build`.
2. Write `STORYBOARD.md`.
3. Generate + save images in scene order; wire into slides.
4. Take headless screenshots; wire in or list placeholders.
5. Build + screenshot every slide (`shot.mjs … #/n`) to verify legibility over images
   (use `.scrim` where needed).
6. Deploy workflow YAMLs + domain wiring — **ask before committing/pushing** (a main push is a
   live deploy).

## Out of scope

Recording/editing the video itself; running Studio on the final footage; a separate hello
deep-dive video.
