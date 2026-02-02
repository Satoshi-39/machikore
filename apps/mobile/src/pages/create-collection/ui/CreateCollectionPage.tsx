/**
 * コレクション作成ページ
 *
 * モーダルとして下からスライドして表示
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateCollection } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { Input, PageHeader, PublicToggle, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import { MapThumbnailPicker, type MapThumbnailImage } from '@/features/pick-images';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

export function CreateCollectionPage() {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { mutate: createCollection, isPending } = useCreateCollection();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnail, setThumbnail] = useState<MapThumbnailImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isValid = name.trim().length > 0;
  const isSubmitting = isPending || isUploading;

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !currentUserId || isSubmitting) return;

    let thumbnailUrl: string | undefined;
    let thumbnailCrop = thumbnail?.cropRegion ?? undefined;

    // サムネイルがあればアップロード（元画像を使用）
    if (thumbnail) {
      setIsUploading(true);
      try {
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
        } else {
          log.error('[CreateCollectionPage] サムネイルアップロードエラー:', result.error);
          setIsUploading(false);
          return;
        }
      } catch (error) {
        log.error('[CreateCollectionPage] サムネイルアップロードエラー:', error);
        setIsUploading(false);
        return;
      }
      // NOTE: isUploadingはcreateCollectionの完了後にリセット
    }

    createCollection(
      {
        userId: currentUserId,
        name: name.trim(),
        description: description.trim() || undefined,
        thumbnailUrl,
        thumbnailCrop,
        isPublic,
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          router.back();
        },
        onError: () => {
          setIsUploading(false);
        },
      }
    );
  }, [name, description, isPublic, thumbnail, currentUserId, createCollection, isSubmitting, router]);

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('collection.newCollection')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        {/* フォーム */}
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="px-4 py-6">
            {/* 名前入力 */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-on-surface mb-2">
                {t('collection.collectionName')} <Text className="text-red-500">*</Text>
              </Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder={t('collection.collectionNamePlaceholder')}
                autoFocus
                returnKeyType="next"
                editable={!isSubmitting}
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
                editable={!isSubmitting}
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
            <View className="bg-surface border-thin border-outline rounded-xl px-4 py-4 mb-6">
              <PublicToggle
                value={isPublic}
                onValueChange={setIsPublic}
                disabled={isSubmitting}
                description={t('collection.publicDescription')}
              />
            </View>

            {/* 作成ボタン */}
            <View className="mb-4">
              <Button onPress={handleSubmit} disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ButtonText className={buttonTextVariants()}>
                    {t('collection.create')}
                  </ButtonText>
                )}
              </Button>
            </View>
          </View>
          {/* 下部余白 */}
          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
