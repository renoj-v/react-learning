import { useState, useRef, useCallback } from "react";

const COLORS = [
  "#7c3aed","#f472b6","#34d399","#fbbf24","#60a5fa",
  "#f87171","#a3e635","#fb923c","#e879f9","#2dd4bf",
  "#fff176","#ff6b6b",
];
const MSGS = [
  "BOOM!! 💥","LET'S GOOO!! 🚀","WOOHOO!! 🎊","HECK YEAH!! ✨",
  "INSANE!! 🔥","LEGENDARY!! 👑","TOO MUCH!! 💫","UNSTOPPABLE!! ⚡",
];
const COMBOS = ["x2 COMBO!!","x3 MEGA!!","x4 ULTRA!!","x5 MAX!!","∞ INFINITE!!"];
const GRAVITY = 420;

const rand = (min, max) => min + Math.random() * (max - min);

export default function ConfettiButton() {
  const sceneRef = useRef(null);
  const btnRef = useRef(null);
  const msgRef = useRef(null);
  const clicksRef = useRef(0);
  const comboTimerRef = useRef(null);
  const msgTimerRef = useRef(null);
  const [msgText, setMsgText] = useState("");
  const [msgAnim, setMsgAnim] = useState(""); // "pop" | "fadeout" | ""
  const [btnAnim, setBtnAnim] = useState(false);

  const spawnSparks = useCallback((cx, cy) => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("div");
      const angle = (i / 16) * Math.PI * 2;
      const dist = rand(60, 140);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const size = rand(4, 10);
      const dur = rand(0.3, 0.55);
      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`, height: `${size}px`,
        background: COLORS[Math.floor(Math.random() * COLORS.length)],
        borderRadius: "50%",
        left: `${cx}px`, top: `${cy}px`,
        marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px`,
        pointerEvents: "none",
        zIndex: 9,
        animation: `sparkfly ${dur}s ease-out forwards`,
        "--tx": `${tx}px`, "--ty": `${ty}px`,
      });
      scene.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 50);
    }
  }, []);

  const spawnCombo = useCallback((cx, cy, n) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const el = document.createElement("div");
    el.textContent = COMBOS[Math.min(n - 2, COMBOS.length - 1)];
    Object.assign(el.style, {
      position: "absolute",
      left: `${cx}px`, top: `${cy}px`,
      fontSize: "28px", fontWeight: 500,
      color: COLORS[n % COLORS.length],
      pointerEvents: "none",
      zIndex: 20,
      animation: "combopop 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards",
    });
    scene.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }, []);

  const spawnRings = useCallback((cx, cy, bw, bh) => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (let c = 0; c < 3; c++) {
      const ring = document.createElement("div");
      Object.assign(ring.style, {
        position: "absolute",
        borderRadius: "50%",
        border: `4px solid ${COLORS[c * 2]}`,
        pointerEvents: "none",
        zIndex: 5,
        width: `${bw * 0.9}px`, height: `${bh * 0.7}px`,
        left: `${cx}px`, top: `${cy}px`,
        transform: "translate(-50%,-50%) scale(0.1)",
        animation: `ringout 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${c * 90}ms forwards`,
      });
      scene.appendChild(ring);
      setTimeout(() => ring.remove(), 800 + c * 90);
    }
  }, []);

  const spawnConfetti = useCallback((cx, cy, sceneH) => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (let i = 0; i < 160; i++) {
      const el = document.createElement("div");
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isCirc = Math.random() > 0.45;
      const isLong = !isCirc && Math.random() > 0.5;
      const w = isCirc ? rand(8,15) : isLong ? rand(3,7) : rand(7,18);
      const h = isCirc ? w : isLong ? rand(12,26) : rand(5,13);
      Object.assign(el.style, {
        position: "absolute",
        width: `${w}px`, height: `${h}px`,
        background: color,
        borderRadius: isCirc ? "50%" : "2px",
        left: `${cx}px`, top: `${cy}px`,
        pointerEvents: "none",
      });
      scene.appendChild(el);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7;
      const speed = rand(180, 600);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const rot = (Math.random() - 0.5) * 1600;
      const delay = Math.random() * 60;
      const start = performance.now() + delay;

      (function animate(now) {
        if (now < start) { requestAnimationFrame(animate); return; }
        const t = (now - start) / 1000;
        const x = cx + vx * t;
        const y = cy + vy * t + GRAVITY * t * t;
        el.style.transform = `translate(${x - cx}px,${y - cy}px) rotate(${rot * t}deg)`;
        if (y > sceneH + 20) { el.remove(); return; }
        requestAnimationFrame(animate);
      })(performance.now());
    }
  }, []);

  const shoot = useCallback(() => {
    const scene = sceneRef.current;
    const btn = btnRef.current;
    if (!scene || !btn) return;

    const sr = scene.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const cx = br.left - sr.left + br.width / 2;
    const cy = br.top - sr.top + br.height / 2;

    clicksRef.current++;
    clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => { clicksRef.current = 0; }, 1200);
    if (clicksRef.current >= 2) spawnCombo(cx, cy, clicksRef.current);

    setBtnAnim(true);
    spawnRings(cx, cy, br.width, br.height);
    spawnSparks(cx, cy);
    spawnConfetti(cx, cy, sr.height);

    setMsgAnim("");
    setTimeout(() => {
      setMsgText(MSGS[Math.floor(Math.random() * MSGS.length)]);
      setMsgAnim("pop");
    }, 10);

    clearTimeout(msgTimerRef.current);
    msgTimerRef.current = setTimeout(() => setMsgAnim("fadeout"), 2000);
  }, [spawnCombo, spawnRings, spawnSparks, spawnConfetti]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { left: -120%; }
          100% { left: 160%; }
        }
        @keyframes bigpop {
          0%   { transform: scale(1); }
          25%  { transform: scale(0.82); }
          55%  { transform: scale(1.28); }
          75%  { transform: scale(0.95); }
          88%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes ringout {
          0%   { transform: translate(-50%,-50%) scale(0.1); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(3.6); opacity: 0; }
        }
        @keyframes sparkfly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes msgpop {
          0%   { transform: scale(0.2) rotate(-8deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes msgfade {
          0%   { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.85) translateY(-8px); }
        }
        @keyframes combopop {
          0%   { transform: translate(-50%,-50%) scale(0) rotate(-12deg); opacity: 1; }
          40%  { transform: translate(-50%,-120%) scale(1.3) rotate(4deg); opacity: 1; }
          100% { transform: translate(-50%,-220%) scale(0.8) rotate(-2deg); opacity: 0; }
        }
        .confetti-btn {
          position: relative;
          overflow: hidden;
          padding: 20px 60px;
          font-size: 22px;
          font-weight: 500;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: #7c3aed;
          color: #fff;
          letter-spacing: 0.03em;
          outline: none;
          display: block;
          font-family: inherit;
          transition: background 0.15s;
        }
        .confetti-btn:hover { background: #6d28d9; }
        .confetti-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%);
          transform: skewX(-20deg);
          pointer-events: none;
        }
        .confetti-btn:hover::before {
          animation: shimmer 1.8s ease forwards;
        }
        .confetti-btn.popping {
          animation: bigpop 0.4s cubic-bezier(0.36,0.07,0.19,0.97) forwards;
        }
      `}</style>

      <div
        ref={sceneRef}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: 420, position: "relative", overflow: "hidden",
        }}
      >
        <button
          ref={btnRef}
          className={`confetti-btn${btnAnim ? " popping" : ""}`}
          onClick={shoot}
          onAnimationEnd={() => setBtnAnim(false)}
        >
          ✦ Celebrate ✦
        </button>

        <div
          ref={msgRef}
          style={{
            position: "relative", zIndex: 10, marginTop: 36,
            fontSize: 26, fontWeight: 500,
            minHeight: 34, letterSpacing: "0.01em",
            opacity: msgAnim === "" ? 0 : undefined,
            animation: msgAnim === "pop"
              ? "msgpop 0.45s cubic-bezier(0.34,1.7,0.64,1) forwards"
              : msgAnim === "fadeout"
              ? "msgfade 0.5s ease forwards"
              : "none",
          }}
        >
          {msgText}
        </div>
      </div>
    </>
  );
}
