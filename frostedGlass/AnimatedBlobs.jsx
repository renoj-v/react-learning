import { useEffect, useRef } from 'react';

const BLOBS = [
  { style: { width: 280, height: 280, background: '#4c1d95', top: -60, left: -60 }, speedX: 0.7, speedY: 0.5, ampX: 20, ampY: 15 },
  { style: { width: 220, height: 220, background: '#0c4a6e', bottom: -40, right: 20  }, speedX: 0.6, speedY: 0.8, ampX: 18, ampY: 13 },
  { style: { width: 180, height: 180, background: '#831843', bottom: 30,  left: 60   }, speedX: 0.9, speedY: 0.6, ampX: 15, ampY: 18 },
  { style: { width: 150, height: 150, background: '#164e63', top: 20,    right: -20  }, speedX: 1.1, speedY: 0.7, ampX: 20, ampY: 14 },
];

export default function AnimatedBlobs() {
  const blobRefs = useRef([]);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      tRef.current += 0.008;
      const t = tRef.current;
      blobRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = BLOBS[i];
        const tx = Math.sin(t * b.speedX) * b.ampX;
        const ty = (i % 2 === 0 ? Math.cos : Math.sin)(t * b.speedY) * b.ampY;
        el.style.transform = `translate(${tx}px,${ty}px)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          ref={el => blobRefs.current[i] = el}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.5,
            width: b.style.width,
            height: b.style.height,
            background: b.style.background,
            top: b.style.top,
            left: b.style.left,
            bottom: b.style.bottom,
            right: b.style.right,
          }}
        />
      ))}
    </div>
  );
}
