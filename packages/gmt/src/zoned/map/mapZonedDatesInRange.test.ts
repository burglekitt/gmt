import { mapZonedDatesInRange } from "./mapZonedDatesInRange";

describe("mapZonedDatesInRange", () => {
  it.each`
    start                                            | end                                              | stepDays | expected
    ${"2024-03-01T10:00:00-05:00[America/New_York]"} | ${"2024-03-03T10:00:00-05:00[America/New_York]"} | ${1}     | ${["2024-03-01", "2024-03-02", "2024-03-03"]}
    ${"2024-03-01T10:00:00-05:00[America/New_York]"} | ${"2024-03-07T10:00:00-05:00[America/New_York]"} | ${2}     | ${["2024-03-01", "2024-03-03", "2024-03-05", "2024-03-07"]}
    ${"2024-03-05T10:00:00-05:00[America/New_York]"} | ${"2024-03-03T10:00:00-05:00[America/New_York]"} | ${1}     | ${[]}
  `(
    "maps zoned dates from $start to $end with step $stepDays",
    ({
      start,
      end,
      stepDays,
      expected,
    }: {
      start: string;
      end: string;
      stepDays: number;
      expected: string[];
    }) => {
      expect(mapZonedDatesInRange(start, end, stepDays)).toEqual(expected);
    },
  );

  it("throws for different time zones", () => {
    expect(() =>
      mapZonedDatesInRange(
        "2024-03-01T10:00:00-05:00[America/New_York]",
        "2024-03-03T15:00:00+00:00[UTC]",
      ),
    ).toThrow();
  });

  it("throws for invalid stepDays", () => {
    expect(() =>
      mapZonedDatesInRange(
        "2024-03-01T10:00:00-05:00[America/New_York]",
        "2024-03-03T10:00:00-05:00[America/New_York]",
        0,
      ),
    ).toThrow();
  });
});
