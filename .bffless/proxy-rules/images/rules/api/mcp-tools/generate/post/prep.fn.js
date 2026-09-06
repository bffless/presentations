/**
 * Validate and normalise generate_image's arguments before anything is spent.
 *
 * `mcp_handler` invokes this rule in-process with the tool's arguments as the
 * request body. Anything refused here answers `{ ok: false, error }`, the
 * `generate` step is skipped (its condition is `steps.prep.ok`), and `reply`
 * turns the error into an MCP error result — so a bad call never reaches
 * Replicate and costs nothing.
 *
 * Reference images are kept as `https://` URLs: the replicate handler passes
 * absolute URLs straight through to the model as `image_input`.
 */
var RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9']
var MAX_PROMPT = 2000
var MAX_REFERENCES = 3

function handler({ request }) {
  var body = (request && request.body) || {}

  var prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  var ratio = body.aspect_ratio == null || body.aspect_ratio === '' ? '16:9' : String(body.aspect_ratio)

  if (prompt === '') return refuse('prompt is required', '', ratio)
  if (prompt.length > MAX_PROMPT) return refuse('prompt is longer than ' + MAX_PROMPT + ' characters', '', ratio)
  if (RATIOS.indexOf(ratio) === -1) return refuse('aspect_ratio must be one of ' + RATIOS.join(', '), prompt, ratio)

  var refs = Array.isArray(body.reference_images) ? body.reference_images : []
  var images = []
  for (var i = 0; i < refs.length; i++) {
    var ref = typeof refs[i] === 'string' ? refs[i].trim() : ''
    if (ref.indexOf('https://') !== 0 || /\s/.test(ref)) return refuse('reference_images must be https:// URLs', prompt, ratio)
    images.push(ref)
  }
  if (images.length > MAX_REFERENCES) return refuse('at most ' + MAX_REFERENCES + ' reference_images', prompt, ratio)

  return { ok: true, error: '', prompt: prompt, aspectRatio: ratio, images: images }
}

function refuse(error, prompt, ratio) {
  return { ok: false, error: error, prompt: prompt, aspectRatio: ratio, images: [] }
}
