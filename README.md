# Stunt Double docs

The source for [docs.stuntdouble.io](https://docs.stuntdouble.io): guides, tutorials, concepts, and the API, MCP and StuntKit reference for [Stunt Double](https://stuntdouble.io).


## Where content lives

- `content/docs/`: pages written here. Edit these directly.
- Linked sources: the MCP server reference, skills and rules come from [`stunt-double/stuntdouble-mcp`](https://github.com/stunt-double/stuntdouble-mcp), and StuntKit from [`stunt-double/stuntkit`](https://github.com/stunt-double/stuntkit). `sources.json` lists them. The build reads each at its latest release tag (or a pinned commit) into `.sources/`, which is never committed. To change those pages, change the source repo.

## Screenshots

Product screens in the docs are faithful redraws of the dashboard, built in the
Figma file [Docs screenshots](https://www.figma.com/design/JBFOSb3uMqBImmPYwYVdQL)
from the Continuity Design System library (its components, text styles and
colour variables), so they stay on brand and in step with the product. Each
frame has a light twin and a dark twin (the library's Dark mode), exported at
1440 wide to `public/screens/<name>-light.png` and `<name>-dark.png`. Pages use
them through `<Screenshot name="..." alt="..." caption="..." />`, which swaps
the file with the site theme. To update one, edit the light frame, re-clone its
dark twin, and re-export both.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Report security issues as described in [SECURITY.md](./SECURITY.md).

## License

Code: [MIT](./LICENSE). Content: [CC BY 4.0](./LICENSE-CONTENT).
