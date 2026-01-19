import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Anchor } from '@/components/Anchor';

const meta: Meta<typeof Anchor> = {
  title: 'Components/Anchor',
  component: Anchor,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Anchor>;

// Helper component to create scrollable content with sections
const ScrollableContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
      <div style={{ flex: 1 }}>{children}</div>
      <div style={{ width: '200px', flexShrink: 0 }}>
        <Anchor
          affix
          offsetTop={100}
          items={[
            { key: '1', href: '#section1', title: 'Section 1' },
            { key: '2', href: '#section2', title: 'Section 2' },
            { key: '3', href: '#section3', title: 'Section 3' },
            {
              key: '4',
              href: '#section4',
              title: 'Section 4',
              children: [
                { key: '4-1', href: '#section4-1', title: 'Subsection 4.1' },
                { key: '4-2', href: '#section4-2', title: 'Subsection 4.2' },
              ],
            },
            { key: '5', href: '#section5', title: 'Section 5' },
          ]}
        />
      </div>
    </div>
  );
};

const Section: React.FC<{ id: string; title: string; children?: React.ReactNode }> = ({ id, title, children }) => {
  return (
    <div
      id={id}
      style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        minHeight: '400px',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children || <p>Content for {title}</p>}
    </div>
  );
};

export const Default: Story = {
  render: () => {
    return (
      <ScrollableContent>
        <div>
          <Section id="section1" title="Section 1" />
          <Section id="section2" title="Section 2" />
          <Section id="section3" title="Section 3" />
          <Section id="section4" title="Section 4">
            <Section id="section4-1" title="Subsection 4.1" />
            <Section id="section4-2" title="Subsection 4.2" />
          </Section>
          <Section id="section5" title="Section 5" />
        </div>
      </ScrollableContent>
    );
  },
};

export const WithChildren: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="part1" title="Part 1" />
          <Section id="part2" title="Part 2" />
          <Section id="part3" title="Part 3" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor affix offsetTop={100}>
            <Anchor.Link href="#part1" title="Part 1" />
            <Anchor.Link href="#part2" title="Part 2" />
            <Anchor.Link href="#part3" title="Part 3" />
          </Anchor>
        </div>
      </div>
    );
  },
};

export const WithoutAffix: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="item1" title="Item 1" />
          <Section id="item2" title="Item 2" />
          <Section id="item3" title="Item 3" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor affix={false} items={[
            { key: '1', href: '#item1', title: 'Item 1' },
            { key: '2', href: '#item2', title: 'Item 2' },
            { key: '3', href: '#item3', title: 'Item 3' },
          ]} />
        </div>
      </div>
    );
  },
};

export const WithNestedLinks: Story = {
  render: () => {
    return (
      <ScrollableContent>
        <div>
          <Section id="chapter1" title="Chapter 1" />
          <Section id="chapter2" title="Chapter 2">
            <Section id="chapter2-1" title="Chapter 2.1" />
            <Section id="chapter2-2" title="Chapter 2.2" />
            <Section id="chapter2-3" title="Chapter 2.3" />
          </Section>
          <Section id="chapter3" title="Chapter 3" />
        </div>
      </ScrollableContent>
    );
  },
};

export const CustomOffsetTop: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="offset1" title="Offset 1" />
          <Section id="offset2" title="Offset 2" />
          <Section id="offset3" title="Offset 3" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor
            affix
            offsetTop={200}
            items={[
              { key: '1', href: '#offset1', title: 'Offset 1' },
              { key: '2', href: '#offset2', title: 'Offset 2' },
              { key: '3', href: '#offset3', title: 'Offset 3' },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const WithOnClick: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="click1" title="Click 1" />
          <Section id="click2" title="Click 2" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor
            affix
            onClick={(e, link) => {
              console.log('Link clicked:', link);
              alert(`Clicked: ${link.title}`);
            }}
            items={[
              { key: '1', href: '#click1', title: 'Click 1' },
              { key: '2', href: '#click2', title: 'Click 2' },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const CustomGetCurrentAnchor: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="custom1" title="Custom 1" />
          <Section id="custom2" title="Custom 2" />
          <Section id="custom3" title="Custom 3" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor
            affix
            getCurrentAnchor={(activeLink) => {
              // Always highlight the first link if none is active
              return activeLink || '#custom1';
            }}
            items={[
              { key: '1', href: '#custom1', title: 'Custom 1' },
              { key: '2', href: '#custom2', title: 'Custom 2' },
              { key: '3', href: '#custom3', title: 'Custom 3' },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const CustomBounds: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="bounds1" title="Bounds 1" />
          <Section id="bounds2" title="Bounds 2" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor
            affix
            bounds={50}
            items={[
              { key: '1', href: '#bounds1', title: 'Bounds 1' },
              { key: '2', href: '#bounds2', title: 'Bounds 2' },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    return (
      <ScrollableContent>
        <div>
          <Section id="feature1" title="Feature 1" />
          <Section id="feature2" title="Feature 2" />
          <Section id="feature3" title="Feature 3">
            <Section id="feature3-1" title="Feature 3.1" />
            <Section id="feature3-2" title="Feature 3.2" />
          </Section>
          <Section id="feature4" title="Feature 4" />
        </div>
      </ScrollableContent>
    );
  },
};

