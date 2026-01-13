import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Datepicker } from '@/components/Datepicker';

const meta: Meta<typeof Datepicker> = {
  title: 'Components/Datepicker',
  component: Datepicker,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datepicker>;

export const Default: Story = {
  args: {
    variant: 'value',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Datepicker variant="value">2024-01-15</Datepicker>
      <Datepicker variant="placeholder">Select date...</Datepicker>
    </div>
  ),
};
