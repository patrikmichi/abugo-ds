import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from '@/components/Timepicker';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker
          value={value}
          onChange={(time, timeString) => {
            setValue(time);
            console.log('Time:', time, 'String:', timeString);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Selected: {value ? value.toLocaleTimeString() : 'None'}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(() => {
      const date = new Date();
      date.setHours(14, 30, 0);
      return date;
    });
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker
          value={value}
          onChange={(time) => setValue(time)}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="primary"
            appearance="plain"
            onClick={() => {
              const now = new Date();
              setValue(now);
            }}
          >
            Now
          </Button>
          <Button variant="primary" appearance="plain" onClick={() => setValue(null)}>
            Clear
          </Button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
          Value: {value ? value.toLocaleTimeString() : 'null'}
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small</p>
          <TimePicker size="sm" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle (Default)</p>
          <TimePicker size="md" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
          <TimePicker size="lg" value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>HH:mm:ss (24-hour)</p>
          <TimePicker format="HH:mm:ss" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>HH:mm (24-hour, no seconds)</p>
          <TimePicker format="HH:mm" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>h:mm:ss a (12-hour)</p>
          <TimePicker format="h:mm:ss a" use12Hours value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>h:mm a (12-hour, no seconds)</p>
          <TimePicker format="h:mm a" use12Hours value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};

export const WithSteps: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>15-minute steps</p>
          <TimePicker minuteStep={15} value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>2-hour steps, 30-minute steps</p>
          <TimePicker hourStep={2} minuteStep={30} value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>10-second steps</p>
          <TimePicker secondStep={10} value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};


export const TwelveHourFormat: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker
          value={value}
          onChange={setValue}
          format="h:mm:ss a"
          use12Hours
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          12-hour format with AM/PM
        </p>
      </div>
    );
  },
};

export const NoClear: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(() => {
      const date = new Date();
      date.setHours(14, 30, 0);
      return date;
    });
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker value={value} onChange={setValue} allowClear={false} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const date = new Date();
    date.setHours(14, 30, 0);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker defaultValue={date} disabled />
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Select Time" required>
          <TimePicker
            value={value}
            onChange={setValue}
            error={!value}
          />
        </Field>
      </div>
    );
  },
};

export const ControlledOpen: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    const [open, setOpen] = useState(false);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker
          value={value}
          onChange={setValue}
          open={open}
          onOpenChange={setOpen}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" appearance="plain" onClick={() => setOpen(true)}>
            Open
          </Button>
          <Button variant="primary" appearance="plain" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TimePicker
          value={value}
          onChange={setValue}
          format="HH:mm:ss"
          hourStep={1}
          minuteStep={15}
          secondStep={10}
          placeholder="Select time"
          allowClear
        />
      </div>
    );
  },
};
