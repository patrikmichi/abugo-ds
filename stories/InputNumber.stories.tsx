import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber } from '@/components/InputNumber';
import { Field } from '@/components/Field';

const meta: Meta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
      description: 'Set validation status',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    min: {
      control: 'number',
      description: 'The minimum value',
    },
    max: {
      control: 'number',
      description: 'The maximum value',
    },
    step: {
      control: 'number',
      description: 'The step value',
    },
    precision: {
      control: 'number',
      description: 'The precision of input value',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  args: {
    placeholder: 'Enter number...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InputNumber size="sm" placeholder="Small" />
      <InputNumber size="md" placeholder="Medium" />
      <InputNumber size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(10);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          min={0}
          max={100}
          value={value}
          onChange={setValue}
          placeholder="0-100"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const WithStep: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          step={0.1}
          precision={2}
          value={value}
          onChange={setValue}
          placeholder="Step 0.1"
        />
        <InputNumber
          step={5}
          value={value}
          onChange={setValue}
          placeholder="Step 5"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const WithFormatter: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(1000);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          value={value}
          onChange={setValue}
          formatter={(val) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(str) => str.replace(/\$\s?|(,*)/g, '')}
          placeholder="Currency"
        />
        <InputNumber
          value={value}
          onChange={setValue}
          formatter={(val) => `${val}%`}
          parser={(str) => str.replace('%', '')}
          placeholder="Percentage"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value}</p>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InputNumber placeholder="Enabled (default)" />
      <InputNumber placeholder="Error state" error />
      <InputNumber placeholder="Disabled" disabled />
      <InputNumber placeholder="ReadOnly" readOnly value={42} />
    </div>
  ),
};

export const WithControls: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InputNumber controls step={1} placeholder="With controls" />
      <InputNumber controls={false} placeholder="Without controls" />
      <InputNumber
        controls={{
          upIcon: <span style={{ fontSize: '12px' }}>▲</span>,
          downIcon: <span style={{ fontSize: '12px' }}>▼</span>,
        }}
        step={1}
        placeholder="Custom icons"
      />
    </div>
  ),
};

export const WithPrefixSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InputNumber
        prefix={<span style={{ fontSize: '14px', fontWeight: 500 }}>$</span>}
        placeholder="Currency"
      />
      <InputNumber
        suffix={<span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span>}
        placeholder="Weight"
      />
      <InputNumber
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            attach_money
          </span>
        }
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            info
          </span>
        }
        placeholder="With icons"
      />
    </div>
  ),
};

export const HighPrecision: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>('0.123456789');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          stringMode
          precision={9}
          value={value}
          onChange={setValue}
          placeholder="High precision"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Value: {value} (string mode)</p>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <Field label="Amount" helperText="Enter amount in dollars">
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            value={value}
            onChange={setValue}
            formatter={(val) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(str) => str.replace(/\$\s?|(,*)/g, '')}
            placeholder="0.00"
          />
        </Field>
        <Field label="Quantity" required error={value === null ? 'Quantity is required' : undefined}>
          <InputNumber
            min={1}
            max={100}
            step={1}
            value={value}
            onChange={setValue}
            placeholder="1-100"
          />
        </Field>
      </div>
    );
  },
};

export const KeyboardControls: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(10);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          keyboard
          step={1}
          value={value}
          onChange={setValue}
          placeholder="Use arrow keys"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>
          Value: {value} - Use ↑↓ arrow keys to change value
        </p>
      </div>
    );
  },
};

export const WheelControl: Story = {
  render: () => {
    const [value, setValue] = useState<number | string | null>(10);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InputNumber
          changeOnWheel
          step={1}
          value={value}
          onChange={setValue}
          placeholder="Scroll to change"
        />
        <p style={{ fontSize: '14px', color: '#666' }}>
          Value: {value} - Scroll while focused to change value
        </p>
      </div>
    );
  },
};
