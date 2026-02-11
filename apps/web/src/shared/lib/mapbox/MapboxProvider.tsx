"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import type { SpotWithImages } from "@/shared/types";

interface MapboxContextValue {
  mapRef: React.MutableRefObject<MapboxMap | null>;
  spots: SpotWithImages[];
  setSpots: (spots: SpotWithImages[]) => void;
  selectedSpotId: string | null;
  setSelectedSpotId: (id: string | null) => void;
  isMapVisible: boolean;
  setMapVisible: (visible: boolean) => void;
  supabaseUrl: string;
  accessToken: string;
}

const MapboxContext = createContext<MapboxContextValue | null>(null);

export function useMapbox() {
  const ctx = useContext(MapboxContext);
  if (!ctx) throw new Error("useMapbox must be used within MapboxProvider");
  return ctx;
}

type MapboxProviderProps = {
  supabaseUrl: string;
  accessToken: string;
  children: ReactNode;
};

export function MapboxProvider({
  supabaseUrl,
  accessToken,
  children,
}: MapboxProviderProps) {
  const mapRef = useRef<MapboxMap | null>(null);
  const [spots, setSpots] = useState<SpotWithImages[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isMapVisible, setMapVisible] = useState(false);

  const handleSetSpots = useCallback((newSpots: SpotWithImages[]) => {
    setSpots(newSpots);
    setSelectedSpotId(null);
  }, []);

  return (
    <MapboxContext.Provider
      value={{
        mapRef,
        spots,
        setSpots: handleSetSpots,
        selectedSpotId,
        setSelectedSpotId,
        isMapVisible,
        setMapVisible,
        supabaseUrl,
        accessToken,
      }}
    >
      {children}
    </MapboxContext.Provider>
  );
}
