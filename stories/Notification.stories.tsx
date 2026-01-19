import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Notification, NotificationProvider } from '@/components/Notification';
import { Button } from '@/components/Button';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <NotificationProvider>
        <Story />
      </NotificationProvider>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
    placement: {
      control: 'select',
      options: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  args: {
    message: 'Notification Title',
    description: 'This is the notification description.',
    type: 'info',
  },
};

export const StaticMethods: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.open({
            message: 'Notification Title',
            description: 'This is a basic notification.',
          })
        }
      >
        Open
      </Button>
      <Button
        onClick={() =>
          Notification.success({
            message: 'Success',
            description: 'Operation completed successfully!',
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          Notification.error({
            message: 'Error',
            description: 'An error occurred. Please try again.',
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Information',
            description: 'This is an informational message.',
          })
        }
      >
        Info
      </Button>
      <Button
        onClick={() =>
          Notification.warning({
            message: 'Warning',
            description: 'This action may have unintended consequences.',
          })
        }
      >
        Warning
      </Button>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Top Left',
            description: 'This notification appears in the top left corner.',
            placement: 'topLeft',
          })
        }
      >
        Top Left
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Top Right',
            description: 'This notification appears in the top right corner.',
            placement: 'topRight',
          })
        }
      >
        Top Right (Default)
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Bottom Left',
            description: 'This notification appears in the bottom left corner.',
            placement: 'bottomLeft',
          })
        }
      >
        Bottom Left
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Bottom Right',
            description: 'This notification appears in the bottom right corner.',
            placement: 'bottomRight',
          })
        }
      >
        Bottom Right
      </Button>
    </div>
  ),
};

export const WithDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Quick (2s)',
            description: 'This notification will close in 2 seconds.',
            duration: 2,
          })
        }
      >
        2 Seconds
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Default (4.5s)',
            description: 'This notification will close in 4.5 seconds (default).',
          })
        }
      >
        Default Duration
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Long (10s)',
            description: 'This notification will close in 10 seconds.',
            duration: 10,
          })
        }
      >
        10 Seconds
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Persistent',
            description: 'This notification will not auto-close (duration: 0).',
            duration: 0,
          })
        }
      >
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
          Notification.success({
            message: 'With Callback',
            description: 'Check the console when this notification closes.',
            onClose: () => {
              console.log('Notification closed');
              alert('Notification was closed!');
            },
          })
        }
      >
        Success with Callback
      </Button>
      <Button
        onClick={() =>
          Notification.error({
            message: 'With Callback',
            description: 'Check the console when this notification closes.',
            onClose: () => {
              console.log('Error notification closed');
            },
          })
        }
      >
        Error with Callback
      </Button>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Notification with Button',
            description: 'This notification includes a custom action button.',
            btn: (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Button clicked!');
                }}
              >
                View Details
              </Button>
            ),
          })
        }
      >
        With Button
      </Button>
      <Button
        onClick={() =>
          Notification.warning({
            message: 'Action Required',
            description: 'Please review and take action.',
            btn: (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="text" size="sm">
                  Dismiss
                </Button>
                <Button variant="primary" size="sm">
                  Take Action
                </Button>
              </div>
            ),
          })
        }
      >
        With Multiple Buttons
      </Button>
    </div>
  ),
};

export const WithOnClick: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Clickable Notification',
            description: 'Click anywhere on this notification to trigger an action.',
            onClick: () => {
              alert('Notification clicked!');
            },
          })
        }
      >
        Clickable Notification
      </Button>
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Custom Icon',
            description: 'This notification has a custom icon.',
            icon: (
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#722ed1' }}>
                notifications
              </span>
            ),
          })
        }
      >
        Custom Icon
      </Button>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Long Title That May Wrap to Multiple Lines',
            description:
              'This is a very long description that demonstrates how the notification handles longer text content. It should wrap properly and maintain good readability.',
          })
        }
      >
        Long Content
      </Button>
      <Button
        onClick={() =>
          Notification.success({
            message: 'Rich Content',
            description: (
              <>
                This notification supports <strong>rich content</strong> including{' '}
                <em>formatting</em> and <code>code</code>.
              </>
            ),
          })
        }
      >
        Rich Content
      </Button>
    </div>
  ),
};

export const MultipleNotifications: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Button
          onClick={() => {
            setCount(count + 1);
            Notification.info({
              message: `Notification ${count + 1}`,
              description: 'Multiple notifications can be displayed simultaneously.',
            });
          }}
        >
          Add Notification ({count})
        </Button>
        <Button onClick={() => Notification.destroy()}>Destroy All</Button>
      </div>
    );
  },
};

export const GlobalConfig: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() => {
          Notification.config({ top: 24 });
          Notification.info({
            message: 'Top: 24px',
            description: 'Global top position set to 24px.',
          });
        }}
      >
        Set Top to 24px
      </Button>
      <Button
        onClick={() => {
          Notification.config({ top: 100 });
          Notification.info({
            message: 'Top: 100px',
            description: 'Global top position set to 100px.',
          });
        }}
      >
        Set Top to 100px
      </Button>
      <Button
        onClick={() => {
          Notification.config({ duration: 2 });
          Notification.info({
            message: 'Default Duration: 2s',
            description: 'Global default duration set to 2 seconds.',
          });
        }}
      >
        Set Default Duration to 2s
      </Button>
      <Button
        onClick={() => {
          Notification.config({ placement: 'topLeft' });
          Notification.info({
            message: 'Default Placement: topLeft',
            description: 'Global default placement set to topLeft.',
          });
        }}
      >
        Set Default Placement to topLeft
      </Button>
    </div>
  ),
};

export const CloseSpecific: Story = {
  render: () => {
    const [key, setKey] = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Button
          onClick={() => {
            const notificationKey = Notification.info({
              message: 'Closeable Notification',
              description: 'This notification can be closed programmatically.',
              duration: 0, // Persistent
            });
            setKey(notificationKey);
          }}
        >
          Show Notification
        </Button>
        <Button
          onClick={() => {
            if (key) {
              Notification.close(key);
              setKey(null);
            }
          }}
          disabled={!key}
        >
          Close Specific Notification
        </Button>
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Button
        onClick={() =>
          Notification.success({
            message: 'Success',
            description: 'This is a success notification.',
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          Notification.error({
            message: 'Error',
            description: 'This is an error notification.',
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          Notification.info({
            message: 'Info',
            description: 'This is an info notification.',
          })
        }
      >
        Info
      </Button>
      <Button
        onClick={() =>
          Notification.warning({
            message: 'Warning',
            description: 'This is a warning notification.',
          })
        }
      >
        Warning
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
          <Notification
            message="Individual Notification"
            description="This is an individual Notification component (not using static methods)."
            type="info"
            placement="topRight"
            duration={0}
            onClose={() => setVisible(false)}
          />
        )}
        <Button onClick={() => setVisible(true)}>Show Individual Notification</Button>
      </div>
    );
  },
};
