import { createContext } from 'react';

import type { RadioGroupContextType } from './types';

export const RadioGroupContext = createContext<RadioGroupContextType | null>(null);
