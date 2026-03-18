import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          onOk={() => setOpen(false)}
          footer
        >
          <p>Drawer content</p>
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
          onOk={() => setOpen(false)}
          placement={placement}
          footer
        >
          <p>Drawer from {placement}</p>
        </Drawer>
      </div>
    );
  },
};

export const WithHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [openCenter, setOpenCenter] = useState(false);
    const [openBack, setOpenBack] = useState(false);
    const [openCenterBack, setOpenCenterBack] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpen(true)}>Title Left</Button>
          <Button onClick={() => setOpenCenter(true)}>Title Center</Button>
          <Button onClick={() => setOpenBack(true)}>Title Left + Back</Button>
          <Button onClick={() => setOpenCenterBack(true)}>Title Center + Back</Button>
        </div>

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          onOk={() => setOpen(false)}
          title="Headline"
          footer
        >
          <p>Header with left-aligned title.</p>
        </Drawer>

        <Drawer
          open={openCenter}
          onClose={() => setOpenCenter(false)}
          onOk={() => setOpenCenter(false)}
          title="Headline"
          titleAlign="center"
          footer
        >
          <p>Header with centered title.</p>
        </Drawer>

        <Drawer
          open={openBack}
          onClose={() => setOpenBack(false)}
          onOk={() => setOpenBack(false)}
          title="Headline"
          onBack={() => setOpenBack(false)}
          footer
        >
          <p>Header with left-aligned title and back arrow.</p>
        </Drawer>

        <Drawer
          open={openCenterBack}
          onClose={() => setOpenCenterBack(false)}
          onOk={() => setOpenCenterBack(false)}
          title="Headline"
          titleAlign="center"
          onBack={() => setOpenCenterBack(false)}
          footer
        >
          <p>Header with centered title and back arrow.</p>
        </Drawer>
      </div>
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>Open Basic Drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
        >
          <p>Basic drawer with close icon only.</p>
        </Drawer>
      </div>
    );
  },
};
