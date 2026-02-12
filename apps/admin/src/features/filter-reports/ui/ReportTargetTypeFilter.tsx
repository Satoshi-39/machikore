"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { REPORT_TARGET_TYPE_LABELS } from "@/shared/config";

type ReportTargetTypeFilterProps = {
  currentStatus?: string;
  currentTargetType?: string;
};

const targetTypes = [
  { value: "", label: "すべて" },
  ...Object.entries(REPORT_TARGET_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function ReportTargetTypeFilter({
  currentStatus,
  currentTargetType,
}: ReportTargetTypeFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTargetTypeChange = (targetType: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentStatus) {
        params.set("status", currentStatus);
      }
      if (targetType) {
        params.set("target_type", targetType);
      }
      const queryString = params.toString();
      router.push(queryString ? `/reports?${queryString}` : "/reports");
    });
  };

  return (
    <div className="flex items-center gap-1">
      {targetTypes.map((type) => (
        <Button
          key={type.value}
          variant={
            currentTargetType === type.value ||
            (!currentTargetType && type.value === "")
              ? "default"
              : "outline"
          }
          size="sm"
          onClick={() => handleTargetTypeChange(type.value)}
          disabled={isPending}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
