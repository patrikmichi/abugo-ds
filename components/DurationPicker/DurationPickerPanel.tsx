import styles from './DurationPicker.module.css';
import { cn } from '@/lib/utils';
import { getVisibleItems } from './utils';
import type { DurationPickerPanelProps } from './types';

export function DurationPickerPanel({
  mode,
  hours,
  minutes,
  hourOptions,
  minuteOptions,
  onHourSelect,
  onMinuteSelect,
  popupClassName,
  popupStyle,
}: DurationPickerPanelProps) {
  const selectedHourIdx = hourOptions.indexOf(hours);
  const selectedMinuteIdx = minuteOptions.indexOf(minutes);

  const hourVisible = getVisibleItems(hourOptions, selectedHourIdx >= 0 ? selectedHourIdx : 0);
  const minuteVisible = getVisibleItems(minuteOptions, selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0);

  const stepHour = (direction: 1 | -1) => {
    const idx = selectedHourIdx >= 0 ? selectedHourIdx : 0;
    const newIdx = ((idx + direction) % hourOptions.length + hourOptions.length) % hourOptions.length;
    onHourSelect(hourOptions[newIdx]);
  };

  const stepMinute = (direction: 1 | -1) => {
    const idx = selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0;
    const newIdx = ((idx + direction) % minuteOptions.length + minuteOptions.length) % minuteOptions.length;
    onMinuteSelect(minuteOptions[newIdx]);
  };

  return (
    <div
      className={cn(styles.panel, popupClassName)}
      style={popupStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.content}>
        {/* Up arrows */}
        <div className={styles.arrowRow}>
          {mode === 'hours-minutes' && (
            <button type="button" className={styles.arrowCell} onClick={() => stepHour(-1)} aria-label="Decrease hours">
              <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
          )}
          <button type="button" className={styles.arrowCell} onClick={() => stepMinute(-1)} aria-label="Decrease minutes">
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </button>
        </div>

        {/* 5 value rows */}
        {[0, 1, 2, 3, 4].map((rowIdx) => {
          const isCenter = rowIdx === 2;
          const isSubtle = rowIdx === 0 || rowIdx === 4;

          return (
            <div key={rowIdx} className={styles.row}>
              {/* Hour cell */}
              {mode === 'hours-minutes' && (
                hourVisible[rowIdx] != null ? (
                  <div
                    className={cn(
                      styles.cell,
                      isCenter && styles.cellSelected,
                      isSubtle && !isCenter && styles.cellSubtle,
                    )}
                    onClick={() => onHourSelect(hourVisible[rowIdx] as number)}
                  >
                    {hourVisible[rowIdx]} h
                  </div>
                ) : (
                  <div className={styles.cell} style={{ visibility: 'hidden' }} />
                )
              )}

              {/* Minute cell */}
              {minuteVisible[rowIdx] != null ? (
                <div
                  className={cn(
                    styles.cell,
                    isCenter && styles.cellSelected,
                    isSubtle && !isCenter && styles.cellSubtle,
                  )}
                  onClick={() => onMinuteSelect(minuteVisible[rowIdx] as number)}
                >
                  {minuteVisible[rowIdx]} min
                </div>
              ) : (
                <div className={styles.cell} style={{ visibility: 'hidden' }} />
              )}
            </div>
          );
        })}

        {/* Down arrows */}
        <div className={styles.arrowRow}>
          {mode === 'hours-minutes' && (
            <button type="button" className={styles.arrowCell} onClick={() => stepHour(1)} aria-label="Increase hours">
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          )}
          <button type="button" className={styles.arrowCell} onClick={() => stepMinute(1)} aria-label="Increase minutes">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </button>
        </div>
      </div>
    </div>
  );
}
