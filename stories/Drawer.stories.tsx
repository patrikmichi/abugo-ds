import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Drawer variant="default">
        <h2>Drawer Title</h2>
        <p>This is drawer content. Drawers slide in from the side.</p>
      </Drawer>
    </div>
  ),
};
