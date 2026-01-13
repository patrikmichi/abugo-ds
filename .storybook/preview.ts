import type { Preview } from '@storybook/react';
import '../stories/styles.css';
import '../app/globals.css';
import '../public/fonts/fonts.css';

// Add Material Icons font
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
  document.head.appendChild(link);
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    docs: {
      // Workaround for Storybook 10.1.11 renderer bug
      // Ensure renderer is properly initialized by the framework
      story: {
        inline: true,
      },
    },
  },
};

export default preview;
