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
    tokens: {
      componentName: 'Button',
    },
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
    appearance: {
      control: 'select',
      options: ['filled', 'plain', 'outline'],
      description: 'The visual appearance of the button (filled, plain, outline)',
      table: {
        type: { summary: 'filled | plain | outline' },
        defaultValue: { summary: 'filled (primary/danger/upgrade) or outline (secondary/tertiary)' },
      },
    },
    type: {
      control: 'select',
      options: ['filled', 'plain', 'outline'],
      description: '⚠️ Deprecated: Use `appearance` instead. The visual type of the button (filled, plain, outline)',
      table: {
        type: { summary: 'filled | plain | outline (deprecated)' },
        defaultValue: { summary: 'filled (primary/danger/upgrade) or outline (secondary/tertiary)' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA label for icon-only buttons (required when iconOnly is true)',
      table: {
        type: { summary: 'string' },
      },
    },
    disabledTooltip: {
      control: 'text',
      description: 'Tooltip text to show when button is disabled',
      table: {
        type: { summary: 'string' },
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
 * Icon-Only Buttons - Requires aria-label for accessibility
 */
export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Icon-Only Buttons (Square) - With aria-label</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" appearance="filled" iconOnly size="sm" aria-label="Add item">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" appearance="filled" iconOnly size="md" aria-label="Add item">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" appearance="filled" iconOnly size="lg" aria-label="Add item">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" appearance="plain" iconOnly aria-label="Add item">
            <ButtonIcon name="add" />
          </Button>
          <Button variant="danger" appearance="filled" iconOnly aria-label="Delete item">
            <ButtonIcon name="delete" />
          </Button>
          <Button variant="secondary" appearance="outline" iconOnly aria-label="Edit">
            <ButtonIcon name="edit" />
          </Button>
        </div>
      </div>
      <div>
        <p style={{ color: 'var(--token-semantic-content-passive-neutral-subtle)', fontSize: '0.875rem' }}>
          ⚠️ Icon-only buttons require an <code>aria-label</code> prop for screen reader accessibility.
          Check the browser console for warnings if missing.
        </p>
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
 * Disabled States - With tooltips explaining why disabled
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Disabled Buttons</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" appearance="filled" disabled>Disabled</Button>
          <Button variant="secondary" appearance="outline" disabled>Disabled</Button>
          <Button variant="danger" appearance="filled" disabled>Disabled</Button>
          <Button variant="primary" appearance="filled" iconOnly disabled aria-label="Add item">
            <ButtonIcon name="add" />
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Disabled with Tooltips</h4>
        <p style={{ color: 'var(--token-semantic-content-passive-neutral-subtle)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Hover over disabled buttons to see tooltips explaining why they're disabled.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            appearance="filled" 
            disabled 
            disabledTooltip="Please complete the form first"
          >
            Submit
          </Button>
          <Button 
            variant="danger" 
            appearance="filled" 
            disabled 
            disabledTooltip="You don't have permission to delete this item"
          >
            Delete
          </Button>
          <Button 
            variant="primary" 
            appearance="filled" 
            iconOnly 
            disabled 
            aria-label="Save"
            disabledTooltip="No changes to save"
          >
            <ButtonIcon name="save" />
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
 * Focus States - Keyboard Navigation
 * Tab through these buttons to see focus rings
 */
export const FocusStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Focus States (Keyboard Navigation)</h4>
        <p style={{ color: 'var(--token-semantic-content-passive-neutral-subtle)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Press <kbd>Tab</kbd> to navigate and see focus rings. Focus rings only appear when using keyboard, not mouse clicks.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" appearance="filled">Primary Filled</Button>
          <Button variant="secondary" appearance="outline">Secondary Outline</Button>
          <Button variant="danger" appearance="filled">Danger Filled</Button>
          <Button variant="primary" appearance="plain">Primary Plain</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * ARIA Attributes Examples
 */
export const AriaAttributes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>ARIA Attributes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>aria-label (Icon-only button):</p>
            <Button variant="primary" appearance="filled" iconOnly aria-label="Close dialog">
              <ButtonIcon name="close" />
            </Button>
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>aria-expanded (Toggle button):</p>
            <Button variant="secondary" appearance="outline" aria-expanded={false} aria-controls="menu">
              Menu
            </Button>
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>aria-pressed (Toggle state):</p>
            <Button variant="primary" appearance="plain" aria-pressed={false}>
              Toggle
            </Button>
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>aria-describedby (With help text):</p>
            <div>
              <Button 
                variant="primary" 
                appearance="filled" 
                aria-describedby="help-text"
              >
                Submit
              </Button>
              <p id="help-text" style={{ fontSize: '0.75rem', color: 'var(--token-semantic-content-passive-neutral-subtle)', marginTop: '0.25rem' }}>
                This will submit your form
              </p>
            </div>
          </div>
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
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Primary</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" appearance="filled">Filled</Button>
            <Button variant="primary" appearance="plain">Plain</Button>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Secondary</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="secondary" appearance="outline">Outline</Button>
            <Button variant="secondary" appearance="plain">Plain</Button>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Tertiary</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="tertiary" appearance="outline">Outline</Button>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Danger</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="danger" appearance="filled">Filled</Button>
            <Button variant="danger" appearance="plain">Plain</Button>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Upgrade</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="upgrade" appearance="filled">Filled</Button>
          </div>
        </div>
      </div>
    </>
  ),
};
