/**
 * 特集詳細ページ
 *
 * 特集カルーセルアイテムの詳細を表示
 * 運営からのお知らせや特集コンテンツを表示
 */

import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeaturedCarouselItem } from '@/entities/featured-carousel';
import { PageHeader } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import { colors } from '@/shared/config';

export function FeaturedDetailPage() {
  const { goBack } = useSafeBack();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: item, isLoading, error } = useFeaturedCarouselItem(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="特集" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="特集" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-secondary dark:text-dark-text-secondary text-center">
            特集が見つかりませんでした
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      <PageHeader title={item.title} onBack={goBack} useSafeArea={false} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ヘッダー画像 */}
        <View style={{ height: 200 }}>
          <Image
            source={{ uri: item.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        {/* コンテンツ */}
        <View className="px-4 py-6">
          {/* 説明文 */}
          {item.description && (
            <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
              {item.description}
            </Text>
          )}

          {/* 本文 */}
          {item.content && (
            <Text className="text-base text-foreground dark:text-dark-foreground leading-relaxed">
              {item.content}
            </Text>
          )}

          {/* コンテンツがない場合 */}
          {!item.description && !item.content && (
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-center">
              コンテンツがありません
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
