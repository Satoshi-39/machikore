/**
 * 街データを取得するhook
 *
 * Supabase → SQLiteキャッシュのフローで街データを取得
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi } from '@/shared/api/sqlite';
import { getMachiByPrefecture } from '@/shared/lib/cache';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * キャッシュされた全街データを取得
 *
 * Note: SQLiteにキャッシュされているデータのみを返す（同期的）
 * 新しいデータを取得する場合は useMachiByPrefecture を使用
 */
export function useMachi() {
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
