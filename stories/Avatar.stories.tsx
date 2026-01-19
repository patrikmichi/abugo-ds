import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from '@/components/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    children: 'JD',
  },
};

export const Image: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        alt="Jane Smith"
      />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
        alt="Bob Johnson"
      />
    </div>
  ),
};

export const Icon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar
        icon={
          <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
            person
          </span>
        }
      />
      <Avatar
        icon={
          <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
            account_circle
          </span>
        }
      />
      <Avatar
        icon={
          <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
            face
          </span>
        }
      />
    </div>
  ),
};

export const Letter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar>JD</Avatar>
      <Avatar>AB</Avatar>
      <Avatar>CD</Avatar>
      <Avatar>EF</Avatar>
      <Avatar>GH</Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar size="small">S</Avatar>
      <Avatar size="default">M</Avatar>
      <Avatar size="large">L</Avatar>
      <Avatar size={64}>64</Avatar>
      <Avatar size={80}>80</Avatar>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Avatar shape="circle">JD</Avatar>
        <span>Circle</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Avatar shape="rounded">JD</Avatar>
        <span>Rounded</span>
      </div>
    </div>
  ),
};

export const WithBorderAndRing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Circle with Border and Ring</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar shape="circle" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" border ring />
          <Avatar shape="circle" border ring>PS</Avatar>
          <Avatar 
            shape="circle" 
            border 
            ring
            icon={
              <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
                person
              </span>
            }
          />
          <Avatar shape="circle" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" border ring />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Rounded with Border</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar shape="rounded" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" border />
          <Avatar shape="rounded" border>PS</Avatar>
          <Avatar 
            shape="rounded" 
            border
            icon={
              <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
                person
              </span>
            }
          />
          <Avatar shape="rounded" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" border />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Rounded without Border</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar shape="rounded" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar shape="rounded">PS</Avatar>
          <Avatar 
            shape="rounded"
            icon={
              <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
                person
              </span>
            }
          />
        </div>
      </div>
    </div>
  ),
};

export const ImageError: Story = {
  render: () => {
    const [errorHandled, setErrorHandled] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Avatar
          src="https://invalid-url-that-will-fail.jpg"
          alt="Will show fallback"
          onError={() => {
            console.log('Image failed to load');
          }}
        >
          JD
        </Avatar>
        <Avatar
          src="https://invalid-url-that-will-fail.jpg"
          alt="No fallback"
          onError={() => {
            setErrorHandled(true);
            return false; // Prevent default fallback
          }}
        >
          {errorHandled ? 'Error' : 'JD'}
        </Avatar>
        <p style={{ fontSize: '14px', color: '#666' }}>
          First avatar shows fallback, second prevents it
        </p>
      </div>
    );
  },
};

export const WithGap: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar gap={0}>AB</Avatar>
      <Avatar gap={4}>AB</Avatar>
      <Avatar gap={8}>AB</Avatar>
      <Avatar gap={12}>AB</Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Basic Group</h3>
        <AvatarGroup>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
        </AvatarGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>With Max Count</h3>
        <AvatarGroup maxCount={3}>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=5" />
        </AvatarGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Mixed Content</h3>
        <AvatarGroup maxCount={4}>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar>JD</Avatar>
          <Avatar
            icon={
              <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
                person
              </span>
            }
          />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar>AB</Avatar>
        </AvatarGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Custom Size</h3>
        <AvatarGroup size="lg" maxCount={3}>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
        </AvatarGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Square Shape</h3>
        <AvatarGroup shape="square" maxCount={3}>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Circle Avatars</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar shape="circle" size="xs" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar shape="circle" size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar shape="circle" size="md" src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar shape="circle" size="lg" src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
          <Avatar shape="circle" size="xl" src="https://api.dicebear.com/7.x/avataaars/svg?seed=5" />
          <Avatar shape="circle" size="xs">JD</Avatar>
          <Avatar shape="circle" size="sm">AB</Avatar>
          <Avatar shape="circle" size="md">CD</Avatar>
          <Avatar shape="circle" size="lg">EF</Avatar>
          <Avatar shape="circle" size="xl">GH</Avatar>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Rounded Avatars</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar shape="rounded" size="xs" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
          <Avatar shape="rounded" size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
          <Avatar shape="rounded" size="md" src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
          <Avatar shape="rounded" size="lg" src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
          <Avatar shape="rounded" size="xl" src="https://api.dicebear.com/7.x/avataaars/svg?seed=5" />
          <Avatar shape="rounded" size="xs">JD</Avatar>
          <Avatar shape="rounded" size="sm">AB</Avatar>
          <Avatar shape="rounded" size="md">CD</Avatar>
          <Avatar shape="rounded" size="lg">EF</Avatar>
          <Avatar shape="rounded" size="xl">GH</Avatar>
        </div>
      </div>
    </div>
  ),
};
