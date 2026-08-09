/**
 * D'sanchez Barbershop: one source of truth for the shop day.
 *
 * The printed service list and the walk-up flow both read from here, so the two
 * cannot drift apart. Nothing in this file is invented about the business:
 *
 *   HOURS are exactly the hours this site already posts in the Visit section
 *   (Mon-Thu 7:30 AM to 7:45 PM, Fri and Sat 7:00 AM to 7:45 PM, Sun 7:00 AM to
 *   3:30 PM, open seven days).
 *
 *   SERVICES are exactly the six the shop's own menu lists, in the same order.
 *   Their names and descriptions live in the i18n dictionary, keyed by the ids
 *   below, so there is one list and two languages of it.
 *
 *   chairMin is NOT a published duration and is never shown to a customer as
 *   one. D'sanchez posts no service times and this file does not pretend to
 *   know them. It is only a scheduling allowance: the room the flow leaves at
 *   the end of the day so a walk-up time is never offered that the shop cannot
 *   finish before it locks the door. The barber tells you the real length in
 *   the chair, and the flow says so.
 *
 * There is no fabricated availability here and there must never be. Every time
 * inside posted hours is offered. The shop has not told this site that anyone
 * is booked, so this site does not tell anyone they are.
 */

export type ServiceId =
  | "cut-beard"
  | "fades"
  | "lineups"
  | "shave"
  | "kids"
  | "cejas";

export type Service = {
  id: ServiceId;
  /** scheduling allowance in minutes, see the note above */
  chairMin: number;
};

export const SERVICES: Service[] = [
  { id: "cut-beard", chairMin: 45 },
  { id: "fades", chairMin: 45 },
  { id: "lineups", chairMin: 15 },
  { id: "shave", chairMin: 45 },
  { id: "kids", chairMin: 30 },
  { id: "cejas", chairMin: 15 },
];

export const byId = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id) ?? SERVICES[0];

/* ------------------------------------------------------------------ */
/* The shop week, in minutes past midnight, off the posted hours.      */
/* ------------------------------------------------------------------ */

const MON_THU: [number, number] = [7 * 60 + 30, 19 * 60 + 45];
const FRI_SAT: [number, number] = [7 * 60, 19 * 60 + 45];
const SUN: [number, number] = [7 * 60, 15 * 60 + 30];

/** [open, close] for a JS weekday index, 0 = Sunday. Open seven days. */
export function hoursFor(weekday: number): [number, number] {
  if (weekday === 0) return SUN;
  if (weekday === 5 || weekday === 6) return FRI_SAT;
  return MON_THU;
}

/** How far ahead of now the earliest walk-up can be, so nobody is asked to teleport. */
export const LEAD_MIN = 30;

/** The grid a walk-up time is picked on. */
export const STEP_MIN = 15;

/** How many days out the flow lets someone plan. */
export const DAYS_AHEAD = 14;

const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();

/** Local YYYY-MM-DD, never UTC, so a late-evening pick does not slide a day. */
export function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function upcomingDays(count: number, from: Date): Date[] {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    d.setDate(d.getDate() + i);
    out.push(d);
  }
  return out;
}

/**
 * Every walk-up time the shop is actually open for on this day, on the step
 * grid, ending early enough that the chair allowance still fits before close.
 * Nothing is dropped, greyed out or called taken. If it is in here, it is
 * offered.
 */
export function startsFor(day: Date, chairMin: number, now: Date): number[] {
  const [open, close] = hoursFor(day.getDay());
  const isToday = dayKey(day) === dayKey(now);
  const earliest = isToday ? Math.max(open, minutesOf(now) + LEAD_MIN) : open;
  const first = Math.ceil(earliest / STEP_MIN) * STEP_MIN;
  const last = close - chairMin;
  const out: number[] = [];
  for (let t = first; t <= last; t += STEP_MIN) out.push(t);
  return out;
}

/** 12-hour clock, written by hand so the server and the browser agree exactly. */
export function fmtClock(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* ------------------------------------------------------------------ */
/* Phone: format to (xxx) xxx-xxxx while typing, hard cap at 10 digits. */
/* ------------------------------------------------------------------ */

export function formatPhone(input: string): string {
  const d = input
    .replace(/\D/g, "")
    .replace(/^1(?=\d{10})/, "")
    .slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isPhoneComplete(input: string): boolean {
  return input.replace(/\D/g, "").length === 10;
}
