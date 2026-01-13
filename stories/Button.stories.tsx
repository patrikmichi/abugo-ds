import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonIcon } from '@/components/Button';
import type { ButtonProps } from '@/components/Button';

/**
 * Button component with multiple variants, styles, and sizes.
 * Built using design tokens for consistent styling across the application.
 * 
 * Follows major design system patterns (MUI, Chakra UI, Ant Design):
 * - Icon support via `icon` + `iconPosition` or `startIcon`/`endIcon`
 * - Link buttons via `href` prop
 * - Full width via `fullWidth` prop
 * - Loading states via `loading` prop
 * - Proper ARIA labels for accessibility
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'tertiary', 'upgrade'],
      description: 'The visual variant of the button',
      table: {
        type: { summary: 'primary | secondary | danger | tertiary | upgrade' },
        defaultValue: { summary: 'primary' },
      },
    },
    type: {
      control: 'select',
      options: ['filled', 'plain', 'outline'],
      description: 'The visual type of the button (filled, plain, outline)',
      table: {
        type: { summary: 'filled | plain | outline' },
        defaultValue: { summary: 'filled (primary/danger/upgrade) or outline (secondary/tertiary)' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      control: 'text',
      description: 'Material Icon name (e.g., "add", "delete")',
      table: {
        type: { summary: 'string' },
      },
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Position of icon when using icon prop',
      table: {
        type: { summary: 'start | end' },
        defaultValue: { summary: 'start' },
      },
    },
    href: {
      control: 'text',
      description: 'Render as link (href) instead of button',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'The content of the button',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Default button with primary variant and filled type.
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Primary Filled Button - Most common primary action
 */
export const PrimaryFilled: Story = {
  args: {
    variant: 'primary',
    type: 'filled',
    children: 'Primary Filled',
  },
};

/**
 * Primary Plain Button - Subtle primary action
 */
export const PrimaryPlain: Story = {
  args: {
    variant: 'primary',
    type: 'plain',
    children: 'Primary Plain',
  },
};

/**
 * Secondary Outline Button - Most common secondary action
 */
export const SecondaryOutline: Story = {
  args: {
    variant: 'secondary',
    type: 'outline',
    children: 'Secondary Outline',
  },
};

/**
 * Secondary Plain Button - Subtle secondary action
 */
export const SecondaryPlain: Story = {
  args: {
    variant: 'secondary',
    type: 'plain',
    children: 'Secondary Plain',
  },
};

/**
 * Tertiary Outline Button
 */
export const TertiaryOutline: Story = {
  args: {
    variant: 'tertiary',
    type: 'outline',
    children: 'Tertiary Outline',
  },
};

/**
 * Danger Filled Button - Destructive action
 */
export const DangerFilled: Story = {
  args: {
    variant: 'danger',
    type: 'filled',
    children: 'Danger Filled',
  },
};

/**
 * Danger Plain Button - Subtle destructive action
 */
export const DangerPlain: Story = {
  args: {
    variant: 'danger',
    type: 'plain',
    children: 'Danger Plain',
  },
};

/**
 * Upgrade Filled Button - Premium CTA
 */
export const UpgradeFilled: Story = {
  args: {
    variant: 'upgrade',
    type: 'filled',
    children: 'Upgrade Filled',
  },
};

/**
 * Button Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" type="filled" size="sm">Small</Button>
      <Button variant="primary" type="filled" size="md">Medium</Button>
      <Button variant="primary" type="filled" size="lg">Large</Button>
    </div>
  ),
};

/**
 * Buttons with Icons - Using icon prop
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Icon at Start</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="filled" icon="add" iconPosition="start">
            Add Item
          </Button>
          <Button variant="secondary" type="outline" icon="download" iconPosition="start">
            Download
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Icon at End</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="plain" icon="arrow_forward" iconPosition="end">
            Continue
          </Button>
          <Button variant="secondary" type="outline" icon="chevron_right" iconPosition="end">
            Next
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Using startIcon/endIcon (Alternative API)</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="filled" startIcon={<ButtonIcon name="add" />}>
            Add Item
          </Button>
          <Button variant="primary" type="plain" endIcon={<ButtonIcon name="arrow_forward" />}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Icon-Only Buttons
 */
export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Icon-Only Buttons (Square)</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" type="filled" iconOnly size="sm">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" type="filled" iconOnly size="md">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" type="filled" iconOnly size="lg">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" type="plain" iconOnly>
            <ButtonIcon name="add" />
          </Button>
          <Button variant="danger" type="filled" iconOnly>
            <ButtonIcon name="delete" />
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Loading States
 */
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Loading States</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="filled" loading>Loading</Button>
          <Button variant="secondary" type="outline" loading>Loading</Button>
          <Button variant="danger" type="filled" loading>Loading</Button>
          <Button variant="primary" type="filled" iconOnly loading>
            <ButtonIcon name="add" />
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Loading Sizes</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" type="filled" size="sm" loading>Loading</Button>
          <Button variant="primary" type="filled" size="md" loading>Loading</Button>
          <Button variant="primary" type="filled" size="lg" loading>Loading</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Disabled States
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Disabled Buttons</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="filled" disabled>Disabled</Button>
          <Button variant="secondary" type="outline" disabled>Disabled</Button>
          <Button variant="danger" type="filled" disabled>Disabled</Button>
          <Button variant="primary" type="filled" iconOnly disabled>
            <ButtonIcon name="add" />
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Full Width Buttons
 */
export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button variant="primary" type="filled" fullWidth>Full Width Button</Button>
      <Button variant="secondary" type="outline" fullWidth>Full Width Outline</Button>
      <Button variant="primary" type="filled" fullWidth icon="add" iconPosition="start">
        Full Width with Icon
      </Button>
    </div>
  ),
};

/**
 * Link Buttons - Render as anchor tags
 */
export const LinkButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Internal Links</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button href="/page" variant="primary" type="filled">Go to Page</Button>
          <Button href="/about" variant="secondary" type="outline">About</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>External Links</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button href="https://example.com" target="_blank" variant="primary" type="filled">
            External Link
          </Button>
          <Button 
            href="https://example.com" 
            target="_blank" 
            variant="secondary" 
            type="outline"
            icon="open_in_new"
            iconPosition="end"
          >
            Open in New Tab
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * All Variants Overview
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Primary</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" type="filled">Filled</Button>
          <Button variant="primary" type="plain">Plain</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Secondary</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" type="outline">Outline</Button>
          <Button variant="secondary" type="plain">Plain</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Tertiary</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="tertiary" type="outline">Outline</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Danger</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="danger" type="filled">Filled</Button>
          <Button variant="danger" type="plain">Plain</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Upgrade</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="upgrade" type="filled">Filled</Button>
        </div>
      </div>
    </div>
  ),
};
