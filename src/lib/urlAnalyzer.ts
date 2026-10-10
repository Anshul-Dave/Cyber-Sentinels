export interface UrlReason {
  label: string
  weight: number
}

export interface UrlReport {
  score: number
  reasons: UrlReason[]
  host: string
}

const SHORTENERS = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'cutt.ly', 'rb.gy', 'shorturl', 'is.gd', 'ow.ly', 'buff.ly']
const BAD_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.link', '.buzz', '.live', '.quest', '.monster', '.icu', '.cam', '.rest']
const BRANDS: { name: string; official: RegExp }[] = [
  { name: 'Paytm', official: /(^|\.)paytm\.(com|in)$/i },
  { name: 'SBI', official: /(^|\.)onlinesbi\.(com|in)$|(^|\.)sbi\.co\.in$/i },
  { name: 'HDFC', official: /(^|\.)hdfcbank\.com$/i },
  { name: 'ICICI', official: /(^|\.)icicibank\.com$/i },
  { name: 'PayPal', official: /(^|\.)paypal\.com$/i },
  { name: 'Apple', official: /(^|\.)apple\.com$/i },
  { name: 'Netflix', official: /(^|\.)netflix\.com$/i },
  { name: 'Amazon', official: /(^|\.)amazon\.[a-z.]+$/i },
  { name: 'IRCTC', official: /(^|\.)irctc\.co\.in$/i },
]

export function analyzeUrl(raw: string): UrlReport {
  const reasons: UrlReason[] = []
  let score = 0
  const add = (label: string, weight: number) => {
    reasons.push({ label, weight })
    score += weight
  }

  let url: URL
  let candidate = raw.trim()
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) candidate = 'http://' + candidate
  try {
    url = new URL(candidate)
  } catch {
    return { score: 65, reasons: [{ label: 'Malformed URL — cannot be verified', weight: 65 }], host: candidate }
  }

  const host = url.hostname.toLowerCase()
  const path = (url.pathname + url.search).toLowerCase()

  if (url.protocol === 'upi:') {
    add('Standard UPI payment link format', 0)
  } else {
    if (url.protocol !== 'https:') add('No HTTPS encryption', 18)
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add('Raw IP address instead of a domain', 30)
  }
  
  if (raw.includes('@') && url.protocol !== 'upi:') add('@ symbol hides the real destination', 28)
  const subs = host.split('.').length - 2
  if (subs >= 3) add(`Excessive subdomains (${subs})`, 16)
  else if (subs === 2) add('Nested subdomain', 7)
  if (host.length > 30) add('Abnormally long domain name', 10)
  if (host.startsWith('xn--') || host.includes('.xn--')) add('Punycode / look-alike characters', 25)
  if (SHORTENERS.some((s) => host === s || host.endsWith('.' + s))) add('URL shortener hides true destination', 20)
  const tld = host.slice(host.lastIndexOf('.'))
  if (BAD_TLDS.includes(tld)) add(`High-abuse TLD (${tld})`, 16)
  if ((host.match(/-/g) ?? []).length >= 3) add('Excessive hyphens in domain', 9)
  if (/\d{4,}/.test(host)) add('Long digit string in domain', 8)
  if (url.port && !['80', '443', ''].includes(url.port)) add('Non-standard port', 12)
  if (/\b(login|verify|secure|account|update|confirm|billing|signin|wallet|kyc)\b/.test(path))
    add('Credential-harvesting keywords in path', 14)

  for (const brand of BRANDS) {
    if (host.includes(brand.name.toLowerCase()) && !brand.official.test(host)) {
      add(`Impersonates ${brand.name} — not the official domain`, 34)
      break
    }
  }

  return { score: Math.min(score, 100), reasons, host }
}
