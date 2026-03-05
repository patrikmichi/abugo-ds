export type ProgressVariant = 'default' | 'success' | 'error';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  className?: string;
}
