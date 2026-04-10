# Burglekitt Monorepo

Home of [@burglekitt/gmt](./packages/gmt) — **Give Me Temporal!**

A monorepo for Burglekitt community libraries, built with Nx, powered by Bun, and dead serious about making JavaScript date handling not terrible.

## Aint Nobody Got Time For...

![Aint nobody got time for that](https://media.giphy.com/media/bWM2eWYfN3r20/giphy.gif)

We do not use JavaScript `Date` APIs in this monorepo.

- Aint nobody got time for `new Date()` mutability and environment drift.
- Aint nobody got time for `Date.parse()` guessing what you meant.
- Aint nobody got time for `Date.UTC()` argument gymnastics.
- Aint nobody got time for `Date.now()` scattered magic numbers.

Use GMT instead:

- `getNow()`, `getUnixNow()`, and `getUtcNow()` for current time values.
- `convertUtcDateTimeToUnix()` and `convertUtcToUnix()` for explicit unix conversion.
- `convertTimezoneToUtc()` and `convertUtcToTimezone()` for timezone-safe conversion.
- String-in/string-out APIs with Temporal under the hood for safer behavior.

If you see a Date API in code, replace it with a GMT helper.

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
│   ├── gmt/                    # @burglekitt/gmt — Give Me Temporal!
│   │   ├── src/
│   │   │   ├── plain/          # Timezone-free operations
│   │   │   │   ├── calculate/  # addDate, diffDateTime, subtractTime, ...
│   │   │   │   ├── compare/    # isAfterDate, isBeforeDate, areDatesEqual, ...
│   │   │   │   ├── format/     # formatDate, formatTime, formatDateTime
│   │   │   │   ├── get/        # getNow, getToday, getUnixNow, ...
│   │   │   │   ├── map/        # mapDaysInMonth, mapDatesInRange, ...
│   │   │   │   ├── parse/      # parseDateUnit, parseTimeUnit, ...
│   │   │   │   └── validate/   # isValidDate, unix validators, ...
│   │   │   ├── zoned/          # IANA timezone-aware operations
│   │   │   │   ├── calculate/  # addZoned, subtractZoned
│   │   │   │   ├── compare/    # isAfterZoned, isBeforeZoned, areZonedEqual
│   │   │   │   ├── convert/    # unix/utc/timezone conversion helpers
│   │   │   │   ├── format/     # formatZonedDateTime, formatZonedRange
│   │   │   │   ├── get/        # getZonedNow, getZonedToday, ...
│   │   │   │   ├── map/        # mapZonedHoursInDay, mapZonedDatesInRange
│   │   │   │   ├── parse/      # parseZonedDate, parseZonedTimezone, ...
│   │   │   │   └── validate/   # isValidZonedDateTime, isValidTimezone
│   │   │   ├── regex/          # Composable regex patterns for date/time strings
│   │   └── package.json
│   ├── gmt-biome/              # @burglekitt/gmt-biome — Shared Biome config
│   │   ├── biome.json          # Consumer-facing config (uses ./plugins/ paths)
│   │   └── plugins/            # Grit plugins banning Date APIs
│   └── gmt-eslint/             # @burglekitt/gmt-eslint — Shared ESLint flat config
│       └── eslint/
│           └── index.mjs       # Flat config banning Date APIs
├── burglekitt/                  # Nx workspace configuration (internal, do not publish)
├── biome.json                   # Root Biome config — references gmt-biome plugins directly
├── eslint.config.mjs            # Root ESLint config — imports gmt-eslint
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
| [Biome](https://biomejs.dev/) | Formatting and linting (+ Grit plugins for Date ban) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vitest](https://vitest.dev/) | Testing |
| [Nx](https://nx.dev/) | Task orchestration and caching |

All Biome rules are in [biome.json](./biome.json) (Grit plugins live in [packages/gmt-biome/plugins/](./packages/gmt-biome/plugins/)).

**For consumers:** [@burglekitt/gmt-eslint](./packages/gmt-eslint) provides a standalone ESLint flat config with the same Date API ban rules.

**For Oxlint users:** [@burglekitt/gmt-oxlint](./packages/gmt-oxlint) provides the same Date API ban rules as an Oxlint JS plugin.

---

## Packages

| Package | npm | Description |
|---|---|---|
| [`@burglekitt/gmt`](./packages/gmt) | `npm install @burglekitt/gmt` | Give Me Temporal — string-in/string-out date library |
| [`@burglekitt/gmt-biome`](./packages/gmt-biome) | `npm install -D @burglekitt/gmt-biome` | Shared Biome config — bans `Date` APIs via Grit plugins |
| [`@burglekitt/gmt-eslint`](./packages/gmt-eslint) | `npm install -D @burglekitt/gmt-eslint` | Shared ESLint flat config — bans `Date` APIs |
| [`@burglekitt/gmt-oxlint`](./packages/gmt-oxlint) | `npm install -D @burglekitt/gmt-oxlint oxlint` | Shared Oxlint JS plugin — bans `Date` APIs |

`@burglekitt/gmt` currently exports top-level `Temporal`, `plain`, `zoned`, and `regex` namespaces, with direct subpath imports available under `@burglekitt/gmt/*`.

---

## Releases

Pre-alpha. Each package follows semantic versioning and is published independently to npm.

Publishing uses [Changesets](https://github.com/changesets/changesets) for monorepo-safe, per-package version management. Nothing publishes automatically — all releases are triggered manually.

**See [PUBLISHING.md](./PUBLISHING.md) for the full step-by-step guide.**

Key points:

- When you finish a change, run `bun run changeset:add` to record what changed and how big the bump is.
- When ready to release, a maintainer runs `bun run changeset:version` to apply version bumps and update changelogs.
- Publishing is triggered manually via [Actions → Publish Package](../../actions/workflows/publish.yml).
- Git tags are package-scoped: `@burglekitt/gmt@0.3.0`, `@burglekitt/gmt-oxlint@0.2.0`, etc.

---

## License

MIT — See [LICENSE](./LICENSE) for details.
