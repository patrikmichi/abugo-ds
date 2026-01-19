import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@/components/Accordion';
import { Button } from '@/components/Button';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    tokens: {
      componentName: 'Accordion',
    },
  },
  argTypes: {
    accordion: {
      control: 'boolean',
    },
    ghost: {
      control: 'boolean',
    },
    bordered: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1">
        <Accordion.Panel key="1" header="Panel 1">
          <p>This is the content of panel 1.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Panel 2">
          <p>This is the content of panel 2.</p>
        </Accordion.Panel>
        <Accordion.Panel key="3" header="Panel 3">
          <p>This is the content of panel 3.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const AccordionMode: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1" accordion>
        <Accordion.Panel key="1" header="Panel 1 (Only one can be open)">
          <p>This is the content of panel 1.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Panel 2">
          <p>This is the content of panel 2.</p>
        </Accordion.Panel>
        <Accordion.Panel key="3" header="Panel 3">
          <p>This is the content of panel 3.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const Panel: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion panel defaultActiveKey="1">
        <Accordion.Panel key="1" header="Headline">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices ut porttitor nibh tortor. Tincidunt massa eu, elementum vel egestas vulputate.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Headline">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices ut porttitor nibh tortor. Tincidunt massa eu, elementum vel egestas vulputate.</p>
        </Accordion.Panel>
        <Accordion.Panel key="3" header="Headline">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices ut porttitor nibh tortor. Tincidunt massa eu, elementum vel egestas vulputate.</p>
        </Accordion.Panel>
        <Accordion.Panel key="4" header="Headline">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices ut porttitor nibh tortor. Tincidunt massa eu, elementum vel egestas vulputate.</p>
        </Accordion.Panel>
        <Accordion.Panel key="5" header="Headline">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices ut porttitor nibh tortor. Tincidunt massa eu, elementum vel egestas vulputate.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
        <Accordion size="small" defaultActiveKey="1">
          <Accordion.Panel key="1" header="Small Panel">
            <p>This is small size content.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle (Default)</p>
        <Accordion size="middle" defaultActiveKey="1">
          <Accordion.Panel key="1" header="Middle Panel">
            <p>This is middle size content.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
        <Accordion size="large" defaultActiveKey="1">
          <Accordion.Panel key="1" header="Large Panel">
            <p>This is large size content.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  ),
};

export const WithExtra: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1">
        <Accordion.Panel
          key="1"
          header="Panel with Extra"
          extra={<span style={{ fontSize: '12px' }}>Extra content</span>}
        >
          <p>This panel has extra content in the header.</p>
        </Accordion.Panel>
        <Accordion.Panel
          key="2"
          header="Panel with Button"
          extra={<Button size="sm" variant="text">Action</Button>}
        >
          <p>This panel has a button in the header.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1">
        <Accordion.Panel key="1" header="Enabled Panel">
          <p>This panel is enabled.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Disabled Panel" disabled>
          <p>This panel is disabled and cannot be opened.</p>
        </Accordion.Panel>
        <Accordion.Panel key="3" header="Another Enabled Panel">
          <p>This panel is also enabled.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion
        defaultActiveKey="1"
        expandIcon={({ isActive }) => (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '16px',
              transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            expand_more
          </span>
        )}
      >
        <Accordion.Panel key="1" header="Custom Icon Panel">
          <p>This panel uses a custom expand icon.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Another Panel">
          <p>This panel also uses the custom icon.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const IconPosition: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Icon at Start</p>
        <Accordion defaultActiveKey="1" expandIconPosition="start">
          <Accordion.Panel key="1" header="Panel with Icon at Start">
            <p>This panel has the icon at the start.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Icon at End (Default)</p>
        <Accordion defaultActiveKey="1" expandIconPosition="end">
          <Accordion.Panel key="1" header="Panel with Icon at End">
            <p>This panel has the icon at the end.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Not Collapsible</p>
        <Accordion defaultActiveKey="1" collapsible={false}>
          <Accordion.Panel key="1" header="Cannot Close Panel">
            <p>This panel cannot be closed once opened.</p>
          </Accordion.Panel>
          <Accordion.Panel key="2" header="Another Panel">
            <p>This panel can be opened but not closed.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Collapsible by Icon Only</p>
        <Accordion defaultActiveKey="1" collapsible="icon">
          <Accordion.Panel key="1" header="Click Icon to Toggle">
            <p>Only the icon is clickable to toggle this panel.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Collapsible by Header Only</p>
        <Accordion defaultActiveKey="1" collapsible="header">
          <Accordion.Panel key="1" header="Click Header to Toggle">
            <p>Only the header is clickable to toggle this panel.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  ),
};

export const DestroyInactive: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1" destroyInactivePanel>
        <Accordion.Panel key="1" header="Panel 1 (Content destroyed when closed)">
          <p>This content will be destroyed when the panel is closed.</p>
          <input type="text" placeholder="Type something..." style={{ marginTop: '0.5rem', padding: '4px 8px' }} />
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Panel 2">
          <p>This content will also be destroyed when closed.</p>
          <input type="text" placeholder="Type something..." style={{ marginTop: '0.5rem', padding: '4px 8px' }} />
        </Accordion.Panel>
      </Accordion>
      <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
        Close and reopen panels to see content reset (destroyed and recreated).
      </p>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion defaultActiveKey="1">
        <Accordion.Panel key="1" header="Panel with Long Content">
          <div>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>This is paragraph {i + 1} of a long content section.</p>
            ))}
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};

export const AllFeatures: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Accordion
        defaultActiveKey="1"
        accordion
        size="middle"
        expandIconPosition="end"
      >
        <Accordion.Panel
          key="1"
          header="Feature-Rich Panel"
          extra={<span style={{ fontSize: '12px', color: '#666' }}>Extra</span>}
        >
          <p>This panel demonstrates all features working together.</p>
        </Accordion.Panel>
        <Accordion.Panel key="2" header="Another Panel">
          <p>This is another panel.</p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
};
