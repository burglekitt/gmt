import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "gmt",
      globals: true,
      environment: "node",
      root: "packages/gmt",
      include: ["src/**/__tests__/**/*.test.ts"],
      setupFiles: ["./vitest.setup.ts"],
    },
  },
]);
