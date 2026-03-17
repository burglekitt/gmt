import { isValidTimeZone } from ".";

describe("isValidTimeZone", () => {
  it.each`
    timeZone              | expected
    ${"Pacific/Apia"}     | ${true}
    ${"America/New_York"} | ${true}
    ${"Europe/London"}    | ${true}
    ${"Pacific/Niue"}     | ${true}
  `("validates $timeZone as $expected", ({ timeZone, expected }) => {
    expect(isValidTimeZone(timeZone)).toBe(expected);
  });
});
