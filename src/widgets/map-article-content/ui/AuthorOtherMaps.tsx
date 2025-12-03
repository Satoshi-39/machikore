/**
 * 著者の他のマップ
 *
 * 記事著者の他のマップを横スクロールで表示
 */

import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

interface AuthorOtherMapsProps {
  maps: MapWithUser[];
  onMapPress: (mapId: string) => void;
}

export function AuthorOtherMaps({ maps, onMapPress }: AuthorOtherMapsProps) {
  if (maps.length === 0) return null;

  return (
    <View className="mt-8">
      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-4">
        この著者の他のマップ
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
            {map.thumbnail_url ? (
              <Image
                source={{ uri: map.thumbnail_url }}
                className="w-full h-24 rounded-lg mb-2"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-24 rounded-lg bg-muted dark:bg-dark-muted items-center justify-center mb-2">
                <Ionicons name="map" size={32} color={colors.gray[300]} />
              </View>
            )}
            <Text className="text-sm font-medium text-foreground dark:text-dark-foreground" numberOfLines={2}>
              {map.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
