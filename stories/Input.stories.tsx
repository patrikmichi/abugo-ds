import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
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
      description: 'Whether the field has a validation error',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input placeholder="Enabled (default)" />
      <Input placeholder="Error state" error />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Error and disabled" error disabled />
    </div>
  ),
};

export const Prefix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        placeholder="Search..." 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            search
          </span>
        }
      />
      <Input 
        placeholder="Email" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            email
          </span>
        }
      />
      <Input 
        placeholder="Phone" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            phone
          </span>
        }
      />
      <Input 
        placeholder="Amount" 
        prefix={
          <span style={{ fontSize: '14px', fontWeight: 500 }}>$</span>
        }
      />
    </div>
  ),
};

export const Suffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        placeholder="Password" 
        type="password"
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit', cursor: 'pointer' }}>
            visibility
          </span>
        }
      />
      <Input 
        placeholder="Clearable" 
        defaultValue="Some text"
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit', cursor: 'pointer' }}>
            close
          </span>
        }
      />
      <Input 
        placeholder="With validation" 
        error
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--token-component-field-content-error)' }}>
            error
          </span>
        }
      />
      <Input 
        placeholder="Success" 
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--token-semantic-content-passive-success-default)' }}>
            check_circle
          </span>
        }
      />
    </div>
  ),
};

export const PrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        placeholder="Search with clear" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            search
          </span>
        }
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit', cursor: 'pointer' }}>
            close
          </span>
        }
      />
      <Input 
        placeholder="Email with validation" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            email
          </span>
        }
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--token-component-field-content-error)' }}>
            error
          </span>
        }
        error
      />
      <Input 
        placeholder="Amount" 
        prefix={
          <span style={{ fontSize: '14px', fontWeight: 500 }}>$</span>
        }
        suffix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            info
          </span>
        }
      />
    </div>
  ),
};

export const PrefixSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        size="sm"
        placeholder="Small with icon" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'inherit' }}>
            search
          </span>
        }
      />
      <Input 
        size="md"
        placeholder="Medium with icon" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            search
          </span>
        }
      />
      <Input 
        size="lg"
        placeholder="Large with icon" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'inherit' }}>
            search
          </span>
        }
      />
    </div>
  ),
};

export const Addons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        placeholder="mysite" 
        addonBefore="http://"
        addonAfter=".com"
      />
      <Input 
        placeholder="Amount" 
        addonBefore="$"
        defaultValue="100"
      />
      <Input 
        placeholder="Search" 
        addonAfter={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', cursor: 'pointer' }}>
            search
          </span>
        }
      />
      <Input 
        placeholder="Username" 
        addonBefore="@"
      />
    </div>
  ),
};

export const OnPressEnter: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input 
        placeholder="Press Enter to submit" 
        onPressEnter={(e) => {
          alert('Enter pressed!');
          console.log('Enter key pressed', e);
        }}
      />
      <Input 
        placeholder="Search and press Enter" 
        prefix={
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>
            search
          </span>
        }
        onPressEnter={(e) => {
          const value = (e.target as HTMLInputElement).value;
          alert(`Searching for: ${value}`);
        }}
      />
    </div>
  ),
};

