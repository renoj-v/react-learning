# FrostedGlass

A React component featuring animated colour blobs, fractal snowflake frost that creeps in from the viewport edges, and a freeze/thaw toggle — all broken into composable pieces.

## File structure

```
FrostedGlass/
├── index.js              — barrel export (import everything from here)
├── FrostedGlass.jsx      — main component (import this into your app)
├── AnimatedBlobs.jsx     — floating colour blob background
├── FrostCanvas.jsx       — canvas that renders the fractal snowflakes
├── FreezeButton.jsx      — styled toggle button
├── FrostStatus.jsx       — small status label
├── useFrostAnimation.js  — animation hook (freeze / thaw logic)
└── snowflakeUtils.js     — pure drawing functions (no React)
```

## Requirements

- React 18+
- No other dependencies

## Basic usage

```jsx
import FrostedGlass from './FrostedGlass/FrostedGlass';

export default function App() {
  return <FrostedGlass />;
}
```

## Props

| Prop     | Type              | Default  | Description                          |
|----------|-------------------|----------|--------------------------------------|
| `width`  | string \| number  | `'100%'` | CSS width of the scene container     |
| `height` | string \| number  | `480`    | CSS height of the scene container    |
| `style`  | object            | `{}`     | Extra styles merged onto the container |

```jsx
<FrostedGlass width="600px" height={360} style={{ borderRadius: 24 }} />
```

## Using sub-components individually

All pieces are exported from `index.js`:

```jsx
import {
  FrostedGlass,
  AnimatedBlobs,
  FrostCanvas,
  FreezeButton,
  FrostStatus,
  useFrostAnimation,
  buildCrystals,
  drawSnowflake,
} from './FrostedGlass';
```

### Controlling freeze state externally

```jsx
import { useState } from 'react';
import { FrostCanvas, FreezeButton } from './FrostedGlass';

export default function CustomScene() {
  const [frozen, setFrozen] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', height: 400 }}>
      <FrostCanvas frozen={frozen} />
      <FreezeButton frozen={frozen} onClick={() => setFrozen(f => !f)} />
    </div>
  );
}
```

### Using just the hook

```jsx
import { useRef } from 'react';
import { useFrostAnimation } from './FrostedGlass';

export default function MyCanvas({ frozen }) {
  const canvasRef = useRef(null);
  useFrostAnimation(canvasRef, frozen);
  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
```
