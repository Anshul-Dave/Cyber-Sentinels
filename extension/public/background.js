if (typeof globalThis.SafeGuardUrlAnalyzer === 'undefined' && typeof importScripts === 'function') {
  importScripts('url-analyzer.js')
}

const runtime = globalThis.browser ?? globalThis.chrome

runtime.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'safeguard:analyze-url' || typeof message.url !== 'string') return false

  try {
    const report = globalThis.SafeGuardUrlAnalyzer.analyzeUrl(message.url)
    sendResponse({
      ok: true,
      score: report.score,
      host: report.host,
      reasons: report.reasons.map((reason) => reason.label),
    })
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : 'URL analysis failed.',
    })
  }
  return false
})
