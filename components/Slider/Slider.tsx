import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import styles from './Slider.module.css';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';

export type SliderValue = number | [number, number];

export interface SliderMarks {
  [key: number]: React.ReactNode | { style?: React.CSSProperties; label?: React.ReactNode };
}

export interface SliderTooltipProps {
  /** Whether tooltip is always visible */
  open?: boolean;
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom formatter */
  formatter?: (value: number | undefined) => React.ReactNode;
  /** Container to render tooltip in */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value?: SliderValue;
  /** Default value (uncontrolled) */
  defaultValue?: SliderValue;
  /** Callback when value changes */
  onChange?: (value: SliderValue) => void;
  /** Callback after value changes (on mouse up) */
  onAfterChange?: (value: SliderValue) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number | null;
  /** Range mode (dual thumbs) */
  range?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Vertical orientation */
  vertical?: boolean;
  /** Reverse direction */
  reverse?: boolean;
  /** Show dots for each step */
  dots?: boolean;
  /** Whether to include min/max in track */
  included?: boolean;
  /** Marks on slider */
  marks?: SliderMarks;
  /** Tooltip configuration */
  tooltip?: SliderTooltipProps | boolean;
  /** Custom track style */
  trackStyle?: React.CSSProperties | Array<React.CSSProperties>;
  /** Custom handle style */
  handleStyle?: React.CSSProperties | Array<React.CSSProperties>;
  /** Custom rail style */
  railStyle?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Slider Component
 * 
 * Range input slider component. 
 * 
 * @example
 * ```tsx
 * <Slider
 *   min={0}
 *   max={100}
 *   defaultValue={50}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export function Slider({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onAfterChange,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  vertical = false,
  reverse = false,
  dots = false,
  included = true,
  marks,
  tooltip = true,
  trackStyle,
  handleStyle,
  railStyle,
  className,
  style,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = useState<SliderValue>(() => {
    if (range) {
      return Array.isArray(defaultValue) ? defaultValue : [min, max];
    }
    return typeof defaultValue === 'number' ? defaultValue : min;
  });

  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<{ [key: number]: boolean }>({});
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const normalizedValue = useMemo(() => {
    if (range) {
      const [val1, val2] = Array.isArray(value) ? value : [min, max];
      return [Math.max(min, Math.min(max, val1)), Math.max(min, Math.min(max, val2))].sort((a, b) => a - b) as [number, number];
    }
    return Math.max(min, Math.min(max, typeof value === 'number' ? value : min));
  }, [value, range, min, max]);

  const getValueFromPosition = useCallback(
    (clientX: number, clientY: number): number => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = vertical
        ? reverse
          ? (rect.bottom - clientY) / rect.height
          : (clientY - rect.top) / rect.height
        : reverse
          ? (rect.right - clientX) / rect.width
          : (clientX - rect.left) / rect.width;

      let newValue = min + percentage * (max - min);

      if (step !== null && step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      return Math.max(min, Math.min(max, newValue));
    },
    [min, max, step, vertical, reverse]
  );

  const updateValue = useCallback(
    (newValue: SliderValue, isAfterChange = false) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      if (isAfterChange) {
        onAfterChange?.(newValue);
      } else {
        onChange?.(newValue);
      }
    },
    [isControlled, onChange, onAfterChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handleIndex?: number) => {
      if (disabled) return;

      e.preventDefault();
      isDraggingRef.current = true;
      setActiveHandle(handleIndex ?? (range ? 0 : 0));

      const newValue = getValueFromPosition(e.clientX, e.clientY);

      if (range) {
        const [val1, val2] = normalizedValue as [number, number];
        const distances = [Math.abs(newValue - val1), Math.abs(newValue - val2)];
        const closestIndex = distances[0] < distances[1] ? 0 : 1;
        const newValues: [number, number] = [...normalizedValue] as [number, number];
        newValues[closestIndex] = newValue;
        newValues.sort((a, b) => a - b);
        updateValue(newValues);
        setActiveHandle(closestIndex);
      } else {
        updateValue(newValue);
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const newValue = getValueFromPosition(e.clientX, e.clientY);

        if (range && activeHandle !== null) {
          const newValues: [number, number] = [...normalizedValue] as [number, number];
          newValues[activeHandle] = newValue;
          newValues.sort((a, b) => a - b);
          updateValue(newValues);
        } else {
          updateValue(newValue);
        }
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        setActiveHandle(null);
        if (range) {
          updateValue(normalizedValue, true);
        } else {
          updateValue(normalizedValue, true);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, range, getValueFromPosition, normalizedValue, updateValue, activeHandle]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isDraggingRef.current) return;

      const newValue = getValueFromPosition(e.clientX, e.clientY);

      if (range) {
        const [val1, val2] = normalizedValue as [number, number];
        const distances = [Math.abs(newValue - val1), Math.abs(newValue - val2)];
        const closestIndex = distances[0] < distances[1] ? 0 : 1;
        const newValues: [number, number] = [...normalizedValue] as [number, number];
        newValues[closestIndex] = newValue;
        newValues.sort((a, b) => a - b);
        updateValue(newValues, true);
      } else {
        updateValue(newValue, true);
      }
    },
    [disabled, range, getValueFromPosition, normalizedValue, updateValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, handleIndex?: number) => {
      if (disabled) return;

      const currentValue = range ? (normalizedValue as [number, number])[handleIndex ?? 0] : (normalizedValue as number);
      let newValue = currentValue;

      const stepValue = step ?? 1;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newValue = Math.min(max, currentValue + stepValue);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newValue = Math.max(min, currentValue - stepValue);
          break;
        case 'Home':
          e.preventDefault();
          newValue = min;
          break;
        case 'End':
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      if (range) {
        const newValues: [number, number] = [...normalizedValue] as [number, number];
        newValues[handleIndex ?? 0] = newValue;
        newValues.sort((a, b) => a - b);
        updateValue(newValues, true);
      } else {
        updateValue(newValue, true);
      }
    },
    [disabled, range, min, max, step, normalizedValue, updateValue]
  );

  const getPercentage = useCallback(
    (val: number) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const tooltipConfig = typeof tooltip === 'object' ? tooltip : tooltip ? {} : null;

  const renderTooltip = (val: number, index: number, handleElement: React.ReactElement) => {
    if (!tooltipConfig && tooltip === false) return handleElement;

    const formatter = tooltipConfig?.formatter || ((v) => String(v ?? ''));
    const content = formatter(val);

    if (tooltipConfig?.open === false) return handleElement;

    return (
      <Tooltip
        key={index}
        title={content}
        placement={tooltipConfig?.placement || (vertical ? 'right' : 'top')}
        open={tooltipConfig?.open !== undefined ? tooltipConfig.open : tooltipVisible[index] || activeHandle === index}
        getPopupContainer={tooltipConfig?.getPopupContainer}
      >
        {handleElement}
      </Tooltip>
    );
  };

  const renderMarks = () => {
    if (!marks) return null;

    return Object.keys(marks)
      .map(Number)
      .filter((mark) => mark >= min && mark <= max)
      .map((mark) => {
        const markConfig = marks[mark];
        const markContent = typeof markConfig === 'object' ? markConfig.label : markConfig;
        const markStyle = typeof markConfig === 'object' ? markConfig.style : undefined;
        const percentage = getPercentage(mark);

        return (
          <span
            key={mark}
            className={styles.mark}
            style={{
              [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage}%`,
              ...markStyle,
            }}
          >
            {markContent}
          </span>
        );
      });
  };

  const renderDots = () => {
    if (!dots || step === null || step === 0) return null;

    const dotCount = Math.floor((max - min) / step) + 1;
    return Array.from({ length: dotCount }).map((_, i) => {
      const dotValue = min + i * step!;
      const percentage = getPercentage(dotValue);

      return (
        <span
          key={i}
          className={styles.dot}
          style={{
            [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage}%`,
          }}
        />
      );
    });
  };

  const renderHandles = () => {
    if (range) {
      const [val1, val2] = normalizedValue as [number, number];
      const percentage1 = getPercentage(val1);
      const percentage2 = getPercentage(val2);

      return (
        <>
          {renderTooltip(val1, 0)}
          <div
            className={cn(styles.handle, activeHandle === 0 && styles.active)}
            style={{
              [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage1}%`,
              ...(Array.isArray(handleStyle) ? handleStyle[0] : handleStyle),
            }}
            onMouseDown={(e) => handleMouseDown(e, 0)}
            onMouseEnter={() => setTooltipVisible((prev) => ({ ...prev, 0: true }))}
            onMouseLeave={() => setTooltipVisible((prev) => ({ ...prev, 0: false }))}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val1}
            aria-disabled={disabled}
          />
          {renderTooltip(val2, 1)}
          <div
            className={cn(styles.handle, activeHandle === 1 && styles.active)}
            style={{
              [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage2}%`,
              ...(Array.isArray(handleStyle) ? handleStyle[1] : handleStyle),
            }}
            onMouseDown={(e) => handleMouseDown(e, 1)}
            onMouseEnter={() => setTooltipVisible((prev) => ({ ...prev, 1: true }))}
            onMouseLeave={() => setTooltipVisible((prev) => ({ ...prev, 1: false }))}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val2}
            aria-disabled={disabled}
          />
        </>
      );
    }

    const val = normalizedValue as number;
    const percentage = getPercentage(val);

    const handle = (
      <div
        className={cn(styles.handle, activeHandle === 0 && styles.active)}
        style={{
          [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage}%`,
          ...(typeof handleStyle === 'object' && !Array.isArray(handleStyle) ? handleStyle : {}),
        }}
        onMouseDown={(e) => handleMouseDown(e, 0)}
        onMouseEnter={() => setTooltipVisible((prev) => ({ ...prev, 0: true }))}
        onMouseLeave={() => setTooltipVisible((prev) => ({ ...prev, 0: false }))}
        onKeyDown={(e) => handleKeyDown(e, 0)}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-disabled={disabled}
      />
    );

    return renderTooltip(val, 0, handle);
  };

  const renderTrack = () => {
    if (range) {
      const [val1, val2] = normalizedValue as [number, number];
      const percentage1 = getPercentage(val1);
      const percentage2 = getPercentage(val2);

      if (!included) return null;

      const trackStyle1 = Array.isArray(trackStyle) ? trackStyle[0] : trackStyle;
      const trackStyle2 = Array.isArray(trackStyle) ? trackStyle[1] : trackStyle;

      return (
        <>
          <div
            className={styles.track}
            style={{
              [vertical ? 'bottom' : reverse ? 'right' : 'left']: `${percentage1}%`,
              [vertical ? 'height' : 'width']: `${percentage2 - percentage1}%`,
              ...trackStyle1,
            }}
          />
        </>
      );
    }

    const val = normalizedValue as number;
    const percentage = getPercentage(val);

    if (!included) return null;

    return (
      <div
        className={styles.track}
        style={{
          [vertical ? 'height' : 'width']: `${percentage}%`,
          ...(typeof trackStyle === 'object' && !Array.isArray(trackStyle) ? trackStyle : {}),
        }}
      />
    );
  };

  return (
    <div
      ref={sliderRef}
      className={cn(
        styles.slider,
        vertical && styles.vertical,
        disabled && styles.disabled,
        className
      )}
      style={{
        [vertical ? 'height' : 'width']: vertical ? '200px' : '100%',
        ...style,
      }}
      {...props}
    >
      <div
        className={styles.rail}
        style={railStyle}
        onClick={handleTrackClick}
      />
      {renderTrack()}
      {renderDots()}
      {renderMarks()}
      {renderHandles()}
    </div>
  );
}
