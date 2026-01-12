import { defineConfig } from "@pandacss/dev";
import primitives from "./tokens/primitives.json";
import semanticTokens from "./tokens/semanticTokens.json";

/**
 * Extract token values from flattened structure
 */
function extractTokens(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith("$")) continue;

    if (value && typeof value === "object") {
      // If it's a token with $value
      if (value.$value !== undefined) {
        // Handle color families (yellow.100, grey.000, etc.)
        if (key.includes(".")) {
          const [family, scale] = key.split(".");
          if (!result[family]) result[family] = {};
          result[family][scale] = value.$value;
        } else {
          result[key] = value.$value;
        }
      } else {
        // Nested object - recurse
        const nested = extractTokens(value);
        if (Object.keys(nested).length > 0) {
          result[key] = nested;
        }
      }
    }
  }

  return result;
}

/**
 * Extract colors from primitives
 */
function extractColors(primitives) {
  const colors = {};

  // Extract color families (yellow, grey, brand, etc.)
  const colorFamilies = [
    "yellow",
    "grey",
    "brand",
    "upgrade",
    "negative",
    "success",
    "warning",
    "aqua",
    "purple",
    "brown",
  ];

  for (const family of colorFamilies) {
    if (primitives[family]) {
      colors[family] = {};
      for (const [scale, scaleValue] of Object.entries(primitives[family])) {
        if (scaleValue && scaleValue.$value) {
          colors[family][scale] = { value: scaleValue.$value };
        }
      }
    }
  }

  // Extract feature colors
  if (primitives.passes) {
    colors.passes = {};
    for (const [key, value] of Object.entries(primitives.passes)) {
      if (value && typeof value === "object") {
        // Replace spaces with hyphens for valid token keys
        const sanitizedKey = key.replace(/\s+/g, "-");
        colors.passes[sanitizedKey] = {};
        for (const [subKey, subValue] of Object.entries(value)) {
          if (subValue && subValue.$value) {
            colors.passes[sanitizedKey][subKey] = { value: subValue.$value };
          }
        }
      }
    }
  }
  if (primitives["ai-features"]) {
    colors["ai-features"] = {};
    for (const [key, value] of Object.entries(primitives["ai-features"])) {
      if (value && value.$value) {
        colors["ai-features"][key] = { value: value.$value };
      }
    }
  }

  // Extract universal colors
  if (primitives.universal) {
    colors.universal = {};
    for (const [key, value] of Object.entries(primitives.universal)) {
      if (value && value.$value) {
        colors.universal[key] = { value: value.$value };
      }
    }
  }

  return colors;
}

/**
 * Extract spacing from primitives
 */
function extractSpacing(primitives) {
  const spacing = {};

  for (const [key, value] of Object.entries(primitives)) {
    if (key.startsWith("$")) continue;
    if (key.startsWith("spacing-") && value && value.$type === "spacing") {
      const scale = key.replace("spacing-", "");
      spacing[scale] = { value: `${value.$value}px` };
    }
  }

  return spacing;
}

/**
 * Extract border radius from primitives
 */
function extractRadii(primitives) {
  const radii = {};

  for (const [key, value] of Object.entries(primitives)) {
    if (key.startsWith("$")) continue;
    if (key.startsWith("radius-") && value && value.$type === "borderRadius") {
      const scale = key.replace("radius-", "");
      radii[scale] = { value: `${value.$value}px` };
    }
  }

  return radii;
}

/**
 * Extract shadows from primitives
 */
function extractShadows(primitives) {
  const shadows = {};

  for (const [key, value] of Object.entries(primitives)) {
    if (key.startsWith("$")) continue;
    if (key.startsWith("shadow-") && value && value.$type === "boxShadow") {
      const scale = key.replace("shadow-", "");
      shadows[scale] = { value: value.$value };
    }
  }

  return shadows;
}

/**
 * Extract typography from primitives
 */
function extractTypography(primitives) {
  const fontSizes = {};
  const lineHeights = {};
  const fontWeights = {};
  const fonts = {};

  for (const [key, value] of Object.entries(primitives)) {
    if (key.startsWith("$")) continue;

    if (key.startsWith("typography-fontSize-") && value && value.$type === "fontSizes") {
      const scale = key.replace("typography-fontSize-", "");
      fontSizes[scale] = { value: value.$value };
    } else if (
      key.startsWith("typography-lineHeight-") &&
      value &&
      value.$type === "lineHeights"
    ) {
      const scale = key.replace("typography-lineHeight-", "");
      lineHeights[scale] = { value: value.$value };
    } else if (
      key.startsWith("typography-fontWeight-") &&
      value &&
      value.$type === "number"
    ) {
      const scale = key.replace("typography-fontWeight-", "");
      fontWeights[scale] = { value: value.$value };
    } else if (
      key.startsWith("typography-fontFamily-") &&
      value &&
      value.$type === "fontFamilies"
    ) {
      const scale = key.replace("typography-fontFamily-", "");
      fonts[scale] = { value: value.$value };
    }
  }

  return { fontSizes, lineHeights, fontWeights, fonts };
}

/**
 * Resolve token references (e.g., {grey.700} -> actual color value)
 */
function resolveTokenReference(ref, primitives) {
  if (!ref || typeof ref !== "string" || !ref.startsWith("{") || !ref.endsWith("}")) {
    return ref;
  }

  const path = ref.slice(1, -1).split(".");
  let value = primitives;

  for (const segment of path) {
    if (value && typeof value === "object" && value[segment]) {
      value = value[segment];
    } else {
      return ref; // Return original if not found
    }
  }

  return value && value.$value ? value.$value : ref;
}

/**
 * Extract semantic tokens for use in Panda CSS
 */
function extractSemanticTokens(semantic, primitives) {
  const semanticColors = {};

  for (const [key, value] of Object.entries(semantic)) {
    if (key.startsWith("$")) continue;

    if (value && typeof value === "object" && value.$type) {
      // Content and background colors
      if (key.startsWith("content-") || key.startsWith("background-")) {
        const resolvedValue = resolveTokenReference(value.$value, primitives);
        semanticColors[key] = { value: resolvedValue };
      }
      // Border colors (nested structure)
      else if (key === "border" && typeof value === "object") {
        // Handle nested border structure
        function extractBorderColors(obj, path = []) {
          for (const [k, v] of Object.entries(obj)) {
            if (k.startsWith("$")) continue;
            if (v && typeof v === "object" && v.$type === "color") {
              const fullPath = [...path, k].join(".");
              const resolvedValue = resolveTokenReference(v.$value, primitives);
              semanticColors[`border.${fullPath}`] = { value: resolvedValue };
            } else if (v && typeof v === "object") {
              extractBorderColors(v, [...path, k]);
            }
          }
        }
        extractBorderColors(value);
      }
    }
  }

  return { semanticColors };
}

// Extract tokens
const colors = extractColors(primitives);
const spacing = extractSpacing(primitives);
const radii = extractRadii(primitives);
const shadows = extractShadows(primitives);
const { fontSizes, lineHeights, fontWeights, fonts } = extractTypography(primitives);
const { semanticColors } = extractSemanticTokens(semanticTokens, primitives);

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./stories/**/*.{js,jsx,ts,tsx}"],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        colors,
        spacing,
        radii,
        shadows,
        fontSizes,
        lineHeights,
        fontWeights,
        fonts,
      },
      semanticTokens: {
        colors: semanticColors,
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
