"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { REPORT_STATUS_LABELS } from "@/shared/config";

type ReportStatusFilterProps = {
  currentStatus?: string;
  currentTargetType?: string;
};

const statuses = [
  { value: "", label: "すべて" },
  ...Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function ReportStatusFilter({
  currentStatus,
  currentTargetType,
}: ReportStatusFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (status) {
        params.set("status", status);
      }
      if (currentTargetType) {
        params.set("target_type", currentTargetType);
      }
      const queryString = params.toString();
      router.push(queryString ? `/reports?${queryString}` : "/reports");
    });
  };

  return (
    <div className="flex items-center gap-1">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={
            currentStatus === status.value ||
            (!currentStatus && status.value === "")
              ? "default"
              : "outline"
          }
          size="sm"
          onClick={() => handleStatusChange(status.value)}
          disabled={isPending}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}
