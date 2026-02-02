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
import { uploadImage, deleteImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import type { ThumbnailCrop } from '@/shared/lib/image';

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
  // submit済みフラグ（保存後に変更検知をスキップする）
  const [isSubmitted, setIsSubmitted] = useState(false);

  // コレクションデータをフォームに反映
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setIsPublic(collection.is_public);
      if (collection.thumbnail_url) {
        const crop = collection.thumbnail_crop as ThumbnailCrop | null;
        setThumbnail({
          uri: collection.thumbnail_url,
          width: crop?.imageWidth ?? 0,
          height: crop?.imageHeight ?? 0,
        });
        setOriginalThumbnailUrl(collection.thumbnail_url);
      }
    }
  }, [collection]);

  const isValid = name.trim().length > 0;
  const isSubmitting = isUpdating || isUploading;

  // サムネイル変更時にsubmitフラグをリセット
  const handleThumbnailChange = (image: MapThumbnailImage | null) => {
    setThumbnail(image);
    setIsSubmitted(false);
  };

  // 既存のサムネイルURLからパスを抽出するヘルパー関数
  const extractPathFromUrl = (url: string): string | null => {
    try {
      const pattern = new RegExp(`/storage/v1/object/public/${STORAGE_BUCKETS.COLLECTION_THUMBNAILS}/(.+)$`);
      const match = url.match(pattern);
      return match?.[1] ?? null;
    } catch {
      return null;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!id || !currentUserId || !name.trim() || isSubmitting) return;

    let thumbnailUrl: string | null | undefined;
    let thumbnailCrop: ThumbnailCrop | null | undefined;

    // サムネイルが変更された場合
    const thumbnailChanged = thumbnail?.uri !== originalThumbnailUrl;

    if (thumbnailChanged) {
      if (thumbnail && !thumbnail.uri.startsWith('http')) {
        // 新しい画像をアップロード（元画像を使用）
        setIsUploading(true);
        try {
          // 古いサムネイルがあればS3から削除
          if (originalThumbnailUrl) {
            const oldPath = extractPathFromUrl(originalThumbnailUrl);
            if (oldPath) {
              await deleteImage(STORAGE_BUCKETS.COLLECTION_THUMBNAILS, oldPath);
            }
          }

          const uploadUri = thumbnail.originalUri ?? thumbnail.uri;
          const timestamp = Date.now();
          const path = `${currentUserId}/${timestamp}.jpg`;
          const result = await uploadImage({
            uri: uploadUri,
            bucket: STORAGE_BUCKETS.COLLECTION_THUMBNAILS,
            path,
          });
          if (result.success) {
            thumbnailUrl = result.data.url;
            thumbnailCrop = thumbnail.cropRegion ?? null;
          } else {
            log.error('[EditCollectionPage] サムネイルアップロードエラー:', result.error);
            setIsUploading(false);
            return;
          }
        } catch (error) {
          log.error('[EditCollectionPage] サムネイルアップロードエラー:', error);
          setIsUploading(false);
          return;
        }
        // NOTE: isUploadingはupdateCollectionの完了後にリセット
      } else if (!thumbnail) {
        // 画像が削除された
        if (originalThumbnailUrl) {
          const oldPath = extractPathFromUrl(originalThumbnailUrl);
          if (oldPath) {
            await deleteImage(STORAGE_BUCKETS.COLLECTION_THUMBNAILS, oldPath);
          }
        }
        thumbnailUrl = null;
        thumbnailCrop = null;
      }
    }

    // submit済みにして変更検知をスキップ
    setIsSubmitted(true);

    updateCollection(
      {
        collectionId: id,
        userId: currentUserId,
        updates: {
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
          ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
          ...(thumbnailCrop !== undefined && { thumbnail_crop: thumbnailCrop }),
        },
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          router.back();
        },
        onError: () => {
          setIsUploading(false);
          setIsSubmitted(false);
        },
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

  // 変更検知（isSubmitted時はthumbnailをオリジナルとして扱う）
  const currentThumbnailUri = isSubmitted ? originalThumbnailUrl : (thumbnail?.uri || null);
  const hasChanges =
    name.trim() !== (collection.name || '') ||
    description.trim() !== (collection.description || '') ||
    isPublic !== collection.is_public ||
    currentThumbnailUri !== (collection.thumbnail_url || null);

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
            onImageChange={handleThumbnailChange}
            initialCrop={collection.thumbnail_crop as ThumbnailCrop | null}
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
          <Button onPress={handleSubmit} disabled={!isValid || isSubmitting || !hasChanges}>
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
