import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './ColorPicker.module.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/Input';
import { InputNumber } from '@/components/InputNumber';
import { Select } from '@/components/Select';
import type { ColorPickerFormat, ColorPickerProps, ColorPickerValue, Hsba } from './types';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsb,
  hsbToRgb,
  rgbToHsl,
  hslToRgb,
  hexToHsba,
  parseColor,
  formatColorDisplay,
} from './utils';

// Re-export types
export type { ColorPickerFormat, ColorPickerValue, ColorPreset, ColorPickerProps, ColorPickerSize } from './types';

const FORMAT_OPTIONS: { value: ColorPickerFormat; label: string }[] = [
  { value: 'hex', label: 'Hex' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
];

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#1677ff',
  onChange,
  format: initialFormat = 'hex',
  showText = false,
  disabled = false,
  disabledAlpha = false,
  presets,
  size = 'md',
  className,
  style,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState<ColorPickerValue>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [hsba, setHsba] = useState<Hsba>({ h: 214, s: 78, b: 100, a: 100 });
  const [presetOpenState, setPresetOpenState] = useState<Record<number, boolean>>({});
  const [currentFormat, setCurrentFormat] = useState<ColorPickerFormat>(initialFormat);

  const containerRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);
  const isDraggingSaturation = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingAlpha = useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

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
    return formatColorDisplay(currentHex, hsba.a, currentFormat);
  }, [currentHex, hsba.a, currentFormat]);

  const currentRgb = useMemo(() => {
    return hexToRgb(currentHex) || { r: 0, g: 0, b: 0 };
  }, [currentHex]);

  const currentHsl = useMemo(() => {
    return rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);
  }, [currentRgb]);

  // Handlers
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const emitChange = useCallback((hex: string, alpha: number) => {
    const newValue = formatColorDisplay(hex, alpha, currentFormat);
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue, hex);
  }, [isControlled, currentFormat, onChange]);

  const updateFromHsba = useCallback((newHsba: Hsba) => {
    setHsba(newHsba);
    const rgb = hsbToRgb(newHsba.h, newHsba.s, newHsba.b);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    emitChange(hex, newHsba.a);
  }, [emitChange]);

  // Saturation drag
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

  // Hue slider drag
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

  // Alpha slider drag
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

  // Global mouse events for dragging
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

  // Input handlers
  const handleHexInput = useCallback((val: string) => {
    const clean = val.replace(/[^a-fA-F0-9]/g, '').slice(0, 6);
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

  const handleHslInput = useCallback((channel: 'h' | 's' | 'l', val: string) => {
    const max = channel === 'h' ? 360 : 100;
    const num = Math.max(0, Math.min(max, parseInt(val, 10) || 0));
    const newHsl = { ...currentHsl, [channel]: num };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const newHsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
    updateFromHsba({ ...newHsb, a: hsba.a });
  }, [currentHsl, hsba.a, updateFromHsba]);

  const handleAlphaInput = useCallback((val: string) => {
    const num = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    updateFromHsba({ ...hsba, a: num });
  }, [hsba, updateFromHsba]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  // Initialize preset open states
  useEffect(() => {
    if (presets) {
      const initial: Record<number, boolean> = {};
      presets.forEach((p, i) => { initial[i] = p.defaultOpen !== false; });
      setPresetOpenState(initial);
    }
  }, [presets]);

  const togglePresetGroup = useCallback((index: number) => {
    setPresetOpenState((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // Render format inputs
  const renderFormatInputs = () => {
    const renderValueInputs = () => {
      switch (currentFormat) {
        case 'hex':
          return (
            <div className={styles.inputWrapper}>
              <Input
                size="sm"
                value={`#${currentHex.replace('#', '').toUpperCase()}`}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7}
                spellCheck={false}
                className={styles.colorInput}
              />
            </div>
          );
        case 'rgb':
          return (
            <>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentRgb.r} onChange={(val) => handleRgbInput('r', String(val ?? 0))} min={0} max={255} className={styles.colorInput} />
              </div>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentRgb.g} onChange={(val) => handleRgbInput('g', String(val ?? 0))} min={0} max={255} className={styles.colorInput} />
              </div>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentRgb.b} onChange={(val) => handleRgbInput('b', String(val ?? 0))} min={0} max={255} className={styles.colorInput} />
              </div>
            </>
          );
        case 'hsl':
          return (
            <>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentHsl.h} onChange={(val) => handleHslInput('h', String(val ?? 0))} min={0} max={360} className={styles.colorInput} />
              </div>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentHsl.s} onChange={(val) => handleHslInput('s', String(val ?? 0))} min={0} max={100} className={styles.colorInput} />
              </div>
              <div className={styles.inputWrapper}>
                <InputNumber size="sm" value={currentHsl.l} onChange={(val) => handleHslInput('l', String(val ?? 0))} min={0} max={100} className={styles.colorInput} />
              </div>
            </>
          );
      }
    };

    return (
      <div className={styles.inputRow}>
        {/* Format selector */}
        <div className={styles.formatSelect}>
          <select
            className={styles.nativeSelect}
            value={currentFormat}
            onChange={(e) => setCurrentFormat(e.target.value as ColorPickerFormat)}
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={cn('material-symbols-outlined', styles.selectIcon)}>expand_more</span>
        </div>

        {/* Value inputs */}
        <div className={styles.inputGroup}>
          {renderValueInputs()}
        </div>

        {/* Alpha input */}
        {!disabledAlpha && (
          <div className={cn(styles.inputWrapper, styles.inputAlpha)}>
            <InputNumber
              size="sm"
              value={Math.round(hsba.a)}
              onChange={(val) => handleAlphaInput(String(val ?? 0))}
              min={0}
              max={100}
              suffix="%"
              className={styles.colorInput}
            />
          </div>
        )}
      </div>
    );
  };

  const hueColor = hsbToRgb(hsba.h, 100, 100);
  const hueHex = rgbToHex(hueColor.r, hueColor.g, hueColor.b);

  return (
    <div ref={containerRef} className={cn(styles.colorPicker, className)} style={style}>
      {/* Trigger */}
      <div
        className={cn(
          styles.trigger,
          styles[size],
          disabled && styles.disabled,
          isOpen && styles.active
        )}
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
        </div>
        {showText && <span className={styles.colorText}>{displayValue}</span>}
      </div>

      {/* Panel */}
      {isOpen && (
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
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
            <div className={styles.colorPreview}>
              <div
                className={styles.colorPreviewInner}
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
                    className={styles.alphaGradient}
                    style={{ background: `linear-gradient(to right, transparent, ${currentHex})` }}
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
          <div className={styles.inputs}>
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
                          className={cn(styles.presetColor, currentHex.toLowerCase() === color.toLowerCase() && styles.presetColorActive)}
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
        </div>
      )}
    </div>
  );
}
