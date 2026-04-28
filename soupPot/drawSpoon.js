export function drawSpoon(ctx, mouse, spoonTrail, FIXED_ANGLE = -Math.PI / 4) {
  if (!mouse.inside || mouse.x === null) return;
  const mx = mouse.x;
  const my = mouse.y;

  // Wake trail
  for (let i = 1; i < spoonTrail.length; i++) {
    const a = i / spoonTrail.length;
    ctx.save();
    ctx.beginPath();
    ctx.arc(spoonTrail[i].x, spoonTrail[i].y, 7 * a, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,100,30,${0.18 * a})`;
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(FIXED_ANGLE);

  // Handle shadow
  ctx.beginPath();
  ctx.roundRect(-2, 9, 6, 50, 3);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fill();

  // Handle gradient
  const hg = ctx.createLinearGradient(-3, 8, 3, 8);
  hg.addColorStop(0, '#E8C060');
  hg.addColorStop(0.4, '#F0D070');
  hg.addColorStop(1, '#B08020');
  ctx.beginPath();
  ctx.roundRect(-3, 8, 6, 50, 3);
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.strokeStyle = '#906010';
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Handle highlight stripe
  ctx.beginPath();
  ctx.roundRect(-1, 10, 2, 44, 1);
  ctx.fillStyle = 'rgba(255,255,200,0.3)';
  ctx.fill();

  // Bowl shadow
  ctx.beginPath();
  ctx.ellipse(1, 1, 11, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  // Bowl gradient
  const bowlG = ctx.createRadialGradient(-3, -3, 1, 0, 0, 11);
  bowlG.addColorStop(0, '#F5E080');
  bowlG.addColorStop(0.5, '#E8C048');
  bowlG.addColorStop(1, '#A07018');
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = bowlG;
  ctx.fill();
  ctx.strokeStyle = '#806010';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Bowl concave inner
  const innerG = ctx.createRadialGradient(0, 0, 0, 0, 0, 7);
  innerG.addColorStop(0, 'rgba(160,90,20,0.5)');
  innerG.addColorStop(1, 'rgba(100,50,10,0.2)');
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 5.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = innerG;
  ctx.fill();

  // Bowl highlight
  ctx.beginPath();
  ctx.ellipse(-3, -2.5, 3.5, 2, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,200,0.35)';
  ctx.fill();

  ctx.restore();
}
