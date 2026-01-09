/**
 * 帰属表示（Attribution）ページ
 *
 * 地図データ、API等の著作権・帰属表示情報を表示
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/shared/ui';
import { ATTRIBUTIONS, type Attribution } from '@/shared/config';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface AttributionsPageProps {
  onBack?: () => void;
}

// カテゴリヘッダー
interface CategorySectionProps {
  title: string;
  children: React.ReactNode;
}

function CategorySection({ title, children }: CategorySectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary uppercase px-4 pb-2">
        {title}
      </Text>
      <View className="bg-surface dark:bg-dark-surface">{children}</View>
    </View>
  );
}

// 帰属表示アイテム
interface AttributionItemProps {
  attribution: Attribution;
}

function AttributionItem({ attribution }: AttributionItemProps) {
  const handlePress = () => {
    Linking.openURL(attribution.url);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3.5 border-b border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
    >
      <View className="flex-1">
        <Text className="text-base text-foreground dark:text-dark-foreground font-medium">
          {attribution.name}
        </Text>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-0.5">
          {attribution.text}
        </Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.text.secondary} />
    </Pressable>
  );
}

export function AttributionsPage({ onBack }: AttributionsPageProps) {
  const { t } = useI18n();

  // カテゴリ別にグループ化
  const mapAttributions = ATTRIBUTIONS.filter((attr) => attr.category === 'map');
  const dataAttributions = ATTRIBUTIONS.filter((attr) => attr.category === 'data');
  const apiAttributions = ATTRIBUTIONS.filter((attr) => attr.category === 'api');

  return (
    <View className="flex-1 bg-muted dark:bg-dark-muted">
      <PageHeader title={t('settings.attributions')} onBack={onBack} />
      <ScrollView className="flex-1 pt-4">
        {/* 説明文 */}
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary px-4 mb-4">
          {t('settings.attributionsDescription')}
        </Text>

        {/* 地図データ */}
        {mapAttributions.length > 0 && (
          <CategorySection title={t('settings.mapData')}>
            {mapAttributions.map((attr) => (
              <AttributionItem key={attr.name} attribution={attr} />
            ))}
          </CategorySection>
        )}

        {/* 統計データ */}
        {dataAttributions.length > 0 && (
          <CategorySection title={t('settings.statisticalData')}>
            {dataAttributions.map((attr) => (
              <AttributionItem key={attr.name} attribution={attr} />
            ))}
          </CategorySection>
        )}

        {/* API */}
        {apiAttributions.length > 0 && (
          <CategorySection title={t('settings.externalApi')}>
            {apiAttributions.map((attr) => (
              <AttributionItem key={attr.name} attribution={attr} />
            ))}
          </CategorySection>
        )}

        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
