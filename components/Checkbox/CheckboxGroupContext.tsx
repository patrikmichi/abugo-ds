import { createContext } from 'react';
import type { CheckboxGroupContextValue } from './types';

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
