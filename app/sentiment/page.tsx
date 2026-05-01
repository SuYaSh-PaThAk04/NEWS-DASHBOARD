"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

export default function SentimentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sentiment, setSentiment] = useState<"Bullish" | "Bearish" | "Neutral">(
    "Bullish",
  );

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch(`/api/news?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.ok) {
          const filtered = (data.data || []).filter(
            (item: NewsItem) => item.sentiment === sentiment,
          );
          setItems(filtered);
          if (data.pagination) {
            setPagination({
              ...data.pagination,
              total: (data.data || []).filter(
                (item: NewsItem) => item.sentiment === sentiment,
              ).length,
            });
          }
        }
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [sentiment, page]);

  const sentiments = [
    {
      value: "Bullish" as const,
      label: "📈 Bullish",
      color: "from-green-600 to-emerald-600",
    },
    {
      value: "Bearish" as const,
      label: "📉 Bearish",
      color: "from-red-600 to-rose-600",
    },
    {
      value: "Neutral" as const,
      label: "➡️ Neutral",
      color: "from-slate-600 to-slate-700",
    },
  ];

  const currentColor =
    sentiments.find((s) => s.value === sentiment)?.color ||
    "from-blue-600 to-blue-700";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      <section
        className={`border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r ${currentColor} py-12`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            😊 Sentiment Analysis
          </h1>
          <p className="text-white/80">
            Filter news by AI-detected market sentiment
          </p>
        </div>
      </section>

      {/* Sentiment Selector */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111111] sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap gap-3">
            {sentiments.map((s) => (
              <button
                key={s.value}
                onClick={() => setSentiment(s.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  sentiment === s.value
                    ? `bg-gradient-to-r ${s.color} text-white shadow-lg`
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {sentiment} News
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {loading
              ? "Loading…"
              : pagination
                ? `Page ${pagination.page} of ${pagination.pages}`
                : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && !loading ? (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No {sentiment.toLowerCase()} news found.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-slate-500 dark:text-slate-400">
                Loading...
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
      </section>
    </div>
  );
}
