# AdventHQ — Motion Design Studio

A single-page, cinematic marketing site for a high-end motion studio. Dark,
restrained, motion-forward — built to win clients and showcase craft.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a CSS-variable design-token layer
- **GSAP + ScrollTrigger** — scroll-driven animation & pinning
- **Framer Motion** — enter/exit, layout morphs, micro-interactions
- **Lenis** — smooth scroll, synced to GSAP's ticker
- `prefers-reduced-motion` is a first-class path throughout

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Sections (single scroll, in order)

1. **Preloader → Hero** — counter + wordmark wipe, showreel bg, split-line mask reveal, parallax, reel lightbox
2. **Marquee** — velocity-reactive capability strip
3. **Selected Work** — filterable grid, hover-to-play tiles, full-width featured blocks, `layoutId` case-study morph
4. **Services** — GSAP-pinned horizontal scroll (vertical stack on mobile / reduced-motion)
5. **Studio** — statement + count-up stats + team strip
6. **Process** — scroll-drawn timeline
7. **Testimonials** — rotating quotes
8. **Contact** — validated form → stubbed `/api/contact`, mailto wipe, socials
9. **Footer** — animated wordmark, back-to-top, status chip

## Re-skinning the brand (one place)

- **Colors / motion / layout tokens:** `styles/globals.css` `:root`. Change
  `--accent` to recolor the whole site (cursor, CTAs, links, active states).
- **Fonts:** the two `next/font` imports in `app/layout.tsx`
  (`--font-display`, `--font-sans`).
- Tailwind reads these via `var()` (see `tailwind.config.ts`).

## Media / placeholder assets

All media is **placeholder** and marked `// TODO: replace with real AdventHQ asset`:

- **Projects:** `data/projects.ts` — single typed source of truth (12 projects
  across all 5 categories, varied aspect ratios). Clips point at royalty-free
  sample MP4s; swap `CDN` + per-project `previewSrc`/`fullSrc`.
- **Posters:** generated SVGs in `public/posters` via
  `node scripts/gen-posters.mjs` (dark gradient + grain). Replace with real stills.
- **Showreel:** `SHOWREEL` in `data/projects.ts`.
- **Services / clients / testimonials / process / stats:** `data/services.ts`, `data/clients.ts`.
- **Contact email + socials + team:** marked `// TODO` in `components/Contact.tsx`,
  `components/Footer.tsx`, `components/Studio.tsx`.

### Performance notes

- Grid previews: `preload="none"`, `muted`, `loop`, `playsInline`, lazy in-view
  play via IntersectionObserver (`components/LazyVideo.tsx`, `components/Work/Tile.tsx`).
- Case-study view is dynamically imported (loaded only on open).
- LCP is the hero poster, not the video.
- Reduced motion: posters only, no autoplay/pin, manual play in lightbox.

## Structure

```
app/        layout.tsx · page.tsx · api/contact/route.ts
components/  Preloader · Cursor · Nav · Hero · Marquee · MagneticButton ·
             LazyVideo · CountUp · SmoothScroll · Services · Studio · Process ·
             Testimonials · Contact · Footer · Work/{Work,Grid logic,Tile,FilterBar,CaseStudy,Lightbox}
lib/         gsap · useReducedMotion · useInView
data/        projects.ts · services.ts · clients.ts
styles/      globals.css (tokens, grain, base type)
scripts/     gen-posters.mjs
```

## Wiring the contact form

`app/api/contact/route.ts` validates and logs the lead. Replace the
`// TODO: wire to email/CRM` block with Resend / Postmark / HubSpot, etc.
