import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────

const FONTS = [
  "Playfair Display", "Cormorant Garamond", "Libre Baskerville", "Lora", "EB Garamond",
  "Merriweather", "Crimson Text", "DM Serif Display", "Bodoni Moda", "Spectral",
  "Raleway", "Montserrat", "Oswald", "Nunito", "Josefin Sans", "Work Sans", "Outfit",
  "Syne", "Space Grotesk", "DM Sans", "Poppins", "Bebas Neue", "Cinzel", "Tenor Sans",
  "Italiana", "Yeseva One", "Antonio", "Satisfy", "Pacifico", "Dancing Script",
];

const PRESETS = [
  { name: "Spring",        v: [0.22, 1, 0.36, 1] },
  { name: "Expo Out",      v: [0.16, 1, 0.3, 1] },
  { name: "Back Out",      v: [0.34, 1.56, 0.64, 1] },
  { name: "Ease In Out",   v: [0.4, 0, 0.2, 1] },
  { name: "Bounce",        v: [0.68, -0.55, 0.27, 1.55] },
  { name: "Snappy",        v: [0.1, 0.9, 0.2, 1] },
  { name: "Ease In Cubic", v: [0.55, 0, 1, 0.45] },
  { name: "Linear",        v: [0, 0, 1, 1] },
];

const CANVAS_SIZE = 140;
const PAD = 16;
const CW = CANVAS_SIZE - PAD * 2;
const CH = CANVAS_SIZE - PAD * 2;
const MIN_Y = -0.5;
const MAX_Y = 1.5;

// ── Bezier helpers ─────────────────────────────────────────────────────────────

function toCvs(x, y) {
  return [PAD + x * CW, PAD + (1 - (y - MIN_Y) / (MAX_Y - MIN_Y)) * CH];
}
function fromCvs(cx, cy) {
  return [
    Math.max(0, Math.min(1, (cx - PAD) / CW)),
    Math.max(MIN_Y, Math.min(MAX_Y, MIN_Y + (1 - (cy - PAD) / CH) * (MAX_Y - MIN_Y))),
  ];
}

// ── Styles (injected once as a <style> tag) ────────────────────────────────────

