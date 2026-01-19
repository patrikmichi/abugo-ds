import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from '@/components/Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
    },
    count: {
      control: { type: 'number', min: 0 },
    },
    mode: {
      control: 'select',
      options: ['multi', 'single'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    value: 4.4,
    count: 123,
  },
};

export const MultiStar: Story = {
  args: {
    value: 4.4,
    count: 123,
    mode: 'multi',
  },
};

export const SingleStar: Story = {
  args: {
    value: 4.4,
    count: 123,
    mode: 'single',
  },
};

export const WithoutCount: Story = {
  args: {
    value: 4.5,
  },
};

export const VariousRatings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Rating value={5} count={1000} />
      <Rating value={4.7} count={500} />
      <Rating value={4.4} count={123} />
      <Rating value={3.5} count={50} />
      <Rating value={2.1} count={10} />
      <Rating value={1.0} count={5} />
    </div>
  ),
};

export const SingleStarMode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Rating value={5} count={1000} mode="single" />
      <Rating value={4.7} count={500} mode="single" />
      <Rating value={4.4} count={123} mode="single" />
      <Rating value={3.5} count={50} mode="single" />
    </div>
  ),
};

export const PartialStars: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Rating value={4.1} count={100} />
      <Rating value={4.2} count={100} />
      <Rating value={4.3} count={100} />
      <Rating value={4.4} count={100} />
      <Rating value={4.5} count={100} />
      <Rating value={4.6} count={100} />
      <Rating value={4.7} count={100} />
      <Rating value={4.8} count={100} />
      <Rating value={4.9} count={100} />
    </div>
  ),
};
