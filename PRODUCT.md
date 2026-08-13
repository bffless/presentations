# Product

## Register

brand

## Users

Viewers of BFFless teaching sessions: developers and technically-curious people watching a live
talk or the recorded video, plus anyone landing on `<deck>.bffless.dev` afterwards. They're
watching from a projector or a video player, often at a distance, so slides must read at a
glance.

## Product Purpose

A monorepo of Reveal.js slide decks that teach BFFless concepts (first deck: context, RAG and
vector search, culminating in the Recall app). Each deck is a companion to a video episode and a
standalone reference. Success = a viewer walks away able to re-explain the concepts using the
deck's analogies (the library, the map).

## Brand Personality

Warm, plainspoken, mechanical. The BFFless voice: a broken-heart-with-circuit-wires logo, coral
on near-black, developer honesty over marketing gloss. Slides talk like a good teacher, not a
keynote: short declarative lines, one idea per slide, analogies before jargon.

## Anti-references

- Corporate keynote decks: gradient title slides, stock photos of handshakes, dense bullet walls.
- "AI slop" slideware: identical icon-card grids, gradient text, tiny uppercase eyebrows on
  every slide as scaffolding.
- Academic paper decks: dense equations and 10-line bullets. If a diagram can carry it, the
  words go to speaker notes.

## Design Principles

- **Diagrams carry the argument.** Every core concept gets a picture; bullets support, not lead.
- **One visual language, two worlds.** The map scatter and the embedding scatter must look like
  siblings — the analogy IS the design.
- **Readable from the back row.** Distance-first sizing and contrast; nothing essential below
  ~24px rendered.
- **Sparse slide, rich notes.** The visible slide is the picture and the claim; the nuance lives
  in speaker notes.

## Accessibility & Inclusion

Projector-first contrast (body text ≥4.5:1 on the dark ground). Color never the sole channel in
diagrams: pair color with shape/labels. Respect `prefers-reduced-motion` for any non-Reveal
animation; Reveal fragments are presenter-paced, not autoplaying.
