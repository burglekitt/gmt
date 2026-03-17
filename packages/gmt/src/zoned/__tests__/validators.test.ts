import { isValidTimeZone } from "../validators";

describe("isValidTimeZone", () => {
  it.each`
    timeZone              | expected
    ${"America/New_York"} | ${true}
    ${"Europe/London"}    | ${true}
  `("validates $timezone as $expected", ({ timeZone, expected }) => {
    expect(isValidTimeZone(timeZone)).toBe(expected);
  });
});
