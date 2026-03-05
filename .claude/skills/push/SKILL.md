---
name: push
description: Push commits to the remote repository
user-invocable: true
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Push to Remote

1. Check branch: `git rev-parse --abbrev-ref HEAD`.
2. Push: `git push`.
3. If new branch: `git push -u origin <branch>`.
