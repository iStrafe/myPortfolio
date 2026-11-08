# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: serve the built `dist/` locally

There is no linter, formatter, type checker or test suite configured. Use `npm run build` to check that changes compile.

## Stack & deployment

A single-page personal portfolio: React 18 + Vite 5 + Tailwind CSS 3 (PostCSS/autoprefixer), plain JSX with no TypeScript and no router. There is no animation library: components animate by hand with CSS transitions and IntersectionObserver. It deploys to Vercel (`vercel.json` runs `npm install` / `npm run build`). `dist/` is build output and is gitignored.

## Architecture

- `src/App.jsx` lays out the page as a fixed list of sections: `Hero → About → TechCarousel → Projects → Skills → Contact`, with `<Divider />` between sections and `<Footer />` at the end. The whole content column is wrapped in `pl-16` to make room for the fixed 64px left sidebar (`Navbar.jsx`).
- **Navigation** uses hash anchors (`#home`, `#about`, `#projects`, `#skills`, …) defined in the `navLinks` array in `Navbar.jsx`. Each anchor must match the `id` on that section's root element. Adding or renaming a section means updating both places.
- **Content lives in data arrays at the top of each component file** (e.g. `projects` in `Projects.jsx`, `groups`/`tools` in `Skills.jsx`, `TECH` in `TechCarousel.jsx`, `timeline` in `About.jsx`, `socials` in `Contact.jsx`). To change portfolio content, edit those arrays. There is no CMS or shared data file.
- **Reveal-on-scroll:** each section component defines its own local copy of a `useInView(threshold)` hook (IntersectionObserver, fires once). There is no shared hooks module, so new sections copy the same pattern.
- **Custom cursor:** `Cursor.jsx` draws a dot and a lagging ring, and `body` sets `cursor: none`. The ring grows when the pointer is over `a`, `button` or any element with `data-hover`. Add `data-hover` to other interactive elements so they get the hover state.

## Styling conventions

- The theme is a sci-fi/HUD look. Palette: dark `#303841`, mid `#3A4750`, yellow accent `#F6C90E`, light `#EEEEEE`. The same colors are defined twice: as Tailwind `brand.*` colors in `tailwind.config.js` and as CSS variables in `src/index.css`. Components often hard-code the hex values in Tailwind arbitrary classes (`bg-[#303841]`, `text-[#EEEEEE]/45`) instead of using `brand-*`.
- Fonts are loaded from Google Fonts in `index.html` and mapped to Tailwind `font-display` (Barlow Condensed), `font-body` (Barlow) and `font-mono` (JetBrains Mono).
- Reusable decorative classes are defined in `src/index.css` (`.hud-corner.tl/.tr/.bl/.br`, `.grid-bg`, `.scanlines`, `.sys-label`, `.section-rule`, cursor classes, and others). Custom animations (`scan`, `marquee`, `grid-drift`, `fade-up`, `pulse-y`) are in the `tailwind.config.js` keyframes.
