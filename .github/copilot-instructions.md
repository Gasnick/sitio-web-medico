Project: sitio-web-medico (MediNest-based static site)

Purpose
- This repository is a mostly static Bootstrap-based website (MediNest theme) composed of HTML pages in `src/pages/`, assets in `src/assets/` and small vanilla JS enhancements in `src/js/`.

Big-picture architecture
- Static multi-page site: each page is a standalone HTML file (e.g. `src/pages/inicio.html`, `src/pages/detalle_servicios.html`).
- Shared assets: global styles under `src/assets/css/`, images under `src/assets/img/`, and shared scripts in `src/js/` (`main.js`, `menu.js`).
- Minimal client-side logic: UI behavior (nav toggle, AOS, GLightbox, Swiper, PureCounter, Isotope) is initialized from `src/js/main.js` and per-page markup drives configuration via data-attributes and inline JSON for Swiper.

How to run / dev workflow (discoverable assumptions)
- This project can be served as static files. Recommended quick dev options:
  - Serve locally with a static server from project root (examples):
    - Using Python 3: `python -m http.server 5173` then open `http://localhost:5173/src/pages/inicio.html`.
    - Using VS Code Live Server extension to open files under `src/pages/`.
- There are empty `package.json` and `vite.config.js` files in the repo. If the project is migrated to Vite, add a proper `package.json` and dev script. Until then, treat the site as static files.

Project-specific conventions and patterns
- Pages reference assets with relative paths like `../assets/...` and scripts as `../js/main.js`. Keep this relative structure when moving or refactoring pages.
- Third-party libraries are loaded via CDN in head/footer (Bootstrap, AOS, GLightbox, Swiper, PureCounter, Isotope). When adding new libraries prefer CDN entries in the same pattern unless adding a build step.
- Interactive components are initialized by markup: look for `data-aos`, `data-layout`, `.init-swiper` containers and `.swiper-config` inner JSON. Update markup, not `main.js`, for config changes when possible.

Integration points and files to inspect for changes
- `src/js/main.js` — central initialization for AOS, GLightbox, PureCounter, Isotope, Swiper and scroll behaviors.
- `src/js/menu.js` — small nav/menu helpers and scroll-top behavior used by pages that include it.
- `src/assets/css/main.css` — primary styling and variables in `src/assets/css/variables.css`.
- `src/pages/*.html` — page templates and examples of component usage (hero, services, specialists, contact form). Use these when adding a new page.
- `src/forms/*` — server-side form handlers (PHP) may exist; check `src/pages` forms that point to `forms/contact.php` or `forms/doctor-search.php` before changing form actions.

Suggested edits pattern for AI agents
- Small UI/markup changes: edit `src/pages/*.html` and preserve existing relative paths to `assets` and `js`.
- Behavior additions: prefer adding tiny modular JS files under `src/js/` and include them in the bottom of the target page; update `src/js/main.js` only for cross-cutting initialization.
- Assets: optimize images in `src/assets/img/` but keep filenames stable; update references in HTML if renaming.

Examples (from this repo)
- To change the hero image: edit `src/pages/inicio.html` — hero image lives at `../assets/img/health/staff-7.webp` and is wrapped in `.hero-image` with an overlaid `.stats-card`.
- To adjust Swiper config for a carousel: find the `.init-swiper` element and update the inline JSON inside `.swiper-config` in the page HTML.
- To add a new page: create `src/pages/newpage.html`, follow markup patterns in `inicio.html`, and include `../assets/css/main.css` and `../js/main.js` at the same relative paths.

Known unknowns / assumptions
- `package.json` and `vite.config.js` are empty — assume no current Node/Vite toolchain. If you need a build step, propose adding a minimal `package.json` and dev script and flag for approval.
- Forms reference PHP endpoints under `src/forms/` — confirm whether server-side handling is available before changing form submissions.

If something is unclear, ask for:
- The intended hosting/deploy environment (static hosting vs Vite build). 
- Whether we should initialize a Node toolchain (Vite/NPM) or keep the project static.

Please review and tell me which area you want me to improve first (examples: add a dev server script, convert to Vite, add TypeScript, bundle assets, optimize images, or implement a new page).
