// Write pages from the repos fetch-sources.mjs put in .sources, at the fetched
// release tag. stuntdouble-mcp becomes the /mcp section (content/docs/mcp,
// beside its handwritten meta.json and connect.mdx); every other source gets
// one overview page in content/docs/_generated. The output is git-ignored;
// the source repo owns it.
//
//   node scripts/generate.mjs            every source
//   node scripts/generate.mjs stuntdouble-mcp   just the named ones

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCES_DIR = join(ROOT, '.sources');
const OUT_DIR = join(ROOT, 'content/docs/_generated');
const MCP = 'stuntdouble-mcp';
const MCP_DIR = join(ROOT, 'content/docs/mcp');
/** What the generator owns in content/docs/mcp (kept in step with its .gitignore). */
const MCP_GENERATED = ['index.mdx', 'tools.mdx', 'rules.mdx', 'agents.mdx', 'clients', 'skills'];

/**
 * Sidebar icon for each client page, by slug: the client's own mark from
 * StuntKit's AI provider set (src/components/brand-icons.tsx), else a
 * Continuity product icon. A client missing here gets no icon.
 */
const CLIENT_ICONS = {
  'claude-code': 'claude-code',
  'claude-code-plugin': 'claude-code',
  claude: 'claude',
  'chatgpt-and-codex': 'openai',
  'codex-cli': 'codex',
  'gemini-cli': 'gemini',
  cursor: 'cursor',
  windsurf: 'windsurf',
  opencode: 'opencode',
  'vs-code': 'code',
  'other-clients': 'mcp',
};

/** Page title and description for each source's overview. */
const PAGES = {};

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

/** A fenced code block (left alone) or a README's centred `<p>` holding one `<img>`, optionally linked. */
const FENCED_OR_IMAGE =
  /(^ *(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ *\2[`~]* *$)|<p[^>]*>\s*(?:<a [^>]*>)?\s*(<img [^>]*>)\s*(?:<\/a>)?\s*<\/p>/gm;

/**
 * A GitHub README as MDX: HTML comments dropped, centred images turned into
 * `<img>` tags on the raw file at `tag`, JSX-like text escaped outside code,
 * and relative links pointed at the file on GitHub at `tag`.
 */
export function readmeToMdx(markdown, { repo, tag, dir = '' }) {
  const blob = `https://github.com/${repo}/blob/${tag}/${dir}`;
  const raw = `https://raw.githubusercontent.com/${repo}/${tag}/${dir}`;
  const images = new Set();
  const lines = markdown
    .replace(/\r\n/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(FENCED_OR_IMAGE, (_, fence, __, img) => {
      if (fence) return fence;
      const attr = (name) => new RegExp(`\\b${name}="([^"]*)"`).exec(img)?.[1] ?? '';
      const src = new URL(attr('src').replace(/^\.\//, ''), raw).href;
      const jsx = `<img src="${src}" alt="${attr('alt').replace(/[{}<>"]/g, '')}" style={{ width: '100%' }} />`;
      images.add(jsx);
      return jsx;
    })
    .split('\n');
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
      if (images.has(line)) return line;
      const [, quote] = /^((?:\s*>)*\s*)/.exec(line);
      return (quote + escapeText(line.slice(quote.length))).replace(
        /\]\((?!https?:|mailto:|#|\/)(?:\.\/)?([^)\s]+)\)/g,
        (_, path) => `](${new URL(path, blob).href})`
      );
    })
    .join('\n');
}

function frontmatter(data) {
  return `---\n${Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')}\n---\n\n`;
}

/** `key: value` frontmatter (flat scalars only) and the body after it. */
export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text.replace(/\r\n/g, '\n'));
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (kv && kv[2]) data[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, '$2');
  }
  return { data, body: text.replace(/\r\n/g, '\n').slice(m[0].length) };
}

/** Split markdown on headings of exactly `level`, ignoring code fences. The preamble has heading null. */
export function splitSections(markdown, level) {
  const marker = `${'#'.repeat(level)} `;
  const sections = [{ heading: null, body: [] }];
  let fence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (!fence && line.startsWith(marker)) sections.push({ heading: line.slice(marker.length).trim(), body: [] });
    else sections.at(-1).body.push(line);
  }
  return sections.map((s) => ({ heading: s.heading, body: s.body.join('\n').trim() }));
}

