import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@/components/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState('option1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Radio name="group" label="Option 1" checked={selected === 'option1'} onChange={() => setSelected('option1')} />
        <Radio name="group" label="Option 2" checked={selected === 'option2'} onChange={() => setSelected('option2')} />
        <Radio name="group" label="Option 3" checked={selected === 'option3'} onChange={() => setSelected('option3')} />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Radio name="states" label="Unselected" />
      <Radio name="states" label="Selected" defaultChecked />
      <Radio name="states" label="Disabled unselected" disabled />
      <Radio name="states" label="Disabled selected" checked disabled />
    </div>
  ),
};
