import { BellRing, CheckCircle2, MessageSquareText, ShieldAlert, Smartphone, Sparkles } from 'lucide-react'

const apps = [
  { name: 'SMS', status: 'Watching', detail: 'Banking and OTP patterns checked in real time.' },
  { name: 'WhatsApp', status: 'Watching', detail: 'Urgent messages and payment tricks are scored locally.' },
  { name: 'Telegram', status: 'Protected', detail: 'Group scam keywords and fake investment lures blocked.' },
  { name: 'Gmail', status: 'Protected', detail: 'SUSPICIOUS links in messages are flagged before open.' },
]

export function AndroidMonitorScreen() {
  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">feature 02</div>
        <h2 className="text-xl font-semibold">Android Notification Monitoring</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Detect scam patterns as soon as a suspicious SMS, WhatsApp message, or banking alert arrives — without uploading content to the cloud.
        </p>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="label-caps">device permission</div>
            <div className="mt-2 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[var(--mint)]" />
              <span className="font-mono2 text-[14px] font-bold tracking-[0.18em] text-[var(--mint)]">ACTIVE</span>
            </div>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-black/20 px-3 py-1.5 font-mono2 text-[10px] tracking-[0.12em] text-[var(--text-2)]">
            LOCAL ONLY
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {apps.map((app) => (
            <div key={app.name} className="rounded-xl border border-[var(--border)] bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono2 text-[11px] tracking-[0.14em] text-[var(--text-1)]">{app.name}</span>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono2 text-[9px] text-[var(--mint)]">{app.status}</span>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--text-2)]">{app.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rise-in p-4" style={{ animationDelay: '0.1s' }}>
          <div className="mb-3 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-[var(--cyan)]" />
            <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--cyan)]">LIVE PATTERN FLOW</span>
          </div>
          <div className="space-y-3">
            {[
              'Notification arrives from SMS / WhatsApp / Telegram',
              'SafeGuard AI inspects urgency, sender impersonation, payment language, and links',
              'Risk score is generated locally with rule + AI + URL checks',
              'User sees a warning only when the score exceeds the safe threshold',
            ].map((step, index) => (
              <div key={step} className="flex gap-3">
                <div className="flex w-7 shrink-0 justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] font-mono2 text-[10px] text-[var(--text-2)]">
                    {index + 1}
                  </div>
                </div>
                <div className="text-[13px] text-[var(--text-2)]">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rise-in p-4" style={{ animationDelay: '0.12s' }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--amber)]" />
            <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--amber)]">EXAMPLE ALERT</span>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-black/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-[var(--red)]" />
              <span className="font-mono2 text-[11px] text-[var(--red)]">HIGH-RISK SCAM</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text-1)]">
              “Your SBI account will be blocked tonight. Verify KYC immediately at bit.ly/secure-login.”
            </p>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[var(--text-2)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--mint)]" />
              <span>Urgency + fake bank impersonation + short link + OTP request</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--mint)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--mint)]">PRIVACY PRINCIPLE</span>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
          The app reads notification content only to score risk, then discards the raw text immediately. Nothing is uploaded or retained in a cloud log by default.
        </p>
      </div>
    </div>
  )
}
