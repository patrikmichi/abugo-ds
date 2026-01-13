import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
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
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <option value="">Choose an option...</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select size="sm">
        <option value="">Small</option>
        <option value="1">Option 1</option>
      </Select>
      <Select size="md">
        <option value="">Medium</option>
        <option value="1">Option 1</option>
      </Select>
      <Select size="lg">
        <option value="">Large</option>
        <option value="1">Option 1</option>
      </Select>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select status="enabled">
        <option value="">Enabled</option>
        <option value="1">Option 1</option>
      </Select>
      <Select status="error">
        <option value="">Error state</option>
        <option value="1">Option 1</option>
      </Select>
      <Select status="disabled">
        <option value="">Disabled</option>
        <option value="1">Option 1</option>
      </Select>
    </div>
  ),
};
