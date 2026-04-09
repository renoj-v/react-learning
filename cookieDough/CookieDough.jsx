import React, { useRef, useState, useCallback } from 'react';
import HUD from './HUD.jsx';
import Toolbar from './Toolbar.jsx';
import ComboDisplay from './ComboDisplay.jsx';
import GhostCursor from './GhostCursor.jsx';
import Particles from './Particles.jsx';
import DoughCanvas from './DoughCanvas.jsx';
import { useGameState } from './useGameState.js';

const styles = {
  app: {
    width: '100%',
    height: '600px',
    position: 'relative',
    overflow: 'hidden',
    background: '#1a0a2e',
    fontFamily: "'Fredoka One', cursive",
    userSelect: 'none',
  },
};

export default function CookieDough() {
  const {
    score,
    currentShape,
    setCurrentShape,
    combo,
    showCombo,
    holesRef,
    scrollYRef,
    targetScrollYRef,
    cut,
  } = useGameState();

  const particlesRef = useRef(null);
  const doughCanvasRef = useRef(null);

  // Ghost cursor state
  const [ghost, setGhost] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGhost({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGhost(g => ({ ...g, visible: false }));
  }, []);

  const handleCut = useCallback((x, y) => {
    cut(x, y);
    particlesRef.current?.spawnCut(x, y);
  }, [cut]);

  return (
    <div
      style={styles.app}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Canvas layers: board bg + dough + hit */}
      <DoughCanvas
        ref={doughCanvasRef}
        holesRef={holesRef}
        scrollYRef={scrollYRef}
        targetScrollYRef={targetScrollYRef}
        currentShape={currentShape}
        onCut={handleCut}
      />

      {/* Ghost cursor overlay */}
      <GhostCursor
        x={ghost.x}
        y={ghost.y}
        shape={currentShape}
        visible={ghost.visible}
      />

      {/* Particle effects overlay */}
      <Particles ref={particlesRef} />

      {/* Combo flash */}
      <ComboDisplay combo={combo} visible={showCombo} />

      {/* HUD */}
      <HUD score={score} />

      {/* Toolbar */}
      <Toolbar currentShape={currentShape} onSelectShape={setCurrentShape} />
    </div>
  );
}
