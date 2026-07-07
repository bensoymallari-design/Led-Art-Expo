import { EffectType } from '../types';

export function getEffectTransform(effect: EffectType | undefined, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  switch (effect) {
    case 'scroll':
      return { translateX: `${(1 - p) * 100}%` };
    case 'fade':
      return { opacity: p };
    case 'pulse':
      return { scale: 0.85 + Math.sin(p * Math.PI) * 0.25 };
    case 'wipe':
      return { clipProgress: p };
    case 'blink':
      return { opacity: p < 0.5 ? 1 : 0.15 };
    default:
      return { opacity: 1 };
  }
}

export function frameIndexForTime(frameCount: number, elapsedMs: number, frameDurationMs = 100) {
  if (frameCount <= 0) return 0;
  return Math.floor(elapsedMs / frameDurationMs) % frameCount;
}
