/**
 * キャッシュクリア機能
 *
 * React Queryキャッシュと画像キャッシュをクリアする
 */

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';

interface UseClearCacheReturn {
  clearCache: () => Promise<void>;
  isClearing: boolean;
}

/**
 * キャッシュをクリアするhook
 */
export function useClearCache(): UseClearCacheReturn {
  const queryClient = useQueryClient();
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = useCallback(async () => {
    setIsClearing(true);
    try {
      // React Queryのキャッシュをクリア
      queryClient.clear();

      // expo-imageのキャッシュをクリア
      await Image.clearDiskCache();
      await Image.clearMemoryCache();
    } finally {
      setIsClearing(false);
    }
  }, [queryClient]);

  return { clearCache, isClearing };
}
