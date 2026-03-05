import type { ReactNode } from 'react';
import { useState, useRef, useMemo } from 'react';

import { cn } from '@/lib/utils';

import SliderHandle from './SliderHandle';
import styles from './Slider.module.css';
import type { IProps, SliderValue, SliderTooltipProps } from './types';
import {
  normalizeValue,
  getValueFromPosition,
  getPercentage,
  getClosestHandleIndex,
  generateDots,
  getMarksInRange,
} from './utils';

const Slider = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onChangeComplete,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  vertical = false,
  dots = false,
  marks,
  tooltip = true,
  className,
  ...props
}: IProps) => {
  const [internalValue, setInternalValue] = useState<SliderValue>(() => {
    if (range) return Array.isArray(defaultValue) ? defaultValue : [min, max];
    return typeof defaultValue === 'number' ? defaultValue : min;
  });
  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<Record<number, boolean>>({});
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const normalized = useMemo(() => normalizeValue(value, range, min, max), [value, range, min, max]);
  const tooltipConfig: SliderTooltipProps | null = typeof tooltip === 'object' ? tooltip : tooltip ? {} : null;

  const updateValue = (newValue: SliderValue, isComplete = false) => {
    if (!isControlled) setInternalValue(newValue);
    (isComplete ? onChangeComplete : onChange)?.(newValue);
  };

  const getPercent = (val: number) => getPercentage(val, min, max);

  const handleMouseDown = (e: React.MouseEvent, handleIndex?: number) => {
    if (disabled || !sliderRef.current) return;
    e.preventDefault();
    isDraggingRef.current = true;

    const rect = sliderRef.current.getBoundingClientRect();
    const newValue = getValueFromPosition(e.clientX, e.clientY, rect, min, max, step, vertical, false);

    let currentHandle = handleIndex ?? 0;
    if (range) {
      const values = normalized as [number, number];
      currentHandle = getClosestHandleIndex(newValue, values);
      const newValues: [number, number] = [...values];
      newValues[currentHandle] = newValue;
      newValues.sort((a, b) => a - b);
      updateValue(newValues);
    } else {
      updateValue(newValue);
    }
    setActiveHandle(currentHandle);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const moveValue = getValueFromPosition(e.clientX, e.clientY, rect, min, max, step, vertical, false);

      if (range) {
        const newValues: [number, number] = [...(normalized as [number, number])];
        newValues[currentHandle] = moveValue;
        newValues.sort((a, b) => a - b);
        updateValue(newValues);
      } else {
        updateValue(moveValue);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setActiveHandle(null);
      updateValue(normalized, true);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent, handleIndex: number) => {
    if (disabled) return;
    const currentValue = range ? (normalized as [number, number])[handleIndex] : (normalized as number);
    let newValue = currentValue;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, currentValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(min, currentValue - step);
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
      const newValues: [number, number] = [...(normalized as [number, number])];
      newValues[handleIndex] = newValue;
      newValues.sort((a, b) => a - b);
      updateValue(newValues, true);
    } else {
      updateValue(newValue, true);
    }
  };

  const renderTrack = () => {
    if (range) {
      const [val1, val2] = normalized as [number, number];
      return (
        <div
          className={styles.track}
          style={{
            [vertical ? 'bottom' : 'left']: `${getPercent(val1)}%`,
            [vertical ? 'height' : 'width']: `${getPercent(val2) - getPercent(val1)}%`,
          }}
        />
      );
    }

    return (
      <div
        className={styles.track}
        style={{ [vertical ? 'height' : 'width']: `${getPercent(normalized as number)}%` }}
      />
    );
  };

  const handleProps = {
    min,
    max,
    disabled,
    vertical,
    tooltipConfig,
    onMouseDown: handleMouseDown,
    onKeyDown: handleKeyDown,
    onTooltipVisibleChange: (i: number, v: boolean) => setTooltipVisible((p) => ({ ...p, [i]: v })),
    getPercentage: getPercent,
  };

  return (
    <div
      ref={sliderRef}
      className={cn(styles.slider, vertical && styles.vertical, disabled && styles.disabled, className)}
      {...props}
    >
      <div className={styles.rail} onClick={(e) => !isDraggingRef.current && handleMouseDown(e)} />
      {renderTrack()}
      {dots &&
        generateDots(min, max, step).map((dotValue) => (
          <span
            key={dotValue}
            className={styles.dot}
            style={{ [vertical ? 'bottom' : 'left']: `${getPercent(dotValue)}%` }}
          />
        ))}
      {marks &&
        getMarksInRange(marks, min, max).map((mark) => {
          const cfg = marks[mark];
          const label = cfg && typeof cfg === 'object' && 'label' in cfg ? cfg.label : cfg;
          const markStyle = cfg && typeof cfg === 'object' && 'style' in cfg ? cfg.style : undefined;
          return (
            <span
              key={mark}
              className={styles.mark}
              style={{ [vertical ? 'bottom' : 'left']: `${getPercent(mark)}%`, ...markStyle }}
            >
              {label as ReactNode}
            </span>
          );
        })}
      {range ? (
        <>
          <SliderHandle
            {...handleProps}
            value={(normalized as [number, number])[0]}
            index={0}
            isActive={activeHandle === 0}
            tooltipVisible={tooltipVisible[0]}
          />
          <SliderHandle
            {...handleProps}
            value={(normalized as [number, number])[1]}
            index={1}
            isActive={activeHandle === 1}
            tooltipVisible={tooltipVisible[1]}
          />
        </>
      ) : (
        <SliderHandle
          {...handleProps}
          value={normalized as number}
          index={0}
          isActive={activeHandle === 0}
          tooltipVisible={tooltipVisible[0]}
        />
      )}
    </div>
  );
};

export default Slider;
