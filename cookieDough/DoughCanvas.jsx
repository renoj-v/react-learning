import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { drawBackground, drawDough, drawCookie } from './canvasUtils.js';
import { COOKIE } from './useGameState.js';

const HUD_H = 56;
const TOOLBAR_H = 90;

// Inject font link once
if (typeof document !== 'undefined' && !document.getElementById('cookie-fonts')) {
  const link = document.createElement('link');
  link.id = 'cookie-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800&display=swap';
  document.head.appendChild(link);
}

const DoughCanvas = forwardRef(function DoughCanvas(
  { holesRef, scrollYRef, targetScrollYRef, currentShape, onCut },
  ref
) {
  const bgRef = useRef(null);
  const doughRef = useRef(null);
  const hitRef = useRef(null);
  const sizeRef = useRef({ W: 0, H: 0 });
  const rafRef = useRef(null);

  // Touch tracking
  const touchRef = useRef({ startY: 0, startX: 0, scrollStart: 0, moved: false, scrolling: false });

  const resize = useCallback(() => {
    const el = hitRef.current?.parentElement;
    if (!el) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    sizeRef.current = { W, H };
    [bgRef, doughRef, hitRef].forEach(r => {
      if (r.current) { r.current.width = W; r.current.height = H; }
    });
  }, []);

  // Launch cookie animation (DOM canvas overlay)
  const launchCookie = useCallback((x, y, shape) => {
    const ck = COOKIE[shape];
    const oc = document.createElement('canvas');
    oc.width = 80; oc.height = 80;
    drawCookie(oc.getContext('2d'), shape, 40, 40, 52, ck.fill, ck.border);
    Object.assign(oc.style, {
      position: 'absolute', left: `${x - 40}px`, top: `${y - 40}px`,
      zIndex: 40, pointerEvents: 'none',
    });
    hitRef.current?.parentElement?.appendChild(oc);
    let start = null;
    (function anim(ts) {
      if (!start) start = ts;
      const p = (ts - start) / 700;
      if (p >= 1) { oc.remove(); return; }
      oc.style.transform = `rotate(${p * 360}deg) scale(${1 + p * 0.3}) translateY(${-p * 65}px)`;
      oc.style.opacity = String(1 - p * p);
      requestAnimationFrame(anim);
    })(performance.now());
  }, []);

  const handleCut = useCallback((x, y) => {
    const { H } = sizeRef.current;
    if (y < HUD_H || y > H - TOOLBAR_H) return;
    onCut(x, y);
    launchCookie(x, y, currentShape);
  }, [onCut, launchCookie, currentShape]);

  // Render loop
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    function loop() {
      const { W, H } = sizeRef.current;
      const target = targetScrollYRef.current;
      scrollYRef.current += (target - scrollYRef.current) * 0.15;
      const sy = scrollYRef.current;

      const bgCtx = bgRef.current?.getContext('2d');
      const doughCtx = doughRef.current?.getContext('2d');
      if (bgCtx) drawBackground(bgCtx, W, H, sy);
      if (doughCtx) drawDough(doughCtx, W, H, sy, holesRef.current, HUD_H, TOOLBAR_H);

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, holesRef, scrollYRef, targetScrollYRef]);

  // Idle flour puffs
  useEffect(() => {
    const interval = setInterval(() => {
      const { W, H } = sizeRef.current;
      const el = document.createElement('div');
      Object.assign(el.style, {
        position: 'absolute',
        left: `${5 + Math.random() * (W - 10)}px`,
        top: `${HUD_H + 5 + Math.random() * (H - TOOLBAR_H - HUD_H - 10)}px`,
        width: '8px', height: '8px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: '0.35',
        animation: 'flourPuff 2s ease-out forwards',
      });
      hitRef.current?.parentElement?.appendChild(el);
      setTimeout(() => el.remove(), 2100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Mouse events
  const onMouseMove = useCallback((e) => {
    const r = hitRef.current.getBoundingClientRect();
    useImperativeHandle(ref); // noop — ghost update handled by parent via onMouseMove prop
    hitRef.current._lastX = e.clientX - r.left;
    hitRef.current._lastY = e.clientY - r.top;
  }, []);

  // Expose imperative handle for parent to read mouse pos
  useImperativeHandle(ref, () => ({
    getMousePos: () => ({
      x: hitRef.current?._lastX ?? 0,
      y: hitRef.current?._lastY ?? 0,
    }),
  }));

  const onWheel = useCallback((e) => {
    e.preventDefault();
    targetScrollYRef.current = Math.max(0, targetScrollYRef.current + e.deltaY);
  }, [targetScrollYRef]);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = {
      startY: t.clientY, startX: t.clientX,
      scrollStart: scrollYRef.current,
      moved: false, scrolling: false,
    };
  }, [scrollYRef]);

  const onTouchMove = useCallback((e) => {
    const t = e.touches[0];
    const tr = touchRef.current;
    const dy = t.clientY - tr.startY;
    const dx = t.clientX - tr.startX;
    if (!tr.moved && (Math.abs(dy) > 6 || Math.abs(dx) > 6)) {
      tr.moved = true;
      tr.scrolling = Math.abs(dy) > Math.abs(dx);
    }
    if (tr.scrolling) {
      e.preventDefault();
      const next = Math.max(0, tr.scrollStart - dy);
      scrollYRef.current = next;
      targetScrollYRef.current = next;
    }
  }, [scrollYRef, targetScrollYRef]);

  const onTouchEnd = useCallback((e) => {
    const tr = touchRef.current;
    if (!tr.moved || !tr.scrolling) {
      const r = hitRef.current.getBoundingClientRect();
      const t = e.changedTouches[0];
      handleCut(t.clientX - r.left, t.clientY - r.top);
    }
    tr.moved = false;
    tr.scrolling = false;
  }, [handleCut]);

  const onClick = useCallback((e) => {
    const r = hitRef.current.getBoundingClientRect();
    handleCut(e.clientX - r.left, e.clientY - r.top);
  }, [handleCut]);

  return (
    <>
      <canvas ref={bgRef} style={{ position: 'absolute', inset: 0 }} />
      <canvas ref={doughRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <canvas
        ref={hitRef}
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </>
  );
});

export default DoughCanvas;
