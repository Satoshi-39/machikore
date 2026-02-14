/**
 * スポット作成時のひとこと編集ページ
 *
 * スポット登録前にひとことを編集
 * 編集内容はZustandストアに一時保存される
 */

import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelectedPlaceStore } from '@/features/search-places';
import { INPUT_LIMITS, fontSizeNum, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader, Input, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

export function CreateSpotDescriptionPage() {
  const { t } = useI18n();
  const router = useRouter();
  const draftDescription = useSelectedPlaceStore((state) => state.draftDescription);
  const setDraftDescription = useSelectedPlaceStore((state) => state.setDraftDescription);

  const [description, setDescription] = useState(draftDescription);

  // ストアの値が変わったら同期
  useEffect(() => {
    setDescription(draftDescription);
  }, [draftDescription]);

  const handleConfirm = useCallback(() => {
    const trimmed = description.trim();
    if (!trimmed) {
      Alert.alert(t('common.error'), t('spot.oneWordRequired'));
      return;
    }

    setDraftDescription(trimmed);
    router.back();
  }, [description, setDraftDescription, router, t]);

  // 変更があるかどうか
  const hasChanges = description.trim() !== draftDescription;
  const isValid = description.trim().length > 0;

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('spot.oneWord')} />

      <View className="p-4">
        {/* ひとこと入力 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-base font-semibold text-on-surface">
              {t('spot.oneWordRequired')}
            </Text>
            <Ionicons name="pencil" size={iconSizeNum.xs} className="text-gray-400" style={{ marginLeft: 6 }} />
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
            autoFocus
            style={{ fontSize: fontSizeNum.xs, lineHeight: 18 }}
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-on-surface-variant">
              {description.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* 確定ボタン */}
        <Button onPress={handleConfirm} disabled={!isValid || !hasChanges}>
          <ButtonText className={buttonTextVariants()}>
            {t('common.confirm')}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
