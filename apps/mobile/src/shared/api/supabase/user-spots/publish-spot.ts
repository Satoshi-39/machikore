/**
 * スポット公開/非公開API
 */

import { supabase } from '../client';

/**
 * スポットを公開する
 * - article_contentが入力されている必要がある
 * - 公開時にマップも自動的に公開される（DBトリガー）
 */
export async function publishSpot(spotId: string): Promise<void> {
  const { error } = await supabase.rpc('publish_spot', {
    p_spot_id: spotId,
  });

  if (error) {
    // エラーメッセージをユーザーフレンドリーに変換
    if (error.message.includes('Article content is required')) {
      throw new Error('ARTICLE_REQUIRED');
    }
    if (error.message.includes('Not authorized')) {
      throw new Error('NOT_AUTHORIZED');
    }
    if (error.message.includes('Spot not found')) {
      throw new Error('SPOT_NOT_FOUND');
    }
    throw error;
  }
}

/**
 * スポットを非公開にする
 */
export async function unpublishSpot(spotId: string): Promise<void> {
  const { error } = await supabase.rpc('unpublish_spot', {
    p_spot_id: spotId,
  });

  if (error) {
    if (error.message.includes('Not authorized')) {
      throw new Error('NOT_AUTHORIZED');
    }
    if (error.message.includes('Spot not found')) {
      throw new Error('SPOT_NOT_FOUND');
    }
    throw error;
  }
}
