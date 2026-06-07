import { useEffect, useRef, useState } from 'react'

const HUD_H = 48

function computeIntensity(col: number, row: number, cols: number, rows: number, t: number) {
  const nx = col / cols
  const ny = row / rows
  const cx = 0.5
  const cy = 0.5
  const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2)

  const p1 = Math.sin(nx * 6 + t * 0.05) * Math.cos(ny * 4 - t * 0.04)
  const p2 = Math.sin(dist * 8 - t * 0.07)
  const p3 = Math.cos(nx * 3 + ny * 5 + t * 0.03)
  return ((p1 + p2 + p3) / 3) * 0.45 + 0.55
}

function dotRGBA(v: number): [number, number, number, number] {
  if (v > 0.9) return [255, 255, 255, 1]
  if (v > 0.76) {
    const l = (v - 0.76) / 0.14
    return [Math.round(124 + (255 - 124) * l), Math.round(109 + (255 - 109) * l), 250, 0.4 + l * 0.6]
  }
  if (v > 0.52) {
    const l = (v - 0.52) / 0.24
    return [Math.round(60 + (124 - 60) * l), Math.round(55 + (109 - 55) * l), Math.round(140 + (250 - 140) * l), 0.2 + l * 0.4]
  }
  const l = v / 0.52
  return [Math.round(28 + (60 - 28) * l), Math.round(28 + (55 - 28) * l), Math.round(35 + (140 - 35) * l), 0.08 + l * 0.2]
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: { top: 8, left: 8,     borderWidth: '1px 0 0 1px', borderRadius: '2px 0 0 0' },
    tr: { top: 8, right: 8,    borderWidth: '1px 1px 0 0', borderRadius: '0 2px 0 0' },
    bl: { bottom: 8, left: 8,  borderWidth: '0 0 1px 1px', borderRadius: '0 0 0 2px' },
    br: { bottom: 8, right: 8, borderWidth: '0 1px 1px 0', borderRadius: '0 0 2px 0' },
  } as const

  return (
    <div
      style={{
        position: 'absolute',
        width: 12,
        height: 12,
        borderStyle: 'solid',
        borderColor: '#1e1e22',
        opacity: 0.6,
        ...map[pos],
      }}
    />
  )
}

function PulseDot() {
  return (
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#7c6dfa',
        animation: 'dotPulse 2s ease-in-out infinite',
      }}
    />
  )
}

export type DotGridLoaderStatus = {
  title: string
  sub: string
  stage: string
  index: number
  total: number
}

type DotGridLoaderProps = {
  fill?: boolean
  compact?: boolean
  width?: number
  height?: number
  progress?: number
  jobId?: string
  status?: DotGridLoaderStatus
}

