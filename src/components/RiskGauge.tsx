import { useEffect, useState } from 'react'

const LEVEL_COLOR = {
  SAFE: 'var(--mint)',
  CAUTION: 'var(--amber)',
  'HIGH RISK': 'var(--red)',
} as const

// eslint-disable-next-line react-refresh/only-export-components
export function levelColor(level: keyof typeof LEVEL_COLOR) {
  return LEVEL_COLOR[level]
}

export function RiskGauge({ score, level, size = 168 }: { score: number; level: keyof typeof LEVEL_COLOR; size?: number }) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setT(1))
    return () => cancelAnimationFrame(id)
  }, [])
  const stroke = 10
  const r = (size - stroke) / 2 - 4
  const c = 2 * Math.PI * r
  const frac = Math.min(1, Math.max(0, score / 100))
  const color = LEVEL_COLOR[level]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac * t)}
          className="gauge-arc"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono2 font-bold leading-none" style={{ fontSize: size * 0.26, color }}>
          {score}
        </div>
        <div className="label-caps mt-2">risk score</div>
      </div>
    </div>
  )
}

export function Led({ tone = 'ok' }: { tone?: 'ok' | 'bad' }) {
  return <span className={`led ${tone === 'bad' ? 'led-red' : ''}`} />
}
