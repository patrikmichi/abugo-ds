import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => {
    return (
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const WithHomeIcon: Story = {
  render: () => {
    return (
      <Breadcrumbs homeIcon>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const IconSeparator: Story = {
  render: () => {
    return (
      <Breadcrumbs
        separator={
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            chevron_right
          </span>
        }
      >
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const LongPath: Story = {
  render: () => {
    return (
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products/electronics">Electronics</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products/electronics/computers">Computers</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products/electronics/computers/laptops">Laptops</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Product</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const WithOnClick: Story = {
  render: () => {
    return (
      <Breadcrumbs>
        <Breadcrumbs.Item
          href="/"
          onClick={(e) => {
            e.preventDefault();
            console.log('Home clicked');
          }}
        >
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          href="/category"
          onClick={(e) => {
            e.preventDefault();
            console.log('Category clicked');
          }}
        >
          Category
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    return (
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          menuItems={[
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
            { key: '3', label: 'Option 3' },
          ]}
          onMenuItemClick={(key) => console.log('Selected:', key)}
        >
          Category
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    return (
      <Breadcrumbs separator=" / ">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          menuItems={[
            { key: '1', label: 'Electronics' },
            { key: '2', label: 'Clothing' },
            { key: '3', label: 'Books' },
          ]}
          onMenuItemClick={(key) => console.log('Selected category:', key)}
        >
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products/electronics">Electronics</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Product</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

