import { useRef, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

import styles from './AvatarUpload.module.css';
import type { IProps } from './types';

const DefaultIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
    image
  </span>
);

const CameraIcon = () => (
  <span className="material-symbols-outlined">photo_camera</span>
);

const AvatarUpload = ({
  src,
  alt,
  size = 'lg',
  shape = 'rounded',
  ring,
  icon,
  children,
  accept = 'image/*',
  disabled = false,
  onChange,
  onError,
  maxSize,
  uploadIcon,
  className,
  ...props
}: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxSize && file.size > maxSize) {
      onError?.(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
      e.target.value = '';
      return;
    }

    onChange?.(file);
    e.target.value = '';
  }, [onChange, onError, maxSize]);

  const showDefaultIcon = !src && !children;
  const avatarIcon = icon || (showDefaultIcon ? <DefaultIcon /> : undefined);

  return (
    <div className={cn(styles.root, disabled && styles.disabled, className)} {...props}>
      <Avatar
        src={src}
        alt={alt}
        size={size}
        shape={shape}
        ring={ring}
        icon={avatarIcon}
        className={styles.avatar}
      >
        {children}
      </Avatar>

      <button
        type="button"
        className={styles.uploadButton}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Upload avatar"
      >
        {uploadIcon || <CameraIcon />}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.input}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
};

export default AvatarUpload;
