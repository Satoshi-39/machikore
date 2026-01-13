/**
 * useMapEdit
 *
 * マップ編集画面への遷移ロジック
 */

import { useCallback } from 'react';
import { useRouter, type Href } from 'expo-router';

export function useMapEdit() {
  const router = useRouter();

  const handleEdit = useCallback((mapId: string) => {
    router.push(`/edit-map/${mapId}` as Href);
  }, [router]);

  return {
    handleEdit,
  };
}
