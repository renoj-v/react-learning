/**
 * SoupStir.jsx
 *
 * Drop-in interactive chili-stirring animation.
 *
 * Usage:
 *   import SoupStir from './SoupStir/SoupStir';
 *   <SoupStir />
 *   <SoupStir size={480} />
 *   <SoupStir size={280} showLabel={false} />
 *
 * Props:
 *   size       {number}  Canvas width & height in px. Default: 360
 *   showLabel  {boolean} Show the stirring status text.  Default: true
 */

import React, { useState, useCallback, useMemo } from 'react';
import SoupCanvas   from './components/SoupCanvas.jsx';
import StatusLabel  from './components/StatusLabel.jsx';
import { useSwirlPhysics } from './hooks/useSwirlPhysics.js';

export default function SoupStir({ size = 360, showLabel = true }) {
  const [status, setStatus] = useState('');

  const CX      = size / 2;
  const CY      = size / 2;
  const scale   = size / 360;
  const CHILI_R = Math.round(136 * scale);

  const physics = useSwirlPhysics(CX, CY, CHILI_R);

  const handleStatusChange = useCallback((s) => setStatus(s), []);

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '1.5rem',
        background:     '#4a7c3f',
        borderRadius:   20,
        userSelect:     'none',
        width:          'fit-content',
      }}
    >
      <SoupCanvas
        width={size}
        height={size}
        physics={physics}
        onStatusChange={handleStatusChange}
      />
      {showLabel && <StatusLabel status={status} />}
      {showLabel && (
        <div style={{
          fontFamily:  "'Georgia', serif",
          fontSize:    12,
          color:       'rgba(255,255,255,0.55)',
          marginTop:   4,
          letterSpacing: '0.02em',
        }}>
          stir counter-clockwise to speed up · clockwise to slow down
        </div>
      )}
    </div>
  );
}
