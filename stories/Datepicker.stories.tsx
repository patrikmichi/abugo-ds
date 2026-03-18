import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, RangePicker as DateRangePicker, type DatePickerPreset } from '@/components/Datepicker';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';

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
          <Button variant="primary" appearance="plain" size="sm" onClick={() => setValue(new Date())}>
            Today
          </Button>
          <Button variant="secondary" appearance="plain" size="sm" onClick={() => setValue(null)}>
            Clear
          </Button>
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
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Default (ddd, MMM D)</p>
          <DatePicker value={value} onChange={setValue} />
        </div>
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
      <div style={{ maxWidth: '600px' }}>
        <DateRangePicker
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

export const RangePickerPreSelected: Story = {
  render: () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    const [value, setValue] = useState<[Date | null, Date | null] | null>([start, end]);
    return (
      <div style={{ maxWidth: '600px' }}>
        <DateRangePicker
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
          placeholder="Select a date"
          allowClear
          disabledDate={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
      </div>
    );
  },
};

const getNextThursday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysUntilThursday);
  return nextThursday;
};

const defaultPresets: DatePickerPreset[] = [
  { label: 'Today', value: () => new Date() },
  {
    label: 'Tomorrow',
    value: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    },
  },
  { label: 'Next Thursday', value: getNextThursday },
  {
    label: 'Next Week',
    value: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d;
    },
  },
  {
    label: 'Next Month',
    value: () => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d;
    },
  },
];

export const WithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '500px' }}>
        <DatePicker
          value={value}
          onChange={(date) => setValue(date)}
          presets={defaultPresets}
          onSave={(date, dateString) => console.log('Saved:', date, dateString)}
          onCancel={() => console.log('Cancelled')}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Selected: {value ? value.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

export const PresetsWithCustomLabels: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ maxWidth: '500px' }}>
        <DatePicker
          value={value}
          onChange={(date) => setValue(date)}
          presets={defaultPresets}
          cancelText="Discard"
          saveText="Apply"
          onSave={(date, dateString) => console.log('Applied:', dateString)}
          onCancel={() => console.log('Discarded')}
        />
      </div>
    );
  },
};

export const PresetsSizes: Story = {
  render: () => {
    const [valueSm, setValueSm] = useState<Date | null>(null);
    const [valueMd, setValueMd] = useState<Date | null>(null);
    const [valueLg, setValueLg] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Small (chevrons 20px)</p>
          <DatePicker
            size="sm"
            value={valueSm}
            onChange={(date) => setValueSm(date)}
            presets={defaultPresets}

          />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Medium (chevrons 24px)</p>
          <DatePicker
            size="md"
            value={valueMd}
            onChange={(date) => setValueMd(date)}
            presets={defaultPresets}

          />
        </div>
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#666' }}>Large (chevrons 24px)</p>
          <DatePicker
            size="lg"
            value={valueLg}
            onChange={(date) => setValueLg(date)}
            presets={defaultPresets}

          />
        </div>
      </div>
    );
  },
};
