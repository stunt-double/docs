/**
 * What the docs tell AI agents about themselves: the `/llms.txt` header and
 * `/.well-known/agents.md`. Pure apart from `./site.ts`, so `node --test` can
 * load it directly.
 */
import { GITHUB_URL, MCP_URL, SITE_URL } from './site.ts';

export const SUMMARY =
  'Stunt Double deploys AI user personas (actors) that drive real browsers through real products, returning evidence-backed results in minutes. These docs cover actors, checklists, interviews, workflows, integrations, the MCP server and StuntKit.';

/** How to read the docs as Markdown, shared by llms.txt and agents.md. */
const READING = `- Every page has a Markdown twin: append \`.md\` to its URL (\`${SITE_URL}/guides/figma.md\`), or request the page with \`Accept: text/markdown\`.
- [llms.txt](${SITE_URL}/llms.txt) indexes every page; [llms-full.txt](${SITE_URL}/llms-full.txt) is every page in one file.
- [sitemap.xml](${SITE_URL}/sitemap.xml) lists every page with its last change.`;

/** A page path's Markdown twin, absolute. */
export function markdownUrl(path: string): string {
  const clean = path.replace(/\/+$/, '');
  return `${SITE_URL}${clean || '/index'}.md`;
}

/**
 * The `/llms.txt` index: a summary and reading notes over the Fumadocs page
 * list, with its title swapped for ours and each docs link pointed at the
 * page's absolute Markdown twin.
 */
export function llmsTxt(index: string): string {
  const list = index
    .replace(/^# .*\n+(> .*\n+)?/, '')
    .replace(/\]\((\/[^)#\s]*)(#[^)\s]*)?\)/g, (_, path: string, hash = '') => `](${markdownUrl(path)}${hash})`);
  return `# Stunt Double Docs

> ${SUMMARY}

${READING}
- The MCP server is at \`${MCP_URL}\` (Streamable HTTP, OAuth 2.1). [Connect a client](${markdownUrl('/mcp/connect')}).
- Source: [${GITHUB_URL.replace('https://', '')}](${GITHUB_URL}).

## Docs
${list.trimEnd()}
`;
}

/** `/.well-known/agents.md`: when to use the docs and how to act on them. */
export const AGENTS_MD = `# Stunt Double Docs: agent guide

> ${SUMMARY}

## When to use these docs

Use them when a person asks how to:

- Test a website, prototype or preview deployment with AI user personas (actors).
- Write or run checklists that verify a flow and return evidence (screenshots, transcripts, verdicts).
- Run user research interviews with persona participants.
- Automate re-runs on deploys, pull requests or a schedule (workflows).
- Connect Stunt Double to GitHub, Vercel, Figma, Linear or Slack, or collect feedback with the widget.
- Drive Stunt Double from an AI client over MCP, or use StuntKit's open source browser tools.

## Reading the docs

${READING}

## Acting for a user

- The MCP server is \`${MCP_URL}\`, Streamable HTTP. Point any MCP client at it; there are no API keys.
- Access is OAuth 2.1 with three scopes: \`mcp:read\`, \`mcp:write\` and \`mcp:run\` (starts runs, which use the workspace allowance). A client that asks for none gets all three.
- Start with \`list_workspaces\`, then \`list_projects\`, and reuse existing actors and checklists before creating new ones. Runs are asynchronous: poll the matching getter until the status is terminal.
- Setup per client: ${markdownUrl('/mcp/connect')}. Every tool: ${markdownUrl('/mcp/tools')}. Scopes and limits: ${markdownUrl('/api')}.

## Key pages

- [Quickstart](${markdownUrl('/getting-started')})
- [Core concepts](${markdownUrl('/concepts')})
- [Tutorials](${markdownUrl('/tutorials')})
- [Integrations](${markdownUrl('/integrations')})
- [MCP server](${markdownUrl('/mcp')})
- [StuntKit](${markdownUrl('/stuntkit')})

## About

- Product: https://www.stuntdouble.io
- Docs source: ${GITHUB_URL} (content CC BY 4.0, code MIT)
- MCP server source: https://github.com/stunt-double/stuntdouble-mcp
`;
