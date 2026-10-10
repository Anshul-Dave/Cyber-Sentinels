import { ArrowUpRight, BellRing, ChartColumn, Eye, ShieldAlert, ShieldCheck, Sparkles, Users } from 'lucide-react'

const activity = [
  { time: '2:30 PM', label: 'Fake KYC SMS', risk: 'HIGH', tone: 'bg-[var(--red)]' },
  { time: '11:10 AM', label: 'Suspicious website', risk: 'MEDIUM', tone: 'bg-[var(--amber)]' },
  { time: 'Yesterday', label: 'Unknown UPI payment', risk: 'LOW', tone: 'bg-[var(--mint)]' },
]

const riskBreakdown = [
  { label: 'Delivery scams', value: 42 },
  { label: 'Bank phishing', value: 28 },
  { label: 'Investment scams', value: 18 },
  { label: 'Shopping scams', value: 12 },
]

const alerts = [
  { title: 'Banking impersonation', detail: 'High-risk message blocked before you clicked', level: 'CRITICAL' },
  { title: 'UPI verification drift', detail: 'Two unknown IDs were flagged for reputation checks', level: 'MEDIUM' },
  { title: 'Browser warning', detail: 'Fake login page detected and prevented', level: 'HIGH' },
]

export function DashboardScreen() {
  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">protection dashboard</div>
        <h2 className="text-xl font-semibold">Good morning, ANSHUL 👋</h2>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="label-caps mb-2">protection status</div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[var(--mint)]" />
              <span className="font-mono2 text-[16px] font-bold tracking-[0.18em] text-[var(--mint)]">GOOD</span>
            </div>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 font-mono2 text-[12px] text-[var(--text-2)]">
            Score 86/100
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            { label: 'Threats blocked', value: '23' },
            { label: 'Scams detected', value: '7' },
            { label: 'Links checked', value: '142' },
            { label: 'High-risk threats', value: '3' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-black/20 p-3">
              <div className="font-mono2 text-[18px] font-bold text-[var(--text-1)]">{item.value}</div>
              <div className="label-caps mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rise-in p-4" style={{ animationDelay: '0.1s' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--cyan)]">LIVE PROTECTION</div>
            <BellRing className="h-4 w-4 text-[var(--cyan)]" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-lg border border-[var(--border)] bg-black/20 p-3">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="font-mono2 text-[11px] tracking-[0.12em] text-[var(--text-1)]">{alert.title}</span>
                  <span className="rounded-full border px-2 py-0.5 font-mono2 text-[9px] text-[var(--text-2)]">{alert.level}</span>
                </div>
                <p className="text-[13px] text-[var(--text-2)]">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rise-in p-4" style={{ animationDelay: '0.12s' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--amber)]">RISK INSIGHTS</div>
            <ChartColumn className="h-4 w-4 text-[var(--amber)]" />
          </div>
          <div className="space-y-3">
            {riskBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-[12px] text-[var(--text-2)]">
                  <span>{item.label}</span>
                  <span className="font-mono2 text-[11px]">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/30">
                  <div className="h-full rounded-full bg-[var(--amber)]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--text-2)]">RECENT ACTIVITY</div>
            <ArrowUpRight className="h-4 w-4 text-[var(--text-3)]" />
          </div>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={`${item.time}-${item.label}`} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-black/20 px-3 py-2">
                <div>
                  <div className="font-mono2 text-[11px] text-[var(--text-3)]">{item.time}</div>
                  <div className="mt-1 text-[13px] text-[var(--text-1)]">{item.label}</div>
                </div>
                <span className={`rounded-full px-2 py-1 font-mono2 text-[9px] ${item.tone} text-black`}>{item.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rise-in p-4" style={{ animationDelay: '0.18s' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--mint)]">SAFEGUARD AI PILLARS</div>
            <Sparkles className="h-4 w-4 text-[var(--mint)]" />
          </div>
          <div className="space-y-3">
            {[
              { icon: ShieldAlert, label: 'AI protection', note: 'Scam messages, URLs, and QR codes are scored before warnings appear.' },
              { icon: Users, label: 'Family protection', note: 'Monitor risks on trusted devices without exposing personal messages.' },
              { icon: Eye, label: 'Learn mode', note: 'Practice scam detection and understand why messages are risky.' },
            ].map(({ icon: Icon, label, note }) => (
              <div key={label} className="flex gap-3 rounded-lg border border-[var(--border)] bg-black/20 p-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--panel-2)]">
                  <Icon className="h-4 w-4 text-[var(--cyan)]" />
                </div>
                <div>
                  <div className="font-mono2 text-[11px] font-bold tracking-[0.12em] text-[var(--text-1)]">{label}</div>
                  <p className="mt-1 text-[12px] text-[var(--text-2)]">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
