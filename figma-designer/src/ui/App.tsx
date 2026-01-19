import React, { useState, useCallback, useEffect } from 'react';
import type { DesignJson, UIMessage, VariableExportData, ComparisonResultData } from '../schemas/design-json';

// =============================================================================
// Embedded Button Component Sets
// =============================================================================

// These are embedded at build time - in production you'd fetch these
const BUTTON_COMPONENTS = [
  { id: 'primary', name: 'Button/Primary', appearances: ['filled', 'plain'] },
  { id: 'secondary', name: 'Button/Secondary', appearances: ['filled', 'plain'] },
  { id: 'tertiary', name: 'Button/Tertiary', appearances: ['plain'] },
  { id: 'upgrade', name: 'Button/Upgrade', appearances: ['filled', 'plain'] },
  { id: 'danger', name: 'Button/Danger', appearances: ['filled', 'plain'] },
];

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '16px',
    gap: '16px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--figma-color-text)',
  },
  subtitle: {
    fontSize: '11px',
    color: 'var(--figma-color-text-secondary)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--figma-color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  textarea: {
    width: '100%',
    minHeight: '160px',
    padding: '12px',
    border: '1px solid var(--figma-color-border)',
    borderRadius: '6px',
    background: 'var(--figma-color-bg-secondary)',
    color: 'var(--figma-color-text)',
    fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, monospace",
    fontSize: '11px',
    lineHeight: '1.5',
    resize: 'vertical',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: '2px dashed var(--figma-color-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  fileLabelHover: {
    borderColor: 'var(--figma-color-border-brand)',
    background: 'var(--figma-color-bg-brand-tertiary)',
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    background: 'var(--figma-color-bg-secondary)',
    borderRadius: '6px',
    border: '1px solid var(--figma-color-border)',
  },
  previewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: '11px',
    color: 'var(--figma-color-text-secondary)',
  },
  previewValue: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--figma-color-text)',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  primaryButton: {
    background: 'var(--figma-color-bg-brand)',
    color: 'var(--figma-color-text-onbrand)',
  },
  secondaryButton: {
    background: 'var(--figma-color-bg-secondary)',
    color: 'var(--figma-color-text)',
    border: '1px solid var(--figma-color-border)',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  errorBox: {
    padding: '12px',
    background: 'var(--figma-color-bg-danger-tertiary)',
    border: '1px solid var(--figma-color-border-danger)',
    borderRadius: '6px',
    color: 'var(--figma-color-text-danger)',
    fontSize: '11px',
  },
  successBox: {
    padding: '12px',
    background: 'var(--figma-color-bg-success-tertiary)',
    border: '1px solid var(--figma-color-border-success)',
    borderRadius: '6px',
    color: 'var(--figma-color-text-success)',
    fontSize: '11px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid var(--figma-color-border)',
    paddingBottom: '8px',
  },
  tab: {
    padding: '8px 12px',
    border: 'none',
    background: 'transparent',
    color: 'var(--figma-color-text-secondary)',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.15s ease',
  },
  activeTab: {
    background: 'var(--figma-color-bg-brand-tertiary)',
    color: 'var(--figma-color-text-brand)',
    fontWeight: 500,
  },
  scrollArea: {
    flex: 1,
    overflow: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    paddingTop: '8px',
    borderTop: '1px solid var(--figma-color-border)',
  },
  collectionChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    background: 'var(--figma-color-bg-tertiary)',
    borderRadius: '4px',
    fontSize: '10px',
    color: 'var(--figma-color-text-secondary)',
    marginRight: '4px',
    marginBottom: '4px',
  },
  componentCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'var(--figma-color-bg-secondary)',
    borderRadius: '6px',
    border: '1px solid var(--figma-color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  componentCardSelected: {
    borderColor: 'var(--figma-color-border-brand)',
    background: 'var(--figma-color-bg-brand-tertiary)',
  },
  componentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  componentName: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--figma-color-text)',
  },
  componentMeta: {
    fontSize: '10px',
    color: 'var(--figma-color-text-secondary)',
  },
  componentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkmark: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1.5px solid var(--figma-color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmarkSelected: {
    background: 'var(--figma-color-bg-brand)',
    borderColor: 'var(--figma-color-bg-brand)',
  },
};

// =============================================================================
// Component
// =============================================================================

type Tab = 'components' | 'custom' | 'export';

interface PreviewInfo {
  variantCount: number;
  variableCount: number;
  collections: string[];
}

