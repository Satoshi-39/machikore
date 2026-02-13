"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, X } from "lucide-react";

type SearchFormProps = {
  placeholder?: string;
  basePath: string;
};

export function SearchForm({ placeholder = "検索...", basePath }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams?.get("q") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      // 検索時はページを1に戻す
      params.delete("page");
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    });
  };

  const handleClear = () => {
    setQuery("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.delete("q");
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "検索中..." : "検索"}
      </Button>
    </form>
  );
}
