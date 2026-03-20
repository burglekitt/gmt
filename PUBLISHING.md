# Publishing

Notes for maintainers on publishing the linting packages.

## Monorepo setup

### gmt-biome — within the monorepo

Extend from the local path in your `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.7/schema.json",
  "extends": ["./packages/gmt-biome/biome.json"]
}
```

### gmt-eslint — within the monorepo

```typescript
// eslint.config.mjs
import gmtEslintConfig from "./packages/gmt-eslint/eslint/index.mjs";

export default [...gmtEslintConfig];

```


## Publishing to npm

Run from the package directory (gmt-biome or gmt-eslint):

```bash
# Dry run first
bun run publish:dry-run

# Publish
bun run publish:public

```