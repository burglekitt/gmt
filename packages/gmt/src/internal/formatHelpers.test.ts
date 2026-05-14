import { Temporal } from "@js-temporal/polyfill";

import {
  formatRelativeTemporal,
  getLocalizedTimeZoneName,
  mapLargestUnit,
  parseEpochNumber,
  resolveReferenceToZoned,
} from "./formatHelpers";

describe("formatHelpers", () => {
  describe("mapLargestUnit", () => {
    it("returns undefined for undefined input", () => {
      expect(mapLargestUnit()).toBeUndefined();
    });

    it.each`
      raw               | expected
      ${"year"}         | ${"year"}
      ${"years"}        | ${"year"}
      ${"months"}       | ${"month"}
      ${"weeks"}        | ${"week"}
      ${"days"}         | ${"day"}
      ${"hours"}        | ${"hour"}
      ${"minutes"}      | ${"minute"}
      ${"seconds"}      | ${"second"}
      ${"milliseconds"} | ${"second"}
      ${"microseconds"} | ${"second"}
      ${"nanoseconds"}  | ${"second"}
    `("maps $raw to $expected", ({ raw, expected }) => {
      expect(mapLargestUnit(raw as string)).toEqual(expected as string);
    });

    it("returns null for unknown units", () => {
      expect(mapLargestUnit("bananas")).toBeNull();
    });
  });

  describe("parseEpochNumber", () => {
    it("parses numbers and numeric strings", () => {
      expect(parseEpochNumber(123)).toBe(123);
      expect(parseEpochNumber("  456  ")).toBe(456);
      expect(parseEpochNumber("-789")).toBe(-789);
    });

    it("returns null for non-integer or invalid strings", () => {
      expect(parseEpochNumber("1.23")).toBeNull();
      expect(parseEpochNumber("abc")).toBeNull();
      // pass an explicitly cast non-number/string to exercise the runtime guard
      expect(parseEpochNumber(null as unknown as string)).toBeNull();
    });
  });

  describe("resolveReferenceToZoned", () => {
    const systemTime = "2024-02-29T00:00:00Z";

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(systemTime);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("uses Temporal.Now.instant() when reference is undefined", () => {
      const zoned = resolveReferenceToZoned(undefined, "milliseconds", "UTC");
      const expected =
        Temporal.Instant.from(systemTime).toZonedDateTimeISO("UTC");
      expect(zoned.toInstant().epochMilliseconds).toBe(
        expected.toInstant().epochMilliseconds,
      );
    });

    it("accepts numeric references as seconds or milliseconds", () => {
      const asSeconds = resolveReferenceToZoned(1700000000, "seconds", "UTC");
      expect(asSeconds.toInstant().epochMilliseconds).toBe(1700000000 * 1000);

      const asMs = resolveReferenceToZoned(
        1700000000000,
        "milliseconds",
        "UTC",
      );
      expect(asMs.toInstant().epochMilliseconds).toBe(1700000000000);
    });

    it("accepts ISO string references", () => {
      const s = "2024-03-01T00:00:00Z";
      const zoned = resolveReferenceToZoned(s, "milliseconds", "UTC");
      expect(zoned.toInstant().epochMilliseconds).toBe(
        Temporal.Instant.from(s).epochMilliseconds,
      );
    });
  });

  describe("getLocalizedTimeZoneName", () => {
    it("returns empty string for invalid timezone", () => {
      expect(getLocalizedTimeZoneName("en-US", "Invalid/Zone")).toBe("");
    });

    it("returns a non-empty name for a valid timezone", () => {
      const ms = Temporal.Instant.from(
        "2024-03-01T00:00:00Z",
      ).epochMilliseconds;
      const name = getLocalizedTimeZoneName("en-US", "UTC", "long", ms);
      expect(typeof name).toBe("string");
      expect(name).not.toEqual("");
    });
  });

  describe("formatRelativeTemporal", () => {
    it("formats days using default (auto) numeric style", () => {
      const tz = "UTC";
      const target = Temporal.Instant.from(
        "2024-05-01T00:00:00Z",
      ).toZonedDateTimeISO(tz);
      const reference = Temporal.Instant.from(
        "2024-05-02T00:00:00Z",
      ).toZonedDateTimeISO(tz);
      const out = formatRelativeTemporal(target, reference, "en-US");
      expect(out).toBeTruthy();
      expect(out).toContain("yesterday");
    });

    it("respects numeric: 'always' and largestUnit when provided", () => {
      const tz = "UTC";
      const target = Temporal.Instant.from(
        "2024-05-01T00:00:00Z",
      ).toZonedDateTimeISO(tz);
      const reference = Temporal.Instant.from(
        "2024-05-02T00:00:00Z",
      ).toZonedDateTimeISO(tz);
      const out = formatRelativeTemporal(target, reference, "en-US", {
        numeric: "always",
        largestUnit: "hour",
      });
      expect(out).toBeTruthy();
      expect(out.toLowerCase()).toContain("24");
      expect(out.toLowerCase()).toContain("hour");
    });

    it("returns empty string on invalid inputs", () => {
      expect(
        formatRelativeTemporal(
          "x" as unknown as Temporal.Instant,
          "y" as unknown as Temporal.Instant,
        ),
      ).toBe("");
    });
  });
});
