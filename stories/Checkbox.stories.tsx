import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        Checkbox
      </Checkbox>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
          Controlled Checkbox
        </Checkbox>
        <p style={{ fontSize: '14px' }}>Checked: {checked ? 'true' : 'false'}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setChecked(true)}>Check</button>
          <button onClick={() => setChecked(false)}>Uncheck</button>
        </div>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox defaultChecked={false}>Unchecked by default</Checkbox>
        <Checkbox defaultChecked>Checked by default</Checkbox>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox size="small">Small</Checkbox>
        <Checkbox size="middle">Middle (Default)</Checkbox>
        <Checkbox size="large">Large</Checkbox>
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox disabled>Disabled unchecked</Checkbox>
        <Checkbox checked disabled>
          Disabled checked
        </Checkbox>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox indeterminate={indeterminate} checked={checked}>
          Indeterminate Checkbox
        </Checkbox>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setIndeterminate(!indeterminate)}>
            Toggle Indeterminate
          </button>
          <button onClick={() => setChecked(!checked)}>Toggle Checked</button>
        </div>
      </div>
    );
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['apple']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox.Group value={value} onChange={setValue}>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </Checkbox.Group>
        <p style={{ fontSize: '14px' }}>Selected: {value.join(', ') || 'None'}</p>
      </div>
    );
  },
};

export const CheckboxGroupWithOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          options={['Option 1', 'Option 2', 'Option 3']}
        />
        <p style={{ fontSize: '14px' }}>Selected: {value.join(', ') || 'None'}</p>
      </div>
    );
  },
};

export const CheckboxGroupWithOptionObjects: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3 (Disabled)', value: 'option3', disabled: true },
          ]}
        />
        <p style={{ fontSize: '14px' }}>Selected: {value.join(', ') || 'None'}</p>
      </div>
    );
  },
};

export const CheckboxGroupHorizontal: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          style={{ flexDirection: 'row' }}
        >
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
          <Checkbox value="c">Option C</Checkbox>
        </Checkbox.Group>
        <p style={{ fontSize: '14px' }}>Selected: {value.join(', ') || 'None'}</p>
      </div>
    );
  },
};

export const CheckboxGroupDisabled: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox.Group disabled defaultValue={['option1']}>
          <Checkbox value="option1">Option 1</Checkbox>
          <Checkbox value="option2">Option 2</Checkbox>
          <Checkbox value="option3">Option 3</Checkbox>
        </Checkbox.Group>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ maxWidth: '400px' }}>
        <Field label="Agree to terms" required>
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
            I agree to the terms and conditions
          </Checkbox>
        </Field>
      </div>
    );
  },
};

export const AutoFocus: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox autoFocus>Auto-focused checkbox</Checkbox>
        <Checkbox>Regular checkbox</Checkbox>
      </div>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [groupValue, setGroupValue] = useState<string[]>(['option1']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Individual Checkbox</h3>
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            size="middle"
          >
            Feature checkbox
          </Checkbox>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Checkbox Group</h3>
          <Checkbox.Group
            value={groupValue}
            onChange={setGroupValue}
            options={[
              { label: 'Feature 1', value: 'option1' },
              { label: 'Feature 2', value: 'option2' },
              { label: 'Feature 3', value: 'option3' },
            ]}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
            Selected: {groupValue.join(', ') || 'None'}
          </p>
        </div>
      </div>
    );
  },
};

