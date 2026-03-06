import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, Step } from '@/components/Stepper';
import type { StepItem } from '@/components/Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    status: {
      control: 'select',
      options: ['wait', 'process', 'finish', 'error'],
    },
    labelPlacement: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// Basic example with children API
export const Default: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Step title="Step 1" description="Description 1" />
          <Step title="Step 2" description="Description 2" />
          <Step title="Step 3" description="Description 3" />
        </Stepper>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))}>Previous</button>
          <button onClick={() => setCurrent(Math.min(2, current + 1))}>Next</button>
        </div>
      </div>
    );
  },
};

// Items array API (recommended)
export const ItemsAPI: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Finished', description: 'This step is complete' },
      { title: 'In Progress', description: 'Currently working on this' },
      { title: 'Waiting', description: 'This step is next' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} items={items} onChange={setCurrent} />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Current step: {current}</p>
      </div>
    );
  },
};

// With subtitle
export const WithSubtitle: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Login', subTitle: '00:00:05', description: 'Enter credentials' },
      { title: 'Verification', subTitle: '00:01:02', description: 'Verify identity' },
      { title: 'Payment', subTitle: 'Waiting', description: 'Complete payment' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} items={items} onChange={setCurrent} />
      </div>
    );
  },
};

// Direction variants
export const Directions: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Horizontal</h3>
          <Stepper current={current} direction="horizontal" items={items} onChange={setCurrent} />
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Vertical</h3>
          <Stepper current={current} direction="vertical" items={items} onChange={setCurrent} />
        </div>
      </div>
    );
  },
};

// Size variants
export const Sizes: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Default Size</h3>
          <Stepper current={current} size="default" items={items} onChange={setCurrent} />
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Small Size</h3>
          <Stepper current={current} size="small" items={items} onChange={setCurrent} />
        </div>
      </div>
    );
  },
};

// Label placement
export const LabelPlacement: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Horizontal Label (default)</h3>
          <Stepper
            current={current}
            labelPlacement="horizontal"
            items={items}
            onChange={setCurrent}
          />
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Vertical Label</h3>
          <Stepper
            current={current}
            labelPlacement="vertical"
            items={items}
            onChange={setCurrent}
          />
        </div>
      </div>
    );
  },
};

// Status variants
export const Statuses: Story = {
  render: () => {
    const items: StepItem[] = [
      { title: 'Finished', description: 'This is a description', status: 'finish' },
      { title: 'In Progress', description: 'This is a description', status: 'process' },
      { title: 'Waiting', description: 'This is a description', status: 'wait' },
      { title: 'Error', description: 'This is a description', status: 'error' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={1} items={items} />
      </div>
    );
  },
};

// With custom icons
export const WithIcons: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      {
        title: 'Login',
        description: 'Enter your credentials',
        icon: <span className="material-symbols-outlined">login</span>,
      },
      {
        title: 'Verification',
        description: 'Verify your email',
        icon: <span className="material-symbols-outlined">mail</span>,
      },
      {
        title: 'Payment',
        description: 'Complete payment',
        icon: <span className="material-symbols-outlined">payment</span>,
      },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} items={items} onChange={setCurrent} />
      </div>
    );
  },
};

// Progress dot style
export const ProgressDot: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} progressDot items={items} onChange={setCurrent} />
      </div>
    );
  },
};

// With error status
export const WithError: Story = {
  render: () => {
    const items: StepItem[] = [
      { title: 'Finished', description: 'This is a description' },
      { title: 'In Progress', description: 'This is a description' },
      { title: 'Error', description: 'This step has an error' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={2} status="error" items={items} />
      </div>
    );
  },
};

// With disabled step
export const Disabled: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2', disabled: true },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} items={items} onChange={setCurrent} />
      </div>
    );
  },
};

// Without description
export const WithoutDescription: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1' },
      { title: 'Step 2' },
      { title: 'Step 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} items={items} onChange={setCurrent} />
      </div>
    );
  },
};

// Vertical with small size
export const VerticalSmall: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'This is a long description that might wrap to multiple lines' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '400px' }}>
        <Stepper
          current={current}
          direction="vertical"
          size="small"
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

// All features combined
export const AllFeatures: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper
          current={current}
          direction="horizontal"
          size="default"
          status="process"
          onChange={setCurrent}
        >
          <Step
            title="First"
            subTitle="00:00:05"
            description="First step description"
            icon={<span className="material-symbols-outlined">looks_one</span>}
          />
          <Step
            title="Second"
            subTitle="00:01:02"
            description="Second step description"
            icon={<span className="material-symbols-outlined">looks_two</span>}
          />
          <Step
            title="Third"
            subTitle="Waiting"
            description="Third step description"
            icon={<span className="material-symbols-outlined">looks_3</span>}
          />
        </Stepper>
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '14px' }}>Current step: {current}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={() => setCurrent(0)}>Go to Step 1</button>
            <button onClick={() => setCurrent(1)}>Go to Step 2</button>
            <button onClick={() => setCurrent(2)}>Go to Step 3</button>
          </div>
        </div>
      </div>
    );
  },
};
