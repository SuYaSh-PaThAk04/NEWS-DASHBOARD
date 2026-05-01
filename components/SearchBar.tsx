"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search headlines, companies, sectors..."
          className="w-full px-4 py-2.5 pl-10 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:opacity-75"
        >
          ⏎
        </button>
      </div>
    </form>
  );
}
