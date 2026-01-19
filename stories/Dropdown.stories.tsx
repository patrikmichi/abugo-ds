import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@/components/Dropdown';
import { Menu } from '@/components/Menu';
import { Button } from '@/components/Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'contextMenu', ['click', 'hover']],
    },
    placement: {
      control: 'select',
      options: [
        'bottomLeft',
        'bottomCenter',
        'bottomRight',
        'topLeft',
        'topCenter',
        'topRight',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </Menu>
          }
        >
          <Button>Hover me</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const ClickTrigger: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </Menu>
          }
        >
          <Button>Click me</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const ContextMenuTrigger: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="contextMenu"
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item key="1">Copy</Menu.Item>
              <Menu.Item key="2">Cut</Menu.Item>
              <Menu.Item key="3">Paste</Menu.Item>
            </Menu>
          }
        >
          <div
            style={{
              padding: '2rem',
              border: '1px dashed #d9d9d9',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            Right-click here
          </div>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const placements: Array<{ label: string; value: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' }> = [
      { label: 'Bottom Left', value: 'bottomLeft' },
      { label: 'Bottom Center', value: 'bottomCenter' },
      { label: 'Bottom Right', value: 'bottomRight' },
      { label: 'Top Left', value: 'topLeft' },
      { label: 'Top Center', value: 'topCenter' },
      { label: 'Top Right', value: 'topRight' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        {placements.map((placement) => (
          <div key={placement.value} style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>
              {placement.label}
            </p>
            <Dropdown
              trigger="click"
              placement={placement.value}
              overlay={
                <Menu>
                  <Menu.Item key="1">Option 1</Menu.Item>
                  <Menu.Item key="2">Option 2</Menu.Item>
                  <Menu.Item key="3">Option 3</Menu.Item>
                </Menu>
              }
            >
              <Button>Open Dropdown</Button>
            </Dropdown>
          </div>
        ))}
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          visible={visible}
          onVisibleChange={setVisible}
          overlay={
            <Menu onSelect={(key) => {
              setSelected(key);
              setVisible(false);
            }}>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </Menu>
          }
        >
          <Button>Controlled Dropdown</Button>
        </Dropdown>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setVisible(true)}>Open</button>
          <button onClick={() => setVisible(false)}>Close</button>
        </div>
        {selected && (
          <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item
                key="1"
                icon={<span className="material-symbols-outlined">edit</span>}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<span className="material-symbols-outlined">delete</span>}
              >
                Delete
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<span className="material-symbols-outlined">share</span>}
              >
                Share
              </Menu.Item>
            </Menu>
          }
        >
          <Button>Actions</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          overlay={
            <Menu>
              <Menu.Item key="1">Enabled Option</Menu.Item>
              <Menu.Item key="2" disabled>
                Disabled Option
              </Menu.Item>
              <Menu.Item key="3">Another Enabled Option</Menu.Item>
            </Menu>
          }
        >
          <Button>Open Dropdown</Button>
        </Dropdown>
      </div>
    );
  },
};

export const WithDangerItems: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item key="1">Normal Option</Menu.Item>
              <Menu.Item key="2" danger>
                Danger Option
              </Menu.Item>
              <Menu.Item key="3">Another Normal Option</Menu.Item>
            </Menu>
          }
        >
          <Button>Open Dropdown</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          disabled
          overlay={
            <Menu>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
            </Menu>
          }
        >
          <Button disabled>Disabled Dropdown</Button>
        </Dropdown>
      </div>
    );
  },
};

export const DarkTheme: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px', background: '#001529', padding: '2rem', borderRadius: '8px' }}>
        <Dropdown
          trigger="click"
          overlay={
            <Menu theme="dark" onSelect={(key) => setSelected(key)}>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </Menu>
          }
        >
          <Button>Open Dropdown</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px', color: '#fff' }}>
            Selected: {selected}
          </p>
        )}
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Dropdown
          trigger="click"
          placement="bottomLeft"
          overlay={
            <Menu onSelect={(key) => setSelected(key)}>
              <Menu.Item
                key="1"
                icon={<span className="material-symbols-outlined">edit</span>}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<span className="material-symbols-outlined">copy</span>}
              >
                Copy
              </Menu.Item>
              <Menu.Item key="3" disabled>
                Disabled Option
              </Menu.Item>
              <Menu.Item
                key="4"
                danger
                icon={<span className="material-symbols-outlined">delete</span>}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
        >
          <Button>Actions Menu</Button>
        </Dropdown>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

