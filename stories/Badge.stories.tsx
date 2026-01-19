import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    tokens: {
      componentName: 'Badge',
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    status: {
      control: 'select',
      options: ['success', 'processing', 'default', 'error', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Count: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge count={5}>
        <Button>Notifications</Button>
      </Badge>
      <Badge count={0}>
        <Button>Messages</Button>
      </Badge>
      <Badge count={0} showZero>
        <Button>Zero shown</Button>
      </Badge>
      <Badge count={99}>
        <Button>Large count</Button>
      </Badge>
      <Badge count={100} overflowCount={99}>
        <Button>Overflow</Button>
      </Badge>
    </div>
  ),
};

export const Dot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge dot>
        <Button>Notifications</Button>
      </Badge>
      <Badge dot>
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
      </Badge>
      <Badge dot>
        <span style={{ fontSize: '24px' }}>🔔</span>
      </Badge>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Badge status="success" text="Success" />
      <Badge status="processing" text="Processing" />
      <Badge status="default" text="Default" />
      <Badge status="error" text="Error" />
      <Badge status="warning" text="Warning" />
    </div>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge count={5}>
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
      </Badge>
      <Badge dot>
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
      </Badge>
      <Badge count={99}>
        <Avatar>JD</Avatar>
      </Badge>
      <Badge count={1000} overflowCount={999}>
        <Avatar shape="square">AB</Avatar>
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge count={5} size="default">
        <Button>Default</Button>
      </Badge>
      <Badge count={5} size="small">
        <Button>Small</Button>
      </Badge>
      <Badge dot size="default">
        <Button>Default Dot</Button>
      </Badge>
      <Badge dot size="small">
        <Button>Small Dot</Button>
      </Badge>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge count={5} color="#52c41a">
        <Button>Green</Button>
      </Badge>
      <Badge count={5} color="#1890ff">
        <Button>Blue</Button>
      </Badge>
      <Badge count={5} color="#faad14">
        <Button>Orange</Button>
      </Badge>
      <Badge count={5} color="#eb2f96">
        <Button>Pink</Button>
      </Badge>
      <Badge dot color="#52c41a">
        <Button>Green Dot</Button>
      </Badge>
      <Badge dot color="#1890ff">
        <Button>Blue Dot</Button>
      </Badge>
    </div>
  ),
};

export const Offset: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge count={5} offset={[10, 10]}>
        <Button>Offset [10, 10]</Button>
      </Badge>
      <Badge count={5} offset={[-10, 10]}>
        <Button>Offset [-10, 10]</Button>
      </Badge>
      <Badge dot offset={[5, 5]}>
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
      </Badge>
    </div>
  ),
};

export const Standalone: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge count={5} />
      <Badge count={99} />
      <Badge count={100} overflowCount={99} />
      <Badge dot />
      <Badge status="success" text="Online" />
      <Badge status="error" text="Offline" />
    </div>
  ),
};

export const Overflow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge count={99} overflowCount={99}>
        <Button>99 (max)</Button>
      </Badge>
      <Badge count={100} overflowCount={99}>
        <Button>100 (99+)</Button>
      </Badge>
      <Badge count={999} overflowCount={99}>
        <Button>999 (99+)</Button>
      </Badge>
      <Badge count={1000} overflowCount={999}>
        <Button>1000 (999+)</Button>
      </Badge>
    </div>
  ),
};

