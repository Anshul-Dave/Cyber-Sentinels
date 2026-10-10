import { useMemo, useState } from 'react'
import { AlertTriangle, Shield, ShieldCheck, Send } from 'lucide-react'

type Channel = 'SMS' | 'WhatsApp' | 'Email' | 'Phone call' | 'Website' | 'UPI' | 'Instagram' | 'Telegram'
type ScamType = 'Bank fraud' | 'UPI fraud' | 'Job scam' | 'Investment scam' | 'Delivery scam' | 'KYC scam' | 'Crypto scam' | 'Government impersonation'

const channels: Channel[] = ['SMS', 'WhatsApp', 'Email', 'Phone call', 'Website', 'UPI', 'Instagram', 'Telegram']
const scamTypes: ScamType[] = ['Bank fraud', 'UPI fraud', 'Job scam', 'Investment scam', 'Delivery scam', 'KYC scam', 'Crypto scam', 'Government impersonation']

export function ReportScamScreen() {
  const [channel, setChannel] = useState<Channel>('SMS')
  const [type, setType] = useState<ScamType>('Bank fraud')
  const [details, setDetails] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const summary = useMemo(() => {
    return `Anonymous ${type.toLowerCase()} report captured for ${channel.toLowerCase()}.`
  }, [channel, type])

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">community intelligence</div>
        <h2 className="text-xl font-semibold">Report Scam</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Share incidents anonymously to strengthen the local scam network. Your report helps detect repeat patterns without exposing private content.
        </p>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <div>
            <div className="label-caps mb-2">channel</div>
            <div className="flex flex-wrap gap-2">
              {channels.map((value) => (
                <button
                  key={value}
                  onClick={() => setChannel(value)}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono2 text-[10px] tracking-[0.12em] ${channel === value ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-2)]'}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label-caps mb-2">scam type</div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ScamType)}
              className="w-full rounded-lg border border-[var(--border)] bg-transparent p-2.5 font-mono2 text-[11px] text-[var(--text-1)] outline-none"
            >
              {scamTypes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="label-caps mb-2">phone number / handle / UPI / URL</div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. +91 98765 43210 / UPI / website"
              className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-[13px] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>

          <div>
            <div className="label-caps mb-2">details</div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              placeholder="What did the scammer send or ask for?"
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent p-3 text-[13px] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] font-mono2 text-[13px] font-bold tracking-[0.14em] text-[#04121a]"
        >
          <Send className="h-4 w-4" />
          ANONYMIZE AND REPORT
        </button>
      </div>

      {submitted && (
        <div className="panel rise-in border-l-2 p-4" style={{ animationDelay: '0.1s', borderLeftColor: 'var(--mint)' }}>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--mint)]" />
            <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--mint)]">REPORT RECEIVED</span>
          </div>
          <p className="text-[14px] text-[var(--text-1)]">{summary}</p>
          <div className="mt-3 flex items-start gap-2 text-[13px] text-[var(--text-2)]">
            <Shield className="mt-0.5 h-4 w-4 text-[var(--cyan)]" />
            <span>
              The report has been marked as anonymous and attached to the local threat feed. Other users on this network will see a risk indicator based on aggregated patterns, not your private data.
            </span>
          </div>
        </div>
      )}

      <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[var(--amber)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--amber)]">WHAT IS KEPT</span>
        </div>
        <ul className="space-y-2 text-[13px] text-[var(--text-2)]">
          <li>• Scam type and channel</li>
          <li>• Approximate timestamp</li>
          <li>• Hash of the number / URL when available</li>
          <li>• No private chat content is stored</li>
        </ul>
      </div>
    </div>
  )
}
