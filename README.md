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
├── theme/                    Custom theme extension and assets
├── dist/                     Build output
└── .github/workflows/        Automation workflows
```

## Docs sync workflow

`docs-source/` is updated by `.github/workflows/sync-docs.yml`.

The workflow:

1. Fetches the latest GitHub release tag from `stenopress/steno`.
2. Checks out that release tag and copies its `docs/` folder.
3. Opens or updates a PR in this repository when `docs-source/` changes.

If your repository does not allow PR creation with `GITHUB_TOKEN`, add a
`DOCS_SYNC_TOKEN` secret with `repo` scope.
