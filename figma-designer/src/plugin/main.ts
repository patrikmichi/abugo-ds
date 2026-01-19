/**
 * Figma Designer Plugin - Main Entry Point
 *
 * This plugin creates Figma component sets from Design JSON files,
 * mapping React components and CSS tokens to Figma components and variables.
 */

import type { DesignJson, PluginMessage, UIMessage } from '../schemas/design-json';
import { resolveVariables, type ResolvedVariables } from './resolveVariables';
import { insertComponentSet } from './insertFromJson';
import { EMBEDDED_BUTTON_JSONS } from './embeddedData';
import { exportVariables, exportComponentVariables } from './exportVariables';
import { compareTokensWithFigma } from './compareTokens';

// =============================================================================
// Plugin Configuration
// =============================================================================

const UI_WIDTH = 480;
const UI_HEIGHT = 600;

// =============================================================================
// Initialize Plugin
// =============================================================================

// Show UI
figma.showUI(__html__, {
  width: UI_WIDTH,
  height: UI_HEIGHT,
  title: 'Figma Designer',
  themeColors: true,
});

// Handle relaunch
figma.on('run', ({ command }) => {
  if (command === 'open') {
    figma.showUI(__html__, {
      width: UI_WIDTH,
      height: UI_HEIGHT,
      title: 'Figma Designer',
      themeColors: true,
    });
  }
});

// =============================================================================
// Message Handlers
// =============================================================================

/**
 * Send message to UI
 */
function sendToUI(message: UIMessage): void {
  figma.ui.postMessage(message);
}

/**
 * Handle INSERT_COMPONENT_SET message
 */
async function handleInsertComponentSet(design: DesignJson): Promise<void> {
  try {
    // Log start
    console.log(`Creating component set: ${design.meta.name}`);

    // Resolve variables (use existing or create new)
    const resolvedVars = await resolveVariables(design);
    console.log(`Resolved ${resolvedVars.size} variables`);

    // Insert the component set
    const componentSet = await insertComponentSet(design, resolvedVars);

    // Select and zoom to the new component set
    figma.currentPage.selection = [componentSet];
    figma.viewport.scrollAndZoomIntoView([componentSet]);

    // Send success message
    sendToUI({
      type: 'INSERT_DONE',
      nodeId: componentSet.id,
      name: componentSet.name,
    });

    // Notify user
    figma.notify(`Created component set: ${componentSet.name}`, { timeout: 3000 });
  } catch (error) {
    console.error('Error inserting component set:', error);
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
    figma.notify('Error creating component set', { error: true });
  }
}

/**
 * Handle PREVIEW message
 */
