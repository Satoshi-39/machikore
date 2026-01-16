/**
 * マガジンセクションリスト
 *
 * セクション一覧を表示
 * - セクションがない場合: マップ一覧を直接表示
 * - セクションがある場合: セクションをタップで別ページへ遷移
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useMagazineSections,
  useMagazineMapsWithSections,
  groupMapsBySections,
  type MagazineSection,
} from '@/entities/featured-contents';
import { useCurrentUserId } from '@/entities/user';
import { MapListCard } from '@/widgets/map-cards';
import { colors } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

// セクションカード（タップでページ遷移）- グリッド用サムネイル付き
interface SectionCardProps {
  section: MagazineSection;
  mapCount: number;
  onPress: () => void;
}

function SectionCard({ section, mapCount, onPress }: SectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 m-1.5 rounded-xl overflow-hidden active:opacity-70"
      style={{ minHeight: 140 }}
    >
      {/* サムネイル画像 */}
      <View className="absolute inset-0">
        {section.thumbnail_url ? (
          <Image
            source={{ uri: section.thumbnail_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-muted dark:bg-dark-muted" />
        )}
        {/* オーバーレイ（テキストを読みやすくする） */}
        <View className="absolute inset-0 bg-black/40" />
      </View>

      {/* コンテンツ */}
      <View className="flex-1 justify-end p-3">
        <Text
          className="text-base font-bold text-white"
          numberOfLines={2}
        >
          {section.name}
        </Text>
        <Text className="text-xs text-white/80 mt-1">
          {mapCount}件のマップ
        </Text>
      </View>
    </Pressable>
  );
}

// 2列グリッドでセクションを表示
interface SectionGridProps {
  sections: Array<{ section: MagazineSection; mapCount: number }>;
  onSectionPress: (sectionId: string) => void;
}

function SectionGrid({ sections, onSectionPress }: SectionGridProps) {
  // 2列のグリッドにするため、ペアに分割
  const rows: Array<Array<{ section: MagazineSection; mapCount: number }>> = [];
  for (let i = 0; i < sections.length; i += 2) {
    rows.push(sections.slice(i, i + 2));
  }

  return (
    <View className="px-2 py-2">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {row.map((item) => (
            <SectionCard
              key={item.section.id}
              section={item.section}
              mapCount={item.mapCount}
              onPress={() => onSectionPress(item.section.id)}
            />
          ))}
          {/* 奇数個の場合、空のスペースを追加 */}
          {row.length === 1 && <View className="flex-1 m-1.5" />}
        </View>
      ))}
    </View>
  );
}

// セクションなしのマップリスト
interface FlatMapListProps {
  maps: MapWithUser[];
  currentUserId: string | null;
  onMapPress: (mapId: string) => void;
}

function FlatMapList({ maps, currentUserId, onMapPress }: FlatMapListProps) {
  return (
    <View>
      {maps.map((map) => (
        <MapListCard
          key={map.id}
          map={map}
          currentUserId={currentUserId}
          onPress={() => onMapPress(map.id)}
        />
      ))}
    </View>
  );
}

export interface MagazineSectionListProps {
  magazineId: string;
  headerContent?: React.ReactNode;
  onMapPress: (mapId: string) => void;
  onSectionPress: (sectionId: string) => void;
}

export function MagazineSectionList({
  magazineId,
  headerContent,
  onMapPress,
  onSectionPress,
}: MagazineSectionListProps) {
  const currentUserId = useCurrentUserId();

  // セクションとマップを取得
  const sectionsQuery = useMagazineSections(magazineId);
  const mapsQuery = useMagazineMapsWithSections(magazineId, currentUserId);

  // Model層の純粋関数でグループ化
  const groupedData = useMemo(() => {
    if (!mapsQuery.data) return undefined;
    return groupMapsBySections(mapsQuery.data, sectionsQuery.data ?? []);
  }, [mapsQuery.data, sectionsQuery.data]);

  const isLoading = sectionsQuery.isLoading || mapsQuery.isLoading;
  const error = sectionsQuery.error || mapsQuery.error;
  const isRefetching = sectionsQuery.isRefetching || mapsQuery.isRefetching;

  const refetch = useCallback(async () => {
    await Promise.all([sectionsQuery.refetch(), mapsQuery.refetch()]);
  }, [sectionsQuery, mapsQuery]);

  // セクションがあるかどうか
  const hasSections = useMemo(() => {
    if (!groupedData) return false;
    // セクションなし以外のグループがあるかチェック
    return groupedData.some((group) => group.section !== null);
  }, [groupedData]);

  if (isLoading) {
    return (
      <View className="flex-1">
        {headerContent}
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1">
        {headerContent}
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">
            読み込みに失敗しました
          </Text>
        </View>
      </View>
    );
  }

  if (!groupedData || groupedData.length === 0) {
    return (
      <View className="flex-1">
        {headerContent}
        <View className="items-center justify-center py-8">
          <Ionicons name="map-outline" size={48} color="#9CA3AF" />
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            マップがありません
          </Text>
        </View>
      </View>
    );
  }

  // セクションなしの場合: フラットなマップリスト
  if (!hasSections) {
    const allMaps = groupedData.flatMap((group) => group.maps);
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {headerContent}
        <FlatMapList maps={allMaps} currentUserId={currentUserId} onMapPress={onMapPress} />
      </ScrollView>
    );
  }

  // セクションがある場合: セクション一覧のみ表示（セクションなしのマップは非表示）
  const sectionGroups = groupedData
    .filter((group) => group.section !== null)
    .map((group) => ({
      section: group.section!,
      mapCount: group.maps.length,
    }));

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      showsVerticalScrollIndicator={false}
    >
      {headerContent}

      {/* セクション一覧（2列グリッド） */}
      <SectionGrid sections={sectionGroups} onSectionPress={onSectionPress} />
    </ScrollView>
  );
}
