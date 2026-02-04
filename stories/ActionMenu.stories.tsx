import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionMenu } from '@/components/ActionMenu';
import { Button } from '@/components/Button';

const meta: Meta<typeof ActionMenu> = {
  title: 'Components/ActionMenu',
  component: ActionMenu,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
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
type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <ActionMenu
          items={[
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
            { key: '3', label: 'Option 3' },
          ]}
          onItemClick={(key) => setSelected(key)}
        >
          <Button>Actions</Button>
        </ActionMenu>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
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
        <ActionMenu
          items={[
            { key: 'edit', label: 'Edit', icon: <span className="material-symbols-outlined">edit</span> },
            { key: 'copy', label: 'Copy', icon: <span className="material-symbols-outlined">content_copy</span> },
            { key: 'share', label: 'Share', icon: <span className="material-symbols-outlined">share</span> },
          ]}
          onItemClick={(key) => setSelected(key)}
        >
          <Button>Actions</Button>
        </ActionMenu>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};

export const WithDividerAndDanger: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <ActionMenu
          items={[
            { key: 'edit', label: 'Edit', icon: <span className="material-symbols-outlined">edit</span> },
            { key: 'duplicate', label: 'Duplicate', icon: <span className="material-symbols-outlined">content_copy</span> },
            { key: 'divider', divider: true },
            { key: 'delete', label: 'Delete', icon: <span className="material-symbols-outlined">delete</span>, danger: true },
          ]}
          onItemClick={(key) => setSelected(key)}
        >
          <Button>Actions</Button>
        </ActionMenu>
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
        <ActionMenu
          items={[
            { key: '1', label: 'Enabled Option' },
            { key: '2', label: 'Disabled Option', disabled: true },
            { key: '3', label: 'Another Enabled Option' },
          ]}
        >
          <Button>Open Menu</Button>
        </ActionMenu>
      </div>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const items = [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
    ];

    const placements: Array<{ label: string; value: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' }> = [
      { label: 'Bottom Left', value: 'bottomLeft' },
      { label: 'Bottom Center', value: 'bottomCenter' },
      { label: 'Bottom Right', value: 'bottomRight' },
      { label: 'Top Left', value: 'topLeft' },
      { label: 'Top Center', value: 'topCenter' },
      { label: 'Top Right', value: 'topRight' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', paddingTop: '200px' }}>
        {placements.map((placement) => (
          <div key={placement.value} style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>
              {placement.label}
            </p>
            <ActionMenu items={items} placement={placement.value}>
              <Button>Open Menu</Button>
            </ActionMenu>
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '800px' }}>
        <ActionMenu
          disabled
          items={[
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
          ]}
        >
          <Button disabled>Disabled Menu</Button>
        </ActionMenu>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '800px' }}>
        <ActionMenu
          items={[
            { key: 'edit', label: 'Edit', icon: <span className="material-symbols-outlined">edit</span> },
            { key: 'copy', label: 'Copy', icon: <span className="material-symbols-outlined">content_copy</span> },
            { key: 'disabled', label: 'Disabled Option', disabled: true },
            { key: 'divider', divider: true },
            { key: 'delete', label: 'Delete', icon: <span className="material-symbols-outlined">delete</span>, danger: true },
          ]}
          placement="bottomLeft"
          onItemClick={(key) => setSelected(key)}
        >
          <Button>Actions Menu</Button>
        </ActionMenu>
        {selected && (
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Selected: {selected}</p>
        )}
      </div>
    );
  },
};
