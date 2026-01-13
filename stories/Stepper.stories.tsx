import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from '@/components/Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Example: Story = {
  render: () => (
    <div>
      <Stepper variant="default">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#5690f5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#32c21a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#efefef', color: '#464646', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
        </div>
      </Stepper>
    </div>
  ),
};
