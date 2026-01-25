/**
 * 報告ページ
 *
 * FSDの原則：Pageレイヤー
 * マップ、スポット、ユーザー、コメントの報告を行う
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PageHeader, Input } from '@/shared/ui';
import { INPUT_LIMITS } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { createReport, checkAlreadyReported, type ReportTargetType, type ReportReason } from '@/shared/api/supabase/reports';
import { log } from '@/shared/config/logger';

interface ReportPageProps {
  targetType: ReportTargetType;
  targetId: string;
}

// 報告理由の選択肢
const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: 'spam', label: 'スパム', description: '宣伝や無関係なコンテンツ' },
  { value: 'inappropriate', label: '不適切なコンテンツ', description: '暴力的、性的、または不快なコンテンツ' },
  { value: 'harassment', label: '嫌がらせ', description: '個人への攻撃や嫌がらせ' },
  { value: 'misinformation', label: '誤った情報', description: '虚偽や誤解を招く情報' },
  { value: 'copyright', label: '著作権侵害', description: '著作権のある素材の無断使用' },
  { value: 'other', label: 'その他', description: '上記に該当しない問題' },
];

const TARGET_LABELS: Record<ReportTargetType, string> = {
  map: 'マップ',
  spot: 'スポット',
  user: 'ユーザー',
  comment: 'コメント',
};

export function ReportPage({ targetType, targetId }: ReportPageProps) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetLabel = TARGET_LABELS[targetType];

  // 報告を実際に送信する処理
  const submitReport = useCallback(async () => {
    if (!currentUserId || !selectedReason) return;

    setIsSubmitting(true);

    try {
      // 既に報告済みかチェック
      const alreadyReported = await checkAlreadyReported(currentUserId, targetType, targetId);
      if (alreadyReported) {
        Alert.alert('報告済み', 'この対象は既に報告済みです。対応をお待ちください。');
        setIsSubmitting(false);
        return;
      }

      // 報告を作成
      await createReport({
        reporterId: currentUserId,
        targetType,
        targetId,
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      Alert.alert(
        '報告完了',
        'ご報告ありがとうございます。内容を確認いたします。',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      log.error('[ReportPage] Error:', error);
      Alert.alert('エラー', '報告の送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUserId, selectedReason, description, targetType, targetId, router]);

  // 送信ボタン押下時（確認ダイアログを表示）
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    if (!selectedReason) {
      Alert.alert('エラー', '報告理由を選択してください');
      return;
    }

    const reasonLabel = REPORT_REASONS.find((r) => r.value === selectedReason)?.label ?? '';

    Alert.alert(
      '報告の確認',
      `この${targetLabel}を「${reasonLabel}」として報告しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '報告する', style: 'destructive', onPress: submitReport },
      ]
    );
  }, [currentUserId, selectedReason, targetLabel, submitReport]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface"
    >
      <PageHeader
        title={`${targetLabel}を報告`}
        showBackButton
        rightComponent={
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting || !selectedReason}
            className="py-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" className="text-primary" />
            ) : (
              <Text
                className={`text-base font-semibold ${
                  selectedReason ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                送信
              </Text>
            )}
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-sm text-on-surface-variant">
            この{targetLabel}に問題がある場合は、理由を選択して報告してください。
            報告内容は運営チームが確認します。
          </Text>
        </View>

        {/* 報告理由の選択 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-3">
            報告理由 <Text className="text-red-500">*</Text>
          </Text>
          <View className="gap-2">
            {REPORT_REASONS.map((reason) => (
              <Pressable
                key={reason.value}
                onPress={() => setSelectedReason(reason.value)}
                className={`p-4 rounded-lg border ${
                  selectedReason === reason.value
                    ? 'border-primary bg-primary/10'
                    : 'border-outline bg-surface'
                }`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedReason === reason.value
                        ? 'border-primary'
                        : 'border-outline'
                    }`}
                  >
                    {selectedReason === reason.value && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-on-surface">
                      {reason.label}
                    </Text>
                    <Text className="text-sm text-on-surface-variant mt-0.5">
                      {reason.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 詳細説明（任意） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            詳細（任意）
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="問題の詳細を入力してください"
            multiline
            numberOfLines={6}
            maxLength={INPUT_LIMITS.REPORT_DESCRIPTION}
            style={{ minHeight: 120 }}
            textAlignVertical="top"
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {description.length}/{INPUT_LIMITS.REPORT_DESCRIPTION}
          </Text>
        </View>

        {/* 注意事項 */}
        <View className="p-4 bg-secondary rounded-lg">
          <View className="flex-row items-start">
            <Ionicons name="information-circle-outline" size={20} className="text-on-surface-variant" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-on-surface-variant">
                虚偽の報告を繰り返した場合、アカウントが制限される場合があります。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
