import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rate } from '@/components/Rate';

const meta: Meta<typeof Rate> = {
  title: 'Components/Rate',
  component: Rate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    allowClear: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    count: {
      control: 'number',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rate>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} />
        <p style={{ fontSize: '14px' }}>Rating: {value}</p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setValue(0)}>Clear</button>
          <button onClick={() => setValue(5)}>Max</button>
          <span>Value: {value}</span>
        </div>
      </div>
    );
  },
};

export const AllowClear: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} allowClear />
        <p style={{ fontSize: '14px' }}>
          Rating: {value} (click the same star again to clear)
        </p>
      </div>
    );
  },
};

export const NoClear: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} allowClear={false} />
        <p style={{ fontSize: '14px' }}>Rating: {value} (cannot clear)</p>
      </div>
    );
  },
};

export const CustomCount: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} count={10} />
        <p style={{ fontSize: '14px' }}>Rating: {value} / 10</p>
      </div>
    );
  },
};

export const WithTooltips: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate
          value={value}
          onChange={setValue}
          tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']}
        />
        <p style={{ fontSize: '14px' }}>Rating: {value} (hover to see tooltips)</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate defaultValue={3} disabled />
        <p style={{ fontSize: '14px', color: '#666' }}>Disabled rating</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [smValue, setSmValue] = useState(3);
    const [mdValue, setMdValue] = useState(3);
    const [lgValue, setLgValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Small (24px)</p>
          <Rate value={smValue} onChange={setSmValue} size="sm" />
        </div>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Medium (32px)</p>
          <Rate value={mdValue} onChange={setMdValue} size="md" />
        </div>
        <div>
          <p style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Large (40px)</p>
          <Rate value={lgValue} onChange={setLgValue} size="lg" />
        </div>
      </div>
    );
  },
};
