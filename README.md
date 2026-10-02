# joolsclarke.co.uk

My personal site. Plain [Jekyll](https://jekyllrb.com), built and hosted by
GitHub Pages straight from this repo: push to the branch Pages publishes
(currently `main-jekyll`) and it's live a minute later. There is no build step
or deploy script.

- **How it's put together, and why:** [docs/how-it-works.md](docs/how-it-works.md)
- **Every building block and its options:** [docs/components.md](docs/components.md)
- **Notes for AI assistants maintaining the site:** [CLAUDE.md](CLAUDE.md)

## Run it on your own computer

```bash
scripts/serve.sh
```

Then open <http://localhost:4000>. The page reloads itself whenever you save a
file. (Changes to `_config.yml` need a restart: Ctrl+C and run it again.)
Everything is loaded from your computer, nothing from the live site.

It uses the Ruby in the conda env at `/opt/homebrew/anaconda3/envs/jekyll`
and installs the gems it needs on first run. Making image previews also needs
`brew install webp poppler`.

## Before you push

**Never put an HTML comment `<!-- -->` inside a `{% … %}` tag.** To switch
an option off, delete the line or set it to `false`. A comment there stops
the whole build, and GitHub quietly keeps the old site live.

```bash
scripts/check.sh
```

Builds the site exactly as GitHub will, then checks for broken links, links
written as `https://joolsclarke.co.uk/...` or pulled from GitHub, images with
no alt text, and big images shown at full size. Fix anything marked `ERROR`.

## Common jobs

Most content lives in small YAML files in `_data/`. Each one has a comment at
the top explaining its fields. Edit, save, look at localhost, push.

| I want to… | Edit |
|---|---|
| Add a publication / report | `_data/publications.yml` (newest first) |
| Add or hide a profile link | `_data/links.yml` (hide with `#`) |
| Add a conference | `_data/conferences.yml`, see below |
| Add something to the Ariel gallery | `_data/gallery.yml`, see below |
| Change my bio, job title, photo, email | `_data/me.yml` |
| Change the tiles down the homepage's left side | `_data/projects.yml` |
| Change the Perturb page | `_includes/content/perturb.html` |
| Change the banner at the top of a page | that page's `banner:` line |
| Point the arXiv link somewhere new | `redirect_to:` in `perturb/perturb-c_arxiv_hook/index.html` |
| Change colours | the variables at the top of `_includes/css/base.css` |
| Make an email address click-to-copy | link it to `#copy`: `[me@ucl.ac.uk](#copy)` |

### Add a conference

1. Add an entry to `_data/conferences.yml` with `title`, `coords`
   (`[latitude, longitude]`: right-click a spot in Google Maps to copy them)
   and `text`.
2. Got a photo? Put it in `conferences/photos/`, add `image: /conferences/photos/name.jpg`,
   and run `scripts/thumbnails.sh`.

The pin, the arc from London, the list entry and the entry in `llms.txt`
all appear by themselves. The homepage's "Conference Map" tile is a
screenshot (`conferences/conference_preview.png`): replace it now and then
and re-run `scripts/thumbnails.sh`.

### Add images, PDFs or downloads

Big files are fine: pages only ever load a small preview, and the original is
fetched only when someone clicks to view or download it. After adding or
replacing any PNG, JPG, WebP or PDF, run:

```bash
scripts/thumbnails.sh
```

This makes a small WebP preview of each one in `assets/thumbs/` (the first
page, for PDFs) and records file sizes and page counts in `_data/media.yml`.
Commit both. Then:

- **Show a picture on a page:**
  `{% include img.html src="/folder/picture.jpg" alt="What it shows" %}`
  (in a standalone HTML page with no front matter, like `/qsl/`, point
  straight at the preview: `/assets/thumbs/folder/picture.webp`)
- **Offer a PDF with a preview, its size and page count:**
  `{% include file-card.html file="/qr2/slides.pdf" title="My slides" %}`
- **Gallery item:** add it to `_data/gallery.yml`. Files that aren't
  pictures (3D models, fonts…) also need an `image:` to use as their preview.

### Add a new page

Make a folder with an `index.html` (or `index.md` if you'd rather write
Markdown) in it. `talks/index.html` becomes <https://joolsclarke.co.uk/talks/>.

```html
---
title: Talks | Jools Clarke
description: One or two sentences saying what's on this page. Shown in Google and to AI assistants.
---
<h1>Talks</h1>

<p>Some text.</p>

{% include card.html title="A card" url="/perturb/" text="That links somewhere." %}
```

That's all: the header, background, footer, light/dark switch and the
metadata for search engines come from the layout. It goes into `sitemap.xml`
and `llms.txt` automatically. To link it from the homepage, add a tile to
`_data/projects.yml` or a card to `_data/links.yml`.

For two columns side by side (like most pages here), wrap them in
`<div class="columns"><div>…left…</div><div>…right…</div></div>`.
More options are in [docs/components.md](docs/components.md).

### Add a QR-code landing page

For a QR code on a poster or slide: a page that shows an existing page plus a
banner saying where they came from (see `qr1/index.html`):

```html
---
title: Perturb | Jools Clarke
canonical: /perturb/          # tells Google the real page is /perturb/
sitemap: false
banner: "You're coming from my poster! [Get the PDF here](/qr1/poster.pdf) (PDF, 5 MB)."
---
{% include content/perturb.html %}
```

Keep the addresses of old QR pages (`/qr/`, `/qr1/`, `/qr2/`) and the PDFs
they link to working: they're printed on things.

### Make a link that you can re-point later

```html
---
layout: redirect
title: Perturb paper | Redirecting…
redirect_to: https://arxiv.org/abs/2601.21685
---
<p>Redirecting to the preprint on arXiv…</p>
```
