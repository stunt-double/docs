import { execFileSync } from "node:child_process";

type Git = (args: string[]) => string;

const runGit: Git = (args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

/**
 * Last-commit dates for files, or none at all when the history cannot be
 * trusted. Vercel clones shallow, where every file would date to the one
 * fetched commit, so a shallow (or missing) repository returns an empty
 * lookup and the sitemap leaves `lastModified` out rather than guess.
 * Untracked files (the generated reference pages) get no date either.
 */
export function gitDates(
  git: Git = runGit,
): (file: string) => Date | undefined {
  try {
    if (git(["rev-parse", "--is-shallow-repository"]) !== "false")
      return () => undefined;
  } catch {
    return () => undefined;
  }
  return (file) => {
    try {
      const iso = git(["log", "-1", "--format=%cI", "--", file]);
      return iso ? new Date(iso) : undefined;
    } catch {
      return undefined;
    }
  };
}
