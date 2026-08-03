<div align="center">

# Steno Website

The marketing and documentation site for [Steno](https://github.com/stenopress/steno).
Built with Steno itself, using the published `@steno/steno` and
`@steno/theme-marketing-minimal` packages from JSR.

</div>

## Structure

```text
.
├── content/
│   ├── .steno/config.yml       site config
│   ├── _data/                  themes.yml, plugins.yml, features.yml, nav
│   ├── index.md                landing page
│   ├── themes.md                /themes
│   └── plugins.md               /plugins
├── docs-source/                vendored copy of stenopress/steno's docs/
├── scripts/
│   └── sync_docs.ts            turns docs-source/ into content/docs/
├── theme/
│   ├── assets/                 concept.css, concept.js, search index
│   ├── layouts/                landing, docs, themes, plugins
│   └── mod.ts                  extends the official marketing theme
└── deno.json
```

## Commands

```sh
deno task dev      # local dev server
deno task build    # production build
```

Both run `docs:sync` first, regenerating `content/docs/` from `docs-source/`.

## How the docs stay fresh

`docs-source/` is a snapshot, not a live link, of the upstream
[steno](https://github.com/stenopress/steno) repo's `docs/` folder. A weekly
GitHub Action ([`sync-docs`](.github/workflows/sync-docs.yml)) checks
upstream and opens a PR here when something changed. Review the diff before
merging: a doc rename or removal upstream can break a `/docs/*` route.
Trigger it manually from the Actions tab any time.

## Adding a theme or plugin

`/themes` and `/plugins` render from `content/_data/themes.yml` and
`content/_data/plugins.yml`. Add an entry under `community:` in either file
and open a PR to get listed.

## A quirk worth knowing

Site CSS/JS live in `theme/assets/`, served through the theme's own `assets`
map instead of the usual `content/public/` passthrough. The published
`@steno/steno@0.10.0` on JSR predates that passthrough feature, so this is
the workaround until a release ships it. Safe to move back to
`content/public/` once it does.
