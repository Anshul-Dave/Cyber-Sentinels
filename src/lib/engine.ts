// SafeGuard AI — fully on-device threat detection engine.
// Layers: (1) rule engine, (2) TF-IDF + logistic regression model (36 KB, in-browser),
// (3) URL structural analyzer. No network calls. No data leaves the device.

import modelJson from '../assets/scam_model.json'
import { analyzeUrl } from './urlAnalyzer'

export { analyzeUrl, type UrlReport } from './urlAnalyzer'

export type ThreatLevel = 'SAFE' | 'CAUTION' | 'HIGH RISK'
export type ThreatCategory =
  | 'PHISHING'
  | 'FINANCIAL SCAM'
  | 'PRIZE / LOTTERY SCAM'
  | 'IMPERSONATION'
  | 'MALICIOUS LINK'
  | 'SAFE'

export interface Reason {
  label: string
  weight: number
}

export interface RiskResult {
  id: string
  kind: 'message' | 'url' | 'qr' | 'screenshot'
  input: string
  score: number
  level: ThreatLevel
  category: ThreatCategory
  reasons: Reason[]
  recommendation: string
  explanation: string
  mlScore: number
  ruleScore: number
  urlScore: number | null
  urlHost?: string
  isAiImage?: boolean
  scannedAt: number
  onDevice: true
}

// ---------------- ML model (TF-IDF + Logistic Regression) ----------------

interface Model {
  vocab: Record<string, number>
  idf: number[]
  coef: number[]
  intercept: number
  meta: { name: string; version: string; features: number }
}

const model = modelJson as unknown as Model
export const MODEL_META = model.meta

const TOKEN_RE = /[a-z0-9]+/g

export function mlScore(text: string): number {
  const tokens = text.toLowerCase().match(TOKEN_RE) ?? []
  if (tokens.length === 0) return 0
  const tf = new Map<string, number>()
  for (let i = 0; i < tokens.length; i++) {
    tf.set(tokens[i], (tf.get(tokens[i]) ?? 0) + 1)
    if (i < tokens.length - 1) {
      const gram = tokens[i] + ' ' + tokens[i + 1]
      tf.set(gram, (tf.get(gram) ?? 0) + 1)
    }
  }
  let s = model.intercept
  for (const [term, count] of tf) {
    const j = model.vocab[term]
    if (j === undefined) continue
    const val = (1 + Math.log(count)) * model.idf[j]
    s += val * model.coef[j]
  }
  // squash into 0..1; scaled to be conservative on borderline text
  return 1 / (1 + Math.exp(-s * 0.9))
}

// ---------------- Rule engine ----------------

interface Rule {
  id: string
  test: RegExp
  keywords?: string[]
  weight: number
  label: string
  cat: ThreatCategory
}

