/**
 * スポットの一言編集ページ
 *
 * スポットのdescription（一言）を編集
 * 「確定」でZustandストアに保存（サーバーには送信しない）
 * スポット編集ページの「変更を保存」でサーバーに送信
 */

import { useCallback, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useSpotWithDetails } from '@/entities/user-spot/api';
import { useEditSpotStore } from '@/features/edit-spot';
import { INPUT_LIMITS, fontSizeNum, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader, Input, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface EditSpotDescriptionPageProps {
  spotId: string;
}

export function EditSpotDescriptionPage({ spotId }: EditSpotDescriptionPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading } = useSpotWithDetails(spotId, currentUserId);

  // Zustandストアから状態を取得
  const storeSpotId = useEditSpotStore((state) => state.spotId);
  const draftDescription = useEditSpotStore((state) => state.draftDescription);
  const setDraftDescription = useEditSpotStore((state) => state.setDraftDescription);
  const initializeEdit = useEditSpotStore((state) => state.initializeEdit);

  const [localDescription, setLocalDescription] = useState<string | null>(null);

  // ストアが初期化されていない場合は初期化（一言のみ管理）
  useEffect(() => {
    if (spot && storeSpotId !== spot.id) {
      initializeEdit({
        spotId: spot.id,
        description: spot.description || '',
      });
    }
  }, [spot, storeSpotId, initializeEdit]);

  // ローカル状態の初期値をストアから取得
  useEffect(() => {
    if (draftDescription !== null && localDescription === null) {
      setLocalDescription(draftDescription);
    }
  }, [draftDescription, localDescription]);

  // 現在の表示値
  const currentDescription = localDescription ?? draftDescription ?? spot?.description ?? '';

  // 確定ボタン（Zustandに保存して戻る）
  const handleConfirm = useCallback(() => {
    const trimmedDescription = currentDescription.trim();
    setDraftDescription(trimmedDescription);
    router.back();
  }, [currentDescription, setDraftDescription, router]);

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
            size={iconSizeNum['3xl']}
            className="text-gray-300"
          />
          <Text className="text-on-surface-variant mt-4">
            {!spot ? t('editArticle.spotNotFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </View>
    );
  }

  // バリデーション
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
            <Ionicons name="pencil" size={iconSizeNum.xs} className="text-gray-400" style={{ marginLeft: 6 }} />
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Input
            value={currentDescription}
            onChangeText={setLocalDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
            autoFocus
            style={{ fontSize: fontSizeNum.xs, lineHeight: 18 }}
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-on-surface-variant">
              {currentDescription.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* 確定ボタン */}
        <Button onPress={handleConfirm} disabled={!isValid}>
          <ButtonText className={buttonTextVariants()}>
            {t('common.confirm')}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
