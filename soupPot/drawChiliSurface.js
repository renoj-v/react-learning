export function drawChiliSurface(ctx, CX, CY, CHILI_R, swirlAngle, swirlVel, arcLen) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, CHILI_R, 0, Math.PI * 2);
  ctx.clip();

  // Base fill
  ctx.beginPath();
  ctx.arc(CX, CY, CHILI_R, 0, Math.PI * 2);
  ctx.fillStyle = '#8B2500';
  ctx.fill();

  // Primary swirl highlight
  const sx = CX + Math.cos(swirlAngle) * 42;
  const sy = CY + Math.sin(swirlAngle) * 42;
  const grd1 = ctx.createRadialGradient(sx, sy, 2, CX, CY, CHILI_R);
  grd1.addColorStop(0, 'rgba(210,80,20,0.9)');
  grd1.addColorStop(0.3, 'rgba(160,40,10,0.6)');
  grd1.addColorStop(0.7, 'rgba(100,15,5,0.4)');
  grd1.addColorStop(1, 'rgba(50,5,0,0.6)');
  ctx.beginPath();
  ctx.arc(CX, CY, CHILI_R, 0, Math.PI * 2);
  ctx.fillStyle = grd1;
  ctx.fill();

  // Secondary counter-highlight
  const sx2 = CX + Math.cos(swirlAngle + Math.PI * 0.7) * 28;
  const sy2 = CY + Math.sin(swirlAngle + Math.PI * 0.7) * 28;
  const grd2 = ctx.createRadialGradient(sx2, sy2, 1, sx2, sy2, 50);
  grd2.addColorStop(0, 'rgba(240,120,40,0.35)');
  grd2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(CX, CY, CHILI_R, 0, Math.PI * 2);
  ctx.fillStyle = grd2;
  ctx.fill();

  // Edge vignette
  const vign = ctx.createRadialGradient(CX, CY, CHILI_R * 0.4, CX, CY, CHILI_R);
  vign.addColorStop(0, 'rgba(0,0,0,0)');
  vign.addColorStop(1, 'rgba(30,5,0,0.55)');
  ctx.beginPath();
  ctx.arc(CX, CY, CHILI_R, 0, Math.PI * 2);
  ctx.fillStyle = vign;
  ctx.fill();

  // Swirl arc lines
  const absSwirlSpeed = Math.abs(swirlVel);
  const lineAlpha = 0.15 + Math.min(absSwirlSpeed / 0.025, 1) * 0.45;
  ctx.globalAlpha = lineAlpha;
  const sweepAngle = arcLen * Math.PI * 2;
  const ccw = swirlVel < 0;

  for (let i = 1; i <= 4; i++) {
    const radius = CHILI_R * 0.22 * i;
    const startAngle = swirlAngle + i * Math.PI * 0.6;
    const endAngle = startAngle + sweepAngle;
    const lx1 = CX + Math.cos(startAngle) * radius;
    const ly1 = CY + Math.sin(startAngle) * radius;
    const lx2 = CX + Math.cos(endAngle) * radius;
    const ly2 = CY + Math.sin(endAngle) * radius;
    const lineGrd = ctx.createLinearGradient(lx1, ly1, lx2, ly2);
    lineGrd.addColorStop(0, 'rgba(255,160,60,0)');
    lineGrd.addColorStop(0.4, 'rgba(255,160,60,1)');
    lineGrd.addColorStop(1, 'rgba(255,200,100,0.7)');
    ctx.beginPath();
    ctx.arc(CX, CY, radius, startAngle, endAngle, ccw);
    ctx.strokeStyle = lineGrd;
    ctx.lineWidth = 2 + i * 0.4;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
