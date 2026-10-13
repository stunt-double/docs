<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/readme/header-dark.png">
  <img alt="Stunt Double Docs: authentic user insights from autonomous AI agents, backed by evidence. Beside it, a checklist run with a failed check and its evidence." src=".github/readme/header-light.png" width="100%">
</picture>

<p>
  <a href="https://github.com/stunt-double/docs/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/stunt-double/docs/actions/workflows/ci.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/stunt-double/docs/actions/workflows/github-code-scanning/codeql"><img alt="CodeQL" src="https://github.com/stunt-double/docs/actions/workflows/github-code-scanning/codeql/badge.svg"></a>
  <a href="https://docs.stuntdouble.io"><img alt="docs.stuntdouble.io" src="https://img.shields.io/website?url=https%3A%2F%2Fdocs.stuntdouble.io&label=docs.stuntdouble.io&up_message=live&style=flat-square&labelColor=0E1119"></a>
  <a href="https://github.com/stunt-double/stuntdouble-mcp/releases"><img alt="MCP server release" src="https://img.shields.io/github/v/release/stunt-double/stuntdouble-mcp?label=MCP%20server&style=flat-square&labelColor=0E1119&color=545862"></a>
  <a href="./LICENSE"><img alt="Code licence: MIT" src="https://img.shields.io/badge/code-MIT-545862?style=flat-square&labelColor=0E1119"></a>
  <a href="./LICENSE-CONTENT"><img alt="Content licence: CC BY 4.0" src="https://img.shields.io/badge/content-CC%20BY%204.0-545862?style=flat-square&labelColor=0E1119"></a>
</p>

# Stunt Double docs

The source for [docs.stuntdouble.io](https://docs.stuntdouble.io), the documentation for
[Stunt Double](https://stuntdouble.io): authentic user insights from autonomous AI agents,
backed by evidence.

It covers getting started, concepts, tutorials and guides, integrations, the Stunt Double
Index, and the reference for the API, the MCP server and [StuntKit](https://github.com/stunt-double/stuntkit).
Spotted a mistake or something missing? Contributions are welcome, from a typo fix to a new guide.

## Quick start

Requires Node 22 or later and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/stunt-double/docs.git
cd docs
pnpm install
pnpm build   # fetches linked sources and generates their pages, then builds
pnpm dev     # http://localhost:3000
```

After the first build, `pnpm dev` is all you need. To refresh the linked pages without a full
build, run `node scripts/fetch-sources.mjs && node scripts/generate.mjs`.

| Command           | What it does                     |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Run the site locally             |
| `pnpm test`       | Run the tests (`node --test`)    |
| `pnpm type-check` | Type-check the app               |
| `pnpm build`      | Production build                 |

## How it's built

A [Next.js](https://nextjs.org) site on [Fumadocs](https://fumadocs.dev), with MDX content and
Tailwind CSS.

```
content/docs/   Pages written here, as MDX. Each folder's meta.json sets the sidebar order.
src/            The app: layouts, MDX components, routes for llms.txt and Markdown.
public/         Static files, including product screenshots.
scripts/        Fetch and generate the pages linked from other repositories.
sources.json    The repositories those pages come from.
```

### Linked pages

The MCP server reference, skills and rules come from
[`stunt-double/stuntdouble-mcp`](https://github.com/stunt-double/stuntdouble-mcp). The build reads
each source in `sources.json` at its latest release tag (or a pinned commit) into `.sources/`,
which is never committed. To change those pages, open a pull request on the source repository.

### Screenshots

Product screens are redraws of the dashboard, built in Figma from the Continuity design system
so they stay on brand and in step with the product. Each one has a light and a dark export at
1440 wide (`public/screens/<name>-light.png` and `<name>-dark.png`), and pages use them through
`<Screenshot name="..." alt="..." caption="..." />`, which follows the site theme. If a screen is
out of date, open an issue rather than editing the image.

### Icons

Icons come from [StuntKit](https://github.com/stunt-double/stuntkit)'s `@stunt-double/icons`, the
Continuity icon pack. Use a product icon wherever a page names one of Stunt Double's own things:

```mdx
<CardGrid
  items={[{ title: 'Actors', description: 'AI users that drive a real browser.', href: '/concepts#actors', icon: 'actor' }]}
/>
```

The [Icons page](https://docs.stuntdouble.io/stuntkit/icons) previews the whole pack with two MDX
components:

```mdx
<IconGallery />                           {/* all 235 icons, grouped by category */}
<IconGallery categories={['product']} />  {/* just the categories you name */}
<BrandGallery />                          {/* AI provider marks, color and mono */}
```

The geometry is copied from StuntKit into `src/components/icon-gallery-data.ts`, never edited here.
To pick up a new StuntKit release, check it out beside this repo and run:

```bash
node scripts/sync-icons.mjs ../stuntkit
```

## For AI agents

- `/llms.txt` indexes every page and `/llms-full.txt` holds them all.
- `/.well-known/agents.md` says when to use the docs and how to act through the MCP server.
- Any page is available as Markdown at its path plus `.md`, or with `Accept: text/markdown`.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow and style guide, and follow the
[code of conduct](./CODE_OF_CONDUCT.md). Please report security issues privately as described in
[SECURITY.md](./SECURITY.md), not in a public issue.

## License

Code is under the [MIT License](./LICENSE). Documentation content is under
[CC BY 4.0](./LICENSE-CONTENT).
