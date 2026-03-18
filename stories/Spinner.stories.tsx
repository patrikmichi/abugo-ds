import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@/components/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
    appearance: {
      control: 'select',
      options: ['inherit', 'invert'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    label: 'Loading content',
    size: 'medium',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Spinner size="xsmall" label="Extra Small" />
      <Spinner size="small" label="Small" />
      <Spinner size="medium" label="Medium" />
      <Spinner size="large" label="Large" />
      <Spinner size="xlarge" label="Extra Large" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    label: '',
    size: 'medium',
  },
};

export const CustomSize: Story = {
  args: {
    size: 64,
    label: 'Custom Size',
  },
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div>
        <p style={{ marginBottom: '1rem', fontSize: '14px' }}>Inherit (default)</p>
        <Spinner appearance="inherit" label="Loading" />
      </div>
      <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '8px' }}>
        <p style={{ marginBottom: '1rem', fontSize: '14px', color: '#fff' }}>Invert (dark bg)</p>
        <Spinner appearance="invert" label="Loading" />
      </div>
    </div>
  ),
};

export const WithDelay: Story = {
  args: {
    delay: 500,
    label: 'Appears after 500ms',
  },
};
