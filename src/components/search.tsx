"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useEffect, useMemo } from "react";

const QUERY_PARAM = "q";

function queryFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(QUERY_PARAM);
}

/**
 * Fumadocs' default search dialog, plus one thing: it opens on `?q=` with the
 * query filled in. That is the WebSite `SearchAction` target in the root
 * layout's JSON-LD (`/?q={search_term_string}`).
 */
export function DocsSearchDialog(props: SharedProps) {
  const client = useMemo(() => fetchClient({}), []);
  const search = useDocsSearch({ client });
  const { setSearch } = search;

  useEffect(() => {
    if (!props.open) return;
    const q = queryFromUrl();
    if (q) setSearch(q);
  }, [props.open, setSearch]);

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
      </SearchDialogContent>
    </SearchDialog>
  );
}

/** Opens the search dialog when the page loads with `?q=`. */
export function OpenSearchFromUrl() {
  const { setOpenSearch } = useSearchContext();
  useEffect(() => {
    if (queryFromUrl()) setOpenSearch(true);
  }, [setOpenSearch]);
  return null;
}
