import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/Datepicker';
import { Field } from '@/components/Field';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    picker: {
      control: 'select',
      options: ['date', 'week', 'month', 'quarter', 'year'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={(date, dateString) => {
            setValue(date);
            console.log('Date:', date, 'String:', dateString);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Selected: {value ? value.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15));
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={(date) => setValue(date)}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setValue(new Date())}>Today</button>
          <button onClick={() => setValue(null)}>Clear</button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
          Value: {value ? value.toLocaleDateString() : 'null'}
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
          <DatePicker size="sm" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Middle (Default)</p>
          <DatePicker size="md" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large</p>
          <DatePicker size="lg" value={value} onChange={setValue} />
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
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>YYYY-MM-DD</p>
          <DatePicker format="YYYY-MM-DD" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>MM/DD/YYYY</p>
          <DatePicker format="MM/DD/YYYY" value={value} onChange={setValue} />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>DD-MM-YYYY</p>
          <DatePicker format="DD-MM-YYYY" value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};

export const DisabledDate: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={setValue}
          disabledDate={(date) => {
            // Disable weekends
            const day = date.getDay();
            return day === 0 || day === 6;
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          Weekends are disabled
        </p>
      </div>
    );
  },
};

export const DisabledPastDates: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={setValue}
          disabledDate={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          Past dates are disabled
        </p>
      </div>
    );
  },
};

export const WithExtraFooter: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={setValue}
          renderExtraFooter={(mode) => (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <button
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setValue(nextWeek);
                }}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Next Week
              </button>
            </div>
          )}
        />
      </div>
    );
  },
};

export const NoTodayButton: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker value={value} onChange={setValue} showToday={false} />
      </div>
    );
  },
};

export const NoClear: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date());
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker value={value} onChange={setValue} allowClear={false} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker defaultValue={new Date()} disabled />
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Select Date" required>
          <DatePicker
            value={value}
            onChange={setValue}
            error={!value}
          />
        </Field>
      </div>
    );
  },
};

export const RangePicker: Story = {
  render: () => {
    const [value, setValue] = useState<[Date | null, Date | null] | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker.RangePicker
          value={value}
          onChange={(dates) => {
            setValue(dates);
            console.log('Range:', dates);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Range: {value && value[0] && value[1]
            ? `${value[0].toLocaleDateString()} ~ ${value[1].toLocaleDateString()}`
            : 'Not selected'}
        </p>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '400px' }}>
        <DatePicker
          value={value}
          onChange={setValue}
          format="YYYY-MM-DD"
          placeholder="Select a date"
          allowClear
          showToday
          disabledDate={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          renderExtraFooter={(mode) => (
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
              Custom footer for {mode} picker
            </div>
          )}
        />
      </div>
    );
  },
};
