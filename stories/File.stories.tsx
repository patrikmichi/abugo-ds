import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { File } from '@/components/File';

const meta: Meta<typeof File> = {
  title: 'Components/File',
  component: File,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof File>;

export const Default: Story = {
  args: {
    variant: 'upload',
  },
};

export const Upload: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <File variant="upload">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📁</p>
          <p>Drag and drop files here or click to browse</p>
          <p style={{ fontSize: '0.875rem', color: '#737373', marginTop: '0.5rem' }}>Max file size: 10MB</p>
        </div>
      </File>
    </div>
  ),
};
