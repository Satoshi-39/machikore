/**
 * マガジンページ
 *
 * マガジンの詳細を表示
 * - ヘッダー画像
 * - 説明文・本文
 * - magazine_mapsに登録されたマップリスト（セクション別）
 */

import React, { useCallback } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMagazine } from '@/entities/featured-contents';
import { MagazineSectionList } from '@/widgets/magazine';
import { PageHeader } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import { colors } from '@/shared/config';

// ヘッダーコンテンツ（画像 + タイトル + 説明）
interface HeaderContentProps {
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
}

function HeaderContent({ imageUrl, title, description }: HeaderContentProps) {
  return (
    <>
      {/* ヘッダー画像 */}
      {imageUrl && (
        <View style={{ height: 200 }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      )}

      {/* タイトル + 説明文 */}
      {(title || description) && (
        <View className="px-4 py-4">
          {title && (
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground mb-2">
              {title}
            </Text>
          )}
          {description && (
            <Text className="text-base text-foreground dark:text-dark-foreground">
              {description}
            </Text>
          )}
        </View>
      )}
    </>
  );
}

interface MagazinePageProps {
  magazineId: string;
}

export function MagazinePage({ magazineId }: MagazinePageProps) {
  const router = useRouter();
  const { goBack } = useSafeBack();

  const { data: magazine, isLoading, error } = useMagazine(magazineId);

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  const handleSectionPress = useCallback(
    (sectionId: string) => {
      router.push(`/(tabs)/discover/magazines/${magazineId}/sections/${sectionId}` as Href);
    },
    [router, magazineId]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="マガジン" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !magazine) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="マガジン" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-center">
            マガジンが見つかりませんでした
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ヘッダーコンテンツ
  const headerContent = (
    <HeaderContent
      imageUrl={magazine.thumbnail_url}
      title={magazine.title}
      description={magazine.description}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      <PageHeader title={magazine.name} onBack={goBack} useSafeArea={false} />
      <MagazineSectionList
        magazineId={magazine.id}
        headerContent={headerContent}
        onMapPress={handleMapPress}
        onSectionPress={handleSectionPress}
      />
    </SafeAreaView>
  );
}
