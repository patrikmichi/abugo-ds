import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@/components/Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return <Chip selected={selected} onClick={() => setSelected(!selected)}>Chip</Chip>;
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Chip>Unselected</Chip>
      <Chip selected>Selected</Chip>
      <Chip disabled>Disabled</Chip>
      <Chip selected disabled>Selected Disabled</Chip>
    </div>
  ),
};