const GLOBAL_CSS = `
@keyframes tas-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.tas-wrap {
  display: flex; flex-direction: column; min-height: 100vh;
  background: #0d0d10; color: #f0e8d8;
}
.tas-controls {
  background: #111115; border-bottom: 1px solid #232328;
  padding: 1.1rem 1.4rem 1.4rem;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.9rem 1.1rem;
}
.tas-panel-title {
  grid-column: 1/-1; font-size: 0.6rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: #7a7060;
  padding-bottom: 0.6rem; border-bottom: 1px solid #232328;
}
.tas-field { display: flex; flex-direction: column; gap: 0.35rem; }
.tas-field-wide { grid-column: span 2; }
.tas-field-full { grid-column: 1/-1; }
.tas-label {
  font-size: 0.6rem; letter-spacing: 0.14em;
  text-transform: uppercase; color: #6a6458;
}
.tas-input, .tas-select {
  background: #18181e; border: 1px solid #2a2a34; border-radius: 5px;
  color: #f0e8d8; font-size: 0.83rem; padding: 0.45rem 0.6rem;
  outline: none; transition: border-color 0.18s; width: 100%;
}
.tas-input:focus, .tas-select:focus { border-color: #c9a96e; }
.tas-select option { background: #18181e; }
.tas-toggle-group, .tas-align-group { display: flex; gap: 0.35rem; }
.tas-btn {
  background: #18181e; border: 1px solid #2a2a34; border-radius: 5px;
  color: #6a6458; cursor: pointer; display: flex; align-items: center;
  justify-content: center; transition: all 0.15s; user-select: none;
  font-size: 0.88rem;
}
.tas-btn:hover { border-color: #c9a96e; color: #f0e8d8; }
.tas-btn-active { background: #c9a96e !important; border-color: #c9a96e !important; color: #0d0d10 !important; }
.tas-toggle-btn { width: 34px; height: 34px; }
.tas-align-btn  { flex: 1; height: 34px; font-size: 1rem; }
.tas-range-row  { display: flex; align-items: center; gap: 0.55rem; }
.tas-range {
  flex: 1; -webkit-appearance: none; height: 3px; border-radius: 2px;
  background: #2a2a34; outline: none; cursor: pointer;
}
.tas-range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 13px; height: 13px;
  border-radius: 50%; background: #c9a96e; cursor: pointer;
}
.tas-range-val { font-size: 0.75rem; color: #c9a96e; min-width: 2.8rem; text-align: right; }
.tas-bezier-wrap { display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap; }
.tas-bezier-canvas {
  display: block; border: 1px solid #2a2a34; border-radius: 7px;
  background: #18181e; cursor: crosshair; touch-action: none; flex-shrink: 0;
}
.tas-bezier-right { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; min-width: 140px; }
.tas-bezier-values { display: flex; gap: 0.35rem; }
.tas-bz-num {
  width: 52px; text-align: center; font-size: 0.73rem; padding: 0.32rem 0.25rem;
  background: #18181e; border: 1px solid #2a2a34; border-radius: 5px;
  color: #f0e8d8; outline: none;
}
.tas-bz-num:focus { border-color: #c9a96e; }
.tas-presets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem; }
.tas-preset-btn {
  background: #18181e; border: 1px solid #2a2a34; border-radius: 4px;
  color: #6a6458; font-size: 0.68rem; padding: 0.32rem 0.5rem; cursor: pointer;
  text-align: left; transition: all 0.14s; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.tas-preset-btn:hover { border-color: #c9a96e; color: #f0e8d8; }
.tas-preset-active { border-color: #c9a96e !important; color: #c9a96e !important; }
.tas-replay-btn {
  background: transparent; border: 1px solid #c9a96e; border-radius: 5px;
  color: #c9a96e; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 0.45rem 1rem; cursor: pointer; transition: all 0.18s; align-self: flex-start;
}
.tas-replay-btn:hover { background: #c9a96e; color: #0d0d10; }
.tas-stage {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 3.5rem 2rem; position: relative; overflow: hidden;
}
.tas-stage::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 30% 60%, rgba(201,169,110,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 70% 30%, rgba(201,169,110,0.04) 0%, transparent 70%);
}
.tas-scene { position: relative; width: 100%; }
.tas-line-top {
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a96e, transparent);
  margin: 0 auto 1.8rem; opacity: 0; width: 0;
  transition: none;
}
.tas-line-bottom {
  height: 1px;
  background: linear-gradient(90deg, transparent, #7a7060, transparent);
  margin: 1.8rem auto 0; opacity: 0; width: 0;
  transition: none;
}
.tas-anim-text {
  display: flex; flex-wrap: wrap; gap: 0.25em;
  line-height: 1.2; color: #f0e8d8; padding: 0 1rem;
}
.tas-word { display: inline-block; opacity: 0; transform: translateY(40px); }
.tas-cursor {
  display: inline-block; width: 3px; height: 1em;
  background: #f0e8d8; margin-left: 3px; vertical-align: text-bottom; opacity: 0;
}
`;

