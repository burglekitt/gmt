# @burglekitt/gmt-biome

Shared [Biome](https://biomejs.dev/) configuration for `@burglekitt/gmt` projects. Enforces the Temporal-only policy by banning all `Date` APIs via Grit plugins.

## Banned patterns

| Pattern | Message |
|---|---|
| `new Date(...)` | Use Temporal instead |
| `Date.now()` | Use Temporal instead |
| `Date.parse(...)` | Use Temporal instead |
| `Date.UTC(...)` | Use Temporal instead |

## Usage

### Within the monorepo

Extend from the local path in your `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.7/schema.json",
  "extends": ["./packages/gmt-biome/biome.json"]
}
```

### After publishing

```sh
npm install --save-dev @burglekitt/gmt-biome @biomejs/biome
```

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.7/schema.json",
  "extends": ["@burglekitt/gmt-biome"]
}
```

## Publishing

```sh
# Dry run
bun run publish:dry-run

# Publish to npm
bun run publish:public
```
