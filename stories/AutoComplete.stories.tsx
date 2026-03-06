import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AutoComplete } from '@/components/AutoComplete';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';

const meta: Meta<typeof AutoComplete> = {
  title: 'Components/AutoComplete',
  component: AutoComplete,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

const simpleOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
];

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'China', value: 'cn' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
          placeholder="Type to search..."
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Selected: {value || 'None'}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('apple');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" appearance="plain" size="sm" onClick={() => setValue('banana')}>Set Banana</Button>
          <Button variant="secondary" appearance="plain" size="sm" onClick={() => setValue('')}>Clear</Button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
          Value: {value || 'empty'}
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
          <AutoComplete size="sm" value={value} onChange={setValue} options={simpleOptions} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle (Default)</p>
          <AutoComplete size="md" value={value} onChange={setValue} options={simpleOptions} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
          <AutoComplete size="lg" value={value} onChange={setValue} options={simpleOptions} />
        </div>
      </div>
    );
  },
};

export const WithDataSource: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          dataSource={['Option 1', 'Option 2', 'Option 3']}
          placeholder="Type to search..."
        />
      </div>
    );
  },
};

export const WithCustomFilter: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
          filterOption={(inputValue, option) => {
            // Only show options that start with the input
            return option.value.toLowerCase().startsWith(inputValue.toLowerCase());
          }}
          placeholder="Type to search (starts with)..."
        />
      </div>
    );
  },
};

export const NoFilter: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
          filterOption={false}
          placeholder="All options shown..."
        />
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={[
            { label: 'Enabled Option 1', value: 'option1' },
            { label: 'Disabled Option', value: 'option2', disabled: true },
            { label: 'Enabled Option 2', value: 'option3' },
          ]}
          placeholder="Type to search..."
        />
      </div>
    );
  },
};

export const WithAllowClear: Story = {
  render: () => {
    const [value, setValue] = useState('apple');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
          allowClear
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          defaultValue="apple"
          options={simpleOptions}
          disabled
        />
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Select Country" required>
          <AutoComplete
            value={value}
            onChange={setValue}
            options={countryOptions}
            error={!value}
            placeholder="Type to search countries..."
          />
        </Field>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <AutoComplete
          value={value}
          onChange={setValue}
          options={simpleOptions}
          filterOption={true}
          allowClear
          placeholder="Type to search..."
        />
      </div>
    );
  },
};

