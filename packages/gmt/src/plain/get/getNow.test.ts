import { chopTime } from "../chop";
import { isValidDateTime } from "../validate";
import { getNow } from "./getNow";
import { getToday } from "./getToday";

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
    expect(chopTime(value)).toBe(getToday());
  });
});
