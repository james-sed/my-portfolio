---
name: Sederia Portfolio Maintenance
description: Maintain James Sederia's Vite + React portfolio on Vercel — components, project content, the contact endpoint and its rate limits, security headers/CSP, the branded 404, tests, and deployment. Use when editing this repo, changing the contact form or API, touching vercel.json, or shipping a release.
---

# Sederia Portfolio Maintenance

Single-page portfolio for James Sederia: Vite 8 + React 19, one route (`/`),
one Vercel Function (`/api/contact`), Resend for email. Keep changes small and
consistent with the existing structure; do not redesign sections as a side
effect of a fix.

## Map

| Path | Role |
| --- | --- |
| `src/pages/Home.jsx` | Composes Navbar, Hero, About, Skills, Projects, Contact, Footer |
| `src/components/` | One file per section; `Reveal.jsx` is the scroll-animation wrapper |
| `src/data/projects.js` | Project cards: title, description, image, tags, `live`, `repo` |
| `src/site.config.js` | Name, email, social URLs, roles, résumé path |
| `src/contexts/theme-context.js` | Theme state, `useTheme` hook, OS-follow logic |
| `src/contexts/ThemeContext.jsx` | Provider component only (kept split for lint) |
| `src/index.css` | Design tokens, reset, base type, `.dark` surfaces |
| `src/App.css` | Component styles |
| `shared/contact-limits.js` | Field limits + email pattern, imported by app **and** API |
| `api/contact.js` | Validation, rate limiting, honeypot, Resend call |
| `public/theme-init.js` | Pre-paint theme bootstrap (external so CSP allows it) |
| `public/404.html`, `public/404.css` | Standalone branded 404, no build step |
| `tests/` | Vitest: contact rules and endpoint guards |
| `vercel.json` | Redirect, asset caching, security headers |

## Commands and release gate

```bash
npm run dev        # Vite + local /api/contact (reads .env.local)
npm run lint       # oxlint — must be warning-free
npm test           # vitest run
npm run build      # dist/
npm run preview    # serve the production build
```

Ship only after `npm run lint`, `npm test`, and `npm run build` all pass, plus
the manual checks at the end. `npm run dev` serves the API through
`vite.config.js`; run `vercel env pull` first if `.env.local` lacks
`RESEND_API_KEY`.

## Contact endpoint invariants

The guard order in `api/contact.js` is deliberate — do not reorder it:

1. `405` for non-POST (with `Allow: POST`)
2. `403` for `sec-fetch-site: cross-site`
3. `429` per IP when the window is full (with a bounded `Retry-After`)
4. `500` when `RESEND_API_KEY` is missing
5. `413` for a declared or streamed body over 16 KB
6. `400` for unparseable JSON
7. `200 {ok:true}` for the honeypot, without sending
8. `400` for missing fields, bad email, or over-limit lengths
9. Reserve the slot, call Resend, then **release it** on a thrown fetch or a
   non-OK response

Rules that must survive future edits:

- Only an accepted message spends budget; malformed and honeypot traffic must not.
- The honeypot checks `hp_website` first, then the legacy `company_website`.
- Field limits and `EMAIL_PATTERN` come from `shared/contact-limits.js`. Never
  duplicate them in the component or the API.
- The in-memory map is per function instance; the Vercel Firewall rule
  (10 req/min per IP on `/api/contact`) is the shared ceiling.
- Tests must stub `globalThis.fetch` and use a unique `x-forwarded-for` per
  case. Never send a real message, even to your own inbox.

## Security headers and CSP

`vercel.json` applies headers to `/(.*)`:

- `Content-Security-Policy` with `script-src 'self'` (no `unsafe-inline`,
  no `unsafe-eval`), `style-src 'self' https://fonts.googleapis.com`,
  `font-src https://fonts.gstatic.com`, `img-src 'self' data:`,
  `connect-src 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`,
  `X-Frame-Options: DENY`

Consequences to respect:

- No inline `<script>` and no `on*=` attributes. Anything that must run before
  paint lives in `public/` and is referenced with `src`.
- React `style={{...}}` props are fine (CSSOM), but a literal `style="..."`
  attribute in `index.html` or `404.html` would be blocked.
- Adding an external origin (font, image, API) requires editing the CSP in the
  same change.
- Hashed `/assets/*` are cached for a year as `immutable`, so never reuse a
  filename for different bytes; `/index.html` permanently redirects to `/`.

## Theme handling

- Stored key is `theme` with values `light` or `dark`; no stored value means
  "follow the OS". Only an explicit choice persists.
