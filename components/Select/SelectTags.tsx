import Chip from '@/components/Chip/Chip';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';
import type { SelectTagsProps } from './types';

const SelectTags = ({
  selectedOptions,
  maxTagCount,
  disabled,
  onTagRemove,
}: SelectTagsProps) => {
  if (maxTagCount && selectedOptions.length > maxTagCount) {
    return (
      <span className={cn(styles.selectValue, styles.multipleValue)}>
        {selectedOptions.slice(0, maxTagCount).map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            size="small"
            onDelete={!disabled ? (e) => onTagRemove(e, option.value) : undefined}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
          />
        ))}
        <span className={styles.tagCount}>+{selectedOptions.length - maxTagCount}</span>
      </span>
    );
  }

  return (
    <span className={cn(styles.selectValue, styles.multipleValue)}>
      {selectedOptions.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          size="small"
          onDelete={!disabled ? (e) => onTagRemove(e, option.value) : undefined}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
        />
      ))}
    </span>
  );
};

export { SelectTags };