const MESSAGE_RULES: Rule[] = [
  { id: 'urgency', test: /\b(urgent|immediately|act now|final notice|final warning|last chance|within \d+ hours?|expires? (today|tonight|soon)|right now)\b/i, keywords: ['तुरंत', 'जल्द', 'अर्जेंट', 'अभी', 'तातडीने', 'ઝડપથી', 'તાત્કાલિક', 'અત્યારે'], weight: 14, label: 'Urgency / pressure tactic detected', cat: 'PHISHING' },
  { id: 'otp', test: /\b(otp|one[- ]time password|verification code|upi pin|atm pin)\b/i, keywords: ['ओटीपी', 'पिन'], weight: 22, label: 'OTP / PIN requested or mentioned', cat: 'PHISHING' },
  { id: 'credentials', test: /\b(password|cvv|card number|bank details?|account number|ifsc|security code)\b/i, keywords: ['पासवर्ड', 'खाता नंबर', 'કાર્ડ નંબર'], weight: 18, label: 'Asks for credentials or card data', cat: 'PHISHING' },
  { id: 'acct_threat', test: /\b(account|card|sim|wallet|net ?banking|kyc)\b[^.]{0,40}\b(blocked|suspended|frozen|deactivated|locked|limited|expire[ds]?)\b|\b(blocked|suspended|frozen|deactivated|locked|limited)\b[^.]{0,40}\b(account|card|sim|wallet|kyc)\b/i, keywords: ['ब्लॉक', 'बंद', 'सस्पेंड', 'अकाउंट', 'खाता'], weight: 20, label: 'Account suspension threat', cat: 'IMPERSONATION' },
  { id: 'bank', test: /\b(sbi|hdfc|icici|axis|kotak|pnb|paytm|paypal|bank|rbi|income tax|irs|customs)\b/i, keywords: ['बैंक', 'ઇન્કમ ટેક્સ'], weight: 8, label: 'Impersonates a bank / authority', cat: 'IMPERSONATION' },
  { id: 'prize', test: /\b(congratulations|you (have )?won|winner|prize|lottery|lucky draw|jackpot|cashback|reward)\b/i, keywords: ['बधाई हो', 'लकी ड्रॉ', 'इनाम', 'लॉटरी', 'जीते हैं', 'कैशबैक', 'અભિનંદન', 'તમે જીત્યા', 'ઇનામ'], weight: 18, label: 'Fake prize / lottery lure', cat: 'PRIZE / LOTTERY SCAM' },
  { id: 'payment', test: /\b(pay|payment|fee|penalty|fine|charge)\b[^.]{0,30}\b(now|immediately|urgent|today|to avoid)\b/i, keywords: ['फ़ीस', 'भुगतान', 'जुर्माना', 'पैसे', 'ફી ચૂકવો', 'अभी', 'तुरंत', 'होगी', 'देना होगा', 'ચૂકવો', 'અત્યારે'], weight: 15, label: 'Payment demanded under pressure', cat: 'FINANCIAL SCAM' },
  { id: 'crypto', test: /\b(bitcoin|btc|crypto|usdt|double your|guaranteed returns?|investment)\b/i, keywords: ['बिटकॉइन', 'दोगुना', 'इन्वेस्टमेंट'], weight: 14, label: 'Crypto / guaranteed-return scheme', cat: 'FINANCIAL SCAM' },
  { id: 'authority', test: /\b(legal action|arrest|police|court order|lawsuit|warrant)\b/i, keywords: ['पुलिस', 'अरेस्ट', 'कोर्ट', 'વોરંટ', 'પોલીસ'], weight: 16, label: 'Threatens legal action', cat: 'IMPERSONATION' },
  { id: 'refund', test: /\b(refund|subsidy|claim)\b[^.]{0,40}\b(click|enter|link|details|upi)\b/i, keywords: ['रिफंड', 'सब्सिडी', 'क्लेम', 'क्लिक', 'लिंक', 'વિગતો'], weight: 13, label: 'Refund / claim bait', cat: 'FINANCIAL SCAM' },
  { id: 'job', test: /\b(work from home|earn\b[^.]{0,20}\b(daily|weekly)|registration fee|part[- ]time job)\b/i, keywords: ['घर बैठे', 'पार्ट टाइम', 'रोजगार', 'नौकरी', 'નોકરી'], weight: 13, label: 'Job / easy-money scam pattern', cat: 'FINANCIAL SCAM' },
  { id: 'link', test: /(https?:\/\/|www\.|bit\.ly|tinyurl|t\.co\/|cutt\.ly)/i, weight: 8, label: 'Contains an embedded link', cat: 'MALICIOUS LINK' },
  { id: 'stranger_family', test: /\b(lost my phone|new number|send (me )?money|need money urgently)\b/i, keywords: ['नया नंबर', 'पैसे भेज', 'अर्जेंट पैसे'], weight: 15, label: 'Family-in-distress impersonation', cat: 'IMPERSONATION' },
]

// ---------------- Combined risk engine ----------------

const CATEGORY_PRIORITY: ThreatCategory[] = [
  'PHISHING', 'IMPERSONATION', 'FINANCIAL SCAM', 'PRIZE / LOTTERY SCAM', 'MALICIOUS LINK',
]

function recommendationFor(category: ThreatCategory, level: ThreatLevel): string {
  if (level === 'SAFE') return 'No threat indicators found. Stay alert — no action needed.'
  switch (category) {
    case 'PHISHING':
      return 'Do not share any OTP, PIN or password. Contact the organization through its official app or helpline.'
    case 'IMPERSONATION':
      return 'Verify directly with the real institution using its official number — never the contact in this message.'
    case 'FINANCIAL SCAM':
      return 'Do not pay or share card details. Report the sender to your bank and the national cybercrime portal.'
    case 'PRIZE / LOTTERY SCAM':
      return 'Legitimate lotteries never ask for fees or bank details. Delete and block the sender.'
    case 'MALICIOUS LINK':
      return 'Do not open the link. If you already did, change your passwords from a trusted device immediately.'
    default:
      return 'Proceed with caution and avoid sharing sensitive information.'
  }
}

function explain(result: { score: number; level: ThreatLevel; category: ThreatCategory; reasons: Reason[]; ml: number; url: number | null; rule: number }): string {
  const top = result.reasons.slice(0, 3).map((r) => r.label.toLowerCase())
  const modelScore = Math.round(result.ml * 100)
  const signals = `On-device text-classifier score: ${modelScore}/100; scam-pattern rule score: ${Math.round(result.rule)}/100${result.url !== null ? `; URL-structure score: ${Math.round(result.url)}/100` : ''}. These are heuristic signal scores, not probabilities or a guarantee.`
  if (result.level === 'SAFE') {
    return `No strong scam indicators matched in the supplied content. ${signals} This is an automated screening result, not a guarantee that the content is safe.`
  }
  const joined = top.length > 1 ? top.slice(0, -1).join(', ') + ' and ' + top[top.length - 1] : top[0]
  const reason = joined ? `because the supplied content matched ${joined}` : 'because the classifier score crossed the risk threshold'
  return `Flagged ${result.level.toLowerCase()} (${Math.round(result.score)}%) ${reason}. ${signals}`
}

