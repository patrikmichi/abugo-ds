#!/bin/bash

# Setup git hooks for token validation

if [ ! -d ".husky" ]; then
  echo "Installing husky..."
  npm install --save-dev husky
  npx husky install
fi

# Make pre-commit hook executable
chmod +x .husky/pre-commit

echo "✅ Git hooks configured!"
echo "   Token validation will run automatically on commit"
