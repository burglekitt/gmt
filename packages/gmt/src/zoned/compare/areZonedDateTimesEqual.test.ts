import { areZonedDateTimesEqual } from "./areZonedDateTimesEqual";

describe("areZonedDateTimesEqual", () => {
  it.each`
    value1                                               | value2                                           | expected
    ${"2024-03-17T14:30[America/New_York]"}              | ${"2024-03-17T14:30:00[America/New_York]"}       | ${true}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"2024-03-17T14:30:45.123[America/New_York]"}   | ${true}
    ${"2024-03-17T14:30:45Z[UTC]"}                       | ${"2024-03-17T14:30:45Z[UTC]"}                   | ${true}
    ${"2024-03-17T14:30:45Z[UTC]"}                       | ${"2024-03-17T10:30:45-04:00[America/New_York]"} | ${false}
    ${"2024-03-17T14:30:45[America/New_York]"}           | ${"2024-03-17T14:31:45[America/New_York]"}       | ${false}
    ${"2024-03-17T14:30:45[America/New_York]"}           | ${"not-a-zoned-datetime"}                        | ${false}
  `(
    "returns $expected when comparing $value1 to $value2",
    ({
      value1,
      value2,
      expected,
    }: {
      value1: string;
      value2: string;
      expected: boolean;
    }) => {
      expect(areZonedDateTimesEqual(value1, value2)).toBe(expected);
    },
  );
});
