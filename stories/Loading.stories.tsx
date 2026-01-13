import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from '@/components/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Spinner: Story = {
  args: {
    variant: 'spinner',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Loading variant="spinner" />
      <Loading variant="content">Loading content...</Loading>
    </div>
  ),
};
