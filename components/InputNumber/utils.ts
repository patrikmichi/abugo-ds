export function formatValue(
  val: number | null,
  precision?: number,
  formatter?: (value: number) => string
): string {
  if (val === null) return '';

  let numValue = val;
  if (precision !== undefined) {
    numValue = parseFloat(numValue.toFixed(precision));
  }

  if (formatter) {
    return formatter(numValue);
  }

  return numValue.toString();
}

export function parseValue(
  str: string,
  parser?: (value: string) => number
): number | null {
  if (!str || str.trim() === '') return null;

  if (parser) {
    const result = parser(str);
    return isNaN(result) ? null : result;
  }

  const cleaned = str.replace(/[^\d.-]/g, '');
  if (!cleaned) return null;

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function clampValue(
  val: number | null,
  min: number,
  max: number,
  precision?: number
): number | null {
  if (val === null) return null;

  let clamped = Math.min(Math.max(val, min), max);

  if (precision !== undefined) {
    clamped = parseFloat(clamped.toFixed(precision));
  }

  return clamped;
}
