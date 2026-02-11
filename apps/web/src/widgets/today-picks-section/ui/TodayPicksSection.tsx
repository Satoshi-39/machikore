import { MapCard } from "@/entities/map";
import type { MapWithUser } from "@/shared/types";

type TodayPicksSectionProps = {
  maps: MapWithUser[];
};

export function TodayPicksSection({ maps }: TodayPicksSectionProps) {
  if (maps.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">今日のピックアップ</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {maps.map((map) => (
          <div key={map.id} className="w-64 flex-shrink-0 snap-start">
            <MapCard map={map} />
          </div>
        ))}
      </div>
    </section>
  );
}
