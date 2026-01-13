import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@/components/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    children: 'Accordion content',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Accordion variant="default">
        <h3>Default Accordion</h3>
        <p>This is accordion content.</p>
      </Accordion>
      <Accordion variant="background">
        <h3>Background Variant</h3>
        <p>This is accordion content.</p>
      </Accordion>
    </div>
  ),
};
