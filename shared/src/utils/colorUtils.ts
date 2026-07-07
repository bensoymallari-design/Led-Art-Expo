export function clamp(value: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

export function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const value = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('')}`;
}

export function adjustBrightness(hex: string, brightness: number) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.r * brightness, rgb.g * brightness, rgb.b * brightness);
}

export function contrastColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#05070d' : '#ffffff';
}
