import React, { useRef, useEffect, useCallback } from 'react';
import { drawPot }          from '../renderers/drawPot.js';
import { drawChiliSurface } from '../renderers/drawChiliSurface.js';
import { drawChunks }       from '../renderers/drawChunks.js';
import { drawBubbles, drawSteam } from '../renderers/drawParticles.js';
import { drawSpoon }        from '../renderers/drawSpoon.js';

export default function SoupCanvas({ width, height, physics, onStatusChange }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const timers    = useRef({ bubble: 0, steam: 0 });

  const { stateRef, handleMove, handleLeave, tick, SPOON_ANGLE } = physics;

  // Derived geometry from canvas size
  const CX      = width  / 2;
  const CY      = height / 2;
  const scale   = Math.min(width, height) / 360;
  const POT_OR  = Math.round(165 * scale);
  const POT_IR  = Math.round(148 * scale);
  const CHILI_R = Math.round(136 * scale);

  const getPos = useCallback((canvas, clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (canvas.width  / r.width),
      y: (clientY - r.top)  * (canvas.height / r.height),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const onMouseMove = (e) => {
      const { x, y } = getPos(canvas, e.clientX, e.clientY);
      handleMove(x, y);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const { x, y } = getPos(canvas, e.touches[0].clientX, e.touches[0].clientY);
      handleMove(x, y);
    };
    const onLeave = () => handleLeave();

    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('touchmove',  onTouchMove, { passive: false });
    canvas.addEventListener('mouseleave', onLeave);

    function frame() {
      const s   = stateRef.current;
      const status = tick(timers.current);
      onStatusChange(status);

      ctx.clearRect(0, 0, width, height);

      drawPot(ctx, CX, CY, POT_OR, POT_IR);
      drawChiliSurface(ctx, CX, CY, CHILI_R, s.swirlAngle, s.swirlVel, s.arcLen);
      drawChunks(ctx, s.chunks, s.t, s.swirlAngle);
      drawBubbles(ctx, s.bubbles);
      drawSteam(ctx, s.steamPuffs);
      drawSpoon(ctx, s.mouse, s.spoonTrail, SPOON_ANGLE);

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [width, height, CX, CY, POT_OR, POT_IR, CHILI_R,
      getPos, handleMove, handleLeave, tick, stateRef,
      SPOON_ANGLE, onStatusChange]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', cursor: 'none', touchAction: 'none' }}
    />
  );
}