// Translation API removed to enforce 100% on-device privacy

export async function analyzeMessage(rawText: string, kind: 'message' | 'qr' | 'screenshot' = 'message'): Promise<RiskResult> {
  if (!rawText.trim()) throw new Error('Cannot analyze an empty message or QR payload.')
  
  // Kept 100% on-device. Relies on multilingual rules instead of external translation.
  const text = rawText

  const reasons: Reason[] = []
  let ruleRaw = 0
  const catVotes = new Map<ThreatCategory, number>()

  for (const rule of MESSAGE_RULES) {
    let matched = rule.test.test(text)
    if (!matched && rule.keywords) {
      matched = rule.keywords.some((kw) => rawText.toLowerCase().includes(kw.toLowerCase()))
    }
    if (matched) {
      reasons.push({ label: rule.label, weight: rule.weight })
      ruleRaw += rule.weight
      catVotes.set(rule.cat, (catVotes.get(rule.cat) ?? 0) + rule.weight)
    }
  }

  // embedded URLs get structural analysis too
  const urlMatch = text.match(/(https?:\/\/[^\s]+|(?:bit\.ly|tinyurl\.com|t\.co)\/[^\s]+)/i)
  let urlScore: number | null = null
  let urlHost: string | undefined = undefined
  if (urlMatch) {
    const rep = analyzeUrl(urlMatch[0])
    urlScore = rep.score
    urlHost = rep.host
    reasons.push(...rep.reasons)
    if (rep.score > 40) catVotes.set('MALICIOUS LINK', (catVotes.get('MALICIOUS LINK') ?? 0) + rep.score * 0.5)
  }

  const ml = mlScore(text)
  const ruleScore = Math.min(100, ruleRaw * 1.6)
  const combined =
    0.45 * (ml * 100) + 0.35 * ruleScore + 0.2 * (urlScore ?? ruleScore * 0.6)

  const score = Math.max(0, Math.min(100, combined))
  const level: ThreatLevel = score >= 60 ? 'HIGH RISK' : score >= 30 ? 'CAUTION' : 'SAFE'

  let category: ThreatCategory = 'SAFE'
  if (level !== 'SAFE') {
    category =
      CATEGORY_PRIORITY.map((c) => [c, catVotes.get(c) ?? 0] as const)
        .sort((a, b) => b[1] - a[1])[0][0] ?? 'PHISHING'
    if ((catVotes.get(category) ?? 0) === 0) category = ml > 0.6 ? 'PHISHING' : 'FINANCIAL SCAM'
  }

  reasons.sort((a, b) => b.weight - a.weight)
  const partial = { score, level, category, reasons, ml, url: urlScore, rule: ruleScore }

  return {
    id: crypto.randomUUID(),
    kind,
    input: rawText.slice(0, 500),
    score: Math.round(score),
    level,
    category,
    reasons,
    recommendation: recommendationFor(category, level),
    explanation: explain(partial),
    mlScore: Math.round(ml * 100),
    ruleScore: Math.round(ruleScore),
    urlScore: urlScore === null ? null : Math.round(urlScore),
    urlHost,
    scannedAt: Date.now(),
    onDevice: true,
  }
}

export function analyzeLink(raw: string, kind: 'url' | 'qr' = 'url'): RiskResult {
  if (!raw.trim()) throw new Error('Cannot analyze an empty URL or QR payload.')

  const rep = analyzeUrl(raw)
  const ml = mlScore(raw.replace(/[^a-zA-Z0-9 ]/g, ' '))
  const score = Math.min(100, Math.round(rep.score * 0.85 + ml * 100 * 0.15))
  const level: ThreatLevel = score >= 60 ? 'HIGH RISK' : score >= 30 ? 'CAUTION' : 'SAFE'
  const category: ThreatCategory = level === 'SAFE' ? 'SAFE' : rep.reasons.some((r) => r.label.includes('Impersonates')) ? 'IMPERSONATION' : 'MALICIOUS LINK'
  rep.reasons.sort((a, b) => b.weight - a.weight)

  const partial = { score, level, category, reasons: rep.reasons, ml, url: rep.score, rule: rep.score }
  return {
    id: crypto.randomUUID(),
    kind,
    input: raw.slice(0, 500),
    score,
    level,
    category,
    reasons: rep.reasons.length ? rep.reasons : [{ label: 'Domain structure looks normal', weight: 0 }],
    recommendation: recommendationFor(category, level),
    explanation: explain(partial),
    mlScore: Math.round(ml * 100),
    ruleScore: rep.score,
    urlScore: rep.score,
    urlHost: rep.host,
    scannedAt: Date.now(),
    onDevice: true,
  }
}
