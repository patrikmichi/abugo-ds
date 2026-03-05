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
      options: [
        'top',
        'topLeft',
        'topRight',
        'bottom',
        'bottomLeft',
        'bottomRight',
        'left',
        'leftTop',
        'leftBottom',
        'right',
        'rightTop',
        'rightBottom',
      ],
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'focus'],
    },
    arrow: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    title: 'Popover Title',
    content: 'This is the popover content.',
    children: <Button>Click me</Button>,
  },
};

export const Triggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Popover title="Click Trigger" content="Click the button to show this popover." trigger="click">
        <Button>Click</Button>
      </Popover>
      <Popover title="Hover Trigger" content="Hover over the button to show this popover." trigger="hover">
        <Button>Hover</Button>
      </Popover>
      <Popover title="Focus Trigger" content="Focus the button to show this popover." trigger="focus">
        <Button>Focus</Button>
      </Popover>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center', padding: '6rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Popover title="Top Left" content="Placement: topLeft" placement="topLeft">
          <Button>Top Left</Button>
        </Popover>
        <Popover title="Top" content="Placement: top" placement="top">
          <Button>Top</Button>
        </Popover>
        <Popover title="Top Right" content="Placement: topRight" placement="topRight">
          <Button>Top Right</Button>
        </Popover>
      </div>
      <div style={{ display: 'flex', gap: '12rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Popover title="Left Top" content="Placement: leftTop" placement="leftTop">
            <Button>Left Top</Button>
          </Popover>
          <Popover title="Left" content="Placement: left" placement="left">
            <Button>Left</Button>
          </Popover>
          <Popover title="Left Bottom" content="Placement: leftBottom" placement="leftBottom">
            <Button>Left Bottom</Button>
          </Popover>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Popover title="Right Top" content="Placement: rightTop" placement="rightTop">
            <Button>Right Top</Button>
          </Popover>
          <Popover title="Right" content="Placement: right" placement="right">
            <Button>Right</Button>
          </Popover>
          <Popover title="Right Bottom" content="Placement: rightBottom" placement="rightBottom">
            <Button>Right Bottom</Button>
          </Popover>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Popover title="Bottom Left" content="Placement: bottomLeft" placement="bottomLeft">
          <Button>Bottom Left</Button>
        </Popover>
        <Popover title="Bottom" content="Placement: bottom" placement="bottom">
          <Button>Bottom</Button>
        </Popover>
        <Popover title="Bottom Right" content="Placement: bottomRight" placement="bottomRight">
          <Button>Bottom Right</Button>
        </Popover>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <Popover
          title="Controlled Popover"
          content="This popover is controlled externally."
          open={open}
          onOpenChange={setOpen}
        >
          <Button>Target</Button>
        </Popover>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Open'} Popover
        </Button>
      </div>
    );
  },
};

export const TitleOnly: Story = {
  render: () => (
    <Popover title="Just a title, no content">
      <Button>Title Only</Button>
    </Popover>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Popover content="This popover has no title, just content.">
      <Button>Content Only</Button>
    </Popover>
  ),
};

export const NoArrow: Story = {
  render: () => (
    <Popover title="No Arrow" content="This popover has no arrow." arrow={false}>
      <Button>No Arrow</Button>
    </Popover>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Popover
      title="User Profile"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e0e0e0' }} />
            <div>
              <div style={{ fontWeight: 500 }}>John Doe</div>
              <div style={{ fontSize: 12, color: '#666' }}>john@example.com</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Button size="sm">Message</Button>
            <Button size="sm" variant="secondary" appearance="plain">Profile</Button>
          </div>
        </div>
      }
    >
      <Button>User Card</Button>
    </Popover>
  ),
};

export const HoverTriggerWithDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Popover
        title="Hover Popover"
        content="This popover appears on hover. Move your mouse away to close it."
        trigger="hover"
        placement="bottom"
      >
        <Button>Hover me</Button>
      </Popover>
    </div>
  ),
};
