# Style Guide

## Theme Variables

Shared variables are defined in `assets/css/base.css`:

- `--container-bg`
- `--body-bg`
- `--text-color`
- `--card-bg`
- `--shadow-color`
- `--accent-1` through `--accent-6`

The light/dark variable contract must stay intact. New components should consume these variables rather than hardcoding new colors.

## Accent System

- `accent-1`..`accent-6` are semantic card border accents.
- Default behavior is left border color only.
- If a page intentionally customizes accent behavior (example: `qr2`), keep that customization in a page-specific CSS file.

## Typography

- Base font remains `sans-serif` for visual compatibility with legacy pages.
- Heading and body sizing should follow existing scale from `assets/css/base.css`.

## Spacing and Layout

- Container defaults:
  - `max-width: 1300px`
  - `padding: 40px 30px`
  - `border-radius: 10px`
- Standard vertical rhythm:
  - `hr` separators between major blocks
  - `link-container` gap `15px`

## Shared Interaction Patterns

- Theme toggle: hover lift + shadow
- Link cards: hover lift + stronger shadow
- Confetti: `has-confetti` + `.confetti` child (auto-created if absent)
- Responsive name swap:
  - `.full-name` hidden on narrow screens
  - `.short-name` shown on narrow screens

## Data Pattern (`_data`)

Use YAML consistently for listable page content.

- Store editable collections in `_data/*.yml`
- Keep field names stable to preserve JS expectations
- Render initial DOM server-side with Liquid loops
- Keep interactivity in page JS that operates on rendered DOM/data

Reference examples:
- `_data/ariel-posters.yml`
- `_data/conferences.yml`
- `ariel/gallery/index.html` (Liquid loop over posters)
- `conferences/index.html` (JSON injection via `| jsonify`)
