"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMapbox } from "@/shared/lib/mapbox";
import { MapContainer } from "@/widgets/map-view";

type MapLayoutClientProps = {
  children: ReactNode;
};

export function MapLayoutClient({ children }: MapLayoutClientProps) {
  const pathname = usePathname();
  const isMapPage = pathname?.endsWith("/map") ?? false;
  const { setMapVisible } = useMapbox();

  // ルート変更時に地図の表示/非表示を同期
  useEffect(() => {
    setMapVisible(isMapPage);
  }, [isMapPage, setMapVisible]);

  return (
    <div className="relative">
      {/* Mapbox地図（常にマウント、visibility切り替え） */}
      <div
        className={`fixed top-16 bottom-0 left-0 right-0 ${
          isMapPage ? "z-10" : "-z-10"
        }`}
        style={{ visibility: isMapPage ? "visible" : "hidden" }}
      >
        <MapContainer />
      </div>

      {/* ページコンテンツ */}
      {isMapPage ? (
        <div className="relative z-20">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
