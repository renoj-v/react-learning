import { METAL, COOKIE } from './useGameState.js';

// ─── Shape path builder ───────────────────────────────────────────────────────
export function buildPath(ctx, shape, x, y, size) {
  const s = size;
  ctx.beginPath();
  switch (shape) {
    case 'star': {
      const outer = s / 2, inner = s / 4;
      let rot = -Math.PI / 2;
      const step = Math.PI / 5;
      ctx.moveTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
      for (let i = 0; i < 5; i++) {
        rot += step; ctx.lineTo(x + Math.cos(rot) * inner, y + Math.sin(rot) * inner);
        rot += step; ctx.lineTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
      }
      ctx.closePath();
      break;
    }
    case 'heart':
      ctx.moveTo(x, y + s / 4);
      ctx.bezierCurveTo(x - s / 2, y - s / 4, x - s / 2, y - s / 2, x, y - s / 4);
      ctx.bezierCurveTo(x + s / 2, y - s / 2, x + s / 2, y - s / 4, x, y + s / 4);
      ctx.closePath();
      break;
    case 'mushroom':
      ctx.arc(x, y - s / 8, s / 2.5, Math.PI, 0);
      ctx.lineTo(x + s / 4, y + s / 3);
      ctx.lineTo(x - s / 4, y + s / 3);
      ctx.closePath();
      break;
    case 'circle':
      ctx.arc(x, y, s / 2.2, 0, Math.PI * 2);
      break;
    case 'flower':
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        ctx.moveTo(x, y);
        ctx.arc(x + Math.cos(a) * s / 4, y + Math.sin(a) * s / 4, s / 4, 0, Math.PI * 2);
      }
      break;
    case 'gingerbread':
      ctx.arc(x, y - s / 3, s / 5, 0, Math.PI * 2);
      ctx.moveTo(x - s / 5, y - s / 6);
      ctx.lineTo(x + s / 5, y - s / 6);
      ctx.lineTo(x + s / 3, y + s / 6);
      ctx.lineTo(x + s / 4, y + s / 2);
      ctx.lineTo(x - s / 4, y + s / 2);
      ctx.lineTo(x - s / 3, y + s / 6);
      ctx.closePath();
      break;
    case 'cloud': {
      const cr = s / 5;
      ctx.moveTo(x - s / 2.5, y);
      ctx.arc(x - s / 5, y, cr, Math.PI, 0);
      ctx.arc(x, y - s / 5, cr * 1.2, Math.PI, 0);
      ctx.arc(x + s / 5, y, cr, Math.PI, 0);
      ctx.lineTo(x + s / 2.5, y);
      ctx.closePath();
      break;
    }
    case 'lightning':
      ctx.moveTo(x + s / 6, y - s / 2);
      ctx.lineTo(x - s / 5, y);
      ctx.lineTo(x + s / 8, y);
      ctx.lineTo(x - s / 6, y + s / 2);
      ctx.lineTo(x + s / 5, y - s / 10);
      ctx.lineTo(x, y - s / 10);
      ctx.closePath();
      break;
    default:
      break;
  }
}

// ─── Metallic cutter renderer ─────────────────────────────────────────────────
export function drawMetal(ctx, shape, x, y, size) {
  const m = METAL[shape];
  if (!m) return;
  ctx.save();

  // Drop shadow
  buildPath(ctx, shape, x + 2, y + 2, size);
  ctx.fillStyle = m.shadow;
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Metal gradient fill
  buildPath(ctx, shape, x, y, size);
  const g = ctx.createLinearGradient(x - size / 2, y - size / 2, x + size / 2, y + size / 2);
  g.addColorStop(0, m.hi);
  g.addColorStop(0.3, m.base);
  g.addColorStop(0.7, m.shadow);
  g.addColorStop(1, m.base);
  ctx.fillStyle = g;
  ctx.fill();

  // Highlight sheen
  buildPath(ctx, shape, x, y, size);
  const sh = ctx.createLinearGradient(x - size / 3, y - size / 3, x, y + size / 4);
  sh.addColorStop(0, 'rgba(255,255,255,0.55)');
  sh.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh;
  ctx.fill();

  // Black outline
  buildPath(ctx, shape, x, y, size);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner rim highlight
  buildPath(ctx, shape, x, y, size * 0.88);
  ctx.strokeStyle = m.hi;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  ctx.stroke();

  ctx.restore();
}

// ─── Baked cookie renderer ────────────────────────────────────────────────────
export function drawCookie(ctx, shape, x, y, size, fill, border) {
  ctx.save();

  buildPath(ctx, shape, x, y, size);
  ctx.fillStyle = fill;
  ctx.fill();

  // Baked texture dots
  for (let i = 0; i < 6; i++) {
    const a = i * 1.05, r = size * 0.22;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, 2, 0, Math.PI * 2);
    ctx.fillStyle = border;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  buildPath(ctx, shape, x, y, size);
  ctx.strokeStyle = border;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  buildPath(ctx, shape, x, y, size);
  ctx.strokeStyle = 'rgba(255,220,120,0.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

// ─── Board background ─────────────────────────────────────────────────────────
export function drawBackground(ctx, W, H, scrollY) {
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(0, 0, W, H);

  const sz = 40;
  const cols = Math.ceil(W / sz) + 1;
  const rows = Math.ceil(H / sz) + 1;
  const off = scrollY % sz;
  const tileColors = ['#2d1458', '#1a3a6b', '#0d4a2e', '#4a1a00', '#3a0a3a', '#1a2a5a', '#2a2a0a'];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tx = c * sz, ty = r * sz - off;
      const idx = ((r + Math.floor(scrollY / sz)) + c) % 7;
      ctx.fillStyle = tileColors[idx];
      ctx.fillRect(tx + 1, ty + 1, sz - 2, sz - 2);
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.arc(tx + sz / 2, ty + sz / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ─── Dough sheet with transparent holes ──────────────────────────────────────
export function drawDough(ctx, W, H, scrollY, holes, hudH, toolbarH) {
  const top = hudH;
  const bottom = H - toolbarH;
  const h = bottom - top;

  ctx.clearRect(0, 0, W, H);

  // Dough gradient base
  const grad = ctx.createLinearGradient(0, top, 0, bottom);
  grad.addColorStop(0, '#f5e6c8');
  grad.addColorStop(0.3, '#efd9a8');
  grad.addColorStop(0.7, '#e8cf96');
  grad.addColorStop(1, '#dfc078');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, h);

  // Flour mottling
  for (let i = 0; i < 36; i++) {
    const fx = 5 + ((i * 137 + scrollY * 0.3) % (W - 10));
    const fy = top + 5 + ((i * 97 + scrollY * 0.5) % (h - 10));
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#7a5010';
    ctx.beginPath();
    ctx.ellipse(fx, fy, 7 + i % 5, 3 + i % 3, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Punch holes — true transparency via destination-out
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  for (const hole of holes) {
    const screenY = hole.worldY - scrollY;
    buildPath(ctx, hole.shape, hole.x, screenY, hole.size);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
  }
  ctx.restore();

  // Flour-dusted rim around each hole
  ctx.save();
  for (const hole of holes) {
    const screenY = hole.worldY - scrollY;
    if (screenY < top - 80 || screenY > bottom + 80) continue;
    buildPath(ctx, hole.shape, hole.x, screenY, hole.size + 5);
    ctx.strokeStyle = '#c4a860';
    ctx.lineWidth = 4;
    ctx.stroke();
    buildPath(ctx, hole.shape, hole.x, screenY, hole.size + 1);
    ctx.strokeStyle = '#e8d090';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}
