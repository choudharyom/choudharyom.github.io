# Troubleshooting Guide

## Common Dependency Errors

### MDX Version Conflict
```bash
npm error Found: @mdx-js/react@3.1.0
npm error Could not resolve dependency:
npm error peer @mdx-js/react@"^2.0.0" from gatsby-plugin-mdx@5.14.0
```

**Solution:**
1. Use exact version in package.json:
```json
"@mdx-js/react": "2.3.0"
```
2. Clear dependencies and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### NPX Command Failures
```bash
npm error could not determine executable to run
```

**Solution:**
1. Install dependencies first:
```bash
npm install -D tailwindcss postcss autoprefixer
```
2. Then run npx commands:
```bash
npx tailwindcss init -p
```

## Quick Fixes

- Always use `--legacy-peer-deps` if you're in a hurry:
```bash
npm install --legacy-peer-deps
```
- For development only, you can use `--force`:
```bash
npm install --force
```

**Note:** Using `--force` or `--legacy-peer-deps` is not recommended for production builds.
