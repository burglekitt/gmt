import { Temporal } from "@js-temporal/polyfill";
import { convertUtcToUnix } from "../convert";
import { getUtcNow } from "./getUtcNow";

describe("getUtcNow", () => {
  it("returns a UTC datetime string", () => {
    const value = getUtcNow();
    expect(value).not.toBe("");
    expect(value.includes("T")).toBe(true);
    expect(value.endsWith("Z")).toBe(true);
  });

  it("returns a parseable Temporal instant", () => {
    const value = getUtcNow();
    expect(() => Temporal.Instant.from(value)).not.toThrow();
  });

  it("returns a value consumable by zoned unix converters", () => {
    const value = getUtcNow();
    expect(convertUtcToUnix(value, "milliseconds")).not.toBeNull();
    expect(convertUtcToUnix(value, "seconds")).not.toBeNull();
  });
});
