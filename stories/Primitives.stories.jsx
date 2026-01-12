import React from 'react';
import primitives from '../tokens/primitives.json';
import semanticTokens from '../tokens/semanticTokens.json';

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
  title: 'Tokens/Foundations/Primitives',
  parameters: {
    layout: 'padded',
  },
};

// Primitives Colors
export const Colors = () => {
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
  
  return (
    <div>
      <h1>Typography Tokens</h1>
      <p>Typography scale including font sizes, line heights, and font weights.</p>
      
      <div style={{ marginBottom: '48px' }}>
        <h2>Font Sizes</h2>
        {fontSizes.map((key) => {
          const token = primitives[key];
          const remValue = token.$value;
          
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
    </div>
  );
};

// Z-Index (Primitives)
export const ZIndex = () => {
  const zIndexTokens = primitives['z-index'];
  
  return (
    <div>
      <h1>Z-Index Tokens</h1>
      <p>Z-index values for layering elements.</p>
      
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
  );
};

// Opacity (Primitives)
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
  );
};

// Sizing (Primitives)
export const Sizing = () => {
  const sizeKeys = Object.keys(primitives)
    .filter((key) => key.startsWith('size-'))
    .sort();
  
  return (
    <div>
      <h1>Sizing Tokens</h1>
      <p>Size values for dimensions and control heights.</p>
      
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
  );
};

// Animation (Primitives)
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
        <h2>Durations</h2>
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
      
      <div>
        <h2>Easing</h2>
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
    </div>
  );
};
