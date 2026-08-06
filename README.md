# Steno Website

This repository contains the Steno marketing site and documentation site.

## Tech stack

- [Deno](https://deno.com/)
- [Steno](https://github.com/stenopress/steno)
- `@steno/theme-marketing-minimal`

## Local development

```sh
deno task dev
```

This starts the local development server.

## Production build

```sh
deno task build
```

The static output is written to `dist/`.

## Project structure

```text
.
├── content/                  Site content and docs pages
│   ├── .steno/config.yml     Steno config
│   ├── _data/                Data files for themes and plugins pages
│   └── docs/                 Rendered documentation pages
├── docs-source/              Source docs synced from steno releases
├── registry/
│   ├── themes/official|community    Theme registry files (see below)
│   └── plugins/official|community   Plugin registry files (see below)
├── scripts/
│   ├── generate_theme_previews.ts   Builds content/_data/themes.yml
│   └── generate_plugins.ts          Builds content/_data/plugins.yml
├── theme/                    Custom theme extension and assets
├── dist/                     Build output
└── .github/workflows/        Automation workflows
```

## Got a theme or plugin to share?

Head to the [Themes](content/themes.md) or [Plugins](content/plugins.md) page on
the live site and click "Add a community theme/plugin" - it opens a pre-filled
file for you on GitHub, ready to submit as a PR. No local setup needed.

Prefer doing it by hand? Drop a YAML file into `registry/themes/community/` or
`registry/plugins/community/`:

```yaml
# registry/plugins/community/my-plugin.yml
name: My Plugin
package: "@me/plugin-my-plugin"
label: Category
description: A one-sentence pitch for what the plugin does.
install: "jsr:@me/plugin-my-plugin"
sourceUrl: https://github.com/me/plugin-my-plugin
```

```yaml
# registry/themes/community/my-theme.yml
name: My Theme
package: "@me/theme-my-theme"
label: Community
description: A one-sentence pitch for the theme.
install: "theme: jsr:@me/theme-my-theme@^1.0.0"
sourceUrl: https://github.com/me/theme-my-theme
moduleSpecifier: "jsr:@me/theme-my-theme@^1.0.0" # full jsr:/npm: version specifier
demoFrontmatter:
  title: Sample page title
demoBody: |-
  # Sample page title

  Whatever Markdown best shows off the theme.
```

That's it - open a PR and a check runs automatically to make sure it renders.
The site pulls in your entry the next time it builds, nothing else to touch.

<details>
<summary>How this works under the hood</summary>

`content/_data/themes.yml` and `content/_data/plugins.yml` are generated,
gitignored files - never edit them directly. `deno task build`/`dev` rebuild
them from the `registry/` folder every time, via
`scripts/generate_theme_previews.ts` and `scripts/generate_plugins.ts`. Theme
previews are real renders (the script imports the theme package and runs it
through Tau), not hand-typed HTML.

`.github/workflows/theme-previews.yml` and `.github/workflows/plugins.yml`
re-run those scripts on any PR touching `registry/`, so a broken submission (bad
YAML, package that doesn't resolve) fails the check before merge.

</details>

## Docs sync workflow

`docs-source/` is updated by `.github/workflows/sync-docs.yml`.

The workflow:

1. Fetches the latest GitHub release tag from `stenopress/steno`.
2. Checks out that release tag and copies its `docs/` folder.
3. Opens or updates a PR in this repository when `docs-source/` changes.

If your repository does not allow PR creation with `GITHUB_TOKEN`, add a
`DOCS_SYNC_TOKEN` secret with `repo` scope.
