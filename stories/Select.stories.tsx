import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/Select/Select';
import { Field } from '@/components/Field';
import { TokenDisplay } from './TokenDisplay';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    tokens: {
      componentName: 'Select',
      show: true,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has a validation error',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    mode: {
      control: 'select',
      options: ['default', 'multiple', 'tags'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
];

export const CheckboxVariant: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['1']);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          mode="multiple"
          showCheckbox
          value={value}
          onChange={(val) => setValue(val as string[])}
          options={options}
          placeholder="Select with checkboxes..."
        />
      </div>
    );
  },
};

export const Default: Story = {
  render: () => (
    <>
      <Select
        placeholder="Choose an option..."
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
      />
      <TokenDisplay componentName="Select" />
    </>
  ),
};

export const WithOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          value={value}
          onChange={(val) => setValue(val as string)}
          options={options}
          placeholder="Select an option..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Selected: {value || 'None'}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select
        size="sm"
        placeholder="Small"
        options={[{ value: '1', label: 'Option 1' }]}
      />
      <Select
        size="md"
        placeholder="Medium"
        options={[{ value: '1', label: 'Option 1' }]}
      />
      <Select
        size="lg"
        placeholder="Large"
        options={[{ value: '1', label: 'Option 1' }]}
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select
        placeholder="Enabled (default)"
        options={[{ value: '1', label: 'Option 1' }]}
      />
      <Select
        error
        placeholder="Error state"
        options={[{ value: '1', label: 'Option 1' }]}
      />
      <Select
        disabled
        placeholder="Disabled"
        options={[{ value: '1', label: 'Option 1' }]}
      />
      <Select
        loading
        placeholder="Loading..."
        options={[{ value: '1', label: 'Option 1' }]}
      />
    </div>
  ),
};

export const AllowClear: Story = {
  render: () => {
    const [value, setValue] = useState<string>('1');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          value={value}
          onChange={(val) => setValue(val as string)}
          allowClear
          options={options}
          placeholder="Select with clear..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Selected: {value || 'None'}</p>
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          mode="multiple"
          value={value}
          onChange={(val) => setValue(Array.isArray(val) ? val : [])}
          options={options}
          placeholder="Select multiple..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Selected: {value.length > 0 ? value.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const MultipleWithMaxTagCount: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['1', '2', '3', '4', '5']);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          mode="multiple"
          value={value}
          onChange={(val) => setValue(Array.isArray(val) ? val : [])}
          options={options}
          maxTagCount={2}
          placeholder="Select multiple..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Selected: {value.length} items
        </p>
      </div>
    );
  },
};

export const Tags: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          mode="tags"
          value={value}
          onChange={(val) => setValue(Array.isArray(val) ? val : [])}
          options={options}
          placeholder="Type to create tags..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Tags: {value.length > 0 ? value.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          value={value}
          onChange={(val) => setValue(val as string)}
          showSearch
          options={[
            { value: '1', label: 'Apple' },
            { value: '2', label: 'Banana' },
            { value: '3', label: 'Cherry' },
            { value: '4', label: 'Date' },
            { value: '5', label: 'Elderberry' },
          ]}
          placeholder="Search options..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Selected: {value || 'None'}</p>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ maxWidth: '500px' }}>
        <Field label="Country" helperText="Select your country">
          <Select
            value={value}
            onChange={(val) => setValue(val as string)}
            options={[
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'ca', label: 'Canada' },
              { value: 'au', label: 'Australia' },
            ]}
            placeholder="Choose country..."
          />
        </Field>
        <Field label="Multiple Selection" required error={value === '' ? 'Please select at least one' : undefined}>
          <Select
            mode="multiple"
            value={[]}
            onChange={() => { }}
            options={options}
            placeholder="Select multiple..."
          />
        </Field>
      </div>
    );
  },
};



export const ScrollableDropdown: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const scrollableOptions = Array.from({ length: 10 }, (_, i) => ({
      value: `${i + 1}`,
      label: `Option ${i + 1}`,
    }));
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          value={value}
          onChange={(val) => setValue(val as string)}
          options={scrollableOptions}
          placeholder="Select an option (10 options - scrollable)..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Selected: {value || 'None'}</p>
        <p style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
          Dropdown shows 6 options, then scrolls (10 total options)
        </p>
      </div>
    );
  },
};

export const LargeDataset: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const largeOptions = Array.from({ length: 100 }, (_, i) => ({
      value: `${i + 1}`,
      label: `Option ${i + 1}`,
    }));
    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          value={value}
          onChange={(val) => setValue(val as string)}
          showSearch
          options={largeOptions}
          placeholder="Search from 100 options..."
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Selected: {value || 'None'}</p>
      </div>
    );
  },
};
