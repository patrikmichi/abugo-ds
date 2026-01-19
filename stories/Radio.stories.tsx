import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@/components/Radio';
import { Field } from '@/components/Field';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Radio value="option1" checked={value === 'option1'} onChange={() => setValue('option1')}>
          Option 1
        </Radio>
        <Radio value="option2" checked={value === 'option2'} onChange={() => setValue('option2')}>
          Option 2
        </Radio>
        <Radio value="option3" checked={value === 'option3'} onChange={() => setValue('option3')}>
          Option 3
        </Radio>
        <p style={{ fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

export const RadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
        </Radio.Group>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

export const WithOptions: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Radio.Group
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={['Option 1', 'Option 2', 'Option 3']}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

export const OptionsWithLabels: Story = {
  render: () => {
    const [value, setValue] = useState('apple');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Radio.Group
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
            { label: 'Orange', value: 'orange', disabled: true },
            { label: 'Grape', value: 'grape' },
          ]}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
        <Radio.Group defaultValue="option1" size="small">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
        </Radio.Group>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle (Default)</p>
        <Radio.Group defaultValue="option1" size="middle">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
        </Radio.Group>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
        <Radio.Group defaultValue="option1" size="large">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
        </Radio.Group>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Individual Disabled</p>
        <Radio.Group defaultValue="option1">
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2" disabled>
            Option 2 (Disabled)
          </Radio>
          <Radio value="option3">Option 3</Radio>
        </Radio.Group>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Group Disabled</p>
        <Radio.Group defaultValue="option1" disabled>
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
        </Radio.Group>
      </div>
    </div>
  ),
};

export const RadioButton: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Radio.Group value={value} onChange={(e) => setValue(e.target.value)} buttonStyle="outline">
          <Radio.Button value="option1">Option 1</Radio.Button>
          <Radio.Button value="option2">Option 2</Radio.Button>
          <Radio.Button value="option3">Option 3</Radio.Button>
        </Radio.Group>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

export const ButtonStyles: Story = {
  render: () => {
    const [value1, setValue1] = useState('option1');
    const [value2, setValue2] = useState('option1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Outline Style</p>
          <Radio.Group value={value1} onChange={(e) => setValue1(e.target.value)} buttonStyle="outline">
            <Radio.Button value="option1">Option 1</Radio.Button>
            <Radio.Button value="option2">Option 2</Radio.Button>
            <Radio.Button value="option3">Option 3</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Solid Style</p>
          <Radio.Group value={value2} onChange={(e) => setValue2(e.target.value)} buttonStyle="solid">
            <Radio.Button value="option1">Option 1</Radio.Button>
            <Radio.Button value="option2">Option 2</Radio.Button>
            <Radio.Button value="option3">Option 3</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  },
};

export const ButtonSizes: Story = {
  render: () => {
    const [value1, setValue1] = useState('option1');
    const [value2, setValue2] = useState('option1');
    const [value3, setValue3] = useState('option1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
          <Radio.Group value={value1} onChange={(e) => setValue1(e.target.value)} size="small" buttonStyle="outline">
            <Radio.Button value="option1">Small</Radio.Button>
            <Radio.Button value="option2">Button</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle</p>
          <Radio.Group value={value2} onChange={(e) => setValue2(e.target.value)} size="middle" buttonStyle="outline">
            <Radio.Button value="option1">Middle</Radio.Button>
            <Radio.Button value="option2">Button</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
          <Radio.Group value={value3} onChange={(e) => setValue3(e.target.value)} size="large" buttonStyle="outline">
            <Radio.Button value="option1">Large</Radio.Button>
            <Radio.Button value="option2">Button</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Select Option" required>
          <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </Radio.Group>
        </Field>
      </div>
    );
  },
};

export const AutoFocus: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Radio.Group defaultValue="option2">
        <Radio value="option1">Option 1</Radio>
        <Radio value="option2" autoFocus>
          Option 2 (Auto Focus)
        </Radio>
        <Radio value="option3">Option 3</Radio>
      </Radio.Group>
    </div>
  ),
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState('option2');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Radio.Group
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="middle"
          name="example"
        >
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3" disabled>
            Option 3 (Disabled)
          </Radio>
        </Radio.Group>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    );
  },
};

