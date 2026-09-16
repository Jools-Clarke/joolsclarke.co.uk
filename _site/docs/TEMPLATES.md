# Page Templates

## Minimal New Page (Shared Shell)

Create a new `index.html` with front matter and body content:

```html
---
layout: default
title: New Page Title
styles:
  - /assets/css/pages/new-page.css
scripts:
  - /assets/js/pages/new-page.js
background_grid:
  total: 800
header:
  home_link: https://joolsclarke.co.uk/
  show_toggle: true
  hr_after: true
---

<div class="main-content">
  <div class="bio">
    <div class="subheading">Page content here.</div>
  </div>
  <div class="link-container">
    <a href="https://example.com" class="link-box accent-2">Example card</a>
  </div>
</div>
```

## Data-Driven Page Template

Use `_data/*.yml` and Liquid loops instead of hardcoded JS arrays/fetches.

Example YAML (`_data/example-items.yml`):

```yaml
- title: Item A
  url: https://example.com/a
- title: Item B
  url: https://example.com/b
```

Example page loop:

```liquid
<div class="link-container">
  {% for item in site.data.example-items %}
  <a href="{{ item.url }}" class="link-box accent-3">{{ item.title }}</a>
  {% endfor %}
</div>
```

## Standalone Exception Page

For generated/special pages that should bypass shared layout (example: folium export):

```html
---
layout: null
---
<!DOCTYPE html>
<html>
  ...existing standalone page...
</html>
```

Use this only when page structure is generator-owned or highly specialized.
