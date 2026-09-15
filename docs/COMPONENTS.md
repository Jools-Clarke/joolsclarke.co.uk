# Components

## Layout

- File: `_layouts/default.html`
- Purpose: shared HTML skeleton and asset loading.
- Provides:
  - `<head>` metadata wiring from front matter
  - shared CSS/JS includes
  - optional banner
  - optional background grid
  - optional shared header
  - optional analytics script

Example front matter:

```yaml
layout: default
title: Example Page
styles:
  - /assets/css/pages/example.css
scripts:
  - /assets/js/pages/example.js
background_grid:
  total: 800
header:
  home_link: https://joolsclarke.co.uk/
  show_toggle: true
  hr_after: true
```

## Background Grid

- Include: `_includes/background-grid.html`
- CSS: `assets/css/components/background-grid.css`
- JS: `assets/js/background-grid.js`
- Behavior: tiles SVG logos in a shuffled repeating sequence.
- Parameters:
  - `total`: number of tiled icons (`data-bg-total`)

Example:

```liquid
{% include background-grid.html total=400 %}
```

## Header

- Include: `_includes/header.html`
- CSS: `assets/css/base.css`
- Purpose: home-link, optional responsive name, theme toggle, optional trailing `<hr>`.
- Parameters:
  - `home_link`
  - `home_title`
  - `title_full`
  - `title_short`
  - `show_toggle`
  - `hr_after`

Example:

```yaml
header:
  home_link: https://joolsclarke.co.uk/
  title_full: "☆｡⋆ Jools Clarke ⋆°★"
  title_short: "Jools<br>Clarke"
  show_toggle: true
  hr_after: true
```

## Banner

- Include: `_includes/banner.html`
- CSS: `assets/css/components/banner.css`
- Supports `top-banner` and `poster-banner` styles.
- Parameters:
  - `class`
  - `prefix`
  - `href`
  - `link_text`
  - `suffix`
  - `download`

Example:

```yaml
banner:
  class: poster-banner
  prefix: "You're coming from the QR code in my poster. To see a PDF version of the poster, "
  href: JClarke_PERTURB.pdf
  link_text: click here
  suffix: "."
  download: true
```

## Link Box

- Include: `_includes/link-box.html`
- CSS: `assets/css/components/link-box.css`
- Reusable card with accent border and hover behavior.
- Parameters:
  - `tag` (`a` or `div`)
  - `href`
  - `accent` (`accent-1`..`accent-6`)
  - `classes`
  - `target`
  - `rel`
  - `download`
  - `style`
  - `content`

## Conference Map Preview Card

- Include: `_includes/conf-map-box.html`
- CSS: `assets/css/components/conf-map.css`
- Purpose: image preview card with centered text overlay.
- Parameters:
  - `href`
  - `accent`
  - `image`
  - `alt`
  - `title`
  - `subtitle`

Example:

```liquid
{% include conf-map-box.html
  href="https://joolsclarke.co.uk/conferences"
  accent="accent-4"
  image="https://.../conference_preview.png"
  alt="Conference Map Preview"
  title="Conference Map"
  subtitle="See where I have been"
%}
```

## Theme Toggle

- JS: `assets/js/theme-toggle.js`
- Behavior:
  - Initializes from localStorage or system preference
  - Updates all `.toggle-theme` buttons
  - Persists selection to localStorage
  - Dispatches `theme-changed` custom event

## Confetti

- CSS: `assets/css/components/confetti.css`
- JS: `assets/js/confetti.js`
- Trigger: any `.has-confetti` element.
- Runtime behavior: ensures `.confetti` child exists and launches on hover plus page load.

## Data-Driven Components

### Conference list/map data

- Data file: `_data/conferences.yml`
- Page script: `assets/js/pages/conferences.js`
- Injection pattern: page includes a JSON script tag generated from Liquid:

```liquid
<script id="conferences-data" type="application/json">{{ site.data.conferences | jsonify }}</script>
```

### Gallery posters

- Data file: `_data/ariel-posters.yml`
- Page template: `ariel/gallery/index.html` renders cards in Liquid loop.
- Page script: `assets/js/pages/gallery.js`
- Editing pattern: add/remove items in `_data/ariel-posters.yml` only.
