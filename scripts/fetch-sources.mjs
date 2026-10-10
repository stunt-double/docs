// Fetch each repo in sources.json at its highest semver release tag into
// .sources/<name>. Never reads a branch: no tag means the build stops here.
//
//   node scripts/fetch-sources.mjs            every source
//   node scripts/fetch-sources.mjs stuntkit   just the named ones

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCES_DIR = join(ROOT, '.sources');

const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)$/;

/** The highest `vX.Y.Z` (or `X.Y.Z`) tag in `git ls-remote --tags --refs` output. Pre-releases are skipped. */
export function highestSemverTag(lsRemoteOutput) {
  let best = null;
  for (const line of lsRemoteOutput.split('\n')) {
    const tag = line.split('\t')[1]?.replace(/^refs\/tags\//, '').trim();
    const m = tag && SEMVER.exec(tag);
    if (!m) continue;
    const v = m.slice(1).map(Number);
    if (!best || compare(v, best.v) > 0) best = { tag, v };
  }
  return best?.tag ?? null;
}

function compare(a, b) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

function main() {
  const sources = JSON.parse(readFileSync(join(ROOT, 'sources.json'), 'utf8'));
  const only = process.argv.slice(2);
  const names = only.length ? only : Object.keys(sources);
  const manifestPath = join(SOURCES_DIR, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  mkdirSync(SOURCES_DIR, { recursive: true });

  const failures = [];
  for (const name of names) {
    const source = sources[name];
    if (!source) {
      failures.push(`${name}: not in sources.json`);
      continue;
    }
    const url = `https://github.com/${source.repo}.git`;
    const tag = highestSemverTag(git(['ls-remote', '--tags', '--refs', url]));
    if (!tag) {
      failures.push(`${name}: ${source.repo} has no semver release tag (refusing to fall back to a branch)`);
      continue;
    }
    const dest = join(SOURCES_DIR, name);
    rmSync(dest, { recursive: true, force: true });
    git(['-c', 'advice.detachedHead=false', 'clone', '--quiet', '--depth', '1', '--branch', tag, url, dest]);
    const missing = source.paths.filter((p) => !existsSync(join(dest, p)));
    if (missing.length) {
      failures.push(`${name}@${tag}: missing ${missing.join(', ')}`);
      continue;
    }
    manifest[name] = { repo: source.repo, tag };
    console.log(`fetched ${name} ${source.repo}@${tag}`);
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  if (failures.length) {
    console.error(`\nfetch-sources failed:\n  ${failures.join('\n  ')}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
