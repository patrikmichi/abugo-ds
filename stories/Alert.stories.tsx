import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    description: {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert message="Success message" type="success" />
      <Alert message="Info message" type="info" />
      <Alert message="Warning message" type="warning" />
      <Alert message="Error message" type="error" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
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

export const Closable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert
        message="Closable Alert"
        description
        type="info"
        closable
      />
      <Alert
        message="Success Closable"
        description
        type="success"
        closable
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert
        message="Success Tips"
        description
        type="success"
        showIcon
      />
      <Alert
        message="Informational Notes"
        description
        type="info"
        showIcon
      />
      <Alert
        message="Warning"
        description
        type="warning"
        showIcon
      />
      <Alert
        message="Error"
        description
        type="error"
        showIcon
      />
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert
        message="Custom Icon"
        description="Alert with a custom icon."
        type="info"
        showIcon
        icon={
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            star
          </span>
        }
      />
      <Alert
        message="Another Custom Icon"
        description="Alert with another custom icon."
        type="success"
        showIcon
        icon={
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            favorite
          </span>
        }
      />
    </div>
  ),
};


export const WithAction: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert
        message="Alert with Action"
        description
        type="info"
        action={<Button size="sm">Action</Button>}
      />
      <Alert
        message="Warning with Action"
        description
        type="warning"
        action={<Button size="sm">Learn More</Button>}
        closable
      />
    </div>
  ),
};

export const ControlledClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    
    if (!visible) {
      return (
        <Button onClick={() => setVisible(true)}>Show Alert</Button>
      );
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Alert
        message="Complete Alert Example"
        description
        type="success"
        size="large"
        showIcon
        actionLabel="Action"
        onAction={() => console.log('Action clicked')}
        closable
        onClose={() => console.log('Closed')}
      />
    </div>
  ),
};
