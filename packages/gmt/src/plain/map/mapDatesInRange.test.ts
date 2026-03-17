import { mapDatesInRange } from "./mapDatesInRange";

describe("mapDatesInRange", () => {
  it.each`
    startDate       | endDate         | stepDays | expected
    ${"2024-03-01"} | ${"2024-03-03"} | ${1}     | ${["2024-03-01", "2024-03-02", "2024-03-03"]}
    ${"2024-03-01"} | ${"2024-03-07"} | ${2}     | ${["2024-03-01", "2024-03-03", "2024-03-05", "2024-03-07"]}
    ${"2024-03-05"} | ${"2024-03-03"} | ${1}     | ${[]}
  `(
    "maps range $startDate to $endDate with step $stepDays",
    ({
      startDate,
      endDate,
      stepDays,
      expected,
    }: {
      startDate: string;
      endDate: string;
      stepDays: number;
      expected: string[];
    }) => {
      expect(mapDatesInRange(startDate, endDate, stepDays)).toEqual(expected);
    },
  );

  it("throws for invalid stepDays", () => {
    expect(() => mapDatesInRange("2024-03-01", "2024-03-03", 0)).toThrow();
  });

  it("throws for invalid date input", () => {
    expect(() => mapDatesInRange("invalid", "2024-03-03")).toThrow();
  });
});
