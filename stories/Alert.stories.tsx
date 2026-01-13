import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@/components/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: 'info',
    children: 'This is an alert message',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert variant="success" icon="✓">Success message</Alert>
      <Alert variant="danger" icon="✕">Danger message</Alert>
      <Alert variant="warning" icon="⚠">Warning message</Alert>
      <Alert variant="info" icon="ℹ">Info message</Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert variant="success" icon="✓">Operation completed successfully</Alert>
      <Alert variant="danger" icon="✕">An error occurred</Alert>
    </div>
  ),
};
