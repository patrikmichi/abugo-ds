import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider, toastManager } from '@/components/Toast';
import { Button } from '@/components/Button';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', 'loading'],
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    content: 'Toast message',
    type: 'info',
  },
};

export const StaticMethods: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => toastManager.success('Success message')}>
        Success
      </Button>
      <Button onClick={() => toastManager.error('Error message')}>
        Error
      </Button>
      <Button onClick={() => toastManager.info('Info message')}>
        Info
      </Button>
      <Button onClick={() => toastManager.warning('Warning message')}>
        Warning
      </Button>
      <Button onClick={() => toastManager.loading('Loading message')}>
        Loading
      </Button>
    </div>
  ),
};

export const WithDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => toastManager.info('Quick message (1s)', 1)}>
        1 Second
      </Button>
      <Button onClick={() => toastManager.info('Default message (3s)', 3)}>
        3 Seconds (Default)
      </Button>
      <Button onClick={() => toastManager.info('Long message (5s)', 5)}>
        5 Seconds
      </Button>
      <Button onClick={() => toastManager.info('Persistent message (0 = no auto-dismiss)', 0)}>
        Persistent (0s)
      </Button>
    </div>
  ),
};

export const WithCallback: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          toastManager.success('Success message', 3, () => {
            console.log('Toast closed');
            alert('Toast was closed!');
          })
        }
      >
        Success with Callback
      </Button>
      <Button
        onClick={() =>
          toastManager.error('Error message', 3, () => {
            console.log('Error toast closed');
          })
        }
      >
        Error with Callback
      </Button>
    </div>
  ),
};

export const MaxCount: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Click to add toast messages
        </p>
        <Button
          onClick={() => {
            setCount(count + 1);
            toastManager.info(`Message ${count + 1}`);
          }}
        >
          Add Message ({count})
        </Button>
        <Button onClick={() => toastManager.destroy()}>
          Destroy All
        </Button>
      </div>
    );
  },
};

export const PromiseInterface: Story = {
  render: () => {
    const handleAsync = async () => {
      const hide = toastManager.loading('Processing...', 0);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toastManager.destroy(hide);
        toastManager.success('Operation completed!');
      } catch {
        toastManager.destroy(hide);
        toastManager.error('Operation failed!');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Button onClick={handleAsync}>
          Async Operation with Loading
        </Button>
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => toastManager.success('This is a success message')}>
        Success
      </Button>
      <Button onClick={() => toastManager.error('This is an error message')}>
        Error
      </Button>
      <Button onClick={() => toastManager.info('This is an info message')}>
        Info
      </Button>
      <Button onClick={() => toastManager.warning('This is a warning message')}>
        Warning
      </Button>
      <Button onClick={() => toastManager.loading('This is a loading message')}>
        Loading
      </Button>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          toastManager.info('This is a very long toast message that will wrap to multiple lines to demonstrate how the toast handles longer text content.')
        }
      >
        Long Content
      </Button>
      <Button
        onClick={() =>
          toastManager.success(
            <>
              <strong>Success!</strong>
              <br />
              This is a multi-line message with <strong>formatted</strong> content.
            </>
          )
        }
      >
        Rich Content
      </Button>
    </div>
  ),
};

export const MultipleMessages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() => {
          toastManager.success('First message');
          setTimeout(() => toastManager.info('Second message'), 500);
          setTimeout(() => toastManager.warning('Third message'), 1000);
        }}
      >
        Show Multiple Messages
      </Button>
      <Button onClick={() => toastManager.destroy()}>
        Clear All Messages
      </Button>
    </div>
  ),
};

export const IndividualComponent: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
        {visible && (
          <Toast
            type="info"
            size="small"
            content="This is an individual Toast component (not using static methods)"
            duration={0}
            onClose={() => setVisible(false)}
          />
        )}
        <Button onClick={() => setVisible(true)}>
          Show Individual Toast
        </Button>
      </div>
    );
  },
};
