/**
 * Type definitions for design tokens
 */

export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'spacing'
  | 'borderRadius'
  | 'borderWidth'
  | 'boxShadow'
  | 'opacity'
  | 'zIndex'
  | 'duration'
  | 'easing'
  | 'sizing'
  | 'typography'
  | 'other';

export interface TokenValue {
  $type: TokenType;
  $value: string | number | object;
  $description?: string;
  $extensions?: {
    'studio.tokens'?: {
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export interface TokenReference {
  [key: string]: TokenValue | TokenReference | string | number | object;
}

export interface Primitives extends TokenReference {
  [key: string]: TokenValue | Primitives | string | number | object;
}

export interface SemanticTokens extends TokenReference {
  $name?: string;
  [key: string]: TokenValue | SemanticTokens | string | number | object | undefined;
}

export interface ComponentTokens extends TokenReference {
  $name?: string;
  [key: string]: TokenValue | ComponentTokens | string | number | object | undefined;
}

export interface TokenCollection {
  primitives: Primitives;
  semanticTokens: SemanticTokens;
  componentTokens: ComponentTokens;
}

export interface LoadedTokens {
  primitives: Primitives;
  semanticTokens: SemanticTokens;
  componentTokens: ComponentTokens;
}
