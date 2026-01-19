import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@/components/Field';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select/Select';
import { Textarea } from '@/components/Textarea';
import { InputNumber } from '@/components/InputNumber';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    validateStatus: {
      control: 'select',
      options: ['error', 'warning', 'success', 'validating'],
    },
    labelAlign: {
      control: 'select',
      options: ['left', 'right'],
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width (e.g., "400px", "50%", "600px")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    label: 'Email',
    children: <Input type="email" placeholder="Enter email" />,
  },
};

export const WithMaxWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Field label="Narrow field (300px)" maxWidth="300px">
        <Input placeholder="Enter text" />
      </Field>
      <Field label="Medium field (400px)" maxWidth="400px">
        <Input placeholder="Enter text" />
      </Field>
      <Field label="Wide field (600px)" maxWidth="600px">
        <Input placeholder="Enter text" />
      </Field>
      <Field label="Full width (no maxWidth)">
        <Input placeholder="Enter text" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    error: 'This field is required',
    children: <Input type="email" placeholder="Enter email" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    children: <Input type="password" placeholder="Enter password" />,
  },
};

export const WithExtra: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <Field
        label="Username"
        extra="This will be your public profile name"
        children={<Input placeholder="Enter username" />}
      />
      <Field
        label="Email"
        help="We'll never share your email"
        extra="Optional: Receive updates about your account"
        children={<Input type="email" placeholder="Enter email" />}
      />
    </div>
  ),
};

export const LabelAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field label="Left aligned" labelAlign="left">
        <Input placeholder="Label on the left" />
      </Field>
      <Field label="Right aligned (default)" labelAlign="right">
        <Input placeholder="Label on the right" />
      </Field>
    </div>
  ),
};

export const WithColon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field label="With colon (default)" colon>
        <Input placeholder="Colon after label" />
      </Field>
      <Field label="Without colon" colon={false}>
        <Input placeholder="No colon after label" />
      </Field>
    </div>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field
        label="Email"
        tooltip="Enter your email address for account verification"
      >
        <Input type="email" placeholder="Enter email" />
      </Field>
      <Field
        label="Password"
        tooltip="Must contain at least 8 characters, including uppercase, lowercase, and numbers"
      >
        <Input type="password" placeholder="Enter password" />
      </Field>
    </div>
  ),
};

export const ValidationStatus: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <Field
          label="Error status"
          validateStatus="error"
          error="This field has an error"
          hasFeedback
        >
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Error state" />
        </Field>
        <Field
          label="Warning status"
          validateStatus="warning"
          hasFeedback
        >
          <Input placeholder="Warning state" />
        </Field>
        <Field
          label="Success status"
          validateStatus="success"
          hasFeedback
        >
          <Input placeholder="Success state" />
        </Field>
        <Field
          label="Validating status"
          validateStatus="validating"
          hasFeedback
        >
          <Input placeholder="Validating state" />
        </Field>
      </div>
    );
  },
};

export const WithFeedback: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field
        label="Email"
        validateStatus="success"
        hasFeedback
      >
        <Input type="email" placeholder="Valid email" />
      </Field>
      <Field
        label="Password"
        validateStatus="error"
        error="Password is too short"
        hasFeedback
      >
        <Input type="password" placeholder="Invalid password" />
      </Field>
      <Field
        label="Username"
        validateStatus="validating"
        hasFeedback
      >
        <Input placeholder="Checking availability..." />
      </Field>
    </div>
  ),
};

export const LayoutControl: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Default Layout</h3>
        <Field label="Email">
          <Input placeholder="Default layout" />
        </Field>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Grid Layout (labelCol: 6, wrapperCol: 18)</h3>
        <Field label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Input placeholder="Grid layout" />
        </Field>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Numeric Layout (labelCol: 4)</h3>
        <Field label="Email" labelCol={4}>
          <Input placeholder="Numeric layout" />
        </Field>
      </div>
    </div>
  ),
};

export const AllFieldTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field label="Text Input" maxWidth="400px">
        <Input placeholder="Enter text" />
      </Field>
      <Field label="Select" maxWidth="400px">
        <Select>
          <option value="">Choose an option...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </Field>
      <Field label="Textarea" maxWidth="400px">
        <Textarea placeholder="Enter message" />
      </Field>
      <Field label="Input Number" maxWidth="400px">
        <InputNumber placeholder="Enter number" />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <Field label="Small" size="sm">
        <Input placeholder="Small size" />
      </Field>
      <Field label="Medium (default)" size="md">
        <Input placeholder="Medium size" />
      </Field>
      <Field label="Large" size="lg">
        <Input placeholder="Large size" />
      </Field>
    </div>
  ),
};

export const NoStyle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <p>NoStyle mode removes all wrapper styles - useful for custom layouts:</p>
      <Field noStyle>
        <Input placeholder="No wrapper styles" />
      </Field>
      <Field noStyle error="Error message still works">
        <Input placeholder="Error state without wrapper" />
      </Field>
    </div>
  ),
};

export const Hidden: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <Field label="Visible field">
        <Input placeholder="This field is visible" />
      </Field>
      <Field label="Hidden field" hidden>
        <Input placeholder="This field is hidden" />
      </Field>
      <Field label="Another visible field">
        <Input placeholder="This field is visible" />
      </Field>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Field label="First Name" required>
        <Input placeholder="John" />
      </Field>
      <Field label="Last Name" required>
        <Input placeholder="Doe" />
      </Field>
      <Field 
        label="Email" 
        required 
        error="Email is required"
        tooltip="We'll use this to send you important updates"
      >
        <Input type="email" placeholder="john@example.com" />
      </Field>
      <Field label="Country">
        <Select>
          <option value="">Select country...</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="cz">Czech Republic</option>
        </Select>
      </Field>
      <Field 
        label="Message" 
        helperText="Tell us about yourself"
        extra="Optional: Additional information about your inquiry"
      >
        <Textarea placeholder="Enter your message..." rows={4} />
      </Field>
      <Field 
        label="Age" 
        validateStatus="success"
        hasFeedback
      >
        <InputNumber min={0} max={120} placeholder="Enter age" />
      </Field>
    </form>
  ),
};

export const ComplexExample: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const emailError = email && !email.includes('@') ? 'Invalid email format' : undefined;
    const passwordError = password && password.length < 8 ? 'Password must be at least 8 characters' : undefined;
    const confirmError = confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined;
    
    return (
      <form style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Field
          label="Email"
          required
          error={emailError}
          validateStatus={emailError ? 'error' : email ? 'success' : undefined}
          hasFeedback
          tooltip="Enter a valid email address"
        >
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com" 
          />
        </Field>
        
        <Field
          label="Password"
          required
          error={passwordError}
          validateStatus={passwordError ? 'error' : password && password.length >= 8 ? 'success' : undefined}
          hasFeedback
          helperText="Must be at least 8 characters"
        >
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password" 
          />
        </Field>
        
        <Field
          label="Confirm Password"
          required
          error={confirmError}
          validateStatus={confirmError ? 'error' : confirmPassword && password === confirmPassword ? 'success' : undefined}
          hasFeedback
        >
          <Input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password" 
          />
        </Field>
      </form>
    );
  },
};
