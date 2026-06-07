import { useEffect, useRef, useState, useCallback } from "react";

const MODES = [
  { id: "ripple",  label: "Ripple"  },
  { id: "vortex",  label: "Vortex"  },
  { id: "scan",    label: "Scan"    },
  { id: "rain",    label: "Rain"    },
  { id: "plasma",  label: "Plasma"  },
  { id: "radial",  label: "Radial"  },
];

const STAGES = [
  { title: "Initializing",     sub: "preparing pipeline",   stage: "sampling"    },
  { title: "Creating image",   sub: "diffusion step 12/40", stage: "diffusing"   },
  { title: "Refining details", sub: "upscale pass 1/2",     stage: "sharpening"  },
  { title: "Finalizing",       sub: "compositing layers",   stage: "compositing" },
];

const COLS = 28;
const ROWS = 24;
const DOT  = 2.0;

function computeIntensity(col: number, row: number, t: number, mode: string) {
  const nx = col / COLS, ny = row / ROWS;
  const cx = 0.5, cy = 0.5;
  const dist  = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
  const angle = Math.atan2(ny - cy, nx - cx);

  switch (mode) {
    case "ripple": {
      const w  = Math.sin(dist * 16 - t * 0.065) * 0.5 + 0.5;
      const hx = Math.sin(nx * 7 + t * 0.04) * 0.25 + 0.25;
      const hy = Math.sin(ny * 5 - t * 0.035) * 0.25 + 0.25;
      return w * 0.6 + hx * 0.2 + hy * 0.2;
    }
    case "vortex": {
      const spiral = Math.sin(dist * 10 - angle * 3 - t * 0.08) * 0.5 + 0.5;
      const outer  = Math.max(0, 1 - dist * 1.8);
      return spiral * 0.7 + outer * 0.3;
    }
    case "scan": {
      const sl   = (t * 0.011) % 1;
      const up   = (t * 0.0055 + 0.5) % 1;
      const d1   = Math.abs(ny - sl);
      const d2   = Math.abs(ny - up);
      const beam = Math.max(Math.max(0, 1 - d1 * 16), Math.max(0, 1 - d2 * 16) * 0.4);
      return Math.min(1, 0.1 + Math.sin(nx * 9 + t * 0.025) * 0.07 + beam * 0.9);
    }
    case "rain": {
      const seed = Math.sin(nx * 19.7 + col * 3.3) * 0.5 + 0.5;
      const fp   = (t * 0.018 + seed * 2.5) % 1;
      const tail = Math.max(0, 1 - (ny < fp ? fp - ny : 1) / 0.18) * (0.6 + seed * 0.4);
      return Math.min(1, 0.06 + tail);
    }
    case "plasma": {
      const p1 = Math.sin(nx * 6 + t * 0.05) * Math.cos(ny * 4 - t * 0.04);
      const p2 = Math.sin(dist * 8 - t * 0.07);
      const p3 = Math.cos(nx * 3 + ny * 5 + t * 0.03);
      return ((p1 + p2 + p3) / 3) * 0.45 + 0.55;
    }
    case "radial": {
      const spoke = Math.sin(angle * 8 + t * 0.06) * 0.3 + 0.3;
      const ring  = Math.sin(dist * 12 - t * 0.08) * 0.5 + 0.5;
      return ring * 0.65 + spoke * 0.35;
    }
    default: return 0.3;
  }
}

function dotRGBA(v: number) {
  if (v > 0.9) return [255, 255, 255, 1];
  if (v > 0.76) {
    const l = (v - 0.76) / 0.14;
    return [Math.round(124 + (255 - 124) * l), Math.round(109 + (255 - 109) * l), 250, 0.4 + l * 0.6];
  }
  if (v > 0.52) {
    const l = (v - 0.52) / 0.24;
    return [Math.round(60 + (124 - 60) * l), Math.round(55 + (109 - 55) * l), Math.round(140 + (250 - 140) * l), 0.2 + l * 0.4];
  }
  const l = v / 0.52;
  return [Math.round(28 + (60 - 28) * l), Math.round(28 + (55 - 28) * l), Math.round(35 + (140 - 35) * l), 0.08 + l * 0.2];
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: { top: 8, left: 8,     borderWidth: "1px 0 0 1px", borderRadius: "2px 0 0 0" },
    tr: { top: 8, right: 8,    borderWidth: "1px 1px 0 0", borderRadius: "0 2px 0 0" },
    bl: { bottom: 8, left: 8,  borderWidth: "0 0 1px 1px", borderRadius: "0 0 0 2px" },
    br: { bottom: 8, right: 8, borderWidth: "0 1px 1px 0", borderRadius: "0 0 2px 0" },
  };
  return (
    <div style={{
      position: "absolute", width: 12, height: 12,
      borderStyle: "solid", borderColor: "#1e1e22", opacity: 0.6,
      ...map[pos],
    }} />
  );
}

function PulseDot() {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: "50%", background: "#7c6dfa",
      animation: "dotPulse 2s ease-in-out infinite",
    }} />
  );
}

