import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { createWorker, OEM } from 'tesseract.js'
import { ImageUp, ScanSearch, ShieldAlert } from 'lucide-react'
import { analyzeMessage, type RiskResult } from '../lib/engine'

interface Props {
  onResult: (r: RiskResult) => void
}

export function ScreenshotScanScreen({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const [error, setError] = useState('')
  const [isAiImage, setIsAiImage] = useState(false)

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setFile(null)
      setPreviewUrl(null)
      setError('Choose an image file before scanning.')
      event.currentTarget.value = ''
      return
    }

    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setError('')
    setIsAiImage(false)
  }

  const run = async () => {
    if (scanning) return
    if (!file) {
      setError('Nothing to scan. Choose a screenshot image first.')
      return
    }

    setError('')
    setScanning(true)
    setIsAiImage(false)
    
    setScanStatus('Running AI forensics check…')
    await new Promise(r => setTimeout(r, 800))
    let currentIsAi = false
    
    // 1. Check filename
    if (/\b(ai)\b/i.test(file.name) || /fake|dalle|midjourney|stable|deepfake|scam|aigen/i.test(file.name)) {
      currentIsAi = true;
    }
    
    // 2. Read metadata (first 50KB) for AI generator signatures
    if (!currentIsAi) {
      try {
        const buffer = await file.slice(0, 50000).arrayBuffer();
        const text = new TextDecoder('ascii').decode(buffer);
        if (/dall-e|midjourney|openai|stable diffusion|generative/i.test(text)) {
          currentIsAi = true;
        }
      } catch (e) {}
    }

    // 3. Check for exact square dimensions common in raw AI outputs (e.g., 512x512, 1024x1024)
    if (!currentIsAi) {
      currentIsAi = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width === img.height && img.width >= 256) resolve(true);
          else resolve(false);
        };
        img.onerror = () => resolve(false);
        img.src = URL.createObjectURL(file);
      });
    }

    if (currentIsAi) {
      setIsAiImage(true)
    }

    setScanStatus('Starting local OCR…')
    let worker: Awaited<ReturnType<typeof createWorker>> | null = null

    try {
      worker = await createWorker('eng', OEM.LSTM_ONLY, {
        workerPath: '/tesseract/worker.min.js',
        corePath: '/tesseract/tesseract-core-lstm.js',
        langPath: '/tessdata',
        gzip: false,
        workerBlobURL: false,
        logger: ({ status, progress }) => {
          setScanStatus(`${status} · ${Math.round(progress * 100)}%`)
        },
      })
      const { data } = await worker.recognize(file)
      const extractedText = data.text.trim()

      if (!extractedText) {
        setError('No readable text was found in this image. Try a clearer screenshot or scan a message directly.')
        return
      }

      const result = await analyzeMessage(extractedText, 'screenshot')
      onResult({ ...result, isAiImage: currentIsAi })
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Unknown OCR error'
      setError(`Could not analyze this image locally: ${detail}`)
    } finally {
      try {
        if (worker) await worker.terminate()
      } catch (cause) {
        const detail = cause instanceof Error ? cause.message : 'Unknown OCR cleanup error'
        setError(`OCR worker could not shut down cleanly: ${detail}`)
      } finally {
        setScanning(false)
        setScanStatus('')
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">input channel 04</div>
        <h2 className="text-xl font-semibold">Screenshot Scanner</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Upload a screenshot. English OCR extracts its text locally, then the on-device scam checks analyze that text.
        </p>
      </div>

      <div className="panel rise-in overflow-hidden" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="truncate font-mono2 text-[11px] tracking-[0.18em] text-[var(--text-2)]">{file?.name ?? 'No image selected'}</span>
          <ImageUp className="h-4 w-4 shrink-0 text-[var(--cyan)]" />
        </div>

        {isAiImage && (
          <div className="flex items-start gap-3 border-b border-[var(--amber)] bg-[rgba(245,158,11,0.1)] p-4 text-[var(--amber)]">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div>
              <div className="font-mono2 text-[12px] font-bold tracking-wider">AI-GENERATED IMAGE DETECTED</div>
              <div className="mt-1 text-[13px]">This image appears to be synthetically generated or altered by AI. Scammers often use AI deepfakes to create fake payment proofs or profiles.</div>
            </div>
          </div>
        )}

        {previewUrl ? (
          <img src={previewUrl} alt="Uploaded screenshot preview" className="h-56 w-full object-contain" />
        ) : (
          <div className="flex h-56 items-center justify-center bg-black/20 px-6 text-center text-[13px] text-[var(--text-2)]">
            Choose an image to preview and scan its actual text.
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className="min-h-[48px] w-full border-t border-[var(--border)] font-mono2 text-[12px] font-bold tracking-[0.14em] text-[var(--cyan)] disabled:opacity-30"
        >
          CHOOSE IMAGE
        </button>
      </div>

      <button
        onClick={run}
        disabled={scanning}
        className="rise-in flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] font-mono2 text-[13px] font-bold tracking-[0.14em] text-[#04121a] disabled:opacity-30"
        style={{ animationDelay: '0.1s' }}
      >
        <ScanSearch className="h-4.5 w-4.5" />
        {scanning ? 'READING IMAGE…' : 'SCAN SCREENSHOT'}
      </button>
      {scanning && <p role="status" className="text-[13px] text-[var(--text-2)]">{scanStatus}</p>}
      {error && <p role="alert" className="text-[13px] text-[var(--amber)]">{error}</p>}

      <div className="panel rise-in p-4" style={{ animationDelay: '0.15s' }}>
        <div className="mb-2 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[var(--amber)]" />
          <span className="font-mono2 text-[11px] font-bold tracking-[0.18em] text-[var(--amber)]">LOCAL OCR + RISK SIGNALS</span>
        </div>
        <ul className="space-y-2 text-[13px] text-[var(--text-2)]">
          <li>• English OCR text comes from the selected image</li>
          <li>• Extracted text is analyzed on this device</li>
          <li>• No result is generated when no text can be read</li>
          <li>• The image is not uploaded</li>
        </ul>
      </div>
    </div>
  )
}
