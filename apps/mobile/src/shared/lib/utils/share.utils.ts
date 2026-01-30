/**
 * 共有ユーティリティ
 *
 * マップやスポットの共有処理を一元管理
 */

import { Share, Platform } from 'react-native';
import { SHARE_URLS } from '@/shared/config';
import { log } from '@/shared/config/logger';

/**
 * マップを共有
 */
export async function shareMap(username: string, mapId: string): Promise<void> {
  try {
    const url = SHARE_URLS.map(username, mapId);
    await Share.share(
      Platform.select({
        ios: { url },
        default: { message: url },
      })!
    );
  } catch (error) {
    log.error('[Share] Map share error:', error);
  }
}

/**
 * スポットを共有
 */
export async function shareSpot(username: string, mapId: string, spotId: string): Promise<void> {
  try {
    const url = SHARE_URLS.spot(username, mapId, spotId);
    await Share.share(
      Platform.select({
        ios: { url },
        default: { message: url },
      })!
    );
  } catch (error) {
    log.error('[Share] Spot share error:', error);
  }
}
