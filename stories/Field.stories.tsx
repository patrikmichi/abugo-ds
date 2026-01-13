import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@/components/Field';
import { Input } from '@/components/Input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    variant: 'width',
  },
};

export const WithInput: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Field variant="width">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
        <Input placeholder="Enter email" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Field variant="error">
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ff434e' }}>Email *</label>
        <Input placeholder="Enter email" status="error" />
        <span style={{ display: 'block', marginTop: '0.5rem', color: '#ff434e', fontSize: '0.875rem' }}>This field is required</span>
      </Field>
    </div>
  ),
};
