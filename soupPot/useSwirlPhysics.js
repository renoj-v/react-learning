import { useRef, useCallback } from 'react';
import { clamp } from '../utils/colorUtils.js';
import { createChunks } from '../utils/chunkData.js';

const IDLE_VEL    = -0.004;
const MAX_CCW     = -0.055;
const MAX_CW      =  0.04;
const TRAIL_LEN   = 16;
const SPOON_ANGLE = -Math.PI / 4;

export function useSwirlPhysics(CX, CY, CHILI_R) {
  const stateRef = useRef({
    swirlVel:   IDLE_VEL,
    swirlAngle: 0,
    arcLen:     0.08,
    t:          0,
    chunks:     createChunks(CX, CY),
    bubbles:    [],
    steamPuffs: [],
    spoonTrail: [],
    mouse:      { x: null, y: null, inside: false },
    lastMouse:  { x: null, y: null },
  });

  const isInPot = useCallback((x, y) => {
    const dx = x - CX, dy = y - CY;
    return dx * dx + dy * dy < CHILI_R * CHILI_R;
  }, [CX, CY, CHILI_R]);

  const getTangential = useCallback((mx, my, px, py) => {
    if (px === null) return 0;
    const rx = mx - CX, ry = my - CY;
    const dist = Math.sqrt(rx * rx + ry * ry);
    if (dist < 5) return 0;
    const tx = ry / dist, ty = -rx / dist;
    return (mx - px) * tx + (my - py) * ty;
  }, [CX, CY]);

  const handleMove = useCallback((x, y) => {
    const s = stateRef.current;
    if (isInPot(x, y)) {
      s.swirlVel -= getTangential(x, y, s.lastMouse.x, s.lastMouse.y) * 0.00018;
    }
    s.lastMouse = { x, y };
    s.mouse = { x, y, inside: isInPot(x, y) };
  }, [isInPot, getTangential]);

  const handleLeave = useCallback(() => {
    stateRef.current.mouse = { x: null, y: null, inside: false };
  }, []);

  const spawnBubble = useCallback(() => {
    const s = stateRef.current;
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * CHILI_R * 0.8;
    s.bubbles.push({
      x: CX + Math.cos(a) * r,
      y: CY + Math.sin(a) * r,
      radius: 1 + Math.random() * 3.5,
      grow: 0.035 + Math.random() * 0.055,
      maxR: 2.5 + Math.random() * 5.5,
      life: 1,
    });
  }, [CX, CY, CHILI_R]);

  const spawnSteam = useCallback(() => {
    const s = stateRef.current;
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 35;
    s.steamPuffs.push({
      x: CX + Math.cos(a) * r,
      y: CY + Math.sin(a) * r,
      radius: 4 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      life: 1,
    });
  }, [CX, CY]);

  const tick = useCallback((spawnTimers) => {
    const s = stateRef.current;
    s.t++;

    // Physics
    s.swirlVel += (IDLE_VEL - s.swirlVel) * 0.008;
    s.swirlVel  = clamp(s.swirlVel, MAX_CCW, MAX_CW);
    s.swirlAngle += s.swirlVel;

    // Arc length tracks swirl speed
    const norm = (-s.swirlVel - (-0.04)) / (0.055 - (-0.04));
    const targetArc = 0.04 + clamp(norm, 0, 1) * 0.72;
    s.arcLen += (targetArc - s.arcLen) * 0.04;

    // Prune dead particles
    s.bubbles    = s.bubbles.filter(b => b.life > 0);
    s.steamPuffs = s.steamPuffs.filter(p => p.life > 0);

    // Chunk orbital drift + spoon repulsion
    s.chunks.forEach(v => {
      const dx = v.x - CX, dy = v.y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 4) {
        const tx = -dy / dist, ty = dx / dist;
        v.x += tx * s.swirlVel * dist * 0.18;
        v.y += ty * s.swirlVel * dist * 0.18;
      }
      if (s.mouse.inside && s.mouse.x !== null) {
        const sx = v.x - s.mouse.x, sy = v.y - s.mouse.y;
        const sd = Math.sqrt(sx * sx + sy * sy);
        if (sd < 30 && sd > 0) {
          const push = ((30 - sd) / 30) * 2.5;
          v.x += (sx / sd) * push;
          v.y += (sy / sd) * push;
        }
      }
      const edx = v.x - CX, edy = v.y - CY;
      const edist = Math.sqrt(edx * edx + edy * edy);
      const maxR = CHILI_R - Math.max(v.rx, v.ry) - 3;
      if (edist > maxR) {
        v.x = CX + (edx / edist) * maxR;
        v.y = CY + (edy / edist) * maxR;
      }
    });

    // Spoon trail
    if (s.mouse.inside && s.mouse.x !== null) {
      s.spoonTrail.push({ x: s.mouse.x, y: s.mouse.y });
      if (s.spoonTrail.length > TRAIL_LEN) s.spoonTrail.shift();
    } else {
      if (s.spoonTrail.length > 0) s.spoonTrail.shift();
    }

    // Particle spawning
    const abs = Math.abs(s.swirlVel);
    const stirring = s.mouse.inside && s.mouse.x !== null;

    if (stirring) {
      spawnTimers.bubble++;
      spawnTimers.steam++;
      const rate = Math.max(2, Math.floor(9 - abs / 0.005));
      if (spawnTimers.bubble % rate === 0) spawnBubble();
      if (spawnTimers.steam  % 22 === 0)  spawnSteam();
    } else {
      if (s.t % 58  === 0) spawnBubble();
      if (s.t % 115 === 0) spawnSteam();
    }

    // Status label
    const dir = s.swirlVel < -0.01 ? 'counter-clockwise'
              : s.swirlVel >  0.01 ? 'clockwise'
              : 'easing…';
    return stirring
      ? abs > 0.03 ? `fast ${dir}` : abs > 0.01 ? `stirring ${dir}` : 'gently stirring'
      : '';
  }, [CX, CY, CHILI_R, spawnBubble, spawnSteam]);

  return { stateRef, handleMove, handleLeave, tick, SPOON_ANGLE };
}
