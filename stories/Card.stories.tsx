import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Card content',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card>Default card</Card>
      <Card variant="strong">Strong variant</Card>
      <Card selected>Selected card</Card>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <h3 style={{ marginTop: 0 }}>Card Title</h3>
      <p>This is card content with some text to demonstrate the card component.</p>
    </Card>
  ),
};
