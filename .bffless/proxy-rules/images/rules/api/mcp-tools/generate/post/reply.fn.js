/**
 * Turn the pipeline's outcome into an MCP CallToolResult.
 *
 * CE's `mcp_handler` passes a body that already carries `content[]` through
 * verbatim, so the text line is exactly what the model reads and
 * `structuredContent` is the data. Nothing is stored: the URL is Replicate's
 * delivery URL, valid for about an hour, and the text tells the caller to save
 * it now.
 */
var MODEL = 'google/nano-banana-2'

function handler({ steps }) {
  var prep = (steps && steps.prep) || {}
  if (!prep.ok) return error('generate_image refused: ' + (prep.error || 'invalid arguments'))

  var url = pickUrl((steps && steps.generate) || {})
  if (url === '') return error('generate_image failed: Replicate returned no image')

  var text =
    'Image ready (' + prep.aspectRatio + ', ' + MODEL + '). The URL is valid for about an hour: ' + url +
    '\nSave it now, e.g. curl -sL -o decks/<deck>/public/images/<slug>.png "' + url + '"'

  return {
    json: JSON.stringify({
      content: [{ type: 'text', text: text }],
      structuredContent: { url: url, model: MODEL, aspect_ratio: prep.aspectRatio, prompt: prep.prompt },
    }),
  }
}

/** The replicate step's output is a string, an array of URLs, or an object with `image`/`url`. */
function pickUrl(generate) {
  var out = generate.output != null ? generate.output : generate
  if (typeof out === 'string') return out
  if (out && typeof out.length === 'number') return out.length ? String(out[0]) : ''
  if (out && typeof out.image === 'string') return out.image
  if (out && typeof out.url === 'string') return out.url
  return ''
}

function error(text) {
  return { json: JSON.stringify({ isError: true, content: [{ type: 'text', text: text }] }) }
}
