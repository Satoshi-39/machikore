"use client";

import { USER_PREMIUM_LABELS } from "@/shared/config";
import { FacetedFilter } from "@/shared/ui/faceted-filter";

type UserPremiumFilterProps = {
  selectedValues: string[];
  basePath: string;
};

const options = Object.entries(USER_PREMIUM_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function UserPremiumFilter({
  selectedValues,
  basePath,
}: UserPremiumFilterProps) {
  return (
    <FacetedFilter
      title="プラン"
      paramKey="premium"
      options={options}
      selectedValues={selectedValues}
      basePath={basePath}
    />
  );
}
