import React, { forwardRef } from 'react';
import { Button } from './Button';
import type { BaseButtonProps } from './types';

export const PrimaryButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="primary" appearance="filled" {...props} />
);
PrimaryButton.displayName = 'PrimaryButton';

export const PrimaryOutlineButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="primary" appearance="outline" {...props} />
);
PrimaryOutlineButton.displayName = 'PrimaryOutlineButton';

export const PrimaryPlainButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="primary" appearance="plain" {...props} />
);
PrimaryPlainButton.displayName = 'PrimaryPlainButton';

export const SecondaryButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="secondary" appearance="filled" {...props} />
);
SecondaryButton.displayName = 'SecondaryButton';

export const SecondaryOutlineButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="secondary" appearance="outline" {...props} />
);
SecondaryOutlineButton.displayName = 'SecondaryOutlineButton';

export const SecondaryPlainButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="secondary" appearance="plain" {...props} />
);
SecondaryPlainButton.displayName = 'SecondaryPlainButton';

export const DangerButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="danger" appearance="filled" {...props} />
);
DangerButton.displayName = 'DangerButton';

export const DangerOutlineButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="danger" appearance="outline" {...props} />
);
DangerOutlineButton.displayName = 'DangerOutlineButton';

export const DangerPlainButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="danger" appearance="plain" {...props} />
);
DangerPlainButton.displayName = 'DangerPlainButton';

export const UpgradeButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => <Button ref={ref} variant="upgrade" appearance="filled" {...props} />
);
UpgradeButton.displayName = 'UpgradeButton';
