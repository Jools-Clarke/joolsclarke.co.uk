# Step 1 Audit (Repo Scope)

## HTML pages discovered

1. `index.html`
2. `ccc/index.html`
3. `conferences/index.html`
4. `ariel/gallery/index.html`
5. `personal/isochrones/index.html`
6. `perturb/index.html`
7. `perturb/perturb-c_2025/code/index.html`
8. `perturb/perturb-c_2025/dataset/index.html`
9. `perturb/perturb-c_arxiv_hook/index.html`
10. `perturb/perturb-c_arxiv_hook/index_legacy.html`
11. `qr1/index.html`
12. `qr2/index.html`

## Distinct repeated components/patterns and usage

- Theme system (`:root` + `[data-theme="dark"]`, `.toggle-theme`, `toggleTheme()`):
  - Used by `index.html`, `ccc/index.html`, `conferences/index.html`, `perturb/index.html`, `qr1/index.html`, `qr2/index.html`

- Shared card components (`.link-box`, `accent-*` left border classes):
  - Used by `index.html`, `ccc/index.html`, `perturb/index.html`, `qr1/index.html`, `qr2/index.html`

- Background SVG tiling (`.background-wrapper`, `.background-grid`, `.bg-svg`, `svgSources` + shuffle):
  - Used by `index.html`, `conferences/index.html`, `perturb/index.html`, `qr1/index.html`, `qr2/index.html`

- Top fixed banner variants:
  - `index.html`: `.top-banner` email strip with safe-area padding
  - `qr1/index.html`: `.poster-banner` QR poster notice

- Conference preview card (`.conf-map-box`, `.conf-map-preview`, `.conf-map-overlay`):
  - Used by `index.html`

- Confetti behavior (`.has-confetti`, `.confetti`, `.confetti-piece`, `confetti-fall` keyframes):
  - Used by `index.html`, `perturb/index.html`, `qr1/index.html`

- Responsive name swap (`.full-name`/`.short-name`):
  - Used by `index.html`

- Analytics script include:
  - Present in `index.html`, `perturb/index.html`, `qr1/index.html`
  - Missing in other pages

## Divergence flags in nominally shared components

- Theme toggle map hook divergence:
  - `conferences/index.html` extends theme toggle behavior to sync map layers.

- Accent palette divergence:
  - `qr2/index.html` uses a reduced/custom accent palette (`accent-1..4`) and custom card styling for `.accent-4`.

- Background tile count divergence:
  - 800 tiles on homepage/perturb/qr1
  - 400 on conferences
  - 200 on qr2

- Link-card hover drift:
  - `ccc/index.html` uses a stronger hover transform and duplicated `.link-box` definitions.

- Banner behavior divergence:
  - `index.html` uses a right-aligned top email banner.
  - `qr1/index.html` uses a centered poster banner with download link.

## Page-specific CSS/JS that should stay local

- `conferences/index.html`:
  - Leaflet map setup, sidebar interactions, marker/arc drawing, and map-specific theme handling.
  - Embedded list content (`places`) suitable for `_data` extraction.

- `ariel/gallery/index.html`:
  - Gallery popup behavior and poster rendering.
  - Runtime `fetch()` to `posters.json` suitable for `_data` extraction.

- `personal/isochrones/index.html`:
  - Folium-generated standalone map with a very large page-specific script payload and custom overlays.
  - Not a shared-site-shell candidate.

- `perturb/perturb-c_arxiv_hook/index_legacy.html`:
  - Countdown timer behavior unique to this archived page.

## Static site architecture check

No Jekyll scaffolding was present before refactor:
- No `_config.yml`
- No `_layouts/`
- No `_includes/`
- No `Gemfile`

Conclusion at audit time: pure static HTML on GitHub Pages.

## Architecture decision

Proceed with Jekyll-native structure (GitHub Pages default):
- `_layouts/default.html` shared shell
- `_includes/*` reusable components
- `assets/css/*` shared + page-specific stylesheets
- `assets/js/*` shared + page-specific scripts
- `_data/*.yml` for listable structured page content

