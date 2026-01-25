/**
 * コレクション編集ページ
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCollection, useUpdateCollection } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader, PublicToggle } from '@/shared/ui';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
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
  const [thumbnail, setThumbnail] = useState<ThumbnailImage | null>(null);
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
      <View className="flex-1 bg-surface-variant">
        <PageHeader title={t('collection.editCollection')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-surface-variant">
        <PageHeader title={t('collection.editCollection')} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={48} className="text-gray-400" />
          <Text className="text-on-surface-variant mt-4">{t('collection.collectionNotFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader
        title={t('collection.editCollection')}
        rightComponent={
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="py-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" className="text-primary" />
            ) : (
              <Text
                className={`text-base font-semibold ${isValid ? 'text-on-surface' : 'text-gray-300'}`}
              >
                {t('common.save')}
              </Text>
            )}
          </Pressable>
        }
      />

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {/* 名前入力 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-on-surface mb-2">
            {t('collection.collectionName')} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('collection.collectionNamePlaceholder')}
            placeholderTextColor={colors.primitive.gray[400]}
            className="bg-surface rounded-xl px-4 py-3 text-base text-on-surface border border-outline"
          />
        </View>

        {/* 説明入力 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-on-surface mb-2">
            {t('collection.descriptionOptional')}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('collection.descriptionPlaceholder')}
            placeholderTextColor={colors.primitive.gray[400]}
            className="bg-surface rounded-xl px-4 py-3 text-base text-on-surface border border-outline"
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
          <ThumbnailPicker
            image={thumbnail}
            onImageChange={setThumbnail}
          />
        </View>

        {/* 公開設定 */}
        <View className="bg-surface rounded-xl px-4 py-4 border border-outline">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={t('collection.publicDescription')}
          />
        </View>

        {/* マップを管理 */}
        <Pressable
          onPress={() => router.push(`/add-maps-to-collection?id=${id}` as Href)}
          className="bg-surface rounded-xl px-4 py-4 border border-outline mt-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="map" size={20} className="text-primary" />
            <Text className="text-base font-medium text-on-surface ml-3">
              {t('collection.manageMaps')}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-on-surface-variant mr-2">
              {t('collection.itemsCount', { count: collection.maps_count })}
            </Text>
            <Ionicons name="chevron-forward" size={20} className="text-gray-400" />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