export function slugify(heading) {
  return heading
    .replace(/\(.*?\)/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Paragraphs about building and submitting the plugin, which customers never need. */
const INTERNAL = /\.cursor-plugin|plugin validation|plugin layout|mcp-publisher|CONTRIBUTING\.md|validate-json/i;

/** Drop internal paragraphs, point old marketing docs URLs at this site and take out em dashes. */
export function clean(markdown) {
  return markdown
    .split(/\n{2,}/)
    .filter((p) => !INTERNAL.test(p))
    .join('\n\n')
    .replace(/(https:\/\/)?(?:www\.)?stuntdouble\.io\/support\/docs(\/[^)\s\]]*)?/g, (_, h, p) => `${h ?? ''}docs.stuntdouble.io${p ?? ''}`)
    .replace(/(?<=\|)[ \t]*\u2014[ \t]*(?=\|)/g, ' n/a ')
    .replace(/\s*\u2014\s*([^\u2014\n|]+?)\s*\u2014\s*/g, ' ($1) ')
    .replace(/\s*\u2014\s*/g, ': ');
}

function demote(markdown, by) {
  let fence = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fence = !fence;
      return !fence && /^#{1,5} /.test(line) ? '#'.repeat(by) + line : line;
    })
    .join('\n');
}

/** Drop a leading `# Title` and return it. */
function takeTitle(body) {
  const m = /^\s*# (.+)\n?/.exec(body);
  return m ? { title: m[1].trim(), body: body.slice(m[0].length).trim() } : { title: null, body: body.trim() };
}

function editLink({ repo, tag }, paths) {
  const url = (p) => `https://github.com/${repo}/blob/${tag}/${p}`;
  return paths.length === 1
    ? `\n\n---\n\n[Edit on GitHub](${url(paths[0])})\n`
    : `\n\n---\n\nEdit on GitHub: ${paths.map((p) => `[${basename(p)}](${url(p)})`).join(', ')}\n`;
}

/**
 * The /mcp section from the stuntdouble-mcp repo, as { path: content } relative
 * to content/docs/mcp. `src` holds the README text and the skills, rules and
 * agents files as { file, text } (file relative to the repo root).
 */
export function mcpPages(src, at) {
  const mdx = (text, dir) => readmeToMdx(clean(text), { ...at, dir });
  const page = (data, body, paths) => clean(frontmatter(data) + body + editLink(at, paths));
  const out = {};

  const [pre, ...sections] = splitSections(src.readme, 2);
  const byName = Object.fromEntries(sections.map((s) => [s.heading, s.body]));
  const intro = takeTitle(pre.body.replace(/^(?:\s*<p[\s\S]*?<\/p>)+/, '')).body.split(/\n{2,}/);
  const quick = splitSections(byName['Quick Start'] ?? '', 3).filter((s) => s.heading);
  const skillsIntro = quick.find((s) => /^skills/i.test(s.heading));
  const clients = quick.filter((s) => s !== skillsIntro).map((s) => ({ ...s, heading: s.heading.replace(/\s+\/\s+/g, ' and '), slug: slugify(s.heading) }));

  const DROP = ['This repository', 'Quick Start', 'Available Tools', 'Links', 'Verifying changes', 'License'];
  const overview = [
    intro.slice(1).join('\n\n'),
    '## Connect a client',
    [...clients.map((c) => `- [${c.heading}](/mcp/clients/${c.slug})`), '- [From the Stunt Double app](/mcp/connect)'].join('\n'),
    ...sections.filter((s) => !DROP.includes(s.heading)).map((s) => `## ${s.heading}\n\n${s.body}`),
  ].join('\n\n');
  out['index.mdx'] = page({ title: 'MCP server', description: intro[0] }, mdx(overview), ['README.md']);

  out['tools.mdx'] = page(
    { title: 'Tools', icon: 'Wrench', description: 'Every tool, prompt and resource the Stunt Double MCP server exposes.' },
    mdx(byName['Available Tools'] ?? ''),
    ['README.md']
  );

  for (const c of clients) {
    out[`clients/${c.slug}.mdx`] = page(
      {
        title: c.heading.replace(/\s*\(.*\)$/, ''),
        icon: CLIENT_ICONS[c.slug],
        description: `Connect ${c.heading} to the Stunt Double MCP server.`,
      },
      mdx(c.body),
      ['README.md']
    );
  }
  out['clients/meta.json'] = `${JSON.stringify({ title: 'Clients', icon: 'AppWindow', pages: clients.map((c) => c.slug) }, null, 2)}\n`;

  const skills = src.skills.map(({ file, text }) => {
    const { data, body } = parseFrontmatter(text);
    const name = data.name ?? basename(file.replace(/\/SKILL\.md$/, ''));
    const { title, body: rest } = takeTitle(body);
    return { file, name, title: title ?? name, description: clean(data.description ?? ''), body: rest };
  });
  const skillsBody = [
    (skillsIntro?.body ?? '')
      .split('\n')
      .filter((l) => !l.startsWith('|'))
      .join('\n')
      .trim(),
    skills.map((s) => `- [\`${s.name}\`](/mcp/skills/${s.name}): ${s.description}`).join('\n'),
  ].join('\n\n');
  out['skills/index.mdx'] = page(
    { title: 'Skills', description: 'Task skills that teach an agent how to use the Stunt Double MCP server for one job.' },
    mdx(skillsBody),
    ['README.md']
  );
  for (const s of skills) {
    out[`skills/${s.name}.mdx`] = page(
      { title: s.title, description: s.description },
      mdx(s.body, s.file.replace(/[^/]+$/, '')),
      [s.file]
    );
  }
  out['skills/meta.json'] = `${JSON.stringify({ title: 'Skills', icon: 'Sparkles', pages: skills.map((s) => s.name) }, null, 2)}\n`;

  const rules = src.rules.map(({ file, text }) => {
    const { data } = parseFrontmatter(text);
    const fence = text.includes('```') ? '````' : '```';
    const applies = data.alwaysApply === 'true' ? ' Cursor applies it to every request.' : '';
    return `## ${basename(file, '.mdc')}\n\n${escapeText((data.description ?? '').replace(/\.$/, ''))}.${applies}\n\n${fence}md title="${basename(file)}"\n${text.trim()}\n${fence}`;
  });
  out['rules.mdx'] = page(
    { title: 'Cursor rules', icon: 'ScrollText', description: 'Rules that keep Cursor on track when it works with the Stunt Double MCP server.' },
    `The Cursor plugin installs these rules. To add one by hand, save it in your project's \`.cursor/rules\` folder.\n\n${rules.join('\n\n')}`,
    src.rules.map((r) => r.file)
  );

  const agents = src.agents.map(({ file, text }) => {
    const { data, body } = parseFrontmatter(text);
    const name = data.name ?? basename(file, '.md');
    return `## ${name}\n\n${data.description ?? ''}\n\n${demote(takeTitle(body).body, 1)}`;
  });
  out['agents.mdx'] = page(
    { title: 'Agents', icon: 'users', description: 'Subagents the Stunt Double Claude Code plugin installs, each set up for one kind of job.' },
    `The [Claude Code plugin](/mcp/clients/claude-code-plugin) installs these subagents. Each one knows which Stunt Double tools to call for its job and how to report back.\n\n${mdx(agents.join('\n\n'), 'agents/')}`,
    src.agents.map((a) => a.file)
  );
  return out;
}

