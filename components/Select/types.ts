import type React from 'react';

export type SelectMode = 'default' | 'multiple' | 'tags';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  groupLabel?: string;
}

export interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Current value (controlled) */
  value?: string | string[];
  /** Default value (uncontrolled) */
  defaultValue?: string | string[];
  /** Callback when value changes */
  onChange?: (value: string | string[]) => void;
  /** Options array */
  options?: SelectOption[];
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Mode */
  mode?: SelectMode;
  /** Show search */
  showSearch?: boolean;
  /** Allow clear */
  allowClear?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Max tag count for multiple mode */
  maxTagCount?: number;
  /** Get popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Custom class name for dropdown */
  dropdownClassName?: string;
  /** Custom style for dropdown */
  dropdownStyle?: React.CSSProperties;
  /** Whether dropdown matches trigger width */
  matchTriggerWidth?: boolean;
  /** Whether to show checkbox in dropdown options */
  showCheckbox?: boolean;
  /** Empty content (no results) */
  emptyContent?: React.ReactNode;
}

export interface SelectDropdownProps {
  /** Whether dropdown is open */
  isOpen: boolean;
  /** Options to display */
  options: SelectOption[];
  /** Current value */
  value?: string | string[];
  /** Callback when option is clicked */
  onChange?: (value: string | string[]) => void;
  /** Callback when option is selected */
  onSelect?: (value: string, option: SelectOption) => void;
  /** Callback when dropdown closes */
  onClose?: () => void;
  /** Active index (controlled from parent) */
  activeIndex?: number;
  /** Callback when active index changes (from mouse hover) */
  onActiveIndexChange?: (index: number) => void;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Show search */
  showSearch?: boolean;
  /** Empty content (no results) */
  emptyContent?: React.ReactNode;
  /** Trigger ref for click-outside detection */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Whether dropdown matches trigger width (handled by CSS now) */
  matchTriggerWidth?: boolean;
  /** Custom class name */
  dropdownClassName?: string;
  /** Custom style */
  dropdownStyle?: React.CSSProperties;
  /** Get popup container (no longer used - kept for API compat) */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** Whether to show checkboxes in options */
  showCheckbox?: boolean;
}

export interface SelectDropdownRef {
  scrollTo: (index: number) => void;
}

export interface SelectOptionProps {
  option: SelectOption;
  isSelected: boolean;
  isActive: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCheckbox?: boolean;
  onClick: (option: SelectOption) => void;
  onMouseEnter: () => void;
}

export interface SelectTagsProps {
  selectedOptions: SelectOption[];
  maxTagCount?: number;
  disabled?: boolean;
  onTagRemove: (e: React.MouseEvent, tagValue: string) => void;
}
