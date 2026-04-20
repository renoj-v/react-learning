import { useRef } from 'react';
import { useFrostAnimation } from './useFrostAnimation';

export default function FrostCanvas({ frozen }) {
  const canvasRef = useRef(null);
  useFrostAnimation(canvasRef, frozen);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
