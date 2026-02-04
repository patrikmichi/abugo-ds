import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Field } from '@/components/Field';
import modalStyles from '@/components/Modal/Modal.module.css';
import { cn } from '@/lib/utils';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
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
          onOk={() => setOpen(false)}
          title="Modal Title"
        >
          <p>This is modal content. Click outside, close button, or press Esc to dismiss.</p>
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
              <Button variant="tertiary" appearance="outline" onClick={() => setOpen(false)}>
                Skip
              </Button>
              <Button variant="primary" appearance="filled" onClick={() => setOpen(false)}>
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

export const ConfirmLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
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
          onOk={() => setOpen(false)}
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

/* ==========================================================================
   Dialogs
   ========================================================================== */

export const DangerDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Danger Action</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          closable={false}
          footer={null}
          width={400}
          centered
        >
          <div className={modalStyles.dialogBody}>
            <div className={cn(modalStyles.dialogIcon, modalStyles.dialogIconDanger)}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            </div>
            <h3 className={modalStyles.dialogTitle}>Delete item</h3>
            <p className={modalStyles.dialogDescription}>
              Are you sure that you want to delete this item? This action cannot be reversed.
            </p>
            <div className={modalStyles.dialogButtons}>
              <Button variant="danger" appearance="filled" fullWidth onClick={() => setOpen(false)}>Delete</Button>
              <Button variant="tertiary" appearance="outline" fullWidth onClick={() => setOpen(false)}>Keep</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const WarningDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Warning Action</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          closable={false}
          footer={null}
          width={400}
          centered
        >
          <div className={modalStyles.dialogBody}>
            <div className={cn(modalStyles.dialogIcon, modalStyles.dialogIconWarning)}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className={modalStyles.dialogTitle}>Discard unsaved changes</h3>
            <p className={modalStyles.dialogDescription}>
              Are you sure that you want to discard changes? This action cannot be reversed.
            </p>
            <div className={modalStyles.dialogButtons}>
              <Button variant="primary" appearance="filled" fullWidth onClick={() => setOpen(false)}>Keep changes</Button>
              <Button variant="tertiary" appearance="outline" fullWidth onClick={() => setOpen(false)}>Discard</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const InfoDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Info Action</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          closable={false}
          footer={null}
          width={400}
          centered
        >
          <div className={modalStyles.dialogBody}>
            <div className={cn(modalStyles.dialogIcon, modalStyles.dialogIconInfo)}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            </div>
            <h3 className={modalStyles.dialogTitle}>Info message</h3>
            <p className={modalStyles.dialogDescription}>
              Lorem ipsum dolor sit amet consectetur. Leo sollicitudin quam pellentesque gravida accumsan pellentesque aliquam pellentesque.
            </p>
            <div className={modalStyles.dialogButtons}>
              <Button variant="primary" appearance="filled" fullWidth onClick={() => setOpen(false)}>Upgrade</Button>
              <Button variant="tertiary" appearance="outline" fullWidth onClick={() => setOpen(false)}>No, thanks</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const SuccessDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Success Action</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          closable={false}
          footer={null}
          width={400}
          centered
        >
          <div className={modalStyles.dialogBody}>
            <div className={cn(modalStyles.dialogIcon, modalStyles.dialogIconSuccess)}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className={modalStyles.dialogTitle}>Action completed</h3>
            <p className={modalStyles.dialogDescription}>
              Your changes have been saved successfully.
            </p>
            <div className={modalStyles.dialogButtons}>
              <Button variant="primary" appearance="filled" fullWidth onClick={() => setOpen(false)}>Continue</Button>
              <Button variant="tertiary" appearance="outline" fullWidth onClick={() => setOpen(false)}>Go back</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const ConfirmDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Confirm Action</Button>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          closable={false}
          footer={null}
          width={400}
          centered
        >
          <div className={modalStyles.dialogBody}>
            <div className={cn(modalStyles.dialogIcon, modalStyles.dialogIconConfirm)}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
            </div>
            <h3 className={modalStyles.dialogTitle}>Confirm action</h3>
            <p className={modalStyles.dialogDescription}>
              Are you sure you want to proceed with this action?
            </p>
            <div className={modalStyles.dialogButtons}>
              <Button variant="primary" appearance="filled" fullWidth onClick={() => setOpen(false)}>Confirm</Button>
              <Button variant="tertiary" appearance="outline" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
