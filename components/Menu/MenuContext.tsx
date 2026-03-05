import { createContext } from 'react';
import type { MenuContextValue } from './types';

export const MenuContext = createContext<MenuContextValue | null>(null);
