import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Explicitly specify builder for Storybook 10
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  // Ensure docs are properly configured
  features: {
    buildStoriesJson: true,
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': projectRoot,
          '@/components': path.resolve(projectRoot, 'components'),
          '@/lib': path.resolve(projectRoot, 'lib'),
          '@/styles': path.resolve(projectRoot, 'styles'),
          '@/app': path.resolve(projectRoot, 'app'),
          '@/tokens': path.resolve(projectRoot, 'tokens'),
          '@tokens': path.resolve(projectRoot, 'tokens'),
        },
      },
      // Ensure CSS modules work properly
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
      // Optimize dependencies for React 19
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        esbuildOptions: {
          jsx: 'automatic',
        },
      },
      // Disable React Compiler for Storybook (can cause docs issues)
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    });
  },
};

export default config;
