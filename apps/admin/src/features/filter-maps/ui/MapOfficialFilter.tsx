"use client";

import { MAP_OFFICIAL_LABELS } from "@/shared/config";
import { FacetedFilter } from "@/shared/ui/faceted-filter";

type MapOfficialFilterProps = {
  selectedValues: string[];
  basePath: string;
};

const options = Object.entries(MAP_OFFICIAL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function MapOfficialFilter({
  selectedValues,
  basePath,
}: MapOfficialFilterProps) {
  return (
    <FacetedFilter
      title="公式"
      paramKey="official"
      options={options}
      selectedValues={selectedValues}
      basePath={basePath}
    />
  );
}
