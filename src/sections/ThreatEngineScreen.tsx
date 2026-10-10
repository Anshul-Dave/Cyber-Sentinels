import { BrainCircuit, Database, ShieldCheck, Sparkles, WifiOff } from 'lucide-react'

const layers = [
  {
    name: 'Layer 1 — Rules',
    color: 'var(--cyan)',
    detail: 'Fast local checks for urgency, OTP requests, fake bank claims, payment pressure, and suspicious patterns.',
    tags: ['urgency', 'OTP', 'bank impersonation', 'payment pressure'],
  },
  {
    name: 'Layer 2 — URL Intelligence',
    color: 'var(--mint)',
    detail: 'Looks at HTTPS, shorteners, bad TLDs, look-alike brands, nested subdomains, and suspicious URL structure.',
    tags: ['HTTPS', 'shorteners', 'brand look-alikes', 'domain structure'],
  },
  {
    name: 'Layer 3 — AI / NLP',
    color: 'var(--amber)',
    detail: 'Contextualizes language to spot social engineering, emotional manipulation, and phishing intent beyond keyword blocks.',
    tags: ['intent', 'deception', 'pressure', 'context'],
  },
  {
    name: 'Layer 4 — Reputation',
    color: 'var(--red)',
    detail: 'Combines known suspicious numbers, UPI IDs, domains, reports, and scam clusters to raise threats with evidence.',
    tags: ['known scam IDs', 'community signals', 'history'],
  },
  {
    name: 'Layer 5 — Community Reports',
    color: 'var(--cyan)',
    detail: 'Anonymous user reports help spot repeat scam campaigns and newly discovered patterns faster across the network.',
    tags: ['anonymous reports', 'rising trends', 'campaign detection'],
  },
]

export function ThreatEngineScreen() {
  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">feature 03</div>
        <h2 className="text-xl font-semibold">Multi-Layer Detection Engine</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          SafeGuard AI should not rely on a single model or single rule. The score gets stronger when it combines fast rules, URL checks, AI reasoning, and reputation signals.
        </p>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-[var(--cyan)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--cyan)]">ENGINE ARCHITECTURE</span>
        </div>

        <div className="space-y-3">
          {layers.map((layer) => (
            <div key={layer.name} className="rounded-xl border border-[var(--border)] bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-mono2 text-[12px] font-bold tracking-[0.12em] text-[var(--text-1)]">{layer.name}</span>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: layer.color }} />
              </div>
              <p className="text-[13px] leading-relaxed text-[var(--text-2)]">{layer.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {layer.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border)] px-2 py-1 font-mono2 text-[9px] text-[var(--text-3)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel rise-in p-4" style={{ animationDelay: '0.12s' }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--mint)]" />
            <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--mint)]">WHY IT MATTERS</span>
          </div>
          <ul className="space-y-2 text-[13px] leading-relaxed text-[var(--text-2)]">
            <li>• Rules are fast and explainable.</li>
            <li>• URL checks catch malformed or impersonating domains.</li>
            <li>• AI adds context to scam language beyond keywords.</li>
            <li>• Reputation signals reduce false negatives on known threats.</li>
          </ul>
        </div>

        <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
          <div className="mb-3 flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-[var(--amber)]" />
            <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--amber)]">PRIVACY FRIENDLY</span>
          </div>
          <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
            This engine runs locally by default, combining on-device checks with optional local reputation lists. Nothing sensitive is sent to a server unless the user intentionally enables a shared intelligence feature.
          </p>
        </div>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.18s' }}>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--cyan)]">DETECTION SIGNAL EXAMPLE</span>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-black/20 p-3">
          <div className="mb-2 font-mono2 text-[11px] tracking-[0.12em] text-[var(--text-2)]">SUSPICIOUS MESSAGE</div>
          <p className="text-[13px] leading-relaxed text-[var(--text-1)]">
            “Your KYC verification is pending. Share your OTP to unblock the account.”
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Urgency', 'OTP request', 'KYC threat', 'Shortened URL', 'AI deception cues'].map((tag) => (
              <span key={tag} className="rounded-full border border-[var(--border)] px-2 py-1 font-mono2 text-[9px] text-[var(--text-3)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.2s' }}>
        <div className="mb-2 flex items-center gap-2">
          <Database className="h-4 w-4 text-[var(--red)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--red)]">THREAT DATA MODEL</span>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
          A future reputation layer would store domain, phone number, UPI ID, sender, scam type, report count, first seen, and last seen — all used as evidence, never as a definitive accusation.
        </p>
      </div>
    </div>
  )
}
