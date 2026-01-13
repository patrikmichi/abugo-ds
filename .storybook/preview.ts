import type { Preview } from '@storybook/react-vite';
import '../stories/styles.css';
import '../app/globals.css';
import '../public/fonts/fonts.css';

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
      // Storybook 10 autodocs configuration
      autodocs: 'tag',
      source: {
        type: 'code',
      },
    },
  },
};

export default preview;
