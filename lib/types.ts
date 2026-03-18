/**
 * Type definitions for component tokens
 */

export interface TokenValue {
  $scopes?: string[];
  $type?: string;
  $libraryName?: string;
  $collectionName?: string;
  $value: string;
  $description?: string;
}

export type ComponentTokenData = {
  $name?: string;
  [key: string]: any;
};
