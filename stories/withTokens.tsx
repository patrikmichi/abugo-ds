import React from 'react';
import { TokenDisplay } from './TokenDisplay';
import type { StoryContext } from '@storybook/react';

/**
 * Decorator to add token display to stories
 * 
 * Usage: Add to story parameters: decorators: [withTokens]
 * 
 * The token display will automatically show all tokens from the component's
 * JSON file, organized by state/variant. This helps designers recreate the
 * same structure in Figma.
 */
export const withTokens = (Story: React.ComponentType, context: StoryContext) => {
  const componentName = context.title?.split('/').pop() || '';
  
  return (
    <div>
      <Story />
      <TokenDisplay componentName={componentName} />
    </div>
  );
};

/**
 * HOW TO USE TOKEN DISPLAY IN STORIES:
 * 
 * Option 1: Automatic (via preview decorator)
 * Add to your meta parameters:
 * 
 * const meta: Meta<typeof MyComponent> = {
 *   title: 'Components/MyComponent',
 *   component: MyComponent,
 *   parameters: {
 *     tokens: {
 *       componentName: 'MyComponent', // Optional: auto-detected from title
 *       show: true, // Optional: set to false to hide
 *       state: 'default', // Optional: filter to specific state
 *     },
 *   },
 * };
 * 
 * Option 2: Manual in specific story
 * 
 * export const MyStory: Story = {
 *   render: () => (
 *     <>
 *       <MyComponent />
 *       <TokenDisplay componentName="MyComponent" />
 *     </>
 *   ),
 * };
 * 
 * Option 3: Using decorator
 * 
 * export const MyStory: Story = {
 *   decorators: [withTokens],
 *   // ... rest of story
 * };
 */
