# Images MCP — layout draft (POC)

Source: bffless/apps#625, discussed 2026-09-06. Decisions taken there:

- A thin wrapper over Replicate `google/nano-banana-2`, nothing to do with Studio.
- Lives in this repo, on the `bffless/presentations` project (admin.bffless.dev).
- No persistence: the tool returns Replicate's delivery URL (valid ~1 h); the caller saves it locally.
- Skill lives in this repo, specific to building decks.
- Connection is OAuth (CE's built-in server on admin.bffless.dev); the rule set is the
  project's **default** set, so the endpoint answers on every deck host.
- Gate: `auth_required` with `roles: [admin]` + `requiredScopes: [images:generate]` on the
  generate rule. Scopes are app vocabulary; nothing to register in CE.

## Repo layout (new files marked +)

```
presentations/
  .mcp.json                                   +  committed, no secrets — the OAuth URL only
  .bffless/
    config.json                               +  { apiUrl, project, ruleSets }
    proxy-rules/images/
      ruleset.yaml                            +  name: images
      rules/
        api/mcp/any.rule.yaml                 +  mcp_handler endpoint (POST; GET/DELETE → 405)
        api/mcp-tools/generate/post/
          rule.yaml                           +  prep → generate (replicate) → reply → respond
          prep.fn.js                          +  validate/normalise args
          prep.fn.test.yaml                   +
          reply.fn.js                         +  Replicate output → CallToolResult
          reply.fn.test.yaml                  +
        _custom/well-known/
          get.rule.yaml                       +  RFC 9728 protected-resource document
  .claude/skills/generate-image/SKILL.md      +  the "ask first, then save locally" skill
  .github/workflows/deploy-rules.yml          +  bffless/deploy-proxy-rules on push to main
  CLAUDE.md                                   ~  drop "no proxy rules"; add the rule-set + skill notes
  .gitignore                                  ~  add .bffless/proxy-rules/*/dist/
```

## Files

### `.bffless/config.json`

```json
{
  "apiUrl": "https://admin.bffless.dev",
  "project": "bffless/presentations",
  "ruleSets": [".bffless/proxy-rules/*"]
}
```

### `ruleset.yaml`

```yaml
name: images
description: generate_image over MCP — a thin wrapper on Replicate google/nano-banana-2. Project default set; answers on every deck host.
```

### `rules/api/mcp/any.rule.yaml` — the endpoint

```yaml
methods: [GET, POST, DELETE]
targetUrl: pipeline
order: 30
pipeline:
  name: images MCP endpoint
  steps:
    - id: mcp
      name: mcp
      handler: mcp_handler
      config:
        serverInfo: { name: bffless-presentations-images, version: 0.1.0 }
        instructions: "One tool, generate_image: renders an image with google/nano-banana-2 on Replicate and returns a temporary URL (about an hour). Each call costs money — confirm the prompt with the person before calling."
        tools:
          - name: generate_image
            description: "Generate one image with google/nano-banana-2. Costs money per call — ask before calling. Returns a Replicate delivery URL valid for roughly an hour; download it (curl -o) into the deck's assets to keep it."
            inputSchema:
              type: object
              properties:
                prompt: { type: string, description: "Full image prompt: subject, style, composition, colours, any text to render." }
                aspect_ratio: { type: string, enum: ["16:9", "9:16", "1:1", "4:3", "3:4", "3:2", "2:3", "21:9"], description: "Default 16:9 (slides)." }
                reference_images: { type: array, items: { type: string }, maxItems: 3, description: "Optional https URLs of reference images (style/subject)." }
              required: [prompt]
              additionalProperties: false
            annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
            rule: { path: /api/mcp-tools/generate, method: POST }
  validators:
    - type: auth_required        # no allowApiKey: bearer app token (OAuth) or session only
description: "Stateless Streamable HTTP MCP endpoint; the tool's gate is on its sibling rule."
```

`auth_required` with no user → 401, which is what makes an MCP client go read the
well-known document and start OAuth.

### `rules/api/mcp-tools/generate/post/rule.yaml` — the tool

```yaml
targetUrl: pipeline
order: 40
timeout: 120000
pipeline:
  name: MCP tool generate_image
  steps:
    - id: prep
      name: prep
      handler: function_handler
      code: ./prep.fn.js            # → { prompt, aspectRatio, images[], error? }
    - id: generate
      name: generate
      handler: replicate
      config:
        model: google/nano-banana-2
        input:
          prompt: steps.prep.prompt
          aspect_ratio: steps.prep.aspectRatio
          image_input: steps.prep.images   # [] when none; https URLs pass straight through
        timeout: 110000
        condition: steps.prep.ok
    - id: reply
      name: reply
      handler: function_handler
      code: ./reply.fn.js           # → { json } a CallToolResult (content[] + structuredContent)
    - id: respond
      name: respond
      handler: response_handler
      config:
        body: "{{{steps.reply.json}}}"
        status: 200
        headers: { Cache-Control: no-store }
        contentType: application/json
  validators:
    - type: auth_required
      config:
        roles: [admin]                      # CE global role: admin | user | member
        requiredScopes: [images:generate]
description: generate_image — scope images:generate, admin only. Needs the project Replicate token.
```

Notes on the steps:

- **prep** trims the prompt (reject empty / > 4000 chars), defaults `aspect_ratio` to `16:9`
  and rejects anything outside the enum, keeps only `https://` reference URLs (max 3), and
  answers `{ ok:false, error }` for bad input so `generate` is skipped.
- **reply** does what Studio's `pickUrl` does (string / array / `{image}` / `{url}` output
  shapes), then answers a CallToolResult. `mcp_handler` passes a body with `content[]`
  through verbatim, so the text line is what the model sees and `structuredContent` is the
  data:
  ```json
  {
    "content": [{ "type": "text", "text": "Image ready (16:9, google/nano-banana-2). URL valid ~1 h: https://replicate.delivery/… — save it with curl -o <deck>/public/images/<slug>.png" }],
    "structuredContent": { "url": "…", "model": "google/nano-banana-2", "aspect_ratio": "16:9", "prompt": "…" }
  }
  ```
  A prep error or empty Replicate output answers `isError: true` with the reason.
