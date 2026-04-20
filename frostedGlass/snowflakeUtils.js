export function drawBranch(ctx, x, y, angle, len, depth, alpha) {
  if (len < 1.0) return;
  const ex = x + Math.cos(angle) * len;
  const ey = y + Math.sin(angle) * len;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = `rgba(190,225,255,${alpha})`;
  ctx.lineWidth = Math.max(0.25, depth * 0.5);
  ctx.stroke();
  if (depth <= 0) return;
  for (const frac of [0.33, 0.62]) {
    const bx = x + Math.cos(angle) * len * frac;
    const by = y + Math.sin(angle) * len * frac;
    const bLen = len * 0.42;
    for (const ba of [Math.PI / 3, -Math.PI / 3]) {
      drawBranch(ctx, bx, by, angle + ba, bLen, depth - 1, alpha * 0.88);
    }
  }
}

export function drawSnowflake(ctx, cx, cy, size, depth, alpha, rot) {
  for (let i = 0; i < 6; i++) {
    drawBranch(ctx, cx, cy, (Math.PI * 2 * i) / 6 + rot, size, depth, alpha);
  }
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(0.8, size * 0.055), 0, Math.PI * 2);
  ctx.fillStyle = `rgba(220,240,255,${alpha})`;
  ctx.fill();
}

export function edgePoint(t, W, H) {
  const perim = 2 * (W + H);
  const d = (((t % 1) + 1) % 1) * perim;
  if (d < W)       return { x: d,           y: 0 };
  if (d < W + H)   return { x: W,            y: d - W };
  if (d < 2*W + H) return { x: W - (d-W-H), y: H };
  return                   { x: 0,           y: H - (d - 2*W - H) };
}

export function buildCrystals(W, H) {
  const crystals = [];
  const minS = Math.min(W, H);

  const layers = [
    { count: 4,  tOffsets: [0, 0.25, 0.5, 0.75],                                              sizeRange: [0.26, 0.30], depth: 3, delayBase: 0.00, delayStep: 0.05  },
    { count: 8,  tOffsets: [0.125,0.375,0.625,0.875,0.0625,0.3125,0.5625,0.8125],             sizeRange: [0.14, 0.18], depth: 3, delayBase: 0.10, delayStep: 0.025 },
    { count: 16, tOffsets: null, tStart: 0.03,  sizeRange: [0.09, 0.13], depth: 2, delayBase: 0.22, delayStep: 0.018 },
    { count: 28, tOffsets: null, tStart: 0.015, sizeRange: [0.06, 0.09], depth: 2, delayBase: 0.36, delayStep: 0.012 },
    { count: 40, tOffsets: null, tStart: 0.007, sizeRange: [0.04, 0.065],depth: 2, delayBase: 0.50, delayStep: 0.008 },
    { count: 52, tOffsets: null, tStart: 0.004, sizeRange: [0.028,0.048],depth: 1, delayBase: 0.62, delayStep: 0.005 },
    { count: 64, tOffsets: null, tStart: 0.003, sizeRange: [0.018,0.032],depth: 1, delayBase: 0.74, delayStep: 0.003 },
  ];

  layers.forEach((layer, li) => {
    const pts = layer.tOffsets
      ? layer.tOffsets.map(t => edgePoint(t, W, H))
      : Array.from({ length: layer.count }, (_, i) =>
          edgePoint(layer.tStart + i / layer.count, W, H)
        );

    pts.forEach((p, i) => {
      const sizeMin = minS * layer.sizeRange[0];
      const sizeMax = minS * layer.sizeRange[1];
      const size = sizeMin + (sizeMax - sizeMin) * (0.5 + 0.5 * Math.sin(i * 2.3 + li));
      const delay = layer.delayBase + i * layer.delayStep;
      const rot = (i * 0.618 * Math.PI / 3) % (Math.PI / 3);
      crystals.push({ x: p.x, y: p.y, size, depth: layer.depth, delay: Math.min(delay, 0.88), rot });
    });
  });

  crystals.sort((a, b) => a.delay - b.delay);
  return crystals;
}
