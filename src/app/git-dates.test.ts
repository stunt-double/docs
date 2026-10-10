import assert from "node:assert/strict";
import { test } from "node:test";

import { gitDates } from "./git-dates.ts";

test("dates a tracked file from its last commit", () => {
  const lookup = gitDates((args) =>
    args[0] === "rev-parse"
      ? "false"
      : args.at(-1) === "a.mdx"
        ? "2026-10-01T10:00:00+00:00"
        : "",
  );
  assert.equal(lookup("a.mdx")?.toISOString(), "2026-10-01T10:00:00.000Z");
  assert.equal(lookup("untracked.mdx"), undefined);
});

test("omits every date on a shallow clone", () => {
  const lookup = gitDates((args) =>
    args[0] === "rev-parse" ? "true" : "2026-10-01T10:00:00Z",
  );
  assert.equal(lookup("a.mdx"), undefined);
});

test("omits every date without a repository", () => {
  const lookup = gitDates(() => {
    throw new Error("not a git repository");
  });
  assert.equal(lookup("a.mdx"), undefined);
});
