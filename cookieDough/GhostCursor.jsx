import React, { useEffect, useRef } from 'react';
import { drawMetal } from './canvasUtils.js';

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('ghost-kf')) {
  const tag = document.createElement('style');
  tag.id = 'ghost-kf';
  tag.textContent = `
    @keyframes ghostBob {
      0%, 100% { transform: translate(-50%, -55%); }
      50%       { transform: translate(-50%, -45%); }
    }
  `;
  document.head.appendChild(tag);
}

const styles = {
  ghost: (x, y, visible) => ({
    position: 'absolute',
    left: x,
    top: y,
    pointerEvents: 'none',
    zIndex: 15,
    opacity: visible ? 0.7 : 0,
    animation: 'ghostBob 1.2s ease-in-out infinite',
    transition: 'opacity 0.15s',
  }),
};

export default function GhostCursor({ x, y, shape, visible }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 70, 70);
    drawMetal(ctx, shape, 35, 35, 50);
  }, [shape]);

  return (
    <div style={styles.ghost(x, y, visible)}>
      <canvas ref={canvasRef} width={70} height={70} />
    </div>
  );
}
