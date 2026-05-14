import { Temporal } from "@js-temporal/polyfill";
import { normalizeDateTime } from "../../internal/normalizeDateTime";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { MustTestLocales } from "../../test";
import { formatUnix } from "./formatUnix";

describe("formatUnix", () => {
  let tzSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tzSpy = vi
      .spyOn(getSystemTimeZoneModule, "getSystemTimeZone")
      .mockReturnValue("UTC");
  });

  afterEach(() => tzSpy.mockRestore());

  // focused en-US outputs using explicit UTC timezone for stability
  it.each`
    unix             | options
    ${1709164800000} | ${{ dateStyle: "full", timeStyle: "full", timeZone: "UTC" }}
    ${1709164800000} | ${{ dateStyle: "long", timeStyle: "long", timeZone: "UTC" }}
    ${1709164800000} | ${{ dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" }}
    ${1709164800000} | ${{ dateStyle: "short", timeStyle: "short", timeZone: "UTC" }}
  `(
    "formats unix $unix for en-US with options $options",
    ({ unix, options }) => {
      const expected = Temporal.Instant.fromEpochMilliseconds(unix)
        .toZonedDateTimeISO("UTC")
        .toPlainDateTime()
        .toLocaleString(
          MustTestLocales.enUS,
          options as unknown as Intl.DateTimeFormatOptions,
        );

      expect(
        formatUnix(
          unix as unknown as number,
          MustTestLocales.enUS,
          options as unknown as Intl.DateTimeFormatOptions,
        ),
      ).toBe(normalizeDateTime(expected));
    },
  );

  it("uses getSystemTimeZone() when timeZone is 'local'", () => {
    const spy = vi
      .spyOn(getSystemTimeZoneModule, "getSystemTimeZone")
      .mockReturnValue("Europe/Paris");

    const out = formatUnix(1709164800000, MustTestLocales.enUS, {
      dateStyle: "long",
      timeStyle: "long",
      timeZone: "local",
    } as unknown as Intl.DateTimeFormatOptions);

    const expected = Temporal.Instant.fromEpochMilliseconds(1709164800000)
      .toZonedDateTimeISO("Europe/Paris")
      .toPlainDateTime()
      .toLocaleString(MustTestLocales.enUS, {
        dateStyle: "long",
        timeStyle: "long",
      });

    expect(out).toBe(normalizeDateTime(expected));

    spy.mockRestore();
  });

  it.each`
    unix
    ${"invalid"}
    ${null}
    ${undefined}
    ${1.5}
    ${-1.5}
  `("returns empty string for invalid unix $unix", ({ unix }) => {
    expect(formatUnix(unix as never)).toBe("");
  });
});
