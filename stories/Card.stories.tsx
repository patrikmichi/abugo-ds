import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    type: {
      control: 'select',
      options: ['default', 'inner'],
    },
    hoverable: {
      control: 'boolean',
    },
    bordered: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Card content',
  },
};

export const WithTitle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Card Title">
        <p>This is the card content. It can contain any React elements.</p>
      </Card>
      <Card title="Card with Extra" extra={<a href="#">More</a>}>
        <p>Card with title and extra content in the header.</p>
      </Card>
    </div>
  ),
};

export const WithCover: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card
        title="Card with Cover"
        cover={
          <img
            alt="example"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        }
      >
        <p>This card has a cover image at the top.</p>
      </Card>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card
        title="Card with Actions"
        actions={[
          <Button key="1" size="sm">Action 1</Button>,
          <Button key="2" size="sm">Action 2</Button>,
          <Button key="3" size="sm">Action 3</Button>,
        ]}
      >
        <p>This card has action buttons at the bottom.</p>
      </Card>
    </div>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Hoverable Card" hoverable>
        <p>Hover over this card to see the lift effect.</p>
      </Card>
      <Card title="Non-hoverable Card" hoverable={false}>
        <p>This card does not lift on hover.</p>
      </Card>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Loading Card" loading>
        <p>This content will not be visible while loading.</p>
      </Card>
    </div>
  ),
};

export const Bordered: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Bordered Card" bordered>
        <p>This card has a border.</p>
      </Card>
      <Card title="No Border Card" bordered={false}>
        <p>This card has no border.</p>
      </Card>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Default Size" size="default">
        <p>Default size card with standard padding.</p>
      </Card>
      <Card title="Small Size" size="small">
        <p>Small size card with reduced padding.</p>
      </Card>
    </div>
  ),
};

export const WithMeta: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />}
          title="Card Title"
          description="This is the description"
        />
      </Card>
      <Card>
        <Card.Meta
          avatar={<Avatar>JD</Avatar>}
          title="John Doe"
          description="Software Engineer"
        />
      </Card>
    </div>
  ),
};

export const WithGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '800px' }}>
      <Card.Grid>Grid Item 1</Card.Grid>
      <Card.Grid>Grid Item 2</Card.Grid>
      <Card.Grid>Grid Item 3</Card.Grid>
      <Card.Grid>Grid Item 4</Card.Grid>
      <Card.Grid>Grid Item 5</Card.Grid>
      <Card.Grid>Grid Item 6</Card.Grid>
    </div>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card
        title="Complete Card Example"
        extra={<a href="#" style={{ color: '#1890ff' }}>More</a>}
        cover={
          <img
            alt="example"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        }
        actions={[
          <Button key="1" size="sm">Like</Button>,
          <Button key="2" size="sm">Share</Button>,
          <Button key="3" size="sm">More</Button>,
        ]}
        hoverable
      >
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />}
          title="Card Title"
          description="This is a complete card example with all features."
        />
        <p style={{ marginTop: '16px' }}>
          This card demonstrates title, extra, cover, actions, hoverable effect, and meta components.
        </p>
      </Card>
    </div>
  ),
};

export const InnerType: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card title="Default Type" type="default">
        <p>Default card type with standard border radius.</p>
      </Card>
      <Card title="Inner Type" type="inner">
        <p>Inner card type with less pronounced border.</p>
      </Card>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Card
        title="Custom Head Style"
        headStyle={{ background: '#f0f0f0', color: '#1890ff' }}
      >
        <p>Card with custom header styling.</p>
      </Card>
      <Card
        title="Custom Body Style"
        bodyStyle={{ background: '#fafafa', padding: '32px' }}
      >
        <p>Card with custom body styling.</p>
      </Card>
    </div>
  ),
};
