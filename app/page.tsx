import Link from 'next/link';
import { loadTokens } from '@tokens/scripts/load-tokens';

export default function HomePage() {
  const { primitives, semanticTokens, componentTokens } = loadTokens();

  const primitiveCount = Object.keys(primitives).filter(
    (key) => !key.startsWith('$')
  ).length;
  const semanticCount = Object.keys(semanticTokens).filter(
    (key) => !key.startsWith('$')
  ).length;
  const componentCount = Object.keys(componentTokens).filter(
    (key) => !key.startsWith('$')
  ).length;

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Design Tokens</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Design tokens exported from Figma Tokens Studio, ready for use in code
        and design tools.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Primitives</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Base design tokens with raw values
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {primitiveCount}
          </p>
          <Link
            href="/tokens/primitives"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#0066cc',
            }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Semantic Tokens</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Meaning-based tokens that reference primitives
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {semanticCount}
          </p>
          <Link
            href="/tokens/semantic"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#0066cc',
            }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Component Tokens</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Component-specific tokens using hybrid approach
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {componentCount}
          </p>
          <Link
            href="/tokens/components"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#0066cc',
            }}
          >
            View all →
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Quick Links</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link href="/docs" style={{ color: '#0066cc' }}>
              Documentation
            </Link>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a
              href="http://localhost:6006"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0066cc' }}
            >
              Storybook (localhost:6006)
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
