---
name: claude-docs
description: Search and reference Claude Code documentation. Use when answering questions about Claude Code features, configuration, skills, hooks, permissions, sub-agents, plugins, memory, CLAUDE.md, MCP servers, IDE integrations, or any Claude Code CLI functionality.
user-invocable: true
allowed-tools: WebFetch, WebSearch
---

# Claude Code Documentation Reference

When the user asks about Claude Code features or configuration, search the official documentation to provide accurate, up-to-date answers.

## Documentation sources

- Main docs index: https://code.claude.com/docs/llms.txt
- Use WebFetch on https://code.claude.com/docs/llms.txt to discover all available pages
- Then fetch the specific page relevant to the user's question

## Key documentation pages

- Skills: https://code.claude.com/docs/en/skills
- Sub-agents: https://code.claude.com/docs/en/sub-agents
- Hooks: https://code.claude.com/docs/en/hooks
- Memory (CLAUDE.md): https://code.claude.com/docs/en/memory
- Permissions: https://code.claude.com/docs/en/permissions
- Plugins: https://code.claude.com/docs/en/plugins
- Interactive mode: https://code.claude.com/docs/en/interactive-mode
- MCP servers: https://code.claude.com/docs/en/mcp-servers
- IDE integrations: https://code.claude.com/docs/en/ide-integrations
- Settings: https://code.claude.com/docs/en/settings
- Common workflows: https://code.claude.com/docs/en/common-workflows

## Instructions

1. First check if the answer is in the key pages listed above
2. If not, fetch the docs index (llms.txt) to find the right page
3. Fetch the relevant page and extract the answer
4. Provide a concise, accurate answer with references to the documentation
