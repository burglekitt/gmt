# Burglekitt Monorepo

A modern monorepo for building Burglekitt community libraries, currently hosting **@burglekitt/gmt** — a Temporal-based date and time utilities package.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Bun** (recommended for development)

### Installation & Development

```bash
# Install dependencies
bun install

# Build all packages
bun nx run-many -t build

# Run tests across all packages
bun nx run-many -t test

# Lint and format
bun run lint
bun run format
```

## 📦 Packages

### [@burglekitt/gmt](./packages/gmt)

Temporal-based date and time utilities with timezone support and Temporal polyfill integration.

- **Status:** Pre-alpha
- **License:** MIT
- **Install:** `npm install @burglekitt/gmt`

See [packages/gmt/README.md](./packages/gmt/README.md) for usage and API documentation.

## 🛠️ Development

### Project Structure

```
.
├── packages/
│   ├── gmt/              # Temporal date/time utilities (pre-alpha)
│   └── [future packages]
├── burglekitt/           # Nx workspace configuration (internal)
├── .github/workflows/    # GitHub Actions CI/CD
├── biome.json            # Code quality (format/lint)
├── tsconfig.base.json    # TypeScript base configuration
└── package.json          # Workspace configuration
```

### Workspace Scripts

Run from the root directory:

```bash
# Check formatting and linting
bun run check
bun run lint
bun run format             # Auto-format code

# Build and test
bun nx run-many -t build
bun nx run-many -t test
bun nx run-many -t typecheck

# With Nx directly
bunx nx graph              # View project dependency graph
bunx nx sync               # Sync TypeScript project references
```

### Package-Specific Scripts

Navigate to a package directory and run:

```bash
cd packages/gmt
bun run build
bun run test
bun run lint
```

## 📝 Code Quality

This monorepo uses:

- **[Biome](https://biomejs.dev/)** for formatting and linting
- **[TypeScript](https://www.typescriptlang.org/)** for type safety
- **[Vitest](https://vitest.dev/)** for testing
- **[Nx](https://nx.dev/)** for task orchestration

All formatting and linting rules are defined in [biome.json](./biome.json).

### Editor Setup

For the best experience:

1. Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. Install [Prettier (for Markdown)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
3. Workspace settings are automatically applied via [.vscode/settings.json](./.vscode/settings.json)

## 🚢 Releases

This monorepo is currently in **pre-alpha**. Each package follows semantic versioning and will be published independently to npm when stable.

Release process and automation coming soon.

## 📄 License

MIT — See [LICENSE](./LICENSE) for details.

---

For more information about @burglekitt/gmt, see [packages/gmt/README.md](./packages/gmt/README.md).