- Bad input never reaches Replicate, so a refused call costs nothing.

### `rules/_custom/well-known/get.rule.yaml` — OAuth discovery

One step on CE's `oauth_protected_resource` handler (RFC 9728). Nothing about this
instance is baked in: the handler builds `resource` from the request host, names CE's
real OAuth issuer, and derives `scopes_supported` from the `requiredScopes` on the
tools' sibling rules. It answers regardless of deployment visibility — the caller by
definition has no credential yet — so there is no `bypassVisibility` to remember.

```yaml
pathPattern: /.well-known/oauth-protected-resource*
targetUrl: pipeline
order: 32
pipeline:
  name: OAuth protected-resource metadata
  steps:
    - id: prm
      name: prm
      handler: oauth_protected_resource
      config:
        resource: /api/mcp
        resourceName: Presentations images
        resourceDocumentation: https://github.com/bffless/presentations/blob/main/docs/plans/2026-09-06-images-mcp-layout.md
```

For host `rag.bffless.dev` it answers:

```json
{
  "resource": "https://rag.bffless.dev/api/mcp",
  "authorization_servers": ["https://admin.bffless.dev"],
  "scopes_supported": ["images:generate"],
  "bearer_methods_supported": ["header"],
  "resource_name": "Presentations images",
  "resource_documentation": "https://github.com/bffless/presentations/blob/main/docs/plans/2026-09-06-images-mcp-layout.md"
}
```

The path-suffixed form a client tries first
(`…/oauth-protected-resource/api/mcp`) answers the same document; a suffix naming any
other path is a `404`.

