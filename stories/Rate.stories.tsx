import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    allowHalf: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    count: {
      control: 'number',
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

export const AllowHalf: Story = {
  render: () => {
    const [value, setValue] = useState(2.5);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate value={value} onChange={setValue} allowHalf />
        <p style={{ fontSize: '14px' }}>Rating: {value}</p>
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

export const OnHoverChange: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate
          value={value}
          onChange={setValue}
          onHoverChange={setHoverValue}
        />
        <p style={{ fontSize: '14px' }}>Rating: {value}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Hover: {hoverValue || 'none'}</p>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState(2.5);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Rate
          value={value}
          onChange={setValue}
          allowHalf
          allowClear
          tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']}
        />
        <p style={{ fontSize: '14px' }}>Rating: {value}</p>
      </div>
    );
  },
};
