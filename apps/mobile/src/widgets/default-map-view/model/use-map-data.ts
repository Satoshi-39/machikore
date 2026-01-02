/**
 * デフォルトマップのデータ管理フック
 * - 各種エンティティのMap作成
 * - フィルタリング処理
 */

import { useMemo } from 'react';
import type { MachiRow, CityRow, PrefectureRow, RegionRow, CountryRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';
import type { VisitFilter } from '@/features/quick-search-buttons';

interface UseMapDataParams {
  machiData: MachiRow[] | null | undefined;
  cities: CityRow[];
  prefectures: PrefectureRow[];
  regions: RegionRow[];
  countries: CountryRow[];
  masterSpots: MasterSpotDisplay[];
  visits: { machi_id: string }[];
  favoriteMasterSpotIds: string[];
  visitFilter: VisitFilter;
}

interface UseMapDataReturn {
  /** 訪問済みmachiのIDセット */
  visitedMachiIds: Set<string>;
  /** お気に入りマスタースポットIDセット */
  favoriteMasterSpotIdSet: Set<string>;
  /** MachiRowのマップ（ID→MachiRow） */
  machiMap: Map<string, MachiRow>;
  /** CityRowのマップ（ID→CityRow） */
  cityMap: Map<string, CityRow>;
  /** PrefectureRowのマップ（ID→PrefectureRow） */
  prefectureMap: Map<string, PrefectureRow>;
  /** RegionRowのマップ（ID→RegionRow） */
  regionMap: Map<string, RegionRow>;
  /** CountryRowのマップ（ID→CountryRow） */
  countryMap: Map<string, CountryRow>;
  /** MasterSpotDisplayのマップ（ID→MasterSpotDisplay） */
  masterSpotMap: Map<string, MasterSpotDisplay>;
  /** フィルタリングされたmachiData */
  filteredMachiData: MachiRow[] | null;
  /** フィルタリングされたmasterSpots */
  filteredMasterSpots: MasterSpotDisplay[];
}

/**
 * デフォルトマップのデータ管理フック
 */
export function useMapData({
  machiData,
  cities,
  prefectures,
  regions,
  countries,
  masterSpots,
  visits,
  favoriteMasterSpotIds,
  visitFilter,
}: UseMapDataParams): UseMapDataReturn {
  // 訪問済みmachiのIDセットを作成
  const visitedMachiIds = useMemo(
    () => new Set(visits.map((visit) => visit.machi_id)),
    [visits]
  );

  // お気に入りマスタースポットIDセットを作成
  const favoriteMasterSpotIdSet = useMemo(
    () => new Set(favoriteMasterSpotIds),
    [favoriteMasterSpotIds]
  );

  // MachiRowのマップを作成（IDからMachiRowへの変換用）
  const machiMap = useMemo(() => {
    if (!machiData) return new Map<string, MachiRow>();
    return new Map(machiData.map((machi) => [machi.id, machi]));
  }, [machiData]);

  // CityRowのマップを作成（IDからCityRowへの変換用）
  const cityMap = useMemo(() => {
    return new Map(cities.map((city) => [city.id, city]));
  }, [cities]);

  // PrefectureRowのマップを作成（IDからPrefectureRowへの変換用）
  const prefectureMap = useMemo(() => {
    return new Map(prefectures.map((prefecture) => [prefecture.id, prefecture]));
  }, [prefectures]);

  // RegionRowのマップを作成（IDからRegionRowへの変換用）
  const regionMap = useMemo(() => {
    return new Map(regions.map((region) => [region.id, region]));
  }, [regions]);

  // CountryRowのマップを作成（IDからCountryRowへの変換用）
  const countryMap = useMemo(() => {
    return new Map(countries.map((country) => [country.id, country]));
  }, [countries]);

  // MasterSpotDisplayのマップを作成（IDからMasterSpotDisplayへの変換用）
  const masterSpotMap = useMemo(() => {
    if (!masterSpots) return new Map<string, MasterSpotDisplay>();
    return new Map(masterSpots.map((spot) => [spot.id, spot]));
  }, [masterSpots]);

  // フィルタリングされたmachiDataを生成
  const filteredMachiData = useMemo(() => {
    if (!machiData) return null;
    if (visitFilter === 'all' || visitFilter === 'favorite') return machiData;
    if (visitFilter === 'visited') {
      return machiData.filter((machi) => visitedMachiIds.has(machi.id));
    }
    if (visitFilter === 'not_visited') {
      return machiData.filter((machi) => !visitedMachiIds.has(machi.id));
    }
    return machiData;
  }, [machiData, visitFilter, visitedMachiIds]);

  // フィルタリングされたmasterSpotsを生成
  const filteredMasterSpots = useMemo(() => {
    if (visitFilter === 'favorite') {
      return masterSpots.filter((spot) => favoriteMasterSpotIdSet.has(spot.id));
    }
    return masterSpots;
  }, [masterSpots, visitFilter, favoriteMasterSpotIdSet]);

  return {
    visitedMachiIds,
    favoriteMasterSpotIdSet,
    machiMap,
    cityMap,
    prefectureMap,
    regionMap,
    countryMap,
    masterSpotMap,
    filteredMachiData,
    filteredMasterSpots,
  };
}
