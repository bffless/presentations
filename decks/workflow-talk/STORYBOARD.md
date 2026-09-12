# Storyboard: "Write YAML, get the UI"

One chaptered video, about 14 minutes. Slides (this deck, `workflow-talk.bffless.dev`) cut in
between screen recordings. Every slide's talking points are also in its speaker notes (press `S`).

Source: the capture run `run_01M2BPGAAXCNFKK2Z3GSYC1Y2W` (a 6-minute ramble through Studio,
workflow.bffless.dev, workflow-implementations and hello). Design:
`docs/plans/2026-09-12-workflow-deck-design.md`.

## Needs you (can't be captured headlessly, all behind login)

- **S1**: studio.bffless.dev projects grid, then open an export (title, director's take, final cut).
- **S6**: workflow.bffless.dev → workflow-studio → "Long recording to published short": start a run through to outputs. Best recorded from a real run; speed up the waiting.
- **S11**: workflow.j5s.dev → hello → run "Driven hello" (or "Hello workflow").
- **S12**: the capture run on workflow.bffless.dev (inputs → transcript + sheets outputs), then this storyboard/deck.

Already captured (public GitHub pages, `public/shots/`): `gh-implementations.png`,
`gh-studio-yaml.png`, `gh-scenes-rule.png`. Handy as B-roll or a fallback if a screen take fails.

---

## Part 1: The idea (~6 min, for everyone)

### S1 · Cold open · screen · 0:30
- **On screen:** Studio projects grid → an export page.
- **Say:** "This is Studio. It's where I make my videos. It's been a while, as you can see."
  Upload a recording; it cuts scenes, a director AI picks the story, I trim, it stitches the
  short and writes the title, description, blog post and cover.

### Title · slide `#title` · 0:10
- **Image:** `hero.jpg` (film reel → conveyor of job stations → finished canister).
- **Say:** "This is Workflow. You describe a pipeline the way you'd write a GitHub Action, and you
  get the whole UI for free."

### S2 · The problem · slide `#s2-problem` · 0:45
- **Image:** `ui-sprawl.jpg` (workbench buried in hand-soldered dashboards: Studio, Meetings, Capture).
- **Say:** Studio is a UI wrapped around one big pipeline. A meetings version, a capture tool, each
  meant another UI to build and maintain. I wanted to keep building pipelines, not UIs.

### S3 · The pitch · slide `#s3-pitch` · 0:45
- **Image:** `yaml-to-ui.jpg` (YAML scroll → lens → run graph with one coral paused step).
- **Say:** The workflow file is the only thing you write. The harness renders the run: graph, live
  status, inputs up front, and steps that pause for a person. An abstraction over the UI layer.

### S4 · The analogy · slides `#s4-analogy` ↓ `#s4b-step-kinds` · 1:15
- **Images:** `actions-twin.jpg` (matching on / jobs / steps blueprints), `step-kinds.jpg` (four plates).
- **Say:** "The model is very much a GitHub pipeline, that was the inspiration": `on` with inputs,
  `jobs` with `needs`, `steps`, `matrix`. The difference: every step `uses:` one of four kinds.
  `pipeline` = a BFFless proxy rule, `script` = sandboxed TypeScript, `island` = a real UI the run
  pauses on, `form` = declared fields in, values out.

### S5 · Harness vs implementation · slide `#s5-harness` · 1:00
- **Image:** `one-stage.jpg` (one stage, cartridges: studio / capture / hello).
- **Say:** The harness is the app (`bffless/apps` → `apps/workflow`), deployed once.
  Implementations are content (`bffless/workflow-implementations`: workflow-studio, capture,
  hello), each published into its own project. A new workflow is a folder, not an app. "I can make
  a Studio geared towards meetings without rebuilding the UI."

### S6 · Demo: Studio as a workflow · slide `#s6-demo` then screen · 2:00
- **Image:** `studio-run.jpg` as a 10-second map, then cut to screen.
- **On screen:** workflow.bffless.dev → workflow-studio → Start a run. Inputs: recordings,
  direction, cover direction. Watch: audio + transcript per video → contact sheets → frames →
  director's take → clips → **cut-editor island pauses, trim** → stitch → title/description →
  blog → cover. End on the outputs.
- **Say:** "This is what the Studio app does, and this is the Studio app as a workflow."

## Part 2: Inside workflow-studio (~6 min, for builders)

### S7 · The job map · slide `#s7-job-map` · 1:00
- **Image:** `job-metro.jpg` (per-video → plan → sheets → director → per-scene → stitch → describe / blog / cover).
- **Say:** All of Studio is one ~540-line file. Double track = matrix. Violet = the AI director,
  coral = your trim. After stitch it branches three ways.

### S8 · Fan out, fan in · slide `#s8-fan-out` then screen · 1:30
- **Image:** `fan-out.jpg` (throttle gate, parallel lanes, rejoin).
- **On screen:** `studio.workflow.yaml` (`gh-studio-yaml.png` as fallback): `per-video`
  (`matrix: video: inputs.recordings`, max-parallel 2), `per-scene` (matrix over
  `needs.director.outputs.scenes`, max-parallel 3, fail-fast false).
- **Say:** max-parallel is the gate. Fan-in is
  `needs.per-video.outputs.words[matrix.scene.sourceIndex]`: each scene reaches back to its own
  video's transcript.

### S9 · Step kinds up close · slides `#s9-pipeline` ↓ `#s9b-island` · 1:30
- **Images:** `pipeline-cutaway.jpg` (request → prep → violet model → parse → outputs),
  `island-booth.jpg` (conveyor paused at a booth, hands trimming film).
- **On screen:** `rules/scenes/post/` (`gh-scenes-rule.png`): rule.yaml, prep / parse / collect /
  sweep `.fn.js`, each with a `.fn.test.yaml`. Then `islands/cut-editor`.
- **Say:** A pipeline step is a proxy rule: prep shapes the request, the model thinks, parse turns
  the answer into typed outputs. An island stops the run and mounts a real React UI; its outputs
  (keep spans) flow on. `form` is the lightweight version (the cover job's prompts).

### S10 · A workflow is a folder · slide `#s10-repo` then screen · 1:00
- **Image:** `repo-toolbox.jpg` (drawers: workflows / proxy-rules / islands / scripts → publish press).
- **On screen:** github.com/bffless/workflow-implementations → workflows/workflow-studio
  (`gh-implementations.png`).
- **Say:** Tests beside every piece. CI runs `publish-workflow`, which syncs the rules and uploads
  the bundle.

### S11 · Start with hello · slide `#s11-hello` then screen · 1:00
- **Image:** `hello-seedling.jpg` (tiny three-station line in front of the giant Studio line).
- **On screen:** workflow.j5s.dev → hello → Driven hello (form between two echo pipelines).
- **Say:** "Studio is the most complicated one. When you're learning, look at hello." Same machine:
  greet, a person answers, echo. Three workflow files, a handful of rules, two islands.

## Part 3: Closer (~2 min)

### S12 · This video planned itself · slide `#s12-meta` then screen · 1:30
- **Image:** `meta-loop.jpg` (mic + laptop → capture machine → transcript + sheets → violet reader → storyboard → back).
- **On screen:** the capture run's outputs, then this storyboard.
- **Say:** "I didn't know how to structure this video, so I recorded myself rambling, ran the
  capture workflow on it, and handed the run to Claude over the harness MCP. It asked me
  questions, then planned this storyboard and this deck. It drew the pictures too."

### S13 · Outro · slide `#s13-outro` · 0:20
- **Image:** `recap-plate.jpg` (motifs along the bottom edge).
- **Say:** Start with hello; read workflow-studio when you want the full thing. Links on screen.
