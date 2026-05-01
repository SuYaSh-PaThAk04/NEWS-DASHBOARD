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

const MAJOR_SECTORS = [
  "Banking and Financial Services",
  "Information Technology",
  "Pharmaceuticals",
  "Energy",
  "Manufacturing",
  "Telecom",
  "Retail",
];

export default function SectorsPage() {
  const searchParams = useSearchParams();
  const paramSector = searchParams.get("sector");
  const page = parseInt(searchParams.get("page") || "1");

  const [selectedSector, setSelectedSector] = useState(
    paramSector || MAJOR_SECTORS[0],
  );
  const [items, setItems] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch(
      `/api/news/sector/${encodeURIComponent(selectedSector)}?page=${page}&limit=20`,
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
  }, [selectedSector, page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            📊 Sector News
          </h1>
          <p className="text-purple-100">
            Industry-specific market insights and developments
          </p>
        </div>
      </section>

      {/* Sector Selector */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111111] sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {MAJOR_SECTORS.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSector === sector
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {selectedSector} News
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
                No news found for this sector.
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
