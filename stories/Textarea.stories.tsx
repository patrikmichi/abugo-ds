import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@/components/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: ['enabled', 'error', 'disabled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    rows: 4,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Textarea size="sm" placeholder="Small textarea" rows={3} />
      <Textarea size="md" placeholder="Medium textarea" rows={4} />
      <Textarea size="lg" placeholder="Large textarea" rows={5} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Textarea placeholder="Enabled" status="enabled" rows={4} />
      <Textarea placeholder="Error state" status="error" rows={4} />
      <Textarea placeholder="Disabled" status="disabled" rows={4} />
    </div>
  ),
};
