import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Menu } from '@/components/Menu';

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

export const WithRoutes: Story = {
  render: () => {
    const routes = [
      { path: '/', breadcrumbName: 'Home' },
      { path: '/category', breadcrumbName: 'Category' },
      { path: '/category/product', breadcrumbName: 'Product' },
    ];

    return <Breadcrumbs routes={routes} />;
  },
};

export const WithRoutesAndHomeIcon: Story = {
  render: () => {
    const routes = [
      { path: '/', breadcrumbName: 'Home' },
      { path: '/category', breadcrumbName: 'Category' },
      { path: '/category/product', breadcrumbName: 'Product' },
    ];

    return <Breadcrumbs routes={routes} homeIcon />;
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
          menu={
            <Menu>
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
            </Menu>
          }
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
          menu={
            <Menu>
              <Menu.Item key="1">Electronics</Menu.Item>
              <Menu.Item key="2">Clothing</Menu.Item>
              <Menu.Item key="3">Books</Menu.Item>
            </Menu>
          }
        >
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products/electronics">Electronics</Breadcrumbs.Item>
        <Breadcrumbs.Item>Current Product</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

