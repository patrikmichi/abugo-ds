import type { ColorPickerFormat, Rgb, Hsb, Hsba, ParsedColor } from './types';

/** Convert hex string to RGB object */
export const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

/** Convert RGB values to hex string */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
    .join('');
};

/** Convert RGB values to HSB object */
export const rgbToHsb = (r: number, g: number, b: number): Hsb => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  return { h, s: Math.round(s * 100), b: Math.round(max * 100) };
};

/** Convert HSB values to RGB object */
export const hsbToRgb = (h: number, s: number, b: number): Rgb => {
  s /= 100;
  b /= 100;
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  let r = 0, g = 0, bl = 0;
  if (h >= 0 && h < 60) { r = c; g = x; }
  else if (h >= 60 && h < 120) { r = x; g = c; }
  else if (h >= 120 && h < 180) { g = c; bl = x; }
  else if (h >= 180 && h < 240) { g = x; bl = c; }
  else if (h >= 240 && h < 300) { r = x; bl = c; }
  else { r = c; bl = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255),
  };
};

/** Convert RGB to HSL */
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else h = ((r - g) / delta + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/** Convert HSL to RGB */
export const hslToRgb = (h: number, s: number, l: number): Rgb => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; }
  else if (h >= 60 && h < 120) { r = x; g = c; }
  else if (h >= 120 && h < 180) { g = c; b = x; }
  else if (h >= 180 && h < 240) { g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

/** Convert hex string to HSBA object */
export const hexToHsba = (hex: string, alpha: number = 100): Hsba => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, b: 0, a: alpha };
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  return { ...hsb, a: alpha };
};

/** Parse color string to hex and alpha */
export const parseColor = (color: string): ParsedColor | null => {
  if (!color) return null;

  // Hex format
  if (color.startsWith('#')) {
    if (color.length === 7) return { hex: color, alpha: 100 };
    if (color.length === 9) {
      const alphaHex = color.slice(7, 9);
      return { hex: color.slice(0, 7), alpha: Math.round((parseInt(alphaHex, 16) / 255) * 100) };
    }
    return null;
  }

  // RGBA format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = rgbaMatch[4] ? Math.round(parseFloat(rgbaMatch[4]) * 100) : 100;
    return { hex: rgbToHex(r, g, b), alpha: a };
  }

  // HSB format
  const hsbMatch = color.match(/hsb\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
  if (hsbMatch) {
    const h = parseInt(hsbMatch[1], 10);
    const s = parseInt(hsbMatch[2], 10);
    const bv = parseInt(hsbMatch[3], 10);
    const rgb = hsbToRgb(h, s, bv);
    return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), alpha: 100 };
  }

  return null;
};

/** Format color for display based on format */
export const formatColorDisplay = (hex: string, alpha: number, format: ColorPickerFormat): string => {
  if (!hex) return '';
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  switch (format) {
    case 'hex':
      if (alpha < 100) {
        const alphaHex = Math.round((alpha / 100) * 255).toString(16).padStart(2, '0');
        return (hex + alphaHex).toUpperCase();
      }
      return hex.toUpperCase();
    case 'rgb':
      if (alpha < 100) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha / 100).toFixed(2)})`;
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'hsl': {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      if (alpha < 100) return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${(alpha / 100).toFixed(2)})`;
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    default:
      return hex;
  }
};
