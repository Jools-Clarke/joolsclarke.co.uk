# Building blocks

Every reusable piece of the site, what it's for, and the options it takes.
Each block's HTML is in `_includes/<name>.html` and its styles in
`_includes/css/<name>.css`. Use them in any page with `{% include … %}`.

## Page settings (front matter)

The lines between `---` at the top of a page.

| Setting | What it does |
|---|---|
| `title` | Browser tab / search result title. Convention: `Page name \| Jools Clarke` |
| `description` | One or two sentences for search results, link previews and `llms.txt`. Defaults to `description` in `_data/me.yml` |
| `image` | Picture for link previews (defaults to my photo) |
| `header` | `name` = big name on the left (homepage); `none` = no header row; leave out for the ◀︎ back arrow |
| `banner` | Markdown text for a strip across the top of the page |
| `banner_style` | `quiet` for a small right-aligned strip; leave out for a loud coloured one |
| `narrow` | `true` for a slim centred column (QR pages, 404) |
| `background` | `false` to hide the tiled logos |
| `canonical` | Tell search engines another address is the real page (e.g. `/perturb/` on a QR copy of it) |
| `sitemap` | `false` to leave the page out of `sitemap.xml` and `llms.txt` |
| `robots` | e.g. `noindex, nofollow` to ask search engines not to list it |
| `analytics` | `false` to skip Simple Analytics on this page |
| `layout` | Leave out (defaults to `default`). `redirect` for redirect pages, `null` for a page that is its own complete HTML file |
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
| `warning` / `warning big` | Red "heads up" box, small (in a card) or standalone |
| `button` | Solid button-looking link |
| `centred` | Centre text |
| `file-meta` | Small monospace detail text ("PDF · 21 pages · 2.6 MB") |

## `card.html`: the card with a coloured left edge

```liquid
{% include card.html title="GitHub" url="https://github.com/jools-clarke" text="Check out my code." %}
{% include card.html item=pub index=forloop.index0 %}   {# from a _data list #}
```

| Option | |
|---|---|
| `title` | Heading |
| `url` | Where it links. `https://…` links open in a new tab; site paths (`/ccc/`) don't. Leave out for a plain box |
| `copy` | Instead of `url`: clicking copies this text and pops up "Email address copied" |
| `text` | Markdown under the title. No links inside it: the whole card is the link |
| `note` | Red warning box inside the card |
| `accent` | 1 to 6, the colour of the left edge. Otherwise it cycles with `index` |
| `confetti` | `true` for confetti on page load and hover |
| `disabled` | `true` for a greyed-out "coming soon" card that shakes |
| `big` | `true` for a chunky bold card (a single call to action) |

Accent colours: 1 orange, 2 gold, 3 green, 4 teal, 5 blue, 6 violet.

## `tile.html`: picture tiles (homepage left column)

```liquid
{% include tile.html url="/perturb/" image="/perturb/perturb.svg" alt="Perturb" accent=3 %}
{% include tile.html url="/ariel/gallery/" image="/ariel/gallery/decode.png" title="Gallery" subtitle="My creative work" %}
```

Without `title`: the image is shown whole (logos). With `title`: the image
fills a 16:9 tile, dimmed, with the title and `subtitle` written over it.
The homepage reads these from `_data/projects.yml`.

## `img.html`: any picture

```liquid
{% include img.html src="/conferences/photos/vienna-2026.jpeg" alt="What's in the photo" %}
```

Uses the small preview from `assets/thumbs/` if `scripts/thumbnails.sh` has
made one, sets its width/height, and waits until it's scrolled near before
loading. Options: `class="…"`, `eager=true` for pictures at the very top of
the page. SVGs are used as they are.

## `file-card.html`: a download with a preview

```liquid
{% include file-card.html file="/qr2/jools_clarke_ariel_consortium_VIENNA.pdf" title="Slides" text="Optional markdown" accent=2 %}
```

Shows page 1 (or the picture), "PDF · 21 pages · 2.6 MB", and View /
Download buttons. The file is only fetched if clicked. Needs
`scripts/thumbnails.sh` to have been run after adding the file.

## Click to copy

Link any text to `#copy` and clicking it copies that text instead:

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
| `header.html` | Name or back arrow, plus the ☾/☼ button |
| `footer.html` | Name, email (click to copy), last-updated date, link to `llms.txt` |

## Shared page bodies (`_includes/content/`)

Pages shown at more than one address keep their body here, so each copy
stays in sync:

- `content/home.html`: `/` and `/qr/`
- `content/perturb.html`: `/perturb/` and `/qr1/`

## JavaScript

| File | Loaded by | Does |
|---|---|---|
| `assets/js/site.js` | every page | ☾/☼ button, background logos, click-to-copy + pop-up, confetti |
| `assets/js/conferences.js` | `/conferences/` | Leaflet map; links pins to the list |
| `assets/js/gallery.js` | `/ariel/gallery/` | pop-up viewer |
| `assets/js/countdown.js` | old arXiv countdown page | countdown |

A page that needs its own script adds
`<script src="{{ '/assets/js/name.js' | relative_url }}" defer></script>` at
the end of its body. Scripts only add behaviour: the content itself should
always be in the HTML.
