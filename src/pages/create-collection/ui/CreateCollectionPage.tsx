/**
 * コレクション作成ページ
 *
 * モーダルとして下からスライドして表示
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCreateCollection } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';

export function CreateCollectionPage() {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { mutate: createCollection, isPending } = useCreateCollection();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnail, setThumbnail] = useState<ThumbnailImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isValid = name.trim().length > 0;
  const isSubmitting = isPending || isUploading;

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !currentUserId || isSubmitting) return;

    let thumbnailUrl: string | undefined;

    // サムネイルがあればアップロード
    if (thumbnail) {
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
        console.error('サムネイルアップロードエラー:', error);
      } finally {
        setIsUploading(false);
      }
    }

    createCollection(
      {
        userId: currentUserId,
        name: name.trim(),
        description: description.trim() || undefined,
        thumbnailUrl,
        isPublic,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  }, [name, description, isPublic, thumbnail, currentUserId, createCollection, isSubmitting, router]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <Pressable onPress={handleCancel} className="py-2 w-20">
            <Text className="text-gray-600 text-base">キャンセル</Text>
          </Pressable>
          <Text className="flex-1 text-lg font-semibold text-gray-900 text-center">
            新しいコレクション
          </Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="py-2 w-20 items-end"
          >
            <Text
              className={`text-base font-semibold ${
                isValid && !isSubmitting ? 'text-primary-600' : 'text-gray-300'
              }`}
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Text>
          </Pressable>
        </View>

        {/* フォーム */}
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="px-4 py-6">
            {/* 名前入力 */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                コレクション名 <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="例: 東京カフェコレクション"
                placeholderTextColor={colors.gray[400]}
                className="bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900"
                autoFocus
                returnKeyType="next"
                editable={!isSubmitting}
              />
            </View>

            {/* 説明入力 */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                説明（任意）
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="コレクションの説明を入力..."
                placeholderTextColor={colors.gray[400]}
                className="bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                editable={!isSubmitting}
              />
            </View>

            {/* サムネイル */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                サムネイル
              </Text>
              <ThumbnailPicker
                image={thumbnail}
                onImageChange={setThumbnail}
              />
            </View>

            {/* 公開設定 */}
            <View className="bg-gray-50 rounded-xl px-4 py-4 mb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-medium text-gray-900 mb-1">
                    公開する
                  </Text>
                  <Text className="text-sm text-gray-500">
                    オンにすると、他のユーザーがこのコレクションを閲覧できます
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: colors.gray[200], true: colors.primary.DEFAULT }}
                  thumbColor="#fff"
                  disabled={isSubmitting}
                />
              </View>
            </View>

            {/* ヒント */}
            <View className="flex-row items-start bg-blue-50 rounded-xl p-4">
              <Ionicons name="information-circle" size={20} color={colors.primary.DEFAULT} />
              <Text className="text-sm text-gray-600 ml-2 flex-1">
                コレクションを作成後、マップを追加できます
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
