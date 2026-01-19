import React, { useEffect, useState, useMemo } from 'react';
import { loadComponentTokens, flattenTokens, extractAllStates, getTokensForState, getStateDisplayName } from '../lib/tokenUtils';
import type { ComponentTokenData } from '../lib/types';
import { Button, ButtonIcon } from '@/components/Button';
import { Select, type SelectOption } from '@/components/Select/Select';

interface TokenDisplayProps {
  componentName: string;
  state?: string; // Optional: filter to specific state
  componentProps?: Record<string, any>; // Component props from Storybook argTypes
}

// Helper function to get token value
const getTokenValue = (token: any): string => {
  if (!token) return '';
  if (typeof token === 'string') return token;
  if (token.$value) return token.$value;
  if (typeof token === 'object') {
    return JSON.stringify(token, null, 2);
  }
  return String(token);
};

// Helper function to copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // Could add a toast notification here
  }).catch((err) => {
    console.error('Failed to copy to clipboard:', err);
  });
};

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ componentName, state: initialState, componentProps }) => {
  const [tokens, setTokens] = useState<ComponentTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [showProps, setShowProps] = useState(true);

  useEffect(() => {
    async function loadTokens() {
      setLoading(true);
      setError(null);
      
      try {
        const tokenData = await loadComponentTokens(componentName);
        if (!tokenData) {
          setLoading(false);
          return;
        }
        setTokens(tokenData);
        
        // Set initial state - use provided initialState or default to first state
        const allStates = extractAllStates(tokenData);
        if (allStates.length > 0) {
          if (initialState) {
            const matchingState = allStates.find(s => s.includes(initialState) || getStateDisplayName(s) === initialState);
            if (matchingState !== undefined) {
              setSelectedState(matchingState);
            } else {
              setSelectedState(allStates[0]);
            }
          } else {
            setSelectedState(allStates[0]);
          }
        }
      } catch (err) {
        console.warn(`Could not load tokens for ${componentName}:`, err);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    loadTokens().catch(() => {
      setLoading(false);
    });
  }, [componentName, initialState]);

  const allStates = useMemo(() => {
    if (!tokens) return [];
    return extractAllStates(tokens);
  }, [tokens]);

  const flattenedTokens = useMemo(() => {
    if (!tokens) return {};
    return flattenTokens(tokens);
  }, [tokens]);
  
  // Prepare options for Select component
  const stateOptions = useMemo<SelectOption[]>(() => 
    allStates.map((statePath) => ({
      value: statePath,
      label: getStateDisplayName(statePath),
    })),
  [allStates]);

  // Early return check must come AFTER all hooks
  if (loading || error || !tokens) {
    return null;
  }
  
  // Filter tokens based on selected state
  let tokensToShow: Record<string, any> = {};
  if (selectedState && selectedState !== 'all') {
    tokensToShow = getTokensForState(tokens, selectedState);
  } else if (allStates.length > 0 && selectedState === '') {
    // If no state selected yet, show first state's tokens
    tokensToShow = getTokensForState(tokens, allStates[0]);
  } else {
    tokensToShow = flattenedTokens;
  }

  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#111827',
              }}
            >
              Tokens
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Use these tokens to recreate the same structure in Figma. Select a state to filter tokens, or view all tokens.
            </p>
          </div>
          <Button
            variant="secondary"
            appearance="plain"
            size="sm"
            icon="content_copy"
            iconPosition="start"
            onClick={() => {
              const allTokensText = Object.entries(tokensToShow)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([tokenPath, token]) => {
                  const value = getTokenValue(token);
                  return `${tokenPath}: ${value}`;
                })
                .join('\n');
              
              const stateLabel = selectedState ? ` (${getStateDisplayName(selectedState)})` : '';
              const fullText = `Tokens for ${componentName}${stateLabel}\n\n${allTokensText}`;
              copyToClipboard(fullText);
            }}
          >
            Copy All
          </Button>
        </div>

        {/* State Selector */}
        {allStates.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Select
              value={selectedState || allStates[0]}
              onChange={(value) => {
                const newValue = typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : '');
                setSelectedState(newValue || allStates[0]);
              }}
              options={stateOptions}
              size="sm"
              style={{ minWidth: '200px' }}
            />
          </div>
        )}
      </div>

      {/* Component Props Section Toggle */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
          Component Props
        </h3>
        <Button
          variant="secondary"
          appearance="plain"
          size="sm"
          onClick={() => setShowProps(!showProps)}
        >
          {showProps ? 'Hide' : 'Show'} Props
        </Button>
      </div>

      {/* Component Props Content */}
      {showProps && (
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          {componentProps && Object.keys(componentProps).length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>
                      Prop Name
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>
                      Type
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, width: '60%' }}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(componentProps)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([propName, propInfo]: [string, any], index) => (
                      <tr
                        key={propName}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <td
                          style={{
                            padding: '0.75rem',
                            borderRight: '1px solid #e5e7eb',
                            fontWeight: 500,
                            color: '#1f2937',
                          }}
                        >
                          <code
                            style={{
                              backgroundColor: '#f3f4f6',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.8125rem',
                            }}
                          >
                            {propName}
                          </code>
                          {propInfo?.table?.defaultValue && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              Default: {String(propInfo.table.defaultValue.summary || propInfo.table.defaultValue)}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem',
                            borderRight: '1px solid #e5e7eb',
                            color: '#6b7280',
                          }}
                        >
                          {propInfo?.table?.type?.summary || propInfo?.type?.name || '-'}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem',
                            color: '#374151',
                          }}
                        >
                          {propInfo?.description || propInfo?.table?.type?.detail || '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
              Props information not available. Check the component's TypeScript interface for full prop definitions.
            </p>
          )}
        </div>
      )}

      {/* Tokens Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  borderRight: '1px solid #e5e7eb',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  borderRight: '1px solid #e5e7eb',
                }}
              >
                Token Name
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  width: '60%',
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tokensToShow)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([tokenPath, token], index) => {
                const tokenDataType = token && typeof token === 'object' ? token.$type || '' : '';
                
                // Extract type category from path (background, content, border, padding, etc.)
                const pathParts = tokenPath.split('.');
                // Common type categories based on path structure
                let typeCategory = '';
                if (pathParts.some(p => p === 'background' || p === 'bg')) {
                  typeCategory = 'background';
                } else if (pathParts.some(p => p === 'content' || p === 'text' || p === 'color')) {
                  typeCategory = 'text color';
                } else if (pathParts.some(p => p === 'border')) {
                  typeCategory = 'border';
                } else if (pathParts.some(p => p === 'padding' || p === 'p')) {
                  typeCategory = 'padding';
                } else if (pathParts.some(p => p === 'margin' || p === 'm')) {
                  typeCategory = 'margin';
                } else if (pathParts.some(p => p === 'icon')) {
                  typeCategory = 'icon';
                } else if (pathParts.some(p => p === 'shadow' || p === 'boxShadow')) {
                  typeCategory = 'shadow';
                } else if (pathParts.some(p => p === 'fontSize' || p === 'font-size' || p === 'typography')) {
                  typeCategory = 'typography';
                } else if (pathParts.some(p => p === 'height' || p === 'width' || p === 'size')) {
                  typeCategory = 'sizing';
                } else if (pathParts.some(p => p === 'radius' || p === 'borderRadius')) {
                  typeCategory = 'border radius';
                } else if (pathParts.some(p => p === 'gap' || p === 'spacing')) {
                  typeCategory = 'spacing';
                } else {
                  // Fallback: use the first meaningful part or token data type
                  typeCategory = pathParts[0] || tokenDataType || 'other';
                }
                
                // Token name is the last part of the path (the property name)
                const tokenName = pathParts[pathParts.length - 1] || tokenPath;
                
                return (
                  <tr
                    key={tokenPath}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRight: '1px solid #e5e7eb',
                        color: '#374151',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                      }}
                    >
                      {typeCategory}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRight: '1px solid #e5e7eb',
                        fontWeight: 500,
                        color: '#1f2937',
                      }}
                    >
                      <code
                        style={{
                          backgroundColor: '#f3f4f6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {tokenName}
                      </code>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <code
                          style={{
                            flex: 1,
                            color: '#059669',
                            wordBreak: 'break-all',
                          }}
                        >
                          {getTokenValue(token)}
                        </code>
                        <Button
                          variant="secondary"
                          appearance="plain"
                          size="sm"
                          iconOnly
                          onClick={() => copyToClipboard(getTokenValue(token))}
                          aria-label="Copy token value to clipboard"
                          title="Copy value to clipboard"
                        >
                          <ButtonIcon name="content_copy" />
                        </Button>
                      </div>
                      {token?.$description && (
                        <div
                          style={{
                            marginTop: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontStyle: 'italic',
                          }}
                        >
                          {token.$description}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {Object.keys(tokensToShow).length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No tokens found for the selected state.
        </div>
      )}
    </div>
  );
};
