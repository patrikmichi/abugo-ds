/** Format a Date to time string based on format and 12-hour mode */
export const formatTime = (date: Date | null, format: string, use12Hours: boolean): string => {
  if (!date) return '';

  let hours = date.getHours();
  const minutes = date.getMinutes();
  let ampm = '';

  if (use12Hours) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const h = String(hours);

  return format
    .replace('HH', hh)
    .replace('H', h)
    .replace('hh', String(hours).padStart(2, '0'))
    .replace('h', String(hours))
    .replace('mm', mm)
    .replace('m', String(minutes))
    .replace('A', ampm)
    .replace('a', ampm.toLowerCase());
};

/** Get 5 visible items centered on selectedIdx with circular wrapping */
export function getVisibleItems<T>(options: T[], selectedIdx: number): (T | null)[] {
  const len = options.length;
  if (len === 0) return [null, null, null, null, null];
  const safeIdx = ((selectedIdx % len) + len) % len;
  return [-2, -1, 0, 1, 2].map(offset => {
    const idx = ((safeIdx + offset) % len + len) % len;
    return options[idx];
  });
}

/** Get AM/PM visible items (only 2 values, centered without circular wrapping) */
export function getAmPmVisibleItems(selected: 'AM' | 'PM'): (string | null)[] {
  if (selected === 'AM') return [null, null, 'AM', 'PM', null];
  return [null, 'AM', 'PM', null, null];
}
