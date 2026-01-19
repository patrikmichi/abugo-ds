import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker, type ColorPreset } from '@/components/ColorPicker';
import { Field } from '@/components/Field';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsb'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

const defaultPresets: ColorPreset[] = [
  {
    label: 'Recommended',
    colors: [
      '#F5222D',
      '#FA541C',
      '#FA8C16',
      '#FADB14',
      '#52C41A',
      '#13C2C2',
      '#1890FF',
      '#2F54EB',
      '#722ED1',
      '#EB2F96',
    ],
  },
  {
    label: 'Recent',
    colors: [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={(color, hex) => {
            setValue(color);
            console.log('Color:', color, 'Hex:', hex);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Selected: {value || 'None'}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#7bd86c');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={(color) => setValue(color)}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setValue('#ff0000')}>Red</button>
          <button onClick={() => setValue('#00ff00')}>Green</button>
          <button onClick={() => setValue('#0000ff')}>Blue</button>
          <button onClick={() => setValue(null)}>Clear</button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
          Value: {value || 'null'}
        </p>
      </div>
    );
  },
};

export const Formats: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Hex Format</p>
          <ColorPicker format="hex" value={value} onChange={setValue} showText />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>RGB Format</p>
          <ColorPicker format="rgb" value={value} onChange={setValue} showText />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>HSB Format</p>
          <ColorPicker format="hsb" value={value} onChange={setValue} showText />
        </div>
      </div>
    );
  },
};

export const WithText: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          showText
        />
      </div>
    );
  },
};

export const CustomText: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          showText={(color) => (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {color ? `Selected: ${color}` : 'No color'}
            </span>
          )}
        />
      </div>
    );
  },
};

export const WithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          presets={defaultPresets}
        />
      </div>
    );
  },
};

export const WithClear: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          allowClear
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value="#538bff"
          disabled
        />
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Select Color" required>
          <ColorPicker
            value={value}
            onChange={setValue}
          />
        </Field>
      </div>
    );
  },
};

export const ControlledOpen: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    const [open, setOpen] = useState(false);
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          open={open}
          onOpenChange={setOpen}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setOpen(true)}>Open</button>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('#538bff');
    return (
      <div style={{ maxWidth: '400px' }}>
        <ColorPicker
          value={value}
          onChange={setValue}
          format="hex"
          showText
          allowClear
          presets={defaultPresets}
        />
      </div>
    );
  },
};

