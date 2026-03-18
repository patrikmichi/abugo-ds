const fs = require('fs');
const path = require('path');

const semanticDir = path.join(__dirname, '..', 'tokens', 'semanticTokens');

// Description templates based on token patterns
const descriptionTemplates = {
  background: {
    passive: {
      neutral: {
        default: "Default neutral background for passive UI elements. Use for cards, containers, and surfaces that don't require user interaction. Provides subtle visual separation without drawing attention.",
        subtle: "Subtle neutral background for passive elements. Lighter than default, use for nested containers or areas that need minimal visual weight.",
        elevated: "Elevated neutral background for passive elements. Use for surfaces that appear above the base layer, such as modals, dropdowns, or floating panels.",
        strong: "Strong neutral background for passive elements. Use for high-contrast backgrounds or emphasis areas that need to stand out."
      },
      danger: {
        default: "Default danger background for passive elements. Use for error states, destructive actions, or critical information that requires attention.",
        subtle: "Subtle danger background for passive elements. Use for error message backgrounds or warning areas that need less emphasis."
      },
      success: {
        default: "Default success background for passive elements. Use for success states, confirmation messages, or positive feedback indicators.",
        subtle: "Subtle success background for passive elements. Use for success message backgrounds or positive indicators that need less emphasis."
      },
      warning: {
        default: "Default warning background for passive elements. Use for warning states, caution messages, or attention-requiring information.",
        subtle: "Subtle warning background for passive elements. Use for warning message backgrounds or caution indicators that need less emphasis."
      },
      info: {
        default: "Default info background for passive elements. Use for informational states, help messages, or neutral information displays.",
        subtle: "Subtle info background for passive elements. Use for info message backgrounds or informational indicators that need less emphasis."
      },
      upgrade: {
        default: "Default upgrade background for passive elements. Use for premium features, upgrade prompts, or special content areas.",
        subtle: "Subtle upgrade background for passive elements. Use for upgrade message backgrounds or premium indicators that need less emphasis.",
        strong: "Strong upgrade background for passive elements. Use for prominent upgrade calls-to-action or premium feature highlights."
      }
    },
    active: {
      neutral: {
        default: "Default neutral background for interactive elements. Use for buttons, links, or clickable areas in their default state.",
        hover: "Hover state background for interactive neutral elements. Use when user hovers over buttons, links, or clickable areas.",
        pressed: "Pressed state background for interactive neutral elements. Use when user clicks or presses buttons or interactive elements.",
        disabled: "Disabled state background for interactive neutral elements. Use for buttons or controls that are currently disabled or unavailable.",
        selected: "Selected state background for interactive neutral elements. Use for selected items, active tabs, or chosen options."
      },
      accent: {
        default: "Default accent background for primary interactive elements. Use for primary buttons, main CTAs, or key interactive elements.",
        subtle: "Subtle accent background for secondary interactive elements. Use for secondary buttons or less prominent interactive areas.",
        hover: "Hover state background for accent interactive elements. Use when user hovers over primary buttons or accent-colored interactive elements.",
        selected: "Selected state background for accent interactive elements. Use for selected primary options or active accent-colored elements.",
        pressed: "Pressed state background for accent interactive elements. Use when user clicks primary buttons or accent-colored interactive elements.",
        disabled: "Disabled state background for accent interactive elements. Use for disabled primary buttons or accent-colored controls.",
        'inverse-default': "Inverse accent background for interactive elements on dark surfaces. Use for primary buttons on dark backgrounds.",
        'inverse-subtle': "Subtle inverse accent background for secondary interactive elements on dark surfaces.",
        'inverse-hover': "Hover state for inverse accent interactive elements on dark surfaces.",
        'inverse-pressed': "Pressed state for inverse accent interactive elements on dark surfaces.",
        'inverse-disabled': "Disabled state for inverse accent interactive elements on dark surfaces."
      },
      danger: {
        default: "Default danger background for interactive elements. Use for destructive buttons, delete actions, or critical interactive elements.",
        subtle: "Subtle danger background for secondary destructive actions.",
        hover: "Hover state background for danger interactive elements. Use when user hovers over destructive buttons or danger-colored interactive elements.",
        pressed: "Pressed state background for danger interactive elements. Use when user clicks destructive buttons or danger-colored interactive elements."
      },
      success: {
        default: "Default success background for interactive elements. Use for success buttons, confirm actions, or positive interactive elements.",
        hover: "Hover state background for success interactive elements.",
        pressed: "Pressed state background for success interactive elements.",
        disabled: "Disabled state background for success interactive elements."
      },
      warning: {
        default: "Default warning background for interactive elements. Use for warning buttons or caution-requiring interactive elements.",
        hover: "Hover state background for warning interactive elements.",
        pressed: "Pressed state background for warning interactive elements."
      },
      upgrade: {
        default: "Default upgrade background for interactive elements. Use for upgrade buttons, premium CTAs, or special interactive elements."
      }
    }
  },
  content: {
    passive: {
      neutral: {
        default: "Default neutral text color for passive content. Use for primary body text, headings, and main content areas.",
        subtle: "Subtle neutral text color for secondary content. Use for secondary text, captions, or less important information.",
        muted: "Muted neutral text color for tertiary content. Use for placeholder text, hints, or very low-emphasis content.",
        strong: "Strong neutral text color for emphasis. Use for headings, labels, or content that needs high contrast."
      },
      'on-neutral': {
        strong: "Strong text color for content on neutral backgrounds. Use for text that appears on neutral-colored surfaces.",
        default: "Default text color for content on neutral backgrounds.",
        subtle: "Subtle text color for content on neutral backgrounds."
      },
      'on-accent': {
        default: "Default text color for content on accent backgrounds. Use for text on primary buttons or accent-colored surfaces.",
        subtle: "Subtle text color for content on accent backgrounds."
      },
      'on-danger': {
        default: "Default text color for content on danger backgrounds. Use for text on error messages or danger-colored surfaces.",
        subtle: "Subtle text color for content on danger backgrounds."
      },
      'on-success': {
        default: "Default text color for content on success backgrounds. Use for text on success messages or success-colored surfaces.",
        subtle: "Subtle text color for content on success backgrounds."
      },
      'on-warning': {
        default: "Default text color for content on warning backgrounds. Use for text on warning messages or warning-colored surfaces.",
        subtle: "Subtle text color for content on warning backgrounds."
      },
      'on-upgrade': {
        default: "Default text color for content on upgrade backgrounds. Use for text on upgrade prompts or premium-colored surfaces.",
        subtle: "Subtle text color for content on upgrade backgrounds."
      }
    },
    active: {
      neutral: {
        default: "Default neutral text color for interactive content. Use for links, clickable text, or interactive content in default state.",
        hover: "Hover state text color for interactive neutral content.",
        pressed: "Pressed state text color for interactive neutral content.",
        disabled: "Disabled state text color for interactive neutral content."
      },
      accent: {
        default: "Default accent text color for primary interactive content. Use for primary links or accent-colored interactive text.",
        hover: "Hover state text color for accent interactive content.",
        pressed: "Pressed state text color for accent interactive content.",
        disabled: "Disabled state text color for accent interactive content."
      },
      danger: {
        default: "Default danger text color for destructive interactive content. Use for delete links or danger-colored interactive text.",
        hover: "Hover state text color for danger interactive content.",
        pressed: "Pressed state text color for danger interactive content."
      },
      success: {
        default: "Default success text color for positive interactive content. Use for success links or success-colored interactive text.",
        hover: "Hover state text color for success interactive content.",
        pressed: "Pressed state text color for success interactive content."
      },
      warning: {
        default: "Default warning text color for caution-requiring interactive content. Use for warning links or warning-colored interactive text.",
        hover: "Hover state text color for warning interactive content.",
        pressed: "Pressed state text color for warning interactive content."
      }
    }
  }
};

