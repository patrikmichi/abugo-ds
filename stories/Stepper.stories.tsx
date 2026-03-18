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

// ─── TYPE 1: Default Numbered ────────────────────────────────────────────────

export const Default: Story = {
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
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))}>Previous</button>
          <button onClick={() => setCurrent(Math.min(2, current + 1))}>Next</button>
        </div>
      </div>
    );
  },
};

export const DefaultSmall: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description' },
      { title: 'Step 2', description: 'Description' },
      { title: 'Step 3', description: 'Description' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} size="small" items={items} onChange={setCurrent} />
      </div>
    );
  },
};

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

export const LabelVertical: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper
          current={current}
          labelPlacement="vertical"
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

// ─── TYPE 2: Dot Horizontal ──────────────────────────────────────────────────

export const DotHorizontal: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper
          current={current}
          progressDot
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

export const DotHorizontalSmall: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1' },
      { title: 'Step 2' },
      { title: 'Step 3' },
    ];
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper
          current={current}
          progressDot
          size="small"
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

// ─── TYPE 3: Vertical with Dots ──────────────────────────────────────────────

export const VerticalDot: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'This is a description that might wrap to multiple lines' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ maxWidth: '400px' }}>
        <Stepper
          current={current}
          direction="vertical"
          progressDot
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

export const VerticalDefault: Story = {
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
          items={items}
          onChange={setCurrent}
        />
      </div>
    );
  },
};

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

// ─── Status Variants ─────────────────────────────────────────────────────────

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

// ─── Children API ────────────────────────────────────────────────────────────

export const ChildrenAPI: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Step title="Step 1" description="Description 1" />
          <Step title="Step 2" description="Description 2" />
          <Step title="Step 3" description="Description 3" />
        </Stepper>
      </div>
    );
  },
};

// ─── All 3 Types Side by Side ────────────────────────────────────────────────

export const ThreeTypes: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
      { title: 'Step 3', description: 'Description 3' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Type 1: Default (Numbered)</h3>
          <div style={{ maxWidth: '800px' }}>
            <Stepper current={current} items={items} onChange={setCurrent} />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Type 2: Dot (Horizontal)</h3>
          <div style={{ maxWidth: '800px' }}>
            <Stepper current={current} progressDot items={items} onChange={setCurrent} />
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Type 3: Vertical with Dots</h3>
          <div style={{ maxWidth: '400px' }}>
            <Stepper
              current={current}
              direction="vertical"
              progressDot
              items={items}
              onChange={setCurrent}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))}>Previous</button>
          <button onClick={() => setCurrent(Math.min(2, current + 1))}>Next</button>
        </div>
      </div>
    );
  },
};