export default function App() {
  const [tab, setTab] = useState<Tab>('components');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [designJson, setDesignJson] = useState<DesignJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileHover, setIsFileHover] = useState(false);
  const [embeddedJsons, setEmbeddedJsons] = useState<Record<string, DesignJson>>({});
  const [variableExport, setVariableExport] = useState<VariableExportData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResultData | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [tokensJson, setTokensJson] = useState('');

  // Load embedded JSONs on mount (simulated - in real plugin these would be bundled)
  useEffect(() => {
    // Request embedded JSONs from plugin
    parent.postMessage({ pluginMessage: { type: 'GET_EMBEDDED_JSONS' } }, '*');
  }, []);

  // Handle messages from plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent<{ pluginMessage: UIMessage }>) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      switch (msg.type) {
        case 'INSERT_DONE':
          setIsLoading(false);
          setSuccess(`Created component set: ${msg.name}`);
          break;

        case 'ERROR':
          setIsLoading(false);
          setError(msg.error);
          break;

        case 'PREVIEW_RESULT':
          setPreview({
            variantCount: msg.variantCount,
            variableCount: msg.variableCount,
            collections: msg.collections,
          });
          break;

        case 'VALIDATION_RESULT':
          if (!msg.valid && msg.errors) {
            setError(`Validation errors:\n${msg.errors.join('\n')}`);
          }
          break;

        case 'EMBEDDED_JSONS':
          if ((msg as any).jsons) {
            setEmbeddedJsons((msg as any).jsons);
          }
          break;

        case 'COMPONENT_JSON':
          const compMsg = msg as any;
          if (compMsg.json) {
            setEmbeddedJsons((prev) => ({ ...prev, [compMsg.componentId]: compMsg.json }));
            setDesignJson(compMsg.json);
            parent.postMessage(
              { pluginMessage: { type: 'PREVIEW', payload: compMsg.json } },
              '*'
            );
          }
          break;

        case 'VARIABLES_EXPORT':
          setIsExporting(false);
          setVariableExport((msg as any).export);
          setSuccess(`Exported ${(msg as any).export.stats.totalVariables} variables`);
          break;

        case 'COMPARISON_RESULT':
          setIsComparing(false);
          setComparisonResult((msg as any).result);
          const stats = (msg as any).result.stats;
          setSuccess(`Comparison: ${stats.matches} matches, ${stats.mismatches} mismatches`);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Parse JSON text
  const parseJson = useCallback((text: string) => {
    setError(null);
    setSuccess(null);
    setPreview(null);

    if (!text.trim()) {
      setDesignJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(text) as DesignJson;

      if (!parsed.meta?.name) {
        throw new Error('Missing meta.name');
      }
      if (!parsed.componentSet) {
        throw new Error('Missing componentSet');
      }

      setDesignJson(parsed);

      parent.postMessage(
        { pluginMessage: { type: 'PREVIEW', payload: parsed } },
        '*'
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setDesignJson(null);
    }
  }, []);

  // Handle text change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setJsonText(text);
      parseJson(text);
    },
    [parseJson]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setJsonText(text);
        parseJson(text);
      };
      reader.onerror = () => setError('Failed to read file');
      reader.readAsText(file);
    },
    [parseJson]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsFileHover(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setJsonText(text);
        parseJson(text);
      };
      reader.onerror = () => setError('Failed to read file');
      reader.readAsText(file);
    },
    [parseJson]
  );

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string) => {
    setSelectedComponent(componentId);
    setError(null);
    setSuccess(null);

    // If we have embedded JSON, use it
    if (embeddedJsons[componentId]) {
      setDesignJson(embeddedJsons[componentId]);
      parent.postMessage(
        { pluginMessage: { type: 'PREVIEW', payload: embeddedJsons[componentId] } },
        '*'
      );
    } else {
      // Request from plugin
      parent.postMessage(
        { pluginMessage: { type: 'GET_COMPONENT_JSON', componentId } },
        '*'
      );
    }
  }, [embeddedJsons]);

  // Handle insert
  const handleInsert = useCallback(() => {
    if (!designJson) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    parent.postMessage(
      { pluginMessage: { type: 'INSERT_COMPONENT_SET', payload: designJson } },
      '*'
    );
  }, [designJson]);

  // Clear all
  const handleClear = useCallback(() => {
    setJsonText('');
    setDesignJson(null);
    setSelectedComponent(null);
    setError(null);
    setSuccess(null);
    setPreview(null);
  }, []);

  // Handle export variables
  const handleExportVariables = useCallback(() => {
    setIsExporting(true);
    setError(null);
    setSuccess(null);
    setVariableExport(null);
    parent.postMessage({ pluginMessage: { type: 'EXPORT_VARIABLES' } }, '*');
  }, []);

  // Download export as JSON
  const handleDownloadExport = useCallback(() => {
    if (!variableExport) return;

    const blob = new Blob([JSON.stringify(variableExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'figma-variables.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [variableExport]);

  // Copy export to clipboard
  const handleCopyExport = useCallback(() => {
    if (!variableExport) return;

    navigator.clipboard.writeText(JSON.stringify(variableExport, null, 2));
    setSuccess('Copied to clipboard!');
  }, [variableExport]);

  // Handle compare tokens
  const handleCompareTokens = useCallback(() => {
    if (!tokensJson.trim()) {
      setError('Please paste componentTokens.json first');
      return;
    }

    try {
      const tokens = JSON.parse(tokensJson);
      setIsComparing(true);
      setError(null);
      setSuccess(null);
      setComparisonResult(null);
      parent.postMessage({ pluginMessage: { type: 'COMPARE_TOKENS', tokens } }, '*');
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
    }
  }, [tokensJson]);

  // Handle tokens file upload
  const handleTokensFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTokensJson(text);
      setComparisonResult(null);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, []);

  // Calculate variant count for a component
  const getVariantCount = (component: typeof BUTTON_COMPONENTS[0]) => {
    // states × icons × sizes × appearances
    const states = 5; // default, hover, disabled, pressed, loading
    const icons = 4; // none, left, right, only
    const sizes = 3; // sm, md, lg
    return states * icons * sizes * component.appearances.length;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Figma Designer</div>
          <div style={styles.subtitle}>Create component sets from Design JSON</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(tab === 'components' ? styles.activeTab : {}),
          }}
          onClick={() => setTab('components')}
        >
          Components
        </button>
        <button
          style={{
            ...styles.tab,
            ...(tab === 'custom' ? styles.activeTab : {}),
          }}
          onClick={() => setTab('custom')}
        >
          Custom JSON
        </button>
        <button
          style={{
            ...styles.tab,
            ...(tab === 'export' ? styles.activeTab : {}),
          }}
          onClick={() => setTab('export')}
        >
          Export
        </button>
      </div>

      {/* Content */}
      <div style={styles.scrollArea}>
        {tab === 'components' ? (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Select Component</div>
            <div style={styles.componentList}>
              {BUTTON_COMPONENTS.map((component) => (
                <div
                  key={component.id}
                  style={{
                    ...styles.componentCard,
                    ...(selectedComponent === component.id ? styles.componentCardSelected : {}),
                  }}
                  onClick={() => handleComponentSelect(component.id)}
                >
                  <div style={styles.componentInfo}>
                    <div style={styles.componentName}>{component.name}</div>
                    <div style={styles.componentMeta}>
                      {component.appearances.join(', ')} · {getVariantCount(component)} variants
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.checkmark,
                      ...(selectedComponent === component.id ? styles.checkmarkSelected : {}),
                    }}
                  >
                    {selectedComponent === component.id && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === 'custom' ? (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Paste or Upload JSON</div>
            <label
              style={{
                ...styles.fileLabel,
                ...(isFileHover ? styles.fileLabelHover : {}),
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsFileHover(true);
              }}
              onDragLeave={() => setIsFileHover(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={styles.fileInput}
              />
              <span>Drop a .design.json file here or click to browse</span>
            </label>
            <textarea
              style={styles.textarea}
              value={jsonText}
              onChange={handleTextChange}
              placeholder='Or paste your design JSON here...'
              spellCheck={false}
            />
          </div>
        ) : (
          /* Export & Compare Tab */
          <div style={styles.section}>
            {/* Compare Section */}
            <div style={styles.sectionTitle}>Compare Tokens with Figma</div>
            <p style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)', margin: '0 0 8px 0' }}>
              Paste componentTokens.json to compare with Figma variables
            </p>

            <label style={{ ...styles.fileLabel, marginBottom: '8px' }}>
              <input
                type="file"
                accept=".json"
                onChange={handleTokensFileUpload}
                style={styles.fileInput}
              />
              <span style={{ fontSize: '11px' }}>Upload componentTokens.json</span>
            </label>

            <textarea
              style={{ ...styles.textarea, minHeight: '80px', fontSize: '10px' }}
              value={tokensJson}
              onChange={(e) => {
                setTokensJson(e.target.value);
                setComparisonResult(null);
              }}
              placeholder='Or paste componentTokens.json content here...'
              spellCheck={false}
            />

            <button
              style={{
                ...styles.button,
                ...styles.primaryButton,
                width: '100%',
                marginTop: '8px',
                ...(isComparing || !tokensJson.trim() ? styles.disabledButton : {}),
              }}
              onClick={handleCompareTokens}
              disabled={isComparing || !tokensJson.trim()}
            >
              {isComparing ? 'Comparing...' : 'Compare Tokens'}
            </button>

            {/* Comparison Results */}
            {comparisonResult && (
              <div style={{ ...styles.preview, marginTop: '12px' }}>
                <div style={styles.sectionTitle}>Comparison Results</div>
                <div style={styles.previewItem}>
                  <span style={styles.previewLabel}>Total Tokens</span>
                  <span style={styles.previewValue}>{comparisonResult.stats.total}</span>
                </div>
                <div style={styles.previewItem}>
                  <span style={{ ...styles.previewLabel, color: 'var(--figma-color-text-success)' }}>Matches</span>
                  <span style={{ ...styles.previewValue, color: 'var(--figma-color-text-success)' }}>
                    {comparisonResult.stats.matches}
                  </span>
                </div>
                <div style={styles.previewItem}>
                  <span style={{ ...styles.previewLabel, color: 'var(--figma-color-text-danger)' }}>Mismatches</span>
                  <span style={{ ...styles.previewValue, color: 'var(--figma-color-text-danger)' }}>
                    {comparisonResult.stats.mismatches}
                  </span>
                </div>
                <div style={styles.previewItem}>
                  <span style={{ ...styles.previewLabel, color: 'var(--figma-color-text-warning)' }}>Only in Figma</span>
                  <span style={{ ...styles.previewValue, color: 'var(--figma-color-text-warning)' }}>
                    {comparisonResult.stats.onlyInFigma}
                  </span>
                </div>
                <div style={styles.previewItem}>
                  <span style={{ ...styles.previewLabel, color: 'var(--figma-color-text-secondary)' }}>Only in Code</span>
                  <span style={styles.previewValue}>{comparisonResult.stats.onlyInCode}</span>
                </div>

                {/* Show mismatches if any */}
                {comparisonResult.mismatches.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ ...styles.sectionTitle, color: 'var(--figma-color-text-danger)' }}>
                      Mismatches ({comparisonResult.mismatches.length})
                    </div>
                    <div style={{ maxHeight: '120px', overflow: 'auto', fontSize: '10px' }}>
                      {comparisonResult.mismatches.slice(0, 10).map((m, i) => (
                        <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--figma-color-border)' }}>
                          <div style={{ fontWeight: 500 }}>{m.path}</div>
                          <div style={{ color: 'var(--figma-color-text-secondary)' }}>
                            Code: {m.codeRef}
                          </div>
                          <div style={{ color: 'var(--figma-color-text-secondary)' }}>
                            Figma: {m.figmaRef}
                          </div>
                        </div>
                      ))}
                      {comparisonResult.mismatches.length > 10 && (
                        <div style={{ padding: '4px 0', color: 'var(--figma-color-text-secondary)' }}>
                          ... and {comparisonResult.mismatches.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export Section */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--figma-color-border)' }}>
              <div style={styles.sectionTitle}>Export Figma Variables</div>
              <p style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary)', margin: '0 0 8px 0' }}>
                Export all variables with alias relationships
              </p>

              <button
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  width: '100%',
                  ...(isExporting ? styles.disabledButton : {}),
                }}
                onClick={handleExportVariables}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export All Variables'}
              </button>

              {variableExport && (
                <div style={{ ...styles.preview, marginTop: '12px' }}>
                  <div style={styles.previewItem}>
                    <span style={styles.previewLabel}>Total Variables</span>
                    <span style={styles.previewValue}>{variableExport.stats.totalVariables}</span>
                  </div>
                  <div style={styles.previewItem}>
                    <span style={styles.previewLabel}>Alias Variables</span>
                    <span style={styles.previewValue}>{variableExport.stats.aliasVariables}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      style={{ ...styles.button, ...styles.secondaryButton, flex: 1, padding: '6px 8px', fontSize: '11px' }}
                      onClick={handleCopyExport}
                    >
                      Copy
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.primaryButton, flex: 1, padding: '6px 8px', fontSize: '11px' }}
                      onClick={handleDownloadExport}
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Success */}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* Preview */}
        {designJson && preview && (
          <div style={{ ...styles.section, marginTop: '8px' }}>
            <div style={styles.sectionTitle}>Preview</div>
            <div style={styles.preview}>
              <div style={styles.previewItem}>
                <span style={styles.previewLabel}>Component Name</span>
                <span style={styles.previewValue}>{designJson.meta.name}</span>
              </div>
              <div style={styles.previewItem}>
                <span style={styles.previewLabel}>Variants</span>
                <span style={styles.previewValue}>{preview.variantCount}</span>
              </div>
              <div style={styles.previewItem}>
                <span style={styles.previewLabel}>Variables</span>
                <span style={styles.previewValue}>{preview.variableCount}</span>
              </div>
              <div style={{ ...styles.previewItem, flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={styles.previewLabel}>Collections</span>
                <div>
                  {preview.collections.map((c) => (
                    <span key={c} style={styles.collectionChip}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.button,
            ...styles.secondaryButton,
            flex: 1,
          }}
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.primaryButton,
            flex: 2,
            ...((!designJson || isLoading) ? styles.disabledButton : {}),
          }}
          onClick={handleInsert}
          disabled={!designJson || isLoading}
        >
          {isLoading ? 'Creating...' : 'Insert Component Set'}
        </button>
      </div>
    </div>
  );
}
