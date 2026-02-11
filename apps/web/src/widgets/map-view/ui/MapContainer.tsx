"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapbox } from "@/shared/lib/mapbox";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAPBOX_STYLE_URL,
  SPOT_COLORS,
  DEFAULT_SPOT_COLOR,
} from "@/shared/config";
import type { SpotWithImages } from "@/shared/types";
import { extractLocalizedValue } from "@/shared/lib/multilang";

function getSpotCoordinates(
  spot: SpotWithImages
): [number, number] | null {
  if (spot.master_spot) {
    return [spot.master_spot.longitude, spot.master_spot.latitude];
  }
  if (spot.latitude != null && spot.longitude != null) {
    return [spot.longitude, spot.latitude];
  }
  return null;
}

function getSpotColor(spot: SpotWithImages): string {
  if (spot.map_label?.color) {
    return SPOT_COLORS[spot.map_label.color] || SPOT_COLORS[DEFAULT_SPOT_COLOR];
  }
  if (spot.spot_color) {
    return SPOT_COLORS[spot.spot_color] || SPOT_COLORS[DEFAULT_SPOT_COLOR];
  }
  return SPOT_COLORS[DEFAULT_SPOT_COLOR];
}

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

function spotsToGeoJSON(spots: SpotWithImages[]): GeoJSON.FeatureCollection {
  const features = spots
    .map((spot) => {
      const coords = getSpotCoordinates(spot);
      if (!coords) return null;
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: coords },
        properties: {
          id: spot.id,
          name: getSpotName(spot),
          color: getSpotColor(spot),
        },
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return { type: "FeatureCollection", features };
}

function fitBoundsToSpots(map: mapboxgl.Map, spots: SpotWithImages[]) {
  const spotsWithCoords = spots
    .map((s) => getSpotCoordinates(s))
    .filter((c): c is [number, number] => c !== null);

  if (spotsWithCoords.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    spotsWithCoords.forEach((coords) => bounds.extend(coords));
    map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
  }
}

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, spots, setSelectedSpotId, isMapVisible, accessToken } =
    useMapbox();
  const initializedRef = useRef(false);
  const mapLoadedRef = useRef(false);

  // 遅延初期化: isMapVisible が初めて true になったときにMapboxを初期化
  useEffect(() => {
    if (!isMapVisible || !containerRef.current || initializedRef.current) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE_URL,
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      mapLoadedRef.current = true;

      map.addSource("spots", {
        type: "geojson",
        data: spotsToGeoJSON(spots),
      });

      map.addLayer({
        id: "spots-circle",
        type: "circle",
        source: "spots",
        paint: {
          "circle-radius": 8,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "spots-label",
        type: "symbol",
        source: "spots",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-max-width": 10,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      map.on("click", "spots-circle", (e) => {
        const id = e.features?.[0]?.properties?.id;
        if (id) {
          setSelectedSpotId(id as string);
          const coords = (e.features![0].geometry as GeoJSON.Point)
            .coordinates;
          map.flyTo({ center: coords as [number, number], zoom: 15 });
        }
      });

      map.on("mouseenter", "spots-circle", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "spots-circle", () => {
        map.getCanvas().style.cursor = "";
      });

      fitBoundsToSpots(map, spots);
    });

    mapRef.current = map;
    initializedRef.current = true;

    return () => {
      map.remove();
      mapRef.current = null;
      initializedRef.current = false;
      mapLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapVisible]);

  // spots 変更時: source.setData() でマーカーを動的更新（インスタンス再生成なし）
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;

    const source = map.getSource("spots") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(spotsToGeoJSON(spots));
      fitBoundsToSpots(map, spots);
    }
  }, [spots, mapRef]);

  // 表示切替時の resize
  useEffect(() => {
    if (isMapVisible && mapRef.current) {
      setTimeout(() => mapRef.current?.resize(), 50);
    }
  }, [isMapVisible, mapRef]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}
