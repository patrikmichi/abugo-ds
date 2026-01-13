import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Timepicker } from '@/components/Timepicker';

const meta: Meta<typeof Timepicker> = {
  title: 'Components/Timepicker',
  component: Timepicker,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Timepicker>;

export const Default: Story = {
  args: {
    variant: 'value',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Timepicker variant="value">14:30</Timepicker>
      <Timepicker variant="placeholder">Select time...</Timepicker>
    </div>
  ),
};
