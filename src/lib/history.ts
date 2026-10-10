import type { RiskResult } from './engine'

const KEY = 'safeguard.history.v1'

export function loadHistory(): RiskResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function saveScan(result: RiskResult) {
  const list = loadHistory()
  list.unshift(result)
  // cap at 200 entries — keeps memory and storage tiny on low-end phones
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)))
  } catch {
    /* storage full — drop oldest */
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)))
  }
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}

// ---------------- settings ----------------

export interface Settings {
  sensitivity: number // 0 = relaxed, 1 = balanced, 2 = strict
  reduceMotion: boolean
}

export const DEFAULT_SETTINGS: Settings = { sensitivity: 1, reduceMotion: false }

const SKEY = 'safeguard.settings.v1'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SKEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SKEY, JSON.stringify(s))
}

export function resetSettings() {
  localStorage.setItem(SKEY, JSON.stringify(DEFAULT_SETTINGS))
}
