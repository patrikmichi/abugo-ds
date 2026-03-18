import type { ButtonIconProps } from './types';

export function ButtonIcon({ name, size = 24, className }: ButtonIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className || ''}`}
      style={{
        fontSize: size,
        width: '1em',
        height: '1em',
        display: 'block',
        lineHeight: 1,
        fontFamily: "'Material Symbols Outlined'",
        color: 'inherit',
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
