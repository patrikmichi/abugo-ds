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

export function generateHourOptions(maxHours: number, hourStep: number): number[] {
  const options: number[] = [];
  for (let i = 0; i <= maxHours; i += hourStep) {
    options.push(i);
  }
  return options;
}

export function generateMinuteOptions(
  mode: 'hours-minutes' | 'minutes',
  minuteStep: number,
  maxMinutes: number
): number[] {
  if (mode === 'minutes') {
    const options: number[] = [];
    for (let i = 0; i <= maxMinutes; i += minuteStep) {
      options.push(i);
    }
    return options;
  }
  const options: number[] = [];
  for (let i = 0; i < 60; i += minuteStep) {
    options.push(i);
  }
  return options;
}
