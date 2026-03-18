import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputOTP } from '@/components/InputOTP';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    length: {
      control: 'select',
      options: [4, 6, 8],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputOTP value={value} onChange={setValue} onComplete={(v) => console.log('Complete:', v)} />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const FourDigit: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputOTP length={4} value={value} onChange={setValue} />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const EightDigit: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputOTP length={8} value={value} onChange={setValue} />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState('');
    const [md, setMd] = useState('');
    const [lg, setLg] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>Small</p>
          <InputOTP length={6} size="sm" value={sm} onChange={setSm} />
        </div>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>Medium</p>
          <InputOTP length={6} size="md" value={md} onChange={setMd} />
        </div>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>Large</p>
          <InputOTP length={6} size="lg" value={lg} onChange={setLg} />
        </div>
      </div>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const [value, setValue] = useState('12');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputOTP length={4} value={value} onChange={setValue} error />
        <p style={{ fontSize: '14px', color: '#ff434e' }}>Invalid code</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <InputOTP length={6} value="123456" disabled />
  ),
};

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState('1234');
    return (
      <InputOTP length={4} value={value} onChange={setValue} />
    );
  },
};
