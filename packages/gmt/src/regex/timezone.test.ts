import { timezone } from "./timezone";

describe("regex/timezone", () => {
  it.each`
    value                   | expected
    ${"UTC"}               | ${true}
    ${"GMT"}               | ${true}
    ${"America/New_York"}  | ${true}
    ${"Europe/London"}     | ${true}
    ${"Asia/Kathmandu"}    | ${true}
    ${"Not/AZone"}         | ${true}
    ${"UTC+1"}             | ${false}
    ${"America"}           | ${false}
    ${""}                  | ${false}
  `("timezone pattern matches $value as $expected", ({ value, expected }) => {
    expect(timezone.test(value)).toBe(expected);
  });
});