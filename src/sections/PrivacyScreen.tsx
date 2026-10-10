import { Lock, Eye, EyeOff, Smartphone, Cpu, Gauge, ShieldCheck, CloudOff } from 'lucide-react'
import { MODEL_META } from '../lib/engine'

export function PrivacyScreen() {
  const steps = [
    { icon: Smartphone, t: 'INPUT', d: 'Message, URL or QR payload stays in app memory' },
    { icon: Cpu, t: 'ON-DEVICE AI', d: `${MODEL_META.features}-feature model + rule engine run locally` },
    { icon: Gauge, t: 'RISK ENGINE', d: 'Layers combine into a 0–100 explainable score' },
    { icon: ShieldCheck, t: 'VERDICT', d: 'Warning shown with reasons — nothing uploaded' },
  ]

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">trust center</div>
        <h2 className="text-xl font-semibold">Privacy Center</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          SafeGuard AI is built privacy-first: detection happens on your device, not on a server.
        </p>
      </div>

      {/* pipeline */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="label-caps mb-4">your data's journey</div>
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.t} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-black/30">
                  <s.icon className="h-4 w-4 text-[var(--cyan)]" strokeWidth={1.5} />
                </div>
                {i < steps.length - 1 && <div className="h-7 w-px bg-[var(--border)]" />}
              </div>
              <div className="pb-5">
                <div className="font-mono2 text-[12px] font-bold tracking-wider">{s.t}</div>
                <div className="mt-0.5 text-[13px] text-[var(--text-2)]">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-[var(--mint)]/30 bg-[var(--mint)]/5 p-3">
          <CloudOff className="h-4 w-4 shrink-0 text-[var(--mint)]" />
          <span className="font-mono2 text-[11px] tracking-wider text-[var(--mint)]">
            ZERO BYTES OF YOUR CONTENT LEAVE THIS DEVICE
          </span>
        </div>
      </div>

      {/* never collect */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.1s' }}>
        <div className="mb-3 flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-[var(--red)]" />
          <span className="font-mono2 text-[12px] font-bold tracking-wider">NEVER COLLECTED</span>
        </div>
        <ul className="space-y-2 text-[13px] text-[var(--text-2)]">
          {['Message contents and pasted text', 'URLs and QR payloads you scan', 'Contacts, phone number, identity', 'Location and device identifiers', 'Analytics or advertising trackers'].map((x) => (
            <li key={x} className="flex items-center gap-2.5">
              <span className="h-1 w-1 rounded-full bg-[var(--red)]" /> {x}
            </li>
          ))}
        </ul>
      </div>

      {/* what stays */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
        <div className="mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-[var(--mint)]" />
          <span className="font-mono2 text-[12px] font-bold tracking-wider">WHAT STAYS — AND WHERE</span>
        </div>
        <ul className="space-y-2 text-[13px] text-[var(--text-2)]">
          <li className="flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[var(--mint)]" />
            Scan history lives in this browser's local storage only — it never syncs, and clearing browser data deletes it.
          </li>
          <li className="flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[var(--mint)]" />
            The AI model ({MODEL_META.name}, {MODEL_META.features} features, ~37 KB) ships inside the app and runs fully offline.
          </li>
          <li className="flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[var(--mint)]" />
            Camera frames for QR scanning are decoded in memory and discarded instantly.
          </li>
        </ul>
      </div>

      <div className="rise-in flex items-center justify-center gap-2 py-2" style={{ animationDelay: '0.2s' }}>
        <Lock className="h-3.5 w-3.5 text-[var(--text-3)]" />
        <span className="font-mono2 text-[10px] tracking-[0.18em] text-[var(--text-3)]">
          PROOF: TURN OFF WI-FI — EVERYTHING STILL WORKS
        </span>
      </div>
    </div>
  )
}
