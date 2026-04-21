import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import plugin from "./index";

describe("recommended config artifact", () => {
  it("matches plugin.configs.recommended.rules", () => {
    const configPath = resolve(process.cwd(), "config/recommended.json");
    const raw = readFileSync(configPath, "utf-8");
    const json = JSON.parse(raw) as {
      rules?: Record<string, string>;
    };

    expect(json.rules).toEqual(plugin.configs?.recommended?.rules);
  });
});
