/**
 * フィルターモーダル画面（発見タブ内）
 */

import { useRouter } from 'expo-router';
import { FilterModalPage } from '@/pages/filter-modal';

export default function FilterModalScreen() {
  const router = useRouter();

  return <FilterModalPage onClose={() => router.back()} />;
}
