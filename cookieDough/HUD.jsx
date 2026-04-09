import React from 'react';

const styles = {
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '56px',
    background: 'linear-gradient(180deg, #e8001c 0%, #c00015 100%)',
    borderBottom: '3px solid #000',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    gap: '12px',
    zIndex: 20,
    fontFamily: "'Fredoka One', cursive",
  },
  avatar: {
    width: '38px',
    height: '38px',
    background: '#ffd700',
    border: '3px solid #000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  score: {
    color: '#fff',
    fontSize: '18px',
    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
    flex: 1,
  },
  title: {
    color: '#ffd700',
    fontSize: '14px',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
    fontFamily: "'Fredoka One', cursive",
  },
};

export default function HUD({ score }) {
  return (
    <div style={styles.hud}>
      <div style={styles.avatar}>👨‍🍳</div>
      <div style={styles.score}>
        COOKIES CUT: <span>{score}</span> ⭐
      </div>
      <div style={styles.title}>COOKIE CUTTER PARTY!</div>
    </div>
  );
}
