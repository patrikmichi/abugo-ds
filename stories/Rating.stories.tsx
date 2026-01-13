import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from '@/components/Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Interactive: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div>
        <Rating variant="default">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer' }}
            >
              {star <= rating ? '★' : '☆'}
            </span>
          ))}
        </Rating>
        <p style={{ marginTop: '1rem' }}>Rating: {rating}</p>
      </div>
    );
  },
};
