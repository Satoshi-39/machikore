"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMapbox } from "@/shared/lib/mapbox";
import { FileText } from "lucide-react";
import type { SpotWithImages } from "@/shared/types";
import { SpotSidePanel } from "./SpotSidePanel";
import { SpotBottomPanel } from "./SpotBottomPanel";

type MapPageContentProps = {
  articlePath: string;
  spots: SpotWithImages[];
};

export function MapPageContent({ articlePath, spots }: MapPageContentProps) {
  const {
    spots: contextSpots,
    setSpots,
    selectedSpotId,
    setSelectedSpotId,
    supabaseUrl,
  } = useMapbox();

  // Server Componentから受け取ったspotsをcontextに設定
  useEffect(() => {
    setSpots(spots);
  }, [spots, setSpots]);

  const selectedSpot =
    contextSpots.find((s) => s.id === selectedSpotId) ?? null;

  return (
    <>
      {/* 記事に戻るボタン */}
      <div className="fixed top-20 left-4 z-30">
        <Link
          href={articlePath}
          className="flex items-center gap-2 rounded-lg bg-background/90 backdrop-blur-sm px-3 py-2 text-sm font-medium shadow-md border hover:bg-accent transition-colors"
        >
          <FileText className="h-4 w-4" />
          記事を見る
        </Link>
      </div>

      {/* スポット詳細パネル */}
      {selectedSpot && (
        <>
          <SpotSidePanel
            spot={selectedSpot}
            supabaseUrl={supabaseUrl}
            onClose={() => setSelectedSpotId(null)}
          />
          <SpotBottomPanel
            spot={selectedSpot}
            supabaseUrl={supabaseUrl}
            onClose={() => setSelectedSpotId(null)}
          />
        </>
      )}
    </>
  );
}
