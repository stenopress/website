# Steno website

This is the Steno marketing and documentation website: a real Steno project,
built against the published `@steno/steno` and `@steno/theme-marketing-minimal`
packages from JSR.

```text
.
├── content/
│   ├── .steno/
│   │   └── config.yml
│   ├── _data/
│   │   ├── docs_navigation.yml
│   │   ├── features.yml
│   │   ├── plugins.yml
│   │   └── themes.yml
│   ├── index.md
│   ├── plugins.md
│   └── themes.md
├── docs-source/
├── scripts/
│   └── sync_docs.ts
├── theme/
│   ├── assets/
│   │   ├── concept.css
│   │   ├── concept.js
│   │   └── docs-search.json   (generated)
│   ├── layouts/
│   │   ├── docs.tau
│   │   ├── landing.tau
│   │   ├── plugins.tau
│   │   └── themes.tau
│   └── mod.ts
└── deno.json
```

Structured content belongs in `content/_data/`. The site's own CSS/JS live in
`theme/assets/` and are served through the theme's `assets` map (merged with
the official marketing theme's own assets) rather than the `content/public/`
passthrough — the published `@steno/steno@0.10.0` on JSR predates that
passthrough feature, so this repo works around it until a release picks it up.
Switch back to `content/public/` once that lands upstream.

Documentation pages are generated from `docs-source/` by `scripts/sync_docs.ts`.
That directory is a vendored snapshot of the main
[steno](https://github.com/stenopress/steno) repo's `docs/` folder. A weekly
[`sync-docs`](.github/workflows/sync-docs.yml) GitHub Action pulls the latest
`docs/*.md` from upstream and opens a PR against `docs-source/` when anything
changed — merge it like any other PR after checking the diff (a doc
rename/removal upstream can break a `/docs/*` route here). Trigger it manually
from the Actions tab if you don't want to wait for Monday. Generated
`content/docs/`, `theme/assets/docs-search.json`, build cache, staging
directories, and output are intentionally ignored.

`content/_data/themes.yml` and `content/_data/plugins.yml` list the official
and community themes/plugins shown on `/themes/` and `/plugins/`. Open a PR
against this repo, adding an entry under `community:`, to list your own.

## Commands

```sh
deno task dev
deno task build
```

Both tasks synchronize the documentation before running Steno.
