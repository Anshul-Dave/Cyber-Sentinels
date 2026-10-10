import { RiskGauge, levelColor } from '../components/RiskGauge'
import { CheckCircle2, ShieldAlert, TriangleAlert, Sparkles, ArrowLeft, Smartphone } from 'lucide-react'
import type { RiskResult } from '../lib/engine'

interface Props {
  result: RiskResult
  onBack: () => void
}

const KIND_LABEL = { message: 'MESSAGE', url: 'URL', qr: 'QR PAYLOAD', screenshot: 'SCREENSHOT OCR' } as const

export function ResultScreen({ result, onBack }: Props) {
  const color = levelColor(result.level)
  const Icon = result.level === 'HIGH RISK' ? ShieldAlert : result.level === 'CAUTION' ? TriangleAlert : CheckCircle2

  const layers = [
    { name: 'LOCAL TEXT CLASSIFIER', val: result.mlScore },
    { name: 'RULE ENGINE', val: result.ruleScore },
    ...(result.urlScore !== null ? [{ name: 'URL ANALYZER', val: result.urlScore }] : []),
  ]

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="rise-in flex min-h-[44px] items-center gap-2 font-mono2 text-[12px] tracking-wider text-[var(--text-2)]">
        <ArrowLeft className="h-4 w-4" /> NEW SCAN
      </button>

      {result.isAiImage && (
        <div className="panel rise-in flex items-start gap-3 border-b border-[var(--amber)] bg-[rgba(245,158,11,0.1)] p-4 text-[var(--amber)]">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-mono2 text-[12px] font-bold tracking-wider">AI-GENERATED IMAGE DETECTED</div>
            <div className="mt-1 text-[13px] text-[var(--text-2)]">This screenshot appears to be synthetically generated or altered by AI. Verify the source before trusting any payment proofs or claims shown in this image.</div>
          </div>
        </div>
      )}

      {/* verdict */}
      <div className="panel rise-in relative overflow-hidden p-6 text-center" style={{ animationDelay: '0.05s' }}>
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: color, boxShadow: `0 0 18px ${color}` }} />
        <div className="label-caps mb-4">{KIND_LABEL[result.kind]} · ANALYSIS COMPLETE</div>
        <div className="flex justify-center">
          <RiskGauge score={result.score} level={result.level} />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Icon className="h-5 w-5" style={{ color }} />
          <span className="font-mono2 text-lg font-bold tracking-[0.12em]" style={{ color }}>{result.level}</span>
        </div>
        <div className="mt-1 font-mono2 text-[11px] tracking-[0.2em] text-[var(--text-2)]">{result.category}</div>
        <div className="mx-auto mt-4 max-h-40 max-w-md overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2 text-left font-mono2 text-[11px] text-[var(--text-3)]">
          {result.input}
        </div>
        {result.urlHost && (
          <div className="mx-auto mt-3 max-w-md rounded-lg border border-[var(--cyan)] bg-[rgba(34,211,238,0.05)] px-3 py-2 text-left">
            <div className="label-caps mb-1 text-[var(--cyan)]">extracted destination domain</div>
            <div className="font-mono2 text-[13px] tracking-wider text-[var(--cyan)]">{result.urlHost}</div>
          </div>
        )}
      </div>

      {/* layer breakdown */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.12s' }}>
        <div className="label-caps mb-3">detection signal strength · heuristic</div>
        <div className="space-y-3">
          {layers.map((l) => (
            <div key={l.name}>
              <div className="mb-1 flex justify-between font-mono2 text-[11px]">
                <span className="tracking-wider text-[var(--text-2)]">{l.name}</span>
                <span style={{ color: l.val >= 60 ? 'var(--red)' : l.val >= 30 ? 'var(--amber)' : 'var(--mint)' }}>{l.val}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${l.val}%`,
                    background: l.val >= 60 ? 'var(--red)' : l.val >= 30 ? 'var(--amber)' : 'var(--mint)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* why */}
      {result.reasons.length > 0 && (
        <div className="panel rise-in p-4" style={{ animationDelay: '0.18s' }}>
          <div className="label-caps mb-3">why it was flagged</div>
          <ul className="space-y-2">
            {result.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px]">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: r.weight >= 20 ? 'var(--red)' : r.weight > 0 ? 'var(--amber)' : 'var(--mint)' }}
                />
                <span className="text-[var(--text-1)]">{r.label}</span>
                {r.weight > 0 && <span className="ml-auto font-mono2 text-[11px] text-[var(--text-3)]">+{r.weight}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* explanation from the on-device detection signals */}
      <div className="panel rise-in border-l-2 p-4" style={{ animationDelay: '0.24s', borderLeftColor: 'var(--cyan)' }}>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--cyan)]">ON-DEVICE ANALYSIS</span>
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--text-2)]">{result.explanation}</p>
      </div>

      {/* recommendation */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.3s' }}>
        <div className="label-caps mb-2">recommended action</div>
        <p className="text-[14px] leading-relaxed">{result.recommendation}</p>
      </div>

      {/* privacy footer */}
      <div className="rise-in flex items-center justify-center gap-2 py-2" style={{ animationDelay: '0.36s' }}>
        <Smartphone className="h-3.5 w-3.5 text-[var(--mint)]" />
        <span className="font-mono2 text-[10px] tracking-[0.18em] text-[var(--text-3)]">
          ANALYZED ON THIS DEVICE · {new Date(result.scannedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
