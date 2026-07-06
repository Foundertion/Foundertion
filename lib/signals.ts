export interface HNSignal {
  title: string;
  url: string;
  points: number;
  numComments: number;
  createdAt: string;
}

/**
 * Fetches real, verifiable discussion signals from Hacker News via the
 * public Algolia Search API (no auth required, no key needed).
 * Used to ground the "REAL SIGNALS" section of the idea validator in
 * actual data instead of LLM-invented platform patterns.
 *
 * Docs: https://hn.algolia.com/api
 */
export async function fetchHNSignals(query: string, limit = 5): Promise<HNSignal[]> {
  try {
    const cleanQuery = query.slice(0, 120); // keep query short and relevant
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(cleanQuery)}&tags=story&hitsPerPage=${limit}`;

    const res = await fetch(url, {
      // Algolia HN search is public but a short timeout keeps generation snappy
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const hits = Array.isArray(data?.hits) ? data.hits : [];

    return hits
      .filter((h: any) => h.title) // skip malformed/comment-only hits
      .map((h: any) => ({
        title: h.title as string,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points || 0,
        numComments: h.num_comments || 0,
        createdAt: h.created_at || "",
      }));
  } catch {
    // Network failure, timeout, or malformed response — fail silently.
    // The validator must still work even if the signal source is down.
    return [];
  }
}

/** Formats HN signals into a compact text block to inject into the LLM prompt. */
export function formatSignalsForPrompt(signals: HNSignal[]): string {
  if (signals.length === 0) {
    return "REAL_SIGNALS_DATA: No related Hacker News discussions found for this query.";
  }
  const lines = signals.map(
    (s, i) => `${i + 1}. "${s.title}" — ${s.points} points, ${s.numComments} comments — ${s.url}`
  );
  return `REAL_SIGNALS_DATA (from Hacker News, live search — these are the ONLY real signals available, do not invent others):\n${lines.join("\n")}`;
}
