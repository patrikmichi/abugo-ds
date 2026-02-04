---
name: tech-stack
description: Technology stack conventions. React, Next.js, TypeScript, Storybook, Vite. Always use latest stable versions.
user-invocable: false
---

# Technology Stack

## Always Use Latest Versions

**Default behavior**: Always use the newest stable versions of all technologies unless explicitly told otherwise.

### Core Stack

- **Next.js**: Always use the latest stable version
- **React**: Always use the latest stable version
- **React DOM**: Always use the latest stable version
- **TypeScript**: Always use the latest stable version

### Storybook

- **Storybook**: Always use the latest stable version
- **Framework**: Use `@storybook/react-vite` for React projects (can coexist with Next.js)
- **Addons**: Use latest available versions
- **Note**: Storybook and Next.js can coexist - Storybook is for component development, Next.js is for the app

### Build Tools

- **Vite**: Always use the latest stable version (when used)
- **ESLint**: Always use the latest stable version
- **Prettier**: Always use the latest stable version

### When to Use Specific Versions

Only use a specific version when:
1. User explicitly requests a version
2. There's a compatibility issue that requires a specific version
3. A dependency requires a specific version range

### Version Checking

Before installing or updating packages:
1. Check latest versions: `npm view <package> version`
2. Update to latest: `npm install <package>@latest`
3. Ensure all related packages are on compatible versions

### Package Version Alignment

When updating a framework or major package:
- Update all related packages to the same major version
- Use `npm list` to check for version mismatches
- Run `npx storybook doctor` if using Storybook to check health
