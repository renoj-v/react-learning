export function createChunks(CX, CY) {
  return [
    { x: CX - 38, y: CY - 22, rx: 12,  ry: 7.5, color: '#8B2010', kind: 'kidney', angle: 0.3  },
    { x: CX + 44, y: CY - 42, rx: 11,  ry: 6.5, color: '#7A1C0E', kind: 'kidney', angle: -0.5 },
    { x: CX - 54, y: CY + 32, rx: 10,  ry: 6.5, color: '#9B2815', kind: 'kidney', angle: 0.8  },
    { x: CX + 32, y: CY + 48, rx: 11,  ry: 7,   color: '#8B2010', kind: 'kidney', angle: -0.2 },
    { x: CX - 12, y: CY + 64, rx: 9,   ry: 5.5, color: '#7A1C0E', kind: 'kidney', angle: 1.0  },
    { x: CX + 20, y: CY + 20, rx: 7,   ry: 4.5, color: '#6B1808', kind: 'kidney', angle: 0.6  },
    { x: CX + 60, y: CY + 12, rx: 6,   ry: 6,   color: '#C04A10', kind: 'pepper', angle: 0    },
    { x: CX - 65, y: CY - 12, rx: 6,   ry: 6,   color: '#1A7A3C', kind: 'pepper', angle: 0    },
    { x: CX + 12, y: CY - 60, rx: 6,   ry: 6,   color: '#B83010', kind: 'pepper', angle: 0    },
    { x: CX - 20, y: CY - 50, rx: 5,   ry: 5,   color: '#B83010', kind: 'pepper', angle: 0    },
    { x: CX - 34, y: CY + 60, rx: 5.5, ry: 5.5, color: '#C47A10', kind: 'corn',   angle: 0    },
    { x: CX + 55, y: CY - 28, rx: 5.5, ry: 5.5, color: '#D4920A', kind: 'corn',   angle: 0    },
    { x: CX - 60, y: CY + 54, rx: 5,   ry: 4.5, color: '#1A7A3C', kind: 'corn',   angle: 0    },
  ].map(c => ({ ...c, vx: 0, vy: 0 }));
}
