import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Segmented } from '@/components/Segmented';
import { Button } from '@/components/Button';

const meta: Meta<typeof Segmented> = {
  title: 'Components/Segmented',
  component: Segmented,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    block: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Segmented>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    defaultValue: 'Option 1',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('Option 1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Segmented
          options={['Option 1', 'Option 2', 'Option 3']}
          value={value}
          onChange={setValue}
        />
        <p>Selected: {value}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
        <Segmented options={['Small 1', 'Small 2', 'Small 3']} size="small" defaultValue="Small 1" />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Default</p>
        <Segmented options={['Default 1', 'Default 2', 'Default 3']} size="default" defaultValue="Default 1" />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
        <Segmented options={['Large 1', 'Large 2', 'Large 3']} size="large" defaultValue="Large 1" />
      </div>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Segmented
        options={['Option 1', 'Option 2', 'Option 3']}
        defaultValue="Option 1"
        block
      />
      <Segmented
        options={['Short', 'Medium Length', 'Very Long Option Name']}
        defaultValue="Short"
        block
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Segmented
        options={[
          {
            label: 'List',
            value: 'list',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                list
              </span>
            ),
          },
          {
            label: 'Grid',
            value: 'grid',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                grid_view
              </span>
            ),
          },
          {
            label: 'Map',
            value: 'map',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                map
              </span>
            ),
          },
        ]}
        defaultValue="list"
      />
      <Segmented
        options={[
          {
            label: 'Day',
            value: 'day',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                wb_sunny
              </span>
            ),
          },
          {
            label: 'Week',
            value: 'week',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                calendar_view_week
              </span>
            ),
          },
          {
            label: 'Month',
            value: 'month',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                calendar_view_month
              </span>
            ),
          },
        ]}
        defaultValue="day"
      />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Segmented
        options={[
          {
            label: '',
            value: 'list',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                list
              </span>
            ),
          },
          {
            label: '',
            value: 'grid',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                grid_view
              </span>
            ),
          },
          {
            label: '',
            value: 'map',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                map
              </span>
            ),
          },
        ]}
        defaultValue="list"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>All Disabled</p>
        <Segmented
          options={['Option 1', 'Option 2', 'Option 3']}
          defaultValue="Option 1"
          disabled
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Individual Disabled</p>
        <Segmented
          options={[
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2', disabled: true },
            { label: 'Option 3', value: 'opt3' },
          ]}
          defaultValue="opt1"
        />
      </div>
    </div>
  ),
};

export const WithNumbers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Segmented
        options={[1, 2, 3, 4, 5]}
        defaultValue={1}
      />
    </div>
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Segmented
        options={['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6']}
        defaultValue="Option 1"
        block
      />
    </div>
  ),
};


export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Basic</h3>
        <Segmented options={['Option 1', 'Option 2', 'Option 3']} defaultValue="Option 1" />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>With Icons</h3>
        <Segmented
          options={[
            { label: 'List', value: 'list', icon: <span>📋</span> },
            { label: 'Grid', value: 'grid', icon: <span>⊞</span> },
            { label: 'Map', value: 'map', icon: <span>🗺️</span> },
          ]}
          defaultValue="list"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Block</h3>
        <Segmented
          options={['Option 1', 'Option 2', 'Option 3']}
          defaultValue="Option 1"
          block
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Disabled</h3>
        <Segmented
          options={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled', disabled: true },
            { label: 'Enabled 2', value: 'enabled2' },
          ]}
          defaultValue="enabled"
        />
      </div>
    </div>
  ),
};
