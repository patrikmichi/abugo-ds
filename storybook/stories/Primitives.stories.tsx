import React from 'react';
import { loadTokens } from '@tokens/scripts/load-tokens';

const { primitives, semanticTokens } = loadTokens();

export default {
  title: 'Tokens/Foundations/Primitives',
  parameters: {
    layout: 'padded',
  },
};

// Keep the rest of the component logic the same, just with TypeScript types
// For now, we'll keep it as JSX but with .tsx extension
