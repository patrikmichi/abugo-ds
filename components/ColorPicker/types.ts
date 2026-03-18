import type React from 'react';

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsl';
export type ColorPickerValue = string | null;
export type ColorPickerSize = 'sm' | 'md' | 'lg';

export interface ColorPreset {
  /** Preset group label */
  label: string;
  /** Array of color strings (hex format) */
  colors: string[];
  /** Whether preset group is expanded by default */
  defaultOpen?: boolean;
}

export interface ColorPickerProps {
  /** Controlled color value */
  value?: ColorPickerValue;
  /** Default color value */
  defaultValue?: ColorPickerValue;
  /** Callback when color changes */
  onChange?: (value: ColorPickerValue, hex: string) => void;
  /** Color format for display and output */
  format?: ColorPickerFormat;
  /** Show color value text next to trigger. Can be boolean or a render function */
  showText?: boolean | ((color: string | null) => React.ReactNode);
  /** Disable the picker */
  disabled?: boolean;
  /** Disable alpha/transparency slider */
  disabledAlpha?: boolean;
  /** Allow clearing the color value */
  allowClear?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Preset color palettes */
  presets?: ColorPreset[];
  /** Trigger size */
  size?: ColorPickerSize;
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Custom panel render function */
  panelRender?: (color: string | null) => React.ReactNode;
}

/** Internal HSBA state type */
export interface Hsba {
  h: number;
  s: number;
  b: number;
  a: number;
}

/** RGB color type */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** HSB color type (without alpha) */
export interface Hsb {
  h: number;
  s: number;
  b: number;
}

/** Parsed color result */
export interface ParsedColor {
  hex: string;
  alpha: number;
}
