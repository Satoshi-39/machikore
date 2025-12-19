/**
 * カテゴリ別タグページ
 *
 * カテゴリに関連するタグを横スクロールで表示
 * 選択したタグのマップをグリッド形式で表示
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useCategoryTags, type Tag } from '@/entities/tag';
import { useMapTagSearch } from '@/entities/map';
import { useCategories } from '@/entities/category';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PageHeader } from '@/shared/ui';
import { MapGridCard, MAP_GRID_CONSTANTS } from '@/widgets/map-grid';

const { GRID_PADDING, GRID_GAP } = MAP_GRID_CONSTANTS;

interface TagChipProps {
  tag: Tag;
  isSelected: boolean;
  onPress: () => void;
}

function TagChip({ tag, isSelected, onPress }: TagChipProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <Pressable
      onPress={onPress}
      className="mr-2 px-4 py-2 rounded-full active:opacity-70"
      style={{
        backgroundColor: isSelected
          ? colors.primary.DEFAULT
          : isDarkMode
            ? colors.dark.surfaceSecondary
            : colors.gray[100],
        borderWidth: 1,
        borderColor: isSelected
          ? colors.primary.DEFAULT
          : isDarkMode
            ? colors.dark.border
            : colors.gray[200],
      }}
    >
      <Text
        className="text-sm"
        style={{
          color: isSelected
            ? '#FFFFFF'
            : isDarkMode
              ? colors.dark.foreground
              : colors.light.foreground,
        }}
      >
        #{tag.name}
      </Text>
    </Pressable>
  );
}

export function CategoryTagsPage() {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { data: categories = [] } = useCategories();
  const { data: tags, isLoading: isTagsLoading } = useCategoryTags(categoryId ?? '', 30);

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // 選択されたタグのマップを取得
  const { data: maps, isLoading: isMapsLoading } = useMapTagSearch(selectedTag?.name ?? '');

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

  const handleTagPress = useCallback((tag: Tag) => {
    setSelectedTag((prev) => (prev?.id === tag.id ? null : tag));
  }, []);

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // 最初のタグを自動選択
  React.useEffect(() => {
    if (tags && tags.length > 0 && !selectedTag) {
      const firstTag = tags[0];
      if (firstTag) {
        setSelectedTag(firstTag);
      }
    }
  }, [tags, selectedTag]);

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* ヘッダー */}
      <PageHeader title={`${categoryName}のタグ`} />

      {/* タグチップ（横スクロール） */}
      {isTagsLoading ? (
        <View className="h-14 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : tags && tags.length > 0 ? (
        <View className="py-3 border-b border-border dark:border-dark-border">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                tag={tag}
                isSelected={selectedTag?.id === tag.id}
                onPress={() => handleTagPress(tag)}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View className="h-14 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            タグがありません
          </Text>
        </View>
      )}

      {/* マップグリッド */}
      {selectedTag ? (
        isMapsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          </View>
        ) : maps && maps.length > 0 ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              padding: GRID_PADDING,
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
              {maps.map((map) => (
                <MapGridCard
                  key={map.id}
                  map={map}
                  onPress={() => handleMapPress(map.id)}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons
              name="map-outline"
              size={48}
              color={isDarkMode ? colors.dark.foregroundMuted : colors.text.secondary}
            />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              #{selectedTag.name} のマップはありません
            </Text>
          </View>
        )
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="pricetag-outline"
            size={48}
            color={isDarkMode ? colors.dark.foregroundMuted : colors.text.secondary}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            タグを選択してください
          </Text>
        </View>
      )}
    </View>
  );
}
