import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider } from '@/components/Toast';
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
      <Button onClick={() => Toast.success('Success message')}>
        Success
      </Button>
      <Button onClick={() => Toast.error('Error message')}>
        Error
      </Button>
      <Button onClick={() => Toast.info('Info message')}>
        Info
      </Button>
      <Button onClick={() => Toast.warning('Warning message')}>
        Warning
      </Button>
      <Button onClick={() => Toast.loading('Loading message')}>
        Loading
      </Button>
    </div>
  ),
};

export const WithDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => Toast.info('Quick message (1s)', 1)}>
        1 Second
      </Button>
      <Button onClick={() => Toast.info('Default message (3s)', 3)}>
        3 Seconds (Default)
      </Button>
      <Button onClick={() => Toast.info('Long message (5s)', 5)}>
        5 Seconds
      </Button>
      <Button onClick={() => Toast.info('Persistent message (0 = no auto-dismiss)', 0)}>
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
          Toast.success('Success message', 3, () => {
            console.log('Toast closed');
            alert('Toast was closed!');
          })
        }
      >
        Success with Callback
      </Button>
      <Button
        onClick={() =>
          Toast.error('Error message', 3, () => {
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
          Current maxCount: 3 (configured globally)
        </p>
        <Button
          onClick={() => {
            setCount(count + 1);
            Toast.info(`Message ${count + 1}`);
          }}
        >
          Add Message ({count})
        </Button>
        <Button onClick={() => Toast.config({ maxCount: 5 })}>
          Set MaxCount to 5
        </Button>
        <Button onClick={() => Toast.config({ maxCount: 1 })}>
          Set MaxCount to 1
        </Button>
        <Button onClick={() => Toast.destroy()}>
          Destroy All
        </Button>
      </div>
    );
  },
};

export const GlobalConfig: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => Toast.config({ top: 24 })}>
        Set Top to 24px
      </Button>
      <Button onClick={() => Toast.config({ top: 100 })}>
        Set Top to 100px
      </Button>
      <Button onClick={() => Toast.config({ duration: 1 })}>
        Set Default Duration to 1s
      </Button>
      <Button onClick={() => Toast.config({ duration: 5 })}>
        Set Default Duration to 5s
      </Button>
      <Button onClick={() => Toast.info('Test message')}>
        Test with Current Config
      </Button>
    </div>
  ),
};

export const PromiseInterface: Story = {
  render: () => {
    const handleAsync = async () => {
      const hide = Toast.loading('Processing...', 0);
      
      try {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Toast.destroy(hide);
        Toast.success('Operation completed!');
      } catch (error) {
        Toast.destroy(hide);
        Toast.error('Operation failed!');
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


export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => Toast.info('Small Toast', 3, undefined, 'small')}>
        Small Toast
      </Button>
      <Button onClick={() => Toast.info('Large Toast', 3, undefined, 'large')}>
        Large Toast
      </Button>
      <Button onClick={() => Toast.success('Small Success', 3, undefined, 'small')}>
        Small Success
      </Button>
      <Button onClick={() => Toast.success('Large Success', 3, undefined, 'large')}>
        Large Success
      </Button>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button onClick={() => Toast.success('This is a success message')}>
        Success
      </Button>
      <Button onClick={() => Toast.error('This is an error message')}>
        Error
      </Button>
      <Button onClick={() => Toast.info('This is an info message')}>
        Info
      </Button>
      <Button onClick={() => Toast.warning('This is a warning message')}>
        Warning
      </Button>
      <Button onClick={() => Toast.loading('This is a loading message')}>
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
          Toast.info('This is a very long toast message that will wrap to multiple lines to demonstrate how the toast handles longer text content.')
        }
      >
        Long Content
      </Button>
      <Button
        onClick={() =>
          Toast.success(
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
          Toast.success('First message');
          setTimeout(() => Toast.info('Second message'), 500);
          setTimeout(() => Toast.warning('Third message'), 1000);
        }}
      >
        Show Multiple Messages
      </Button>
      <Button onClick={() => Toast.destroy()}>
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
