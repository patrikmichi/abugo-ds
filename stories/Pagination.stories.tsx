import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@/components/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['numbers', 'input'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const NumbersVariant: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Pagination
          current={current}
          total={100}
          pageSize={10}
          onChange={(page) => setCurrent(page)}
          variant="numbers"
        />
      </div>
    );
  },
};

export const InputVariant: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Pagination
          current={current}
          total={100}
          pageSize={10}
          onChange={(page) => setCurrent(page)}
          variant="input"
        />
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
          <p style={{ marginBottom: '0.8rem', fontSize: '14px', fontWeight: 600 }}>Large / Default (40x40px)</p>
          <Pagination
            current={current}
            total={100}
            pageSize={10}
            onChange={(page) => setCurrent(page)}
            size="lg"
          />
        </div>
        <div>
          <p style={{ marginBottom: '0.8rem', fontSize: '14px', fontWeight: 600 }}>Small (32x32px)</p>
          <Pagination
            current={current}
            total={100}
            pageSize={10}
            onChange={(page) => setCurrent(page)}
            size="sm"
          />
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        <Pagination
          current={1}
          total={100}
          pageSize={10}
          disabled
          variant="numbers"
        />
        <Pagination
          current={1}
          total={100}
          pageSize={10}
          disabled
          variant="input"
        />
      </div>
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [current, setCurrent] = useState(50);
    return (
      <div style={{ maxWidth: '800px' }}>
        <Pagination
          current={current}
          total={1000}
          pageSize={10}
          onChange={(page) => setCurrent(page)}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: 'var(--token-semantic-text-secondary)' }}>
          Showing page {current} of {Math.ceil(1000 / 10)} pages
        </p>
      </div>
    );
  },
};
