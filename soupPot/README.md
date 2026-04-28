# SoupStir

An interactive chili-stirring animation for React. Move your mouse (or finger) inside the pot to stir. Stir counter-clockwise to speed up the swirl; clockwise to slow it down.

## File structure

```
SoupStir/
├── SoupStir.jsx                  ← main entry — import this
├── components/
│   ├── SoupCanvas.jsx            ← canvas + input handling
│   └── StatusLabel.jsx           ← stirring status text
├── hooks/
│   └── useSwirlPhysics.js        ← swirl velocity, arc length, chunk & particle physics
├── renderers/
│   ├── drawPot.js                ← golden scalloped pot
│   ├── drawChiliSurface.js       ← swirling chili surface + arc lines
│   ├── drawChunks.js             ← kidney beans, peppers, corn
│   ├── drawParticles.js          ← bubbles + steam
│   └── drawSpoon.js              ← golden spoon with wake trail
└── utils/
    ├── colorUtils.js             ← lighten / darken / clamp helpers
    └── chunkData.js              ← default ingredient positions
```

## Usage

```jsx
import SoupStir from './SoupStir/SoupStir';

// Default 360×360
<SoupStir />

// Custom size
<SoupStir size={480} />

// Without label
<SoupStir size={280} showLabel={false} />
```

## Props

| Prop        | Type    | Default | Description                          |
|-------------|---------|---------|--------------------------------------|
| `size`      | number  | `360`   | Width and height of the canvas in px |
| `showLabel` | boolean | `true`  | Show the stirring status text        |

## Requirements

- React 18+
- No external dependencies — pure canvas rendering

## Notes

- The animation uses `requestAnimationFrame` and cleans up on unmount.
- Touch events are supported for mobile.
- The `size` prop scales all geometry proportionally.
