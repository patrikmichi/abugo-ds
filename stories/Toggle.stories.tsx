import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Toggle label="Toggle" checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Off" />
      <Toggle label="On" defaultChecked />
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on" checked disabled />
    </div>
  ),
};
