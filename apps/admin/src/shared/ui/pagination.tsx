"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  basePath: string;
};

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  perPage,
  basePath,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalCount);

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    });
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-gray-500">
        全{totalCount}件中 {from}〜{to}件を表示
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((pageNum, i) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="icon-sm"
              onClick={() => handlePageChange(pageNum as number)}
              disabled={isPending}
            >
              {pageNum}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * ページ番号の配列を生成する
 * 例: [1, "...", 4, 5, 6, "...", 10]
 */
function getPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // 常に1ページ目を表示
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // 現在のページの前後
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // 常に最後のページを表示
  pages.push(total);

  return pages;
}
