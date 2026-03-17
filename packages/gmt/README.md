# @burglekitt/gmt

Temporal-based date and time utilities with timezone support and Temporal polyfill integration.

**Note:** This package is currently in **pre-alpha development**. The API is not yet stable and may change significantly.

## Installation

```bash
npm install @burglekitt/gmt
```

Or with Bun:

```bash
bun add @burglekitt/gmt
```

## Features

- 🌍 **Timezone-aware date and time operations** using the [Temporal API](https://tc39.es/proposal-temporal/)
- 🔄 **Full Temporal polyfill integration** through [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill)
- 📦 **Modular exports** for plain and zoned datetime operations
- 🎯 **TypeScript-first** with full type definitions
- ✅ **Zero-dependency** (aside from the Temporal polyfill, which is bundled)

## Usage

### Basic Example

```typescript
import { Temporal } from "@burglekitt/gmt";

// Create a date
const date = Temporal.PlainDate.from("2026-03-17");
console.log(date.toString()); // 2026-03-17

// Timezone-aware operations
const zonedDateTime = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 3,
  day: 17,
  hour: 10,
  minute: 30,
  second: 0,
  timeZone: "America/Los_Angeles",
});
console.log(zonedDateTime.toString());
```

### Submodules

**Plain DateTime** — For date and time without timezone information:

```typescript
import * as plain from "@burglekitt/gmt/plain";

const date = plain.Temporal.PlainDate.from("2026-03-17");
```

**Zoned DateTime** — For date and time with timezone support:

```typescript
import * as zoned from "@burglekitt/gmt/zoned";

const zonedDateTime = zoned.Temporal.ZonedDateTime.from({
  year: 2026,
  month: 3,
  day: 17,
  hour: 10,
  timeZone: "UTC",
});
```

## API

### Main Export

The default export (`@burglekitt/gmt`) re-exports all Temporal functionality from the polyfill.

Refer to the [Temporal documentation](https://tc39.es/proposal-temporal/docs/) for complete API reference.

### `./plain`

Subpath export for plain (non-zoned) temporal types and operations.

### `./zoned`

Subpath export for zoned temporal types and operations.

## Development

### Installation

```bash
bun install
```

### Build

```bash
bun run build
```

### Test

```bash
bun run test
```

### Lint

```bash
bun run lint
```

### Format

```bash
bun run format
```

## Requirements

- **Node.js:** >= 18.0.0
- **Bun:** (for local development) Latest recommended

## License

MIT — See [LICENSE](./LICENSE) for details.

## Contributing

This package is currently in pre-alpha. Contributions are being evaluated as the API stabilizes.

For issues and discussions, please visit [GitHub Issues](https://github.com/burglekitt/gmt/issues).

## Related

- [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill) — The underlying Temporal implementation
- [Temporal Proposal](https://tc39.es/proposal-temporal/) — TC39 proposal documentation
