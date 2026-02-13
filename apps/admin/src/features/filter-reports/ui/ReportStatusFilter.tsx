"use client";

import { REPORT_STATUS_LABELS } from "@/shared/config";
import { FacetedFilter } from "@/shared/ui/faceted-filter";

type ReportStatusFilterProps = {
  selectedValues: string[];
};

const options = Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ReportStatusFilter({
  selectedValues,
}: ReportStatusFilterProps) {
  return (
    <FacetedFilter
      title="ステータス"
      paramKey="status"
      options={options}
      selectedValues={selectedValues}
      basePath="/reports"
    />
  );
}
