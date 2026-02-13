"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { serializeFilterParam } from "@/shared/lib/filter-params";
import { cn } from "@/shared/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
};

type FacetedFilterProps = {
  title: string;
  paramKey: string;
  options: FilterOption[];
  selectedValues: string[];
  basePath: string;
};

export function FacetedFilter({
  title,
  paramKey,
  options,
  selectedValues,
  basePath,
}: FacetedFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allValues = options.map((o) => o.value);

  // フィルター未適用（selectedValues が空）= 全選択として扱う
  const isUnfiltered = selectedValues.length === 0;
  const effectiveValues = isUnfiltered ? allValues : selectedValues;

  // Popover 内のローカル選択状態（適用ボタンを押すまでURLに反映しない）
  const [pendingValues, setPendingValues] = useState(effectiveValues);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // 開く時に現在の確定値で初期化
      setPendingValues(effectiveValues);
    }
    setOpen(nextOpen);
  };

  const handleToggle = (value: string) => {
    setPendingValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    setOpen(false);

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    // 全選択 = フィルターなし（URLパラメータを付けない）
    const isAllSelected = pendingValues.length === allValues.length;
    if (isAllSelected) {
      params.delete(paramKey);
    } else {
      const serialized = serializeFilterParam(pendingValues);
      if (serialized) {
        params.set(paramKey, serialized);
      } else {
        params.delete(paramKey);
      }
    }

    // フィルター変更時はページを1にリセット
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const handleReset = () => {
    // リセット = 全選択に戻す
    setPendingValues(allValues);
  };

  // 変更があるか判定
  const pendingSorted = [...pendingValues].sort();
  const effectiveSorted = [...effectiveValues].sort();
  const hasChanges =
    pendingSorted.length !== effectiveSorted.length ||
    pendingSorted.some((v, i) => v !== effectiveSorted[i]);

  // 絞り込み中かどうか（トリガーボタンのバッジ表示用）
  const activeFilterCount = isUnfiltered ? 0 : selectedValues.length;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
        >
          {title}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = pendingValues.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                  isSelected && "font-medium"
                )}
              >
                <div
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                </div>
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-2 border-t pt-2">
          {pendingValues.length < allValues.length && (
            <button
              onClick={handleReset}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"
            >
              全選択
            </button>
          )}
          <Button
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={handleApply}
            disabled={!hasChanges || pendingValues.length === 0}
          >
            適用
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
