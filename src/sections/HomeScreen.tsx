import { Led } from '../components/RiskGauge'
import { ShieldCheck, MessageSquareWarning, Link2, QrCode, ArrowRight, Radar, ImageUp, GraduationCap, ShieldAlert, BellRing } from 'lucide-react'
import type { RiskResult } from '../lib/engine'
import { MODEL_META } from '../lib/engine'

interface Props {
  history: RiskResult[]
  go: (view: string) => void
}

export function HomeScreen({ history, go }: Props) {
  const threats = history.filter((h) => h.level === 'HIGH RISK').length
  const cautions = history.filter((h) => h.level === 'CAUTION').length

  const cards = [
    { id: 'scan', title: 'MESSAGE SCAN', desc: 'SMS, WhatsApp, email text', icon: MessageSquareWarning, accent: 'var(--cyan)' },
    { id: 'url', title: 'URL SCANNER', desc: 'Check a link before opening', icon: Link2, accent: 'var(--mint)' },
    { id: 'qr', title: 'QR SCANNER', desc: 'Camera scan with live analysis', icon: QrCode, accent: 'var(--amber)' },
    { id: 'screenshot', title: 'SCREENSHOT SCAN', desc: 'OCR + risk scoring', icon: ImageUp, accent: 'var(--cyan)' },
    { id: 'monitor', title: 'NOTIFY MONITOR', desc: 'Android notification screening', icon: BellRing, accent: 'var(--mint)' },
    { id: 'report', title: 'REPORT SCAM', desc: 'Anonymous community alerts', icon: ShieldAlert, accent: 'var(--red)' },
    { id: 'learn', title: 'LEARN MODE', desc: 'Practice scam detection', icon: GraduationCap, accent: 'var(--amber)' },
  ]

  return (
    <div className="space-y-5">
      {/* status banner */}
      <div className="panel rise-in relative overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Led />
            <div>
              <div className="font-mono2 text-[13px] font-bold tracking-[0.14em] text-[var(--mint)]">
                ON-DEVICE PROTECTION: ACTIVE
              </div>
              <div className="label-caps mt-1">model {MODEL_META.name} · v{MODEL_META.version} · {MODEL_META.features} features · 0 KB sent to cloud</div>
            </div>
          </div>
          <ShieldCheck className="h-8 w-8 text-[var(--mint)]" strokeWidth={1.5} />
        </div>

        {/* radar */}
        <div className="mt-5 flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--border)] sm:h-24 sm:w-24">
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />
            {[0.33, 0.66, 1].map((f) => (
              <div key={f} className="absolute rounded-full border border-[var(--border)]" style={{ inset: `${(1 - f) * 50}%` }} />
            ))}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--border)]" />
            <div
              className="radar-sweep absolute inset-0 rounded-full"
              style={{ background: 'conic-gradient(from 0deg, rgba(34,211,238,0.45), transparent 90deg, transparent)' }}
            />
            <div className="radar-blip absolute left-[62%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {[
              { n: history.length, l: 'SCANS' },
              { n: threats, l: 'THREATS', c: threats > 0 ? 'var(--red)' : undefined },
              { n: cautions, l: 'CAUTIONS', c: cautions > 0 ? 'var(--amber)' : undefined },
            ].map((s) => (
              <div key={s.l} className="min-w-0 border-l-2 pl-2.5 sm:pl-3" style={{ borderColor: 'var(--border)' }}>
                <div className="font-mono2 text-xl font-bold sm:text-2xl" style={{ color: s.c ?? 'var(--text-1)' }}>{s.n}</div>
                <div className="label-caps-tight mt-0.5 truncate">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            className="panel rise-in group flex min-h-[88px] items-center gap-4 p-4 text-left transition-colors duration-150 hover:border-[var(--cyan)]"
            style={{ animationDelay: `${0.06 * (i + 1)}s` }}
          >
            <c.icon className="h-6 w-6 shrink-0" style={{ color: c.accent }} strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="font-mono2 text-[12px] font-bold tracking-[0.12em]">{c.title}</div>
              <div className="mt-1 truncate text-[13px] text-[var(--text-2)]">{c.desc}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-3)] transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      {/* threat intel ticker */}
      <div className="panel rise-in overflow-hidden" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-2.5">
          <Radar className="h-3.5 w-3.5 text-[var(--cyan)]" />
          <span className="label-caps">live threat patterns · local engine</span>
        </div>
        <div className="relative flex overflow-hidden py-2.5">
          <div className="ticker-track flex shrink-0 gap-10 whitespace-nowrap px-5 font-mono2 text-[11px] tracking-wide text-[var(--text-2)]">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10">
                <span><b className="text-[var(--red)]">▲</b> OTP FRAUD — fake bank KYC alerts rising</span>
                <span><b className="text-[var(--amber)]">▲</b> DELIVERY SCAM — customs-fee links via shorteners</span>
                <span><b className="text-[var(--red)]">▲</b> QR PHISHING — parking-meter sticker swaps</span>
                <span><b className="text-[var(--amber)]">▲</b> CRYPTO LURE — guaranteed-return investment DMs</span>
                <span><b className="text-[var(--mint)]">●</b> ENGINE OK — all {MODEL_META.features} features loaded on-device</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* recent scans */}
      {history.length > 0 && (
        <div className="rise-in" style={{ animationDelay: '0.3s' }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="label-caps">recent scans</span>
            <button onClick={() => go('history')} className="font-mono2 text-[11px] tracking-wider text-[var(--cyan)]">
              VIEW ALL →
            </button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 3).map((h) => (
              <button
                key={h.id}
                onClick={() => go(`result:${h.id}`)}
                className="panel flex w-full items-center gap-3 p-3 text-left transition-colors duration-150 hover:border-[var(--cyan)]"
              >
                <Led tone={h.level === 'HIGH RISK' ? 'bad' : 'ok'} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-2)]">{h.input}</span>
                <span
                  className="font-mono2 text-[11px] font-bold"
                  style={{ color: h.level === 'HIGH RISK' ? 'var(--red)' : h.level === 'CAUTION' ? 'var(--amber)' : 'var(--mint)' }}
                >
                  {h.score}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
