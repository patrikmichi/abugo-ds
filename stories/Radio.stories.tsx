import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@/components/Radio';
import { Field } from '@/components/Field';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
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

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Default States</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Radio value="unselected" checked={false} onChange={() => {}}>
            Unselected
          </Radio>
          <Radio value="selected" checked={true} onChange={() => {}}>
            Selected
          </Radio>
        </div>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Disabled States</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Radio value="disabled-unselected" checked={false} disabled onChange={() => {}}>
            Disabled Unselected
          </Radio>
          <Radio value="disabled-selected" checked={true} disabled onChange={() => {}}>
            Disabled Selected
          </Radio>
        </div>
      </div>
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

