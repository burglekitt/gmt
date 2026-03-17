import { plainDateTime } from "./date-time";

describe("regex/date-time", () => {
  it.each`
    value                        | expected
    ${"2024-03-17T14:30"}        | ${true}
    ${"2024-03-17T14:30:45"}     | ${true}
    ${"2024-03-17T14:30:45.123"} | ${true}
    ${"2024-03-17T14:30:45,123"} | ${true}
    ${"2024-03-17T14:30:60"}     | ${true}
    ${"+001234-12-31T23:59:59"}  | ${true}
    ${"2024-03-17 14:30:45"}     | ${false}
    ${"2024-3-17T14:30:45"}      | ${false}
    ${"2024-03-17T24:00:00"}     | ${false}
    ${"not-a-datetime"}          | ${false}
  `(
    "plainDateTime pattern matches $value as $expected",
    ({ value, expected }: { value: string; expected: boolean }) => {
      expect(plainDateTime.test(value)).toBe(expected);
    },
  );
});
