import { chopTime } from "../chop";
import { isValidDateTime } from "../validate";
import { getNow } from "./getNow";
import { getToday } from "./getToday";

describe("getNow", () => {
  it("returns an ISO plain datetime string", () => {
    const value = getNow();
    expect(isValidDateTime(value)).toBe(true);
  });

  it("starts with today's plain date", () => {
    const value = getNow();
    expect(chopTime(value)).toBe(getToday());
  });
});
