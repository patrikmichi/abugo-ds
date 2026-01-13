import React from 'react';
import { Button, type ButtonProps } from './Button';

/**
 * Convenience wrapper components for common button patterns.
 * These provide a simpler API for the most common use cases.
 * 
 * For full flexibility, use the base Button component with variant and type props.
 */

type BaseButtonProps = Omit<ButtonProps, 'variant' | 'type'>;

/**
 * Primary button - filled style (most common primary action)
 * 
 * @example
 * ```tsx
 * <PrimaryButton>Save</PrimaryButton>
 * ```
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="primary" type="filled" {...props} />;
  }
);
PrimaryButton.displayName = 'PrimaryButton';

/**
 * Primary button - plain style (subtle primary action)
 * 
 * @example
 * ```tsx
 * <PrimaryPlainButton>Cancel</PrimaryPlainButton>
 * ```
 */
export const PrimaryPlainButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="primary" type="plain" {...props} />;
  }
);
PrimaryPlainButton.displayName = 'PrimaryPlainButton';

/**
 * Secondary button - outline style (most common secondary action)
 * 
 * @example
 * ```tsx
 * <SecondaryButton>Cancel</SecondaryButton>
 * ```
 */
export const SecondaryButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="secondary" type="outline" {...props} />;
  }
);
SecondaryButton.displayName = 'SecondaryButton';

/**
 * Secondary button - plain style (subtle secondary action)
 * 
 * @example
 * ```tsx
 * <SecondaryPlainButton>Skip</SecondaryPlainButton>
 * ```
 */
export const SecondaryPlainButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="secondary" type="plain" {...props} />;
  }
);
SecondaryPlainButton.displayName = 'SecondaryPlainButton';

/**
 * Tertiary button - outline style
 * 
 * @example
 * ```tsx
 * <TertiaryButton>Learn More</TertiaryButton>
 * ```
 */
export const TertiaryButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="tertiary" type="outline" {...props} />;
  }
);
TertiaryButton.displayName = 'TertiaryButton';

/**
 * Danger button - filled style (most common destructive action)
 * 
 * @example
 * ```tsx
 * <DangerButton>Delete</DangerButton>
 * ```
 */
export const DangerButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="danger" type="filled" {...props} />;
  }
);
DangerButton.displayName = 'DangerButton';

/**
 * Danger button - plain style (subtle destructive action)
 * 
 * @example
 * ```tsx
 * <DangerPlainButton>Remove</DangerPlainButton>
 * ```
 */
export const DangerPlainButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="danger" type="plain" {...props} />;
  }
);
DangerPlainButton.displayName = 'DangerPlainButton';

/**
 * Upgrade button - filled style (premium CTA)
 * 
 * @example
 * ```tsx
 * <UpgradeButton>Upgrade Now</UpgradeButton>
 * ```
 */
export const UpgradeButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="upgrade" type="filled" {...props} />;
  }
);
UpgradeButton.displayName = 'UpgradeButton';
