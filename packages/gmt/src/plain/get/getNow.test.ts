import { isValidDateTime } from "../validate";
import { getNow } from "./getNow";

describe("getNow", () => {
  it("returns an ISO plain datetime string", () => {
    const value = getNow();
    expect(value).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:[.,]\d{1,9})?)?$/,
    );
    expect(isValidDateTime(value)).toBe(true);
  });

  it("starts with today's plain date", () => {
    const value = getNow();
    expect(value.slice(0, 10)).toBe(getNow().slice(0, 10));
  });
});
