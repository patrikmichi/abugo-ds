import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/Skeleton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    active: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    active: false,
    loading: true,
  },
};

export const Active: Story = {
  args: {
    active: true,
    loading: true,
  },
};

export const Basic: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Skeleton />
    </div>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Skeleton avatar active />
    </div>
  ),
};

export const AvatarShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Skeleton avatar={{ shape: 'circle' }} active />
      <Skeleton avatar={{ shape: 'square' }} active />
    </div>
  ),
};

export const AvatarSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Skeleton avatar={{ size: 'small' }} active />
      <Skeleton avatar={{ size: 'default' }} active />
      <Skeleton avatar={{ size: 'large' }} active />
      <Skeleton avatar={{ size: 60 }} active />
    </div>
  ),
};

export const CustomTitle: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Skeleton title={{ width: '60%' }} active />
    </div>
  ),
};

export const CustomParagraph: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Skeleton paragraph={{ rows: 2 }} active />
      <Skeleton paragraph={{ rows: 4 }} active />
      <Skeleton paragraph={{ rows: 3, width: ['100%', '100%', '50%'] }} active />
    </div>
  ),
};

export const Round: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Skeleton round={false} active />
      <Skeleton round active />
    </div>
  ),
};

export const Complex: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Skeleton
        avatar={{ shape: 'circle', size: 'large' }}
        title={{ width: '40%' }}
        paragraph={{ rows: 4, width: ['100%', '100%', '60%'] }}
        active
        round
      />
    </div>
  ),
};

export const WithLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? 'Show Content' : 'Show Skeleton'}
          </Button>
        </div>
        <Skeleton
          loading={loading}
          avatar={{ shape: 'circle' }}
          title={{ width: '40%' }}
          paragraph={{ rows: 3 }}
          active
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              JD
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>John Doe</h3>
              <p style={{ margin: 0, color: '#666' }}>
                This is the actual content that appears when loading is false.
              </p>
            </div>
          </div>
        </Skeleton>
      </div>
    );
  },
};

export const SkeletonButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Skeleton.Button active />
        <Skeleton.Button active size="small" />
        <Skeleton.Button active size="large" />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Skeleton.Button active shape="round" />
        <Skeleton.Button active shape="circle" />
        <Skeleton.Button active shape="square" />
      </div>
      <Skeleton.Button active block />
    </div>
  ),
};

export const SkeletonImage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <Skeleton.Image active style={{ width: '100%', maxWidth: '400px' }} />
      <Skeleton.Image active style={{ width: '100%', maxWidth: '200px', aspectRatio: '1' }} />
    </div>
  ),
};

export const SkeletonInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Skeleton.Input active size="small" />
      <Skeleton.Input active />
      <Skeleton.Input active size="large" />
      <Skeleton.Input active block />
    </div>
  ),
};

export const CardExample: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <div style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? 'Load Content' : 'Show Skeleton'}
          </Button>
        </div>
        <Card
          cover={
            loading ? (
              <Skeleton.Image active style={{ width: '100%', height: '200px' }} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                }}
              >
                Image
              </div>
            )
          }
        >
          <Skeleton
            loading={loading}
            avatar={{ shape: 'circle' }}
            title={{ width: '60%' }}
            paragraph={{ rows: 3 }}
            active
          >
            <div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  JD
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>John Doe</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Software Engineer</p>
                </div>
              </div>
              <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                This is the actual card content that appears when loading is false. It can contain
                any React elements you want to display.
              </p>
            </div>
          </Skeleton>
        </Card>
      </div>
    );
  },
};

export const ListExample: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? 'Load List' : 'Show Skeleton'}
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              loading={loading}
              avatar={{ shape: 'circle' }}
              title={{ width: '40%' }}
              paragraph={{ rows: 2 }}
              active
            >
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `hsl(${item * 60}, 70%, 50%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {item}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>List Item {item}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    This is the content for list item {item}
                  </p>
                </div>
              </div>
            </Skeleton>
          ))}
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Basic Skeleton</h3>
        <Skeleton active />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>With Avatar</h3>
        <Skeleton avatar active />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Button</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton.Button active />
          <Skeleton.Button active block />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Image</h3>
        <Skeleton.Image active style={{ maxWidth: '300px' }} />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Input</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton.Input active />
          <Skeleton.Input active block />
        </div>
      </div>
    </div>
  ),
};
