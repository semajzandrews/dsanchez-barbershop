"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import GuardDial from "@/components/GuardDial";
import WalkUp, { WALKUP_EVENT } from "@/components/WalkUp";
import { SERVICES, type ServiceId } from "@/lib/shop";

/**
 * Every book affordance on the page goes through here: a real button that opens
 * the walk-up flow, optionally answering the first blank. Never a phone link,
 * because a control that says book must book. The phone stays beside it as its
 * own action, labelled Call.
 */
function openWalkUp(service?: ServiceId) {
  window.dispatchEvent(new CustomEvent(WALKUP_EVENT, { detail: service }));
}

const TEL = "tel:+18622527966";
const MAP_SRC =
  "https://www.google.com/maps?q=299+Park+Ave,+East+Orange,+NJ+07017&z=16&output=embed";

function Mark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      {/* hand-drawn D + razor notch mark */}
      <rect x="2" y="2" width="36" height="36" rx="9" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
      <path
        d="M13 11h7c5.5 0 9 3.6 9 9s-3.5 9-9 9h-7V11zm5 4.5v9h2c2.9 0 4.6-1.7 4.6-4.5s-1.7-4.5-4.6-4.5h-2z"
        fill="var(--gold)"
      />
      <path d="M8 26l24-14" stroke="var(--rojo)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rise ${className}`}>
      {children}
    </div>
  );
}

