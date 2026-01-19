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
      options: ['line', 'card', 'editable-card'],
    },
    size: {
      control: 'select',
      options: ['large', 'default', 'small'],
    },
    tabPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: '1', label: 'Tab 1', children: <div>Content for Tab 1</div> },
          { key: '2', label: 'Tab 2', children: <div>Content for Tab 2</div> },
          { key: '3', label: 'Tab 3', children: <div>Content for Tab 3</div> },
        ]}
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('2');
    return (
      <div style={{ maxWidth: '800px' }}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            { key: '1', label: 'First', children: <div>First tab content</div> },
            { key: '2', label: 'Second', children: <div>Second tab content (active)</div> },
            { key: '3', label: 'Third', children: <div>Third tab content</div> },
          ]}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Active key: {activeKey}</p>
      </div>
    );
  },
};

export const Types: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    const items = [
      { key: '1', label: 'Tab 1', children: <div>Content 1</div> },
      { key: '2', label: 'Tab 2', children: <div>Content 2</div> },
      { key: '3', label: 'Tab 3', children: <div>Content 3</div> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Line (Default)</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} type="line" items={items} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Card</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} type="card" items={items} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Editable Card</p>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            type="editable-card"
            items={items.map((item) => ({ ...item, closable: true }))}
            onEdit={(key, action) => {
              if (action === 'remove') {
                console.log('Remove tab:', key);
              } else {
                console.log('Add tab');
              }
            }}
          />
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    const items = [
      { key: '1', label: 'Tab 1', children: <div>Content 1</div> },
      { key: '2', label: 'Tab 2', children: <div>Content 2</div> },
      { key: '3', label: 'Tab 3', children: <div>Content 3</div> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} size="small" items={items} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Default</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} size="default" items={items} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} size="large" items={items} />
        </div>
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    const items = [
      { key: '1', label: 'Tab 1', children: <div>Content 1</div> },
      { key: '2', label: 'Tab 2', children: <div>Content 2</div> },
      { key: '3', label: 'Tab 3', children: <div>Content 3</div> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Top (Default)</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} tabPosition="top" items={items} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Bottom</p>
          <Tabs activeKey={activeKey} onChange={setActiveKey} tabPosition="bottom" items={items} />
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Left</p>
            <Tabs activeKey={activeKey} onChange={setActiveKey} tabPosition="left" items={items} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Right</p>
            <Tabs activeKey={activeKey} onChange={setActiveKey} tabPosition="right" items={items} />
          </div>
        </div>
      </div>
    );
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

export const EditableCard: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    const [items, setItems] = useState([
      { key: '1', label: 'Tab 1', children: <div>Content 1</div>, closable: true },
      { key: '2', label: 'Tab 2', children: <div>Content 2</div>, closable: true },
      { key: '3', label: 'Tab 3', children: <div>Content 3</div>, closable: false },
    ]);

    const handleEdit = (targetKey: string, action: 'add' | 'remove') => {
      if (action === 'remove') {
        const newItems = items.filter((item) => item.key !== targetKey);
        setItems(newItems);
        if (activeKey === targetKey && newItems.length > 0) {
          setActiveKey(newItems[0].key);
        }
      } else {
        const newKey = `new-${Date.now()}`;
        setItems([
          ...items,
          { key: newKey, label: `New Tab`, children: <div>New content</div>, closable: true },
        ]);
        setActiveKey(newKey);
      }
    };

    return (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        type="editable-card"
        items={items}
        onEdit={handleEdit}
      />
    );
  },
};

export const WithTabPane: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tabKey="1" tab="Tab 1">
          <div>Content for Tab 1</div>
        </Tabs.TabPane>
        <Tabs.TabPane tabKey="2" tab="Tab 2">
          <div>Content for Tab 2</div>
        </Tabs.TabPane>
        <Tabs.TabPane tabKey="3" tab="Tab 3">
          <div>Content for Tab 3</div>
        </Tabs.TabPane>
      </Tabs>
    );
  },
};

export const ForceRender: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: '1',
            label: 'Tab 1',
            children: <div>Content 1 (always rendered)</div>,
            forceRender: true,
          },
          {
            key: '2',
            label: 'Tab 2',
            children: <div>Content 2 (lazy rendered)</div>,
          },
          {
            key: '3',
            label: 'Tab 3',
            children: <div>Content 3 (lazy rendered)</div>,
          },
        ]}
      />
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('1');
    return (
      <div style={{ maxWidth: '800px' }}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          type="line"
          size="default"
          tabPosition="top"
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
              label: 'Disabled',
              disabled: true,
              children: <div>Disabled content</div>,
            },
          ]}
        />
      </div>
    );
  },
};

