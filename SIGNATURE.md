# D'sanchez Barbershop — build signature

- **Business:** D'sanchez Barbershop · 299 Park Ave, East Orange, NJ 07017 · (862) 252-7966 · 4.6★ / 258 reviews · no website (Dominican barbershop, 8-9 barbers, walk-in first-available-chair policy, Spanish-speaking staff)
- **Built:** 07-09-2026
- **Signature move (the ONE):** the Guard Dial — an interactive clipper-guard selector (#0 to #4) with radiogroup keyboard semantics; picking a guard animates a 40-tooth taper strip whose tooth heights and lit-gradient respond to the selection, echoing how a barber dials a fade. Original, not from a library; reduced-motion safe.
- **Add-on demo:** booking widget adapted from factory-blueprints/addons/booking-widget (same date -> slot -> contact -> confirmation flow), fully reskinned to the black/gold barbershop language. Static export, so availability is mocked client-side: slots derived deterministically (FNV hash) from the shop's REAL hours (Mon-Thu 7:30a-7:45p, Fri-Sat 7a-7:45p, Sun 7a-3:30p), clearly badged "Demo preview / Vista previa" with an honesty note. Upsell row: salons/barbers — booking w/ deposits $297 + $39/mo, bundle-pitched at the door per UPSELL_MATRIX sequencing law.
- **Language:** `<html lang>` follows a vetted EN/ES toggle (default en; toggle sets document lang). Justified by recon: reviews flag a language barrier for non-Spanish speakers, staff is Spanish-first. All es copy hand-written and vetted, not machine-translated.
- **Design language:** ink black (#0d0a07) + aged gold (#d9a63f) + barber rojo (#c0392b) + cream; Dominican-flag-adjacent pole-stripe rule as section divider; hand-drawn D-with-razor-slash mark (nav + data-URI favicon).

## Arsenal Manifest
- Primary medium: photography — a barbershop must read as chairs, clippers, fades and faces; the craft IS the product, and the clientele (Black + Dominican/Latino East Orange) must see themselves in it.
- Video considered: yes — used: no — no category-correct free footage matched the community (available barber loops skewed white/hipster-European); the interactive Guard Dial carries the motion story with zero bundle cost.   [BUILD_RULES §7]
- Media used (all self-hosted in public/img, EVERY file verified by eye via Read on the downloaded file; rejected 4625626, 33461079 (white clients, community mismatch) and 30547689 (duplicate chair subject)):
  - photo — Pexels 7447151 — Black client getting a clipper lineup, warm gold tones — hero (community + craft in one frame)
  - photo — Pexels 12074386 — fresh skin fade from behind, Latino client — services grid
  - photo — Pexels 7781848 — Latino client, sharp fade + lined beard, barber-pole banner — services grid
  - photo — Pexels 10775080 — B&W clipper-guard taper close-up — services grid (rhymes with the Guard Dial)
  - photo — Pexels 897273 — Latino barber giving the mirror check, real working-shop energy — shop collage
  - photo — Pexels 7697205 — Black barber shaping a client's afro — shop collage
  - photo — Pexels 9703068 — row of red barber chairs (the "8 chairs" story) — shop collage
  - photo — Pexels 18702143 — barber chair + station under shop lights — shop collage
- Motion / WebGL technique: state-driven bar-array transition (CSS transitions only) for the Guard Dial taper strip; IntersectionObserver rise-reveals. No GSAP/Lenis needed; Lighthouse-friendly.
- Custom icons: hand-drawn "D + razor slash" SVG mark, single source (nav component + encoded favicon) — original, no license needed.
- Fontshare pairing: Cabinet Grotesk (display 700/800/900) + Sentient (body 400/400i/500/700) — confirmed not in build_registry.json; distinct from today's siblings (Tanker/General Sans, Clash Display/Satoshi, Boska/Author).
- GPU-verified: n/a — no shader/3D.

## Ship record
- `npm run build` static export ✓ · verified at 375px (no horizontal overflow, EN and ES; nav subtitle hides below sm to keep "Llamar" inside viewport) and desktop
- Repo: github.com/semajzandrews/dsanchez-barbershop (private) · clean sequential commits, no AI attribution
- Vercel: NEW project `dsanchez-barbershop` (no pre-existing .vercel — clobber check passed) → https://dsanchez-barbershop.vercel.app · status REVIEW
