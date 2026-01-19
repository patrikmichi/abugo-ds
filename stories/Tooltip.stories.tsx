import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/Tooltip';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
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
      options: ['hover', 'focus', 'click', 'contextMenu'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    title: 'Tooltip content',
    children: <Button>Hover me</Button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center', padding: '4rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Top Left" placement="topLeft">
          <Button>Top Left</Button>
        </Tooltip>
        <Tooltip title="Top" placement="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip title="Top Right" placement="topRight">
          <Button>Top Right</Button>
        </Tooltip>
      </div>
      <div style={{ display: 'flex', gap: '4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Tooltip title="Left Top" placement="leftTop">
            <Button>Left Top</Button>
          </Tooltip>
          <Tooltip title="Left" placement="left">
            <Button>Left</Button>
          </Tooltip>
          <Tooltip title="Left Bottom" placement="leftBottom">
            <Button>Left Bottom</Button>
          </Tooltip>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Tooltip title="Right Top" placement="rightTop">
            <Button>Right Top</Button>
          </Tooltip>
          <Tooltip title="Right" placement="right">
            <Button>Right</Button>
          </Tooltip>
          <Tooltip title="Right Bottom" placement="rightBottom">
            <Button>Right Bottom</Button>
          </Tooltip>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Bottom Left" placement="bottomLeft">
          <Button>Bottom Left</Button>
        </Tooltip>
        <Tooltip title="Bottom" placement="bottom">
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip title="Bottom Right" placement="bottomRight">
          <Button>Bottom Right</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const Triggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip title="Hover trigger (default)" trigger="hover">
        <Button>Hover</Button>
      </Tooltip>
      <Tooltip title="Focus trigger" trigger="focus">
        <Input placeholder="Focus me" />
      </Tooltip>
      <Tooltip title="Click trigger" trigger="click">
        <Button>Click</Button>
      </Tooltip>
      <Tooltip title="Context menu trigger" trigger="contextMenu">
        <Button>Right Click</Button>
      </Tooltip>
      <Tooltip title="Multiple triggers" trigger={['hover', 'focus']}>
        <Input placeholder="Hover or focus" />
      </Tooltip>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Tooltip title="Controlled tooltip" open={open} onOpenChange={setOpen}>
          <Button>Controlled</Button>
        </Tooltip>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show'} Tooltip
        </Button>
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Tooltip title="This is a very long tooltip content that will wrap to multiple lines to demonstrate how the tooltip handles longer text content.">
        <Button>Long Content</Button>
      </Tooltip>
      <Tooltip title="Short">
        <Button>Short</Button>
      </Tooltip>
    </div>
  ),
};

export const ArrowPointAtCenter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Tooltip title="Arrow at edge" placement="top">
        <Button>Default</Button>
      </Tooltip>
      <Tooltip title="Arrow at center" placement="top" arrowPointAtCenter>
        <Button>Center Arrow</Button>
      </Tooltip>
    </div>
  ),
};

export const WithDifferentElements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tooltip title="Button tooltip">
        <Button>Button</Button>
      </Tooltip>
      <Tooltip title="Avatar tooltip">
        <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
      </Tooltip>
      <Tooltip title="Link tooltip">
        <a href="#" style={{ color: '#1890ff' }}>Link</a>
      </Tooltip>
      <Tooltip title="Icon tooltip">
        <span className="material-symbols-outlined" style={{ fontSize: '24px', cursor: 'pointer' }}>
          info
        </span>
      </Tooltip>
    </div>
  ),
};

export const AutoAdjustOverflow: Story = {
  render: () => (
    <div style={{ padding: '200px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip title="Top left corner" placement="topLeft" autoAdjustOverflow>
          <Button>Top Left</Button>
        </Tooltip>
        <Tooltip title="Top right corner" placement="topRight" autoAdjustOverflow>
          <Button>Top Right</Button>
        </Tooltip>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip title="Bottom left corner" placement="bottomLeft" autoAdjustOverflow>
          <Button>Bottom Left</Button>
        </Tooltip>
        <Tooltip title="Bottom right corner" placement="bottomRight" autoAdjustOverflow>
          <Button>Bottom Right</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

