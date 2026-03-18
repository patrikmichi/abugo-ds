import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

import styles from './Stepper.module.css';
import { StepperContext } from './StepperContext';
import Step from './Step';
import type { StepperProps, StepperContextValue, StepItem } from './types';

const Stepper = ({
  current = 0,
  initial = 0,
  direction = 'horizontal',
  size = 'default',
  status = 'process',
  labelPlacement = 'horizontal',
  progressDot = false,
  items,
  onChange,
  className,
  children,
  ...props
}: StepperProps) => {
  const actualCurrent = current ?? initial;

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      current: actualCurrent,
      direction,
      size,
      status,
      labelPlacement,
      progressDot,
      onChange,
    }),
    [actualCurrent, direction, size, status, labelPlacement, progressDot, onChange]
  );

  const renderSteps = () => {
    if (items && items.length > 0) {
      return items.map((item: StepItem, index: number) => (
        <Step
          key={index}
          stepIndex={index}
          stepCount={items.length}
          title={item.title}
          subTitle={item.subTitle}
          description={item.description}
          icon={item.icon}
          status={item.status}
          disabled={item.disabled}
          className={item.className}
          style={item.style}
          onClick={item.onClick}
        />
      ));
    }

    const childArray = React.Children.toArray(children);
    const stepCount = childArray.length;

    return React.Children.map(children, (child, index) => {
      if (React.isValidElement<{ stepIndex?: number; stepCount?: number }>(child)) {
        return React.cloneElement(child, {
          stepIndex: index,
          stepCount,
        });
      }
      return child;
    });
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={cn(
          styles.stepper,
          styles[direction],
          size === 'small' && styles.small,
          labelPlacement === 'vertical' && styles.labelVertical,
          progressDot && styles.progressDot,
          className
        )}
        {...props}
      >
        {renderSteps()}
      </div>
    </StepperContext.Provider>
  );
};

Stepper.Step = Step;

export default Stepper;
