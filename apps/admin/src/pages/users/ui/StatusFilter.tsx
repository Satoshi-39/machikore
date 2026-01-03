"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/shared/ui/button";

type StatusFilterProps = {
  basePath: string;
  currentQuery?: string;
  currentStatus?: string;
};

const statuses = [
  { value: "", label: "すべて" },
  { value: "active", label: "アクティブ" },
  { value: "suspended", label: "停止中" },
  { value: "deleted", label: "削除済み" },
];

export function StatusFilter({
  basePath,
  currentQuery,
  currentStatus,
}: StatusFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentQuery) {
        params.set("q", currentQuery);
      }
      if (status) {
        params.set("status", status);
      }
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    });
  };

  return (
    <div className="flex items-center gap-1">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={currentStatus === status.value || (!currentStatus && status.value === "") ? "default" : "outline"}
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
