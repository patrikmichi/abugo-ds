import type { SliderValue, SliderMarks } from './types';

export const normalizeValue = (
  value: SliderValue,
  range: boolean,
  min: number,
  max: number
): SliderValue => {
  if (range) {
    const [val1, val2] = Array.isArray(value) ? value : [min, max];
    return [
      Math.max(min, Math.min(max, val1)),
      Math.max(min, Math.min(max, val2)),
    ].sort((a, b) => a - b) as [number, number];
  }
  return Math.max(min, Math.min(max, typeof value === 'number' ? value : min));
};

export const getValueFromPosition = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number,
  vertical: boolean,
  _reverse: boolean
): number => {
  const percentage = vertical
    ? (rect.bottom - clientY) / rect.height
    : (clientX - rect.left) / rect.width;

  let newValue = min + percentage * (max - min);

  if (step > 0) {
    newValue = Math.round(newValue / step) * step;
  }

  return Math.max(min, Math.min(max, newValue));
};

export const getPercentage = (val: number, min: number, max: number): number => {
  return ((val - min) / (max - min)) * 100;
};

export const getClosestHandleIndex = (
  newValue: number,
  values: [number, number]
): number => {
  const distances = [Math.abs(newValue - values[0]), Math.abs(newValue - values[1])];
  return distances[0] < distances[1] ? 0 : 1;
};

export const generateDots = (min: number, max: number, step: number): number[] => {
  if (step === 0) return [];
  const dots: number[] = [];
  for (let i = min; i <= max; i += step) {
    dots.push(i);
  }
  return dots;
};

export const getMarksInRange = (
  marks: SliderMarks | undefined,
  min: number,
  max: number
): number[] => {
  if (!marks) return [];
  return Object.keys(marks)
    .map(Number)
    .filter((mark) => mark >= min && mark <= max);
};
