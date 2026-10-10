import { useCallback, useEffect, useMemo, useState } from 'react'
import { House, ScanSearch, Link2, QrCode, History, Settings as SettingsIcon, Lock, ShieldCheck, ImageUp, BellRing } from 'lucide-react'
import { HomeScreen } from './sections/HomeScreen'
import { ScanMessageScreen } from './sections/ScanMessageScreen'
import { UrlScanScreen } from './sections/UrlScanScreen'
import { QrScanScreen } from './sections/QrScanScreen'
import { ScreenshotScanScreen } from './sections/ScreenshotScanScreen'
import { AndroidMonitorScreen } from './sections/AndroidMonitorScreen'
import { ResultScreen } from './sections/ResultScreen'
import { HistoryScreen } from './sections/HistoryScreen'
import { SettingsScreen } from './sections/SettingsScreen'
import { PrivacyScreen } from './sections/PrivacyScreen'
import { ReportScamScreen } from './sections/ReportScamScreen'
import { LearnModeScreen } from './sections/LearnModeScreen'
import type { RiskResult } from './lib/engine'
import { clearHistory, DEFAULT_SETTINGS, loadHistory, loadSettings, resetSettings, saveScan, saveSettings, type Settings } from './lib/history'

type View = 'home' | 'scan' | 'url' | 'qr' | 'screenshot' | 'monitor' | 'report' | 'learn' | 'history' | 'settings' | 'privacy' | 'result'

const NAV = [
  { id: 'home', label: 'HOME', icon: House },
  { id: 'scan', label: 'SCAN', icon: ScanSearch },
  { id: 'history', label: 'HISTORY', icon: History },
  { id: 'settings', label: 'CONFIG', icon: SettingsIcon },
] as const

const MOBILE_NAV = NAV

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
}

