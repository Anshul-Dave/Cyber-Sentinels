import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Download, Cpu, MemoryStick, WifiOff, Database, History, SlidersHorizontal } from 'lucide-react'
import { MODEL_META } from '../lib/engine'
import type { Settings } from '../lib/history'

type DataSelection = 'history' | 'settings'

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
  onClearData: (selected: DataSelection[]) => void
  canInstall: boolean
  onInstall: () => void
}

export function SettingsScreen({ settings, onChange, onClearData, canInstall, onInstall }: Props) {
  const [confirmClear, setConfirmClear] = useState(false)
  const [selectedData, setSelectedData] = useState<DataSelection[]>([])

  const toggleDataSelection = (item: DataSelection) => {
    setSelectedData((current) => current.includes(item)
      ? current.filter((selected) => selected !== item)
      : [...current, item])
    setConfirmClear(false)
  }

  const deleteSelectedData = () => {
    if (selectedData.length === 0) return
    onClearData(selectedData)
    setSelectedData([])
    setConfirmClear(false)
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">configuration</div>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      {/* install */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="mb-2 flex items-center gap-2">
          <Download className="h-4 w-4 text-[var(--cyan)]" />
          <span className="font-mono2 text-[12px] font-bold tracking-wider">INSTALL AS APP</span>
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--text-2)]">
          Add SafeGuard AI to your Android or iOS home screen. It runs full-screen, works offline, and behaves like a native app.
        </p>
        {canInstall ? (
          <button
            onClick={onInstall}
            className="min-h-[48px] w-full rounded-xl bg-[var(--cyan)] font-mono2 text-[12px] font-bold tracking-[0.14em] text-[#04121a]"
          >
            INSTALL ON THIS DEVICE
          </button>
        ) : (
          <div className="rounded-lg border border-[var(--border)] p-3 font-mono2 text-[11px] leading-relaxed text-[var(--text-2)]">
            ANDROID: browser menu → “Add to Home screen”<br />
            iOS: Share → “Add to Home Screen”
          </div>
        )}
      </div>

      {/* detection */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.1s' }}>
        <div className="label-caps mb-3">detection sensitivity</div>
        <div className="grid grid-cols-3 gap-2">
          {['RELAXED', 'BALANCED', 'STRICT'].map((l, i) => (
            <button
              key={l}
              onClick={() => onChange({ ...settings, sensitivity: i })}
              className={`min-h-[44px] rounded-lg border font-mono2 text-[11px] tracking-wider transition-colors ${
                settings.sensitivity === i ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-2)]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-[var(--text-3)]">
          Strict mode flags borderline content; relaxed mode only surfaces high-confidence threats.
        </p>
      </div>

      {/* low-resource mode */}
      <div className="panel rise-in flex items-center justify-between p-4" style={{ animationDelay: '0.15s' }}>
        <div className="pr-4">
          <div className="font-mono2 text-[12px] font-bold tracking-wider">LOW-RESOURCE MODE</div>
          <p className="mt-1 text-[12px] text-[var(--text-3)]">Disables animations for low-RAM phones and saves battery.</p>
        </div>
        <Switch
          checked={settings.reduceMotion}
          onCheckedChange={(v) => onChange({ ...settings, reduceMotion: v })}
          aria-label="Low resource mode"
        />
      </div>

      {/* engine info */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.2s' }}>
        <div className="label-caps mb-3">on-device engine</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Cpu, k: 'MODEL', v: MODEL_META.name },
            { icon: MemoryStick, k: 'FOOTPRINT', v: '37 KB weights' },
            { icon: WifiOff, k: 'NETWORK', v: 'Not required' },
            { icon: Database, k: 'STORAGE', v: 'Browser-local only' },
          ].map((r) => (
            <div key={r.k} className="flex items-start gap-2.5">
              <r.icon className="mt-0.5 h-4 w-4 text-[var(--cyan)]" strokeWidth={1.5} />
              <div>
                <div className="label-caps">{r.k}</div>
                <div className="mt-0.5 font-mono2 text-[12px]">{r.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* danger zone */}
      <div className="panel rise-in p-4" style={{ animationDelay: '0.25s' }}>
        <div className="label-caps mb-1">manage local data</div>
        <p className="mb-3 text-[12px] text-[var(--text-3)]">Choose which data to remove. Unselected data stays on this device.</p>
        <div className="mb-4 space-y-2">
          {([
            { id: 'history', label: 'Scan history', detail: 'Remove saved scan results', icon: History },
            { id: 'settings', label: 'App preferences', detail: 'Reset sensitivity and motion settings to defaults', icon: SlidersHorizontal },
          ] as const).map(({ id, label, detail, icon: Icon }) => (
            <label key={id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] bg-black/20 p-3">
              <input
                type="checkbox"
                checked={selectedData.includes(id)}
                onChange={() => toggleDataSelection(id)}
                className="h-4 w-4 accent-[var(--cyan)]"
              />
              <Icon className="h-4 w-4 shrink-0 text-[var(--cyan)]" />
              <span className="min-w-0">
                <span className="block text-[13px] text-[var(--text-1)]">{label}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--text-3)]">{detail}</span>
              </span>
            </label>
          ))}
        </div>
        {confirmClear ? (
          <div className="space-y-2">
            <p className="text-[12px] text-[var(--amber)]">
              This will {selectedData.map((item) => item === 'history' ? 'delete scan history' : 'reset app preferences').join(' and ')}.
            </p>
            <div className="flex gap-2">
              <button
                onClick={deleteSelectedData}
                className="min-h-[44px] flex-1 rounded-lg bg-[var(--red)] font-mono2 text-[11px] font-bold tracking-wider text-black"
              >
                CONFIRM DELETE
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="min-h-[44px] flex-1 rounded-lg border border-[var(--border)] font-mono2 text-[11px] tracking-wider text-[var(--text-2)]"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            disabled={selectedData.length === 0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--border)] font-mono2 text-[11px] tracking-wider text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            DELETE SELECTED DATA
          </button>
        )}
      </div>
    </div>
  )
}
