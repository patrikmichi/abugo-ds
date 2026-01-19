import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from '@/components/Upload';
import { Button } from '@/components/Button';
import type { UploadFile } from '@/components/Upload';

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    drag: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Click to Upload</Button>
      </Upload>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        multiple
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Select Multiple Files</Button>
      </Upload>
    </div>
  ),
};

export const DragAndDrop: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload.Dragger
        action="/api/upload"
        multiple
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      />
    </div>
  ),
};

export const WithFileList: Story = {
  render: () => {
    const [fileList, setFileList] = useState<UploadFile[]>([
      {
        uid: '1',
        name: 'example.pdf',
        status: 'done',
        url: 'https://example.com/file.pdf',
      },
      {
        uid: '2',
        name: 'example.jpg',
        status: 'done',
        url: 'https://example.com/file.jpg',
      },
      {
        uid: '3',
        name: 'uploading.txt',
        status: 'uploading',
        percent: 50,
      },
      {
        uid: '4',
        name: 'error.doc',
        status: 'error',
      },
    ]);

    return (
      <div style={{ maxWidth: '600px' }}>
        <Upload
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          onRemove={(file) => {
            console.log('Remove:', file);
            return true;
          }}
        >
          <Button>Upload</Button>
        </Upload>
      </div>
    );
  },
};

export const PictureList: Story = {
  render: () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    return (
      <div style={{ maxWidth: '600px' }}>
        <Upload
          action="/api/upload"
          listType="picture"
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          onPreview={(file) => {
            console.log('Preview:', file);
            if (file.url) {
              window.open(file.url);
            }
          }}
        >
          <Button>Upload</Button>
        </Upload>
      </div>
    );
  },
};

export const ImageUpload: Story = {
  render: () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    return (
      <div style={{ maxWidth: '600px' }}>
        <Upload
          action="/api/upload"
          listType="image-upload"
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          onPreview={(file) => {
            console.log('Preview:', file);
            if (file.url) {
              window.open(file.url);
            }
          }}
        />
      </div>
    );
  },
};

export const WithMaxCount: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        multiple
        maxCount={3}
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Upload (Max 3 files)</Button>
      </Upload>
    </div>
  ),
};

export const WithMaxSize: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        maxSize={2 * 1024 * 1024} // 2MB
        beforeUpload={(file) => {
          if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return false;
          }
          return true;
        }}
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Upload (Max 2MB)</Button>
      </Upload>
    </div>
  ),
};

export const WithAccept: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        accept="image/*"
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Upload Images Only</Button>
      </Upload>
    </div>
  ),
};

export const CustomRequest: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        customRequest={({ file, onProgress, onSuccess, onError }) => {
          // Simulate upload
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            onProgress({ percent: progress });
            if (progress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                onSuccess({ url: 'https://example.com/uploaded.jpg' }, file);
              }, 500);
            }
          }, 200);
        }}
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Custom Upload</Button>
      </Upload>
    </div>
  ),
};

export const BeforeUpload: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        beforeUpload={(file) => {
          console.log('Before upload:', file);
          // Return false to prevent upload
          // return false;
          // Or return Promise
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(file);
            }, 1000);
          });
        }}
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Upload with Validation</Button>
      </Upload>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        disabled
        fileList={[
          {
            uid: '1',
            name: 'example.pdf',
            status: 'done',
          },
        ]}
      >
        <Button disabled>Disabled Upload</Button>
      </Upload>
    </div>
  ),
};

export const CustomButton: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        customButton={
          <div
            style={{
              padding: '16px',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#1890ff' }}>
              cloud_upload
            </span>
            <p style={{ margin: '8px 0 0 0' }}>Custom Upload Button</p>
          </div>
        }
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      />
    </div>
  ),
};

export const HideUploadList: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Upload
        action="/api/upload"
        showUploadList={false}
        onChange={(info) => {
          console.log('Upload change:', info);
        }}
      >
        <Button>Upload (No List)</Button>
      </Upload>
    </div>
  ),
};

export const AllFeatures: Story = {
  render: () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    return (
      <div style={{ maxWidth: '600px' }}>
        <Upload
          action="/api/upload"
          multiple
          maxCount={5}
          maxSize={5 * 1024 * 1024} // 5MB
          accept="image/*,.pdf"
          listType="image-upload"
          fileList={fileList}
          onChange={(info) => {
            setFileList(info.fileList);
          }}
          onRemove={(file) => {
            console.log('Remove:', file);
            return true;
          }}
          onPreview={(file) => {
            if (file.url) {
              window.open(file.url);
            }
          }}
          beforeUpload={(file) => {
            console.log('Before upload:', file);
            return true;
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              add
            </span>
            <span style={{ fontSize: '14px' }}>Upload</span>
          </div>
        </Upload>
      </div>
    );
  },
};
