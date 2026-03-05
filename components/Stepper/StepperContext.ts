import { createContext, useContext } from 'react';

import type { StepperContextValue } from './types';

export const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('Step must be used within a Stepper component');
  }
  return context;
};
