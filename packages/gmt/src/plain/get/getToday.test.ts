import { isValidDate } from "../validate";
import { getNow } from "./getNow";
import { getToday } from "./getToday";

describe("getToday", () => {
  it("returns an ISO plain date string", () => {
    const value = getToday();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(isValidDate(value)).toBe(true);
  });

  it("matches the date part of getNow", () => {
    expect(getToday()).toBe(getNow().slice(0, 10));
  });
});
