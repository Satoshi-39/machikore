"use client";

import { DateRangeFilter } from "@/shared/ui/date-range-filter";

type UserDateFilterProps = {
  currentFrom?: string;
  currentTo?: string;
  basePath: string;
};

export function UserDateFilter({
  currentFrom,
  currentTo,
  basePath,
}: UserDateFilterProps) {
  return (
    <DateRangeFilter
      title="登録日"
      fromParamKey="date_from"
      toParamKey="date_to"
      currentFrom={currentFrom}
      currentTo={currentTo}
      basePath={basePath}
    />
  );
}
