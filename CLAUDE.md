# joolsclarke.co.uk: notes for AI assistants

Jools Clarke's personal/academic site (UCL PhD, exoplanets + ML, ESA Ariel).
Plain Jekyll, built and hosted by **GitHub Pages' own builder** from the
`main-jekyll` branch. No Actions, no deploy step: pushing publishes.

Read [docs/how-it-works.md](docs/how-it-works.md) (structure + reasons) and
[docs/components.md](docs/components.md) (every include and its options)
before non-trivial changes. The [README](README.md) holds the
"how do I add X" recipes. Keep all three up to date when you change how
things work.

## Commands

```bash
scripts/serve.sh        # http://localhost:4000, live reload (restart after editing _config.yml)
scripts/check.sh        # production build into a temp dir + link/alt/size checks. Must pass before committing.
scripts/thumbnails.sh   # after adding/replacing any PNG/JPG/WebP/PDF; commit assets/thumbs/ and _data/media.yml
```

The scripts use Ruby from the conda env `/opt/homebrew/anaconda3/envs/jekyll`
(via `scripts/env.sh`). `thumbnails.sh` needs `brew install webp poppler`, plus python3.

In the Claude Code desktop app the preview tool can't launch processes inside
`~/Documents` (macOS privacy). Start `scripts/serve.sh` with Bash in the
background and attach the preview with a `.claude/launch.json` entry that
only has `"url": "http://localhost:4000"`.

## Rules

1. **Site paths only.** Link and load everything as `/path/` (or
   `{{ '/path/' | relative_url }}` in templates). Never
   `https://joolsclarke.co.uk/...`, `raw.githubusercontent.com` or
   `github.com/.../raw`. `check.sh` fails on these.
2. **Lists live in `_data/`** (publications, links, projects, conferences,
   gallery, me). Pages are front matter plus a few includes. Don't hard-code
   something that already exists in a data file (e.g. use `site.data.me.email`).
3. **Images go through `img.html` / `file-card.html`** so the small preview
   is used. Never put a big original in an `<img>`. `_data/media.yml` is
   generated: re-run the script, don't edit it.
4. **Styles:** one file per block in `_includes/css/`, all glued into
   `assets/css/site.css` (add new files to its list). Plain CSS only, no Sass.
   Colours only via the variables in `_includes/css/base.css`; check both
   light and dark. No `style="…"` attributes, no `<style>` blocks in pages.
5. **Scripts add behaviour, never content.** Everything readable must be in
   the HTML (search engines, AI assistants, no-JS). Shared behaviour goes in
   `assets/js/site.js`; page-only scripts are loaded by that page with `defer`.
6. **GitHub Pages limits:** Jekyll 3.10 + Liquid 4 (no `find`/`find_exp`
   filters, no Jekyll 4 features); only [approved plugins](https://pages.github.com/versions/)
   (we use none). The `github-pages` gem pins identical versions locally.
7. **Printed URLs must keep working:** `/qr/`, `/qr1/`, `/qr2/`, the PDFs in
   those folders, `/perturb/perturb-c_arxiv_hook/`, `/perturb/perturb-c_2025/*`.
8. **No `mailto:` links.** Email addresses are click-to-copy (`[addr](#copy)`
   or a card with `copy:`). The owner asked for this.
9. `personal/isochrones/index.html` is a 6 MB folium export with
   `layout: null`. Leave it alone apart from front matter.
10. New/changed pages need a `title` and a real `description` (they feed
    search results and `llms.txt`).
11. Check layouts at ~375 px (phone), ~720 and ~960 px (half-screen windows)
    and desktop. The two-column layout starts at 800 px, and columns get
    narrow just above that.

## Style the owner wants

- Unique and a bit handmade, not a polished template: keep the ☆｡⋆ name,
  the solarized-ish palette, the tiled mission logos, confetti, ◀︎ arrow,
  the monospace footer.
- Simple over clever. Fewer moving parts beats a fancier solution.
- Fast: small previews, lazy loading, one CSS + one JS file.
- Works well for both people and AI/search (descriptions, JSON-LD,
  `llms.txt`, sitemap).
- Normal OpenStreetMap tiles in both themes. The owner didn't like an
  inverted "dark" map.

## Gotchas

- `<!-- -->` inside a `{% include … %}` tag is a Liquid syntax error that
  fails the GitHub build (it happened on 28 Sep 2026). Delete the parameter
  or set it to `false` instead. When the live site doesn't update, look at
  the Actions tab → "pages build and deployment" → build → "Build with Jekyll".
- Liquid `assign` is global even inside includes: prefix variables per
  include (`card_`, `tile_`, `img_`, `file_`).
- Front matter on a *layout* isn't visible as `page.x`. Put settings on the
  page, or handle them where they're used (see `redirect_to` in `head.html`
  and `sitemap.xml`).
- `_config.yml` sets `baseurl: ""` and `repository:`, otherwise
  `jekyll-github-metadata` guesses a `/pages/<user>/<repo>` baseurl in
  production builds and every asset link breaks.
- Never build into `_site/` while `serve.sh` is running (`check.sh` uses a
  temp dir for this reason).
- Includes that output `<a>` blocks (`card`, `tile`) are wrapped in a
  `<div>` so they survive inside Markdown pages.
- `thumbnails.sh` applies EXIF rotation (phone photos) because `cwebp`
  ignores it, and writes previews atomically so the dev server never copies
  a half-written file.
- Simple Analytics only loads when `jekyll.environment == "production"`
  (GitHub's build), so local visits aren't counted.