function App() {
  const [view, setView] = useState<View>('home')
  const [history, setHistory] = useState<RiskResult[]>(() => loadHistory())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [result, setResult] = useState<RiskResult | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion)
    saveSettings(settings)
  }, [settings])

  const handleResult = (r: RiskResult) => {
    saveScan(r)
    setHistory(loadHistory())
    setResult(r)
    setView('result')
  }

  const go = useCallback((v: string) => {
    if (v.startsWith('result:')) {
      const id = v.slice(7)
      const found = history.find((h) => h.id === id)
      if (found) {
        setResult(found)
        setView('result')
      }
      return
    }
    setView(v as View)
  }, [history])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const content = useMemo(() => {
    switch (view) {
      case 'home':
        return <HomeScreen history={history} go={go} />
      case 'scan':
        return <ScanMessageScreen onResult={handleResult} />
      case 'url':
        return <UrlScanScreen onResult={handleResult} />
      case 'qr':
        return <QrScanScreen key={view + String(result?.id ?? '')} onResult={handleResult} />
      case 'screenshot':
        return <ScreenshotScanScreen onResult={handleResult} />
      case 'monitor':
        return <AndroidMonitorScreen />

      case 'report':
        return <ReportScamScreen />
      case 'learn':
        return <LearnModeScreen />
      case 'history':
        return (
          <HistoryScreen
            history={history}
            onOpen={(id) => go(`result:${id}`)}
            onClear={() => { clearHistory(); setHistory([]) }}
          />
        )
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onChange={setSettings}
            onClearData={(selected) => {
              if (selected.includes('history')) {
                clearHistory()
                setHistory([])
                setResult(null)
              }
              if (selected.includes('settings')) {
                resetSettings()
                setSettings(DEFAULT_SETTINGS)
              }
            }}
            canInstall={!!deferredPrompt}
            onInstall={install}
          />
        )
      case 'privacy':
        return <PrivacyScreen />
      case 'result':
        return result ? <ResultScreen result={result} onBack={() => setView('scan')} /> : null
    }
  }, [view, history, settings, result, deferredPrompt, go, install])

  return (
    <div className="cyber-shell bg-depth scanlines flex min-h-full flex-col lg:flex-row">
      {/* header — mobile */}
      <header className="safe-top sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[rgba(5,8,16,0.85)] px-4 py-3 backdrop-blur-md lg:hidden">
        <button onClick={() => setView('home')} className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[var(--cyan)]" />
          <span className="font-mono2 text-[14px] font-bold tracking-[0.16em]">SAFEGUARD<span className="text-[var(--cyan)]">_AI</span></span>
        </button>
        <button onClick={() => setView('privacy')} className="flex min-h-[44px] items-center gap-1.5 px-2 font-mono2 text-[10px] tracking-[0.14em] text-[var(--mint)]">
          <Lock className="h-3.5 w-3.5" /> PRIVATE
        </button>
      </header>

      {/* side rail — desktop */}
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-[rgba(12,18,32,0.6)] p-5 lg:flex">
        <button onClick={() => setView('home')} className="mb-8 flex items-center gap-2.5">
          <ShieldCheck className="h-6 w-6 text-[var(--cyan)]" />
          <span className="font-mono2 text-[15px] font-bold tracking-[0.16em]">SAFEGUARD<span className="text-[var(--cyan)]">_AI</span></span>
        </button>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-mono2 text-[12px] tracking-[0.12em] transition-colors ${
                view === n.id ? 'bg-[var(--panel-2)] text-[var(--cyan)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              }`}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
          <button onClick={() => setView('monitor')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-mono2 text-[12px] tracking-[0.12em] transition-colors ${view === 'monitor' ? 'bg-[var(--panel-2)] text-[var(--cyan)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'}`}><BellRing className="h-4 w-4" /> MONITOR</button>
        </nav>
        <div className="mt-auto space-y-3">
          <button
            onClick={() => setView('report')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-mono2 text-[12px] tracking-[0.12em] transition-colors ${
              view === 'report' ? 'bg-[var(--panel-2)] text-[var(--cyan)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> REPORT
          </button>
          <button
            onClick={() => setView('learn')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-mono2 text-[12px] tracking-[0.12em] transition-colors ${
              view === 'learn' ? 'bg-[var(--panel-2)] text-[var(--cyan)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            <Lock className="h-4 w-4" /> LEARN
          </button>
          <button
            onClick={() => setView('privacy')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-mono2 text-[12px] tracking-[0.12em] transition-colors ${
              view === 'privacy' ? 'bg-[var(--panel-2)] text-[var(--cyan)]' : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            <Lock className="h-4 w-4" /> PRIVACY
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] p-3">
            <span className="led" />
            <span className="font-mono2 text-[10px] tracking-[0.14em] text-[var(--text-2)]">ENGINE ONLINE</span>
          </div>
        </div>
      </aside>

      {/* main */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-5 lg:max-w-3xl lg:px-8 lg:pb-12 lg:pt-8">
        {/* desktop sub-nav for scan types */}
        {(view === 'scan' || view === 'url' || view === 'qr' || view === 'screenshot') && (
          <div className="mb-5 hidden gap-2 lg:flex">
            {[
              { id: 'scan', label: 'MESSAGE', icon: ScanSearch },
              { id: 'url', label: 'URL', icon: Link2 },
              { id: 'qr', label: 'QR', icon: QrCode },
              { id: 'screenshot', label: 'SCREENSHOT', icon: ImageUp },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id as View)}
                className={`flex min-h-[40px] items-center gap-2 rounded-lg border px-4 font-mono2 text-[11px] tracking-wider transition-colors ${
                  view === t.id ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-2)]'
                }`}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>
        )}
        {content}
      </main>

      {/* bottom tab bar — mobile */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[rgba(5,8,16,0.92)] backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-4">
          {MOBILE_NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 ${
                view === n.id ? 'text-[var(--cyan)]' : 'text-[var(--text-3)]'
              }`}
            >
              <n.icon className="h-5 w-5" strokeWidth={view === n.id ? 2 : 1.5} />
              <span className="font-mono2 text-[9px] tracking-[0.14em]">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App
