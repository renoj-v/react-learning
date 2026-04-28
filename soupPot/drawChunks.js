import { lighten, darken } from '../utils/colorUtils.js';

export function drawChunks(ctx, chunks, t, swirlAngle) {
  chunks.forEach(v => {
    const ox = Math.sin(t * 0.016 + v.x * 0.04) * 1.2;
    const oy = Math.cos(t * 0.013 + v.y * 0.04) * 1.2;
    ctx.save();
    ctx.translate(v.x + ox, v.y + oy);
    ctx.rotate(v.angle + swirlAngle * 0.35);

    if (v.kind === 'kidney') {
      drawKidneyBean(ctx, v);
    } else if (v.kind === 'pepper') {
      drawPepper(ctx, v);
    } else {
      drawCorn(ctx, v);
    }

    ctx.restore();
  });
}

function drawKidneyBean(ctx, v) {
  const kg = ctx.createRadialGradient(-2, -2, 1, 0, 0, v.rx);
  kg.addColorStop(0, lighten(v.color, 40));
  kg.addColorStop(0.5, v.color);
  kg.addColorStop(1, darken(v.color, 30));
  ctx.beginPath();
  ctx.ellipse(0, 0, v.rx, v.ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = kg;
  ctx.fill();
  ctx.strokeStyle = darken(v.color, 50);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // crease
  ctx.beginPath();
  ctx.arc(-v.rx * 0.2, 0, v.ry * 0.5, 0.4, Math.PI - 0.4);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // highlight
  ctx.beginPath();
  ctx.ellipse(-v.rx * 0.2, -v.ry * 0.25, v.rx * 0.3, v.ry * 0.2, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fill();
}

function drawPepper(ctx, v) {
  const pg = ctx.createRadialGradient(-1.5, -1.5, 0.5, 0, 0, v.rx);
  pg.addColorStop(0, lighten(v.color, 50));
  pg.addColorStop(0.6, v.color);
  pg.addColorStop(1, darken(v.color, 35));
  ctx.beginPath();
  ctx.arc(0, 0, v.rx, 0, Math.PI * 2);
  ctx.fillStyle = pg;
  ctx.fill();
  ctx.strokeStyle = darken(v.color, 50);
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-v.rx * 0.3, -v.rx * 0.3, v.rx * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fill();
}

function drawCorn(ctx, v) {
  const cg = ctx.createRadialGradient(-1, -1, 0.5, 0, 0, v.rx);
  cg.addColorStop(0, lighten(v.color, 45));
  cg.addColorStop(1, darken(v.color, 20));
  ctx.beginPath();
  ctx.ellipse(0, 0, v.rx, v.ry * 1.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = cg;
  ctx.fill();
  ctx.strokeStyle = darken(v.color, 35);
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  ctx.arc(-1.5, -1.5, 1.3, 0, Math.PI * 2);
  ctx.fill();
}
