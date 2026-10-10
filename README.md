# SafeGuard AI

Privacy-first scam screening web app. Message, URL, QR, and screenshot scans run in the browser using an on-device text classifier, explicit detection rules, URL checks, and local English OCR.

## Run locally

```sh
npm install
npm run dev
```

## Validate and build

```sh
npm run lint
npm run build
npm run build:extension
npm run build:extension:firefox
npm run preview
```

## Browser extension

The WebExtension checks clicked HTTP/HTTPS links before navigation and can scan the current website from its toolbar popup. URL structure checks run locally and share the same analyzer as the web app; no browsing history or page content is sent to a server.

Build the Chromium package (Chrome, Edge, Brave, Opera) with `npm run build:extension`, or the Firefox package with `npm run build:extension:firefox`. Load `dist-extension/chromium` or `dist-extension/firefox`, respectively, as an unpacked/temporary extension in the chosen browser. The browser will request access to HTTP/HTTPS sites so the extension can inspect clicked links. Restricted browser pages and direct address-bar navigations cannot be intercepted by this version. The score is heuristic and is not a guarantee of safety.

## Project layout

- `src/main.tsx` — browser entry point and global styles
- `src/App.tsx` — screen state, navigation, and shared scan history
- `src/sections/` — app screens and scan flows
- `src/components/` — shared interface components
- `src/lib/` — detection engine, model helpers, and local storage
- `src/assets/` — bundled classifier model
- `public/` — PWA files and local OCR worker, WASM, and language data

Scan results describe heuristic signal strength, not a probability or a guarantee that content is safe. Screenshot OCR runs locally and does not upload images.
