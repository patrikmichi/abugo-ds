/**
 * Utility functions for accessing design tokens in CSS modules
 * Provides type-safe access to CSS custom properties
 */

/**
 * Get a CSS variable value for a primitive token
 * @example token('spacing-1') -> 'var(--token-primitive-spacing-1)'
 */
export function token(key: string): string {
  return `var(--token-primitive-${key.toLowerCase().replace(/[^a-z0-9-]/g, '-')})`;
}

/**
 * Get a CSS variable value for a semantic token
 * @example semanticToken('content-passive-neutral-default') -> 'var(--token-semantic-content-passive-neutral-default)'
 */
export function semanticToken(key: string): string {
  return `var(--token-semantic-${key.toLowerCase().replace(/[^a-z0-9-]/g, '-')})`;
}

/**
 * Get a CSS variable value for a component token
 * @example componentToken('button', 'primary', 'background', 'default') -> 'var(--token-component-button-primary-background-default)'
 */
export function componentToken(...path: string[]): string {
  const key = path.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `var(--token-component-${key})`;
}

/**
 * Helper to create a CSS variable reference with fallback
 * @example tokenWithFallback('spacing-1', '4px') -> 'var(--token-primitive-spacing-1, 4px)'
 */
export function tokenWithFallback(key: string, fallback: string): string {
  return `var(--token-primitive-${key.toLowerCase().replace(/[^a-z0-9-]/g, '-')}, ${fallback})`;
}

/**
 * Helper to create a semantic token reference with fallback
 */
export function semanticTokenWithFallback(key: string, fallback: string): string {
  return `var(--token-semantic-${key.toLowerCase().replace(/[^a-z0-9-]/g, '-')}, ${fallback})`;
}

/**
 * Helper to create a component token reference with fallback
 */
export function componentTokenWithFallback(path: string[], fallback: string): string {
  const key = path.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `var(--token-component-${key}, ${fallback})`;
}
