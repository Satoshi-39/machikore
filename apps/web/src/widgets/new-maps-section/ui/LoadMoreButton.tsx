"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { MapCard } from "@/entities/map";
import { FEED_PAGE_SIZE } from "@/shared/config";
import { getNewMapsClient } from "@/shared/api/supabase/maps/get-new-maps-client";
import type { MapWithUser } from "@/shared/types";

type LoadMoreButtonProps = {
  initialCursor: string | null;
};

export function LoadMoreButton({ initialCursor }: LoadMoreButtonProps) {
  const [maps, setMaps] = useState<MapWithUser[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();

  if (!cursor) return null;

  const loadMore = () => {
    startTransition(async () => {
      const newMaps = await getNewMapsClient(cursor);

      setMaps((prev) => [...prev, ...newMaps]);

      if (newMaps.length < FEED_PAGE_SIZE) {
        setCursor(null);
      } else {
        setCursor(newMaps[newMaps.length - 1].created_at);
      }
    });
  };

  return (
    <>
      {maps.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {maps.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Button variant="outline" onClick={loadMore} disabled={isPending}>
          {isPending ? "読み込み中..." : "もっと見る"}
        </Button>
      </div>
    </>
  );
}
