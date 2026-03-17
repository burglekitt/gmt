import { mapDaysInMonth } from "./mapDaysInMonth";

describe("mapDaysInMonth", () => {
  it.each`
    month        | expectedLength
    ${"2024-02"} | ${29}
    ${"2023-02"} | ${28}
    ${"2024-04"} | ${30}
    ${"2024-03"} | ${31}
  `(
    "returns $expectedLength days for $month",
    ({ month, expectedLength }: { month: string; expectedLength: number }) => {
      expect(mapDaysInMonth(month)).toHaveLength(expectedLength);
    },
  );

  it("returns zero-padded ISO date strings", () => {
    const result = mapDaysInMonth("2024-03");
    expect(result[0]).toBe("2024-03-01");
    expect(result.at(-1)).toBe("2024-03-31");
  });

  it("throws for invalid month input", () => {
    expect(() => mapDaysInMonth("2024-13")).toThrow();
  });
});