// Parse token key to extract parts
function parseTokenKey(key) {
  const parts = key.split('-');
  if (parts.length < 3) return null;
  
  const property = parts[0]; // background, content, border
  const participation = parts[1]; // passive, active
  const intent = parts[2]; // neutral, accent, danger, etc.
  const state = parts.slice(3).join('-'); // default, hover, pressed, etc.
  
  return { property, participation, intent, state };
}

// Get description from template
function getDescription(key, value) {
  const parsed = parseTokenKey(key);
  if (!parsed) return null;
  
  const { property, participation, intent, state } = parsed;
  
  try {
    if (descriptionTemplates[property] && 
        descriptionTemplates[property][participation] && 
        descriptionTemplates[property][participation][intent] &&
        descriptionTemplates[property][participation][intent][state]) {
      return descriptionTemplates[property][participation][intent][state];
    }
  } catch (e) {
    // Fall through to generic description
  }
  
  // Generic fallback
  return `${participation.charAt(0).toUpperCase() + participation.slice(1)} token for ${intent} intent${state ? ` in ${state} state` : ''}.`;
}

// Add metadata extensions
function addMetadataExtensions(key, value) {
  const parsed = parseTokenKey(key);
  if (!parsed) return {};
  
  const { property, participation, intent, state } = parsed;
  
  return {
    "design-tokens": {
      category: property,
      participation: participation,
      intent: intent,
      state: state || "default",
      usage: getUsageExamples(property, participation, intent, state),
      deprecated: false,
      replacedBy: null
    }
  };
}

// Get usage examples based on token type
function getUsageExamples(property, participation, intent, state) {
  const examples = [];
  
  if (property === 'background') {
    if (participation === 'passive') {
      examples.push('cards', 'containers', 'surfaces');
    } else {
      examples.push('buttons', 'links', 'interactive-elements');
    }
  } else if (property === 'content') {
    examples.push('text', 'headings', 'labels');
  } else if (property === 'border') {
    examples.push('borders', 'dividers', 'outlines');
  }
  
  if (intent === 'danger') examples.push('error-states', 'destructive-actions');
  if (intent === 'success') examples.push('success-states', 'confirmations');
  if (intent === 'warning') examples.push('warnings', 'cautions');
  if (intent === 'accent') examples.push('primary-actions', 'ctas');
  
  return examples;
}

// Process a semantic token file
function enhanceFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;
  
  for (const [key, value] of Object.entries(content)) {
    if (key.startsWith('$') || !value || typeof value !== 'object') continue;
    
    if (value.$type && value.$value) {
      // Improve description
      const newDescription = getDescription(key, value);
      if (newDescription && value.$description !== newDescription) {
        value.$description = newDescription;
        modified = true;
      }
      
      // Add metadata extensions
      if (!value.$extensions) {
        value.$extensions = addMetadataExtensions(key, value);
        modified = true;
      } else if (!value.$extensions['design-tokens']) {
        value.$extensions['design-tokens'] = addMetadataExtensions(key, value)['design-tokens'];
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`  ✅ Enhanced ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Enhancing semantic tokens with improved descriptions and metadata...\n');

const files = fs.readdirSync(semanticDir)
  .filter(f => f.endsWith('.json'))
  .map(f => path.join(semanticDir, f));

let enhancedCount = 0;
files.forEach(file => {
  if (enhanceFile(file)) {
    enhancedCount++;
  }
});

console.log(`\n✅ Enhanced ${enhancedCount} semantic token files!`);
