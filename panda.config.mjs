import { defineConfig } from "@pandacss/dev";
import primitives from "./tokens/primitives.json";

// Helper function to extract token values from the modes structure
function extractTokenValues(obj, mode) {
  if (!obj || !obj.modes || !obj.modes[mode]) {
    return {};
  }

  const modeData = obj.modes[mode];
  const result = {};

  function traverse(current, path = []) {
    for (const key in current) {
      // Skip metadata keys
      if (key.startsWith("$")) continue;

      const value = current[key];
      const newPath = [...path, key];

      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Check if this is a token with $value
        if (value.$value !== undefined) {
          // Found a token, add to result
          let target = result;
          for (let i = 0; i < newPath.length - 1; i++) {
            if (!target[newPath[i]]) {
              target[newPath[i]] = {};
            }
            target = target[newPath[i]];
          }
          target[newPath[newPath.length - 1]] = value.$value;
        } else {
          // Continue traversing nested objects
          traverse(value, newPath);
        }
      }
    }
  }

  traverse(modeData);
  return result;
}

// Extract colors and spacing for each mode
const reservioColors = extractTokenValues(primitives.colors, "Reservio");
const survioColors = extractTokenValues(primitives.colors, "Survio");
const reservioSpacing = extractTokenValues(primitives.spacing, "Reservio");
const survioSpacing = extractTokenValues(primitives.spacing, "Survio");

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        colors: {
          reservio: reservioColors,
          survio: survioColors,
        },
        spacing: {
          reservio: reservioSpacing,
          survio: survioSpacing,
        },
      },

      // Multi-brand theming with semantic tokens
      semanticTokens: {
        colors: {
          primary: {
            value: {
              _reservio: "{colors.reservio.brand.700}",
              _survio: "{colors.survio.brand.700}",
            },
          },
        },
      },
    },
  },

  // Enable theming
  conditions: {
    extend: {
      reservio: '[data-theme="reservio"] &',
      survio: '[data-theme="survio"] &',
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
