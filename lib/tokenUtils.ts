import type { ComponentTokenData } from './types';
import { getComponentTokens } from './tokenRegistry';

// Token cache to avoid re-importing
const tokenCache = new Map<string, ComponentTokenData>();

/**
 * Maps component names to their token file names
 * Handles cases where component names don't match token file names exactly
 */
function getTokenFileName(componentName: string): string {
  const nameMap: Record<string, string> = {
    'InputNumber': 'inputnumber',
    'PhoneNumberField': 'phonenumberfield',
    'DurationPicker': 'durationpicker',
    'ColorPicker': 'colorpicker',
    'AutoComplete': 'autocomplete',
    // Add more mappings as needed
  };
  
  return nameMap[componentName] || componentName.toLowerCase();
}

/**
 * Loads component tokens from the static registry or via fetch fallback
 * Uses static imports first (fast, reliable), then falls back to fetch
 */
export async function loadComponentTokens(componentName: string): Promise<ComponentTokenData | null> {
  if (!componentName) {
    return null;
  }
  
  try {
    // Convert component name to token file name
    const fileName = getTokenFileName(componentName);
    
    // Check cache first
    if (tokenCache.has(fileName)) {
      return tokenCache.get(fileName)!;
    }
    
    // Try static registry first (fastest, most reliable)
    try {
      const staticTokens = getComponentTokens(componentName);
      if (staticTokens) {
        tokenCache.set(fileName, staticTokens as ComponentTokenData);
        return staticTokens as ComponentTokenData;
      }
    } catch (registryError) {
      // Registry doesn't have this component, try fetch
    }
    
    // Fallback: Use fetch to load JSON file (for components not in registry)
    // This is slower but works for any component
    const basePath = typeof window !== 'undefined' 
      ? window.location.origin 
      : '';
    
    const possiblePaths = [
      `${basePath}/tokens/system/componentTokens/components/${fileName}.json`,
      `./tokens/system/componentTokens/components/${fileName}.json`,
    ];
    
    for (const tokenPath of possiblePaths) {
      try {
        const response = await fetch(tokenPath, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json() as ComponentTokenData;
          if (data && typeof data === 'object') {
            tokenCache.set(fileName, data);
            return data;
          }
        }
      } catch (fetchError) {
        // Try next path
        continue;
      }
    }
    
    // Token file doesn't exist
    return null;
  } catch (error) {
    // Silently return null - not all components have token files
    return null;
  }
}

/**
 * Synchronously loads component tokens (for Node.js/build time)
 * This is a fallback for when fetch is not available
 */
export function loadComponentTokensSync(componentName: string): ComponentTokenData | null {
  try {
    const fs = require('fs');
    const path = require('path');
    const fileName = componentName.toLowerCase();
    const tokenPath = path.join(
      process.cwd(),
      'tokens',
      'system',
      'componentTokens',
      'components',
      `${fileName}.json`
    );
    
    if (!fs.existsSync(tokenPath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(tokenPath, 'utf-8');
    return JSON.parse(fileContent) as ComponentTokenData;
  } catch (error) {
    console.error(`Error loading tokens for ${componentName}:`, error);
    return null;
  }
}

/**
 * Flattens nested token structure into a path-based format
 * Example: { primary: { filled: { background: { default: {...} } } } }
 * Becomes: { "primary.filled.background.default": {...} }
 */
export function flattenTokens(tokens: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(tokens)) {
    // Skip metadata keys
    if (key.startsWith('$')) {
      continue;
    }
    
    const fullPath = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && '$value' in value) {
      // This is a token value
      result[fullPath] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // This is a nested object, recurse
      Object.assign(result, flattenTokens(value, fullPath));
    } else {
      result[fullPath] = value;
    }
  }
  
  return result;
}

/**
 * Groups tokens by state/variant for easier display
 * Returns an object where keys are state paths and values are token objects
 */
export function groupTokensByState(tokens: ComponentTokenData): Record<string, Record<string, any>> {
  const flattened = flattenTokens(tokens);
  const grouped: Record<string, Record<string, any>> = {};
  
  for (const [path, value] of Object.entries(flattened)) {
    // Extract state path (everything except the last property name)
    const parts = path.split('.');
    const propertyName = parts[parts.length - 1];
    const statePath = parts.slice(0, -1).join('.');
    
    if (!grouped[statePath]) {
      grouped[statePath] = {};
    }
    
    grouped[statePath][propertyName] = value;
  }
  
  return grouped;
}

/**
 * Gets a readable state name from a state path
 */
export function getStateDisplayName(statePath: string): string {
  if (!statePath) return 'Default';
  
  const parts = statePath.split('.');
  // Return the last meaningful part (usually the state/variant name)
  return parts[parts.length - 1] || 'Default';
}

/**
 * Extracts all unique states/variants from token structure
 * Returns an array of state paths that can be used for filtering
 */
export function extractAllStates(tokens: ComponentTokenData): string[] {
  const flattened = flattenTokens(tokens);
  const statePaths = new Set<string>();
  
  for (const path of Object.keys(flattened)) {
    const parts = path.split('.');
    // Extract state path (everything except the last property)
    if (parts.length > 1) {
      const statePath = parts.slice(0, -1).join('.');
      statePaths.add(statePath);
    } else {
      // Root level tokens
      statePaths.add('');
    }
  }
  
  return Array.from(statePaths).sort();
}

/**
 * Gets tokens for a specific state path
 */
export function getTokensForState(
  tokens: ComponentTokenData,
  statePath: string
): Record<string, any> {
  const flattened = flattenTokens(tokens);
  const stateTokens: Record<string, any> = {};
  
  for (const [path, value] of Object.entries(flattened)) {
    const parts = path.split('.');
    const currentStatePath = parts.length > 1 ? parts.slice(0, -1).join('.') : '';
    
    if (currentStatePath === statePath) {
      const propertyName = parts[parts.length - 1];
      stateTokens[propertyName] = value;
    }
  }
  
  return stateTokens;
}
