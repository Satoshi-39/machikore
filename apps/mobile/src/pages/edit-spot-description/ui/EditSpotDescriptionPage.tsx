/**
 * スポットの一言編集ページ
 *
 * スポットのdescription（一言）を編集・保存する
 */

import { useCallback, useState } from 'react';
import { Alert, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails, useUpdateSpot } from '@/entities/user-spot/api';
import { INPUT_LIMITS } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader, Input, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface EditSpotDescriptionPageProps {
  spotId: string;
}

export function EditSpotDescriptionPage({ spotId }: EditSpotDescriptionPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading, refetch } = useSpotWithDetails(spotId, currentUserId);
  const { mutate: updateSpot, isPending: isSaving } = useUpdateSpot();

  const [description, setDescription] = useState<string | null>(null);

  // 初期値を設定（spotがロードされたら）
  const currentDescription = description ?? spot?.description ?? '';

  const handleSave = useCallback(() => {
    if (!spot) return;

    const trimmedDescription = currentDescription.trim();
    if (!trimmedDescription) {
      Alert.alert(t('common.error'), t('spot.oneWordRequired'));
      return;
    }

    updateSpot(
      {
        spotId: spot.id,
        mapId: spot.map_id,
        description: trimmedDescription,
      },
      {
        onSuccess: () => {
          Alert.alert(t('editArticle.saved'));
          refetch();
          router.back();
        },
        onError: () => {
          Alert.alert(t('common.error'), '一言の保存に失敗しました');
        },
      }
    );
  }, [spot, currentDescription, updateSpot, refetch, router, t]);

  // ローディング状態
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('spot.oneWord')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  // スポットが見つからない or 権限なし
  if (!spot || spot.user_id !== currentUserId) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('spot.oneWord')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="lock-closed-outline"
            size={48}
            className="text-gray-300"
          />
          <Text className="text-on-surface-variant mt-4">
            {!spot ? t('editArticle.spotNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  // 変更があるかどうか
  const hasChanges = currentDescription.trim() !== (spot.description ?? '');
  const isValid = currentDescription.trim().length > 0;

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader title={t('spot.oneWord')} />

      <View className="p-4">
        {/* 一言入力 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-base font-semibold text-on-surface">
              {t('spot.oneWordRequired')}
            </Text>
            <Ionicons name="pencil" size={14} className="text-gray-400" style={{ marginLeft: 6 }} />
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Input
            value={currentDescription}
            onChangeText={setDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
            autoFocus
            style={{ fontSize: 12, lineHeight: 18 }}
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-on-surface-variant">
              {currentDescription.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* 保存ボタン */}
        <Button onPress={handleSave} disabled={isSaving || !isValid || !hasChanges}>
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText className={buttonTextVariants()}>
              {t('common.save')}
            </ButtonText>
          )}
        </Button>
      </View>
    </View>
  );
}
