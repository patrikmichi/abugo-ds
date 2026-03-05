import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'card'],
    },
    centered: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const defaultItems = [
  { key: '1', label: 'Tab 1', children: <div>Content for Tab 1</div> },
  { key: '2', label: 'Tab 2', children: <div>Content for Tab 2</div> },
  { key: '3', label: 'Tab 3', children: <div>Content for Tab 3</div> },
];

export const Default: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return <Tabs activeKey={activeKey} onChange={setActiveKey} items={defaultItems} />;
  },
};

export const Card: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return <Tabs activeKey={activeKey} onChange={setActiveKey} type="card" items={defaultItems} />;
  },
};

export const Centered: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return <Tabs activeKey={activeKey} onChange={setActiveKey} centered items={defaultItems} />;
  },
};

export const WithIcons: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: '1',
            label: 'Home',
            icon: <span className="material-symbols-outlined">home</span>,
            children: <div>Home content</div>,
          },
          {
            key: '2',
            label: 'Settings',
            icon: <span className="material-symbols-outlined">settings</span>,
            children: <div>Settings content</div>,
          },
          {
            key: '3',
            label: 'Profile',
            icon: <span className="material-symbols-outlined">person</span>,
            children: <div>Profile content</div>,
          },
        ]}
      />
    );
  },
};

export const WithDisabled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: '1', label: 'Enabled Tab', children: <div>Content 1</div> },
          { key: '2', label: 'Disabled Tab', disabled: true, children: <div>Content 2</div> },
          { key: '3', label: 'Another Enabled Tab', children: <div>Content 3</div> },
        ]}
      />
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <Tabs defaultActiveKey="2" items={defaultItems} />
  ),
};

export const WithTabPane: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tabKey="1" label="Tab 1">
          <div>Content for Tab 1</div>
        </Tabs.TabPane>
        <Tabs.TabPane tabKey="2" label="Tab 2">
          <div>Content for Tab 2</div>
        </Tabs.TabPane>
        <Tabs.TabPane tabKey="3" label="Tab 3">
          <div>Content for Tab 3</div>
        </Tabs.TabPane>
      </Tabs>
    );
  },
};
