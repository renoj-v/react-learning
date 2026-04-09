import React from 'react';
import CutterButton from './CutterButton.jsx';
import { SHAPES } from './useGameState.js';

const styles = {
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, #ff9800 0%, #e65100 100%)',
    borderTop: '3px solid #000',
    zIndex: 20,
    padding: '6px 10px 8px',
  },
  label: {
    color: '#fff',
    fontSize: '13px',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    marginBottom: '6px',
    fontFamily: "'Fredoka One', cursive",
    letterSpacing: '0.5px',
  },
  row: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '2px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
};

export default function Toolbar({ currentShape, onSelectShape }) {
  return (
    <div style={styles.toolbar}>
      <div style={styles.label}>⭐ COOKIE CUTTERS!</div>
      <div style={styles.row}>
        {SHAPES.map(shape => (
          <CutterButton
            key={shape}
            shape={shape}
            isActive={currentShape === shape}
            onClick={() => onSelectShape(shape)}
          />
        ))}
      </div>
    </div>
  );
}
