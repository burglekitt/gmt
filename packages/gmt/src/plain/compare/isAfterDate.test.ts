import { isAfterDate } from "./isAfterDate";

describe("isAfterDate", () => {
  it.each`
    value1          | value2          | expected
    ${"2024-03-18"} | ${"2024-03-17"} | ${true}
    ${"2024-03-17"} | ${"2024-03-17"} | ${false}
    ${"2024-03-16"} | ${"2024-03-17"} | ${false}
    ${"invalid"}    | ${"2024-03-17"} | ${false}
  `(
    "returns $expected when checking if $value1 is after $value2",
    ({
      value1,
      value2,
      expected,
    }: {
      value1: string;
      value2: string;
      expected: boolean;
    }) => {
      expect(isAfterDate(value1, value2)).toBe(expected);
    },
  );
});
