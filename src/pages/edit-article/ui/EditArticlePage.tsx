/**
 * 記事編集ページ
 *
 * マップ内の各スポットの紹介文を編集する
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PageHeader } from '@/shared/ui';
import { useMapArticle, useUpdateSpotArticle, useUpdateMap } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import type { SpotWithImages } from '@/shared/types';

interface EditArticlePageProps {
  mapId: string;
}

export function EditArticlePage({ mapId }: EditArticlePageProps) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { data: articleData, isLoading } = useMapArticle(mapId, currentUserId);
  const { mutate: updateSpotArticle, isPending: isSaving } = useUpdateSpotArticle();
  const { mutate: updateMap, isPending: isUpdatingMap } = useUpdateMap();

  // 各スポットの編集中の紹介文を管理
  const [editedContents, setEditedContents] = useState<Record<string, string>>({});
  // 現在展開中のスポットID
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  // 記事の公開状態
  const [isArticlePublic, setIsArticlePublic] = useState(false);

  // 初期データをセット
  useEffect(() => {
    if (articleData?.spots) {
      const initialContents: Record<string, string> = {};
      articleData.spots.forEach((spot) => {
        initialContents[spot.id] = spot.article_content || '';
      });
      setEditedContents(initialContents);
    }
    if (articleData?.map) {
      setIsArticlePublic(articleData.map.is_article_public ?? false);
    }
  }, [articleData?.spots, articleData?.map]);

  // 変更があるかどうか（実際のデータと比較）
  const hasChanges = useMemo(() => {
    if (!articleData?.spots) return false;
    return articleData.spots.some((spot) => {
      const original = spot.article_content || '';
      const edited = editedContents[spot.id] || '';
      return original !== edited;
    });
  }, [articleData?.spots, editedContents]);

  // 自分のマップかどうか
  const isOwner = currentUserId === articleData?.map.user_id;

  // テキスト変更ハンドラー
  const handleContentChange = useCallback((spotId: string, text: string) => {
    setEditedContents((prev) => ({
      ...prev,
      [spotId]: text,
    }));
  }, []);

  // 記事公開設定の変更ハンドラー
  const handleToggleArticlePublic = useCallback((value: boolean) => {
    setIsArticlePublic(value);
    updateMap(
      { id: mapId, is_article_public: value },
      {
        onSuccess: () => {
          // 成功時は何もしない（UIは既に更新されている）
        },
        onError: () => {
          // エラー時は元に戻す
          setIsArticlePublic(!value);
          Alert.alert('エラー', '公開設定の変更に失敗しました');
        },
      }
    );
  }, [mapId, updateMap]);

  // スポットの展開/折りたたみ
  const handleToggleExpand = useCallback((spotId: string) => {
    setExpandedSpotId((prev) => (prev === spotId ? null : spotId));
  }, []);

  // 個別のスポットを保存
  const handleSaveSpot = useCallback((spot: SpotWithImages) => {
    const newContent = editedContents[spot.id];
    const originalContent = spot.article_content || '';

    // 変更がない場合はスキップ
    if (newContent === originalContent) {
      return;
    }

    updateSpotArticle({
      spotId: spot.id,
      articleContent: newContent || null,
      mapId,
    });
  }, [editedContents, mapId, updateSpotArticle]);

  // 戻るボタン（変更がある場合は確認）
  const handleBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        '変更を破棄しますか？',
        '保存していない変更があります。',
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '破棄',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }, [hasChanges, router]);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="記事を編集" onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // データなし or 権限なし
  if (!articleData || !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="記事を編集" onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!articleData ? '記事が見つかりません' : '編集権限がありません'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title="記事を編集" onBack={handleBack} />

      <ScrollView className="flex-1">
        {/* マップ情報 */}
        <View className="px-4 py-4 border-b border-border dark:border-dark-border">
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
            {articleData.map.name}
          </Text>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            {articleData.spots.length}スポット
          </Text>
        </View>

        {/* 記事公開設定 */}
        <View className="px-4 py-4 border-b border-border dark:border-dark-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center">
                <Ionicons
                  name={isArticlePublic ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={isArticlePublic ? colors.primary.DEFAULT : colors.gray[500]}
                />
                <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
                  記事を公開
                </Text>
              </View>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
                {isArticlePublic
                  ? 'この記事は他のユーザーに公開されています'
                  : 'この記事は非公開です（マップの公開とは別）'}
              </Text>
            </View>
            <Switch
              value={isArticlePublic}
              onValueChange={handleToggleArticlePublic}
              trackColor={{ false: colors.gray[200], true: colors.primary.light }}
              thumbColor={isArticlePublic ? colors.primary.DEFAULT : '#f4f3f4'}
              disabled={isUpdatingMap}
            />
          </View>
        </View>

        {/* スポット一覧 */}
        {articleData.spots.map((spot, index) => {
          const isExpanded = expandedSpotId === spot.id;
          const currentContent = editedContents[spot.id] || '';
          const originalContent = spot.article_content || '';
          const isChanged = currentContent !== originalContent;
          const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
          const firstImage = spot.images?.[0]?.cloud_path;

          return (
            <View key={spot.id} className="border-b border-border dark:border-dark-border">
              {/* スポットヘッダー（タップで展開） */}
              <Pressable
                onPress={() => handleToggleExpand(spot.id)}
                className="flex-row items-center px-4 py-3"
              >
                {/* 番号 */}
                <Text className="text-lg font-bold text-primary-500 w-8">
                  {index + 1}.
                </Text>

                {/* サムネイル */}
                {firstImage ? (
                  <Image
                    source={{ uri: firstImage }}
                    className="w-12 h-12 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-lg bg-gray-200 items-center justify-center mr-3">
                    <Ionicons name="image-outline" size={20} color={colors.gray[400]} />
                  </View>
                )}

                {/* スポット名 */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                    {spotName}
                  </Text>
                  <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-0.5">
                    {currentContent ? `${currentContent.length}文字` : '紹介文なし'}
                  </Text>
                </View>

                {/* 変更マーク */}
                {isChanged && (
                  <View className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                )}

                {/* 展開アイコン */}
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.gray[400]}
                />
              </Pressable>

              {/* 展開時の編集エリア */}
              {isExpanded && (
                <View className="px-4 pb-4">
                  <TextInput
                    value={currentContent}
                    onChangeText={(text) => handleContentChange(spot.id, text)}
                    placeholder="このスポットの紹介文を入力..."
                    placeholderTextColor={colors.gray[400]}
                    multiline
                    className="bg-background-secondary dark:bg-dark-background-secondary rounded-xl px-4 py-3 text-base text-foreground dark:text-dark-foreground min-h-[150px]"
                    textAlignVertical="top"
                  />

                  {/* 保存ボタン */}
                  <View className="flex-row justify-end mt-3">
                    <Pressable
                      onPress={() => handleSaveSpot(spot)}
                      disabled={!isChanged || isSaving}
                      style={{
                        backgroundColor: isChanged ? colors.primary.DEFAULT : colors.gray[200],
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                    >
                      {isSaving ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text
                          style={{
                            color: isChanged ? 'white' : colors.gray[400],
                            fontWeight: '600',
                          }}
                        >
                          保存
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* スポットがない場合 */}
        {articleData.spots.length === 0 && (
          <View className="py-12 items-center">
            <Ionicons name="location-outline" size={48} color={colors.gray[300]} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">スポットがありません</Text>
            <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted mt-1">
              マップにスポットを追加してください
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
