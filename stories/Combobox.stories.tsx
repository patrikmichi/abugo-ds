import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@/components/Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: {
    variant: 'value',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Combobox variant="value">Selected value</Combobox>
      <Combobox variant="placeholder">Placeholder text</Combobox>
    </div>
  ),
};
