"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  _id: string;
  Headline?: string;
  story?: string;
  summary?: string;
  source?: string;
  link?: string;
  PublishedAt?: string;
  ingested_at?: string;
  sentiment?: string;
  impact?: string;
  companies?: string[];
  sector?: string;
  sector_market?: string;
  global?: boolean;
  commodities?: boolean;
};

export default function Dashboard() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    console.log("📱 [Dashboard] Fetching news from /api/news...");
    fetch("/api/news")
      .then((r) => {
        console.log("📡 [Dashboard] Response status:", r.status);
        return r.json();
      })
      .then((data) => {
        console.log("📊 [Dashboard] Response data:", data);
        if (!mounted) return;
        if (data?.ok) {
          console.log(`✅ [Dashboard] Setting ${data.data?.length || 0} items`);
          setItems(data.data || []);
        } else {
          console.error("❌ [Dashboard] API returned error:", data?.error);
        }
      })
      .catch((err) => {
        console.error("❌ [Dashboard] Fetch error:", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">
            News Dashboard
          </h1>
          <div className="text-sm text-gray-600 dark:text-zinc-400">
            {loading ? "Loading…" : `${items.length} articles`}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && !loading ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-600 dark:border-zinc-800">
              No articles found in the database.
            </div>
          ) : (
            items.map((it) => (
              <article
                key={it._id}
                className="rounded-lg bg-white dark:bg-[#111111] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <a href={it.link || "#"} target="_blank" rel="noreferrer">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">
                    {it.Headline || "Untitled"}
                  </h2>
                </a>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {it.summary ||
                    it.story?.substring(0, 150) ||
                    "No summary available."}
                </p>
                {(it.sentiment || it.impact) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {it.sentiment && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          it.sentiment === "positive"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : it.sentiment === "negative"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                        }`}
                      >
                        {it.sentiment}
                      </span>
                    )}
                    {it.impact && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        Impact: {it.impact}
                      </span>
                    )}
                  </div>
                )}
                {it.companies?.length ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    Companies: {it.companies.join(", ")}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                  <span>{it.source || "Unknown source"}</span>
                  <time>
                    {it.ingested_at
                      ? new Date(it.ingested_at).toLocaleString()
                      : it.PublishedAt
                        ? new Date(it.PublishedAt).toLocaleString()
                        : "-"}
                  </time>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
