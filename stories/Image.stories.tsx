import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '@/components/Image';

const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    preview: {
      control: 'boolean',
    },
    placeholder: {
      control: 'boolean',
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

// Sample image URLs (using placeholder services)
const sampleImage = 'https://picsum.photos/400/300?random=1';
const sampleImage2 = 'https://picsum.photos/400/300?random=2';
const sampleImage3 = 'https://picsum.photos/400/300?random=3';
const brokenImage = 'https://invalid-url-that-does-not-exist.com/image.jpg';
const fallbackImage = 'https://via.placeholder.com/400x300?text=Fallback';

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image',
    width: 400,
    height: 300,
  },
};

export const WithPreview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Hover to see preview mask, click to open</p>
        <Image
          src={sampleImage}
          alt="Previewable image"
          width={400}
          height={300}
          preview
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Preview disabled</p>
        <Image
          src={sampleImage}
          alt="Non-previewable image"
          width={400}
          height={300}
          preview={false}
        />
      </div>
    </div>
  ),
};

export const WithPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Default placeholder</p>
        <Image
          src={sampleImage}
          alt="Image with placeholder"
          width={400}
          height={300}
          placeholder
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Custom placeholder</p>
        <Image
          src={sampleImage}
          alt="Image with custom placeholder"
          width={400}
          height={300}
          placeholder={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3 }}>
                image
              </span>
              <span style={{ fontSize: '14px', opacity: 0.5 }}>Loading...</span>
            </div>
          }
        />
      </div>
    </div>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Broken image with fallback</p>
        <Image
          src={brokenImage}
          alt="Broken image"
          width={400}
          height={300}
          fallback={fallbackImage}
          preview
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Working image (no fallback needed)</p>
        <Image
          src={sampleImage}
          alt="Working image"
          width={400}
          height={300}
          fallback={fallbackImage}
          preview
        />
      </div>
    </div>
  ),
};

export const LazyLoading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Scroll down to see lazy-loaded images. Check Network tab to see images loading on demand.
      </p>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ minHeight: '500px', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Section {i + 1}</h3>
          <Image
            src={`https://picsum.photos/400/300?random=${i + 10}`}
            alt={`Lazy loaded image ${i + 1}`}
            width={400}
            height={300}
            loading="lazy"
            placeholder
            preview
          />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small (200x150)</p>
        <Image
          src={sampleImage}
          alt="Small image"
          width={200}
          height={150}
          preview
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Medium (400x300)</p>
        <Image
          src={sampleImage}
          alt="Medium image"
          width={400}
          height={300}
          preview
        />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large (600x450)</p>
        <Image
          src={sampleImage}
          alt="Large image"
          width={600}
          height={450}
          preview
        />
      </div>
    </div>
  ),
};

export const PreviewGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
        Click any image to open preview. Use toolbar to zoom, rotate, and navigate.
      </p>
      <Image.PreviewGroup preview>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <Image
            src={sampleImage}
            alt="Image 1"
            width="100%"
            height={200}
            preview
          />
          <Image
            src={sampleImage2}
            alt="Image 2"
            width="100%"
            height={200}
            preview
          />
          <Image
            src={sampleImage3}
            alt="Image 3"
            width="100%"
            height={200}
            preview
          />
        </div>
      </Image.PreviewGroup>
    </div>
  ),
};

export const CustomPreviewMask: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Custom preview mask</p>
        <Image
          src={sampleImage}
          alt="Image with custom mask"
          width={400}
          height={300}
          preview={{
            mask: (
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>
                Click to Preview
              </div>
            ),
          }}
        />
      </div>
    </div>
  ),
};

export const AllFeatures: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Image
        src={sampleImage}
        alt="Full featured image"
        width={400}
        height={300}
        preview
        placeholder
        fallback={fallbackImage}
        loading="lazy"
      />
      <p style={{ fontSize: '14px', color: '#666' }}>
        This image demonstrates all features: preview, placeholder, fallback, and lazy loading.
      </p>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '100%' }}>
      <Image
        src={sampleImage}
        alt="Responsive image"
        width="100%"
        height="auto"
        preview
        placeholder
      />
      <p style={{ fontSize: '14px', color: '#666' }}>
        This image is responsive and will adapt to container width.
      </p>
    </div>
  ),
};
