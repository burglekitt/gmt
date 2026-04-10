# Contributing

Thanks for contributing to the Burglekitt monorepo.

This guide covers local development, quality checks, and publishing for workspace packages.

## Requirements

- Node.js 18+
- Bun (recommended package manager and script runner)

## Local setup

```bash
bun install
```

## Development workflow

Run from repo root.

### Core checks

```bash
bun run build
bun run typecheck
bun run test
bun run lint
bun run format
```

### Recommended pre-PR gate

```bash
bun run validate
```

### Nx-focused commands

```bash
# All projects
bun nx run-many -t build
bun nx run-many -t test
bun nx run-many -t lint
bun nx run-many -t typecheck

# Affected projects only
bun run affected:build
bun run affected:test
bun run affected:lint
bun run affected:typecheck
```

## Package-level development

Example for GMT package:

```bash
cd packages/gmt
bun run build
bun run test
bun run lint
```

## Publishing

Publishing is managed with Changesets and is triggered manually — nothing publishes automatically.

**See [PUBLISHING.md](./PUBLISHING.md) for the full step-by-step guide** including one-time npm org setup, how to record changesets, how to cut a release, and how git tags work in this monorepo.

Quick reference:

```bash
# Run on your feature branch before merging — commit the generated file as part of the PR
bun run changeset:add

# See what versions would be bumped today
bun run changeset status

# Apply version bumps and update changelogs
bun run changeset:version

# Publish via GitHub Actions UI (recommended)
# → Actions → Publish Package → Run workflow
```

The `release.yml` workflow opens a "Version Packages" pull request automatically when changesets land on `main`. Merging that PR is equivalent to running `changeset:version` and pushing. It does **not** publish to npm.

The `publish.yml` workflow is the actual publish step — triggered manually from the Actions UI.

### Monorepo config usage (maintainers)

When wiring local package configs inside this monorepo:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.7/schema.json",
  "extends": ["./packages/gmt-biome/biome.json"]
}
```

```js
// eslint.config.mjs
import gmtEslintConfig from "./packages/gmt-eslint/eslint/index.mjs";

export default [...gmtEslintConfig];
```

```json
// .oxlintrc.json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "jsPlugins": ["./packages/gmt-oxlint/dist/index.js"],
  "rules": {
    "gmt-oxlint/no-date-global": "error",
    "gmt-oxlint/no-new-date": "error",
    "gmt-oxlint/no-date-now": "error",
    "gmt-oxlint/no-date-parse": "error",
    "gmt-oxlint/no-date-utc": "error",
    "gmt-oxlint/no-date-getTimezoneOffset": "error"
  }
}
```

## PR checklist

- Ensure tests pass for affected projects.
- Ensure lint/typecheck pass for affected projects.
- Keep APIs string-in/string-out and Temporal-only.
- Add or update tests for behavior changes.

