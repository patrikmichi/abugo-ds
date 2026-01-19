import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@/components/Chip';
import { Avatar } from '@/components/Avatar';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    selected: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
    expandable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Basic: Story = {
  args: {
    label: 'Chip',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Chip label="Small" size="small" />
      <Chip label="Medium" size="medium" />
      <Chip label="Large" size="large" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip label="Unselected" />
      <Chip label="Selected" selected />
      <Chip label="Disabled" disabled />
      <Chip label="Selected Disabled" selected disabled />
    </div>
  ),
};

export const WithLeadingAdornment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip 
          icon={<span className="material-symbols-outlined">person</span>} 
          label="Small" 
          size="small" 
        />
        <Chip 
          icon={<span className="material-symbols-outlined">person</span>} 
          label="Medium" 
          size="medium" 
        />
        <Chip 
          icon={<span className="material-symbols-outlined">person</span>} 
          label="Large" 
          size="large" 
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip 
          avatar={<Avatar size="xs">M</Avatar>} 
          label="Small" 
          size="small" 
        />
        <Chip 
          avatar={<Avatar size="md">M</Avatar>} 
          label="Medium" 
          size="medium" 
        />
        <Chip 
          avatar={<Avatar size="lg">M</Avatar>} 
          label="Large" 
          size="large" 
        />
      </div>
    </div>
  ),
};

export const Deletable: Story = {
  render: () => {
    const [chips, setChips] = useState(['Chip 1', 'Chip 2', 'Chip 3']);
    
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {chips.map((chip, index) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={() => setChips(chips.filter((_, i) => i !== index))}
          />
        ))}
      </div>
    );
  },
};

export const DeletableSizes: Story = {
  render: () => {
    const handleDelete = () => console.log('Deleted');
    
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip label="Small" size="small" onDelete={handleDelete} />
        <Chip label="Medium" size="medium" onDelete={handleDelete} />
        <Chip label="Large" size="large" onDelete={handleDelete} />
      </div>
    );
  },
};

export const Expandable: Story = {
  render: () => {
    const handleExpand = () => console.log('Expand clicked');
    
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip label="Menu" expandable onExpand={handleExpand} />
        <Chip label="Menu" expandable onExpand={handleExpand} selected />
        <Chip 
          icon={<span className="material-symbols-outlined">person</span>} 
          label="Menu" 
          expandable 
          onExpand={handleExpand} 
        />
        <Chip 
          avatar={<Avatar>M</Avatar>} 
          label="Menu" 
          expandable 
          onExpand={handleExpand} 
        />
      </div>
    );
  },
};

export const ClickableFilter: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip 
          label="Filter" 
          clickable 
          selected={selected}
          onClick={() => setSelected(!selected)}
        />
        <Chip 
          label="Active Filter" 
          clickable 
          selected
          onClick={() => console.log('Clicked')}
        />
        <Chip 
          icon={<span className="material-symbols-outlined">filter_list</span>} 
          label="Filter with Icon" 
          clickable 
          selected
          onClick={() => console.log('Clicked')}
        />
      </div>
    );
  },
};

export const AllCombinations: Story = {
  render: () => {
    const handleDelete = () => console.log('Deleted');
    const handleExpand = () => console.log('Expand');
    const avatar = <Avatar size="md">M</Avatar>;
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', padding: '2rem' }}>
        {/* Unselected Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Unselected</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Chip" size="small" />
              <Chip label="Chip" size="medium" />
              <Chip label="Chip" size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" size="small" />
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" size="medium" />
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip avatar={avatar} label="Chip" size="small" />
              <Chip avatar={avatar} label="Chip" size="medium" />
              <Chip avatar={avatar} label="Chip" size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Chip" size="small" onDelete={handleDelete} />
              <Chip label="Chip" size="medium" onDelete={handleDelete} />
              <Chip label="Chip" size="large" onDelete={handleDelete} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip avatar={avatar} label="Chip" size="small" onDelete={handleDelete} />
              <Chip avatar={avatar} label="Chip" size="medium" onDelete={handleDelete} />
              <Chip avatar={avatar} label="Chip" size="large" onDelete={handleDelete} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Menu" size="small" expandable onExpand={handleExpand} />
              <Chip label="Menu" size="medium" expandable onExpand={handleExpand} />
              <Chip label="Menu" size="large" expandable onExpand={handleExpand} />
            </div>
          </div>
        </div>

        {/* Selected Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Selected</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Chip" selected size="small" />
              <Chip label="Chip" selected size="medium" />
              <Chip label="Chip" selected size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" selected size="small" />
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" selected size="medium" />
              <Chip icon={<span className="material-symbols-outlined">person</span>} label="Chip" selected size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip avatar={avatar} label="Chip" selected size="small" />
              <Chip avatar={avatar} label="Chip" selected size="medium" />
              <Chip avatar={avatar} label="Chip" selected size="large" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Chip" selected size="small" onDelete={handleDelete} />
              <Chip label="Chip" selected size="medium" onDelete={handleDelete} />
              <Chip label="Chip" selected size="large" onDelete={handleDelete} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip avatar={avatar} label="Chip" selected size="small" onDelete={handleDelete} />
              <Chip avatar={avatar} label="Chip" selected size="medium" onDelete={handleDelete} />
              <Chip avatar={avatar} label="Chip" selected size="large" onDelete={handleDelete} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label="Menu" selected size="small" expandable onExpand={handleExpand} />
              <Chip label="Menu" selected size="medium" expandable onExpand={handleExpand} />
              <Chip label="Menu" selected size="large" expandable onExpand={handleExpand} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip label="Disabled" disabled />
      <Chip label="Disabled Selected" selected disabled />
      <Chip 
        avatar={<Avatar>M</Avatar>} 
        label="Disabled with Avatar" 
        disabled 
      />
      <Chip 
        label="Disabled Deletable" 
        onDelete={() => {}} 
        disabled 
      />
      <Chip 
        label="Disabled Expandable" 
        expandable 
        onExpand={() => {}} 
        disabled 
      />
    </div>
  ),
};
