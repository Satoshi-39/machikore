"use client";

import { useState } from "react";
import { X, ChevronUp } from "lucide-react";
import type { SpotWithImages } from "@/shared/types";
import { SpotDetailContent } from "./SpotDetailContent";
import { extractLocalizedValue } from "@/shared/lib/multilang";

type SpotBottomPanelProps = {
  spot: SpotWithImages;
  supabaseUrl: string;
  onClose: () => void;
};

function getSpotName(spot: SpotWithImages): string {
  if (spot.master_spot) {
    return (
      extractLocalizedValue(spot.master_spot.name) ||
      spot.description ||
      "スポット"
    );
  }
  return spot.name || spot.description || "スポット";
}

export function SpotBottomPanel({
  spot,
  supabaseUrl,
  onClose,
}: SpotBottomPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`md:hidden fixed left-0 right-0 bottom-0 bg-background rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 transition-[max-height] duration-300 ${
        expanded ? "max-h-[90vh]" : "max-h-[40vh]"
      } overflow-y-auto`}
    >
      {/* ドラッグハンドル */}
      <div className="sticky top-0 bg-background rounded-t-xl border-b z-10">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm font-medium"
          >
            {getSpotName(spot)}
            <ChevronUp
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <SpotDetailContent spot={spot} supabaseUrl={supabaseUrl} />
      </div>
    </div>
  );
}
