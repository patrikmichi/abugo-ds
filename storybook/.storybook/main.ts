import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [path.resolve(__dirname, '../../tokens/docs')],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@tokens': path.resolve(__dirname, '../../tokens'),
          '@tokens/scripts': path.resolve(__dirname, '../../tokens/scripts'),
          '@tokens/docs': path.resolve(__dirname, '../../tokens/docs'),
          '@tokens/output': path.resolve(__dirname, '../../tokens/output'),
          '@tokens/system': path.resolve(__dirname, '../../tokens/system'),
          '@tokens/types': path.resolve(__dirname, '../../tokens/types'),
        },
      },
    });
  },
};

export default config;
