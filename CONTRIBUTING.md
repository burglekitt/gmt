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

Publishing is managed with Changesets and is package-scoped by default.

### Changesets commands

Run from repo root:

```bash
bun run changeset:add
bun run changeset:version
bun run changeset:publish
```

- `changeset:add`: records release intent for one or more packages.
- `changeset:version`: consumes pending changesets and updates package versions/changelogs.
- `changeset:publish`: publishes only packages with unpublished version numbers.

Changesets creates monorepo git tags in the format `@scope/name@x.y.z`.

### Package publish scripts

For publishable packages (for example, `packages/gmt-biome`, `packages/gmt-eslint`, and `packages/gmt-oxlint`):

```bash
# from the package directory
bun run publish:dry-run
bun run publish:public
```

These scripts run `npm publish --access public` under the hood.

### CI release automation

On pushes to `main`, [.github/workflows/release.yml](.github/workflows/release.yml) uses `changesets/action` to:

1. Create/update a release PR with version and changelog updates.
2. Publish on merge using `NPM_TOKEN`.

The manual publish workflow remains in [.github/workflows/publish.yml](.github/workflows/publish.yml) as a fallback path.

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

