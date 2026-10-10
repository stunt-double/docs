// Write content/docs/_generated/*.mdx from the repos fetch-sources.mjs put in
// .sources: one overview page per source, rendering its README at the
// fetched release tag. The output is git-ignored; the source repo owns it.
//
//   node scripts/generate.mjs            every source
//   node scripts/generate.mjs stuntkit   just the named ones

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCES_DIR = join(ROOT, '.sources');
const OUT_DIR = join(ROOT, 'content/docs/_generated');

/** Page title and description for each source's overview. */
const PAGES = {
  'stuntdouble-mcp': {
    title: 'Stunt Double MCP server',
    description: 'The hosted MCP server, its plugins, skills and rules, from the stuntdouble-mcp repository.',
  },
  stuntkit: {
    title: 'StuntKit overview',
    description: 'The open source StuntKit packages and skills, from the stuntkit repository.',
  },
};

/** Escape what MDX would read as JSX or expressions in plain text, leaving inline code alone. */
function escapeText(text) {
  return text
    .split(/(`+[^`]*`+)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)')
            .replace(/[{}<>]/g, (c) => `&#${c.charCodeAt(0)};`)
    )
    .join('');
}

/**
 * A GitHub README as MDX: HTML comments dropped, JSX-like text escaped
 * outside code, and relative links pointed at the file on GitHub at `tag`.
 */
export function readmeToMdx(markdown, { repo, tag }) {
  const blob = `https://github.com/${repo}/blob/${tag}/`;
  const lines = markdown.replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').split('\n');
  let fence = null;
  return lines
    .map((line) => {
      const open = /^\s*(```+|~~~+)/.exec(line);
      if (fence) {
        if (open && open[1][0] === fence[0] && open[1].length >= fence.length) fence = null;
        return line;
      }
      if (open) {
        fence = open[1];
        return line;
      }
      return escapeText(line).replace(
        /\]\((?!https?:|mailto:|#|\/)(?:\.\/)?([^)\s]+)\)/g,
        (_, path) => `](${blob}${path})`
      );
    })
    .join('\n');
}

function frontmatter(data) {
  return `---\n${Object.entries(data)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')}\n---\n\n`;
}

function main() {
  const sources = JSON.parse(readFileSync(join(ROOT, 'sources.json'), 'utf8'));
  const manifestPath = join(SOURCES_DIR, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  const only = process.argv.slice(2);
  const names = only.length ? only : Object.keys(sources);

  const missing = names.filter((n) => !manifest[n] || !existsSync(join(SOURCES_DIR, n, 'README.md')));
  if (missing.length) {
    console.error(`generate failed: not fetched: ${missing.join(', ')} (run scripts/fetch-sources.mjs)`);
    process.exit(1);
  }

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of names) {
    const { repo, tag } = manifest[name];
    const page = PAGES[name] ?? { title: name, description: `From ${repo}.` };
    const readme = readFileSync(join(SOURCES_DIR, name, 'README.md'), 'utf8');
    const note = `> Generated from [${repo}](https://github.com/${repo}/tree/${tag}) at release \`${tag}\`. Edit it there.\n\n`;
    writeFileSync(
      join(OUT_DIR, `${name}.mdx`),
      frontmatter(page) + note + readmeToMdx(readme, { repo, tag })
    );
    console.log(`generated _generated/${name}.mdx from ${repo}@${tag}`);
  }
  writeFileSync(
    join(OUT_DIR, 'meta.json'),
    `${JSON.stringify({ title: 'Reference', pages: names }, null, 2)}\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
