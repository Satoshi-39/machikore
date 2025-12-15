/**
 * 特集詳細ページ
 *
 * 特集カルーセルアイテムの詳細を表示
 * 関連タグをチップ形式で一覧表示し、タップでタグ別マップ一覧へ遷移
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { Href } from 'expo-router';
import { useFeaturedCarouselItem } from '@/entities/featured-carousel';
import { PageHeader } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import { colors } from '@/shared/config';

export function FeaturedDetailPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: item, isLoading, error } = useFeaturedCarouselItem(id);

  const handleTagPress = useCallback(
    (tag: string) => {
      router.push(`/(tabs)/discover/tag-results?tag=${encodeURIComponent(tag)}` as Href);
    },
    [router]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="特集" onBack={goBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="特集" onBack={goBack} />
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
      <PageHeader title={item.title} onBack={goBack} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ヘッダー画像 */}
        <View className="relative" style={{ height: 200 }}>
          <Image
            source={{ uri: item.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              justifyContent: 'flex-end',
              padding: 16,
            }}
          >
            <Text className="text-white text-2xl font-bold">{item.title}</Text>
            {item.description && (
              <Text className="text-white/80 text-sm mt-1">{item.description}</Text>
            )}
          </LinearGradient>
        </View>

        {/* 関連タグ一覧 */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-text dark:text-dark-text mb-4">
            カテゴリから探す
          </Text>

          {item.related_tags && item.related_tags.length > 0 ? (
            <View className="flex-row flex-wrap gap-3">
              {item.related_tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => handleTagPress(tag)}
                  className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 active:opacity-70"
                >
                  <Text className="text-text dark:text-dark-text font-medium">
                    #{tag}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              関連タグがありません
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
