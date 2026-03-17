# Burglekitt Monorepo

Home of [@burglekitt/gmt](./packages/gmt) — **Give Me Temporal!**

A monorepo for Burglekitt community libraries, built with Nx, powered by Bun, and dead serious about making JavaScript date handling not terrible.

---

## Packages

### [@burglekitt/gmt](./packages/gmt)

The date and time library JavaScript deserved from the start. String in, string out, no `Date` objects, DST handled correctly by default.

```bash
npm install @burglekitt/gmt
```

See [packages/gmt/README.md](./packages/gmt/README.md) for the full API reference and TODO roadmap.

---

## Quick Start

```bash
# Install all workspace dependencies
bun install

# Run tests across all packages
bun nx run-many -t test

# Build all packages
bun nx run-many -t build

# Lint and format
bun run lint
bun run format
```

---

## Project Structure

```
.
├── packages/
│   └── gmt/                    # @burglekitt/gmt — Give Me Temporal!
│       ├── src/
│       │   ├── plain/          # Timezone-free operations
│       │   │   ├── compare/    # isAfterDate, isBeforeDate, areDatesEqual, ...
│       │   │   ├── format/     # formatDate, formatTime, formatDateTime
│       │   │   ├── map/        # mapDaysInMonth, mapDatesInRange, ...
│       │   │   ├── math/       # addDate, subtractDate, addTime, ...
│       │   │   ├── parse/      # parseDateUnit, parseTimeUnit, ...
│       │   │   └── validate/   # isValidDate, isValidTime, ...
│       │   ├── zoned/          # IANA timezone-aware operations
│       │   │   ├── compare/    # isAfterZoned, isBeforeZoned, areZonedEqual
│       │   │   ├── format/     # formatZonedDateTime, formatZonedRange
│       │   │   ├── map/        # mapZonedHoursInDay, mapZonedDatesInRange
│       │   │   ├── math/       # addZoned, subtractZoned
│       │   │   ├── parse/      # parseZonedDate, parseZonedTimezone, ...
│       │   │   └── validate/   # isValidZonedDateTime, isValidTimezone
│       │   ├── regex/          # Composable regex patterns for date/time strings
│       │   └── schemas/        # Zod schemas for runtime validation
│       └── package.json
├── burglekitt/                  # Nx workspace configuration (internal, do not publish)
├── biome.json                   # Formatting and linting rules
├── tsconfig.base.json           # Shared TypeScript base config
└── package.json                 # Workspace root
```

---

## Workspace Scripts

Run from the root:

```bash
# Test, build, typecheck
bun nx run-many -t test
bun nx run-many -t build
bun nx run-many -t typecheck

# Code quality
bun run check
bun run lint
bun run format

# Nx utilities
bunx nx graph        # Visual dependency graph
bunx nx sync         # Sync TypeScript project references
```

## Nx Commands You Will Actually Use

As more packages are added under `packages/*`, these commands become the default workflow:

```bash
# Run targets for every package
bun run build
bun run test:nx
bun run lint:nx
bun run typecheck

# Full local gate before PR
bun run validate

# Only run on projects affected by your branch changes
bun run affected:build
bun run affected:test
bun run affected:lint
bun run affected:typecheck

# Workspace maintenance
bun run graph
bun run sync
bun run sync:check
bun run reset
```

Recommended PR flow:

```bash
bun run affected:lint
bun run affected:test
bun run affected:typecheck
bun run affected:build
```

CI strategy:

- Pull requests run `nx affected` targets (`lint`, `test`, `typecheck`, `build`) using `NX_BASE` and `NX_HEAD`.
- Pushes to `main` run full `nx run-many` across all projects.
- `defaultBase` is set to `main` in Nx config so local affected commands behave consistently.

Run within a specific package:

```bash
cd packages/gmt
bun run test
bun run build
bun run lint
```

---

## Code Quality

| Tool | Purpose |
|---|---|
| [Biome](https://biomejs.dev/) | Formatting and linting |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vitest](https://vitest.dev/) | Testing |
| [Nx](https://nx.dev/) | Task orchestration and caching |
| [Zod](https://zod.dev/) | Runtime validation at API boundaries |

All formatting and linting rules are defined in [biome.json](./biome.json).

**Editor setup:** Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome). Workspace settings are applied automatically via `.vscode/settings.json`.

---

## Releases

Pre-alpha. Each package follows semantic versioning and will be published independently to npm when stable.

---

## License

MIT — See [LICENSE](./LICENSE) for details.
