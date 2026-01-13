import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    style: { width: '200px', height: '20px' },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Skeleton variant="text" style={{ width: '200px', height: '20px' }} />
        <Skeleton variant="text" style={{ width: '150px', height: '20px' }} />
        <Skeleton variant="text" style={{ width: '100px', height: '20px' }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Skeleton variant="circular" />
        <Skeleton variant="circular" style={{ width: '48px', height: '48px' }} />
        <Skeleton variant="circular" style={{ width: '64px', height: '64px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Skeleton variant="rectangular" style={{ width: '100%', height: '100px' }} />
        <Skeleton variant="rectangular" style={{ width: '100%', height: '60px' }} />
      </div>
    </div>
  ),
};
