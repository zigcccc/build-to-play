# Build 2 Play — website build handoff

Website for **Build 2 Play**, a Slovenian personal and sports trainer (male, solo business). The site is in **Slovenian**, written in the informal "ti" form, and the trainer speaks in first person ("Prejel sem", "Odgovorim").

**Goal: conversion = contact.** Every page pushes toward the free consultation ("Brezplačen posvet") or the contact form. Most traffic is mobile, so build mobile-first; desktop must still look premium.

This folder is the single source of truth: designs, design system, assets. Read this file fully before writing code.

---

## 0. Folder map

| Path | What |
|---|---|
| `design/*.dc.html` | Pixel-level designs, one file per page/flow (HTML + inline CSS + small template syntax, see §2) |
| `design/canvas.json` | Board index: which file is which page, desktop vs mobile, intended frame sizes |
| `design-system/README.md` | Brand rules (voice, color usage, type, do/don't). **Binding.** |
| `design-system/tokens.json` | Source tokens (color incl. light/dark modes, type scale, spacing, radius) |
| `design-system/tokens.css` | Same tokens as CSS custom properties (dark = default theme) |
| `assets/logo/` | Logo SVGs: mark, horizontal, wordmark, in all color variants |
| `assets/icons/` | Favicons (svg + png 16–512), apple-touch-icon, app icon, profile picture |
| `assets/images/hero-suspension-row.jpg` | Home hero photo (temporary stock, Unsplash; replace after the photo shoot) |

---

## 1. Stack

Fixed by the client/designer:

- **Icons: Lucide** (`lucide-react` or equivalent). Always render with `strokeWidth={1.75}`, `strokeLinecap="square"`, `strokeLinejoin="miter"`. This matches the designs.
- **UI primitives: shadcn/ui** as the base (Dialog, Sheet, AlertDialog, Accordion, Tabs, RadioGroup, Toggle/ToggleGroup, Switch, Checkbox, NavigationMenu, Sonner/Toast). **Restyle everything** to the design system: square corners, gold accent, no default shadcn look.
- **CMS-driven copy.** The client must be able to edit text, prices, programs, FAQs and articles without a developer.

> **DECIDE BEFORE STARTING (ask the human if not specified in the prompt):**
> - **Framework.** Suggested default: Next.js (App Router, RSC, static generation) + Tailwind CSS v4 + TypeScript.
> - **CMS.** Suggested default: Sanity, because its hosted Studio is friendly for a non-technical client and it has a free tier. Alternatives: Payload (self-hosted, needs a DB) or Keystatic (git-based, awkward for non-devs).
> - **Form delivery.** Suggested default: a server action that sends an e-mail via Resend, plus a copy to the sender.
> - **Hosting.** Suggested default: Vercel.
> - **Analytics.** Only behind cookie consent (see §6.5).

---

## 2. How to read the `.dc.html` design files

These are design-canvas files. Treat them as **a precise visual and behavioral spec, not as code to ship**.

- Markup lives inside `<x-dc>…</x-dc>`. `<helmet>` holds fonts and the page's `<style>` block (classes, hover/focus, media queries). Most layout is inline `style=""`. Port values faithfully (sizes, spacing, colors, breakpoints).
- `{{name}}` = a value computed in the `<script type="text/x-dc">` class at the bottom (`renderVals()` returns them). This script is the **behavior spec**: state, steps, toggles, validation.
- `<sc-for each="{{list}}" as="item">` = loop. `<sc-if value="{{cond}}">` = conditional.
- `<dc-import name="Header" active="cenik">` = include the component file `Header.dc.html` with props. The `Header` and `Footer` files are the shared layout.
- `data-props` on the script = component props (e.g. `Program.dc.html` takes `program: fitnes|sport|online`; `Posvet.dc.html` takes `step` and `confirm`).
- `href="Something.dc.html"` = an internal link. Map it to real routes using §3.
- `/_blob/<id>` = an uploaded asset:
  - `/_blob/19a2174686e7d4a5c509876d423eb7ef` → `assets/logo/build2play--horizontal--full-color-dark.svg` (the designs used a PNG export of the same logo; use the SVG)
  - `/_blob/a8ba7fc4a25f1599de4274060a07a099` → `assets/images/hero-suspension-row.jpg` (rendered with `object-position: 40% 35%; transform: scaleX(-1)`)
- Files ending `-m.dc.html` are **390 px mobile previews** that just import the desktop file at phone width. The real responsive CSS is in the desktop file's media queries. Build ONE responsive page per route, and use `-m` files only to verify the mobile result.
- `Posvet-2/3/4/Zapri`, `Cookies-Nastavitve`, etc. are the same component frozen at a given state (props), so you can see every step.
- Ignore: `support.js`, `$preview`, `hint-size`, the `DCLogic` base class, `canvas.json` coordinates.
- Placeholder copy is in `[SQUARE BRACKETS]` (`[Cena]`, `[ROK]`, `[Mesto]`, `[Ime lokacije 1]`, `[info@domena.si]`, …). These become **CMS fields / site settings**, never hard-coded.

---

## 3. Routes

| Route | Design file(s) | Notes |
|---|---|---|
| `/` | `Main.dc.html` (+ `Mobile.dc.html`) | Hero, programs, results tabs, pricing teaser, about teaser, locations, contact form, socials |
| `/o-meni` | `OMeni.dc.html` | About the trainer, credentials, approach |
| `/programi/fitnes` | `Program.dc.html` (`program="fitnes"`) | One template, three programs. All program data is in `renderVals()`. |
| `/programi/sport` | `Program-Sport.dc.html` | same template |
| `/programi/online` | `Program-Online.dc.html` | same template |
| `/cenik` | `Cenik.dc.html` | Tabs per program, 0 € consultation card, conditions, FAQ |
| `/nasveti` | `Nasveti.dc.html` | Article list, category filter, empty state |
| `/nasveti/[slug]` | `Clanek.dc.html` | Article: cover, sticky ToC (static ≤900 px), share, related, CTA |
| `/kontakt` | `Kontakt.dc.html`, `KontaktStanja.dc.html` | Form plus all 4 form states, map, locations, contacts |
| `/politika-zasebnosti` | `Pravno.dc.html` | Legal text is a placeholder; a lawyer must supply it |
| 404 | `NotFound.dc.html` | |
| Booking flow (overlay, no route; optionally `?posvet=1` deep link) | `Posvet*.dc.html` | Modal ≥641 px, bottom sheet ≤640 px |
| Cookie consent (overlay) | `Cookies*.dc.html` | Banner + settings dialog + saved toast |

Every "Brezplačen posvet" CTA (header, hero, footer, mobile bar, program pages, pricing) **opens the booking flow overlay**. In the designs it links to `Posvet.dc.html`.

**Known dead links to wire up:**
- Home program cards' "Več o programu" (`Main.dc.html`, three `href="#"`) → `/programi/fitnes|sport|online`.
- Home testimonials "Več mnenj" has no destination yet (no reviews page in v1). Point it to a CMS-configurable URL (e.g. Google reviews) or hide it when empty.
- Consent checkbox "politiko zasebnosti" → `/politika-zasebnosti`.
- Location "navodila za pot" → Google Maps directions URL from CMS.
- Social links (Header mobile menu, Footer, Posvet success, Clanek share) → from site settings.
- Footer "Nastavitve piškotkov" → reopens the cookie settings dialog (not a page).
- `tel:+386` → phone number from site settings.

---

## 4. Design system essentials

Read `design-system/README.md`; it wins over anything here.

- **Dark theme only for the site** (black `#040506` page, `#161616` surfaces, white ink, gold `#b39a72` accent). Light tokens exist in `tokens.css` but the site does not use them.
- **Square corners everywhere** (`radius-0`). No pill buttons, no rounded cards.
- **Type:**
  - Barlow Condensed 600/700, UPPERCASE, for display and headings.
  - Inter 400–700 for everything else.
  - Labels/eyebrows: 12 px / 500 / `letter-spacing: .25em` / uppercase.
  - Buttons: 12–13 px / 700 / `.14em` / uppercase.
  - Nav items: lowercase, 15 px / 400.
  - Self-host the fonts via `next/font` or equivalent.
  - Eurostile is **logo-only**. Never use it for text.
- **Gold** is for primary CTAs, focus rings, small accents. Do not flood surfaces with it.
- **Danger tokens** (`--danger`, `--danger-border`, `--danger-surface`): form errors and send-failure alerts only.
- **Two values used in designs but not yet tokenized.** Add them as tokens:
  - `--control-border: #6b6862` — input and outline-button borders; meets 3:1 non-text contrast.
  - `--accent-hover: #bea987` — gold button hover.
- Focus: `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`.
- Touch targets ≥ 44 px; primary mobile CTAs are full-width, 52–56 px high.
- Breakpoints used in designs: **≤900 px** (header collapses to burger, mobile CTA bar appears, ToC goes static) and **≤640 px** (dialogs become bottom sheets). There are also some fluid `clamp()` values; keep them.
- Header: fixed, plain `backdrop-filter: blur(16px)` over `rgba(4,5,6,.6)`, hairline bottom border. **No liquid glass, no sheen effects** (explicitly rejected by the client).

---

## 5. Shared components

**Header** (`Header.dc.html`)
- Logo at 32 px height.
- Nav: `o meni`, `programi` (mega dropdown with 3 program cards → use NavigationMenu), `cenik`, `nasveti`, `kontakt`.
- `aria-current="page"` on the active item.
- Gold CTA "Brezplačen posvet".
- ≤900 px: CTA hidden, burger → full-screen mobile menu (with socials).

**Footer** (`Footer.dc.html`)
- 4 columns: logo + "Train. Build. Perform.", Programi, Build 2 Play, Sledi (socials + CTA).
- Bottom row: © line + legal links.

**Mobile CTA bar** (inside Footer)
- ≤900 px only: fixed bottom, blurred, holds a gold "Brezplačen posvet" button and a phone icon button.
- **Hidden while the hero is in view.** Slide it in after `scrollY > innerHeight * 0.8` (implement with IntersectionObserver on the hero rather than a scroll listener). Slide it out (`translateY(130%)`) when the hero is visible again.
- Reserve bottom padding (112 px) in the footer so the bar never covers content.

---

## 6. Flows and interactive behavior

### 6.1 Booking: "Brezplačen posvet" (`Posvet.dc.html`)

An **inquiry**, not live booking. There is no calendar in this iteration.

- **Container:** Dialog on desktop; Sheet from bottom ≤640 px.
- **Progress:** 3-segment progress bar; back/next buttons.

1. **Cilj**
   - Goal is a required single-select set of radio cards: "Več moči in boljša forma", "Priprava na šport ali sezono", "Izguba telesne mase in zdrav življenjski slog", "Vrnitev po poškodbi ali daljšem premoru", "Nekaj drugega".
   - Program chips (single select): Ne vem še, Fitnes, Šport, Online.
   - "Naprej" stays disabled until a goal is chosen.
   - Pre-select the program when the flow is opened from a program page.
2. **Termin**
   - Mode: V živo / Video klic. "V živo" reveals a location choice.
   - Preferred days (multi toggle, Pon–Sob).
   - Times (multi toggle: Dopoldne / Popoldne / Zvečer).
   - Days and times are optional; an empty selection means "Kadarkoli".
3. **Podatki**
   - Name, e-mail, phone, optional message, consent checkbox.
   - Same validation as §6.3.
   - Submit button: "Pošlji povpraševanje".
4. **Potrditev**
   - Success screen with a summary (goal, mode, when), next-steps copy, socials.

**Closing mid-flow** (X, Esc, overlay click on steps 1–3) → AlertDialog "Zapri?" with options to stay or discard (`Posvet-Zapri.dc.html`). On step 4, close without confirmation and reset the state.

The submission e-mails the trainer all the answers and sends a confirmation to the user.

### 6.2 Contact form (`/` and `/kontakt`)

- **Fields:**
  - `ime` *, `email` *, `telefon`, `sporocilo` *, `soglasje` * (checkbox).
  - `/kontakt` also has `zadeva` (subject select).
- **The 4 states in `KontaktStanja.dc.html`:**
  1. Field errors: summary alert + inline messages + `aria-invalid`.
  2. Sending: fields disabled, spinner, "Pošiljam …".
  3. Success: "Hvala, prejel sem." + "Pošlji novo sporočilo".
  4. Send failure: alert with mailto fallback; data stays in the fields.

### 6.3 Validation rules

- Validate **on submit**, then **live on each corrected field**.
- Move focus to the first invalid field.
- Error copy is exactly as in the designs (e.g. "Vpiši ime in priimek.", "E-poštni naslov ni pravilen.", "Za pošiljanje potrebujem tvoje soglasje.").
- Validate on the server too, and add spam protection: honeypot + rate limit, or Turnstile. A CAPTCHA must not be visible by default.

### 6.4 Accordions, tabs, filters

- **FAQ:** shadcn Accordion, single open item.
- **Home results:** Tabs.
- **Pricing:** Tabs per program. The "featured" package is visually emphasized.
- **On mobile**, the pricing "contact" CTA sits **below all packages**, not above them (explicit client feedback).
- **Article categories:** filter chips with `aria-pressed`, plus an empty state.

### 6.5 Cookie consent (`Cookies.dc.html`)

- **Banner:** "Zavrni vse" and "Sprejmi vse" have **equal visual weight** (a legal requirement), plus "Nastavitve".
- **Settings dialog:**
  - Nujni (always on, disabled switch).
  - Analitika (switch).
  - Zunanje vsebine (switch; covers the Google Maps / Instagram embeds).
  - Save button.
- A toast appears after saving.
- Persist the choice (cookie/localStorage `b2p_consent`, with a version).
- **Load nothing non-essential before consent.** Without "Zunanje vsebine", the map must not load. This state is **not designed**: show a placeholder of the same size (surface `#161616`, hairline border, Lucide `map-pin`, a short line of text and an outline button that opens cookie settings).
- The footer link reopens the settings dialog.

---

## 7. CMS content model (minimum)

- **siteSettings**
  - Contact: phone, e-mail, address(es), response time `[ROK]`, social URLs.
  - Company: legal name / VAT.
  - Defaults: default SEO, OG image.
- **location**
  - Fields: name, address, city, mapsUrl, order.
- **program** (3 docs: fitnes, sport, online)
  - Identity: slug, title, short intro, hero copy, who-it's-for bullets, how-it-works steps.
  - Relations: packages (ref), FAQs (ref), SEO.
- **package**
  - Fields: program ref, name, price `[Cena]`, unit/period, duration `[TRAJANJE]`, features[], featured (bool), order.
- **faq**
  - Fields: question, answer (rich text), scope (home / pricing / program).
- **pricingConditions** — rich text.
- **article**
  - Content: title, slug, category ref, excerpt, cover image, body (portable/rich text with H2s → ToC).
  - Meta: reading time (computed), published date, author, SEO.
- **category** — title, slug.
- **page singletons:**
  - home: hero, results (tabs content), about teaser, CTA texts.
  - about: bio, credentials list `[Naziv izobrazbe ali licence]`, `[Ustanova]`, `[Leto]`.
  - legal (privacy policy body).
- **testimonial** (optional, for the results section) — name, sport/role, quote, result metric.

Read every page's placeholders and repeated blocks to make sure each one maps to a field. Seed the CMS with the design copy.

---

## 8. SEO, performance, accessibility

- **SEO**
  - `lang="sl"` and per-page title/description from the CMS; OG images.
  - `sitemap.xml`, `robots.txt`.
  - JSON-LD `LocalBusiness`/`SportsActivityLocation` + `Person`; `Article` for posts.
- **Performance**
  - Static generation with on-demand revalidation from CMS webhooks.
  - Images through an optimized image component (AVIF/WebP, correct `sizes`).
  - The hero image is the LCP element, so give it `priority`/preload.
- **Accessibility:** WCAG 2.2 AA.
  - Visible focus.
  - Dialogs trap focus and return it to the trigger.
  - `aria-current` in nav; `role="switch"` for toggles.
  - Respect `prefers-reduced-motion`.
- Favicons and the manifest come from `assets/icons/`.

---

## 9. Out of scope / open items (do not invent)

- **Real photos:** a photo shoot is pending. Use the hero JPG plus neutral placeholders as in the designs. Never use before/after body photos (explicit client decision).
- **Legal text:** the privacy policy is a placeholder until the client's lawyer supplies it.
- **Not in v1:** a results/case-study page and a live booking calendar.
- **Copy:** final copy comes via the CMS. Keep the design copy as seed data.

---

## 10. Acceptance checklist

- [ ] Every route in §3 matches its design at 390 px and 1440 px. Compare against the `-m` and desktop files side by side; Playwright screenshots are recommended.
- [ ] No horizontal scroll at 360–1920 px.
- [ ] Header dropdown, burger menu, mobile CTA bar (hidden over hero) work.
- [ ] Booking flow: all 4 steps, validation, close-confirm, modal ↔ sheet at 640 px, submission delivers e-mail.
- [ ] Contact form: all 4 states reachable; server validation; spam protection.
- [ ] Cookie consent blocks maps/analytics until accepted; settings reopen from footer.
- [ ] Every `[placeholder]` comes from the CMS; client can edit programs, packages, prices, FAQs, articles.
- [ ] Lighthouse mobile ≥ 90 on all four categories; axe shows no serious violations.
- [ ] Only design-system tokens used (plus the two added in §4); Lucide icons with square caps; square corners.
