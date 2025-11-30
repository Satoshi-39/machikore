/**
 * Master Spot カテゴリ判定ロジック
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
      types = JSON.parse(googleTypes) as string[];
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

/**
 * カテゴリに対応する色を取得
 */
export function getCategoryColor(category: SpotCategory): string {
  const colorMap: Record<SpotCategory, string> = {
    food: '#F97316',      // オレンジ - 飲食店系
    shopping: '#9333EA',  // 紫 - ショッピング系
    tourism: '#10B981',   // 緑 - 公園・観光地系
    transit: '#3B82F6',   // 青 - 交通系
    other: '#6B7280',     // グレー - その他
  };
  return colorMap[category];
}
