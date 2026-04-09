import { useState, useRef, useCallback } from 'react';

export const SHAPES = ['star', 'heart', 'mushroom', 'circle', 'flower', 'gingerbread', 'cloud', 'lightning'];

export const METAL = {
  star:        { base: '#d4af37', hi: '#fff8b0', shadow: '#7a6010' },
  heart:       { base: '#c0c0c0', hi: '#ffffff',  shadow: '#606060' },
  mushroom:    { base: '#b87333', hi: '#f5c97a',  shadow: '#5a3010' },
  circle:      { base: '#8cbed6', hi: '#dff3ff',  shadow: '#2a6080' },
  flower:      { base: '#e0e0e0', hi: '#ffffff',  shadow: '#888888' },
  gingerbread: { base: '#a97c50', hi: '#e8c98a',  shadow: '#4a2e10' },
  cloud:       { base: '#b0b8c8', hi: '#e8edf8',  shadow: '#505870' },
  lightning:   { base: '#ffd700', hi: '#fffbe0',  shadow: '#806000' },
};

export const COOKIE = {
  star:        { fill: '#ffe066', border: '#8b5c00' },
  heart:       { fill: '#ff8fa3', border: '#7a1a2a' },
  mushroom:    { fill: '#ce93d8', border: '#5a1870' },
  circle:      { fill: '#aee6ff', border: '#1a5070' },
  flower:      { fill: '#b9f6ca', border: '#1a5030' },
  gingerbread: { fill: '#d4956a', border: '#4a2000' },
  cloud:       { fill: '#e8eeff', border: '#2a3060' },
  lightning:   { fill: '#fff176', border: '#7a5a00' },
};

export const WORDS = ['STAMP!', 'NICE CUT!', 'PERFECT!', 'YUM!', 'COOKIE!', 'SWEET!'];
export const CONFETTI_COLORS = ['#e8001c', '#e91e8c', '#ffd700', '#00e676', '#40c4ff', '#ff9800', '#aa00ff'];

export function useGameState() {
  const [score, setScore] = useState(0);
  const [currentShape, setCurrentShape] = useState('star');
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const holesRef = useRef([]);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const comboCountRef = useRef(0);
  const lastCutTimeRef = useRef(0);
  const comboTimerRef = useRef(null);

  const addHole = useCallback((x, screenY) => {
    holesRef.current = [
      ...holesRef.current,
      { x, worldY: screenY + scrollYRef.current, shape: currentShape, size: 52 },
    ];
  }, [currentShape]);

  const updateCombo = useCallback(() => {
    const now = Date.now();
    if (now - lastCutTimeRef.current < 1800) {
      comboCountRef.current += 1;
    } else {
      comboCountRef.current = 1;
    }
    lastCutTimeRef.current = now;

    if (comboCountRef.current >= 3) {
      setCombo(comboCountRef.current);
      setShowCombo(true);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setShowCombo(false);
        comboCountRef.current = 0;
      }, 1200);
    }
  }, []);

  const cut = useCallback((x, screenY) => {
    addHole(x, screenY);
    setScore(s => s + 1);
    updateCombo();
  }, [addHole, updateCombo]);

  return {
    score,
    currentShape,
    setCurrentShape,
    combo,
    showCombo,
    holesRef,
    scrollYRef,
    targetScrollYRef,
    cut,
  };
}
