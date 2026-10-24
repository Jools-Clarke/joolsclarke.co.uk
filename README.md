# joolsclarke.co.uk

My personal site. Plain [Jekyll](https://jekyllrb.com), built and hosted by
GitHub Pages straight from this repo: push to the branch Pages publishes
(currently `main-jekyll`) and it's live a minute later. There is no build step
or deploy script.

- **How it's put together, and why:** [docs/how-it-works.md](docs/how-it-works.md)
- **Every block a page can use, and its options:** [docs/components.md](docs/components.md)
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

## How a page is put together

Three places, each with one job:

| Where | What's in it |
|---|---|
| `_includes/content/` | **All the words.** Markdown files with each page's text (`ccc/role.md`), and `data/` with the lists: publications, links, conferences, gallery, tiles, me |
| `_includes/blocks/` | **The building blocks.** One HTML file per kind of block: `text`, `card`, `columns`, `stack`… |
| a page's `index.html` | **The layout.** Only settings between `---` lines: the title, description, and a `blocks:` list saying which blocks go where and which content they show |

So `ccc/index.html` says "two columns; on the left the logo, the text in
`ccc/intro.md` and a card; on the right the text in `ccc/role.md`":

```yaml
blocks:
  - type: columns
    left:
      - type: image
        heading: true
        src: /ccc/ClimateChangeCommittee.png
        alt: Climate Change Committee placement
      - type: text
        file: ccc/intro.md
      - type: card
        title: UKPR26
        url: https://www.theccc.org.uk/…
    right:
      - type: text
        file: ccc/role.md
        class: prose
```

Every block and its options: [docs/components.md](docs/components.md).
Pictures and PDFs stay next to the page that uses them (`ccc/ClimateChangeCommittee.png`).

## Common jobs

Edit, save, look at localhost, push. The lists in `_includes/content/data/`
each have a comment at the top explaining their fields.

| I want to… | Edit |
|---|---|
| Change the text on a page | its Markdown file in `_includes/content/` (the page's `blocks:` say which) |
| Change what's on a page, or the order | the `blocks:` list in that page's `index.html` |
| Add a publication / report | `_includes/content/data/publications.yml` (newest first) |
| Add or hide a profile link | `_includes/content/data/links.yml` (hide with `#`) |
| Add a conference | `_includes/content/data/conferences.yml`, see below |
| Add something to the Ariel gallery | `_includes/content/data/gallery.yml`, see below |
| Change my bio | `_includes/content/home/bio.md` |
| Change my job title, photo, email | `_includes/content/data/me.yml` |
| Change the tiles down the homepage's left side | `_includes/content/data/projects.yml` |
| Change the Perturb page text | `_includes/content/perturb/intro.md` (also the llms.txt summary) and `gaussian.md` |
| Add the Perturb repo/paper links | `_includes/content/data/perturb.yml` |
| Add a Perturb demo | see below |
| Change the banner at the top of a page | that page's `banner:` line |
| Point the arXiv link somewhere new | `redirect_to:` in `perturb/perturb-c_arxiv_hook/index.html` |
| Change colours | the variables at the top of `_includes/css/base.css` |
| Make an email address click-to-copy | link it to `#copy`: `[me@ucl.ac.uk](#copy)` |

### Add a conference

1. Add an entry to `_includes/content/data/conferences.yml` with `title`, `coords`
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
page, for PDFs) and records file sizes and page counts in
`_includes/content/data/media.yml`. Commit both. Then:

- **Show a picture on a page:** an `image` block in the page's `blocks:`
  (`src: /folder/picture.jpg`, `alt: What it shows`), or in a Markdown file
  `![What it shows](/folder/picture.jpg)`. (In a standalone HTML page with no
  front matter, like `/qsl/`, point straight at the preview:
  `/assets/thumbs/folder/picture.webp`.)
- **Offer a PDF with a preview, its size and page count:** a `file-card`
  block (`file: /qr2/slides.pdf`, `title: My slides`)
- **Gallery item:** add it to `_includes/content/data/gallery.yml`. Files that aren't
  pictures (3D models, fonts…) also need an `image:` to use as their preview.

### Add a Perturb demo

1. Copy a folder in `perturb/demos/` (e.g. `01-get-started/`) and rename it.
   The folder name sets the order on `/perturb/` and the address
   (`perturb/demos/04-fitting/` becomes `/perturb/demos/04-fitting/`). In its
   `index.md`, set `title`, `description` (also shown on the card), `colab:`
   (the Colab link) and `text:` (step 2).
2. Write the demo in `_includes/content/perturb/demos/04-fitting.md`: the
   notebook's Markdown cells, with code as ` ```python ` blocks and outputs as
   plain ` ``` ` blocks.
3. Save plots in the demo's folder (`perturb/demos/04-fitting/`) and show them
   with `![What it shows](plot.png){: loading="lazy"}`.
Save them with a transparent background; add a `plot-dark.png` beside a plot and
dark mode shows that instead.
A card for every demo appears on `/perturb/` by itself; delete the folder
(and its Markdown file) to remove one. If a code block contains `{{` or `{%`, wrap it in
`{% raw %}` … `{% endraw %}` or the build fails.

### Add a new page

1. Write the words in `_includes/content/talks/intro.md`:

   ```markdown
   # Talks

   Some text.
   ```

2. Make a folder with an `index.html` in it. `talks/index.html` becomes
   <https://joolsclarke.co.uk/talks/>. It holds only settings:

   ```yaml
   ---
   title: Talks | Jools Clarke
   description: One or two sentences saying what's on this page. Shown in Google and to AI assistants.
   blocks:
     - type: text
       file: talks/intro.md
     - type: card
       title: A card
       url: /perturb/
       text: That links somewhere.
   ---
   ```

That's all: the header, background, footer, light/dark switch and the
metadata for search engines come from the layout. It goes into `sitemap.xml`
and `llms.txt` automatically. To link it from the homepage, add a tile to
`_includes/content/data/projects.yml` or a card to `_includes/content/data/links.yml`.

For two columns side by side (like most pages here), use a `columns` block
with `left:` and `right:` lists. Every block is in
[docs/components.md](docs/components.md).

### Add a QR-code landing page

For a QR code on a poster or slide: a page that shows an existing page plus a
banner saying where they came from (see `qr1/index.html`):

```yaml
---
title: Perturb | Jools Clarke
canonical: /perturb/          # tells Google the real page is /perturb/
sitemap: false
blocks_from: /perturb/        # show that page's blocks
banner: "You're coming from my poster! [Get the PDF here](/qr1/poster.pdf) (PDF, 5 MB)."
---
```

Keep the addresses of old QR pages (`/qr/`, `/qr1/`, `/qr2/`) and the PDFs
they link to working: they're printed on things.

### Make a link that you can re-point later

```yaml
---
layout: redirect
title: Perturb paper | Redirecting…
redirect_to: https://arxiv.org/abs/2601.21685
---
```
