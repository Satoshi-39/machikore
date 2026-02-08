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
import { iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useRouter } from 'expo-router';
import { PageHeader, Input } from '@/shared/ui';
import { INPUT_LIMITS } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { createReport, checkAlreadyReported, type ReportTargetType, type ReportReason } from '@/shared/api/supabase/reports';
import { queryClient, QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

interface ReportPageProps {
  targetType: ReportTargetType;
  targetId: string;
}

// 報告理由の選択肢
function getReportReasons(t: (key: string) => string): { value: ReportReason; label: string; description: string }[] {
  return [
    { value: 'spam', label: t('report.spam'), description: t('report.spamDescription') },
    { value: 'inappropriate', label: t('report.inappropriate'), description: t('report.inappropriateDescription') },
    { value: 'harassment', label: t('report.harassment'), description: t('report.harassmentDescription') },
    { value: 'misinformation', label: t('report.misinformation'), description: t('report.misinformationDescription') },
    { value: 'copyright', label: t('report.copyright'), description: t('report.copyrightDescription') },
    { value: 'other', label: t('report.other'), description: t('report.otherDescription') },
  ];
}

function getTargetLabel(t: (key: string) => string, targetType: ReportTargetType): string {
  const labels: Record<ReportTargetType, string> = {
    map: t('report.targetMap'),
    spot: t('report.targetSpot'),
    user: t('report.targetUser'),
    comment: t('report.targetComment'),
  };
  return labels[targetType];
}

export function ReportPage({ targetType, targetId }: ReportPageProps) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { t } = useI18n();

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetLabel = getTargetLabel(t, targetType);
  const reportReasons = getReportReasons(t);

  // 報告を実際に送信する処理
  const submitReport = useCallback(async () => {
    if (!currentUserId || !selectedReason) return;

    setIsSubmitting(true);

    try {
      // 既に報告済みかチェック
      const alreadyReported = await checkAlreadyReported(currentUserId, targetType, targetId);
      if (alreadyReported) {
        Alert.alert(t('report.alreadyReported'), t('report.alreadyReportedMessage'));
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

      // 通報済みコンテンツをフィードから即時非表示にするためキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mixedFeed() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });

      Alert.alert(
        t('report.reportComplete'),
        t('report.reportCompleteMessage'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      log.error('[ReportPage] Error:', error);
      Alert.alert(t('common.error'), t('report.reportFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUserId, selectedReason, description, targetType, targetId, router, t]);

  // 送信ボタン押下時（確認ダイアログを表示）
  const handleSubmit = useCallback(() => {
    if (!currentUserId) {
      Alert.alert(t('common.error'), t('report.loginRequired'));
      return;
    }

    if (!selectedReason) {
      Alert.alert(t('common.error'), t('report.selectReason'));
      return;
    }

    const reasonLabel = reportReasons.find((r) => r.value === selectedReason)?.label ?? '';

    Alert.alert(
      t('report.confirmTitle'),
      t('report.confirmMessage', { target: targetLabel, reason: reasonLabel }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('report.reportButton'), style: 'destructive', onPress: submitReport },
      ]
    );
  }, [currentUserId, selectedReason, targetLabel, submitReport, t, reportReasons]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface"
    >
      <PageHeader
        title={t('report.reportTarget', { target: targetLabel })}
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
                {t('report.submit')}
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
            {t('report.description', { target: targetLabel })}
          </Text>
        </View>

        {/* 報告理由の選択 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-3">
            {t('report.reasonLabel')} <Text className="text-red-500">*</Text>
          </Text>
          <View className="gap-2">
            {reportReasons.map((reason) => (
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
            {t('report.detailLabel')}
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('report.detailPlaceholder')}
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
            <Ionicons name="information-circle-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-on-surface-variant">
                {t('report.warning')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
