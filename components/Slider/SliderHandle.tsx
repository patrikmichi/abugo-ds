import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/Tooltip';

import styles from './Slider.module.css';
import type { IHandleProps } from './types';

const SliderHandle = ({
  value,
  index,
  min,
  max,
  disabled,
  vertical,
  isActive,
  tooltipConfig,
  tooltipVisible,
  onMouseDown,
  onKeyDown,
  onTooltipVisibleChange,
  getPercentage,
}: IHandleProps) => {
  const percentage = getPercentage(value);
  const positionProp = vertical ? 'bottom' : 'left';

  const formatter = tooltipConfig?.formatter || ((v) => String(v ?? ''));
  const content = formatter(value);
  const placement = tooltipConfig?.placement || (vertical ? 'right' : 'top');
  const isTooltipOpen = tooltipConfig?.open !== undefined
    ? tooltipConfig.open
    : tooltipVisible || isActive;

  const handle = (
    <div
      className={cn(styles.handle, isActive && styles.active)}
      style={{ [positionProp]: `${percentage}%` }}
      onMouseDown={(e) => onMouseDown(e, index)}
      onMouseEnter={() => onTooltipVisibleChange(index, true)}
      onMouseLeave={() => onTooltipVisibleChange(index, false)}
      onKeyDown={(e) => onKeyDown(e, index)}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled}
    />
  );

  if (!tooltipConfig || tooltipConfig.open === false) return handle;

  return (
    <Tooltip title={content} placement={placement} open={isTooltipOpen}>
      {handle}
    </Tooltip>
  );
};

export default SliderHandle;
