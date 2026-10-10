import { copyFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const browser = mode === 'firefox' ? 'firefox' : 'chromium'
  const root = process.cwd()
  const output = path.resolve(root, `dist-extension/${browser}`)

  return {
    configFile: false,
    base: './',
    publicDir: path.resolve(root, 'extension/public'),
    build: {
      emptyOutDir: true,
      outDir: output,
      lib: {
        entry: path.resolve(root, 'src/lib/urlAnalyzer.ts'),
        name: 'SafeGuardUrlAnalyzer',
        formats: ['iife'],
        fileName: () => 'url-analyzer.js',
      },
    },
    plugins: [{
      name: 'copy-extension-manifest',
      closeBundle() {
        copyFileSync(
          path.resolve(root, `extension/manifest.${browser}.json`),
          path.resolve(output, 'manifest.json'),
        )
      },
    }],
  }
})
