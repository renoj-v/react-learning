# Cookie Cutter Party — React Components

## File Structure

```
cookie-cutter-party/
├── CookieDough.jsx      ← Root component — import this into your app
├── HUD.jsx              ← Top score bar
├── Toolbar.jsx          ← Bottom cutter tray
├── CutterButton.jsx     ← Individual metallic cutter button
├── ComboDisplay.jsx     ← Combo multiplier flash overlay
├── GhostCursor.jsx      ← Metallic cutter ghost following the mouse
├── Particles.jsx        ← Word bubbles, score pops, confetti, flour puffs
├── DoughCanvas.jsx      ← Canvas rendering: background tiles + dough sheet + input
├── canvasUtils.js       ← Pure canvas drawing helpers (shapes, metal, dough, bg)
└── useGameState.js      ← Central game state hook + shared constants
```

## Usage

```jsx
import CookieDough from './cookie-cutter-party/CookieDough.jsx';

export default function App() {
  return (
    <div>
      <CookieDough />
    </div>
  );
}
```

## Requirements

- React 18+
- No additional dependencies
- Google Fonts loaded automatically (Fredoka One, Nunito)

## Controls

- **Click / tap** — stamp a cookie at that position
- **Mouse wheel / trackpad scroll** — scroll the dough sheet up/down
- **Touch swipe** — vertical swipe scrolls; tap cuts a cookie

## Customisation

| File | What to change |
|---|---|
| `useGameState.js` | `SHAPES`, `METAL` colors, `COOKIE` fill/border colors, combo timing |
| `DoughCanvas.jsx` | `HUD_H`, `TOOLBAR_H` constants if you resize those bars |
| `canvasUtils.js` | Dough gradient colors, hole rim styling, board tile colors |
| `Toolbar.jsx` | Button layout, scrollbar styles |
| `HUD.jsx` | Score label, avatar emoji |
