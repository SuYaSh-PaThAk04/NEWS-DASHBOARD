"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard";
import Pagination, { PaginationData } from "../../components/Pagination";

type NewsItem = {
  _id: string;
  Headline?: string;
  story?: string;
  summary?: string;
  source?: string;
  link?: string;
  ingested_at?: string;
  sentiment?: string;
  impact?: string;
  companies?: string[];
  sector?: string;
  category?: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [items, setItems] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (!query) {
      setItems([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    fetch(
      `/api/news/search?q=${encodeURIComponent(query)}&page=${page}&limit=20`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.ok) {
          setItems(data.data || []);
          setPagination(data.pagination);
        }
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [query, page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-600 to-blue-600 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            🔍 Search News
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {query ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Results for "{query}"
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {loading
                  ? "Searching…"
                  : pagination
                    ? `Found ${pagination.total} results`
                    : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.length === 0 && !loading ? (
                <div className="col-span-full rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No articles found matching "{query}". Try a different search
                    term.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="text-slate-500 dark:text-slate-400">
                    Searching...
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <NewsCard
                    key={item._id}
                    _id={item._id}
                    Headline={item.Headline || "Untitled"}
                    summary={item.summary}
                    story={item.story}
                    source={item.source}
                    link={item.link}
                    ingested_at={item.ingested_at}
                    sentiment={item.sentiment}
                    impact={item.impact}
                    companies={item.companies}
                    sector={item.sector}
                    category={item.category}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination && items.length > 0 && (
              <Pagination pagination={pagination} />
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Enter a search term to find relevant articles.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
