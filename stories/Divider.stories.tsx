import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@/components/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <p>Content above</p>
        <Divider variant="horizontal" />
        <p>Content below</p>
      </div>
      <div style={{ display: 'flex', height: '100px', gap: '1rem' }}>
        <p>Left</p>
        <Divider variant="vertical" />
        <p>Right</p>
      </div>
    </div>
  ),
};
