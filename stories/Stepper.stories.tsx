import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from '@/components/Stepper';

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
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Stepper.Step title="Step 1" description="Description 1" />
          <Stepper.Step title="Step 2" description="Description 2" />
          <Stepper.Step title="Step 3" description="Description 3" />
        </Stepper>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))}>Previous</button>
          <button onClick={() => setCurrent(Math.min(2, current + 1))}>Next</button>
        </div>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Stepper.Step title="Finished" description="This is a description" />
          <Stepper.Step title="In Progress" description="This is a description" />
          <Stepper.Step title="Waiting" description="This is a description" />
        </Stepper>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>Current step: {current}</p>
      </div>
    );
  },
};

export const Directions: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Horizontal</h3>
          <Stepper current={current} direction="horizontal" onChange={setCurrent}>
            <Stepper.Step title="Step 1" description="Description 1" />
            <Stepper.Step title="Step 2" description="Description 2" />
            <Stepper.Step title="Step 3" description="Description 3" />
          </Stepper>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Vertical</h3>
          <Stepper current={current} direction="vertical" onChange={setCurrent}>
            <Stepper.Step title="Step 1" description="Description 1" />
            <Stepper.Step title="Step 2" description="Description 2" />
            <Stepper.Step title="Step 3" description="Description 3" />
          </Stepper>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Default Size</h3>
          <Stepper current={current} size="default" onChange={setCurrent}>
            <Stepper.Step title="Step 1" description="Description 1" />
            <Stepper.Step title="Step 2" description="Description 2" />
            <Stepper.Step title="Step 3" description="Description 3" />
          </Stepper>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Small Size</h3>
          <Stepper current={current} size="small" onChange={setCurrent}>
            <Stepper.Step title="Step 1" description="Description 1" />
            <Stepper.Step title="Step 2" description="Description 2" />
            <Stepper.Step title="Step 3" description="Description 3" />
          </Stepper>
        </div>
      </div>
    );
  },
};

export const Statuses: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={1}>
          <Stepper.Step title="Finished" description="This is a description" status="finish" />
          <Stepper.Step title="In Progress" description="This is a description" status="process" />
          <Stepper.Step title="Waiting" description="This is a description" status="wait" />
          <Stepper.Step title="Error" description="This is a description" status="error" />
        </Stepper>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Stepper.Step
            title="Login"
            description="Enter your credentials"
            icon={<span className="material-symbols-outlined">login</span>}
          />
          <Stepper.Step
            title="Verification"
            description="Verify your email"
            icon={<span className="material-symbols-outlined">mail</span>}
          />
          <Stepper.Step
            title="Payment"
            description="Complete payment"
            icon={<span className="material-symbols-outlined">payment</span>}
          />
        </Stepper>
      </div>
    );
  },
};

export const ProgressDot: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} progressDot onChange={setCurrent}>
          <Stepper.Step title="Step 1" description="Description 1" />
          <Stepper.Step title="Step 2" description="Description 2" />
          <Stepper.Step title="Step 3" description="Description 3" />
        </Stepper>
      </div>
    );
  },
};


export const WithError: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={2} status="error">
          <Stepper.Step title="Finished" description="This is a description" />
          <Stepper.Step title="In Progress" description="This is a description" />
          <Stepper.Step title="Error" description="This is a description" />
        </Stepper>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Stepper.Step title="Step 1" description="Description 1" />
          <Stepper.Step title="Step 2" description="Description 2" disabled />
          <Stepper.Step title="Step 3" description="Description 3" />
        </Stepper>
      </div>
    );
  },
};

export const WithoutDescription: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Stepper current={current} onChange={setCurrent}>
          <Stepper.Step title="Step 1" />
          <Stepper.Step title="Step 2" />
          <Stepper.Step title="Step 3" />
        </Stepper>
      </div>
    );
  },
};

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
          <Stepper.Step
            title="First"
            description="First step description"
            icon={<span className="material-symbols-outlined">looks_one</span>}
          />
          <Stepper.Step
            title="Second"
            description="Second step description"
            icon={<span className="material-symbols-outlined">looks_two</span>}
          />
          <Stepper.Step
            title="Third"
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

