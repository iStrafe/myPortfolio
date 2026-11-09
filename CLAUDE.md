# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: serve the built `dist/` locally

There is no linter, formatter, type checker or test suite configured. Use `npm run build` to check that changes compile.

## Stack & deployment

A single-page personal portfolio: React 18 + Vite 5 + Tailwind CSS 3 (PostCSS/autoprefixer), plain JSX with no TypeScript, and React Router v7 (`BrowserRouter` in `main.jsx`). There is no animation library: components animate by hand with CSS transitions and IntersectionObserver. It deploys to Vercel (`vercel.json` runs `npm install` / `npm run build` and rewrites every path to `/index.html` so client-side routes survive a refresh). `dist/` is build output and is gitignored.

## Architecture

- **Routes** are declared in `src/App.jsx`: `/` renders the one-page `Home` sections, unknown paths render `pages/NotFound.jsx`, and project case-study pages live in `src/pages/` and are code-split with `React.lazy` (e.g. `/projects/minecraft-ec2` → `pages/MinecraftEc2.jsx`). Use the `usePageMeta` hook for a page's title and description. `ScrollManager` in `App.jsx` scrolls to a `#hash` target after navigation, which is why the sidebar links are `<Link to="/#about">` and still work from sub-pages. A project card links to its page through the `details` field in the `projects` array. Static assets for a project page go in `public/projects/<slug>/`.

- `src/App.jsx` lays out the page as a fixed list of sections: `Hero → About → TechCarousel → Projects → Skills → Contact`, with `<Divider />` between sections and `<Footer />` at the end. The whole content column is wrapped in `pl-16` to make room for the fixed 64px left sidebar (`Navbar.jsx`).
- **Navigation** uses hash anchors (`#home`, `#about`, `#projects`, `#skills`, …) defined in the `navLinks` array in `Navbar.jsx`. Each anchor must match the `id` on that section's root element. Adding or renaming a section means updating both places.
- **Content lives in data arrays at the top of each component file** (e.g. `projects` in `Projects.jsx`, `groups`/`tools` in `Skills.jsx`, `TECH` in `TechCarousel.jsx`, `timeline` in `About.jsx`, `socials` in `Contact.jsx`). To change portfolio content, edit those arrays. There is no CMS or shared data file.
- **Reveal-on-scroll:** section components use the shared `useInView(threshold)` hook in `src/hooks/useInView.js` (IntersectionObserver, fires once).
- **Custom cursor:** `Cursor.jsx` moves a dot by writing directly to the DOM, so pointer movement causes no React renders. On devices with a fine pointer it adds `custom-cursor` to `<html>`, which hides the native cursor; touch devices are left alone.
- **Contact form:** there is no backend. Submitting opens a pre-filled `mailto:` draft in the visitor's email app.
- **Security headers and caching** are set in `vercel.json`, including a Content Security Policy. Anything loaded from a new origin, and any inline `<script>` or `<style>`, must be allowed there or it will be blocked in production.

## Styling conventions

- The theme is a sci-fi/HUD look. Palette: dark `#303841`, mid `#3A4750`, yellow accent `#F6C90E`, light `#EEEEEE`. The same colors are defined twice: as Tailwind `brand.*` colors in `tailwind.config.js` and as CSS variables in `src/index.css`. Components often hard-code the hex values in Tailwind arbitrary classes (`bg-[#303841]`, `text-[#EEEEEE]/45`) instead of using `brand-*`.
- Fonts are loaded from Google Fonts in `index.html` and mapped to Tailwind `font-display` (Barlow Condensed), `font-body` (Barlow) and `font-mono` (JetBrains Mono).
- Reusable decorative classes are defined in `src/index.css` (`.hud-corner.tl/.tr/.bl/.br`, `.grid-bg`, `.sys-label`, `.section-rule`, cursor classes, and others). Custom animations (`scan`, `grid-drift`, `pulse-y`) are in the `tailwind.config.js` keyframes; Tailwind only emits a keyframe when its `animate-*` class is used, so an inline `animation:` style will silently not run. The marquee and glitch keyframes live in `src/index.css`.
- `.sys-label` is declared after `@tailwind utilities`, so its color and opacity override any `text-*` utility on the same element.
- Motion must respect `prefers-reduced-motion`; the global rule is at the end of `src/index.css`. Keep body text at `/70` opacity or higher (`#F6C90E` at `/80`) to pass WCAG AA on the card backgrounds.
