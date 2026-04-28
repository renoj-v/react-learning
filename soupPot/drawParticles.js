export function drawBubbles(ctx, bubbles) {
  bubbles.forEach(b => {
    b.radius = Math.min(b.radius + b.grow, b.maxR);
    ctx.save();
    const bg = ctx.createRadialGradient(
      b.x - b.radius * 0.3, b.y - b.radius * 0.35, b.radius * 0.05,
      b.x, b.y, b.radius
    );
    bg.addColorStop(0, `rgba(255,220,160,${0.7 * b.life})`);
    bg.addColorStop(0.5, `rgba(200,80,30,${0.4 * b.life})`);
    bg.addColorStop(1, `rgba(120,20,5,${0.2 * b.life})`);
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = `rgba(255,180,80,${0.5 * b.life})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    b.life -= 0.016;
    ctx.restore();
  });
}

export function drawSteam(ctx, steamPuffs) {
  steamPuffs.forEach(s => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230,220,200,${0.15 * s.life})`;
    ctx.fill();
    s.x += s.vx;
    s.y += s.vy;
    s.radius += 0.2;
    s.life -= 0.01;
    ctx.restore();
  });
}
