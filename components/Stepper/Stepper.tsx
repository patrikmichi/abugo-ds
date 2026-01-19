import React, { useContext, createContext, useMemo } from 'react';
import styles from './Stepper.module.css';
import { cn } from '@/lib/utils';

export type StepperDirection = 'horizontal' | 'vertical';
export type StepperSize = 'default' | 'small';
export type StepperStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepperContextValue {
  current?: number;
  direction: StepperDirection;
  size: StepperSize;
  status?: StepperStatus;
  progressDot?: boolean | ((iconDot: React.ReactNode, { index, status, title, description }: { index: number; status: StepperStatus; title?: React.ReactNode; description?: React.ReactNode }) => React.ReactNode);
  onChange?: (current: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current step (0-based) */
  current?: number;
  /** Direction */
  direction?: StepperDirection;
  /** Size */
  size?: StepperSize;
  /** Status of current step */
  status?: StepperStatus;
  /** Progress dot style */
  progressDot?: boolean | ((iconDot: React.ReactNode, { index, status, title, description }: { index: number; status: StepperStatus; title?: React.ReactNode; description?: React.ReactNode }) => React.ReactNode);
  /** Callback when step changes */
  onChange?: (current: number) => void;
  /** Custom class name */
  className?: string;
  /** Children (Step components) */
  children?: React.ReactNode;
}

/**
 * Stepper Component (Steps)
 * 
 * Steps component for displaying progress through a sequence.
 * 
 * @example
 * ```tsx
 * <Stepper current={1}>
 *   <Stepper.Step title="Step 1" description="Description 1" />
 *   <Stepper.Step title="Step 2" description="Description 2" />
 *   <Stepper.Step title="Step 3" description="Description 3" />
 * </Stepper>
 * ```
 */
export function Stepper({
  current = 0,
  direction = 'horizontal',
  size = 'default',
  status = 'process',
  progressDot = false,
  onChange,
  className,
  children,
  ...props
}: StepperProps) {
  const contextValue: StepperContextValue = {
    current,
    direction,
    size,
    status,
    progressDot,
    onChange,
  };

  // Count steps
  const stepCount = useMemo(() => {
    return React.Children.count(children);
  }, [children]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={cn(
          styles.stepper,
          direction === 'horizontal' && styles.horizontal,
          direction === 'vertical' && styles.vertical,
          size === 'small' && styles.small,
          progressDot && styles.progressDot,
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              index,
              stepCount,
            } as any);
          }
          return child;
        })}
      </div>
    </StepperContext.Provider>
  );
}

export interface StepperStepProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title */
  title?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Icon */
  icon?: React.ReactNode;
  /** Status */
  status?: StepperStatus;
  /** Disabled */
  disabled?: boolean;
  /** Internal: step index */
  index?: number;
  /** Internal: total step count */
  stepCount?: number;
}

/**
 * Stepper.Step Component
 * 
 * Individual step component.
 */
export function StepperStep({
  title,
  description,
  icon,
  status: propStatus,
  disabled = false,
  className,
  index = 0,
  stepCount = 0,
  ...props
}: StepperStepProps) {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('Stepper.Step must be used within Stepper');
  }

  const { current = 0, direction, size, status: contextStatus, progressDot, onChange } = context;

  // Determine step status
  const stepStatus = useMemo<StepperStatus>(() => {
    if (propStatus) return propStatus;
    if (index < current) return 'finish';
    if (index === current) return contextStatus || 'process';
    return 'wait';
  }, [propStatus, index, current, contextStatus]);

  const isLast = index === stepCount - 1;
  const isClickable = !disabled && onChange;

  const handleClick = () => {
    if (isClickable) {
      onChange?.(index);
    }
  };

  const renderIcon = () => {
    if (progressDot) {
      if (typeof progressDot === 'function') {
        return progressDot(
          <div className={cn(styles.dot, stepStatus === 'finish' && styles.dotFinish, stepStatus === 'error' && styles.dotError)} />,
          { index, status: stepStatus, title, description }
        );
      }
      return (
        <div className={cn(styles.dot, stepStatus === 'finish' && styles.dotFinish, stepStatus === 'error' && styles.dotError)} />
      );
    }

    if (icon) {
      return <div className={styles.icon}>{icon}</div>;
    }

    if (stepStatus === 'finish') {
      return (
        <div className={styles.icon}>
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
            check
          </span>
        </div>
      );
    }

    if (stepStatus === 'error') {
      return (
        <div className={styles.icon}>
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-1)' }}>
            close
          </span>
        </div>
      );
    }

    return <div className={styles.icon}>{index + 1}</div>;
  };

  return (
    <div
      className={cn(
        styles.step,
        direction === 'horizontal' && styles.stepHorizontal,
        direction === 'vertical' && styles.stepVertical,
        stepStatus === 'wait' && styles.stepWait,
        stepStatus === 'process' && styles.stepProcess,
        stepStatus === 'finish' && styles.stepFinish,
        stepStatus === 'error' && styles.stepError,
        isClickable && styles.stepClickable,
        disabled && styles.stepDisabled,
        isLast && styles.stepLast,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className={styles.stepContent}>
        <div className={styles.stepIconWrapper}>
          {renderIcon()}
          {!isLast && (
            <div
              className={cn(
                styles.tail,
                direction === 'horizontal' && styles.tailHorizontal,
                direction === 'vertical' && styles.tailVertical,
                stepStatus === 'finish' && styles.tailFinish
              )}
            />
          )}
        </div>
        <div className={styles.stepText}>
          {title && <div className={styles.stepTitle}>{title}</div>}
          {description && <div className={styles.stepDescription}>{description}</div>}
        </div>
      </div>
    </div>
  );
}

// Attach Step to Stepper
(Stepper as any).Step = StepperStep;
