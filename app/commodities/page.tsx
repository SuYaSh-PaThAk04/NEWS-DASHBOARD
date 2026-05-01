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

export default function CommoditiesPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [items, setItems] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch(`/api/news/category/commodities?page=${page}&limit=20`)
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
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-orange-600 to-amber-600 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🛢 Commodities
          </h1>
          <p className="text-orange-100">
            Oil, Gold, and other commodity market news
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Market Updates
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
                No commodity news found.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-slate-500 dark:text-slate-400">
                Loading...
              </div>
            </div>
          ) : (
            items.map((item) => <NewsCard key={item._id} {...item} />)
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
