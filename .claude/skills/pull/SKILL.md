---
name: pull
description: Pull latest changes from the remote repository
user-invocable: true
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Pull from Remote

1. Check branch: `git rev-parse --abbrev-ref HEAD`.
2. Pull: `git pull`.
3. If dependencies changed, run `pnpm install`.
