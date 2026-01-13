import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '@/components/Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Link',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href="#">Default link</Link>
      <Link href="#" aria-disabled="true">Disabled link</Link>
    </div>
  ),
};
