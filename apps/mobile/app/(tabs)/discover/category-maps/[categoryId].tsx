/**
 * カテゴリ別マップ一覧ルート
 */

import { useLocalSearchParams } from 'expo-router';
import { CategoryMapsPage } from '@/pages/category-maps';

export default function CategoryMapsRoute() {
  const { categoryId, sort } = useLocalSearchParams<{
    categoryId: string;
    sort: 'latest' | 'popular' | 'recommend';
  }>();

  return (
    <CategoryMapsPage
      categoryId={categoryId}
      sort={sort ?? 'latest'}
    />
  );
}
