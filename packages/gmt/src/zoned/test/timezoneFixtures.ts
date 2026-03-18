import { Temporal } from "@js-temporal/polyfill";

export const battleTestTimeZones = [
  "Pacific/Niue",
  "Pacific/Apia",
  "UTC",
  "Etc/GMT",
  "Europe/Helsinki",
  "America/Chicago",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Pacific/Chatham",
] as const;

export const validOnlyBattleTestTimeZones = [
  ...battleTestTimeZones,
  "Asia/Calcutta",
] as const;

const battleTestInstant = Temporal.Instant.from("2024-03-17T14:30:45Z");

export const sameInstantBattleCases = battleTestTimeZones.map((timeZone) => ({
  timeZone,
  value: battleTestInstant.toZonedDateTimeISO(timeZone).toString(),
  unixMilliseconds: Number(battleTestInstant.epochMilliseconds),
  unixSeconds: Math.floor(Number(battleTestInstant.epochMilliseconds) / 1000),
  zulu: battleTestInstant.toString(),
}));

export const localNoonBattleCases = battleTestTimeZones.map((timeZone) => ({
  timeZone,
  value: Temporal.ZonedDateTime.from({
    year: 2024,
    month: 3,
    day: 17,
    hour: 12,
    minute: 0,
    second: 0,
    timeZone,
  }).toString(),
}));

export const localRangeBattleCases = battleTestTimeZones.map((timeZone) => ({
  timeZone,
  start: Temporal.ZonedDateTime.from({
    year: 2024,
    month: 3,
    day: 17,
    hour: 10,
    minute: 0,
    second: 0,
    timeZone,
  }).toString(),
  end: Temporal.ZonedDateTime.from({
    year: 2024,
    month: 3,
    day: 19,
    hour: 10,
    minute: 0,
    second: 0,
    timeZone,
  }).toString(),
  expected: ["2024-03-17", "2024-03-18", "2024-03-19"],
}));

export const battleTestPlainDateTime = "2024-03-17T14:30:45";
export const battleTestPlainDate = "2024-03-17";
