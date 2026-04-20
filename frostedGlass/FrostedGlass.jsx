import { useState } from 'react';
import AnimatedBlobs from './AnimatedBlobs';
import FrostCanvas from './FrostCanvas';
import FreezeButton from './FreezeButton';
import FrostStatus from './FrostStatus';

/**
 * FrostedGlass
 *
 * A self-contained frosted-glass scene with animated colour blobs,
 * fractal snowflake frost that creeps in from the edges, and a
 * freeze / thaw toggle button.
 *
 * Props:
 *   width  {string|number} — CSS width of the scene (default '100%')
 *   height {string|number} — CSS height of the scene (default 480)
 *   style  {object}        — extra styles merged onto the outer container
 */
export default function FrostedGlass({ width = '100%', height = 480, style = {} }) {
  const [frozen, setFrozen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 40%, #0a1628 70%, #0e1a38 100%)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <AnimatedBlobs />
      <FrostCanvas frozen={frozen} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <FrostStatus frozen={frozen} />
        <FreezeButton frozen={frozen} onClick={() => setFrozen(f => !f)} />
      </div>
    </div>
  );
}
