import { useState } from 'react'
import { ScanSearch, ClipboardPaste } from 'lucide-react'
import { analyzeMessage, type RiskResult } from '../lib/engine'

const SAMPLES = [
  { label: 'BANK OTP SCAM', text: 'URGENT! Your SBI account will be blocked tonight. Verify your OTP immediately at http://sbi-secure.verify-account.xyz/login' },
  { label: 'PRIZE SCAM', text: 'Congratulations! You have WON ₹25,000 in the lucky draw. Pay a small fee to claim your reward now: bit.ly/3xK9claim' },
  { label: 'LEGIT MESSAGE', text: 'Hey, are we still meeting for lunch tomorrow at the usual place? Let me know!' },
]

interface Props {
  onResult: (r: RiskResult) => void
}

export function ScanMessageScreen({ onResult }: Props) {
  const [text, setText] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const run = (input: string) => {
    if (scanning) return
    if (!input.trim()) {
      setError('Nothing to analyze. Paste or type a message first.')
      return
    }
    setError('')
    setScanning(true)
    // brief staged scan so the on-device pipeline is visible
    setTimeout(async () => {
      try {
        const result = await analyzeMessage(input.trim())
        onResult(result)
      } catch {
        setError('Error during analysis.')
      } finally {
        setScanning(false)
      }
    }, 1100)
  }

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText()
      if (t) {
        setText(t)
        setError('')
      } else {
        setError('Your clipboard is empty. Paste or type a message to analyze.')
      }
    } catch {
      setError('Clipboard access was denied. Paste or type the message manually.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">input channel 01</div>
        <h2 className="text-xl font-semibold">Message Scan</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Paste any suspicious SMS, WhatsApp or email text. Analyzed locally — the text never leaves this device.
        </p>
      </div>

      <div className="panel rise-in relative overflow-hidden" style={{ animationDelay: '0.05s' }}>
        {scanning && (
          <div className="pointer-events-none absolute inset-x-0 z-10 h-[3px] bg-[var(--cyan)] shadow-[0_0_16px_var(--cyan)] scanline-anim" />
        )}
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError('') }}
          placeholder="Paste the suspicious message here…"
          rows={6}
          className="w-full resize-none bg-transparent p-4 text-[15px] leading-relaxed outline-none placeholder:text-[var(--text-3)]"
        />
        <div className="flex items-center justify-between border-t border-[var(--border)] px-3 py-2">
          <div className="label-caps">{text.length} chars</div>
          <button onClick={paste} className="flex min-h-[36px] items-center gap-1.5 rounded-md px-2 font-mono2 text-[11px] tracking-wider text-[var(--cyan)]">
            <ClipboardPaste className="h-3.5 w-3.5" /> PASTE
          </button>
        </div>
      </div>

      <button
        onClick={() => run(text)}
        disabled={scanning}
        className="rise-in flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] font-mono2 text-[13px] font-bold tracking-[0.14em] text-[#04121a] transition-opacity disabled:opacity-30"
        style={{ animationDelay: '0.1s' }}
      >
        <ScanSearch className="h-4.5 w-4.5" />
        {scanning ? 'ANALYZING ON-DEVICE…' : 'ANALYZE ON-DEVICE'}
      </button>
      {error && <p role="alert" className="text-[13px] text-[var(--amber)]">{error}</p>}

      <div className="rise-in" style={{ animationDelay: '0.15s' }}>
        <div className="label-caps mb-2">try a sample</div>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              onClick={() => { setText(s.text); setError('') }}
              className="min-h-[36px] rounded-lg border border-[var(--border)] px-3 font-mono2 text-[11px] tracking-wider text-[var(--text-2)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--text-1)]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
