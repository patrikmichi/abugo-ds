import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    range: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    vertical: {
      control: 'boolean',
    },
    reverse: {
      control: 'boolean',
    },
    dots: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value}</p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} min={0} max={100} />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setValue(0)}>Min</button>
          <span>Value: {value}</span>
          <button onClick={() => setValue(100)}>Max</button>
        </div>
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider range value={value} onChange={setValue} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Range: [{value[0]}, {value[1]}]
        </p>
      </div>
    );
  },
};

export const WithMarks: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider
          value={value}
          onChange={setValue}
          marks={{
            0: '0°C',
            26: '26°C',
            37: '37°C',
            100: {
              style: { color: '#f50' },
              label: <strong>100°C</strong>,
            },
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value}</p>
      </div>
    );
  },
};

export const WithStep: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} step={10} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value} (step: 10)</p>
      </div>
    );
  },
};

export const WithDots: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} step={10} dots />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value}</p>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem', height: '300px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px' }}>Vertical</p>
          <Slider vertical value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px' }}>Value: {value}</p>
        </div>
      </div>
    );
  },
};

export const Reverse: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} reverse />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value} (reversed)</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider defaultValue={30} disabled />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>Disabled slider</p>
      </div>
    );
  },
};

export const CustomTooltip: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider
          value={value}
          onChange={setValue}
          tooltip={{
            formatter: (val) => `${val}%`,
            placement: 'bottom',
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value}%</p>
      </div>
    );
  },
};

export const NoTooltip: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} tooltip={false} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value} (no tooltip)</p>
      </div>
    );
  },
};

export const CustomMinMax: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} min={-100} max={100} step={10} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value} (range: -100 to 100)</p>
      </div>
    );
  },
};

export const RangeWithMarks: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 60]);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider
          range
          value={value}
          onChange={setValue}
          marks={{
            0: '0',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Range: [{value[0]}, {value[1]}]
        </p>
      </div>
    );
  },
};

export const NotIncluded: Story = {
  render: () => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider value={value} onChange={setValue} included={false} marks={{ 0: '0', 50: '50', 100: '100' }} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Value: {value} (track not included)</p>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div style={{ maxWidth: '600px', padding: '2rem' }}>
        <Slider
          range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={5}
          dots
          marks={{
            0: '0',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }}
          tooltip={{
            formatter: (val) => `${val}%`,
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Range: [{value[0]}%, {value[1]}%]
        </p>
      </div>
    );
  },
};

