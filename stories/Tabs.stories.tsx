import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
      { id: '2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
      { id: '3', label: 'Tab 3', content: <div>Content for Tab 3</div> },
    ],
  },
};

export const WithDefaultActive: Story = {
  args: {
    defaultActiveId: '2',
    items: [
      { id: '1', label: 'First', content: <div>First tab content</div> },
      { id: '2', label: 'Second', content: <div>Second tab content (default active)</div> },
      { id: '3', label: 'Third', content: <div>Third tab content</div> },
    ],
  },
};
