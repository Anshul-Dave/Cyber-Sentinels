const api = globalThis.browser ?? globalThis.chrome
const scanButton = document.querySelector('#scan')
const resultPanel = document.querySelector('#result')

function showMessage(message, className = 'subtle') {
  resultPanel.replaceChildren()
  const paragraph = document.createElement('p')
  paragraph.className = className
  paragraph.textContent = message
  resultPanel.append(paragraph)
}

function showResult(result) {
  resultPanel.replaceChildren()
  const status = document.createElement('p')
  status.className = `status ${result.score >= 60 ? 'high' : result.score >= 30 ? 'caution' : 'safe'}`
  status.textContent = `${result.score >= 60 ? 'HIGH RISK' : result.score >= 30 ? 'CAUTION' : 'NO STRONG SIGNALS'} · ${result.score}/100`
  const host = document.createElement('p')
  host.className = 'host'
  host.textContent = result.host
  resultPanel.append(status, host)

  const list = document.createElement('ul')
  const reasons = result.reasons.length ? result.reasons : ['No URL-structure warning matched.']
  for (const reason of reasons) {
    const item = document.createElement('li')
    item.textContent = reason
    list.append(item)
  }
  resultPanel.append(list)
}

scanButton.addEventListener('click', async () => {
  scanButton.disabled = true
  showMessage('Checking this URL on your device…')
  try {
    const [tab] = await api.tabs.query({ active: true, currentWindow: true })
    if (!tab?.url || !/^https?:\/\//i.test(tab.url)) {
      showMessage('This browser page cannot be scanned. Open a regular website and try again.', 'error')
      return
    }
    const result = await api.runtime.sendMessage({ type: 'safeguard:analyze-url', url: tab.url })
    if (!result?.ok) throw new Error(result?.error ?? 'URL analysis failed.')
    showResult(result)
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Unable to scan this website.', 'error')
  } finally {
    scanButton.disabled = false
  }
})
