import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Field } from '@/components/Field';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    closable: {
      control: 'boolean',
    },
    mask: {
      control: 'boolean',
    },
    maskClosable: {
      control: 'boolean',
    },
    keyboard: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <p>This is drawer content.</p>
        </Drawer>
      </div>
    );
  },
};

export const Placements: Story = {
  render: () => {
    const [placement, setPlacement] = useState<'top' | 'right' | 'bottom' | 'left'>('right');
    const [open, setOpen] = useState(false);
    
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button onClick={() => { setPlacement('top'); setOpen(true); }}>Top</Button>
          <Button onClick={() => { setPlacement('right'); setOpen(true); }}>Right</Button>
          <Button onClick={() => { setPlacement('bottom'); setOpen(true); }}>Bottom</Button>
          <Button onClick={() => { setPlacement('left'); setOpen(true); }}>Left</Button>
        </div>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          placement={placement}
        >
          <p>Drawer from {placement}</p>
        </Drawer>
      </div>
    );
  },
};

export const WithTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer with Title</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Drawer Title"
        >
          <p>This drawer has a title.</p>
        </Drawer>
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer with Footer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Drawer with Footer"
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
            </>
          }
        >
          <p>This drawer has a footer with action buttons.</p>
        </Drawer>
      </div>
    );
  },
};

export const CustomSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Wide Drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Wide Drawer"
          width={600}
        >
          <p>This drawer has a custom width of 600px.</p>
        </Drawer>
      </div>
    );
  },
};

export const NoMask: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer without Mask</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="No Mask"
          mask={false}
        >
          <p>This drawer has no mask overlay.</p>
        </Drawer>
      </div>
    );
  },
};

export const NotClosable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Non-Closable Drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Not Closable"
          closable={false}
          maskClosable={false}
          keyboard={false}
        >
          <p>This drawer cannot be closed by clicking the X, mask, or Esc key.</p>
          <Button onClick={() => setOpen(false)}>Close via Button</Button>
        </Drawer>
      </div>
    );
  },
};


export const AllPlacements: Story = {
  render: () => {
    const [topOpen, setTopOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [bottomOpen, setBottomOpen] = useState(false);
    const [leftOpen, setLeftOpen] = useState(false);
    
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setTopOpen(true)}>Top</Button>
          <Button onClick={() => setRightOpen(true)}>Right</Button>
          <Button onClick={() => setBottomOpen(true)}>Bottom</Button>
          <Button onClick={() => setLeftOpen(true)}>Left</Button>
        </div>
        
        <Drawer open={topOpen} onClose={() => setTopOpen(false)} placement="top" height={200}>
          <p>Drawer from top</p>
        </Drawer>
        
        <Drawer open={rightOpen} onClose={() => setRightOpen(false)} placement="right">
          <p>Drawer from right</p>
        </Drawer>
        
        <Drawer open={bottomOpen} onClose={() => setBottomOpen(false)} placement="bottom" height={200}>
          <p>Drawer from bottom</p>
        </Drawer>
        
        <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} placement="left">
          <p>Drawer from left</p>
        </Drawer>
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer with Long Content</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Long Content"
        >
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>This is paragraph {i + 1} of a long content example.</p>
          ))}
        </Drawer>
      </div>
    );
  },
};

