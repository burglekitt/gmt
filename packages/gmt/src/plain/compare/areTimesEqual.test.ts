import { areTimesEqual } from "./areTimesEqual";

describe("areTimesEqual", () => {
  it.each`
    value1            | value2            | expected
    ${"08:30"}        | ${"08:30:00"}     | ${true}
    ${"08:30:45.123"} | ${"08:30:45,123"} | ${true}
    ${"23:59:60"}     | ${"23:59:60.0"}   | ${true}
    ${"08:30"}        | ${"08:31"}        | ${false}
    ${"08:30"}        | ${"invalid-time"} | ${false}
  `(
    "returns $expected when comparing $value1 to $value2",
    ({
      value1,
      value2,
      expected,
    }: { value1: string; value2: string; expected: boolean }) => {
      expect(areTimesEqual(value1, value2)).toBe(expected);
    },
  );
});
