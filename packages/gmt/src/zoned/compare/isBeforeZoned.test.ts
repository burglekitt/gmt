import { isBeforeZoned } from "./isBeforeZoned";

describe("isBeforeZoned", () => {
  it.each`
    value1                                           | value2                                           | expected
    ${"2024-03-17T10:29:00-04:00[America/New_York]"} | ${"2024-03-17T10:30:00-04:00[America/New_York]"} | ${true}
    ${"2024-03-17T14:30:00Z[UTC]"}                   | ${"2024-03-17T10:30:00-04:00[America/New_York]"} | ${false}
    ${"2024-03-17T10:31:00-04:00[America/New_York]"} | ${"2024-03-17T10:30:00-04:00[America/New_York]"} | ${false}
    ${"invalid"}                                     | ${"2024-03-17T10:30:00-04:00[America/New_York]"} | ${false}
  `(
    "returns $expected when checking if $value1 is before $value2",
    ({
      value1,
      value2,
      expected,
    }: {
      value1: string;
      value2: string;
      expected: boolean;
    }) => {
      expect(isBeforeZoned(value1, value2)).toBe(expected);
    },
  );
});
