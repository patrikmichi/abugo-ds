import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@/components/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    orientation: {
      control: 'select',
      options: ['left', 'right', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider />
        <p>Content below</p>
      </div>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider type="horizontal" />
        <p>Content below</p>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100px', maxWidth: '600px' }}>
        <span>Left</span>
        <Divider type="vertical" />
        <span>Middle</span>
        <Divider type="vertical" />
        <span>Right</span>
      </div>
    );
  },
};

export const Dashed: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider dashed />
        <p>Content below</p>
      </div>
    );
  },
};

export const WithText: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider>Text</Divider>
        <p>Content below</p>
      </div>
    );
  },
};

export const TextOrientations: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Left</p>
          <Divider orientation="left">Left Text</Divider>
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Center (Default)</p>
          <Divider orientation="center">Center Text</Divider>
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Right</p>
          <Divider orientation="right">Right Text</Divider>
        </div>
      </div>
    );
  },
};

export const Plain: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider plain>Plain Text</Divider>
        <p>Content below</p>
      </div>
    );
  },
};

export const DashedWithText: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '600px' }}>
        <p>Content above</p>
        <Divider dashed>Dashed with Text</Divider>
        <p>Content below</p>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        <div>
          <p>Regular divider</p>
          <Divider />
        </div>
        <div>
          <p>Dashed divider</p>
          <Divider dashed />
        </div>
        <div>
          <p>With text (center)</p>
          <Divider>Center Text</Divider>
        </div>
        <div>
          <p>With text (left)</p>
          <Divider orientation="left">Left Text</Divider>
        </div>
        <div>
          <p>Plain text</p>
          <Divider plain>Plain Text</Divider>
        </div>
        <div>
          <p>Dashed with text</p>
          <Divider dashed>Dashed Text</Divider>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
          <span>Vertical</span>
          <Divider type="vertical" />
          <span>Divider</span>
        </div>
      </div>
    );
  },
};

