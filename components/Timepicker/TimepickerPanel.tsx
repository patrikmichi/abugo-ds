import { cn } from '@/lib/utils';
import styles from './Timepicker.module.css';
import { getVisibleItems, getAmPmVisibleItems } from './utils';

interface TimepickerPanelProps {
  value: Date | null;
  use12Hours: boolean;
  hourOptions: number[];
  minuteOptions: number[];
  onHourSelect: (hour: number) => void;
  onMinuteSelect: (minute: number) => void;
  onAmPmChange: (newValue: Date) => void;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
}

const TimepickerPanel = ({
  value,
  use12Hours,
  hourOptions,
  minuteOptions,
  onHourSelect,
  onMinuteSelect,
  onAmPmChange,
  popupClassName,
  popupStyle,
}: TimepickerPanelProps) => {
  const currentHour = value?.getHours() || 0;
  const currentMinute = value?.getMinutes() || 0;

  const displayHour = use12Hours
    ? currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour
    : currentHour;

  const selectedHourIdx = hourOptions.indexOf(displayHour);
  const selectedMinuteIdx = minuteOptions.indexOf(currentMinute);

  const hourVisible = getVisibleItems(hourOptions, selectedHourIdx >= 0 ? selectedHourIdx : 0);
  const minuteVisible = getVisibleItems(minuteOptions, selectedMinuteIdx >= 0 ? selectedMinuteIdx : 0);

  const amPmSelected: 'AM' | 'PM' = currentHour >= 12 ? 'PM' : 'AM';
  const amPmVisible = use12Hours ? getAmPmVisibleItems(amPmSelected) : null;

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

  const toggleAmPm = () => {
    const now = value || new Date();
    const newDate = new Date(now);
    if (currentHour >= 12) {
      newDate.setHours(newDate.getHours() - 12);
    } else {
      newDate.setHours(newDate.getHours() + 12);
    }
    onAmPmChange(newDate);
  };

  const handleAmPmClick = (clicked: string) => {
    if (clicked === 'AM' && currentHour >= 12) {
      const newDate = new Date(value || new Date());
      newDate.setHours(newDate.getHours() - 12);
      onAmPmChange(newDate);
    } else if (clicked === 'PM' && currentHour < 12) {
      const newDate = new Date(value || new Date());
      newDate.setHours(newDate.getHours() + 12);
      onAmPmChange(newDate);
    }
  };

  const handleHourWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    stepHour(e.deltaY > 0 ? 1 : -1);
  };

  const handleMinuteWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    stepMinute(e.deltaY > 0 ? 1 : -1);
  };

  const handleAmPmWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    toggleAmPm();
  };

  return (
    <div
      className={cn(styles.panel, popupClassName)}
      style={popupStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.content}>
        {/* Hour column */}
        <div className={styles.column} onWheel={handleHourWheel}>
          <button type="button" className={styles.arrowCell} onClick={() => stepHour(-1)} aria-label="Previous hour">
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </button>
          {[0, 1, 2, 3, 4].map((rowIdx) => {
            const isCenter = rowIdx === 2;
            const isSubtle = rowIdx === 0 || rowIdx === 4;
            return hourVisible[rowIdx] != null ? (
              <div
                key={rowIdx}
                className={cn(
                  styles.cell,
                  isCenter && styles.cellSelected,
                  isSubtle && !isCenter && styles.cellSubtle,
                )}
                onClick={() => onHourSelect(hourVisible[rowIdx] as number)}
              >
                {String(hourVisible[rowIdx]).padStart(2, '0')}
              </div>
            ) : (
              <div key={rowIdx} className={styles.cell} style={{ visibility: 'hidden' }} />
            );
          })}
          <button type="button" className={styles.arrowCell} onClick={() => stepHour(1)} aria-label="Next hour">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </button>
        </div>

        {/* Minute column */}
        <div className={styles.column} onWheel={handleMinuteWheel}>
          <button type="button" className={styles.arrowCell} onClick={() => stepMinute(-1)} aria-label="Previous minute">
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </button>
          {[0, 1, 2, 3, 4].map((rowIdx) => {
            const isCenter = rowIdx === 2;
            const isSubtle = rowIdx === 0 || rowIdx === 4;
            return minuteVisible[rowIdx] != null ? (
              <div
                key={rowIdx}
                className={cn(
                  styles.cell,
                  isCenter && styles.cellSelected,
                  isSubtle && !isCenter && styles.cellSubtle,
                )}
                onClick={() => onMinuteSelect(minuteVisible[rowIdx] as number)}
              >
                {String(minuteVisible[rowIdx]).padStart(2, '0')}
              </div>
            ) : (
              <div key={rowIdx} className={styles.cell} style={{ visibility: 'hidden' }} />
            );
          })}
          <button type="button" className={styles.arrowCell} onClick={() => stepMinute(1)} aria-label="Next minute">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </button>
        </div>

        {/* AM/PM column */}
        {use12Hours && (
          <div className={styles.column} onWheel={handleAmPmWheel}>
            <button type="button" className={styles.arrowCell} onClick={toggleAmPm} aria-label="Toggle AM/PM">
              <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
            {[0, 1, 2, 3, 4].map((rowIdx) => {
              const isCenter = rowIdx === 2;
              const isSubtle = rowIdx === 0 || rowIdx === 4;
              return amPmVisible![rowIdx] != null ? (
                <div
                  key={rowIdx}
                  className={cn(
                    styles.cell,
                    amPmVisible![rowIdx] === amPmSelected && isCenter && styles.cellSelected,
                    isSubtle && styles.cellSubtle,
                  )}
                  onClick={() => handleAmPmClick(amPmVisible![rowIdx]!)}
                >
                  {amPmVisible![rowIdx]}
                </div>
              ) : (
                <div key={rowIdx} className={styles.cell} style={{ visibility: 'hidden' }} />
              );
            })}
            <button type="button" className={styles.arrowCell} onClick={toggleAmPm} aria-label="Toggle AM/PM">
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimepickerPanel;
