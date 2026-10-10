import { useState } from 'react'
import { Link2, ScanSearch } from 'lucide-react'
import { analyzeLink, type RiskResult } from '../lib/engine'

const SAMPLES = [
  'https://secure-paytm.verify-account.example.xyz/login',
  'http://192.168.4.11/bank/kyc-update',
  'https://en.wikipedia.org/wiki/Phishing',
]

interface Props {
  onResult: (r: RiskResult) => void
}

export function UrlScanScreen({ onResult }: Props) {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const run = (input: string) => {
    if (scanning) return
    if (!input.trim()) {
      setError('Nothing to scan. Paste or type a link first.')
      return
    }
    setError('')
    setScanning(true)
    setTimeout(() => {
      onResult(analyzeLink(input.trim()))
      setScanning(false)
    }, 900)
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">input channel 02</div>
        <h2 className="text-xl font-semibold">URL Scanner</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Structural analysis of any link: encryption, domain age patterns, look-alike brands, shorteners, punycode.
        </p>
      </div>

      <div className="panel rise-in relative overflow-hidden" style={{ animationDelay: '0.05s' }}>
        {scanning && (
          <div className="pointer-events-none absolute inset-x-0 z-10 h-[3px] bg-[var(--cyan)] shadow-[0_0_16px_var(--cyan)] scanline-anim" />
        )}
        <div className="flex items-center gap-3 p-4">
          <Link2 className="h-5 w-5 shrink-0 text-[var(--text-3)]" />
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && run(url)}
            placeholder="https://suspicious-link.example…"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full bg-transparent font-mono2 text-[14px] outline-none placeholder:text-[var(--text-3)]"
          />
        </div>
      </div>

      <button
        onClick={() => run(url)}
        disabled={scanning}
        className="rise-in flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] font-mono2 text-[13px] font-bold tracking-[0.14em] text-[#04121a] transition-opacity disabled:opacity-30"
        style={{ animationDelay: '0.1s' }}
      >
        <ScanSearch className="h-4.5 w-4.5" />
        {scanning ? 'DECONSTRUCTING URL…' : 'SCAN LINK'}
      </button>
      {error && <p role="alert" className="text-[13px] text-[var(--amber)]">{error}</p>}

      <div className="rise-in" style={{ animationDelay: '0.15s' }}>
        <div className="label-caps mb-2">try a sample</div>
        <div className="space-y-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => { setUrl(s); setError('') }}
              className="block w-full truncate rounded-lg border border-[var(--border)] px-3 py-2.5 text-left font-mono2 text-[11px] text-[var(--text-2)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--text-1)]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.2s' }}>
        <div className="label-caps mb-2">13 structural checks</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono2 text-[11px] text-[var(--text-2)]">
          {['HTTPS', 'IP-HOST', '@-TRICK', 'SUBDOMAINS', 'DOMAIN LENGTH', 'PUNYCODE', 'SHORTENER', 'TLD REPUTATION', 'HYPHENS', 'PORT', 'PATH KEYWORDS', 'BRAND LOOK-ALIKE', 'DIGITS'].map((c) => (
            <span key={c} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[var(--mint)]" /> {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
