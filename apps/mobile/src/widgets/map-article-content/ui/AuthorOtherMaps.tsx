/**
 * 著者の他のマップ
 *
 * 記事著者の他のマップを横スクロールで表示
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MapThumbnail } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';

interface AuthorOtherMapsProps {
  maps: MapWithUser[];
  onMapPress: (mapId: string) => void;
}

export function AuthorOtherMaps({ maps, onMapPress }: AuthorOtherMapsProps) {
  const { t } = useI18n();

  if (maps.length === 0) return null;

  return (
    <View className="mt-8">
      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-4">
        {t('article.authorOtherMaps')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-4 px-4"
      >
        {maps.map((map) => (
          <Pressable
            key={map.id}
            onPress={() => onMapPress(map.id)}
            className="mr-3"
            style={{ width: 160 }}
          >
            <MapThumbnail
              url={map.thumbnail_url}
              width={160}
              height={96}
              className="mb-2"
            />
            <Text className="text-sm font-medium text-foreground dark:text-dark-foreground" numberOfLines={2}>
              {map.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
