import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Field } from '@/components/Field';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    closable: {
      control: 'boolean',
    },
    mask: {
      control: 'boolean',
    },
    maskClosable: {
      control: 'boolean',
    },
    keyboard: {
      control: 'boolean',
    },
    centered: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Modal Title"
        >
          <p>This is modal content. Click outside, close button, or press Esc to dismiss.</p>
        </Modal>
      </>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => {
            alert('OK clicked');
            setOpen(false);
          }}
          title="Controlled Modal"
        >
          <p>This modal is controlled by the open prop.</p>
        </Modal>
      </>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => {
    return (
      <>
        <Modal
          defaultOpen={false}
          onCancel={() => console.log('Canceled')}
          onOk={() => console.log('OK')}
          title="Uncontrolled Modal"
        >
          <p>This modal uses defaultOpen for uncontrolled state.</p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => {
            alert('OK clicked');
            setOpen(false);
          }}
          title="Modal with Footer"
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>This modal has default footer with OK and Cancel buttons.</p>
        </Modal>
      </>
    );
  },
};

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Custom Footer"
          footer={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>
                Skip
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </>
          }
        >
          <p>This modal has a custom footer.</p>
        </Modal>
      </>
    );
  },
};

export const NoFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="No Footer"
          footer={null}
        >
          <p>This modal has no footer.</p>
        </Modal>
      </>
    );
  },
};

export const NotClosable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Not Closable"
          closable={false}
          maskClosable={false}
          keyboard={false}
        >
          <p>This modal cannot be closed by clicking the X, mask, or pressing Esc.</p>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setOpen(false)}>Close via Button</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const NoMask: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="No Mask"
          mask={false}
        >
          <p>This modal has no mask/overlay.</p>
        </Modal>
      </>
    );
  },
};

export const Centered: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Centered Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Centered Modal"
          centered
        >
          <p>This modal is vertically centered.</p>
        </Modal>
      </>
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Wide Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Wide Modal"
          width={800}
        >
          <p>This modal has a custom width of 800px.</p>
        </Modal>
      </>
    );
  },
};

export const ConfirmLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
      setLoading(true);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
      alert('Operation completed!');
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleOk}
          title="Confirm Loading"
          confirmLoading={loading}
        >
          <p>Click OK to see the loading state on the button.</p>
        </Modal>
      </>
    );
  },
};

export const DestroyOnClose: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Destroy On Close"
          destroyOnClose
        >
          <div>
            <p>This modal destroys its content when closed.</p>
            <p>Counter: {count}</p>
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
            <p style={{ marginTop: '1rem', fontSize: '12px', color: '#666' }}>
              Close and reopen to see the counter reset.
            </p>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => {
            alert(`Form submitted: ${JSON.stringify(formData)}`);
            setOpen(false);
          }}
          title="Form Modal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Name" required>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </Field>
          </div>
        </Modal>
      </>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Long Content"
        >
          <div>
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i}>This is paragraph {i + 1} of a long content.</p>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};

export const StaticConfirm: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Button
          onClick={() => {
            Modal.confirm({
              title: 'Confirm Action',
              content: 'Are you sure you want to perform this action?',
              onOk: () => {
                console.log('Confirmed');
                alert('Action confirmed!');
              },
              onCancel: () => {
                console.log('Cancelled');
              },
            });
          }}
        >
          Show Confirm
        </Button>
        <Button
          onClick={() => {
            Modal.info({
              title: 'Information',
              content: 'This is an informational message.',
            });
          }}
        >
          Show Info
        </Button>
        <Button
          onClick={() => {
            Modal.success({
              title: 'Success',
              content: 'Operation completed successfully!',
            });
          }}
        >
          Show Success
        </Button>
        <Button
          onClick={() => {
            Modal.error({
              title: 'Error',
              content: 'An error occurred. Please try again.',
            });
          }}
        >
          Show Error
        </Button>
        <Button
          onClick={() => {
            Modal.warning({
              title: 'Warning',
              content: 'This action may have unintended consequences.',
            });
          }}
        >
          Show Warning
        </Button>
      </div>
    );
  },
};

export const StaticConfirmWithPromise: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Button
          onClick={() => {
            Modal.confirm({
              title: 'Delete Item',
              content: 'Are you sure you want to delete this item? This action cannot be undone.',
              okText: 'Delete',
              okType: 'primary',
              cancelText: 'Cancel',
              onOk: async () => {
                // Simulate async operation
                await new Promise((resolve) => setTimeout(resolve, 1000));
                alert('Item deleted!');
              },
            });
          }}
        >
          Delete with Promise
        </Button>
      </div>
    );
  },
};

export const CustomCloseIcon: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="Custom Close Icon"
          closeIcon={<span style={{ fontSize: '20px' }}>✕</span>}
        >
          <p>This modal has a custom close icon.</p>
        </Modal>
      </>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Full Featured Modal</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => {
            alert('OK clicked');
            setOpen(false);
          }}
          title="Full Featured Modal"
          width={600}
          centered
          okText="Save"
          cancelText="Discard"
          okType="primary"
          maskClosable
          keyboard
          closable
          afterOpenChange={(open) => {
            console.log('Modal open state changed:', open);
          }}
        >
          <div>
            <h3 style={{ marginTop: 0 }}>Features Demonstrated:</h3>
            <ul>
              <li>Custom width (600px)</li>
              <li>Centered vertically</li>
              <li>Custom OK/Cancel text</li>
              <li>Mask closable</li>
              <li>Keyboard (Esc) support</li>
              <li>After open change callback</li>
            </ul>
          </div>
        </Modal>
      </>
    );
  },
};
