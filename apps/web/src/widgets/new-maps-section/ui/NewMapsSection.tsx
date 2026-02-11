import { MapCard } from "@/entities/map";
import { FEED_PAGE_SIZE } from "@/shared/config";
import type { MapWithUser } from "@/shared/types";
import { LoadMoreButton } from "./LoadMoreButton";

type NewMapsSectionProps = {
  maps: MapWithUser[];
};

export function NewMapsSection({ maps }: NewMapsSectionProps) {
  if (maps.length === 0) return null;

  const cursor =
    maps.length >= FEED_PAGE_SIZE
      ? maps[maps.length - 1].created_at
      : null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">新着マップ</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>
      <LoadMoreButton initialCursor={cursor} />
    </section>
  );
}
