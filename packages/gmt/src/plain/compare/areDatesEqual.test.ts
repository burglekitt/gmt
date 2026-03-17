import { areDatesEqual } from "./areDatesEqual";

describe("areDatesEqual", () => {
  it.each`
    value1                   | value2                   | expected
    ${"2024-01-01"}          | ${"2024-01-01"}          | ${true}
    ${"0000-01-01"}          | ${"0000-01-01"}          | ${true}
    ${"2024-01-01"}          | ${"2024-01-02"}          | ${false}
    ${"2024-01-01"}          | ${"invalid-date"}        | ${false}
    ${""}                    | ${""}                    | ${false}
    ${""}                    | ${"2024-01-01"}          | ${false}
    ${undefined}             | ${undefined}             | ${false}
    ${"2024-01-01T06:00:00"} | ${"2024-01-01T00:00:00"} | ${true}
  `(
    "returns $expected when comparing $value1 to $value2",
    ({
      value1,
      value2,
      expected,
    }: { value1: string; value2: string; expected: boolean }) => {
      expect(areDatesEqual(value1, value2)).toBe(expected);
    },
  );
});
