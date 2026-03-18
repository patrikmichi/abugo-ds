import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
    closable: {
      control: 'boolean',
    },
    showIcon: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    message: 'This is an alert message',
    type: 'info',
  },
};

export const Types: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert message="Success message" type="success" />
      <Alert message="Info message" type="info" />
      <Alert message="Warning message" type="warning" />
      <Alert message="Error message" type="error" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert
        message="Success Tips"
        description="Detailed description and advice about successful copywriting."
        type="success"
      />
      <Alert
        message="Informational Notes"
        description="Additional description and information about copywriting."
        type="info"
      />
      <Alert
        message="Warning"
        description="This is a warning notice about copywriting."
        type="warning"
      />
      <Alert
        message="Error"
        description="This is an error message about copywriting."
        type="error"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert message="Small alert (12px padding)" type="info" size="small" />
      <Alert message="Large alert (20px padding)" type="info" size="large" />
      <Alert
        message="Small with description"
        description="Description text below the headline."
        type="success"
        size="small"
      />
      <Alert
        message="Large with description"
        description="Description text below the headline."
        type="success"
        size="large"
      />
    </div>
  ),
};

export const Closable: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert
        message="Closable alert without description"
        type="info"
        closable
      />
      <Alert
        message="Closable alert with description"
        description="The close button is top-aligned when description is present."
        type="success"
        closable
      />
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert
        message="Custom Icon"
        description="Alert with a custom icon."
        type="info"
        icon={
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '24px' }}
          >
            star
          </span>
        }
      />
      <Alert
        message="Another Custom Icon"
        description="Alert with another custom icon."
        type="success"
        icon={
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '24px' }}
          >
            favorite
          </span>
        }
      />
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    size: 'large',
  },

  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert
        message="Alert with Action"
        description="This alert includes an action button."
        type="info"
        size="large"
        actions={{
          label: 'View Details',
          variant: 'primary',
          onClick: () => alert('Clicked!'),
        }}
      />
      <Alert
        message="Multiple Actions"
        description="This alert includes multiple action buttons."
        type="warning"
        size="large"
        actions={[
          { label: 'Take Action', variant: 'primary' },
          { label: 'Dismiss', variant: 'secondary', appearance: 'plain' },
        ]}
        closable
      />
    </div>
  ),
};

export const ControlledClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return <Button onClick={() => setVisible(true)}>Show Alert</Button>;
    }

    return (
      <Alert
        message="Controlled Alert"
        description="This alert's visibility is controlled by state."
        type="info"
        closable
        onClose={() => {
          console.log('Alert closed');
          setVisible(false);
        }}
        afterClose={() => {
          console.log('Close animation finished');
        }}
      />
    );
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '600px',
      }}
    >
      <Alert
        message="Complete Alert Example"
        description="Alert with all features enabled."
        type="success"
        size="large"
        actions={{
          label: 'Action',
          variant: 'primary',
          onClick: () => console.log('Action clicked'),
        }}
        closable
        onClose={() => console.log('Closed')}
      />
    </div>
  ),
};
