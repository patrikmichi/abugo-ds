---
name: push-to-figma
description: Push tokens or component to Figma plugin via bridge
disable-model-invocation: true
argument-hint: [ComponentName]
---

Push data to the Figma plugin. Ensure the bridge server is running (`npm run bridge` in figma-designer-plugin/).

**Push tokens:**
```bash
cd figma-designer-plugin && npm run push:tokens
```
This pushes `tokens/output/*.json` to the Figma plugin for comparison and variable pairing.

**Push a component (if $ARGUMENTS is provided):**
```bash
cd figma-designer-plugin && npm run push:component -- ../components/{ComponentName}
```
This parses the component and pushes its design.json to the Figma plugin for preview and variable pairing.

The Figma plugin polls the bridge at `http://localhost:3939` and will receive the pushed data automatically.