function handlePreview(design: DesignJson): void {
  try {
    const variantCount = design.componentSet.variants.length;

    let variableCount = 0;
    const collections: string[] = [];
    for (const [name, collection] of Object.entries(design.variables)) {
      collections.push(name);
      variableCount += collection.variables.length;
    }

    sendToUI({
      type: 'PREVIEW_RESULT',
      variantCount,
      variableCount,
      collections,
    });
  } catch (error) {
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Handle GET_EXISTING_VARIABLES message
 */
async function handleGetExistingVariables(): Promise<void> {
  try {
    const variables: string[] = [];
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVariables = await figma.variables.getLocalVariablesAsync();

    for (const collection of collections) {
      const collectionVars = allVariables.filter(
        (v) => v.variableCollectionId === collection.id
      );

      for (const variable of collectionVars) {
        variables.push(variable.name);
      }
    }

    sendToUI({
      type: 'EXISTING_VARIABLES',
      variables,
    });
  } catch (error) {
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Handle EXPORT_VARIABLES message
 */
async function handleExportVariables(): Promise<void> {
  try {
    const variableExport = await exportVariables();
    console.log(`Exported ${variableExport.stats.totalVariables} variables from ${variableExport.stats.collectionCount} collections`);

    sendToUI({
      type: 'VARIABLES_EXPORT',
      export: variableExport,
    });

    figma.notify(`Exported ${variableExport.stats.totalVariables} variables`, { timeout: 3000 });
  } catch (error) {
    console.error('Error exporting variables:', error);
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Handle EXPORT_COMPONENT_VARIABLES message
 */
async function handleExportComponentVariables(): Promise<void> {
  try {
    const variableExport = await exportComponentVariables();
    console.log(`Exported ${variableExport.stats.totalVariables} component variables`);

    sendToUI({
      type: 'VARIABLES_EXPORT',
      export: variableExport,
    });

    figma.notify(`Exported ${variableExport.stats.totalVariables} component variables`, { timeout: 3000 });
  } catch (error) {
    console.error('Error exporting component variables:', error);
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Handle COMPARE_TOKENS message
 */
async function handleCompareTokens(tokens: Record<string, any>): Promise<void> {
  try {
    console.log('Starting token comparison...');
    const result = await compareTokensWithFigma(tokens);
    console.log(`Comparison complete: ${result.stats.matches} matches, ${result.stats.mismatches} mismatches`);

    sendToUI({
      type: 'COMPARISON_RESULT',
      result: {
        matches: result.matches,
        mismatches: result.mismatches,
        onlyInFigma: result.onlyInFigma,
        onlyInCode: result.onlyInCode,
        stats: result.stats,
      },
    });

    figma.notify(
      `Comparison: ${result.stats.matches} matches, ${result.stats.mismatches} mismatches`,
      { timeout: 3000 }
    );
  } catch (error) {
    console.error('Error comparing tokens:', error);
    sendToUI({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Handle VALIDATE_JSON message
 */
function handleValidateJson(design: DesignJson): void {
  const errors: string[] = [];

  // Validate meta
  if (!design.meta?.name) {
    errors.push('Missing meta.name');
  }

  // Validate component set
  if (!design.componentSet) {
    errors.push('Missing componentSet');
  } else {
    if (!design.componentSet.name) {
      errors.push('Missing componentSet.name');
    }
    if (!design.componentSet.variantProperties?.length) {
      errors.push('Missing or empty componentSet.variantProperties');
    }
    if (!design.componentSet.variants?.length) {
      errors.push('Missing or empty componentSet.variants');
    }
  }

  // Validate layout
  if (!design.layout) {
    errors.push('Missing layout');
  } else {
    if (!design.layout.mode) {
      errors.push('Missing layout.mode');
    }
    if (!design.layout.children?.length) {
      errors.push('Missing or empty layout.children');
    }
  }

  sendToUI({
    type: 'VALIDATION_RESULT',
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// =============================================================================
// Message Router
// =============================================================================

figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'INSERT_COMPONENT_SET':
      await handleInsertComponentSet(msg.payload);
      break;

    case 'PREVIEW':
      handlePreview(msg.payload);
      break;

    case 'GET_EXISTING_VARIABLES':
      await handleGetExistingVariables();
      break;

    case 'VALIDATE_JSON':
      handleValidateJson(msg.payload);
      break;

    case 'GET_EMBEDDED_JSONS':
      sendToUI({
        type: 'EMBEDDED_JSONS',
        jsons: EMBEDDED_BUTTON_JSONS,
      });
      break;

    case 'GET_COMPONENT_JSON':
      const componentJson = EMBEDDED_BUTTON_JSONS[msg.componentId];
      if (componentJson) {
        sendToUI({
          type: 'COMPONENT_JSON',
          componentId: msg.componentId,
          json: componentJson,
        });
      } else {
        sendToUI({
          type: 'ERROR',
          error: `Component not found: ${msg.componentId}`,
        });
      }
      break;

    case 'EXPORT_VARIABLES':
      await handleExportVariables();
      break;

    case 'EXPORT_COMPONENT_VARIABLES':
      await handleExportComponentVariables();
      break;

    case 'COMPARE_TOKENS':
      await handleCompareTokens(msg.tokens);
      break;

    default:
      console.warn('Unknown message type:', (msg as any).type);
  }
};

// =============================================================================
// Cleanup
// =============================================================================

figma.on('close', () => {
  // Cleanup if needed
});
