# Oria Homes — one-page marketing site

Static one-page site (plain HTML/CSS/JS, no build step). Global fractional
vacation homes, positioned against Pacaso with international homes (incl. Asia)
as the differentiator.

## Files
- `index.html` — page markup and copy
- `styles.css` — all styling (brand palette derived from the logo)
- `script.js` — sticky nav, mobile menu, scroll reveals, waitlist form
- `assets/` — brand logo SVGs (light/dark/mark)

## Run locally
Any static server works, e.g.:

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123

## Waitlist form — Kit (ConvertKit)
The waitlist forms use our own styled fields but POST directly to the Kit
subscription endpoint, so signups land in the Oria Homes Kit account:

- Endpoint / form id is set in `KIT_ENDPOINT` near the top of `script.js`
  (`https://app.kit.com/forms/9789346/subscriptions`).
- Field name sent to Kit: `email_address`.
- Kit is **double opt-in**: subscribers get a confirmation email and must click
  to confirm before they're active. The on-page success message reflects this.

We intentionally do **not** load Kit's embed script (`ck.5.js`) or use their
pre-styled form — that keeps the custom design and avoids Kit's modal,
slide-in, and sticky-bar popups (which are enabled in the embed settings).

To point at a different Kit form, change the form id in `KIT_ENDPOINT`. If
`KIT_ENDPOINT` is left empty, the form falls back to opening a pre-addressed
email to `waitlist@oriahomes.com` (no backend needed).

## Design notes
- Palette from the logo: ink `#213E4D`, sea `#4E7B91`, terracotta `#DA5F41`,
  sand `#F3EEE1`, paper `#F8F7F3`.
- Type: Bricolage Grotesque (display) + Inter (body), loaded from Google Fonts.
- Logo assets (`assets/logo-*.svg`, `assets/mark.svg`) have the "ORIA HOMES"
  wordmark outlined to vector paths — no font dependency, so they render
  identically everywhere regardless of installed fonts.
- The "1/8 share" wheel in *How it works* reuses the logo's fractional-globe
  geometry as a recurring motif.
- Destination photos are currently hotlinked from Unsplash as placeholders —
  replace with owned/licensed photography before launch.
