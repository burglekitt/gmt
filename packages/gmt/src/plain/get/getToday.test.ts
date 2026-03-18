import { chopTime } from "../chop";
import { isValidDate } from "../validate";
import { getNow } from "./getNow";
import { getToday } from "./getToday";

describe("getToday", () => {
  it("returns an ISO plain date string", () => {
    const value = getToday();
    expect(isValidDate(value)).toBe(true);
  });

  it("matches the date part of getNow", () => {
    expect(getToday()).toBe(chopTime(getNow()));
  });
});
