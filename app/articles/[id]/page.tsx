"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
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
  impact_rationale?: string;
  companies?: string[];
  sector?: string;
  sector_market?: string;
  category?: string;
  subcategory?: string;
  Byline?: string;
  Copyrights?: string;
  commodities?: boolean;
  global?: boolean;
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/news/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.ok) {
          setArticle(data.data);
        } else {
          setError("Article not found");
        }
      })
      .catch((err) => {
        if (mounted) setError(String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a] flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400">
          Loading article...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950 p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Error
            </h2>
            <p className="text-red-700 dark:text-red-300 mt-2">
              {error || "Article not found"}
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-red-600 dark:text-red-400 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      {/* Header */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111111] py-8">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-75 mb-6"
          >
            ← Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
            {article.Headline}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>📰 {article.source || "Unknown Source"}</span>
            <span>•</span>
            <span>
              {article.ingested_at
                ? new Date(article.ingested_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown Date"}
            </span>
            {article.Byline && (
              <>
                <span>•</span>
                <span>By {article.Byline}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        {/* Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {article.sentiment && (
            <div
              className={`rounded-lg p-4 ${
                article.sentiment === "Bullish"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : article.sentiment === "Bearish"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-yellow-100 dark:bg-yellow-900/30"
              }`}
            >
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Sentiment
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
                {article.sentiment}
              </p>
            </div>
          )}
          {article.impact && (
            <div className="rounded-lg p-4 bg-blue-100 dark:bg-blue-900/30">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Impact
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
                {article.impact}
              </p>
            </div>
          )}
          {article.sector && (
            <div className="rounded-lg p-4 bg-purple-100 dark:bg-purple-900/30">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Sector
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1 truncate">
                {article.sector}
              </p>
            </div>
          )}
          {article.category && (
            <div className="rounded-lg p-4 bg-indigo-100 dark:bg-indigo-900/30">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Category
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1 truncate">
                {article.category}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {article.summary && (
          <div className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              AI Summary
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {article.summary}
            </p>
          </div>
        )}

        {/* Impact Rationale */}
        {article.impact_rationale && (
          <div className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Why {article.impact} Impact?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {article.impact_rationale}
            </p>
          </div>
        )}

        {/* Full Story */}
        {article.story && (
          <div className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Full Story
            </h3>
            <div
              className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: article.story }}
            />
          </div>
        )}

        {/* Companies */}
        {article.companies && article.companies.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Related Companies
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.companies.map((company, idx) => (
                <Link
                  key={idx}
                  href={`/search?q=${encodeURIComponent(company)}`}
                  className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:opacity-75 transition-opacity text-sm font-medium"
                >
                  {company}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {article.global && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">
              🌍 Global
            </span>
          )}
          {article.commodities && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-medium">
              🛢 Commodities
            </span>
          )}
          {article.subcategory && (
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium">
              {article.subcategory}
            </span>
          )}
        </div>

        {/* Source Link */}
        {article.link && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Source
            </p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-75 transition-opacity font-medium"
            >
              Read on PTI News →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
