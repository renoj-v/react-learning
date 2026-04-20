import { useRef, useEffect, useCallback } from 'react';
import { buildCrystals, drawSnowflake } from './snowflakeUtils';

export function useFrostAnimation(canvasRef, frozen) {
  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const crystalsRef = useRef([]);
  const isThawingRef = useRef(false);
  const frozenRef = useRef(frozen);

  useEffect(() => { frozenRef.current = frozen; }, [frozen]);

  const drawFrost = useCallback((prog, isThawing, canvas) => {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    if (prog <= 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 14);
    ctx.clip();

    const ef = Math.min(prog * 2, 1);
    const gr = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.75);
    gr.addColorStop(0,    'rgba(160,210,255,0)');
    gr.addColorStop(0.45, `rgba(160,210,255,${0.02 * ef})`);
    gr.addColorStop(0.78, `rgba(160,210,255,${0.12 * ef})`);
    gr.addColorStop(1,    `rgba(200,235,255,${0.40 * ef})`);
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);

    for (const c of crystalsRef.current) {
      const lp = isThawing
        ? Math.max(0, Math.min(1, prog / 0.45))
        : Math.max(0, Math.min(1, (prog - c.delay) / 0.45));
      if (lp <= 0) continue;
      drawSnowflake(ctx, c.x, c.y, c.size * lp, c.depth, lp * 0.82, c.rot);
    }

    ctx.restore();
  }, []);

  const animate = useCallback((targetVal, isThawing) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const speed = isThawing ? 0.07 : 0.02;

    const tick = () => {
      const diff = targetVal - progressRef.current;
      if (Math.abs(diff) > 0.0008) {
        progressRef.current += diff * speed;
        drawFrost(progressRef.current, isThawing, canvas);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        progressRef.current = targetVal;
        drawFrost(progressRef.current, isThawing, canvas);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [canvasRef, drawFrost]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rebuild = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      crystalsRef.current = buildCrystals(width, height);
      drawFrost(progressRef.current, isThawingRef.current, canvas);
    };

    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(canvas.parentElement || canvas);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [canvasRef, drawFrost]);

  useEffect(() => {
    isThawingRef.current = !frozen;
    animate(frozen ? 1 : 0, !frozen);
  }, [frozen, animate]);
}
