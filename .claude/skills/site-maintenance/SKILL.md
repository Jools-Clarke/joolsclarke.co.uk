---
name: site-maintenance
description: Maintain the Jekyll-based static academic website using shared layouts/includes/assets/data, preserving existing visual behavior and content.
---

# Site Architecture

The site uses Jekyll-native structure:

- `_layouts/default.html`: shared page skeleton (head metadata, shared CSS/JS, optional banner/background/header/container, analytics include)
- `_layouts/redirect.html`: centered redirect/countdown wrapper
- `_includes/`: reusable partials (`header.html`, `banner.html`, `background-grid.html`, `conf-map-box.html`, `link-box.html`)
- `assets/css/base.css`: global variables and base layout/typography
- `assets/css/components/*.css`: shared reusable component styles
- `assets/css/pages/*.css`: page-unique styles
- `assets/js/theme-toggle.js`, `background-grid.js`, `confetti.js`: shared behavior
- `assets/js/pages/*.js`: page-specific behavior
- `_data/*.yml`: structured page content collections
- `docs/COMPONENTS.md`, `docs/STYLEGUIDE.md`, `docs/TEMPLATES.md`: reference docs

# Hard Rules

1. Never add inline `<style>` or `<script>` blocks to regular pages.
2. Add shared styles only to the appropriate file in `assets/css/components/` or `assets/css/base.css`.
3. Add page-specific styles only under `assets/css/pages/`.
4. Do not break the light/dark variable contract in `assets/css/base.css`.
5. Reuse existing include components from `_includes/` instead of duplicating markup.
6. Use YAML in `_data/` for listable content; do not add new JSON data sources for this role.

# Add A New Page

1. Create a new `index.html` with front matter:
   - `layout: default`
   - `title`
   - `styles` and `scripts` arrays as needed
   - optional `background_grid`, `header`, `banner`, `include_analytics`
2. Add page content body using shared component classes and includes.
3. If new behavior is unique to the page, add `assets/js/pages/<page>.js`.
4. If new styling is unique, add `assets/css/pages/<page>.css`.
5. If behavior/style is reused by multiple pages, promote to shared component files.

# Add A New Component

1. Create include markup in `_includes/<component>.html` if reusable.
2. Add shared styles in `assets/css/components/<component>.css`.
3. Add shared JS in `assets/js/<component>.js` only if used on multiple pages.
4. Document usage and parameters in `docs/COMPONENTS.md`.

# Add Or Change Accent Colors

1. Update `--accent-*` variables in `assets/css/base.css` for global behavior.
2. If a page intentionally diverges (example: QR event page), keep override in `assets/css/pages/<page>.css`.
3. Verify hover contrast and border visibility in both light/dark themes.

# Data Workflow

1. Put list-like content in `_data/*.yml`.
2. Keep field names stable (use existing file shapes as references).
3. Render markup with Liquid loops in page templates.
4. Keep interaction JS focused on DOM behavior, not data transport.

# Verification Checklist

After each change, verify:

1. Theme toggle initializes correctly and persists across reload.
2. Background grid renders and uses intended density on each page.
3. Card hover transforms and shadows match expected behavior.
4. Confetti triggers on `.has-confetti` targets.
5. Top banners render correctly with safe-area padding and no overlap issues.
6. Mobile widths preserve responsive layout and readable typography.
7. Page-specific apps still work (conference map interactions, gallery popup, isochrones map, countdown/redirect pages).

# References

- `docs/COMPONENTS.md`
- `docs/STYLEGUIDE.md`
- `docs/TEMPLATES.md`
