import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@/components/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    variant: 'item',
  },
};

export const Example: Story = {
  render: () => (
    <div>
      <Pagination variant="item">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.5rem', border: '1px solid #e0e0e0', borderRadius: '4px', background: 'white' }}>1</button>
          <button style={{ padding: '0.5rem', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#5690f5', color: 'white' }}>2</button>
          <button style={{ padding: '0.5rem', border: '1px solid #e0e0e0', borderRadius: '4px', background: 'white' }}>3</button>
        </div>
      </Pagination>
    </div>
  ),
};
