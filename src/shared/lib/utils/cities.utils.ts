/**
 * 市区町村データ読み込みユーティリティ
 *
 * @deprecated 市区町村データはSupabaseからオンデマンドで取得するようになりました。
 */

import type { CityRow } from '@/shared/types/database.types';

/**
 * @deprecated 市区町村データはSupabaseからオンデマンドで取得されます
 * 代わりに getCitiesByPrefectureId from '@/shared/api/supabase/places' を使用してください
 */
export function getCitiesData(): CityRow[] {
  console.warn('getCitiesData is deprecated. Use getCitiesByPrefectureId from @/shared/api/supabase/places instead.');
  return [];
}
