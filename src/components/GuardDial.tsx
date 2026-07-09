"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

/**
 * Signature move: the Guard Dial.
 * An interactive clipper-guard selector (#0 to #4). Picking a guard animates a
 * "taper strip" whose tooth height and hair-length gradient respond to the
 * selection, echoing how a barber dials a fade. Radiogroup semantics, keyboard
 * navigable, reduced-motion safe (pure CSS transitions).
 */
export default function GuardDial({ lang }: { lang: Lang }) {
  const t = copy[lang].guard;
  const [sel, setSel] = useState(2);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(4, s + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    }
  };

  const active = t.names[sel];

  return (
    <section id="guard" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <p className="gold-kicker">{t.kicker}</p>
      <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">{t.title}</h2>
      <p className="mt-4 max-w-xl text-muted">{t.sub}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p id="guard-label" className="mb-3 text-sm font-medium text-goldsoft">
            {t.pick}
          </p>
          <div
            role="radiogroup"
            aria-labelledby="guard-label"
            onKeyDown={onKey}
            className="flex gap-2 sm:gap-3"
          >
            {t.names.map((n, i) => (
              <button
                key={n.g}
                role="radio"
                aria-checked={sel === i}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
                className={`font-display flex h-14 w-14 items-center justify-center rounded-xl border text-xl font-extrabold transition-all duration-300 sm:h-16 sm:w-16 sm:text-2xl ${
                  sel === i
                    ? "border-gold bg-gold text-ink shadow-[0_0_28px_rgba(217,166,63,0.35)]"
                    : "hairline border bg-ink2 text-muted hover:border-gold/50 hover:text-cream"
                }`}
              >
                {n.g}
              </button>
            ))}
          </div>

          <div className="mt-6 min-h-24" aria-live="polite">
            <h3 className="font-display text-2xl font-extrabold text-cream">
              #{active.g} · {active.name}
            </h3>
            <p className="mt-2 max-w-md text-muted">{active.desc}</p>
          </div>
        </div>

        {/* taper strip visual */}
        <div className="rounded-2xl border hairline bg-ink2 p-6 sm:p-8" aria-hidden="true">
          <div className="flex h-40 items-end gap-[3px] sm:h-48">
            {Array.from({ length: 40 }).map((_, i) => {
              // teeth grow from left (skin) to right (top length); selection scales the curve
              const base = (i / 39) ** 1.6;
              const h = 6 + base * (18 + sel * 26);
              const lit = i / 39 <= (sel + 1) / 5;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${h}%`,
                    background: lit ? "var(--gold)" : "rgba(217,166,63,0.18)",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            <span>skin</span>
            <span>#{active.g}</span>
            <span>crown</span>
          </div>
        </div>
      </div>
    </section>
  );
}
