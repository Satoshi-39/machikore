/**
 * Master Spot タイプ判定ロジック
 *
 * Google Places APIのtypesからスポットタイプを判定
 */

export type SpotCategory = 'food' | 'shopping' | 'tourism' | 'transit' | 'other';

/**
 * Google Places APIのtypesからカテゴリを判定
 * @param googleTypes - 配列またはJSON文字列
 */
export function determineSpotCategory(googleTypes: string[] | string | null): SpotCategory {
  if (!googleTypes) return 'other';

  let types: string[];
  if (typeof googleTypes === 'string') {
    try {
      const parsed = JSON.parse(googleTypes);
      // 配列でない場合は無効
      if (!Array.isArray(parsed)) {
        return 'other';
      }
      types = parsed as string[];
    } catch {
      return 'other';
    }
  } else {
    types = googleTypes;
  }

  if (types.length === 0) return 'other';

  const typeString = types.join(',').toLowerCase();

    // 飲食店系
    if (
      typeString.includes('restaurant') ||
      typeString.includes('cafe') ||
      typeString.includes('food') ||
      typeString.includes('bar') ||
      typeString.includes('meal')
    ) {
      return 'food';
    }

    // ショッピング系
    if (
      typeString.includes('store') ||
      typeString.includes('shop') ||
      typeString.includes('shopping') ||
      typeString.includes('mall')
    ) {
      return 'shopping';
    }

    // 公園・観光地系
    if (
      typeString.includes('park') ||
      typeString.includes('tourist') ||
      typeString.includes('museum') ||
      typeString.includes('attraction')
    ) {
      return 'tourism';
    }

    // 交通系
    if (
      typeString.includes('station') ||
      typeString.includes('airport') ||
      typeString.includes('transit')
    ) {
      return 'transit';
    }

  return 'other';
}
