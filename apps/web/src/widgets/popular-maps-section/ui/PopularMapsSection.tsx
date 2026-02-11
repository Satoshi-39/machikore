import { MapCard } from "@/entities/map";
import type { MapWithUser } from "@/shared/types";

type PopularMapsSectionProps = {
  maps: MapWithUser[];
};

export function PopularMapsSection({ maps }: PopularMapsSectionProps) {
  if (maps.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">人気のマップ</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>
    </section>
  );
}
