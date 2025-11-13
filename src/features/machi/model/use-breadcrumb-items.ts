/**
 * パンくずリストアイテム生成カスタムフック
 */

import { useMemo } from 'react';
import type { BreadcrumbItem } from '@/shared/ui';

interface HierarchyState {
  region?: string;
  prefectureName?: string;
  cityName?: string;
}

type BreadcrumbPressHandler = (level: 'region' | 'prefecture' | 'city') => void;

export function useBreadcrumbItems(
  hierarchyState: HierarchyState,
  onPress: BreadcrumbPressHandler
): BreadcrumbItem[] {
  return useMemo(() => {
    const { region, prefectureName, cityName } = hierarchyState;
    const items: BreadcrumbItem[] = [];

    if (region) {
      items.push({ label: '地方', onPress: () => onPress('region') });
      items.push({
        label: region,
        onPress: prefectureName ? () => onPress('prefecture') : undefined
      });

      if (prefectureName) {
        items.push({
          label: prefectureName,
          onPress: cityName ? () => onPress('city') : undefined
        });

        if (cityName) {
          items.push({ label: cityName });
        }
      }
    }

    return items;
  }, [hierarchyState, onPress]);
}
