"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

/**
 * Booking add-on demo, adapted from factory-blueprints/addons/booking-widget.
 * Same flow as the blueprint (pick date -> pick slot -> contact -> confirmation)
 * but availability is mocked client-side for the static demo: slots are derived
 * deterministically from the real shop hours (Mon-Thu 7:30-7:45pm, Fri-Sat from
 * 7:00, Sun 7:00-3:30) with a hash dropping ~40% to feel like a live book.
 * Clearly labeled as a demo; nothing is persisted or sent anywhere.
 */

type Slot = { label: string; key: string };

function hoursFor(day: number): [number, number] {
  // [openMinutes, closeMinutes]
  if (day === 0) return [7 * 60, 15 * 60 + 30]; // Sun
  if (day === 5 || day === 6) return [7 * 60, 19 * 60 + 45]; // Fri, Sat
  return [7 * 60 + 30, 19 * 60 + 45]; // Mon-Thu
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function fmtTime(mins: number, lang: Lang): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const d = new Date(2026, 0, 5, h24, m);
  return d.toLocaleTimeString(lang === "es" ? "es-US" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function slotsFor(date: Date, lang: Lang): Slot[] {
  const [open, close] = hoursFor(date.getDay());
  const ymd = date.toISOString().slice(0, 10);
  const out: Slot[] = [];
  for (let t = open + 30; t <= close - 45; t += 45) {
    if (hash(ymd + t) % 10 < 4) continue; // mock: ~40% taken
    out.push({ label: fmtTime(t, lang), key: ymd + "-" + t });
  }
  return out;
}

export default function BookingDemo({ lang }: { lang: Lang }) {
  const t = copy[lang].booking;
  const days = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + 1 + i);
      return d;
    });
  }, []);

  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [svc, setSvc] = useState(0);
  const [done, setDone] = useState(false);

  const day = days[dayIdx];
  const slots = useMemo(() => slotsFor(day, lang), [day, lang]);
  const locale = lang === "es" ? "es-US" : "en-US";

  const reset = () => {
    setDone(false);
    setSlot(null);
    setName("");
    setPhone("");
  };

  return (
    <section id="booking" className="border-y hairline bg-ink2">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex flex-wrap items-center gap-3">
          <p className="gold-kicker">{t.kicker}</p>
          <span className="rounded-full border border-rojo/60 bg-rojo/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#ff8d80]">
            {t.badge}
          </span>
        </div>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-extrabold sm:text-5xl">{t.title}</h2>
        <p className="mt-4 max-w-2xl text-muted">{t.sub}</p>

        <div className="mt-10 rounded-2xl border hairline bg-ink p-5 sm:p-8">
          {done ? (
            <div className="py-10 text-center">
              <div className="font-display mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl font-black text-ink">
                ✓
              </div>
              <h3 className="font-display mt-5 text-3xl font-extrabold">{t.booked}</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.bookedSub}</p>
              <button
                onClick={reset}
                className="font-display mt-6 rounded-full border border-gold px-6 py-3 text-sm font-bold text-gold transition hover:bg-gold hover:text-ink"
              >
                {t.again}
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <p className="mb-3 text-sm font-bold text-goldsoft">{t.pickDay}</p>
                <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDayIdx(i);
                        setSlot(null);
                      }}
                      aria-pressed={dayIdx === i}
                      className={`rounded-xl border px-2 py-3 text-center transition ${
                        dayIdx === i
                          ? "border-gold bg-gold/15 text-cream"
                          : "hairline text-muted hover:border-gold/40 hover:text-cream"
                      }`}
                    >
                      <div className="text-[0.65rem] uppercase tracking-widest">
                        {d.toLocaleDateString(locale, { weekday: "short" })}
                      </div>
                      <div className="font-display text-xl font-extrabold">{d.getDate()}</div>
                    </button>
                  ))}
                </div>
                {day.getDay() === 0 && (
                  <p className="mt-3 text-xs text-muted">{t.closedSun}</p>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-goldsoft">{t.pickTime}</p>
                <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 lg:grid-cols-2">
                  {slots.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSlot(s)}
                      aria-pressed={slot?.key === s.key}
                      className={`rounded-lg border px-2 py-2.5 text-sm transition ${
                        slot?.key === s.key
                          ? "border-gold bg-gold text-ink font-bold"
                          : "hairline text-cream/85 hover:border-gold/40"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-goldsoft">{t.yourInfo}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (slot && name.trim()) setDone(true);
                  }}
                  className="space-y-3"
                >
                  <label className="block text-xs uppercase tracking-widest text-muted">
                    {t.service}
                    <select
                      value={svc}
                      onChange={(e) => setSvc(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border hairline bg-ink2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                    >
                      {t.svcOptions.map((o, i) => (
                        <option key={i} value={i}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-muted">
                    {t.name}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border hairline bg-ink2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-muted">
                    {t.phone}
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      className="mt-1 w-full rounded-lg border hairline bg-ink2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!slot || !name.trim()}
                    className="font-display w-full rounded-full bg-gold px-6 py-3.5 text-sm font-black uppercase tracking-wide text-ink transition enabled:hover:bg-goldsoft disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t.confirm}
                    {slot ? ` · ${slot.label}` : ""}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs italic text-muted">{t.note}</p>
      </div>
    </section>
  );
}
