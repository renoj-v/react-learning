import { useEffect, useRef, useCallback } from "react";

const COLORS = [
  "#7F77DD", "#1D9E75", "#D85A30", "#378ADD",
  "#D4537E", "#FAC775", "#E24B4A", "#5DCAA5", "#AFA9EC",
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function starPath(cx, cy, innerR, outerR, points = 4) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    d += (i === 0 ? "M" : "L") + px + "," + py;
  }
  return d + "Z";
}

function createSparkle(svgEl, x, y) {
  const ns = "http://www.w3.org/2000/svg";
  const g = document.createElementNS(ns, "g");
  const isStar = Math.random() < 0.5;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = rand(4, 14);
  let vx = rand(-2, 2);
  let vy = rand(-3.5, -0.5);
  const life = rand(40, 70);
  const gravity = 0.08;
  let age = 0;
  let px = x;
  let py = y;

  let shape;
  if (isStar) {
    shape = document.createElementNS(ns, "path");
    shape.setAttribute("fill", color);
    shape.setAttribute("d", starPath(0, 0, size * 0.5, size, 4));
    shape.setAttribute("transform", `rotate(${rand(0, 360)})`);
  } else {
    shape = document.createElementNS(ns, "circle");
    shape.setAttribute("r", size * 0.4);
    shape.setAttribute("fill", color);
  }

  g.appendChild(shape);
  svgEl.appendChild(g);

  return function tick() {
    age++;
    px += vx;
    py += vy;
    vy += gravity;
    const progress = age / life;
    const opacity =
      progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
    const scale = 1 - progress * 0.3;
    g.setAttribute("transform", `translate(${px},${py}) scale(${scale})`);
    g.setAttribute("opacity", Math.max(0, opacity));
    if (age >= life) {
      svgEl.removeChild(g);
      return false;
    }
    return true;
  };
}

/**
 * SparkleCursor
 *
 * Wraps any children in a container that spawns sparkle particles
 * wherever the user moves their cursor.
 *
 * Props:
 *   children      – content inside the sparkle zone
 *   className     – extra class names for the wrapper div
 *   style         – extra inline styles for the wrapper div
 *   hideCursor    – replace the default cursor with a small dot (default: true)
 *   cursorColor   – color of the custom cursor dot (default: "#000")
 */
export default function SparkleCursor({
  children,
  className = "",
  style = {},
  hideCursor = true,
  cursorColor = "#000",
}) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const cursorRef = useRef(null);
  const sparkles = useRef([]);
  const rafRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const loop = useCallback(() => {
    const list = sparkles.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const alive = list[i]();
      if (!alive) list.splice(i, 1);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  const handleMouseMove = useCallback((e) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (cursorRef.current) {
      cursorRef.current.style.left = x + "px";
      cursorRef.current.style.top = y + "px";
    }

    const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
    if (dist > 6) {
      const count = Math.min(3, Math.floor(dist / 8) + 1);
      for (let i = 0; i < count; i++) {
        sparkles.current.push(
          createSparkle(svgRef.current, x + rand(-6, 6), y + rand(-6, 6))
        );
      }
      lastPos.current = { x, y };
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorRef.current) cursorRef.current.style.opacity = "0";
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (cursorRef.current) cursorRef.current.style.opacity = "1";
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: hideCursor ? "none" : "default",
        userSelect: "none",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* SVG layer for sparkle particles */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Custom cursor dot */}
      {hideCursor && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: cursorColor,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            transition: "transform 0.1s ease",
            opacity: 0,
          }}
        />
      )}

      {/* Actual content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
