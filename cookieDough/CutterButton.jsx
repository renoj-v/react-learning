import React, { useEffect, useRef } from 'react';
import { METAL, SHAPES } from './useGameState.js';
import { drawMetal } from './canvasUtils.js';

const LABELS = {
  star: 'STAR', heart: 'HEART', mushroom: 'SHROOM',
  circle: 'CIRCLE', flower: 'FLOWER',
  cloud: 'CLOUD', lightning: 'ZAP',
};

const styles = {
  btn: (shape, isActive) => {
    const m = METAL[shape];
    return {
      flexShrink: 0,
      width: '64px',
      height: '64px',
      borderRadius: '12px',
      border: '3px solid #000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: m.base,
      boxShadow: isActive
        ? `0 4px 0 ${m.shadow}, 0 0 0 3px #ffd700`
        : `0 4px 0 ${m.shadow}, 0 0 0 1.5px ${m.shadow}`,
      userSelect: 'none',
      transition: 'box-shadow 0.15s',
      animation: isActive ? 'btnPulse 0.8s ease-in-out infinite' : 'none',
      WebkitTapHighlightColor: 'transparent',
    };
  },
  label: {
    fontSize: '9px',
    color: '#fff',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    marginTop: '2px',
  },
};

// Inject shared keyframes once
if (typeof document !== 'undefined' && !document.getElementById('cutter-btn-kf')) {
  const tag = document.createElement('style');
  tag.id = 'cutter-btn-kf';
  tag.textContent = `
    @keyframes btnPulse {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.08); }
    }
    @keyframes btnWiggle {
      0%, 100% { transform: rotate(-3deg); }
      50%       { transform: rotate(3deg); }
    }
    .cutter-btn-el:hover {
      animation: btnWiggle 0.4s ease-in-out infinite !important;
    }
    .cutter-btn-el:active {
      transform: translateY(3px) !important;
    }
  `;
  document.head.appendChild(tag);
}

export default function CutterButton({ shape, isActive, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 36, 36);
    drawMetal(ctx, shape, 18, 18, 26);
  }, [shape]);

  return (
    <div
      className="cutter-btn-el"
      style={styles.btn(shape, isActive)}
      onClick={onClick}
    >
      <canvas ref={canvasRef} width={36} height={36} />
      <span style={styles.label}>{LABELS[shape]}</span>
    </div>
  );
}
