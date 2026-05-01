"use client";

import Link from "next/link";

type NewsCardProps = {
  _id: string;
  Headline: string;
  summary?: string;
  story?: string;
  source?: string;
  link?: string;
  ingested_at?: string;
  sentiment?: string;
  impact?: string;
  companies?: string[];
  sector?: string;
  category?: string;
};

export default function NewsCard(props: NewsCardProps) {
  const {
    _id,
    Headline,
    summary,
    story,
    source,
    link,
    ingested_at,
    sentiment,
    impact,
    companies,
    sector,
    category,
  } = props;

  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment)
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    if (sentiment === "Bullish")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    if (sentiment === "Bearish")
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
  };

  const getImpactColor = (impact?: string) => {
    if (!impact) return "bg-gray-100 text-gray-800";
    if (impact === "High")
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    if (impact === "Medium")
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
  };

  return (
    <article className="h-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111111] p-5 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <Link href={`/articles/${_id}`} className="flex-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {Headline || "Untitled"}
          </h2>
        </Link>
      </div>

      {/* Summary/Story */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
        {summary ||
          story?.replace(/<[^>]*>/g, "").substring(0, 150) ||
          "No summary available."}
      </p>

      {/* Tags/Badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        {sentiment && (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${getSentimentColor(sentiment)}`}
          >
            {sentiment}
          </span>
        )}
        {impact && (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${getImpactColor(impact)}`}
          >
            {impact} Impact
          </span>
        )}
        {category && (
          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
            {category}
          </span>
        )}
        {sector && (
          <Link
            href={`/sectors?sector=${encodeURIComponent(sector)}`}
            className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100 hover:opacity-80"
          >
            {sector}
          </Link>
        )}
      </div>

      {/* Companies */}
      {companies && companies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {companies.slice(0, 3).map((comp, idx) => (
            <Link
              key={idx}
              href={`/search?q=${encodeURIComponent(comp)}`}
              className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 hover:opacity-80"
            >
              {comp}
            </Link>
          ))}
          {companies.length > 3 && (
            <span className="text-xs px-2 py-1 text-slate-500">
              +{companies.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        <span className="truncate">{source || "Unknown"}</span>
        <time>
          {ingested_at
            ? new Date(ingested_at).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </time>
      </div>

      {/* Action Link */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read on PTI →
        </a>
      )}
    </article>
  );
}