export default function DotGridLoader({
  fill = false,
  compact = false,
  width = 420,
  height = 420,
  progress = 0,
  jobId = 'gen_001',
  status,
}: DotGridLoaderProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const tickRef = useRef(0)
  const gridRef = useRef({ cols: 28, rows: 24 })

  const [boxSize, setBoxSize] = useState({ width, height })
  const [displayProgress, setDisplayProgress] = useState(progress)

  const title = status?.title ?? 'Processing'

  useEffect(() => {
    setDisplayProgress(Math.max(0, Math.min(100, Math.round(progress))))
  }, [progress])

  useEffect(() => {
    if (!fill) {
      setBoxSize({ width, height })
      return
    }

    const el = shellRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      setBoxSize({
        width: Math.max(compact ? 80 : 280, Math.floor(rect.width)),
        height: Math.max(compact ? 45 : 320, Math.floor(rect.height)),
      })
    }

    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [fill, compact, width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || boxSize.width <= 0 || boxSize.height <= 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padV = compact ? 8 : 16
    const hudH = compact ? 28 : HUD_H
    const canvasW = boxSize.width - (compact ? 12 : 32)
    const canvasH = boxSize.height - padV - hudH - (compact ? 4 : 10)
    if (canvasW <= 0 || canvasH <= 0) return

    canvas.width = canvasW
    canvas.height = canvasH

    const cols = Math.max(18, Math.floor(canvasW / 12))
    const rows = Math.max(14, Math.floor(canvasH / 12))
    gridRef.current = { cols, rows }

    function render() {
      const { cols, rows } = gridRef.current
      const gx = canvas!.width / cols
      const gy = canvas!.height / rows

      ctx!.fillStyle = '#0c0c0d'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = computeIntensity(c, r, cols, rows, tickRef.current)
          const [cr, cg, cb, a] = dotRGBA(v)
          const rad = 1.6 * (0.75 + v * 0.5)
          ctx!.beginPath()
          ctx!.arc(gx * (c + 0.5), gy * (r + 0.5), rad, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(2)})`
          ctx!.fill()
        }
      }

      tickRef.current++
      rafRef.current = requestAnimationFrame(render)
    }

    render()
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [boxSize.width, boxSize.height, compact])

  return (
    <>
      <style>{`@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}`}</style>
      <div
        ref={shellRef}
        style={{
          ...css.shell,
          ...(fill ? { width: '100%', height: '100%', minHeight: 0 } : {}),
        }}
      >
        <div
          style={{
            ...css.card,
            width: boxSize.width,
            height: boxSize.height,
            ...(compact ? { borderRadius: 0, border: 'none' } : {}),
          }}
        >
          {!compact && (
            <>
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />
            </>
          )}

          <div style={compact ? css.hudCompact : css.hud}>
            <div style={css.hudLeft}>
              <span style={compact ? css.hudTitleCompact : css.hudTitle}>{title}</span>
              {!compact && <span style={css.hudSub}>MoneyPrinterTurbo · {jobId}</span>}
            </div>
            <div style={css.hudRight}>
              <PulseDot />
              <span style={compact ? css.pctLabelCompact : css.pctLabel}>{displayProgress}%</span>
            </div>
          </div>

          <div style={compact ? css.canvasWrapCompact : css.canvasWrap}>
            <canvas ref={canvasRef} style={css.canvas} />
          </div>

          
        </div>
      </div>
    </>
  )
}

const css = {
  shell: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono','IBM Plex Mono',monospace" },
  card: { background: '#0c0c0d', borderRadius: 20, border: '1px solid #1e1e22', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  hud: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 0', minHeight: HUD_H },
  hudCompact: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 0', minHeight: 28 },
  hudLeft: { display: 'flex', flexDirection: 'column', gap: 3 },
  hudRight: { display: 'flex', alignItems: 'center', gap: 8 },
  hudTitle: { fontSize: 11, fontWeight: 500, color: '#e8e8ec', letterSpacing: '0.08em', textTransform: 'uppercase' },
  hudTitleCompact: { fontSize: 8, fontWeight: 700, color: '#e8e8ec', letterSpacing: '0.1em', textTransform: 'uppercase' },
  hudSub: { fontSize: 10, color: '#44444e', letterSpacing: '0.04em' },
  pctLabel: { fontSize: 11, fontWeight: 500, color: '#7c6dfa', letterSpacing: '0.04em' },
  pctLabelCompact: { fontSize: 8, fontWeight: 600, color: '#7c6dfa', letterSpacing: '0.04em' },
  canvasWrap: { flex: 1, padding: '12px 16px 6px', minHeight: 0 },
  canvasWrapCompact: { flex: 1, padding: '2px 6px 4px', minHeight: 0 },
  canvas: { display: 'block', width: '100%', height: '100%', borderRadius: 6 },
  footer: { padding: '10px 18px 14px', display: 'flex', flexDirection: 'column', gap: 7 },
  progressRow: { display: 'flex', alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 1, background: '#252529', borderRadius: 1, overflow: 'hidden' },
  fill: { height: '100%', background: '#7c6dfa', borderRadius: 1, transition: 'width .6s cubic-bezier(.4,0,.2,1)' },
  stageText: { fontSize: 9, color: '#44444e', letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 80, textAlign: 'right' },
  stepRow: { display: 'flex', gap: 5, alignItems: 'center' },
  step: { flex: 1, height: 2, borderRadius: 1, background: '#252529', transition: 'background .4s ease' },
  stepDone: { background: '#4fc8a8' },
  stepActive: { background: '#7c6dfa' },
} as const