export default function DotGridLoader({
  width        = 420,
  height       = 420,
  defaultMode  = "ripple",
  showControls = true,
  autoProgress = true,
  jobId        = "gen_001",
  onComplete   = null,
}: {
  width?:        number
  height?:       number
  defaultMode?:  string
  showControls?: boolean
  autoProgress?: boolean
  jobId?:        string
  onComplete?:   (() => void) | null
}) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tickRef   = useRef(0);
  const pctRef    = useRef(0);
  const modeRef   = useRef(defaultMode);

  const [mode,     setMode]     = useState(defaultMode);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);

  const resetProgress = useCallback(() => {
    tickRef.current = 0;
    pctRef.current  = 0;
    setProgress(0);
    setStageIdx(0);
  }, []);

  const handleMode = useCallback((m) => {
    modeRef.current = m;
    setMode(m);
    resetProgress();
  }, [resetProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function render() {
      const W = canvas.width, H = canvas.height;
      const gx = W / COLS, gy = H / ROWS;

      ctx.fillStyle = "#0c0c0d";
      ctx.fillRect(0, 0, W, H);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v               = computeIntensity(c, r, tickRef.current, modeRef.current);
          const [cr, cg, cb, a] = dotRGBA(v);
          const rad             = DOT * (0.75 + v * 0.5);
          ctx.beginPath();
          ctx.arc(gx * (c + 0.5), gy * (r + 0.5), rad, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(2)})`;
          ctx.fill();
        }
      }

      tickRef.current++;

      if (autoProgress && tickRef.current % 18 === 0 && pctRef.current < 98) {
        const step = pctRef.current < 50 ? 1.6 : pctRef.current < 78 ? 0.8 : 0.3;
        pctRef.current = Math.min(98, pctRef.current + step);
        const p  = Math.round(pctRef.current);
        const si = Math.min(3, Math.floor(p / 25));
        setProgress(p);
        setStageIdx(si);
        if (p >= 98 && onComplete) onComplete();
      }

      rafRef.current = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoProgress, onComplete]);

  const stage   = STAGES[stageIdx];
  const canvasW = width  - 32;
  const canvasH = height - 32 - 48 - 52;

  return (
    <>
      <style>{`@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}`}</style>
      <div style={css.shell}>
        <div style={{ ...css.card, width, height }}>
          <Corner pos="tl" /><Corner pos="tr" />
          <Corner pos="bl" /><Corner pos="br" />

          <div style={css.hud}>
            <div style={css.hudLeft}>
              <span style={css.hudTitle}>{stage.title}</span>
              <span style={css.hudSub}>flow-scrape-ai · {jobId}</span>
            </div>
            <div style={css.hudRight}>
              <PulseDot />
              <span style={css.pctLabel}>{progress}%</span>
            </div>
          </div>

          <div style={css.canvasWrap}>
            <canvas ref={canvasRef} width={canvasW} height={canvasH} style={css.canvas} />
          </div>

          <div style={css.footer}>
            <div style={css.progressRow}>
              <div style={css.track}>
                <div style={{ ...css.fill, width: `${progress}%` }} />
              </div>
              <span style={css.stageText}>{stage.stage}</span>
            </div>
            <div style={css.stepRow}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  ...css.step,
                  ...(i < stageIdx   ? css.stepDone   : {}),
                  ...(i === stageIdx ? css.stepActive : {}),
                }} />
              ))}
            </div>
          </div>
        </div>

        {showControls && (
          <div style={css.btnRow}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => handleMode(m.id)}
                style={{ ...css.btn, ...(mode === m.id ? css.btnOn : {}) }}>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const css = {
  shell:       { display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:"1.5rem 0", fontFamily:"'Geist Mono','IBM Plex Mono',monospace" },
  card:        { background:"#0c0c0d", borderRadius:20, border:"1px solid #1e1e22", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" },
  hud:         { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 0" },
  hudLeft:     { display:"flex", flexDirection:"column", gap:3 },
  hudRight:    { display:"flex", alignItems:"center", gap:8 },
  hudTitle:    { fontSize:11, fontWeight:500, color:"#e8e8ec", letterSpacing:"0.08em", textTransform:"uppercase" },
  hudSub:      { fontSize:10, color:"#44444e", letterSpacing:"0.04em" },
  pctLabel:    { fontSize:11, fontWeight:500, color:"#7c6dfa", letterSpacing:"0.04em" },
  canvasWrap:  { flex:1, padding:"12px 16px 6px" },
  canvas:      { display:"block", width:"100%", height:"100%", borderRadius:6 },
  footer:      { padding:"10px 18px 14px", display:"flex", flexDirection:"column", gap:7 },
  progressRow: { display:"flex", alignItems:"center", gap:10 },
  track:       { flex:1, height:1, background:"#252529", borderRadius:1, overflow:"hidden" },
  fill:        { height:"100%", background:"#7c6dfa", borderRadius:1, transition:"width .6s cubic-bezier(.4,0,.2,1)" },
  stageText:   { fontSize:9, color:"#44444e", letterSpacing:"0.1em", textTransform:"uppercase", minWidth:80, textAlign:"right" },
  stepRow:     { display:"flex", gap:5, alignItems:"center" },
  step:        { flex:1, height:2, borderRadius:1, background:"#252529", transition:"background .4s ease" },
  stepDone:    { background:"#4fc8a8" },
  stepActive:  { background:"#7c6dfa" },
  btnRow:      { display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" },
  btn:         { fontFamily:"inherit", fontSize:10, fontWeight:400, letterSpacing:"0.06em", textTransform:"uppercase", padding:"5px 12px", borderRadius:6, cursor:"pointer", border:"1px solid #1e1e22", background:"#111113", color:"#44444e", transition:"all .15s ease" },
  btnOn:       { borderColor:"#7c6dfa", color:"#7c6dfa", background:"rgba(124,109,250,0.12)" },
} as const;
