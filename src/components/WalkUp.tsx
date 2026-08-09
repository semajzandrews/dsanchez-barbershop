"use client";

/**
 * D'SANCHEZ BARBERSHOP: the walk-up.
 *
 * SPINE (shared across every build): service -> when -> who -> confirm.
 *
 * ORGANIZING IDEA (this shop only): D'sanchez has no appointment book. Eight to
 * nine barbers cut at once and the house rule, printed on this very page, is
 * first available chair. So this is not a reservation and it does not pretend to
 * be one. It is the thing a regular already does: he calls the shop and SAYS a
 * sentence. "I'm coming in for a lineup on Thursday around 10:15."
 *
 * The interface IS that sentence. One line of display type across the section
 * with three blanks in it, each blank a real button. Tap a blank, the drawer
 * under the sentence opens to fill it, the sentence rewrites itself, and what
 * you are sending is legible as a plain English (or plain Spanish) statement
 * before you ever send it. Spanish is not the English sentence with the words
 * swapped: the segments are separate strings, so the Spanish line reads in
 * Spanish word order.
 *
 * Deliberately NOT the chair metaphor (cleancuts), the paper ticket (desir),
 * the next-available ladder (orange nails), the seat stack (mikauri), the live
 * lacquer (first class), the day rail (mamie) or the lookbook (sisters).
 *
 * HONESTY, which is the point of the rewrite:
 *   - No availability is fabricated. Nothing is dropped, greyed out or called
 *     taken. Every time inside the shop's posted hours is offered, because the
 *     shop has never told this site otherwise.
 *   - A time is only withheld when the shop is closed then, when it is already
 *     past, or when the chair allowance would run past closing.
 *   - Nothing is persisted and nothing is sent to a third party. The copy says
 *     plainly that the shop confirms and that no chair is held.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import {
  DAYS_AHEAD,
  SERVICES,
  type ServiceId,
  byId,
  dayKey,
  fmtClock,
  formatPhone,
  hoursFor,
  isPhoneComplete,
  startsFor,
  upcomingDays,
} from "@/lib/shop";

type Blank = "service" | "day" | "time" | null;

export const WALKUP_EVENT = "dsanchez:walkup";

export default function WalkUp({ lang }: { lang: Lang }) {
  const t = copy[lang].booking;
  const menu = copy[lang].services.items;

  /* The day list depends on the real clock, so it is built after mount. The
     static export is prerendered at build time and would otherwise hydrate
     against a stale "today". */
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const [blank, setBlank] = useState<Blank>("service");
  const [svc, setSvc] = useState<ServiceId | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const days = useMemo(
    () => (now ? upcomingDays(DAYS_AHEAD, now) : []),
    [now]
  );
  const chosenDay = useMemo(
    () => days.find((d) => dayKey(d) === day) ?? null,
    [days, day]
  );
  const starts = useMemo(
    () =>
      chosenDay && svc && now ? startsFor(chosenDay, byId(svc).chairMin, now) : [],
    [chosenDay, svc, now]
  );

  /* Every book affordance on the page dispatches this, optionally with a
     service id, so a control that says "I want this" opens the flow already
     answering the first blank. */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent).detail as ServiceId | undefined;
      if (id && SERVICES.some((s) => s.id === id)) {
        setSvc(id);
        setTime(null);
        setBlank("day");
      } else {
        setBlank("service");
      }
      setSent(false);
      const go = () =>
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      go();
      window.setTimeout(go, 500);
    };
    window.addEventListener(WALKUP_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(WALKUP_EVENT, onOpen as EventListener);
  }, []);

  /* A shorter service can start later than a longer one, so changing the
     service can strand a time that no longer fits before close. Drop it. */
  useEffect(() => {
    if (time !== null && !starts.includes(time)) setTime(null);
  }, [starts, time]);

  const dayLong = (d: Date) => {
    const wd = t.weekdaysLong[d.getDay()];
    const mo = t.monthsShort[d.getMonth()];
    return lang === "es"
      ? `${wd} ${d.getDate()} de ${mo}`
      : `${wd}, ${mo} ${d.getDate()}`;
  };

  /* What each blank reads as. The prefix belongs to the phrase, not the
     sentence, so Spanish gets "el domingo 2 de ago" and "a eso de las 10:00 AM"
     while English gets the bare value with its connector outside. */
  const dayText = chosenDay ? `${t.fill.day}${dayLong(chosenDay)}` : null;
  const timeText = time !== null ? `${t.fill.time}${fmtClock(time)}` : null;
  const svcText = svc ? menu[svc].name : null;

  const dayBadge = (d: Date) => {
    if (!now) return null;
    if (dayKey(d) === dayKey(now)) return t.today;
    const tm = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (dayKey(d) === dayKey(tm)) return t.tomorrow;
    return null;
  };

  const complete =
    svc !== null &&
    time !== null &&
    chosenDay !== null &&
    name.trim().length > 1 &&
    isPhoneComplete(phone);

  const reset = () => {
    setSent(false);
    setSvc(null);
    setDay(null);
    setTime(null);
    setName("");
    setPhone("");
    setBlank("service");
  };

  /* ---------------- the sentence ---------------- */

  const Slot = ({
    which,
    filled,
    placeholder,
  }: {
    which: Exclude<Blank, null>;
    filled: string | null;
    placeholder: string;
  }) => (
    <button
      type="button"
      onClick={() => setBlank(blank === which ? null : which)}
      aria-expanded={blank === which}
      className={`walkup-slot ${filled ? "is-filled" : ""} ${
        blank === which ? "is-open" : ""
      }`}
    >
      {filled ?? placeholder}
    </button>
  );

  return (
    <section id="booking" ref={rootRef} className="border-y hairline bg-ink2">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <p className="gold-kicker">{t.kicker}</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-extrabold sm:text-5xl">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{t.sub}</p>

        <div className="mt-10 rounded-2xl border hairline bg-ink p-5 sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <div className="font-display mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl font-black text-ink">
                ✓
              </div>
              <h3 className="font-display mt-5 text-3xl font-extrabold">{t.sent}</h3>
              <p className="font-display mx-auto mt-4 max-w-xl text-lg text-gold">
                {t.line.a} {svcText} {t.line.b ? `${t.line.b} ` : ""}
                {dayText} {t.line.c ? `${t.line.c} ` : ""}
                {timeText}
                {t.line.d}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted">{t.sentSub}</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="font-display rounded-full border border-gold px-6 py-3 text-sm font-bold text-gold transition hover:bg-gold hover:text-ink"
                >
                  {t.again}
                </button>
                <a
                  href="tel:+18622527966"
                  className="font-display rounded-full px-4 py-3 text-sm font-bold text-cream/80 underline decoration-gold decoration-2 underline-offset-8 hover:text-gold"
                >
                  {t.callInstead}
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* The sentence */}
              <p className="font-display text-2xl font-extrabold leading-[1.45] tracking-tight text-cream sm:text-4xl sm:leading-[1.4]">
                {t.line.a}{" "}
                <Slot which="service" filled={svcText} placeholder={t.blank.service} />{" "}
                {t.line.b ? `${t.line.b} ` : ""}
                <Slot which="day" filled={dayText} placeholder={t.blank.day} />{" "}
                {t.line.c ? `${t.line.c} ` : ""}
                <Slot which="time" filled={timeText} placeholder={t.blank.time} />
                {t.line.d}
              </p>

              <div className="pole-rule mt-7 opacity-60" />

              {/* The drawer that fills whichever blank is open */}
              <div className="mt-7 min-h-[9rem]">
                {blank === "service" && (
                  <div>
                    <p className="mb-3 text-sm font-bold text-goldsoft">
                      {t.pickService}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {SERVICES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSvc(s.id);
                            setBlank(day ? "time" : "day");
                          }}
                          aria-pressed={svc === s.id}
                          className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                            svc === s.id
                              ? "border-gold bg-gold/15 text-cream"
                              : "hairline text-cream/85 hover:border-gold/40"
                          }`}
                        >
                          {menu[s.id].name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {blank === "day" && (
                  <div>
                    <p className="mb-3 text-sm font-bold text-goldsoft">{t.pickDay}</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {days.map((d) => {
                        const k = dayKey(d);
                        const badge = dayBadge(d);
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              setDay(k);
                              setTime(null);
                              setBlank("time");
                            }}
                            aria-label={dayLong(d)}
                            aria-pressed={day === k}
                            className={`rounded-xl border px-2 py-3 text-center transition ${
                              day === k
                                ? "border-gold bg-gold/15 text-cream"
                                : "hairline text-muted hover:border-gold/40 hover:text-cream"
                            }`}
                          >
                            <div className="text-[0.6rem] uppercase tracking-widest">
                              {badge ?? t.weekdaysShort[d.getDay()]}
                            </div>
                            <div className="font-display text-xl font-extrabold">
                              {d.getDate()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {blank === "time" && (
                  <div>
                    <p className="mb-3 text-sm font-bold text-goldsoft">
                      {t.pickTime}
                    </p>
                    {!svc || !chosenDay ? (
                      <p className="text-sm text-muted">{t.gate}</p>
                    ) : starts.length === 0 ? (
                      <p className="text-sm text-muted">{t.noTimes}</p>
                    ) : (
                      <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-6">
                        {starts.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setTime(m);
                              setBlank(null);
                            }}
                            aria-pressed={time === m}
                            className={`rounded-lg border px-2 py-2.5 text-sm transition ${
                              time === m
                                ? "border-gold bg-gold font-bold text-ink"
                                : "hairline text-cream/85 hover:border-gold/40"
                            }`}
                          >
                            {fmtClock(m)}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted">
                      {t.timeNote}
                      {chosenDay && chosenDay.getDay() === 0 ? ` ${t.sunNote}` : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Who */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (complete) setSent(true);
                }}
                className="mt-6 grid gap-3 border-t hairline pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
              >
                <label className="block text-xs uppercase tracking-widest text-muted">
                  {t.name}
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-label={t.name}
                    className="mt-1 w-full rounded-lg border hairline bg-ink2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                  />
                </label>
                <label className="block text-xs uppercase tracking-widest text-muted">
                  {t.phone}
                  <input
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label={t.phone}
                    placeholder="(862) 252-7966"
                    className="mt-1 w-full rounded-lg border hairline bg-ink2 px-3 py-2.5 text-sm text-cream outline-none placeholder:text-muted/50 focus:border-gold"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!complete}
                  className="font-display w-full rounded-full bg-gold px-6 py-3.5 text-sm font-black uppercase tracking-wide text-ink transition enabled:hover:bg-goldsoft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t.send}
                </button>
                <p className="text-xs leading-relaxed text-muted">
                  {complete
                    ? t.sentSub
                    : svc && chosenDay && time !== null
                      ? t.gateWho
                      : t.gate}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
