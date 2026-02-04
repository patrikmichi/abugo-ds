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

export const States: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox indeterminate>Indeterminate</Checkbox>
        <Checkbox disabled>Disabled unchecked</Checkbox>
        <Checkbox checked disabled>Disabled checked</Checkbox>
        <Checkbox error>Error unchecked</Checkbox>
        <Checkbox error defaultChecked>Error checked</Checkbox>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checkedList, setCheckedList] = useState<string[]>(['apple']);
    const allOptions = ['apple', 'banana', 'orange'];
    const allChecked = checkedList.length === allOptions.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < allOptions.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox
          indeterminate={indeterminate}
          checked={allChecked}
          onChange={(e) => setCheckedList(e.target.checked ? allOptions : [])}
        >
          Check all
        </Checkbox>
        <Checkbox.Group value={checkedList} onChange={setCheckedList}>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </Checkbox.Group>
      </div>
    );
  },
};

export const GroupVertical: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['apple']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

export const GroupHorizontal: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox.Group value={value} onChange={setValue} direction="horizontal">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
          <Checkbox value="c">Option C</Checkbox>
        </Checkbox.Group>
        <p style={{ fontSize: '14px' }}>Selected: {value.join(', ') || 'None'}</p>
      </div>
    );
  },
};

export const GroupWithOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

export const GroupDisabled: Story = {
  render: () => {
    return (
      <Checkbox.Group disabled defaultValue={['option1']}>
        <Checkbox value="option1">Option 1</Checkbox>
        <Checkbox value="option2">Option 2</Checkbox>
        <Checkbox value="option3">Option 3</Checkbox>
      </Checkbox.Group>
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
