import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@/components/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    variant: 'day',
  },
};

export const Example: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Calendar variant="day">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem' }}>{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                borderRadius: '4px',
                background: i === 5 ? '#5690f5' : i === 10 ? '#e4edfd' : 'white',
                color: i === 5 ? 'white' : '#464646',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </Calendar>
    </div>
  ),
};
