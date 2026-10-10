import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Camera, CameraOff, Keyboard, ImageUp } from 'lucide-react'
import { analyzeLink, analyzeMessage, type RiskResult } from '../lib/engine'

interface Props {
  onResult: (r: RiskResult) => void
}

export function QrScanScreen({ onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const [camState, setCamState] = useState<'idle' | 'on' | 'denied'>('idle')
  const [manual, setManual] = useState('')
  const [mode, setMode] = useState<'camera' | 'upload' | 'manual'>('camera')
  const [error, setError] = useState('')

  const analyzePayload = async (payload: string, isAiImage = false) => {
    const content = payload.trim()
    if (!content) {
      setError('Nothing to analyze. Scan a QR code or paste its content first.')
      return
    }
    setError('')
    if (/^https?:\/\/|^www\.|^[a-z0-9-]+\.[a-z]{2,}|^upi:\/\//i.test(content)) {
      onResult({ ...analyzeLink(content, 'qr'), isAiImage })
    } else {
      try {
        const result = await analyzeMessage(content, 'qr')
        onResult({ ...result, isAiImage })
      } catch {
        setError('Error during analysis.')
      }
    }
  }

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  useEffect(() => () => stopCamera(), [])

  const tick = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
    if (code?.data) {
      const data = code.data.trim()
      stopCamera()
      setCamState('idle')
      // Simulate AI QR Code detection (e.g. for Stable Diffusion artistic QR codes)
      const isAi = /\b(ai)\b/i.test(data) || /fake|deepfake|midjourney|dalle|aigen/i.test(data)
      analyzePayload(data, isAi)
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      setCamState('on')
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
          rafRef.current = requestAnimationFrame(tick)
        }
      })
    } catch {
      setCamState('denied')
    }
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    setError('')
    const url = URL.createObjectURL(selected)
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' })
      URL.revokeObjectURL(url)
      
      if (code?.data) {
        const data = code.data.trim()
        
        let isAi = /\b(ai)\b/i.test(selected.name) || /fake|deepfake|midjourney|dalle|aigen/i.test(selected.name)
        if (!isAi) {
          try {
            const buffer = await selected.slice(0, 50000).arrayBuffer();
            const text = new TextDecoder('ascii').decode(buffer);
            if (/dall-e|midjourney|openai|stable diffusion|generative/i.test(text)) isAi = true;
          } catch (e) {}
        }
        if (!isAi && img.width === img.height && img.width >= 256) isAi = true;

        analyzePayload(data, isAi)
      } else {
        setError('No QR code found in this image. Make sure the QR is clear and visible.')
      }
    }
    img.src = url
    event.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">input channel 03</div>
        <h2 className="text-xl font-semibold">QR Scanner</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Point the camera at any QR code. The payload is extracted and risk-scored before you ever open it.
        </p>
      </div>

      <div className="flex gap-2">
        {(['camera', 'upload', 'manual'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError('') }}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border font-mono2 text-[10px] sm:text-[11px] tracking-wider transition-colors ${
              mode === m ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-2)]'
            }`}
          >
            {m === 'camera' ? <Camera className="h-4 w-4" /> : m === 'upload' ? <ImageUp className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
            {m === 'camera' ? 'CAMERA' : m === 'upload' ? 'GALLERY' : 'PASTE'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div className="space-y-3">
          <div className="panel rise-in p-6 text-center">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="qr-upload" />
            <label
              htmlFor="qr-upload"
              className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-black/20 text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)] hover:text-[#04121a]"
            >
              <ImageUp className="h-8 w-8" />
              <span className="font-mono2 text-[12px] font-bold tracking-[0.14em]">CHOOSE QR IMAGE</span>
              <span className="text-[11px] text-[var(--text-3)] font-sans tracking-normal">Upload a screenshot or photo from gallery</span>
            </label>
          </div>
          {error && <p role="alert" className="text-[13px] text-[var(--amber)]">{error}</p>}
        </div>
      ) : mode === 'camera' ? (
        <div className="panel rise-in overflow-hidden">
          <div className="relative h-56 w-full bg-black/60 sm:h-64 md:h-72">
            <video ref={videoRef} playsInline muted className={`h-full w-full object-cover ${camState === 'on' ? '' : 'hidden'}`} />
            <canvas ref={canvasRef} className="hidden" />
            {camState === 'on' && (
              <>
                <div className="qr-corner left-6 top-6 border-l-2 border-t-2" />
                <div className="qr-corner right-6 top-6 border-r-2 border-t-2" />
                <div className="qr-corner bottom-6 left-6 border-b-2 border-l-2" />
                <div className="qr-corner bottom-6 right-6 border-b-2 border-r-2" />
                <div className="scanline-anim absolute inset-x-6 h-[2px] bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
              </>
            )}
            {camState !== 'on' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                {camState === 'denied' ? (
                  <>
                    <CameraOff className="h-8 w-8 text-[var(--amber)]" strokeWidth={1.5} />
                    <p className="text-[13px] text-[var(--text-2)]">
                      Camera unavailable or permission denied. Use “Paste content” to analyze a QR payload manually.
                    </p>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-[var(--text-3)]" strokeWidth={1.5} />
                    <p className="text-[13px] text-[var(--text-2)]">Camera is off. Frames are processed locally and never uploaded.</p>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={camState === 'on' ? () => { stopCamera(); setCamState('idle') } : startCamera}
            className="min-h-[48px] w-full border-t border-[var(--border)] font-mono2 text-[12px] font-bold tracking-[0.14em] text-[var(--cyan)]"
          >
            {camState === 'on' ? 'STOP CAMERA' : 'START CAMERA'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="panel rise-in">
            <input
              value={manual}
              onChange={(e) => { setManual(e.target.value); setError('') }}
              placeholder="Paste the QR code content (URL or text)…"
              autoCapitalize="off"
              className="w-full bg-transparent p-4 font-mono2 text-[13px] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>
          <button
            onClick={() => analyzePayload(manual, /\b(ai)\b/i.test(manual) || /fake|deepfake|midjourney|dalle|aigen/i.test(manual))}
            className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[var(--cyan)] font-mono2 text-[13px] font-bold tracking-[0.14em] text-[#04121a]"
          >
            ANALYZE QR CONTENT
          </button>
          {error && <p role="alert" className="text-[13px] text-[var(--amber)]">{error}</p>}
        </div>
      )}
    </div>
  )
}
