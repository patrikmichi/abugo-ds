import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '@/components/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    variant: 'info',
    children: 'Toast message',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <Toast variant="info" icon="ℹ">Info toast message</Toast>
      <Toast variant="danger" icon="✕" onClose={() => {}}>Danger toast message</Toast>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <Toast variant="info" onClose={() => alert('Close clicked')}>Toast with close button</Toast>
      <Toast variant="danger" onClose={() => alert('Close clicked')}>Danger toast with close</Toast>
    </div>
  ),
};
