import { defineConfig } from "vitest/config";
// delete branch
export default defineConfig({
  test: {
    name: "gmt",
    globals: true,
    environment: "node",
    include: ["packages/gmt/src/**/*.test.ts"],
  },
});
