/**
 * ESLint plugin for validating design token usage in CSS modules
 */

module.exports = {
  meta: {
    name: 'eslint-plugin-tokens',
    version: '1.0.0',
  },
  rules: {
    'valid-token': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure CSS variables reference valid design tokens',
          category: 'Possible Errors',
          recommended: true,
        },
        messages: {
          invalidToken: 'Token "{{token}}" does not exist. Run `npm run build:css-variables` to regenerate.',
          deprecatedToken: 'Token "{{token}}" is deprecated. {{suggestion}}',
        },
        schema: [],
      },
      create(context) {
        // This is a simplified version - full implementation would require
        // loading token definitions and parsing CSS files
        // For now, we'll provide a structure that can be enhanced
        
        return {
          Literal(node) {
            if (typeof node.value === 'string' && node.value.includes('--token-')) {
              // Basic validation - check if it matches token pattern
              const tokenPattern = /--token-(?:primitive|semantic|component)-[a-z0-9-]+/;
              if (!tokenPattern.test(node.value)) {
                context.report({
                  node,
                  messageId: 'invalidToken',
                  data: {
                    token: node.value,
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};
