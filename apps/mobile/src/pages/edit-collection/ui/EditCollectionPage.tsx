/**
 * コレクション編集ページ
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { useCollection, useUpdateCollection } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { Input, PageHeader, PublicToggle, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import { MapThumbnailPicker, type MapThumbnailImage } from '@/features/pick-images';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

export function EditCollectionPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();

  const { data: collection, isLoading } = useCollection(id);
  const { mutate: updateCollection, isPending: isUpdating } = useUpdateCollection();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnail, setThumbnail] = useState<MapThumbnailImage | null>(null);
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // コレクションデータをフォームに反映
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setIsPublic(collection.is_public);
      if (collection.thumbnail_url) {
        setThumbnail({ uri: collection.thumbnail_url, width: 0, height: 0 });
        setOriginalThumbnailUrl(collection.thumbnail_url);
      }
    }
  }, [collection]);

  const isValid = name.trim().length > 0;
  const isSubmitting = isUpdating || isUploading;

  const handleSubmit = useCallback(async () => {
    if (!id || !currentUserId || !name.trim() || isSubmitting) return;

    let thumbnailUrl: string | null | undefined;

    // サムネイルが変更された場合
    if (thumbnail?.uri !== originalThumbnailUrl) {
      if (thumbnail) {
        // 新しい画像をアップロード
        setIsUploading(true);
        try {
          const timestamp = Date.now();
          const path = `${currentUserId}/${timestamp}.jpg`;
          const result = await uploadImage({
            uri: thumbnail.uri,
            bucket: STORAGE_BUCKETS.COLLECTION_THUMBNAILS,
            path,
          });
          if (result.success) {
            thumbnailUrl = result.data.url;
          }
        } catch (error) {
          log.error('[EditCollectionPage] サムネイルアップロードエラー:', error);
        } finally {
          setIsUploading(false);
        }
      } else {
        // 画像が削除された
        thumbnailUrl = null;
      }
    }

    updateCollection(
      {
        collectionId: id,
        userId: currentUserId,
        updates: {
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
          ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
        },
      },
      {
        onSuccess: () => router.back(),
      }
    );
  }, [id, currentUserId, name, description, isPublic, thumbnail, originalThumbnailUrl, updateCollection, isSubmitting, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.editCollection')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.editCollection')} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={iconSizeNum['3xl']} className="text-gray-400" />
          <Text className="text-on-surface-variant mt-4">{t('collection.collectionNotFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('collection.editCollection')} />

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {/* 名前入力 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('collection.collectionName')} <Text className="text-red-500">*</Text>
          </Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={t('collection.collectionNamePlaceholder')}
          />
        </View>

        {/* 説明入力 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('collection.descriptionOptional')}
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('collection.descriptionPlaceholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
        </View>

        {/* サムネイル */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-on-surface mb-2">
            {t('collection.thumbnail')}
          </Text>
          <MapThumbnailPicker
            image={thumbnail}
            onImageChange={setThumbnail}
          />
        </View>

        {/* 公開設定 */}
        <View className="bg-surface rounded-xl px-4 py-4 border-thin border-outline">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={t('collection.publicDescription')}
          />
        </View>

        {/* マップを管理 */}
        <Pressable
          onPress={() => router.push(`/add-maps-to-collection?id=${id}` as Href)}
          className="bg-surface rounded-xl px-4 py-4 border-thin border-outline mt-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="map" size={iconSizeNum.md} className="text-primary" />
            <Text className="text-base font-medium text-on-surface ml-3">
              {t('collection.manageMaps')}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-on-surface-variant mr-2">
              {t('collection.itemsCount', { count: collection.maps_count })}
            </Text>
            <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-gray-400" />
          </View>
        </Pressable>

        {/* 保存ボタン */}
        <View className="mt-6 mb-4">
          <Button onPress={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('common.save')}
              </ButtonText>
            )}
          </Button>
        </View>
        {/* 下部余白 */}
        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
