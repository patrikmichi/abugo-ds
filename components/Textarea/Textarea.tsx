import { cn } from '@/lib/utils';
import styles from './Textarea.module.css';
import type { TextareaProps } from './types';

const Textarea = ({
  size = 'md',
  error = false,
  disabled,
  className,
  ...props
}: TextareaProps) => (
  <div className={styles.textareaWrapper}>
    <textarea
      className={cn(
        styles.textarea,
        styles[size],
        error && styles.error,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      {...props}
    />
  </div>
);

export default Textarea;