function injectStyles() {
  if (document.getElementById("tas-styles")) return;
  const style = document.createElement("style");
  style.id = "tas-styles";
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

function loadGoogleFont(family) {
  const id = `tas-font-${family.replace(/ /g, "-")}`;
  if (document.getElementById(id)) return;
  const slug = family.replace(/ /g, "+");
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${slug}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
  document.head.appendChild(link);
}

// ── BezierCanvas sub-component ─────────────────────────────────────────────────

function BezierCanvas({ bezier, onChange }) {
  const canvasRef = useRef(null);
  const draggingRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const [x1, y1, x2, y2] = bezier;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = "#20202a"; ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach((t) => {
      const [gx] = toCvs(t, 0); const [, gy] = toCvs(0, t);
      ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, CANVAS_SIZE - PAD); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(CANVAS_SIZE - PAD, gy); ctx.stroke();
    });

    // Diagonal
    ctx.strokeStyle = "#2a2a36"; ctx.lineWidth = 1;
    const [sx, sy] = toCvs(0, 0); const [ex, ey] = toCvs(1, 1);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();

    // Handles
    const [p1x, p1y] = toCvs(x1, y1); const [p2x, p2y] = toCvs(x2, y2);
    ctx.strokeStyle = "#383845"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(p1x, p1y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(p2x, p2y); ctx.stroke();

    // Curve
    ctx.strokeStyle = "#c9a96e"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(p1x, p1y, p2x, p2y, ex, ey); ctx.stroke();

    // Control dots
    [[p1x, p1y, "#c9a96e"], [p2x, p2y, "#956e3a"]].forEach(([px, py, col]) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#0d0d10"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.stroke();
    });

    // Endpoints
    [[sx, sy], [ex, ey]].forEach(([px, py]) => {
      ctx.fillStyle = "#f0e8d8"; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
    });
  }, [bezier]);

  useEffect(() => { draw(); }, [draw]);

  function getCanvasXY(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return [
      (e.clientX - r.left) * (CANVAS_SIZE / r.width),
      (e.clientY - r.top) * (CANVAS_SIZE / r.height),
    ];
  }

  function hitTest(cx, cy) {
    const [x1, y1, x2, y2] = bezier;
    const [p1x, p1y] = toCvs(x1, y1); const [p2x, p2y] = toCvs(x2, y2);
    if (Math.hypot(cx - p1x, cy - p1y) < 10) return 1;
    if (Math.hypot(cx - p2x, cy - p2y) < 10) return 2;
    return null;
  }

  function onPointerDown(e) {
    const [cx, cy] = getCanvasXY(e);
    const hit = hitTest(cx, cy);
    if (hit) { draggingRef.current = hit; e.currentTarget.setPointerCapture(e.pointerId); }
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    const [cx, cy] = getCanvasXY(e);
    const [nx, ny] = fromCvs(cx, cy);
    const next = [...bezier];
    if (draggingRef.current === 1) { next[0] = +nx.toFixed(3); next[1] = +ny.toFixed(3); }
    else { next[2] = +nx.toFixed(3); next[3] = +ny.toFixed(3); }
    onChange(next, false);
  }

  function onPointerUp() {
    if (draggingRef.current) { draggingRef.current = null; onChange(bezier, true); }
  }

  return (
    <canvas
      ref={canvasRef}
      className="tas-bezier-canvas"
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TextAnimationStudio() {
  const [text, setText] = useState("hello there, how's your evening?");
  const [font, setFont] = useState("Playfair Display");
  const [size, setSize] = useState(72);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState("center");
  const [duration, setDuration] = useState(0.9);
  const [stagger, setStagger] = useState(0.22);
  const [bezier, setBezier] = useState([0.22, 1, 0.36, 1]);
  const [activePreset, setActivePreset] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Refs for animated DOM elements
  const animTextRef = useRef(null);
  const lineTopRef = useRef(null);
  const lineBottomRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Inject global CSS once
  useEffect(() => { injectStyles(); }, []);

  // Load font whenever it changes
  useEffect(() => { loadGoogleFont(font); }, [font]);

  // Clear all pending timeouts
  function clearTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }

  // Run animation
  const runAnimation = useCallback(() => {
    clearTimeouts();
    const container = animTextRef.current;
    const lineTop = lineTopRef.current;
    const lineBottom = lineBottomRef.current;
    if (!container || !lineTop || !lineBottom) return;

    // Reset
    container.innerHTML = "";
    lineTop.style.cssText = "opacity:0;width:0;transition:none;";
    lineBottom.style.cssText = "opacity:0;width:0;transition:none;";

    const alignMap = { left: "flex-start", center: "center", right: "flex-end" };
    Object.assign(container.style, {
      fontFamily: `'${font}', serif`,
      fontSize: `${size}px`,
      fontWeight: bold ? "700" : "400",
      fontStyle: italic ? "italic" : "normal",
      textDecoration: underline ? "underline" : "none",
      justifyContent: alignMap[align],
      textAlign: align,
    });

    const easing = `cubic-bezier(${bezier.join(",")})`;
    const startDelay = 0.25;
    const words = text.trim().split(/\s+/);

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "tas-word";
      span.textContent = word;
      container.appendChild(span);
      const delay = startDelay + i * stagger;
      later(() => {
        span.style.transition = `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`;
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, 30);
    });

    // Cursor
    const cursor = document.createElement("span");
    cursor.className = "tas-cursor";
    container.appendChild(cursor);
    const cursorMs = (startDelay + words.length * stagger + duration * 0.8) * 1000;
    later(() => {
      cursor.style.opacity = "1";
      cursor.style.animation = "tas-blink 1.1s step-end infinite";
    }, cursorMs);

    // Decorative lines
    later(() => {
      lineTop.style.cssText = "opacity:1;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);width:160px;";
    }, 50);
    const bottomMs = (startDelay + words.length * stagger + 0.4) * 1000;
    later(() => {
      lineBottom.style.cssText = "opacity:1;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);width:120px;";
    }, bottomMs);
  }, [text, font, size, bold, italic, underline, align, duration, stagger, bezier]);

  // Re-run animation whenever settings or animKey changes
  useEffect(() => {
    const id = setTimeout(runAnimation, 50);
    return () => { clearTimeout(id); clearTimeouts(); };
  }, [runAnimation, animKey]);

  function handleBezierChange(next, shouldReplay) {
    setBezier(next);
    setActivePreset(-1);
    if (shouldReplay) setAnimKey((k) => k + 1);
  }

  function handlePreset(preset, i) {
    setBezier([...preset.v]);
    setActivePreset(i);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="tas-wrap">
      {/* ── Controls ── */}
      <div className="tas-controls">
        <div className="tas-panel-title">✦ Animation Studio</div>

        {/* Text */}
        <div className="tas-field tas-field-wide">
          <label className="tas-label">Text</label>
          <input
            className="tas-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Font family */}
        <div className="tas-field tas-field-wide">
          <label className="tas-label">Font Family</label>
          <select
            className="tas-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Font size */}
        <div className="tas-field">
          <label className="tas-label">Font Size</label>
          <div className="tas-range-row">
            <input
              className="tas-range"
              type="range" min={14} max={120} value={size}
              onChange={(e) => setSize(+e.target.value)}
            />
            <span className="tas-range-val">{size}px</span>
          </div>
        </div>

        {/* Style toggles */}
        <div className="tas-field">
          <label className="tas-label">Style</label>
          <div className="tas-toggle-group">
            {[
              { key: "bold",      label: <b>B</b>,      val: bold,      set: setBold },
              { key: "italic",    label: <i>I</i>,      val: italic,    set: setItalic },
              { key: "underline", label: <u>U</u>,      val: underline, set: setUnderline },
            ].map(({ key, label, val, set }) => (
              <button
                key={key}
                className={`tas-btn tas-toggle-btn${val ? " tas-btn-active" : ""}`}
                onClick={() => set((v) => !v)}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div className="tas-field">
          <label className="tas-label">Alignment</label>
          <div className="tas-align-group">
            {["left", "center", "right"].map((a) => (
              <button
                key={a}
                className={`tas-btn tas-align-btn${align === a ? " tas-btn-active" : ""}`}
                onClick={() => setAlign(a)}
                title={a.charAt(0).toUpperCase() + a.slice(1)}
              >
                {a === "left" ? "⬅" : a === "center" ? "↔" : "➡"}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="tas-field">
          <label className="tas-label">Word Duration</label>
          <div className="tas-range-row">
            <input
              className="tas-range"
              type="range" min={0.1} max={3} step={0.05} value={duration}
              onChange={(e) => setDuration(+e.target.value)}
            />
            <span className="tas-range-val">{duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Stagger */}
        <div className="tas-field">
          <label className="tas-label">Stagger</label>
          <div className="tas-range-row">
            <input
              className="tas-range"
              type="range" min={0.02} max={1} step={0.02} value={stagger}
              onChange={(e) => setStagger(+e.target.value)}
            />
            <span className="tas-range-val">{stagger.toFixed(2)}s</span>
          </div>
        </div>

        {/* Bezier editor */}
        <div className="tas-field tas-field-full">
          <label className="tas-label">Easing Curve — drag the handles</label>
          <div className="tas-bezier-wrap">
            <BezierCanvas bezier={bezier} onChange={handleBezierChange} />
            <div className="tas-bezier-right">
              {/* Numeric inputs */}
              <div className="tas-bezier-values">
                {["x1", "y1", "x2", "y2"].map((k, i) => (
                  <input
                    key={k}
                    className="tas-bz-num"
                    type="number"
                    title={k}
                    value={bezier[i]}
                    min={k.startsWith("x") ? 0 : -2}
                    max={k.startsWith("x") ? 1 : 3}
                    step={0.01}
                    onChange={(e) => {
                      const next = [...bezier];
                      next[i] = parseFloat(e.target.value) || 0;
                      handleBezierChange(next, true);
                    }}
                  />
                ))}
              </div>
              {/* Presets */}
              <div className="tas-presets-grid">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    className={`tas-preset-btn${activePreset === i ? " tas-preset-active" : ""}`}
                    onClick={() => handlePreset(p, i)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              {/* Replay */}
              <button
                className="tas-replay-btn"
                onClick={() => setAnimKey((k) => k + 1)}
              >
                ↺ Replay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stage ── */}
      <div className="tas-stage">
        <div className="tas-scene">
          <div ref={lineTopRef} className="tas-line-top" />
          <div ref={animTextRef} className="tas-anim-text" />
          <div ref={lineBottomRef} className="tas-line-bottom" />
        </div>
      </div>
    </div>
  );
}