function readDirFiles(dir, sub, pick) {
  const path = join(dir, sub);
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .sort()
    .map((name) => pick(name))
    .filter(Boolean)
    .map((file) => ({ file: `${sub}/${file}`, text: readFileSync(join(path, file), 'utf8') }));
}

function writeMcp(at) {
  const dir = join(SOURCES_DIR, MCP);
  const pages = mcpPages(
    {
      readme: readFileSync(join(dir, 'README.md'), 'utf8'),
      skills: readDirFiles(dir, 'skills', (n) => (existsSync(join(dir, 'skills', n, 'SKILL.md')) ? `${n}/SKILL.md` : null)),
      rules: readDirFiles(dir, 'rules', (n) => (n.endsWith('.mdc') ? n : null)),
      agents: readDirFiles(dir, 'agents', (n) => (n.endsWith('.md') ? n : null)),
    },
    at
  );
  for (const p of MCP_GENERATED) rmSync(join(MCP_DIR, p), { recursive: true, force: true });
  for (const [path, content] of Object.entries(pages)) {
    mkdirSync(join(MCP_DIR, path, '..'), { recursive: true });
    writeFileSync(join(MCP_DIR, path), content);
  }
  console.log(`generated ${Object.keys(pages).length} files in mcp/ from ${at.repo}@${at.tag}`);
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
    if (name === MCP) {
      writeMcp({ repo, tag });
      continue;
    }
    const page = PAGES[name] ?? { title: name, description: `From ${repo}.` };
    const readme = readFileSync(join(SOURCES_DIR, name, 'README.md'), 'utf8');
    const note = `> Generated from [${repo}](https://github.com/${repo}/tree/${tag}) at release \`${tag}\`. Edit it there.\n\n`;
    writeFileSync(
      join(OUT_DIR, `${name}.mdx`),
      frontmatter(page) + note + readmeToMdx(readme, { repo, tag })
    );
    console.log(`generated _generated/${name}.mdx from ${repo}@${tag}`);
  }
  const overviews = names.filter((n) => n !== MCP);
  if (!overviews.length) return rmSync(OUT_DIR, { recursive: true, force: true });
  writeFileSync(
    join(OUT_DIR, 'meta.json'),
    `${JSON.stringify({ title: 'Reference', pages: overviews }, null, 2)}\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
