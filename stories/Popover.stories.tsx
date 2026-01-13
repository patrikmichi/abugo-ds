import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@/components/Popover';
import { Button } from '@/components/Button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Popover isOpen={isOpen} trigger={<Button onClick={() => setIsOpen(!isOpen)}>Toggle Popover</Button>}>
        <div style={{ padding: '1rem' }}>Popover content</div>
      </Popover>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const [topOpen, setTopOpen] = useState(false);
    const [bottomOpen, setBottomOpen] = useState(false);
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center', padding: '4rem' }}>
        <Popover isOpen={topOpen} trigger={<Button onClick={() => setTopOpen(!topOpen)}>Top</Button>} placement="top">
          <div style={{ padding: '1rem' }}>Top popover</div>
        </Popover>
        <div style={{ display: 'flex', gap: '4rem' }}>
          <Popover isOpen={leftOpen} trigger={<Button onClick={() => setLeftOpen(!leftOpen)}>Left</Button>} placement="left">
            <div style={{ padding: '1rem' }}>Left popover</div>
          </Popover>
          <Popover isOpen={rightOpen} trigger={<Button onClick={() => setRightOpen(!rightOpen)}>Right</Button>} placement="right">
            <div style={{ padding: '1rem' }}>Right popover</div>
          </Popover>
        </div>
        <Popover isOpen={bottomOpen} trigger={<Button onClick={() => setBottomOpen(!bottomOpen)}>Bottom</Button>} placement="bottom">
          <div style={{ padding: '1rem' }}>Bottom popover</div>
        </Popover>
      </div>
    );
  },
};
