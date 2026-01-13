import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonIcon } from '@/components/Button';
import type { ButtonProps } from '@/components/Button';
import {
  PrimaryButton,
  PrimaryPlainButton,
  SecondaryButton,
  SecondaryPlainButton,
  TertiaryButton,
  DangerButton,
  DangerPlainButton,
  UpgradeButton,
} from '@/components/Button';

/**
 * Button component with multiple variants, styles, and sizes.
 * Built using design tokens for consistent styling across the application.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  // tags: ['autodocs'], // Temporarily disabled due to Storybook 10.1.11 renderer bug
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
 * Primary button variant with filled type.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    type: 'filled',
    children: 'Primary Button',
  },
};

/**
 * Showcase of all button variants, types, and sizes.
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
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Sizes</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" type="filled" size="sm">Small</Button>
          <Button variant="primary" type="filled" size="md">Medium</Button>
          <Button variant="primary" type="filled" size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Buttons with icons and icon-only buttons - Matching Figma designs
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Text with Icons</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" type="filled" startIcon={<ButtonIcon name="add" />}>
            Add Item
          </Button>
          <Button variant="primary" type="plain" endIcon={<ButtonIcon name="arrow_forward" />}>
            Continue
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Icon-Only Buttons</h4>
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
 * Exact match to Figma designs
 */
export const FigmaDesigns: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      {/* Filled button with icon and text */}
      <Button variant="primary" type="filled" startIcon={<ButtonIcon name="add" />}>
        Add Item
      </Button>
      
      {/* Text button with icon */}
      <Button variant="primary" type="plain" endIcon={<ButtonIcon name="arrow_forward" />}>
        Continue
      </Button>
      
      {/* Icon-Only Buttons section */}
      <div>
        <h4 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1rem' }}>Icon-Only Buttons</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" type="filled" iconOnly>
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" type="filled" iconOnly>
            <ButtonIcon name="add" />
          </Button>
          <Button variant="primary" type="filled" iconOnly>
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
 * Loading state buttons
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
 * Convenience wrapper components for common button patterns.
 * These provide a simpler API for the most common use cases.
 */
export const WrapperComponents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Convenience Wrappers</h4>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Use these wrapper components for simpler, more semantic APIs:
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <PrimaryButton>Primary Button</PrimaryButton>
          <PrimaryPlainButton>Primary Plain</PrimaryPlainButton>
          <SecondaryButton>Secondary Button</SecondaryButton>
          <SecondaryPlainButton>Secondary Plain</SecondaryPlainButton>
          <TertiaryButton>Tertiary Button</TertiaryButton>
          <DangerButton>Danger Button</DangerButton>
          <DangerPlainButton>Danger Plain</DangerPlainButton>
          <UpgradeButton>Upgrade Button</UpgradeButton>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>With Sizes</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <PrimaryButton size="sm">Small</PrimaryButton>
          <PrimaryButton size="md">Medium</PrimaryButton>
          <PrimaryButton size="lg">Large</PrimaryButton>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Comparison</h4>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Wrapper components vs. base Button component:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <code style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              {'<PrimaryButton>Save</PrimaryButton>'}
            </code>
            <PrimaryButton>Save</PrimaryButton>
          </div>
          <div>
            <code style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              {'<Button variant="primary" type="filled">Save</Button>'}
            </code>
            <Button variant="primary" type="filled">Save</Button>
          </div>
        </div>
      </div>
    </div>
  ),
};
