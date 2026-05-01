"use client";

import { useRouter, useSearchParams } from "next/navigation";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginationProps {
  pagination: PaginationData;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);

    onPageChange?.(newPage);
  };

  const { page, pages, total, limit, hasNext, hasPrev } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Show 2 pages on each side of current
    const left = Math.max(1, page - delta);
    const right = Math.min(pages, page + delta);

    const range: (number | string)[] = [];

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < pages) {
      if (right < pages - 1) range.push("...");
      range.push(pages);
    }

    return range;
  };

  if (pages <= 1) return null; // No pagination needed

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      {/* Stats */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-semibold">{(page - 1) * limit + 1}</span>{" "}
        to{" "}
        <span className="font-semibold">{Math.min(page * limit, total)}</span>{" "}
        of <span className="font-semibold">{total.toLocaleString()}</span>{" "}
        results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            hasPrev
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed opacity-50"
          }`}
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((num, idx) => {
            if (num === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-2 text-slate-600 dark:text-slate-400"
                >
                  …
                </span>
              );
            }

            const pageNum = num as number;
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            hasNext
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed opacity-50"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Page Jump Input */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">
          Go to page:
        </label>
        <input
          type="number"
          min="1"
          max={pages}
          defaultValue={page}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = parseInt((e.target as HTMLInputElement).value);
              if (val >= 1 && val <= pages) {
                handlePageChange(val);
              }
            }
          }}
          className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm"
        />
      </div>
    </div>
  );
}
