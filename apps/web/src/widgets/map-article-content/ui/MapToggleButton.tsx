"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

type MapToggleButtonProps = {
  mapPath: string;
};

export function MapToggleButton({ mapPath }: MapToggleButtonProps) {
  return (
    <Link
      href={mapPath}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
    >
      <MapPin className="h-4 w-4" />
      地図で見る
    </Link>
  );
}
