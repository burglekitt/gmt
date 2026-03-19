import { plainDateTime, utcDateTime } from "./date-time";

describe("regex/date-time", () => {
  it.each`
    value                        | expected
    ${"2024-03-17T14:30"}        | ${true}
    ${"2024-03-17T14:30:45"}     | ${true}
    ${"2024-03-17T14:30:45.123"} | ${true}
    ${"2024-03-17T14:30:45,123"} | ${true}
    ${"2024-03-17T14:30:60"}     | ${false}
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

describe("regex/date-time — utcDateTime", () => {
  it.each`
    value                         | expected
    ${"2024-03-17T14:30Z"}        | ${true}
    ${"2024-03-17T14:30:45Z"}     | ${true}
    ${"2024-03-17T14:30:45.123Z"} | ${true}
    ${"2024-03-17T14:30:45,123Z"} | ${true}
    ${"2024-03-17T14:30:60Z"}     | ${false}
    ${"+001234-12-31T23:59:59Z"}  | ${true}
    ${"2024-03-17T14:30"}         | ${false}
    ${"2024-03-17T14:30:45"}      | ${false}
    ${"2024-03-17T14:30Z "}       | ${false}
    ${"2024-03-17 14:30:45Z"}     | ${false}
    ${"2024-3-17T14:30:45Z"}      | ${false}
    ${"2024-03-17T24:00:00Z"}     | ${false}
    ${"not-a-datetime"}           | ${false}
  `(
    "utcDateTime pattern matches $value as $expected",
    ({ value, expected }: { value: string; expected: boolean }) => {
      expect(utcDateTime.test(value)).toBe(expected);
    },
  );
});
