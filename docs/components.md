# Building blocks

Every page is a list of **blocks**. Each block type is one HTML file in
`_includes/blocks/<type>.html` (its styles, if it has its own, are in
`_includes/css/<type>.css`). The words they show come from
`_includes/content/`: Markdown files for text, and `data/` for lists.

## Page settings (front matter)

The lines between `---` at the top of a page.

| Setting | What it does |
|---|---|
| `title` | Browser tab / search result title. Convention: `Page name \| Jools Clarke` |
| `description` | One or two sentences for search results, link previews and `llms.txt`. Defaults to `description` in `data/me.yml` |
| `image` | Picture for link previews (defaults to `preview_image` in data/me.yml, the Perturb logo) |
| `header` | `name` = big name on the left (homepage); `none` = no header row; leave out for the ◀︎ back arrow and home button |
| `back` | Where the ◀︎ back arrow goes (default: homepage; demo pages get `/perturb/` from `_config.yml`) |
| `banner` | Markdown text for a strip across the top of the page |
| `banner_style` | `quiet` for a small right-aligned strip; leave out for a loud coloured one |
| `narrow` | `true` for a slim centred column (QR pages, 404) |
| `background` | `false` to hide the tiled logos |
| `canonical` | Tell search engines another address is the real page (e.g. `/perturb/` on a QR copy of it) |
| `sitemap` | `false` to leave the page out of `sitemap.xml` and `llms.txt` |
| `robots` | e.g. `noindex, nofollow` to ask search engines not to list it |
| `blocks` | The list of blocks on the page, top to bottom (below) |
| `blocks_from` | Another page's address (`/perturb/`): show its blocks instead. For QR copies of a page. Must match the address exactly, trailing `/` included, or the build stops |
| `layout` | Leave out (defaults to `default`). `redirect` for redirect pages, `demo` for Perturb demos, `null` for a page that is its own complete HTML file |
| `redirect_to` | With `layout: redirect`: where to send people |
| `permalink` | Override the page's address (only the 404 page needs this) |

## Layout helpers (CSS classes)

| Class | Use |
|---|---|
| `columns` | Children sit side by side on wide screens (last one a bit wider), stacked on phones |
| `stack` | A vertical pile of cards/tiles with even gaps |
| `prose` | Comfortable line spacing for long text |
| `subheading` | Slightly larger intro text |
| `section-header` | Small gold uppercase heading ("PUBLICATIONS") |
| `logo-heading` | An `<h1>` that is a logo image (its alt text is the heading) |
| `light-only` / `dark-only` | Only shown in that theme (logos with a dark-mode version) |
| `warning` / `warning big` | Red "heads up" box, small (in a card) or standalone |
| `button` | Solid button-looking link |
| `centred` | Centre text |
| `file-meta` | Small monospace detail text ("PDF · 21 pages · 2.6 MB") |

## Blocks

Each entry in `blocks:` has a `type` (the file in `_includes/blocks/`) and
that block's options. Paths to Markdown files are inside `_includes/content/`;
list names are files in `_includes/content/data/`.

### `text`: a Markdown file

```yaml
- type: text
  file: ccc/role.md        # _includes/content/ccc/role.md
  class: prose             # optional: prose (long text), subheading (bigger intro), centred
```

The file can use Liquid (`[{{ site.data.me.email }}](#copy)`) and kramdown
extras, e.g. `[Try it ▶︎](/perturb/demos/01-get-started/){: .button}` for a
button-looking link. A wrong file name stops the build.

### `columns`: two side by side

```yaml
- type: columns
  class: perturb-page      # optional extra CSS class on the row
  left:
    - type: text
      file: ccc/intro.md
  right:
    - type: text
      file: ccc/role.md
```

Stacked on phones; the right one is a bit wider on big screens.

### `stack`: a pile with even gaps

```yaml
- type: stack
  blocks:
    - type: cards
      list: publications
    - type: rule
```

### `card`: the card with a coloured left edge

```yaml
- type: card
  title: GitHub
  url: https://github.com/jools-clarke
  text: Check out my code.
```

or one entry of a data file: `from: perturb.paper` (`paper` in `data/perturb.yml`).

| Option | |
|---|---|
| `title` | Heading |
| `url` | Where it links. `https://…` links open in a new tab; site paths (`/ccc/`) don't. No `url` (and no `copy`): a greyed-out "coming soon" card |
| `copy` | Instead of `url`: clicking copies this text and pops up "Email address copied" |
| `text` | Markdown under the title. No links inside it: the whole card is the link |
| `note` | Red warning box inside the card |
| `label` | Small uppercase word above the title (the demo cards use `Demo`) |
| `accent` | 1 to 6, the colour of the left edge. Otherwise 1, or cycling down the list in a `cards` block |
| `confetti` | `true` for confetti on page load and hover |
| `disabled` | `true` for a greyed-out "coming soon" card that shakes, even with a `url` |
| `big` | `true` for a chunky bold card (a single call to action) |

Accent colours: 1 orange, 2 gold, 3 green, 4 teal, 5 blue, 6 violet.

### `cards`: a card for every entry in a list

