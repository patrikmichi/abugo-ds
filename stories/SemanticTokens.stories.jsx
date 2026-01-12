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
  
  if (current && typeof current === 'object') {
    if (current.$value !== undefined) {
      return current.$value;
    }
    return null;
  }
  
  return current;
}

// Helper function to group tokens by category
function groupTokensByCategory(tokens, prefix) {
  const groups = {};
  
  tokens.forEach((key) => {
    const parts = key.replace(prefix, '').split('-');
    if (parts.length >= 2) {
      const participation = parts[0];
      let intent, state;
      
      if (parts[1] === 'on' && parts.length >= 3) {
        intent = `on-${parts[2]}`;
        state = parts.slice(3).join('-') || 'default';
      } else {
        intent = parts[1];
        state = parts.slice(2).join('-') || 'default';
      }
      
      if (!groups[participation]) groups[participation] = {};
      if (!groups[participation][intent]) groups[participation][intent] = [];
      groups[participation][intent].push({ key, state });
    }
  });
  
  return groups;
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

export default {
  title: 'Tokens/Foundations/Semantic Tokens',
  parameters: {
    layout: 'padded',
  },
};

// Semantic Colors
export const Colors = () => {
  const contentTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('content-'))
    .sort();
  
  const backgroundTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('background-'))
    .sort();
  
  const contentGroups = groupTokensByCategory(contentTokens, 'content-');
  const backgroundGroups = groupTokensByCategory(backgroundTokens, 'background-');
  
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
  
  const customTokens = Object.keys(semanticTokens)
    .filter((key) => key.startsWith('notes-') || key === 'rating')
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

// Semantic Typography
export const Typography = () => {
  return (
    <div>
      <h1>Semantic Typography</h1>
      <p>Typography tokens that reference primitives.</p>
      
      {semanticTokens.typography && (
        <>
          <h2>Headlines</h2>
          {Object.keys(semanticTokens.typography['headline-size'] || {}).map((level) => {
            const sizeToken = semanticTokens.typography['headline-size'][level];
            const lineToken = semanticTokens.typography['headline-line'][level];
            const size = resolveToken(sizeToken?.$value, primitives);
            const lineHeight = resolveToken(lineToken?.$value, primitives);
            
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
          
          <h2>Body Text</h2>
          {Object.keys(semanticTokens.typography['body-size'] || {}).map((size) => {
            const sizeToken = semanticTokens.typography['body-size'][size];
            const lineToken = semanticTokens.typography['body-line'][size];
            const fontSize = resolveToken(sizeToken?.$value, primitives);
            const lineHeight = resolveToken(lineToken?.$value, primitives);
            
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
  );
};

// Border Width (Semantic)
export const BorderWidth = () => {
  return (
    <div>
      <h1>Semantic Border Width</h1>
      <p>Semantic border width tokens that reference primitives.</p>
      
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
  );
};

// Border Radius (Semantic)
export const BorderRadius = () => {
  return (
    <div>
      <h1>Semantic Border Radius</h1>
      <p>Semantic border radius tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        {Object.keys(semanticTokens.radius || {}).map((key) => {
          const token = semanticTokens.radius[key];
          const value = resolveToken(token?.$value, primitives);
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

// Icon Size (Semantic)
export const IconSize = () => {
  return (
    <div>
      <h1>Semantic Icon Sizes</h1>
      <p>Semantic icon size tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
        {Object.keys(semanticTokens.icon || {}).map((key) => {
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
  );
};

// Z-Index (Semantic)
export const ZIndex = () => {
  return (
    <div>
      <h1>Semantic Z-Index</h1>
      <p>Semantic z-index tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {Object.keys(semanticTokens['z-index'] || {}).map((key) => {
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
  );
};

// Opacity (Semantic)
export const Opacity = () => {
  return (
    <div>
      <h1>Semantic Opacity</h1>
      <p>Semantic opacity tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {Object.keys(semanticTokens.opacity || {}).map((key) => {
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
  );
};

// Control Heights (Semantic)
export const ControlHeights = () => {
  return (
    <div>
      <h1>Semantic Control Heights</h1>
      <p>Semantic control height tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '24px' }}>
        {Object.keys(semanticTokens.control?.height || {}).map((key) => {
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
  );
};

// Sizing (Semantic)
export const Sizing = () => {
  return (
    <div>
      <h1>Semantic Sizing</h1>
      <p>Semantic sizing tokens that reference primitives.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {Object.keys(semanticTokens.sizing || {}).map((key) => {
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
  );
};

// Animation (Semantic)
export const Animation = () => {
  return (
    <div>
      <h1>Semantic Animation</h1>
      <p>Semantic animation tokens that reference primitives.</p>
      
      {semanticTokens.animation?.duration && (
        <div style={{ marginBottom: '32px' }}>
          <h2>Duration</h2>
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
      
      {semanticTokens.animation?.easing && (
        <div>
          <h2>Easing</h2>
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
  );
};

// Gap & Padding (Semantic)
export const GapAndPadding = () => {
  return (
    <div>
      <h1>Gap & Padding Tokens</h1>
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
export const Shadows = () => {
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
