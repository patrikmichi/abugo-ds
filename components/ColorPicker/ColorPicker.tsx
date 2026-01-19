import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './ColorPicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb';
export type ColorPickerValue = string | null;

export interface ColorPreset {
  label: string;
  colors: string[];
}

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const rgbToHsb = (r: number, g: number, b: number): { h: number; s: number; b: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const bValue = max;

  return { h, s: Math.round(s * 100), b: Math.round(bValue * 100) };
};

const hsbToRgb = (h: number, s: number, b: number): { r: number; g: number; b: number } => {
  s /= 100;
  b /= 100;

  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;

  let r = 0;
  let g = 0;
  let blue = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    blue = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    blue = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    blue = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    blue = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    blue = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    blue = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  blue = Math.round((blue + m) * 255);

  return { r, g, b: blue };
};

const formatColor = (hex: string, format: ColorPickerFormat): string => {
  if (!hex) return '';
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  switch (format) {
    case 'hex':
      return hex.toUpperCase();
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'hsb': {
      const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
      return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
    }
    default:
      return hex;
  }
};

const parseColor = (color: string): string | null => {
  if (!color) return null;

  // Hex format
  if (color.startsWith('#')) {
    return color.length === 7 ? color : null;
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return rgbToHex(r, g, b);
  }

  // HSB format
  const hsbMatch = color.match(/hsb\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hsbMatch) {
    const h = parseInt(hsbMatch[1], 10);
    const s = parseInt(hsbMatch[2], 10);
    const b = parseInt(hsbMatch[3], 10);
    const rgb = hsbToRgb(h, s, b);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  return null;
};

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current value (controlled) */
  value?: ColorPickerValue;
  /** Default value (uncontrolled) */
  defaultValue?: ColorPickerValue;
  /** Callback when value changes */
  onChange?: (value: ColorPickerValue, hex: string) => void;
  /** Color format */
  format?: ColorPickerFormat;
  /** Show color text */
  showText?: boolean | ((color: ColorPickerValue) => React.ReactNode);
  /** Allow clear */
  allowClear?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Preset colors */
  presets?: ColorPreset[];
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Open state (controlled) */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom class name for popup */
  popupClassName?: string;
  /** Custom style for popup */
  popupStyle?: React.CSSProperties;
}

/**
 * ColorPicker Component
 * 
 * Color picker component with support for hex, RGB, and HSB formats.
 * 
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#538bff"
 *   onChange={(value, hex) => console.log(value, hex)}
 *   format="hex"
 * />
 * ```
 */
