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
    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{name}</div>
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

// Semantic Colors
export const SemanticColors = () => {
  const contentTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('content-'))
    .slice(0, 20);
  
  const backgroundTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('background-'))
    .slice(0, 20);
  
  return (
    <div>
      <h1>Semantic Colors</h1>
      <p>Meaning-based color tokens that reference primitives.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Content Colors</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {contentTokens.map((key) => {
            const token = semanticTokens[key];
            const resolvedValue = resolveToken(token?.$value, primitives);
            // Ensure we have a string value (color)
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
      
      <div>
        <h2>Background Colors</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {backgroundTokens.map((key) => {
            const token = semanticTokens[key];
            const resolvedValue = resolveToken(token?.$value, primitives);
            // Ensure we have a string value (color)
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
            {Object.keys(semanticTokens.typography.headlineSize || {}).map((level) => {
              const sizeToken = semanticTokens.typography.headlineSize[level];
              const lineToken = semanticTokens.typography.headlineLine[level];
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
            {Object.keys(semanticTokens.typography.bodySize || {}).map((size) => {
              const sizeToken = semanticTokens.typography.bodySize[size];
              const lineToken = semanticTokens.typography.bodyLine[size];
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
