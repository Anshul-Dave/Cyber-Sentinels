(() => {
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
  if (!runtime) return

  const warningUrl = (url, reasons, error, score) => {
    const warning = new URL(runtime.getURL('warning.html'))
    warning.searchParams.set('url', url)
    if (reasons?.length) warning.searchParams.set('reasons', JSON.stringify(reasons))
    if (error) warning.searchParams.set('error', error)
    if (Number.isFinite(score)) warning.searchParams.set('score', String(score))
    return warning.href
  }

  // Check the current page automatically on load
  const currentUrl = window.location.href
  if (currentUrl.startsWith('http') && !currentUrl.includes('safeguard_override=1')) {
    runtime.sendMessage({ type: 'safeguard:analyze-url', url: currentUrl })
      .then((result) => {
        if (result?.ok && result.score >= 50) {
          window.location.replace(warningUrl(currentUrl, result.reasons, undefined, result.score))
        }
      })
      .catch(() => {})
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return
    const anchor = event.target.closest('a[href]')
    if (!anchor || anchor.hasAttribute('download')) return

    let destination
    try {
      destination = new URL(anchor.href)
    } catch {
      return
    }
    if (destination.protocol !== 'http:' && destination.protocol !== 'https:') return

    const opensSeparateContext =
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey ||
      (anchor.target && anchor.target !== '_self')
    const separateWindow = opensSeparateContext
      ? window.open('about:blank', anchor.target && anchor.target !== '_self' ? anchor.target : '_blank')
      : null

    event.preventDefault()
    event.stopImmediatePropagation()

    const navigate = (url) => {
      if (separateWindow && !separateWindow.closed) separateWindow.location.replace(url)
      else window.location.assign(url)
    }

    runtime.sendMessage({ type: 'safeguard:analyze-url', url: destination.href })
      .then((result) => {
        if (!result?.ok) {
          navigate(warningUrl(destination.href, [], result?.error ?? 'The link could not be checked.'))
          return
        }
        if (result.score >= 50) {
          navigate(warningUrl(destination.href, result.reasons, undefined, result.score))
          return
        }
        navigate(destination.href)
      })
      .catch((error) => {
        navigate(warningUrl(destination.href, [], error instanceof Error ? error.message : 'The link could not be checked.'))
      })
  }, true)
})()