- `public/theme-init.js` runs before paint and must stay behaviourally in sync
  with `src/contexts/theme-context.js` (same key, same fallback, same
  `theme-color` values `#f5faf7` / `#070d0b`).
- The `.dark` class goes on `<html>`; surfaces come from tokens in `index.css`.
- `404.html` has no script, so it uses two media-scoped `theme-color` tags
  instead. Keep that exception local to the 404 page.

## Navigation, motion, and accessibility

- The mobile menu is a floating card; it scrolls on short viewports
  (`max-height: 100dvh - 24px`). Do not reintroduce `overflow: hidden`.
- Closing the panel restores focus to the toggle with `preventScroll` so a
  section link still jumps; `main` and `footer` are `inert` while open.
- Active section links use `aria-current="location"`, not `"page"`.
- `Reveal` follows `prefers-reduced-motion` live, not just at mount. New
  animation should go through `Reveal` or add its own media-query listener.
- Off-screen carousel links stay `tabIndex={-1}`; swipe rotates once and must
  not open a link. `Projects.jsx` renders Live only when
  `project.live !== GITHUB_URL`, and Code only when `project.repo` is truthy.

## Routing and the 404

There is no SPA catch-all on Vercel. The client `*` route in `App.jsx` only
helps in-app navigation; the server must answer unknown paths with a real 404.
`public/404.html` is served automatically by Vercel with status 404 — keep it
dependency-free (no build, no scripts, system fonts) and keep `404.css`
same-origin so `style-src 'self'` allows it.

If client-side routes are ever added, restore a rewrite in `vercel.json` — and
only then.

## Domains (open decision)

- `my-portfolio-jjms.vercel.app` currently sends `X-Robots-Tag: noindex`, yet
  the canonical, Open Graph, sitemap, and robots files all point at it.
- `my-portfolio-two-hazel-51.vercel.app` is the indexable production domain.
  Do not delete or rename it until the canonical decision is made.
- `my-portfolio.vercel.app` belongs to someone else. Never claim it.
- Preview and `-git-main-` aliases are noindex by design; that is not a bug.

Ask before changing the canonical host, `robots.txt`, the sitemap, or domains.

## Deployment

```bash
vercel deploy --yes                 # preview
git push origin main                # production, once the repo is connected
vercel ls my-portfolio              # confirm the Ready deployment
vercel env pull                     # refresh .env.local
```

`.vercel/project.json` holds the project/org IDs. Production serves the pushed
commit; a preview verifies a commit before it lands.

## Verifying a deploy

Check both a preview and production:

```powershell
$base = "https://my-portfolio-jjms.vercel.app"
$r = Invoke-WebRequest "$base/" -UseBasicParsing
$r.StatusCode
$r.Headers['Content-Security-Policy']
$r.Content -match '<script>(?!\s*</script>)'     # must be False
curl.exe -sS -o NUL -w "%{http_code} %{redirect_url}`n" "$base/index.html"
curl.exe -sS -D - -o NUL "$base/does-not-exist"   # 404 + CSP + branded body
```

Expected: root `200`; `/index.html` `308`; unknown paths `404` with the branded
page and all security headers; hashed assets `immutable`; contact API answers
`200` honeypot, `403` cross-site, `400` bad email, `405` GET.

## Windows / tooling gotchas

- PowerShell: `try` is a statement, not an expression — assign inside it.
- `git push` prints progress to stderr; a non-zero pipeline exit is usually
  not a failed push. Confirm with the `old..new  HEAD -> main` line or
  `git log origin/main -1`.
- `Invoke-WebRequest` exposes JSON bodies as `byte[]`; decode with
  `[Text.Encoding]::UTF8.GetString($r.Content)`.
- `npm audit` reports high advisories in the **dev-only** Vite toolchain
  (dev server, launch-editor, nanoid, source-map-js). They do not affect the
  production bundle; fixing them needs a Vite upgrade, which is not routine.
- Never commit `node_modules/`, `dist/`, or `.vercel/`.

## Manual QA

- Nav links land with headings clear of the sticky navbar; active link follows
  the section in view.
- Mobile menu opens/closes on a short landscape viewport and its last link is
  reachable; focus returns to the toggle every time.
- Theme toggle announces direction, survives refresh, and follows OS changes
  until an explicit choice is made.
- Carousel works with arrows, dots, keyboard, and swipe; swipe does not open a
  link.
- Contact form: invalid email is rejected, success panel offers "Send another
  message" and focuses the message field, and no layout overflows at phone,
  tablet, or desktop widths.
- A made-up path shows the branded 404 with a working home link.