```yaml
- type: cards
  list: publications       # data/publications.yml (same fields as `card`)
  heading: Publications    # optional small gold heading
```

### `tile` and `tiles`: picture tiles (homepage left column)

```yaml
- type: tiles
  list: projects           # data/projects.yml
  heading: Projects        # optional small gold heading
  offset: 2                # optional: skip the first N tiles
  limit: 2                 # optional: show at most N
```

A single one: `type: tile` with `url`, `image`, and either `alt` (a logo,
shown whole; `image_dark` swaps in a dark-mode version) or `title` +
`subtitle` (the picture fills a 16:9 tile, dimmed, with the title written
over it). Fields are explained at the top of `data/projects.yml`.

### `image`: a picture

```yaml
- type: image
  src: /perturb/perturb-full-light.svg
  dark: /perturb/perturb-full-dark.svg   # optional dark-mode version
  alt: Perturb                           # "" for a decorative picture
  heading: true                          # optional: the picture is the page's <h1> (a logo)
  class: side-logo                       # optional
```

Uses the small preview (see `img.html` below). Headings load straight away,
other pictures when scrolled near (`eager: true` to load straight away).

### `file-card`: a download with a preview

```yaml
- type: file-card
  file: /qr2/jools_clarke_ariel_consortium_VIENNA.pdf
  title: Slides
  text: Optional markdown
  accent: 2
```

Shows page 1 (or the picture), "PDF · 21 pages · 2.6 MB", and View /
Download buttons. The file is only fetched if clicked. Needs
`scripts/thumbnails.sh` to have been run after adding the file.

### `rule`: a dividing line

```yaml
- type: rule
```

### Blocks made for one page

| Block | Options | |
|---|---|---|
| `intro` | `file` | My photo (from `data/me.yml`) with a Markdown file beside it (homepage) |
| `demo-cards` | `limit`, `offset`, `accent` | A card for every page with `layout: demo`, in folder order, labelled Demo (Perturb page) |
| `conference-map` | `heading` | The list from `data/conferences.yml` and the map (`/conferences/`) |
| `gallery` | `heading` | Everything in `data/gallery.yml` with the pop-up viewer (`/ariel/gallery/`) |

### Making a new block type

Add `_includes/blocks/<type>.html`; it gets the block's options as
`include.item.<option>`. Put its comment at the top (what it is, a YAML
example), its styles in `_includes/css/<type>.css` (and list that in
`assets/css/site.css`), and add it here. Prefix any variable you `assign`
(Liquid variables are global), and if it holds other blocks, draw them with
`{% include blocks.html blocks=include.item.something %}`.

## `img.html`: any picture, in a block

`{% include img.html src="/conferences/photos/vienna-2026.jpeg" alt="…" %}`
is what the blocks use to show a picture. It uses the small preview from
`assets/thumbs/` if `scripts/thumbnails.sh` has made one, sets its
width/height, and waits until it's scrolled near before loading. Options:
`class="…"`, `eager=true`. SVGs are used as they are.

## Click to copy

In any Markdown file, link the text to `#copy` and clicking it copies that
text instead:

```markdown
email me at [j.d.clarke@ucl.ac.uk](#copy)
```

or in HTML `<a href="#copy">j.d.clarke@ucl.ac.uk</a>`. Cards use `copy:`
(above). A pop-up confirms it ("Email address copied" for anything with an
@). The site deliberately has no `mailto:` links.

## Blocks the layout adds for you

| Block | |
|---|---|
| `head.html` | Title, description, canonical URL, link-preview tags, favicon, stylesheet, theme picker, `site.js` |
| `schema.html` | JSON-LD about me (homepage only), built from `me.yml` + `links.yml` |
| `banner.html` | The strip from `banner:` |
| `background.html` | The tiled mission logos. To add a logo, put an SVG in `assets/img/background/` and add an `<img>` line here with its width |
| `header.html` | Name, or back arrow + home button, plus the ☾/☼ button |
| `footer.html` | Name, email (click to copy), last-updated date, link to `llms.txt` |

## `demo` layout: Perturb demos

`perturb/demos/*/index.md` with `layout: demo` and `text:` (its Markdown
file in `_includes/content/perturb/demos/`): a notebook-style page
(Markdown text, ` ```python ` code, images) with "Open in Colab"
(front matter `colab:`) and "Package repo" (`repo` in `data/perturb.yml`)
buttons, greyed out until their links are set. In dark mode `site.js` swaps each
`plot.png` for a `plot-dark.png` beside it, when there is one.

## JavaScript

| File | Loaded by | Does |
|---|---|---|
| `assets/js/site.js` | every page | ☾/☼ button, background logos, click-to-copy + pop-up, confetti |
| `assets/js/conferences.js` | `/conferences/` | Leaflet map; links pins to the list |
| `assets/js/gallery.js` | `/ariel/gallery/` | pop-up viewer |

A page that needs its own script adds
`<script src="{{ '/assets/js/name.js' | relative_url }}" defer></script>` at
the end of its body. Scripts only add behaviour: the content itself should
always be in the HTML.
