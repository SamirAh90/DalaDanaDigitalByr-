import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  decodeQuoteSelection,
  encodeQuoteSelection,
  readStoredQuote,
  validateQuoteSelection,
  writeStoredQuote,
} from "@/lib/quote";
import type { QuoteSelection } from "@/lib/quote";

/** SSR-safe hydration. URL wins over storage; only validated, non-personal choices persist. */
export function useQuoteSelection(fallback: QuoteSelection | null = null) {
  const searchString = useLocation({ select: (location) => location.searchStr });
  const navigate = useNavigate();
  const [selection, updateSelection] = useState<QuoteSelection | null>(fallback);
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const raw = new URLSearchParams(searchString).get("quote");
    const fromUrl = decodeQuoteSelection(raw);
    setInvalid(raw !== null && fromUrl === null);
    const next = fromUrl ?? readStoredQuote() ?? fallback;
    updateSelection(next);
    if (next) writeStoredQuote(next);
    setReady(true);
  }, [searchString, fallback]);

  const setSelection = useCallback(
    (input: QuoteSelection) => {
      const next = validateQuoteSelection(input);
      if (!next) return;
      updateSelection(next);
      writeStoredQuote(next);
      void navigate({ to: ".", search: { quote: encodeQuoteSelection(next) }, replace: true });
    },
    [navigate],
  );

  return { selection, setSelection, ready, invalid };
}
