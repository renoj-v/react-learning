import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { WORDS, CONFETTI_COLORS } from './useGameState.js';

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('particles-kf')) {
  const tag = document.createElement('style');
  tag.id = 'particles-kf';
  tag.textContent = `
    @keyframes wordPop {
      0%   { opacity: 1; transform: translate(-50%, -20px) scale(1.3); }
      60%  { opacity: 1; transform: translate(-50%, -60px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -90px) scale(0.8); }
    }
    @keyframes scorePop {
      0%   { opacity: 1; transform: translateY(0) scale(1.2); }
      100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
    }
    @keyframes flourPuff {
      0%   { opacity: 0.7; transform: scale(1) translateY(0); }
      100% { opacity: 0;   transform: scale(2.5) translateY(-30px); }
    }
  `;
  document.head.appendChild(tag);
}

let nextId = 0;

const Particles = forwardRef(function Particles(_, ref) {
  const [items, setItems] = useState([]);

  const add = useCallback((item) => {
    const id = nextId++;
    setItems(prev => [...prev, { ...item, id }]);
    setTimeout(() => {
      setItems(prev => prev.filter(p => p.id !== id));
    }, item.duration || 1100);
  }, []);

  useImperativeHandle(ref, () => ({
    spawnCut(x, y) {
      // Word bubble
      add({
        type: 'word',
        x, y,
        text: WORDS[Math.floor(Math.random() * WORDS.length)],
        duration: 1050,
      });
      // Score pop
      add({
        type: 'score',
        x: x + 10,
        y: y - 20,
        duration: 850,
      });
      // Confetti dots
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 20 + Math.random() * 55;
        add({
          type: 'confetti',
          x, y,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          size: 4 + Math.random() * 6,
          round: Math.random() > 0.5,
          duration: 750,
        });
      }
      // Flour puffs
      for (let i = 0; i < 5; i++) {
        add({
          type: 'flour',
          x: x + (-15 + Math.random() * 30),
          y: y + (-10 + Math.random() * 20),
          duration: 2100,
        });
      }
    },
  }));

  return (
    <>
      {items.map(item => {
        if (item.type === 'word') return (
          <div key={item.id} style={{
            position: 'absolute', left: item.x, top: item.y,
            fontFamily: "'Fredoka One', cursive", fontSize: '22px',
            color: '#ffd700',
            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
            pointerEvents: 'none', zIndex: 50,
            animation: 'wordPop 1s ease-out forwards',
            whiteSpace: 'nowrap',
          }}>{item.text}</div>
        );

        if (item.type === 'score') return (
          <div key={item.id} style={{
            position: 'absolute', left: item.x, top: item.y,
            fontFamily: "'Fredoka One', cursive", fontSize: '18px',
            color: '#fff',
            textShadow: '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000',
            pointerEvents: 'none', zIndex: 50,
            animation: 'scorePop 0.8s ease-out forwards',
          }}>+1 🍪</div>
        );

        if (item.type === 'confetti') return (
          <ConfettiDot key={item.id} item={item} />
        );

        if (item.type === 'flour') return (
          <div key={item.id} style={{
            position: 'absolute',
            left: item.x, top: item.y,
            width: '8px', height: '8px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            pointerEvents: 'none', zIndex: 10,
            animation: 'flourPuff 2s ease-out forwards',
          }} />
        );

        return null;
      })}
    </>
  );
});

// Confetti dot uses a CSS transition for motion
function ConfettiDot({ item }) {
  const [moved, setMoved] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMoved(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      left: item.x, top: item.y,
      width: `${item.size}px`, height: `${item.size}px`,
      background: item.color,
      border: '1.5px solid #000',
      borderRadius: item.round ? '50%' : '2px',
      pointerEvents: 'none', zIndex: 45,
      transform: moved
        ? `translate(calc(-50% + ${item.tx}px), calc(-50% + ${item.ty}px)) scale(0)`
        : 'translate(-50%, -50%)',
      opacity: moved ? 0 : 1,
      transition: 'all 0.65s ease-out',
    }} />
  );
}

export default Particles;
