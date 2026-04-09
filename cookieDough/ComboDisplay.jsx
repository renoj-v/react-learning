import React from 'react';

const styles = {
  wrapper: {
    position: 'absolute',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    pointerEvents: 'none',
    transition: 'opacity 0.3s',
    whiteSpace: 'nowrap',
  },
  text: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: '36px',
    color: '#ffd700',
    textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000',
    animation: 'comboPop 0.3s ease-out',
  },
};

// Inject keyframes once
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes comboPop {
      0%   { transform: scale(1.5); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleTag);
}

export default function ComboDisplay({ combo, visible }) {
  return (
    <div style={{ ...styles.wrapper, opacity: visible ? 1 : 0 }}>
      <div style={styles.text}>COMBO x{combo}! ⭐</div>
    </div>
  );
}
