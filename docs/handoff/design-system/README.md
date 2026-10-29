# Build 2 Play

Brand system for Build 2 Play. The logo is final (Variation A, extended). Colours, typography and logo files are set; components come next.

## Name

- Written **Build 2 Play** in running text.
- The wordmark sets it as one word in wide-tracked capitals, **BUILD2PLAY**, with the **2** in gold (`accent`) and the rest in `ink`.
- Never "Build to Play", "B2P" on its own in copy, or "Build2Play" in mixed case.

## Voice

Short, imperative, three-beat.

Inside a logo lock-up the tagline is part of the logo artwork (Eurostile Extended). Anywhere else, set it in the `label` style: Inter, uppercase, tracked 0.25em, in `ink-muted`. The tagline is **Train. Build. Perform.**

## Colour

Dark-first: black ground, white marks, gold as the single accent. The light theme (bone ground) is for print and light lock-ups.

- `gold-500` is the brand gold (`#b39a72`, taken from the logo artwork). Use it on dark grounds only. On bone or white it fails text contrast, so use `gold-700` there. The `accent` token picks the right one per theme.
- Gold is an accent, not a fill: the "2", a link or a highlight. Don't use it as large backgrounds behind text.
- `black` and `white` carry the logo. Don't add other hues.
- `black` is `#040506` and `gold-500` is `#b39a72`, both from the source artwork.
- Red is the one functional exception to the palette: `danger`, `danger-border` and `danger-surface` mark form errors and failed actions only. Never decorative, never a brand accent, and always paired with a message, never colour alone.

## Typography

Two Google Fonts, both covering Slovenian diacritics (č, š, ž):

- **Barlow Condensed** (`display`, 600–700): `display`, `h1`, `h2`. Display and h1 are set uppercase. Its condensed width is the opposite of the extended wordmark, so headlines never compete with the logo; its squared, DIN-like shapes match the square-cornered marks.
- **Inter** (`sans`, 400–700): body, UI, `h3` and below, and the tracked `label` style.
- **Eurostile Extended** is the logo face. It is used only inside the logo artwork (wordmark, lettermark, lock-up taglines), never as live text. Look-alikes (Michroma, Microgramma) are off-limits for the same reason.

Load: `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap`

## Shape and layout

- Square corners (`radius-0`) by default. The logo is built from square-ended strokes and right angles.
- Thin hairlines (`hairline`) separate the mark from the wordmark in horizontal lock-ups.
- Generous negative space around marks: at least `space-6` between mark and wordmark.

## Logo

The B2P monogram: an outlined B and P with a gold 2 running through them. The 2's top stroke ends exactly above the left edge of its base. Files are in three asset groups: **Logo** (SVG masters), **Logo PNG** (transparent PNG, 2400 px on the long side) and **Icons**.

### Configurations

| Name | Use it for |
| --- | --- |
| `mark` | Avatars, app icons, favicons, embroidery, anywhere square or small |
| `vertical` | Default lock-up: posters, apparel backs, signage |
| `vertical-tagline` | Large formats only (wall graphics, banners); the tagline gets small fast |
| `horizontal` | Website and app headers, email signatures, letterheads |
| `horizontal-tagline` | Wide formats with room: presentation covers, banners |
| `wordmark` | Where the mark already appears nearby, or very wide, short spaces |
| `wordmark-tagline` | Footers, merchandise sleeves, sign-offs |

### Colourways

Every configuration comes in four files:

- `full-color-dark`: white with a gold 2, for black or dark photo backgrounds. The primary version.
- `full-color-light`: black (`#040506`) with a gold 2, for bone, white or light backgrounds.
- `white`: all white, for one-colour printing on dark materials, or over busy imagery.
- `black`: all black, for one-colour printing, stamps, engraving.

Don't put the full-colour logo on the gold: use `black` there. Don't recolour, outline, stretch, rotate or add effects.

### Clear space and minimum size

- Clear space on every side: at least a quarter of the mark's height (half the gap between the mark and the wordmark in `vertical`). For `wordmark`, at least twice the letter height.
- Minimum size: `mark` 24 px tall on screen, 10 mm in print; `horizontal` 140 px wide; `vertical` 80 px wide. Use the tagline versions only when the tagline letters stay at least 6 px (2 mm) tall.

### Icons

- `app-icon` (1024 px and SVG): black square, mark centred at 62% width. iOS and Android apply their own corner masks; don't round it yourself.
- `apple-touch-icon-180`, `favicon-16/32/48/192/512` and `favicon.svg`: the mark fills more of the square, so it stays readable at 16 px.
- `profile-picture` (1080 px): the mark sits within the circle crop Instagram, LinkedIn and others use.

## Iconography

None defined yet. When icons are added, match the logo: line icons, square caps, a single stroke weight, `ink` with gold only for active states.
