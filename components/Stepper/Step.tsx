import { useMemo } from 'react';

import { cn } from '@/lib/utils';

import styles from './Stepper.module.css';
import { useStepperContext } from './StepperContext';
import type { StepProps, StepperStatus } from './types';

const Step = ({
  title,
  subTitle,
  description,
  icon,
  status: propStatus,
  disabled = false,
  className,
  style,
  stepIndex = 0,
  stepCount = 0,
  onClick,
  ...props
}: StepProps) => {
  const { current, direction, status: contextStatus, progressDot, onChange } = useStepperContext();

  const stepStatus = useMemo<StepperStatus>(() => {
    if (propStatus) return propStatus;
    if (stepIndex < current) return 'finish';
    if (stepIndex === current) return contextStatus;
    return 'wait';
  }, [propStatus, stepIndex, current, contextStatus]);

  const isLast = stepIndex === stepCount - 1;
  const isClickable = !disabled && (onChange || onClick);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    if (!onClick && onChange) {
      onChange(stepIndex);
    }
  };

  const renderIcon = () => {
    const dotElement = (
      <span
        className={cn(
          styles.dot,
          stepStatus === 'finish' && styles.dotFinish,
          stepStatus === 'process' && styles.dotProcess,
          stepStatus === 'error' && styles.dotError
        )}
      />
    );

    if (progressDot) {
      if (typeof progressDot === 'function') {
        return progressDot(dotElement, {
          index: stepIndex,
          status: stepStatus,
          title,
          description,
        });
      }
      return dotElement;
    }

    if (icon) {
      return <span className={styles.customIcon}>{icon}</span>;
    }

    if (stepStatus === 'finish') {
      return (
        <span className={styles.iconInner}>
          <span className="material-symbols-outlined">check</span>
        </span>
      );
    }

    if (stepStatus === 'error') {
      return (
        <span className={styles.iconInner}>
          <span className="material-symbols-outlined">close</span>
        </span>
      );
    }

    return <span className={styles.iconInner}>{stepIndex + 1}</span>;
  };

  return (
    <div
      className={cn(
        styles.step,
        styles[`step${stepStatus.charAt(0).toUpperCase()}${stepStatus.slice(1)}`],
        isClickable && styles.stepClickable,
        disabled && styles.stepDisabled,
        isLast && styles.stepLast,
        className
      )}
      style={style}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      <div className={styles.stepTail} />
      <div className={styles.stepIcon}>{renderIcon()}</div>
      <div className={styles.stepContent}>
        {title && (
          <div className={styles.stepTitle}>
            {title}
            {subTitle && <span className={styles.stepSubTitle}>{subTitle}</span>}
          </div>
        )}
        {description && <div className={styles.stepDescription}>{description}</div>}
      </div>
    </div>
  );
};

export default Step;
