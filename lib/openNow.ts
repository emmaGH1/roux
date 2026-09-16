import type { OpenHour } from "./types";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Hours are local to America/New_York. close_time 24:00 = midnight. 02:00 after 20:00 = next day. */
export function isOpenAt(hours: OpenHour[], at: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);

  const weekday = (parts.find((p) => p.type === "weekday")?.value ?? "").toLowerCase();
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);
  const mins = hour * 60 + minute;
  const day = DAYS.find((d) => weekday.startsWith(d));
  if (!day) return false;

  for (const h of hours) {
    if (h.day_of_week !== day) continue;
    const open = parseHm(h.open_time);
    const close = parseHm(h.close_time);
    if (close <= open) {
      if (mins >= open) return true;
    } else if (mins >= open && mins < close) {
      return true;
    }
  }

  const prev = DAYS[(DAYS.indexOf(day) + 6) % 7];
  for (const h of hours) {
    if (h.day_of_week !== prev) continue;
    const open = parseHm(h.open_time);
    const close = parseHm(h.close_time);
    if (close <= open && mins < close) return true;
  }
  return false;
}

function parseHm(t: string): number {
  if (t === "24:00") return 24 * 60;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function todayHours(hours: OpenHour[], at: Date = new Date()): OpenHour | null {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
  })
    .format(at)
    .toLowerCase();
  const day = DAYS.find((d) => weekday.startsWith(d));
  return hours.find((h) => h.day_of_week === day) ?? null;
}
