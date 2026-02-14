"use client";

import { MAP_VISIBILITY_LABELS } from "@/shared/config";
import { FacetedFilter } from "@/shared/ui/faceted-filter";

type SpotVisibilityFilterProps = {
  selectedValues: string[];
  basePath: string;
};

const options = Object.entries(MAP_VISIBILITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function SpotVisibilityFilter({
  selectedValues,
  basePath,
}: SpotVisibilityFilterProps) {
  return (
    <FacetedFilter
      title="公開状態"
      paramKey="visibility"
      options={options}
      selectedValues={selectedValues}
      basePath={basePath}
    />
  );
}