### `.mcp.json`

```json
{ "mcpServers": { "images": { "type": "http", "url": "https://rag.bffless.dev/api/mcp" } } }
```

Committed as-is: OAuth means no secret. In Claude Code, `/mcp` → images → Authenticate
opens the consent page on admin.bffless.dev with the `images:generate` checkbox.

### `.claude/skills/generate-image/SKILL.md`

Frontmatter `name: generate-image`, description triggering on "hero image", "illustration
for this slide", "generate an image", "cover for the deck". Body:

1. **Never call the tool unprompted.** Draft the prompt, state the aspect ratio and that one
   call is a paid Replicate generation, and wait for an explicit yes. One image per yes.
2. **Prompt anatomy** (condensed from Studio's `image-prompts` skill): subject → setting →
   style anchor → composition/framing → palette → text to render (nano-banana renders short
   text well; keep it under ~6 words) → negatives. Brand palette and voice come from
   `DESIGN.md` and `packages/theme/theme.css` (`--bff-*` tokens).
3. **Call** `generate_image` with `prompt`, `aspect_ratio` (16:9 for full-bleed slides, 1:1
   for panels), optional `reference_images`.
4. **Save within the hour**: `curl -sL -o decks/<deck>/public/images/<slug>.png "<url>"`,
   then reference it relatively (`images/<slug>.png`) in the slide — `base: './'` rules.
5. **Report**: show the saved path and the prompt used, so a re-roll can edit it.

### `.github/workflows/deploy-rules.yml`

```yaml
name: Sync proxy rules
on:
  push:
    branches: [main]
    paths: ['.bffless/**', '.github/workflows/deploy-rules.yml']
  workflow_dispatch:
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bffless/deploy-proxy-rules@v1
        with:
          path: .bffless/proxy-rules/images
          api-url: ${{ vars.BFFLESS_URL }}
          api-key: ${{ secrets.BFFLESS_API_KEY }}
          project: bffless/presentations
```

Rules land on merge only (no preview alias needs them). Local dry run before pushing:
`npx bffless rules push --dry-run` from the repo root.

## One-time steps (person)

1. **Replicate token** on project `bffless/presentations` in the admin panel (AI Services);
   MCP cannot set provider tokens.
2. **Make `images` the project default set** after the first sync (the MCP `update_project`
   tool has no such field):
   ```bash
   curl -s -X PATCH https://admin.bffless.dev/api/projects/4af417ac-9f30-4168-8a0c-da196b5c126f -H "X-API-Key: $BFFLESS_API_KEY" -H "Content-Type: application/json" -d '{"defaultProxyRuleSetIds":["<images set id>"]}'
   ```
   Alternative if you'd rather scope it: add `proxy-rule-set-names: images` to
   `deploy-rag.yml`'s upload step and skip the default.
3. **Role**: `admin` is a CE global role (`admin | user | member`), so `roles: [admin]` matches your account. Or
   drop `roles:` and rely on the scope alone — only you can consent on this project anyway.
4. CE on admin.bffless.dev already serves the OAuth server (discovery answered 200 on
   2026-09-06); v0.4.50 is current.

## Verify chain

```bash
npx bffless rules build && npx bffless rules test           # fixtures for the three functions
npx bffless rules push --dry-run                                  # diff against live
curl -s https://rag.bffless.dev/.well-known/oauth-protected-resource   # after sync: the document above
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://rag.bffless.dev/api/mcp   # 401, no credential
# /mcp → images → Authenticate in Claude Code, then one real generate_image call (paid)
```

## Later (not in the POC)

- An MCP image content block in the reply so the picture renders inline in the chat.
- A dedicated `images.bffless.dev` host instead of riding every deck host.
- `resolution` / `output_format` inputs once checked against the model's schema.
- CE: a `google/nano-banana-2` preset in the admin Replicate picker (file against CE).
