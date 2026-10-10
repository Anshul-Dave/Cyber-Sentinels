import { build } from 'vite'

const browser = process.argv[2] ?? 'chromium'
if (browser !== 'chromium' && browser !== 'firefox') {
  throw new Error(`Unsupported browser target "${browser}". Use "chromium" or "firefox".`)
}

await build({
  configFile: 'vite.extension.config.ts',
  mode: browser,
})
