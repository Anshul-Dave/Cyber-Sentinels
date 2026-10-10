import { useState } from 'react'
import { Led } from '../components/RiskGauge'
import { Trash2, Inbox } from 'lucide-react'
import type { RiskResult } from '../lib/engine'

interface Props {
  history: RiskResult[]
  onOpen: (id: string) => void
  onClear: () => void
}

const KIND = { message: 'MSG', url: 'URL', qr: 'QR', screenshot: 'SCREENSHOT' } as const

export function HistoryScreen({ history, onOpen, onClear }: Props) {
  const [filter, setFilter] = useState<'all' | 'threats'>('all')
  const shown = filter === 'all' ? history : history.filter((h) => h.level !== 'SAFE')

  return (
    <div className="space-y-4">
      <div className="rise-in flex items-end justify-between">
        <div>
          <div className="label-caps mb-1">local vault</div>
          <h2 className="text-xl font-semibold">Scan History</h2>
        </div>
        {history.length > 0 && (
          <button onClick={onClear} className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 font-mono2 text-[11px] tracking-wider text-[var(--red)]">
            <Trash2 className="h-3.5 w-3.5" /> CLEAR
          </button>
        )}
      </div>

      <div className="rise-in flex gap-2" style={{ animationDelay: '0.05s' }}>
        {(['all', 'threats'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-h-[40px] flex-1 rounded-lg border font-mono2 text-[11px] tracking-wider transition-colors ${
              filter === f ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-2)]'
            }`}
          >
            {f === 'all' ? `ALL (${history.length})` : `THREATS (${history.filter((h) => h.level !== 'SAFE').length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="panel rise-in flex flex-col items-center gap-3 border-dashed py-14 text-center" style={{ animationDelay: '0.1s' }}>
          <Inbox className="h-8 w-8 text-[var(--text-3)]" strokeWidth={1.5} />
          <p className="text-[13px] text-[var(--text-2)]">
            {filter === 'all' ? 'No scans yet. Run your first analysis from the Home tab.' : 'No threats detected. Stay sharp.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map((h, i) => (
            <button
              key={h.id}
              onClick={() => onOpen(h.id)}
              className="panel rise-in flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:border-[var(--cyan)]"
              style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
            >
              <Led tone={h.level === 'HIGH RISK' ? 'bad' : 'ok'} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px]">{h.input}</div>
                <div className="label-caps mt-1">
                  {KIND[h.kind]} · {new Date(h.scannedAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="font-mono2 text-[13px] font-bold"
                  style={{ color: h.level === 'HIGH RISK' ? 'var(--red)' : h.level === 'CAUTION' ? 'var(--amber)' : 'var(--mint)' }}
                >
                  {h.score}
                </div>
                <div className="label-caps mt-0.5">{h.level}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="rise-in text-center font-mono2 text-[10px] tracking-[0.16em] text-[var(--text-3)]" style={{ animationDelay: '0.2s' }}>
        STORED ONLY IN THIS BROWSER · NEVER UPLOADED
      </p>
    </div>
  )
}
