"use client";

import { REPORT_TARGET_TYPE_LABELS } from "@/shared/config";
import { FacetedFilter } from "@/shared/ui/faceted-filter";

type ReportTargetTypeFilterProps = {
  selectedValues: string[];
};

const options = Object.entries(REPORT_TARGET_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export function ReportTargetTypeFilter({
  selectedValues,
}: ReportTargetTypeFilterProps) {
  return (
    <FacetedFilter
      title="対象タイプ"
      paramKey="target_type"
      options={options}
      selectedValues={selectedValues}
      basePath="/reports"
    />
  );
}
