---
name: verify-against-design
description: Visually compare a Build 2 Play route with its design file in docs/handoff/design at 390 px and 1440 px using Claude in Chrome. Use after building or changing a page or shared component.
---

# Verify a route against the design

The designs are `docs/handoff/design/*.dc.html` (see `docs/handoff/HANDOFF.md` §2 for the format and §3 for the route ↔ file map).

| Route | Desktop file | Mobile file |
|---|---|---|
| `/` | Main | Mobile |
| `/o-meni` | OMeni | OMeni-m |
| `/programi/fitnes`, `/programi/sport`, `/programi/online` | Program (`program` prop) | Program-m |
| `/cenik` | Cenik | Cenik-m |
| `/nasveti` | Nasveti | Nasveti-m |
| `/nasveti/[slug]` | Clanek | Clanek-m |
| `/kontakt` | Kontakt, KontaktStanja (form states) | Kontakt-m |
| `/politika-zasebnosti` | Pravno | Pravno-m |
| 404 | NotFound | NotFound-m |
| Overlays | Posvet\*, Cookies\* | Posvet\*, Cookies\* |

## Steps

1. Make sure `pnpm dev` is running (web on :3000).
2. Load the Chrome tools with a single ToolSearch call, then create a new tab.
3. Check the route at both widths with `resize_window`:
   - **390×844**: no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), the burger and mobile CTA bar show, and dialogs are bottom sheets.
   - **1440×900**: the container is 1280 wide, the header dropdown works, and the ToC is sticky.
4. Read the design file's inline styles and media queries for the section you're checking, and compare spacing, type sizes (`clamp()` values), colours and borders. The `.dc.html` files can't be served as-is, so compare against the markup and CSS, not a render.
5. Check the details the designs care about:
   - square corners everywhere except chips and badges
   - gold only on CTAs and accents
   - Lucide icons with square caps
   - a visible gold focus ring when tabbing through
   - `aria-current` in the nav
6. Fix the differences, then re-check both widths.
