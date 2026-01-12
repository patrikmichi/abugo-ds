import React from 'react';
import primitives from '../tokens/primitives.json';
import semanticTokens from '../tokens/semanticTokens.json';
import componentTokens from '../tokens/componentTokens.json';

// Helper function to resolve token values
function resolveToken(path, collection) {
  if (!path || typeof path !== 'string') return null;
  const cleanPath = path.replace(/^\{|\}$/g, '');
  const parts = cleanPath.split('.');
  
  let current = collection;
  for (const part of parts) {
    if (current && typeof current === 'object' && current[part] !== undefined) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  // Always return a primitive value, never an object
  if (current && typeof current === 'object') {
    // If it's a token object, extract the value
    if (current.$value !== undefined) {
      return current.$value;
    }
    // If it's not a token object, return null
    return null;
  }
  
  // Return primitive values directly
  return current;
}

// Color Swatch Component
const ColorSwatch = ({ name, value, description }) => (
  <div style={{ marginBottom: '16px' }}>
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: value,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '8px',
      }}
    />
    <div
      style={{
        fontWeight: '600',
        marginBottom: '4px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        wordBreak: 'break-word',
        lineHeight: '1.4',
        minHeight: '1.4em',
      }}
    >
      {name}
    </div>
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
      {value}
    </div>
    {description && (
      <div style={{ fontSize: '12px', color: '#999' }}>{description}</div>
    )}
  </div>
);

// Spacing Swatch Component
const SpacingSwatch = ({ name, value }) => (
  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div
      style={{
        width: `${value}px`,
        height: '40px',
        backgroundColor: '#5690f5',
        borderRadius: '4px',
      }}
    />
    <div>
      <div style={{ fontWeight: '600' }}>{name}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{value}px</div>
    </div>
  </div>
);

// Typography Sample Component
const TypographySample = ({ name, fontSize, lineHeight, fontWeight, fontFamily }) => (
  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>
      {name}
    </div>
    <div
      style={{
        fontSize: fontSize || '16px',
        lineHeight: lineHeight || '1.5',
        fontWeight: fontWeight || '400',
        fontFamily: fontFamily || 'Venn, sans-serif',
      }}
    >
      The quick brown fox jumps over the lazy dog
    </div>
    <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
      {fontSize} / {lineHeight} / {fontWeight}
    </div>
  </div>
);

export default {
  title: 'Design Tokens',
  parameters: {
    layout: 'padded',
  },
};

