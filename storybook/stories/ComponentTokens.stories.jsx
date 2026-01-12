import React from 'react';
import { loadTokens } from '@tokens/scripts/load-tokens';

const { componentTokens } = loadTokens();

export default {
  title: 'Tokens/Foundations/Component Tokens',
  parameters: {
    layout: 'padded',
  },
};

// Component Tokens Overview
export const Overview = () => {
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
