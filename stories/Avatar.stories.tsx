import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@/components/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    children: 'JD',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar variant="default">AB</Avatar>
      <Avatar variant="background">CD</Avatar>
      <Avatar variant="content">EF</Avatar>
      <Avatar variant="border">GH</Avatar>
    </div>
  ),
};
