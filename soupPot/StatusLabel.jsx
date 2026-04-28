import React from 'react';

export default function StatusLabel({ status }) {
  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      fontSize: 13,
      color: 'rgba(255,255,255,0.82)',
      marginTop: '0.65rem',
      minHeight: 18,
      letterSpacing: '0.03em',
      transition: 'opacity 0.3s',
      opacity: status ? 1 : 0,
      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }}>
      {status || '·'}
    </div>
  );
}
