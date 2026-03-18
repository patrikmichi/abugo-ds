import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <Section id="section1" title="Section 1" />
          <Section id="section2" title="Section 2" />
          <Section id="section3" title="Section 3" />
          <Section id="section4" title="Section 4" />
          <Section id="section5" title="Section 5" />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Anchor
            items={[
              { key: '1', href: '#section1', title: 'Section 1' },
              { key: '2', href: '#section2', title: 'Section 2' },
              { key: '3', href: '#section3', title: 'Section 3' },
              { key: '4', href: '#section4', title: 'Section 4' },
              { key: '5', href: '#section5', title: 'Section 5' },
            ]}
          />
        </div>
      </div>
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
