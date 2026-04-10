import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["packages/gmt-oxlint/src/**/*.test.ts", "src/**/*.test.ts"],
  },
});
