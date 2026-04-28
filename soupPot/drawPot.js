export function drawPot(ctx, CX, CY, POT_OR, POT_IR) {
  // Drop shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX + 5, CY + 6, POT_OR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fill();
  ctx.restore();

  // Outer pot body gradient
  const potGrad = ctx.createRadialGradient(CX - 40, CY - 40, 10, CX, CY, POT_OR);
  potGrad.addColorStop(0, '#F5C842');
  potGrad.addColorStop(0.6, '#E8A820');
  potGrad.addColorStop(1, '#C07810');
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, POT_OR, 0, Math.PI * 2);
  ctx.fillStyle = potGrad;
  ctx.fill();
  ctx.restore();

  // Scalloped rim bumps
  ctx.save();
  const bumps = 28;
  for (let i = 0; i < bumps; i++) {
    const a = (i / bumps) * Math.PI * 2;
    const bx = CX + Math.cos(a) * POT_OR;
    const by = CY + Math.sin(a) * POT_OR;
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    const bg = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 9);
    bg.addColorStop(0, '#FAD84A');
    bg.addColorStop(1, '#C07810');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = '#A06008';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  // Inner wall gradient ring
  const wallGrad = ctx.createRadialGradient(CX - 30, CY - 30, 20, CX, CY, POT_IR + 4);
  wallGrad.addColorStop(0, '#EDB830');
  wallGrad.addColorStop(1, '#B07010');
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, POT_IR + 4, 0, Math.PI * 2);
  ctx.fillStyle = wallGrad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CX, CY, POT_IR + 4, 0, Math.PI * 2);
  ctx.strokeStyle = '#FAD84A';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Inner shadow ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, POT_IR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(80,30,0,0.35)';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}
