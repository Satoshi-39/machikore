"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

type DateRangeFilterProps = {
  title: string;
  fromParamKey: string;
  toParamKey: string;
  currentFrom?: string;
  currentTo?: string;
  basePath: string;
};

const presets = [
  { label: "過去7日", days: 7 },
  { label: "過去30日", days: 30 },
  { label: "過去90日", days: 90 },
] as const;

function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getPresetFrom(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDateForInput(date);
}

export function DateRangeFilter({
  title,
  fromParamKey,
  toParamKey,
  currentFrom,
  currentTo,
  basePath,
}: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState(currentFrom ?? "");
  const [pendingTo, setPendingTo] = useState(currentTo ?? "");

  const isFiltered = Boolean(currentFrom || currentTo);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setPendingFrom(currentFrom ?? "");
      setPendingTo(currentTo ?? "");
    }
    setOpen(nextOpen);
  };

  const handlePreset = (days: number) => {
    setPendingFrom(getPresetFrom(days));
    setPendingTo(formatDateForInput(new Date()));
  };

  const handleApply = () => {
    setOpen(false);

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (pendingFrom) {
      params.set(fromParamKey, pendingFrom);
    } else {
      params.delete(fromParamKey);
    }

    if (pendingTo) {
      params.set(toParamKey, pendingTo);
    } else {
      params.delete(toParamKey);
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const handleReset = () => {
    setPendingFrom("");
    setPendingTo("");
  };

  const hasChanges =
    pendingFrom !== (currentFrom ?? "") || pendingTo !== (currentTo ?? "");

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
        >
          <CalendarDays className="size-3.5 opacity-50" />
          {title}
          {isFiltered && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1.5 text-xs">
              1
            </Badge>
          )}
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        {/* プリセット */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {presets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => handlePreset(preset.days)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs hover:bg-accent",
                pendingFrom === getPresetFrom(preset.days) &&
                  pendingTo === formatDateForInput(new Date()) &&
                  "border-primary bg-primary/10 font-medium"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* カスタム日付入力 */}
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">開始日</label>
            <input
              type="date"
              value={pendingFrom}
              onChange={(e) => setPendingFrom(e.target.value)}
              className="mt-0.5 w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">終了日</label>
            <input
              type="date"
              value={pendingTo}
              onChange={(e) => setPendingTo(e.target.value)}
              className="mt-0.5 w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t pt-2">
          {(pendingFrom || pendingTo) && (
            <button
              onClick={handleReset}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"
            >
              リセット
            </button>
          )}
          <Button
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            適用
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
