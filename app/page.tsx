"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import Pagination, { PaginationData } from "../components/Pagination";
import StatCard from "../components/StatCard";

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
  category?: string;
  global?: boolean;
  commodities?: boolean;
};

type Stats = {
  total: number;
  global: number;
  commodities: number;
  bullish: number;
  bearish: number;
};

export default function Home() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [items, setItems] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      fetch(`/api/news?page=${page}&limit=20`).then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
    ])
      .then(([newsData, statsData]) => {
        if (!mounted) return;
        if (newsData?.ok) {
          setItems(newsData.data || []);
          setPagination(newsData.pagination);
        }
        if (statsData?.ok) {
          setStats(statsData.data);
        }
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Financial News Intelligence
          </h1>
          <p className="text-blue-100 mb-6">
            AI-powered news aggregation with sentiment analysis and market
            impact scoring
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
            Dashboard Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatCard
              label="Total Articles"
              value={stats.total}
              icon="📰"
              color="blue"
            />
            <StatCard
              label="Global News"
              value={stats.global}
              icon="🌍"
              color="green"
            />
            <StatCard
              label="Commodities"
              value={stats.commodities}
              icon="🛢"
              color="orange"
            />
            <StatCard
              label="Bullish"
              value={stats.bullish}
              icon="📈"
              color="green"
            />
            <StatCard
              label="Bearish"
              value={stats.bearish}
              icon="📉"
              color="red"
            />
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Latest News
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
                No articles found. Try adjusting your filters.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-slate-500 dark:text-slate-400">
                Loading articles...
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