export function ColorPicker({
  value: controlledValue,
  defaultValue,
  onChange,
  format = 'hex',
  showText = false,
  allowClear = false,
  disabled = false,
  presets,
  size = 'md',
  className,
  style,
  getPopupContainer,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  popupClassName,
  popupStyle,
  ...props
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState<ColorPickerValue>(defaultValue || null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [hsb, setHsb] = useState<{ h: number; s: number; b: number }>({ h: 214, s: 100, b: 100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  // Convert value to hex and update HSB
  useEffect(() => {
    if (value) {
      const hex = parseColor(value) || value;
      const rgb = hexToRgb(hex);
      if (rgb) {
        setHsb(rgbToHsb(rgb.r, rgb.g, rgb.b));
      }
    }
  }, [value]);

  const currentHex = useMemo(() => {
    if (!value) return null;
    const hex = parseColor(value) || value;
    return hex.startsWith('#') ? hex : `#${hex}`;
  }, [value]);

  const displayValue = useMemo(() => {
    if (!currentHex) return '';
    return formatColor(currentHex, format);
  }, [currentHex, format]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!isOpenControlled) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
  }, [disabled, isOpenControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isOpenControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  const handleChange = useCallback(
    (newValue: string | null) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      const hex = newValue ? (parseColor(newValue) || newValue) : null;
      onChange?.(newValue, hex || '');
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange(null);
    },
    [handleChange]
  );

  const updateColorFromHsb = useCallback(
    (newHsb: { h: number; s: number; b: number }) => {
      setHsb(newHsb);
      const rgb = hsbToRgb(newHsb.h, newHsb.s, newHsb.b);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      handleChange(hex);
    },
    [handleChange]
  );

  const handleSaturationClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!saturationRef.current) return;
      const rect = saturationRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const b = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      updateColorFromHsb({ ...hsb, s, b });
    },
    [hsb, updateColorFromHsb]
  );

  const handleHueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const h = parseInt(e.target.value, 10);
      updateColorFromHsb({ ...hsb, h });
    },
    [hsb, updateColorFromHsb]
  );

  const handlePresetClick = useCallback(
    (color: string) => {
      handleChange(color);
    },
    [handleChange]
  );

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClose]);

  const getContainerElement = (): HTMLElement => {
    if (getPopupContainer && containerRef.current) {
      return getPopupContainer(containerRef.current);
    }
    return document.body;
  };

  const renderPanel = () => {
    if (!open) return null;
    
    // Ensure container ref is available before rendering portal
    if (!containerRef.current) return null;

    const hueColor = hsbToRgb(hsb.h, 100, 100);
    const hueHex = rgbToHex(hueColor.r, hueColor.g, hueColor.b);
    const saturationBg = `linear-gradient(to right, var(--token-primitive-color-white, #ffffff), ${hueHex})`;
    const brightnessBg = `linear-gradient(to bottom, transparent, #000)`;

    return createPortal(
      <div
        ref={panelRef}
        className={cn(styles.panel, popupClassName)}
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.picker}>
          <div
            ref={saturationRef}
            className={styles.saturation}
            style={{
              background: saturationBg,
            }}
            onClick={handleSaturationClick}
          >
            <div
              className={styles.saturationPointer}
              style={{
                left: `${hsb.s}%`,
                top: `${100 - hsb.b}%`,
              }}
            />
          </div>
          <div className={styles.hue}>
            <input
              type="range"
              min="0"
              max="360"
              value={hsb.h}
              onChange={handleHueChange}
              className={styles.hueSlider}
              style={{
                background: `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`,
              }}
            />
          </div>
        </div>
        <div className={styles.inputs}>
          <Input
            value={displayValue}
            onChange={(e) => {
              const newValue = e.target.value;
              const parsed = parseColor(newValue);
              if (parsed) {
                handleChange(parsed);
              }
            }}
            placeholder={format}
            size="sm"
            style={{ width: '100px' }}
          />
        </div>
        {presets && presets.length > 0 && (
          <div className={styles.presets}>
            {presets.map((preset, index) => (
              <div key={index} className={styles.presetGroup}>
                <div className={styles.presetLabel}>{preset.label}</div>
                <div className={styles.presetColors}>
                  {preset.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className={cn(
                        styles.presetColor,
                        currentHex === color && styles.presetColorSelected
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>,
      getContainerElement()
    );
  };

  const renderText = () => {
    if (!showText) return null;
    if (typeof showText === 'function') {
      return showText(value);
    }
    return <span className={styles.text}>{displayValue}</span>;
  };

  return (
    <div ref={containerRef} className={cn(styles.colorPickerWrapper, className)} style={style} {...props}>
      <div className={styles.trigger} onClick={handleOpen}>
        <div
          className={styles.colorBlock}
          style={{
            backgroundColor: currentHex || 'var(--token-primitive-color-white, #ffffff)',
            border: currentHex ? 'none' : `1px solid var(--token-primitive-border-color-default, #d9d9d9)`,
          }}
        />
        {renderText()}
        {allowClear && currentHex && (
          <span
            className={cn('material-symbols-outlined', styles.icon, styles.iconDefault, styles.iconCursor, styles.iconMarginLeft)}
            onClick={handleClear}
          >
            close
          </span>
        )}
      </div>
      {renderPanel()}
    </div>
  );
}
