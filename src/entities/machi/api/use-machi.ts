/**
 * 街データを取得するhook
 *
 * Supabase → SQLiteキャッシュのフローで街データを取得
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi, getNearestPrefecture } from '@/shared/api/sqlite';
import { getMachiByPrefecture, getMachiByLocation } from '@/shared/lib/cache';
import type { MachiRow } from '@/shared/types/database.types';

// デフォルトの都道府県ID（東京）
const DEFAULT_PREFECTURE_ID = 'tokyo';

interface UseMachiOptions {
  /** 現在地（省略時は東京のデータを取得） */
  currentLocation?: { latitude: number; longitude: number } | null;
}

/**
 * 街データを取得（現在地ベースでSupabaseから取得）
 *
 * 1. 現在地から最寄りの都道府県を特定
 * 2. その都道府県の街データをSupabaseから取得（TTLキャッシュ）
 * 3. SQLiteにキャッシュして返す
 */
export function useMachi(options: UseMachiOptions = {}) {
  const { currentLocation } = options;

  // 現在地から都道府県IDを特定（見つからない場合はデフォルト）
  const prefectureId = currentLocation
    ? getNearestPrefecture(currentLocation.latitude, currentLocation.longitude)?.id ?? DEFAULT_PREFECTURE_ID
    : DEFAULT_PREFECTURE_ID;

  console.log(`🗾 useMachi: currentLocation=${JSON.stringify(currentLocation)}, prefectureId=${prefectureId}`);

  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiByPrefecture(prefectureId),
    queryFn: async () => {
      console.log(`🗾 queryFn開始: prefectureId=${prefectureId}`);
      try {
        // 現在地がある場合はその都道府県のデータを取得
        if (currentLocation) {
          const result = await getMachiByLocation(currentLocation.latitude, currentLocation.longitude);
          if (result && result.machi.length > 0) {
            console.log(`✅ getMachiByLocation成功: ${result.machi.length}件`);
            return result.machi;
          }
          console.log(`⚠️ getMachiByLocationが空、フォールバック`);
        }
        // デフォルトの都道府県のデータを取得
        const machi = await getMachiByPrefecture(prefectureId);
        console.log(`✅ getMachiByPrefecture成功: ${machi.length}件`);
        return machi;
      } catch (error) {
        console.error(`❌ queryFnエラー:`, error);
        throw error;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7日間（TTLと合わせる）
    gcTime: Infinity,
  });
}

/**
 * キャッシュされた全街データを取得（SQLiteから同期的に取得）
 *
 * Note: これはSQLiteにキャッシュ済みのデータのみを返します。
 * 新しいデータを取得する場合は useMachi または useMachiByPrefecture を使用してください。
 */
export function useCachedMachi() {
  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiList(),
    queryFn: () => {
      const machiList = getAllMachi();
      return machiList;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * 都道府県単位で街データを取得（Supabaseから取得してキャッシュ）
 *
 * TTLキャッシュ付きでSupabaseから取得し、SQLiteにキャッシュ
 */
export function useMachiByPrefecture(prefectureId: string | null) {
  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiByPrefecture(prefectureId || ''),
    queryFn: async () => {
      if (!prefectureId) return [];
      return getMachiByPrefecture(prefectureId);
    },
    enabled: !!prefectureId,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7日間（TTLと合わせる）
    gcTime: Infinity,
  });
}
