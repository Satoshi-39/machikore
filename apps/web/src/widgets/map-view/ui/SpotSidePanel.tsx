"use client";

import { X } from "lucide-react";
import type { SpotWithImages } from "@/shared/types";
import { SpotDetailContent } from "./SpotDetailContent";

type SpotSidePanelProps = {
  spot: SpotWithImages;
  supabaseUrl: string;
  onClose: () => void;
};

export function SpotSidePanel({
  spot,
  supabaseUrl,
  onClose,
}: SpotSidePanelProps) {
  return (
    <div className="hidden md:block fixed top-16 right-0 bottom-0 w-[400px] bg-background border-l shadow-lg z-20 overflow-y-auto">
      <div className="sticky top-0 bg-background border-b p-3 flex items-center justify-between">
        <span className="text-sm font-medium">スポット詳細</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-accent"
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <SpotDetailContent spot={spot} supabaseUrl={supabaseUrl} />
      </div>
    </div>
  );
}
