/**
 * The RFC 9728 protected-resource document an MCP client reads before it has
 * any credential: this host's MCP endpoint is the resource, CE's built-in
 * OAuth server on `admin.<the rest of the host>` is the authorization server,
 * and `images:generate` is the one scope the consent page offers. Every URL is
 * derived from the request, so the rule set carries no instance name.
 */
var SCOPES = ['images:generate']
var MCP_PATH = '/api/mcp'
var DOCS = 'https://github.com/bffless/presentations/blob/main/docs/plans/2026-09-06-images-mcp-layout.md'

function handler({ request }) {
  var headers = (request && request.headers) || {}
  var host = header(headers, 'x-forwarded-host') || header(headers, 'host')
  if (host === '') return { ok: false, json: JSON.stringify({ error: 'no_host', message: 'the request names no host' }) }

  var doc = {
    resource: 'https://' + host + MCP_PATH,
    authorization_servers: [authorizationServerOf(host)],
    scopes_supported: SCOPES,
    bearer_methods_supported: ['header'],
    resource_name: 'Presentations images',
    resource_documentation: DOCS,
  }
  return { ok: true, json: JSON.stringify(doc) }
}

/** `rag.bffless.dev` → `https://admin.bffless.dev`; a single-label host (localhost, with its port) keeps itself. */
function authorizationServerOf(host) {
  var labels = host.split(':')[0].split('.')
  var adminHost = labels.length > 1 ? ['admin'].concat(labels.slice(1)).join('.') : host
  return 'https://' + adminHost
}

/** Case-insensitive header read; the first value of a list or comma-joined string. */
function header(headers, name) {
  var value
  var keys = Object.keys(headers)
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === name) {
      value = headers[keys[i]]
      break
    }
  }
  var first = Array.isArray(value) ? value[0] : value
  return typeof first === 'string' ? first.split(',')[0].trim() : ''
}
