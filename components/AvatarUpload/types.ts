import type { HTMLAttributes, ReactNode, ChangeEvent } from 'react';
import type { AvatarSize, AvatarShape } from '@/components/Avatar';

export interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'onError'> {
  /** Current image source URL */
  src?: string;
  /** Alternative text for the image */
  alt?: string;
  /** Size of avatar */
  size?: AvatarSize;
  /** Shape of avatar */
  shape?: AvatarShape;
  /** Show accent color ring */
  ring?: boolean;
  /** Icon for avatar fallback */
  icon?: ReactNode;
  /** Text/initials for avatar fallback */
  children?: ReactNode;
  /** Accepted file types */
  accept?: string;
  /** Whether upload is disabled */
  disabled?: boolean;
  /** Callback when file is selected */
  onChange?: (file: File) => void;
  /** Callback when file fails validation */
  onError?: (error: string) => void;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Custom upload button icon */
  uploadIcon?: ReactNode;
}
