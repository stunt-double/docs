# Stunt Double docs

The source for [docs.stuntdouble.io](https://docs.stuntdouble.io): guides, tutorials, concepts, and the API, MCP and StuntKit reference for [Stunt Double](https://stuntdouble.io).

## Run it locally

Needs Node 22+ and pnpm 11.

```sh
pnpm install
pnpm build   # fetches linked sources, generates pages, builds the site
pnpm dev     # http://localhost:3000
```

## Where content lives

- `content/docs/`: pages written here. Edit these directly.
- Linked sources: the MCP server reference, skills and rules come from [`stunt-double/stuntdouble-mcp`](https://github.com/stunt-double/stuntdouble-mcp), and StuntKit from [`stunt-double/stuntkit`](https://github.com/stunt-double/stuntkit). `sources.json` lists them. The build reads each at its latest release tag (or a pinned commit) into `.sources/`, which is never committed. To change those pages, change the source repo.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Report security issues as described in [SECURITY.md](./SECURITY.md).

## License

Code: [MIT](./LICENSE). Content: [CC BY 4.0](./LICENSE-CONTENT).
