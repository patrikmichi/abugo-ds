import type React from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The size of the textarea */
  size?: TextareaSize;
  /** Set validation status. When used with Field wrapper, Field manages this automatically. */
  error?: boolean;
  /** Whether the textarea is disabled */
  disabled?: boolean;
}