export default function Site() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="overflow-x-clip">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b hairline bg-ink/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-lg font-black tracking-tight">
              D&rsquo;SANCHEZ
              <span className="ml-1.5 hidden text-[0.6rem] font-bold uppercase tracking-[0.25em] text-gold sm:inline">
                Barbershop
              </span>
            </span>
          </a>
          <div className="hidden items-center gap-6 text-sm text-cream/80 md:flex">
            <a href="#services" className="hover:text-gold">{t.nav.services}</a>
            <a href="#shop" className="hover:text-gold">{t.nav.shop}</a>
            <button type="button" onClick={() => openWalkUp()} className="hover:text-gold">
              {t.nav.booking}
            </button>
            <a href="#visit" className="hover:text-gold">{t.nav.visit}</a>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="font-display rounded-full border hairline px-3 py-1.5 text-xs font-bold text-cream/85 transition hover:border-gold hover:text-gold"
              aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <a
              href={TEL}
              className="font-display rounded-full bg-gold px-4 py-1.5 text-sm font-black text-ink transition hover:bg-goldsoft"
            >
              {t.nav.call}
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24">
          <div>
            <p className="gold-kicker">{t.hero.kicker}</p>
            <h1 className="font-display mt-4 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
              {t.hero.title1}
              <br />
              <span className="text-gold">{t.hero.title2}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">{t.hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openWalkUp()}
                className="font-display rounded-full bg-gold px-7 py-4 text-sm font-black uppercase tracking-wide text-ink shadow-[0_10px_40px_rgba(217,166,63,0.25)] transition hover:bg-goldsoft"
              >
                {t.hero.cta}
              </button>
              <a href={TEL} className="font-display text-sm font-bold text-cream/85 underline decoration-gold decoration-2 underline-offset-8 hover:text-gold">
                {t.hero.cta2}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
              <span>★ {t.hero.rating}</span>
              <span>{t.hero.open7}</span>
            </div>
          </div>
          <Reveal>
            <div className="img-frame aspect-[4/5] rotate-1">
              <Image
                src="/img/hero-lineup.jpg"
                alt="Barber giving a client a precise lineup with clippers"
                fill
                priority
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
        <div className="pole-rule mx-auto max-w-6xl" />
      </section>

      {/* Signature: Guard Dial */}
      <GuardDial lang={lang} />

      {/* Services */}
      <section id="services" className="border-t hairline bg-ink2">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="gold-kicker">{t.services.kicker}</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">{t.services.title}</h2>
          <p className="mt-4 max-w-xl text-muted">{t.services.sub}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((svc, i) => {
              const s = t.services.items[svc.id];
              return (
                <Reveal key={svc.id}>
                  <div className="flex h-full flex-col rounded-2xl border hairline bg-ink p-6 transition hover:border-gold/40">
                    <div className="font-display text-sm font-black text-rojo">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="font-display mt-2 text-xl font-extrabold">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                    <button
                      type="button"
                      onClick={() => openWalkUp(svc.id)}
                      className="font-display mt-5 self-start rounded-full border border-gold/60 px-4 py-2 text-xs font-black uppercase tracking-wide text-gold transition hover:bg-gold hover:text-ink"
                    >
                      {t.services.pick}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Reveal className="img-frame aspect-[4/5]">
              <Image src="/img/fade-back.jpg" alt="Fresh skin fade seen from behind" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
            </Reveal>
            <Reveal className="img-frame aspect-[4/5]">
              <Image src="/img/skinfade-profile.jpg" alt="Client with a sharp fade and lined beard, barber pole behind" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
            </Reveal>
            <Reveal className="img-frame aspect-[4/5]">
              <Image src="/img/guard-bw.jpg" alt="Clipper guard shaping a taper, black and white close-up" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Shop */}
      <section id="shop" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="gold-kicker">{t.shop.kicker}</p>
            <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">{t.shop.title}</h2>
            <p className="mt-5 text-muted">{t.shop.p1}</p>
            <p className="mt-4 text-muted">{t.shop.p2}</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {t.shop.stats.map((s, i) => (
                <div key={i} className="rounded-xl border hairline bg-ink2 p-4 text-center">
                  <div className="font-display text-3xl font-black text-gold">{s.n}</div>
                  <div className="mt-1 text-xs text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Reveal className="img-frame aspect-[3/4] -rotate-1">
              <Image src="/img/mirror-check.jpg" alt="Barber showing a client the finished cut in a hand mirror" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </Reveal>
            <Reveal className="img-frame mt-8 aspect-[3/4] rotate-1">
              <Image src="/img/afro-client.jpg" alt="Barber shaping a client's afro in a bright shop" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </Reveal>
            <Reveal className="img-frame aspect-[3/4] rotate-1">
              <Image src="/img/red-chairs.jpg" alt="Row of red barber chairs at the stations" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </Reveal>
            <Reveal className="img-frame mt-8 aspect-[3/4] -rotate-1">
              <Image src="/img/chair-dark.jpg" alt="Barber chair and station under the shop lights" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The walk-up */}
      <WalkUp lang={lang} />

      {/* Visit */}
      <section id="visit" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <p className="gold-kicker">{t.visit.kicker}</p>
        <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">{t.visit.title}</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-lg text-cream/90">{t.visit.addr}</p>
            <p className="mt-2 text-sm font-medium text-gold">{t.visit.walkIns}</p>
            <h3 className="font-display mt-8 text-sm font-black uppercase tracking-[0.2em] text-goldsoft">
              {t.visit.hoursTitle}
            </h3>
            <dl className="mt-3 space-y-2">
              {t.visit.hours.map(([d, h], i) => (
                <div key={i} className="flex justify-between border-b hairline pb-2 text-sm">
                  <dt className="text-muted">{d}</dt>
                  <dd className="text-cream/90">{h}</dd>
                </div>
              ))}
            </dl>
            <a
              href={TEL}
              className="font-display mt-8 inline-block rounded-full bg-gold px-7 py-4 text-sm font-black uppercase tracking-wide text-ink transition hover:bg-goldsoft"
            >
              {t.visit.call}
            </a>
          </div>
          <div className="map-frame" style={{ height: "clamp(320px, 42vw, 460px)" }}>
            <iframe
              title="D'sanchez Barbershop location, 299 Park Ave, East Orange, NJ 07017"
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t hairline bg-ink2">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Mark />
            <div>
              <div className="font-display font-black">D&rsquo;SANCHEZ BARBERSHOP</div>
              <div className="text-xs text-muted">{t.footer.tag}</div>
            </div>
          </div>
          <div className="text-sm text-muted">
            <a href={TEL} className="hover:text-gold">(862) 252-7966</a>
            <span className="mx-2">·</span>
            299 Park Ave, East Orange, NJ
          </div>
        </div>
        <div className="border-t hairline py-4 text-center text-xs text-muted">
          {t.footer.builtBy}{" "}
          <a href="https://bysemaj.com" className="font-semibold text-gold hover:text-goldsoft">
            bysemaj.com
          </a>
        </div>
      </footer>

      {/* Mobile call pill */}
      <a
        href={TEL}
        aria-label="Call D'sanchez Barbershop at (862) 252-7966"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
        </svg>
      </a>
    </div>
  );
}
