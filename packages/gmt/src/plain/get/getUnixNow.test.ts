import { isValidUnixMilliseconds, isValidUnixSeconds } from "../validate";
import { getUnixNow } from "./getUnixNow";

describe("getUnixNow", () => {
  it("returns a valid 10-digit unix timestamp in seconds", () => {
    const unixNowSeconds = getUnixNow("seconds");
    expect(Number.isInteger(unixNowSeconds)).toBe(true);
    expect(isValidUnixSeconds(String(unixNowSeconds))).toBe(true);
  });

  it("returns a valid 13-digit unix timestamp in milliseconds", () => {
    const unixNowMilliseconds = getUnixNow("milliseconds");
    expect(Number.isInteger(unixNowMilliseconds)).toBe(true);
    expect(isValidUnixMilliseconds(String(unixNowMilliseconds))).toBe(true);
  });

  it("keeps seconds and milliseconds aligned", () => {
    const unixNowSeconds = getUnixNow("seconds");
    const unixNowMilliseconds = getUnixNow("milliseconds");
    expect(unixNowMilliseconds - unixNowSeconds * 1000).toBeGreaterThanOrEqual(
      0,
    );
    expect(unixNowMilliseconds - unixNowSeconds * 1000).toBeLessThan(1000);
  });
});
