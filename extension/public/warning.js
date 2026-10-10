const params = new URLSearchParams(window.location.search)
const target = params.get('url')
const status = document.querySelector('#status')
const title = document.querySelector('#title')
const hostLabel = document.querySelector('#host')
const message = document.querySelector('#message')
const reasonsList = document.querySelector('#reasons')
const continueButton = document.querySelector('#continue')

let safeTarget = null
try {
  const parsed = new URL(target)
  if (parsed.protocol === 'http:' || parsed.protocol === 'https:') safeTarget = parsed
} catch {
  safeTarget = null
}

if (safeTarget) hostLabel.textContent = safeTarget.hostname
else {
  hostLabel.textContent = 'Destination unavailable'
  continueButton.disabled = true
}

const error = params.get('error')
if (error) {
  status.className = 'status caution'
  status.textContent = 'UNABLE TO CHECK'
  title.textContent = 'We could not verify this link'
  message.textContent = error
} else {
  const score = Number(params.get('score'))
  if (Number.isFinite(score)) {
    status.className = `status ${score >= 60 ? 'high' : 'caution'}`
    status.textContent = `${score >= 60 ? 'HIGH RISK' : 'CAUTION'} · ${score}/100`
  }
  try {
    const reasons = JSON.parse(params.get('reasons') ?? '[]')
    if (Array.isArray(reasons)) {
      for (const reason of reasons) {
        if (typeof reason !== 'string') continue
        const item = document.createElement('li')
        item.textContent = reason
        reasonsList.append(item)
      }
    }
  } catch {
    message.textContent = 'The link has risk signals, but the details could not be loaded.'
  }
}

document.querySelector('#back').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back()
  else window.location.replace('about:blank')
})

continueButton.addEventListener('click', () => {
  if (safeTarget) {
    const newUrl = new URL(safeTarget.href)
    newUrl.searchParams.set('safeguard_override', '1')
    window.location.assign(newUrl.href)
  }
})
