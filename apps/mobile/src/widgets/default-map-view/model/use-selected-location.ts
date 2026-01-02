/**
 * 選択中アイテムの座標を管理するフック
 */

import { useMemo, useCallback } from 'react';
import { MAP_ZOOM } from '@/shared/config';
import type { MachiRow, CityRow, PrefectureRow, RegionRow, CountryRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

interface SelectedLocation {
  lng: number;
  lat: number;
  zoom: number;
}

interface UseSelectedLocationParams {
  selectedSpot: MasterSpotDisplay | null;
  selectedMachi: MachiRow | null;
  selectedCity: CityRow | null;
  selectedPrefecture: PrefectureRow | null;
  selectedRegion: RegionRow | null;
  selectedCountry: CountryRow | null;
  flyToLocation: (lng: number, lat: number, zoom?: number) => void;
}

interface UseSelectedLocationReturn {
  /** 選択中アイテムの座標 */
  selectedLocation: SelectedLocation | null;
  /** 選択中アイテムの位置に戻るハンドラー */
  handleSelectedLocationPress: () => void;
}

/**
 * 選択中アイテムの座標を管理するフック
 */
export function useSelectedLocation({
  selectedSpot,
  selectedMachi,
  selectedCity,
  selectedPrefecture,
  selectedRegion,
  selectedCountry,
  flyToLocation,
}: UseSelectedLocationParams): UseSelectedLocationReturn {
  // 選択中アイテムの座標を取得
  const selectedLocation = useMemo((): SelectedLocation | null => {
    if (selectedSpot) {
      return { lng: selectedSpot.longitude, lat: selectedSpot.latitude, zoom: MAP_ZOOM.SPOT };
    }
    // machiはNULL許容なのでnullチェックが必要
    if (selectedMachi && selectedMachi.longitude != null && selectedMachi.latitude != null) {
      return { lng: selectedMachi.longitude, lat: selectedMachi.latitude, zoom: MAP_ZOOM.MACHI };
    }
    // citiesはNULL許容なのでnullチェックが必要
    if (selectedCity && selectedCity.longitude != null && selectedCity.latitude != null) {
      return { lng: selectedCity.longitude, lat: selectedCity.latitude, zoom: MAP_ZOOM.CITY };
    }
    // prefecturesはNOT NULLなので直接参照可能
    if (selectedPrefecture) {
      return { lng: selectedPrefecture.longitude, lat: selectedPrefecture.latitude, zoom: MAP_ZOOM.PREFECTURE };
    }
    // regionsはNOT NULLなので直接参照可能
    if (selectedRegion) {
      return { lng: selectedRegion.longitude, lat: selectedRegion.latitude, zoom: MAP_ZOOM.REGION };
    }
    // countriesはNOT NULLなので直接参照可能
    if (selectedCountry) {
      return { lng: selectedCountry.longitude, lat: selectedCountry.latitude, zoom: MAP_ZOOM.COUNTRY };
    }
    return null;
  }, [selectedSpot, selectedMachi, selectedCity, selectedPrefecture, selectedRegion, selectedCountry]);

  // 選択中アイテムの位置に戻るハンドラー
  const handleSelectedLocationPress = useCallback(() => {
    if (selectedLocation) {
      flyToLocation(selectedLocation.lng, selectedLocation.lat, selectedLocation.zoom);
    }
  }, [selectedLocation, flyToLocation]);

  return {
    selectedLocation,
    handleSelectedLocationPress,
  };
}
