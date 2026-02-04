import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './ColorPicker.module.css';
import { cn } from '@/lib/utils';

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb';
export type ColorPickerValue = string | null;

export interface ColorPreset {
  label: string;
  colors: string[];
  defaultOpen?: boolean;
}

// ─── Color conversion utilities ──────────────────────────────────────────────

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
};

const rgbToHsb = (r: number, g: number, b: number): { h: number; s: number; b: number } => {
  r /= 255; g /= 255; b /= 255;
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

const hsbToRgb = (h: number, s: number, b: number): { r: number; g: number; b: number } => {
  s /= 100; b /= 100;
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
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((bl + m) * 255) };
};

const hexToHsba = (hex: string, alpha: number = 100): { h: number; s: number; b: number; a: number } => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, b: 0, a: alpha };
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  return { ...hsb, a: alpha };
};

const parseColor = (color: string): { hex: string; alpha: number } | null => {
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

const formatColorDisplay = (hex: string, alpha: number, format: ColorPickerFormat): string => {
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
    case 'hsb': {
      const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
      return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
    }
    default:
      return hex;
  }
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: ColorPickerValue;
  defaultValue?: ColorPickerValue;
  onChange?: (value: ColorPickerValue, hex: string) => void;
  format?: ColorPickerFormat;
  onFormatChange?: (format: ColorPickerFormat) => void;
  showText?: boolean | ((color: ColorPickerValue) => React.ReactNode);
  allowClear?: boolean;
  disabled?: boolean;
  disabledAlpha?: boolean;
  presets?: ColorPreset[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#1677ff',
  onChange,
  format: controlledFormat,
  onFormatChange,
  showText = false,
  allowClear = false,
  disabled = false,
  disabledAlpha = true,
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
  const [internalValue, setInternalValue] = useState<ColorPickerValue>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalFormat, setInternalFormat] = useState<ColorPickerFormat>('hex');
  const [hsba, setHsba] = useState<{ h: number; s: number; b: number; a: number }>({ h: 214, s: 78, b: 100, a: 100 });
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const [presetOpenState, setPresetOpenState] = useState<Record<number, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);
  const isDraggingSaturation = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingAlpha = useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;
  const format = controlledFormat ?? internalFormat;

  // Parse initial value into HSBA
  useEffect(() => {
    if (value) {
      const parsed = parseColor(value);
      if (parsed) {
        const hsb = hexToHsba(parsed.hex, parsed.alpha);
        setHsba(hsb);
      }
    }
  }, [value]);

  const currentHex = useMemo(() => {
    const rgb = hsbToRgb(hsba.h, hsba.s, hsba.b);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }, [hsba.h, hsba.s, hsba.b]);

  const displayValue = useMemo(() => {
    return formatColorDisplay(currentHex, hsba.a, format);
  }, [currentHex, hsba.a, format]);

  const currentRgb = useMemo(() => {
    return hexToRgb(currentHex) || { r: 0, g: 0, b: 0 };
  }, [currentHex]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!isOpenControlled) setInternalOpen(true);
    onOpenChange?.(true);
  }, [disabled, isOpenControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isOpenControlled) setInternalOpen(false);
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  const emitChange = useCallback((hex: string, alpha: number) => {
    const newValue = formatColorDisplay(hex, alpha, format);
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue, hex);
  }, [isControlled, format, onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue(null);
    onChange?.(null, '');
  }, [isControlled, onChange]);

  const updateFromHsba = useCallback((newHsba: { h: number; s: number; b: number; a: number }) => {
    setHsba(newHsba);
    const rgb = hsbToRgb(newHsba.h, newHsba.s, newHsba.b);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    emitChange(hex, newHsba.a);
  }, [emitChange]);

  // ─── Saturation drag ─────────────────────────────────────────────────────

  const updateSaturation = useCallback((clientX: number, clientY: number) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();
    const s = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const b = Math.max(0, Math.min(100, 100 - ((clientY - rect.top) / rect.height) * 100));
    updateFromHsba({ ...hsba, s, b });
  }, [hsba, updateFromHsba]);

  const handleSaturationMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSaturation.current = true;
    updateSaturation(e.clientX, e.clientY);
  }, [updateSaturation]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSaturation.current) updateSaturation(e.clientX, e.clientY);
      if (isDraggingHue.current) updateHueFromClient(e.clientX);
      if (isDraggingAlpha.current) updateAlphaFromClient(e.clientX);
    };
    const handleMouseUp = () => {
      isDraggingSaturation.current = false;
      isDraggingHue.current = false;
      isDraggingAlpha.current = false;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // ─── Hue slider drag ─────────────────────────────────────────────────────

  const updateHueFromClient = useCallback((clientX: number) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
    updateFromHsba({ ...hsba, h });
  }, [hsba, updateFromHsba]);

  const handleHueMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHue.current = true;
    updateHueFromClient(e.clientX);
  }, [updateHueFromClient]);

  // ─── Alpha slider drag ────────────────────────────────────────────────────

  const updateAlphaFromClient = useCallback((clientX: number) => {
    if (!alphaRef.current) return;
    const rect = alphaRef.current.getBoundingClientRect();
    const a = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    updateFromHsba({ ...hsba, a });
  }, [hsba, updateFromHsba]);

  const handleAlphaMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingAlpha.current = true;
    updateAlphaFromClient(e.clientX);
  }, [updateAlphaFromClient]);

  // ─── Format switching ─────────────────────────────────────────────────────

  const handleFormatChange = useCallback((newFormat: ColorPickerFormat) => {
    if (!controlledFormat) setInternalFormat(newFormat);
    onFormatChange?.(newFormat);
  }, [controlledFormat, onFormatChange]);

  const cycleFormat = useCallback(() => {
    const formats: ColorPickerFormat[] = ['hex', 'rgb', 'hsb'];
    const idx = formats.indexOf(format);
    const next = formats[(idx + 1) % formats.length];
    handleFormatChange(next);
  }, [format, handleFormatChange]);

  // ─── Input handlers ───────────────────────────────────────────────────────

  const handleHexInput = useCallback((val: string) => {
    let clean = val.replace(/[^a-fA-F0-9]/g, '').slice(0, 6);
    if (clean.length === 6) {
      const hex = '#' + clean;
      const rgb = hexToRgb(hex);
      if (rgb) {
        const newHsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
        updateFromHsba({ ...newHsb, a: hsba.a });
      }
    }
  }, [hsba.a, updateFromHsba]);

  const handleRgbInput = useCallback((channel: 'r' | 'g' | 'b', val: string) => {
    const num = Math.max(0, Math.min(255, parseInt(val, 10) || 0));
    const newRgb = { ...currentRgb, [channel]: num };
    const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b);
    updateFromHsba({ ...newHsb, a: hsba.a });
  }, [currentRgb, hsba.a, updateFromHsba]);

  const handleHsbInput = useCallback((channel: 'h' | 's' | 'b', val: string) => {
    const max = channel === 'h' ? 360 : 100;
    const num = Math.max(0, Math.min(max, parseInt(val, 10) || 0));
    updateFromHsba({ ...hsba, [channel]: num });
  }, [hsba, updateFromHsba]);

  const handleAlphaInput = useCallback((val: string) => {
    const num = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    updateFromHsba({ ...hsba, a: num });
  }, [hsba, updateFromHsba]);

  // ─── Click outside ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClose]);

  // ─── Panel positioning ────────────────────────────────────────────────────

  useEffect(() => {
    if (!open || !containerRef.current) {
      setPanelPosition(null);
      return;
    }
    const updatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.bottom + 4;
      const left = rect.left;
      setPanelPosition({ top, left });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  // ─── Preset toggle ────────────────────────────────────────────────────────

  const togglePresetGroup = useCallback((index: number) => {
    setPresetOpenState((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // Initialize preset open states
  useEffect(() => {
    if (presets) {
      const initial: Record<number, boolean> = {};
      presets.forEach((p, i) => { initial[i] = p.defaultOpen !== false; });
      setPresetOpenState(initial);
    }
  }, [presets]);

  // ─── Render helpers ───────────────────────────────────────────────────────

  const renderFormatInputs = () => {
    switch (format) {
      case 'hex':
        return (
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                value={currentHex.replace('#', '').toUpperCase()}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={6}
                spellCheck={false}
              />
              <span className={styles.inputLabel}>HEX</span>
            </div>
            {!disabledAlpha && (
              <div className={cn(styles.inputWrapper, styles.inputSmall)}>
                <input
                  className={styles.input}
                  type="number"
                  value={hsba.a}
                  onChange={(e) => handleAlphaInput(e.target.value)}
                  min={0}
                  max={100}
                />
                <span className={styles.inputLabel}>A%</span>
              </div>
            )}
          </div>
        );
      case 'rgb':
        return (
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={currentRgb.r} onChange={(e) => handleRgbInput('r', e.target.value)} min={0} max={255} />
              <span className={styles.inputLabel}>R</span>
            </div>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={currentRgb.g} onChange={(e) => handleRgbInput('g', e.target.value)} min={0} max={255} />
              <span className={styles.inputLabel}>G</span>
            </div>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={currentRgb.b} onChange={(e) => handleRgbInput('b', e.target.value)} min={0} max={255} />
              <span className={styles.inputLabel}>B</span>
            </div>
            {!disabledAlpha && (
              <div className={styles.inputWrapper}>
                <input className={styles.input} type="number" value={hsba.a} onChange={(e) => handleAlphaInput(e.target.value)} min={0} max={100} />
                <span className={styles.inputLabel}>A%</span>
              </div>
            )}
          </div>
        );
      case 'hsb':
        return (
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={hsba.h} onChange={(e) => handleHsbInput('h', e.target.value)} min={0} max={360} />
              <span className={styles.inputLabel}>H</span>
            </div>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={hsba.s} onChange={(e) => handleHsbInput('s', e.target.value)} min={0} max={100} />
              <span className={styles.inputLabel}>S%</span>
            </div>
            <div className={styles.inputWrapper}>
              <input className={styles.input} type="number" value={hsba.b} onChange={(e) => handleHsbInput('b', e.target.value)} min={0} max={100} />
              <span className={styles.inputLabel}>B%</span>
            </div>
            {!disabledAlpha && (
              <div className={styles.inputWrapper}>
                <input className={styles.input} type="number" value={hsba.a} onChange={(e) => handleAlphaInput(e.target.value)} min={0} max={100} />
                <span className={styles.inputLabel}>A%</span>
              </div>
            )}
          </div>
        );
    }
  };

  const renderPanel = () => {
    if (!open) return null;
    if (!containerRef.current) return null;

    const hueColor = hsbToRgb(hsba.h, 100, 100);
    const hueHex = rgbToHex(hueColor.r, hueColor.g, hueColor.b);

    const panel = (
      <div
        ref={panelRef}
        className={cn(styles.panel, popupClassName)}
        style={{
          ...(panelPosition ? { position: 'fixed', top: panelPosition.top, left: panelPosition.left } : { display: 'none' }),
          ...popupStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Saturation panel */}
        <div
          ref={saturationRef}
          className={styles.saturation}
          style={{ backgroundColor: hueHex }}
          onMouseDown={handleSaturationMouseDown}
        >
          <div className={styles.saturationWhite} />
          <div className={styles.saturationBlack} />
          <div
            className={styles.saturationPointer}
            style={{ left: `${hsba.s}%`, top: `${100 - hsba.b}%` }}
          />
        </div>

        {/* Sliders */}
        <div className={styles.sliders}>
          <div className={styles.sliderPreview}>
            <div
              className={styles.sliderPreviewColor}
              style={{
                backgroundColor: currentHex,
                opacity: hsba.a / 100,
              }}
            />
          </div>
          <div className={styles.sliderGroup}>
            {/* Hue slider */}
            <div
              ref={hueRef}
              className={styles.hueSlider}
              onMouseDown={handleHueMouseDown}
            >
              <div
                className={styles.sliderHandle}
                style={{ left: `${(hsba.h / 360) * 100}%`, backgroundColor: hueHex }}
              />
            </div>
            {/* Alpha slider */}
            {!disabledAlpha && (
              <div
                ref={alphaRef}
                className={styles.alphaSlider}
                onMouseDown={handleAlphaMouseDown}
              >
                <div
                  className={styles.alphaSliderGradient}
                  style={{
                    background: `linear-gradient(to right, transparent, ${currentHex})`,
                  }}
                />
                <div
                  className={styles.sliderHandle}
                  style={{ left: `${hsba.a}%`, backgroundColor: currentHex }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Color inputs */}
        <div className={styles.colorInputs}>
          <button className={styles.formatSwitch} onClick={cycleFormat} type="button" title="Switch format">
            <span className="material-symbols-outlined">swap_vert</span>
          </button>
          {renderFormatInputs()}
        </div>

        {/* Presets */}
        {presets && presets.length > 0 && (
          <div className={styles.presets}>
            {presets.map((preset, index) => (
              <div key={index} className={styles.presetGroup}>
                <div className={styles.presetHeader} onClick={() => togglePresetGroup(index)}>
                  <span className={styles.presetLabel}>{preset.label}</span>
                  <span className={cn('material-symbols-outlined', styles.presetChevron, presetOpenState[index] && styles.presetChevronOpen)}>
                    expand_more
                  </span>
                </div>
                {presetOpenState[index] && (
                  <div className={styles.presetColors}>
                    {preset.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className={cn(styles.presetColor, currentHex === color && styles.presetColorSelected)}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const parsed = parseColor(color);
                          if (parsed) {
                            const newHsb = hexToHsba(parsed.hex, parsed.alpha);
                            updateFromHsba(newHsb);
                          }
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clear button */}
        {allowClear && value && !disabled && (
          <div className={styles.clearWrapper}>
            <button className={styles.clearBtn} onClick={handleClear} type="button">
              <span className="material-symbols-outlined">delete</span>
              Clear
            </button>
          </div>
        )}
      </div>
    );

    const container = getPopupContainer && containerRef.current
      ? getPopupContainer(containerRef.current)
      : document.body;

    return createPortal(panel, container);
  };

  const renderText = () => {
    if (!showText) return null;
    if (typeof showText === 'function') return showText(value);
    return <span className={styles.text}>{displayValue}</span>;
  };

  // ─── Trigger ──────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={cn(styles.colorPickerWrapper, className)} style={style} {...props}>
      <div
        className={cn(styles.trigger, styles[size], disabled && styles.disabled, open && styles.triggerActive)}
        onClick={handleOpen}
      >
        <div className={styles.colorBlock}>
          <div
            className={styles.colorBlockInner}
            style={{
              backgroundColor: value ? currentHex : undefined,
              opacity: value ? hsba.a / 100 : undefined,
            }}
          />
          {!value && <span className={cn('material-symbols-outlined', styles.emptyIcon)}>palette</span>}
        </div>
        {renderText()}
        {allowClear && value && !disabled && (
          <span
            className={cn('material-symbols-outlined', styles.clearIcon)}
            onClick={handleClear}
          >
            cancel
          </span>
        )}
      </div>
      {renderPanel()}
    </div>
  );
}
