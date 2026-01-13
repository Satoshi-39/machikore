/**
 * useSpotEdit
 *
 * スポット編集画面への遷移ロジック
 */

import { useCallback } from 'react';
import { useRouter, type Href } from 'expo-router';

export function useSpotEdit() {
  const router = useRouter();

  const handleEdit = useCallback((spotId: string) => {
    router.push(`/edit-spot/${spotId}` as Href);
  }, [router]);

  return {
    handleEdit,
  };
}
