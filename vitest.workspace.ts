import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "gmt",
      globals: true,
      environment: "node",
      root: "packages/gmt",
      include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
      setupFiles: ["./vitest.setup.ts"],
    },
  },
]);
