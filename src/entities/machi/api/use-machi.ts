/**
 * 街データを取得するhook
 *
 * Supabaseから取得し、TanStack Queryでキャッシュ管理
 * - 永続化: AsyncStorageに30日間保存
 * - LRU: 最大5都道府県分をメモリに保持
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi, getNearestPrefecture } from '@/shared/api/sqlite';
import { getMachiByPrefecture } from '@/shared/lib/cache';
import { STATIC_DATA_CACHE_CONFIG } from '@/shared/config';
import type { MachiRow } from '@/shared/types/database.types';

// デフォルトの都道府県ID（東京）
const DEFAULT_PREFECTURE_ID = 'tokyo';

interface UseMachiOptions {
  /** 現在地（GPS位置、初期表示用） */
  currentLocation?: { latitude: number; longitude: number } | null;
  /** マップ中心座標（マップ移動時のデータ取得用） */
  mapCenter?: { latitude: number; longitude: number } | null;
}

/**
 * 街データを取得（マップ中心座標ベースでSupabaseから取得）
 *
 * 1. マップ中心座標（なければ現在地）から最寄りの都道府県を特定
 * 2. その都道府県の街データをSupabaseから取得（TTLキャッシュ）
 * 3. SQLiteにキャッシュして返す
 */
export function useMachi(options: UseMachiOptions = {}) {
  const { currentLocation, mapCenter } = options;

  // マップ中心 > 現在地 > デフォルト の優先順位で都道府県を特定
  const targetLocation = mapCenter || currentLocation;
  const prefectureId = targetLocation
    ? getNearestPrefecture(targetLocation.latitude, targetLocation.longitude)?.id ?? DEFAULT_PREFECTURE_ID
    : DEFAULT_PREFECTURE_ID;

  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiByPrefecture(prefectureId),
    queryFn: async () => {
      console.log(`🗾 useMachi queryFn: prefectureId=${prefectureId}`);
      try {
        const machi = await getMachiByPrefecture(prefectureId);
        console.log(`✅ getMachiByPrefecture成功: ${machi.length}件`);
        return machi;
      } catch (error) {
        console.error(`❌ queryFnエラー:`, error);
        throw error;
      }
    },
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日間
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分（メモリから解放、永続化には残る）
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
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日間
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分（メモリから解放、永続化には残る）
  });
}