// Primitives Colors
export const PrimitivesColors = () => {
  const colorFamilies = ['yellow', 'grey', 'brand', 'upgrade', 'negative', 'success', 'warning', 'aqua', 'purple', 'brown'];
  
  return (
    <div>
      <h1>Primitive Colors</h1>
      <p>Base color tokens organized by color family and scale (100-800).</p>
      
      {colorFamilies.map((family) => {
        const familyTokens = primitives[family];
        if (!familyTokens) return null;
        
        const scales = Object.keys(familyTokens).sort();
        
        return (
          <div key={family} style={{ marginBottom: '48px' }}>
            <h2 style={{ textTransform: 'capitalize', marginBottom: '24px' }}>
              {family}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px',
              }}
            >
              {scales.map((scale) => {
                const token = familyTokens[scale];
                return (
                  <ColorSwatch
                    key={scale}
                    name={`${family}.${scale}`}
                    value={token.$value}
                    description={token.$description}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to group tokens by category
function groupTokensByCategory(tokens, prefix) {
  const groups = {};
  
  tokens.forEach((key) => {
    const parts = key.replace(prefix, '').split('-');
    if (parts.length >= 2) {
      const participation = parts[0]; // passive or active
      let intent, state;
      
      // Handle special cases like "on-neutral", "on-accent", etc.
      if (parts[1] === 'on' && parts.length >= 3) {
        intent = `on-${parts[2]}`; // on-neutral, on-accent, etc.
        state = parts.slice(3).join('-') || 'default';
      } else {
        intent = parts[1]; // neutral, accent, danger, etc.
        state = parts.slice(2).join('-') || 'default';
      }
      
      if (!groups[participation]) groups[participation] = {};
      if (!groups[participation][intent]) groups[participation][intent] = [];
      groups[participation][intent].push({ key, state });
    }
  });
  
  return groups;
}

// Semantic Colors
export const SemanticColors = () => {
  // Get all content tokens
  const contentTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('content-'))
    .sort();
  
  // Get all background tokens
  const backgroundTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('background-'))
    .sort();
  
  // Group tokens by category
  const contentGroups = groupTokensByCategory(contentTokens, 'content-');
  const backgroundGroups = groupTokensByCategory(backgroundTokens, 'background-');
  
  // Get border tokens (nested structure)
  const borderGroups = semanticTokens.border ? (() => {
    const groups = {};
    function extractBorderColors(obj, path = []) {
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith('$')) continue;
        if (v && typeof v === 'object' && v.$type === 'color') {
          const fullPath = [...path, k].join('.');
          const participation = path[0] || 'active';
          const intent = path[1] || 'neutral';
          const controlType = path[2] || '';
          const state = k;
          
          if (!groups[participation]) groups[participation] = {};
          const groupKey = controlType ? `${intent}.${controlType}` : intent;
          if (!groups[participation][groupKey]) groups[participation][groupKey] = [];
          groups[participation][groupKey].push({ path: `border.${fullPath}`, token: v, state });
        } else if (v && typeof v === 'object') {
          extractBorderColors(v, [...path, k]);
        }
      }
    }
    extractBorderColors(semanticTokens.border);
    return groups;
  })() : {};
  
  // Get custom tokens
  const customTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('custom-'))
    .sort();
  
  const renderColorGroup = (tokens, title) => (
    <div style={{ marginBottom: '48px' }}>
      <h2>{title}</h2>
      {Object.keys(tokens).sort().map((participation) => (
        <div key={participation} style={{ marginBottom: '32px' }}>
          <h3 style={{ textTransform: 'capitalize', marginBottom: '16px', color: '#666' }}>
            {participation}
          </h3>
          {Object.keys(tokens[participation]).sort().map((intent) => (
            <div key={intent} style={{ marginBottom: '24px' }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
                {intent.replace(/-/g, ' ')}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {tokens[participation][intent].map(({ key, state }) => {
                  const token = semanticTokens[key];
                  const resolvedValue = resolveToken(token?.$value, primitives);
                  const colorValue = typeof resolvedValue === 'string' ? resolvedValue : (token?.$value && typeof token.$value === 'string' ? token.$value : '#000000');
                  return (
                    <ColorSwatch
                      key={key}
                      name={key}
                      value={colorValue}
                      description={token?.$description}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
  const renderBorderGroup = (groups, title) => (
    <div style={{ marginBottom: '48px' }}>
      <h2>{title}</h2>
      {Object.keys(groups).sort().map((participation) => (
        <div key={participation} style={{ marginBottom: '32px' }}>
          <h3 style={{ textTransform: 'capitalize', marginBottom: '16px', color: '#666' }}>
            {participation}
          </h3>
          {Object.keys(groups[participation]).sort().map((intent) => (
            <div key={intent} style={{ marginBottom: '24px' }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
                {intent.replace(/\./g, ' / ').replace(/-/g, ' ')}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {groups[participation][intent].map(({ path, token, state }) => {
                  const resolvedValue = resolveToken(token?.$value, primitives);
                  const colorValue = typeof resolvedValue === 'string' ? resolvedValue : (token?.$value && typeof token.$value === 'string' ? token.$value : '#000000');
                  return (
                    <ColorSwatch
                      key={path}
                      name={path}
                      value={colorValue}
                      description={token?.$description}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
  return (
    <div>
      <h1>Semantic Colors</h1>
      <p>Meaning-based color tokens that reference primitives, organized by category.</p>
      
      {renderColorGroup(contentGroups, `Content Colors (${contentTokens.length} tokens)`)}
      
      {renderColorGroup(backgroundGroups, `Background Colors (${backgroundTokens.length} tokens)`)}
      
      {Object.keys(borderGroups).length > 0 && (
        renderBorderGroup(borderGroups, 'Border Colors')
      )}
      
      {customTokens.length > 0 && (
        <div>
          <h2>Custom Colors ({customTokens.length} tokens)</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {customTokens.map((key) => {
              const token = semanticTokens[key];
              const resolvedValue = resolveToken(token?.$value, primitives);
              const colorValue = typeof resolvedValue === 'string' ? resolvedValue : (token?.$value && typeof token.$value === 'string' ? token.$value : '#000000');
              return (
                <ColorSwatch
                  key={key}
                  name={key}
                  value={colorValue}
                  description={token?.$description}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Spacing Tokens
export const Spacing = () => {
  const spacingKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('spacing-'))
    .sort((a, b) => {
      const aNum = parseInt(a.replace('spacing-', '').replace('-', '.')) || 0;
      const bNum = parseInt(b.replace('spacing-', '').replace('-', '.')) || 0;
      return aNum - bNum;
    });
  
  return (
    <div>
      <h1>Spacing Tokens</h1>
      <p>Spacing scale for consistent spacing throughout the design system.</p>
      
      <div style={{ maxWidth: '600px' }}>
        {spacingKeys.map((key) => {
          const token = primitives[key];
          return (
            <SpacingSwatch
              key={key}
              name={key}
              value={token.$value}
            />
          );
        })}
      </div>
    </div>
  );
};

// Typography Tokens
export const Typography = () => {
  const fontSizes = Object.keys(primitives)
    .filter((key) => key.startsWith('typography-fontSize-'))
    .sort();
  
  const lineHeights = Object.keys(primitives)
    .filter((key) => key.startsWith('typography-lineHeight-') && !key.includes('tight') && !key.includes('base') && !key.includes('relaxed') && !key.includes('loose'))
    .sort();
  
  return (
    <div>
      <h1>Typography Tokens</h1>
      <p>Typography scale including font sizes, line heights, and font weights.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Font Sizes</h2>
        {fontSizes.map((key) => {
          const token = primitives[key];
          const remValue = token.$value;
          const pxValue = parseFloat(remValue) * 16;
          
          return (
            <TypographySample
              key={key}
              name={key}
              fontSize={remValue}
              lineHeight="1.5"
              fontWeight="400"
            />
          );
        })}
      </div>
      
      <div>
        <h2>Semantic Typography</h2>
        {semanticTokens.typography && (
          <>
            <h3>Headlines</h3>
            {Object.keys(semanticTokens.typography['headline-size'] || {}).map((level) => {
              const sizeToken = semanticTokens.typography['headline-size'][level];
              const lineToken = semanticTokens.typography['headline-line'][level];
              const size = resolveToken(sizeToken?.$value, primitives);
              const lineHeight = resolveToken(lineToken?.$value, primitives);
              
              // Ensure we have valid string/number values
              const fontSizeValue = typeof size === 'string' || typeof size === 'number' ? size : '1rem';
              const lineHeightValue = typeof lineHeight === 'string' || typeof lineHeight === 'number' ? lineHeight : '1.5';
              
              return (
                <TypographySample
                  key={level}
                  name={`Headline ${level.toUpperCase()}`}
                  fontSize={fontSizeValue}
                  lineHeight={lineHeightValue}
                  fontWeight="700"
                />
              );
            })}
            
            <h3>Body Text</h3>
            {Object.keys(semanticTokens.typography['body-size'] || {}).map((size) => {
              const sizeToken = semanticTokens.typography['body-size'][size];
              const lineToken = semanticTokens.typography['body-line'][size];
              const fontSize = resolveToken(sizeToken?.$value, primitives);
              const lineHeight = resolveToken(lineToken?.$value, primitives);
              
              // Ensure we have valid string/number values
              const fontSizeValue = typeof fontSize === 'string' || typeof fontSize === 'number' ? fontSize : '1rem';
              const lineHeightValue = typeof lineHeight === 'string' || typeof lineHeight === 'number' ? lineHeight : '1.5';
              
              return (
                <TypographySample
                  key={size}
                  name={`Body ${size.toUpperCase()}`}
                  fontSize={fontSizeValue}
                  lineHeight={lineHeightValue}
                  fontWeight="400"
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

// Border Radius
export const BorderRadius = () => {
  const radiusKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('radius-'))
    .sort();
  
  return (
    <div>
      <h1>Border Radius Tokens</h1>
      <p>Border radius values for rounded corners.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        {radiusKeys.map((key) => {
          const token = primitives[key];
          const value = token.$value;
          
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#5690f5',
                  borderRadius: `${value}px`,
                  margin: '0 auto 16px',
                }}
              />
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{value}px</div>
            </div>
          );
        })}
      </div>
      
      {semanticTokens.radius && (
        <div style={{ marginTop: '48px' }}>
          <h2>Semantic Border Radius</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
            {Object.keys(semanticTokens.radius).map((key) => {
              const token = semanticTokens.radius[key];
              const value = resolveToken(token?.$value, primitives);
              
              // Ensure we have a valid number value
              const radiusValue = typeof value === 'number' ? value : (typeof value === 'string' ? parseFloat(value) || 0 : 0);
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#5690f5',
                      borderRadius: `${radiusValue}px`,
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>radius.{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{radiusValue}px</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Shadows
export const Shadows = () => {
  const shadowKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('shadow-'))
    .sort();
  
  return (
    <div>
      <h1>Shadow Tokens</h1>
      <p>Box shadow values for elevation and depth.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {shadowKeys.map((key) => {
          const token = primitives[key];
          const shadowValue = token.$value;
          
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: shadowValue,
                  margin: '0 auto 16px',
                }}
              />
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
                {shadowValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Feature Colors (Primitives)
export const FeatureColors = () => {
  const featureFamilies = ['passes', 'ai-features'];
  
  return (
    <div>
      <h1>Feature Colors (Primitives)</h1>
      <p>Feature-specific color tokens for passes and AI features.</p>
      
      {featureFamilies.map((family) => {
        const familyTokens = primitives[family];
        if (!familyTokens) return null;
        
        return (
          <div key={family} style={{ marginBottom: '48px' }}>
            <h2 style={{ textTransform: 'capitalize', marginBottom: '24px' }}>
              {family.replace(/-/g, ' ')}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {Object.keys(familyTokens).map((category) => {
                const categoryTokens = familyTokens[category];
                if (typeof categoryTokens === 'object' && categoryTokens !== null) {
                  return Object.keys(categoryTokens).map((variant) => {
                    const token = categoryTokens[variant];
                    return (
                      <ColorSwatch
                        key={`${family}.${category}.${variant}`}
                        name={`${family}.${category}.${variant}`}
                        value={token.$value}
                        description={token.$description}
                      />
                    );
                  });
                }
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Border Width (Primitives)
export const BorderWidth = () => {
  const borderWidthKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('border-width-'))
    .sort();
  
  return (
    <div>
      <h1>Border Width Tokens (Primitives)</h1>
      <p>Border width values for consistent borders.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        {borderWidthKeys.map((key) => {
          const token = primitives[key];
          const value = token.$value;
          
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#f7f7f7',
                  border: `${value}px solid #5690f5`,
                  borderRadius: '8px',
                  margin: '0 auto 16px',
                }}
              />
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{value}px</div>
            </div>
          );
        })}
      </div>
      
      {semanticTokens['border-width-thin'] && (
        <div style={{ marginTop: '48px' }}>
          <h2>Semantic Border Width</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
            {['border-width-thin', 'border-width-thicker', 'border-width-thick'].map((key) => {
              const token = semanticTokens[key];
              if (!token) return null;
              const value = resolveToken(token?.$value, primitives);
              const borderValue = typeof value === 'number' ? value : 0;
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#f7f7f7',
                      border: `${borderValue}px solid #5690f5`,
                      borderRadius: '8px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{borderValue}px</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Size (Primitives)
export const IconSize = () => {
  const iconSizeTokens = primitives['icon-size'];
  
  return (
    <div>
      <h1>Icon Size Tokens (Primitives)</h1>
      <p>Icon size scale for consistent iconography.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
        {iconSizeTokens && Object.keys(iconSizeTokens).map((key) => {
          const token = iconSizeTokens[key];
          const value = token.$value;
          
          return (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: `${value}px`,
                  height: `${value}px`,
                  backgroundColor: '#5690f5',
                  borderRadius: '4px',
                  margin: '0 auto 16px',
                }}
              />
              <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>{key}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{value}px</div>
            </div>
          );
        })}
      </div>
      
      {semanticTokens.icon && (
        <div style={{ marginTop: '48px' }}>
          <h2>Semantic Icon Sizes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
            {Object.keys(semanticTokens.icon).map((key) => {
              const token = semanticTokens.icon[key];
              const value = resolveToken(token?.$value, primitives);
              const iconValue = typeof value === 'number' ? value : 24;
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: `${iconValue}px`,
                      height: `${iconValue}px`,
                      backgroundColor: '#5690f5',
                      borderRadius: '4px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>icon.{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{iconValue}px</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Z-Index (Primitives & Semantic)
export const ZIndex = () => {
  const zIndexTokens = primitives['z-index'];
  
  return (
    <div>
      <h1>Z-Index Tokens</h1>
      <p>Z-index values for layering elements.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Primitive Z-Index</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {zIndexTokens && Object.keys(zIndexTokens).map((key) => {
            const token = zIndexTokens[key];
            const value = token.$value;
            
            return (
              <div
                key={key}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f7f7f7',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: '24px', color: '#5690f5', fontWeight: 'bold' }}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {semanticTokens['z-index'] && (
        <div>
          <h2>Semantic Z-Index</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.keys(semanticTokens['z-index']).map((key) => {
              const token = semanticTokens['z-index'][key];
              const value = resolveToken(token?.$value, primitives);
              const zValue = typeof value === 'number' ? value : 0;
              
              return (
                <div
                  key={key}
                  style={{
                    padding: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f7f7f7',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>z-index.{key}</div>
                  <div style={{ fontSize: '24px', color: '#5690f5', fontWeight: 'bold' }}>{zValue}</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Opacity (Primitives & Semantic)
export const Opacity = () => {
  const opacityKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('opacity-'))
    .sort((a, b) => {
      const aNum = parseInt(a.replace('opacity-', '')) || 0;
      const bNum = parseInt(b.replace('opacity-', '')) || 0;
      return aNum - bNum;
    });
  
  return (
    <div>
      <h1>Opacity Tokens</h1>
      <p>Opacity values for transparency effects.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Primitive Opacity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {opacityKeys.map((key) => {
            const token = primitives[key];
            const value = token.$value;
            const percentage = Math.round(value * 100);
            
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: `rgba(86, 144, 245, ${value})`,
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    margin: '0 auto 16px',
                  }}
                />
                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>{key}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {semanticTokens.opacity && (
        <div>
          <h2>Semantic Opacity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.keys(semanticTokens.opacity).map((key) => {
              const token = semanticTokens.opacity[key];
              const value = token.$value;
              const percentage = typeof value === 'number' ? value : 0;
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: `rgba(86, 144, 245, ${percentage / 100})`,
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>opacity.{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{percentage}%</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Sizing (Primitives & Semantic)
export const Sizing = () => {
  const sizeKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('size-'))
    .sort();
  
  return (
    <div>
      <h1>Sizing Tokens</h1>
      <p>Size values for dimensions and control heights.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Primitive Sizing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
          {sizeKeys.map((key) => {
            const token = primitives[key];
            const value = token.$value;
            
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: `${value}px`,
                    height: `${value}px`,
                    backgroundColor: '#5690f5',
                    borderRadius: '4px',
                    margin: '0 auto 16px',
                  }}
                />
                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>{key}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{value}px</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {semanticTokens.control && semanticTokens.control.height && (
        <div style={{ marginBottom: '48px' }}>
          <h2>Semantic Control Heights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
            {Object.keys(semanticTokens.control.height).map((key) => {
              const token = semanticTokens.control.height[key];
              const value = resolveToken(token?.$value, primitives);
              const heightValue = typeof value === 'number' ? value : 40;
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '120px',
                      height: `${heightValue}px`,
                      backgroundColor: '#5690f5',
                      borderRadius: '4px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>control.height.{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{heightValue}px</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {semanticTokens.sizing && (
        <div>
          <h2>Semantic Sizing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.keys(semanticTokens.sizing).map((key) => {
              const token = semanticTokens.sizing[key];
              const value = resolveToken(token?.$value, primitives);
              const sizeValue = typeof value === 'number' ? value : 16;
              
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: `${sizeValue}px`,
                      height: `${sizeValue}px`,
                      backgroundColor: '#5690f5',
                      borderRadius: '4px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>sizing.{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{sizeValue}px</div>
                  {token.$description && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Animation (Primitives & Semantic)
export const Animation = () => {
  const durationKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('duration-') || key.startsWith('animation-duration-'))
    .sort();
  
  const easingKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('easing-') || key.startsWith('animation-easing-'))
    .sort();
  
  return (
    <div>
      <h1>Animation Tokens</h1>
      <p>Animation duration and easing values for transitions.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Primitive Durations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {durationKeys.map((key) => {
            const token = primitives[key];
            const value = token.$value;
            
            return (
              <div
                key={key}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f7f7f7',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: '20px', color: '#5690f5', fontWeight: 'bold' }}>{value}ms</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Primitive Easing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {easingKeys.map((key) => {
            const token = primitives[key];
            const value = token.$value;
            
            return (
              <div
                key={key}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f7f7f7',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {semanticTokens.animation && (
        <div>
          <h2>Semantic Animation</h2>
          {semanticTokens.animation.duration && (
            <div style={{ marginBottom: '32px' }}>
              <h3>Duration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {Object.keys(semanticTokens.animation.duration).map((key) => {
                  const token = semanticTokens.animation.duration[key];
                  const value = resolveToken(token?.$value, primitives);
                  const durationValue = typeof value === 'number' ? value : 200;
                  
                  return (
                    <div
                      key={key}
                      style={{
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f7f7f7',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>animation.duration.{key}</div>
                      <div style={{ fontSize: '20px', color: '#5690f5', fontWeight: 'bold' }}>{durationValue}ms</div>
                      {token.$description && (
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {semanticTokens.animation.easing && (
            <div>
              <h3>Easing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {Object.keys(semanticTokens.animation.easing).map((key) => {
                  const token = semanticTokens.animation.easing[key];
                  const value = resolveToken(token?.$value, primitives);
                  const easingValue = typeof value === 'string' ? value : 'linear';
                  
                  return (
                    <div
                      key={key}
                      style={{
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f7f7f7',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>animation.easing.{key}</div>
                      <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>{easingValue}</div>
                      {token.$description && (
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Gap & Padding (Semantic)
export const GapAndPadding = () => {
  return (
    <div>
      <h1>Gap & Padding Tokens (Semantic)</h1>
      <p>Spacing tokens for gaps and padding, referencing primitive spacing values.</p>
      
      {semanticTokens.gap && (
        <div style={{ marginBottom: '48px' }}>
          <h2>Gap Tokens</h2>
          <div style={{ maxWidth: '600px' }}>
            {Object.keys(semanticTokens.gap).map((key) => {
              const token = semanticTokens.gap[key];
              const value = resolveToken(token?.$value, primitives);
              const gapValue = typeof value === 'number' ? value : 0;
              
              return (
                <div key={key} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: `${gapValue}px`,
                      height: '40px',
                      backgroundColor: '#5690f5',
                      borderRadius: '4px',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>gap.{key}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{gapValue}px</div>
                    {token.$description && (
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{token.$description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {semanticTokens.padding && (
        <div>
          <h2>Padding Tokens</h2>
          <div style={{ maxWidth: '600px' }}>
            {Object.keys(semanticTokens.padding).map((key) => {
              const token = semanticTokens.padding[key];
              const value = resolveToken(token?.$value, primitives);
              const paddingValue = typeof value === 'number' ? value : 0;
              
              return (
                <div key={key} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: `${paddingValue}px`,
                      height: '40px',
                      backgroundColor: '#5690f5',
                      borderRadius: '4px',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>padding.{key}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{paddingValue}px</div>
                    {token.$description && (
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{token.$description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Semantic Shadows
export const SemanticShadows = () => {
  return (
    <div>
      <h1>Semantic Shadow Tokens</h1>
      <p>Semantic shadow tokens that reference primitive shadow values.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {Object.keys(semanticTokens)
          .filter((key) => key.startsWith('shadow-'))
          .map((key) => {
            const token = semanticTokens[key];
            const shadowValue = resolveToken(token?.$value, primitives);
            const shadow = typeof shadowValue === 'string' ? shadowValue : '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: shadow,
                    margin: '0 auto 16px',
                  }}
                />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
                  {shadow}
                </div>
                {token.$description && (
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{token.$description}</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

// Component Tokens Overview
export const ComponentTokens = () => {
  const components = Object.keys(componentTokens).filter((key) => !key.startsWith('$') && key !== 'icon');
  
  return (
    <div>
      <h1>Component Tokens</h1>
      <p>Component-specific tokens that reference semantic tokens.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {components.map((component) => {
          const componentData = componentTokens[component];
          const tokenCount = Object.keys(componentData || {}).length;
          
          return (
            <div
              key={component}
              style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '8px', textTransform: 'capitalize' }}>
                {component.replace(/-/g, ' ')}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {tokenCount} token{tokenCount !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
      
      {componentTokens.icon && (
        <div style={{ marginTop: '48px' }}>
          <h2>Icon Tokens</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.keys(componentTokens.icon).map((component) => {
              const iconData = componentTokens.icon[component];
              return (
                <div
                  key={component}
                  style={{
                    padding: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '8px', textTransform: 'capitalize' }}>
                    icon.{component}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {Object.keys(iconData || {}).length} size{Object.keys(iconData || {}).length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
