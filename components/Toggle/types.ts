import type { HTMLAttributes, ReactNode, CSSProperties, MouseEvent } from 'react';

export type ToggleSize = 'default' | 'small';

export interface IProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  /** Automatically focus the component when it mounts */
  autoFocus?: boolean;
  /** Whether the Switch is checked (controlled) */
  checked?: boolean;
  /** Content to be shown when checked */
  checkedChildren?: ReactNode;
  /** Initial checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Disable the Switch */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** The size of the Switch */
  size?: ToggleSize;
  /** Content to be shown when unchecked */
  unCheckedChildren?: ReactNode;
  /** Callback when checked state changes */
  onChange?: (checked: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /** Callback when Switch is clicked */
  onClick?: (checked: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /** Custom style */
  style?: CSSProperties;
}
