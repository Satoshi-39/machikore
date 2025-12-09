/**
 * 街データ読み込みユーティリティ
 *
 * @deprecated 街データはSupabaseからオンデマンドで取得するようになりました。
 * 新しいAPIは src/shared/lib/cache/machi-cache-service.ts を使用してください。
 */

import type { MachiRow } from '@/shared/types/database.types';

/**
 * @deprecated 街データはSupabaseからオンデマンドで取得されます
 * 代わりに getMachiByPrefecture from '@/shared/lib/cache' を使用してください
 */
export function getMachiData(): MachiRow[] {
  console.warn('getMachiData is deprecated. Use getMachiByPrefecture from @/shared/lib/cache instead.');
  return [];
}

/**
 * @deprecated 街データはSupabaseからオンデマンドで取得されます
 */
export function getMachiCount(): number {
  console.warn('getMachiCount is deprecated. Use getMachiByPrefecture from @/shared/lib/cache instead.');
  return 0;
}

/**
 * @deprecated 街データはSupabaseからオンデマンドで取得されます
 */
export function findMachiById(_machiId: string): MachiRow | undefined {
  console.warn('findMachiById is deprecated. Use getMachiById from @/shared/api/sqlite/machi instead.');
  return undefined;
}
