# @burglekitt/gmt-eslint

Shared [ESLint](https://eslint.org/) flat configuration for `@burglekitt/gmt` projects. Enforces the Temporal-only policy by banning all `Date` APIs.

## Banned patterns

| Pattern | Rule |
|---|---|
| `new Date(...)` | `no-restricted-syntax` |
| `Date.now()` | `no-restricted-globals` + `no-restricted-properties` |
| `Date` (global reference) | `no-restricted-globals` |

## Usage

### Within the monorepo

```js
// eslint.config.mjs
import gmtEslintConfig from "./packages/gmt-eslint/eslint/index.mjs";

export default [...gmtEslintConfig];
```

### After publishing

```sh
npm install --save-dev @burglekitt/gmt-eslint eslint @typescript-eslint/parser
```

```js
// eslint.config.mjs
import gmtEslintConfig from "@burglekitt/gmt-eslint";

export default [...gmtEslintConfig];
```

## Publishing

```sh
# Dry run
bun run publish:dry-run

# Publish to npm
bun run publish:public
```
