/**
 * Paywallページ
 *
 * 街コレプレミアムの購入画面（ダークモード固定）
 */

import { useIsPremium } from '@/entities/subscription';
import { usePurchase } from '@/features/purchase-subscription';
import { colors, EXTERNAL_LINKS, iconSizeNum, SUBSCRIPTION } from '@/shared/config';
import * as WebBrowser from 'expo-web-browser';
import { useSafeBack } from '@/shared/lib/navigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import type { PurchasesPackage } from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// バナー画像
const paywallBanner = require('@assets/images/paywall_image.jpg');

// ダークモード固定カラー（デザイントークンのdarkテーマに準拠）
const DARK = {
  bg: colors.dark.surface, // #111827
  surface: colors.dark['surface-variant'], // #1F2937
  surfaceLight: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.1)',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  accent: '#60A5FA',
  accentBg: 'rgba(96,165,250,0.12)',
  success: '#34D399',
  error: '#F87171',
  white: '#FFFFFF',
} as const;

interface PaywallPageProps {
  onPurchaseSuccess?: () => void;
}

// プラン比較テーブルのデータ
const COMPARISON_ROWS: {
  label: string;
  unit: string;
  free: string;
  premium: string;
}[] = [
  {
    label: '広告表示',
    unit: '',
    free: 'あり',
    premium: 'なし',
  },
  {
    label: 'スポット作成',
    unit: 'マップごと',
    free: `${SUBSCRIPTION.FREE_SPOT_LIMIT}`,
    premium: `${SUBSCRIPTION.PREMIUM_SPOT_LIMIT}`,
  },
  {
    label: '画像挿入',
    unit: 'スポットごと',
    free: `${SUBSCRIPTION.FREE_IMAGE_LIMIT}`,
    premium: `${SUBSCRIPTION.PREMIUM_IMAGE_LIMIT}`,
  },
  {
    label: 'フォルダ作成',
    unit: '',
    free: `${SUBSCRIPTION.FREE_FOLDER_LIMIT}`,
    premium: `${SUBSCRIPTION.PREMIUM_FOLDER_LIMIT}`,
  },
  {
    label: 'ブックマーク',
    unit: '※1フォルダあたり',
    free: `${SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED}`,
    premium: `${SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED}`,
  },
  {
    label: 'ブックマーク\n(分類別)',
    unit: '※1フォルダあたり',
    free: `${SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER}`,
    premium: `${SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER}`,
  },
  {
    label: 'コレクション作成',
    unit: '',
    free: `${SUBSCRIPTION.FREE_COLLECTION_LIMIT}`,
    premium: `${SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT}`,
  },
];

function ComparisonTable() {
  return (
    <View
      className="mx-6 rounded-2xl overflow-hidden"
      style={{ borderWidth: 1, borderColor: DARK.border }}
    >
      {/* テーブルヘッダー */}
      <View className="flex-row" style={{ backgroundColor: DARK.surface }}>
        <View className="flex-1 py-3 px-3 items-center">
          <Text
            className="text-sm font-semibold"
            style={{ color: DARK.textSecondary }}
          >
            機能
          </Text>
        </View>
        <View
          className="flex-1 py-3 px-2 items-center"
          style={{ borderLeftWidth: 1, borderColor: DARK.border }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: DARK.textSecondary }}
          >
            無料
          </Text>
        </View>
        <View
          className="flex-1 py-3 px-2 items-center"
          style={{ borderLeftWidth: 1, borderColor: DARK.border }}
        >
          <Text className="text-sm font-bold" style={{ color: DARK.accent }}>
            プレミアム
          </Text>
        </View>
      </View>

      {/* テーブル行 */}
      {COMPARISON_ROWS.map((row, index) => (
        <View
          key={index}
          className="flex-row"
          style={{
            borderTopWidth: 1,
            borderColor: DARK.border,
          }}
        >
          {/* 項目名 */}
          <View className="flex-1 py-3 px-3 items-center justify-center">
            <Text className="text-sm text-center" style={{ color: DARK.text }}>
              {row.label}
            </Text>
            {row.unit ? (
              <Text
                className="text-xs text-center mt-0.5"
                style={{ color: DARK.textSecondary }}
              >
                {row.unit}
              </Text>
            ) : null}
          </View>

          {/* 無料 */}
          <View
            className="flex-1 py-3 px-2 items-center justify-center"
            style={{ borderLeftWidth: 1, borderColor: DARK.border }}
          >
            <Text
              className="text-base font-medium"
              style={{ color: DARK.textSecondary }}
            >
              {row.free}
            </Text>
          </View>

          {/* プレミアム */}
          <View
            className="flex-1 py-3 px-2 items-center justify-center"
            style={{ borderLeftWidth: 1, borderColor: DARK.border }}
          >
            <Text
              className="text-base font-bold"
              style={{ color: DARK.accent }}
            >
              {row.premium}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/** ダーク背景ヘッダーバー（バツボタンのみ、useSafeAreaInsetsで確実にインセット適用） */
function ModalHeader({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: DARK.bg, paddingTop: insets.top }}>
      <View className="flex-row items-center justify-end px-4 py-3">
        <Pressable
          onPress={onPress}
          className="w-8 h-8 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          hitSlop={8}
        >
          <Ionicons name="close" size={iconSizeNum.md} color={DARK.white} />
        </Pressable>
      </View>
    </View>
  );
}

type PlanType = 'monthly' | 'annual';

export function PaywallPage({ onPurchaseSuccess }: PaywallPageProps) {
  const isPremium = useIsPremium();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const { goBack } = useSafeBack();
  const {
    offering,
    isLoading,
    isPurchasing,
    isRestoring,
    error,
    purchase,
    restore,
  } = usePurchase();

  // パッケージを取得
  const monthlyPackage = offering?.monthly;
  const annualPackage = offering?.annual;

  // 選択中のパッケージ
  const selectedPackage: PurchasesPackage | null =
    selectedPlan === 'annual'
      ? (annualPackage ?? null)
      : (monthlyPackage ?? null);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('エラー', 'プランの取得に失敗しました');
      return;
    }

    const success = await purchase(selectedPackage);
    if (success) {
      Alert.alert(
        'ありがとうございます！',
        '街コレプレミアムへの登録が完了しました。',
        [{ text: 'OK', onPress: onPurchaseSuccess }]
      );
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      Alert.alert('復元完了', '購入の復元が完了しました。', [
        { text: 'OK', onPress: onPurchaseSuccess },
      ]);
    }
  };

  // サブスクリプション管理画面を開く
  const handleManageSubscription = async () => {
    const url =
      Platform.OS === 'ios'
        ? 'itms-apps://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      // シミュレーター等でURLを開けない場合は無視
    }
  };

  // すでにプレミアムの場合
  if (isPremium) {
    return (
      <View className="flex-1" style={{ backgroundColor: DARK.bg }}>
        <StatusBar barStyle="light-content" />
        <ModalHeader onPress={goBack} />
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(52,211,153,0.15)' }}
          >
            <Ionicons
              name="checkmark-circle"
              size={iconSizeNum['4xl']}
              color={DARK.success}
            />
          </View>
          <Text
            className="text-xl font-bold mb-2 text-center"
            style={{ color: DARK.text }}
          >
            プレミアム会員です
          </Text>
          <Text className="text-center" style={{ color: DARK.textSecondary }}>
            すべてのプレミアム機能を{'\n'}ご利用いただけます
          </Text>

          <Pressable
            onPress={handleManageSubscription}
            className="mt-6 px-6 py-3 rounded-xl active:opacity-70"
            style={{ borderWidth: 1, borderColor: DARK.border }}
          >
            <Text className="text-sm" style={{ color: DARK.textSecondary }}>
              サブスクリプションを管理
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: DARK.bg }}>
        <StatusBar barStyle="light-content" />
        <ModalHeader onPress={goBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={DARK.accent} />
          <Text className="mt-4" style={{ color: DARK.textSecondary }}>
            読み込み中...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: DARK.bg }}>
      <StatusBar barStyle="light-content" />
      <ModalHeader onPress={goBack} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {/* バナー画像 */}
        <View className="relative">
          <Image
            source={paywallBanner}
            className="w-full"
            style={{ height: 200 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
          {/* グラデーションオーバーレイ */}
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)' }}
          >
            <Text className="text-2xl font-bold" style={{ color: DARK.white }}>
              街コレプレミアム
            </Text>
            <Text
              className="text-center mt-2"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              より多くのスポットを登録して、{'\n'}
              あなただけのマップを作りましょう
            </Text>
          </View>
        </View>

        {/* プラン選択 */}
        <View className="mx-6 mt-6 mb-4 gap-3">
          {/* 年額プラン */}
          {annualPackage && (
            <Pressable
              onPress={() => setSelectedPlan('annual')}
              className="rounded-2xl"
              style={{
                height: 80,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor:
                  selectedPlan === 'annual' ? DARK.accent : DARK.border,
                backgroundColor:
                  selectedPlan === 'annual' ? DARK.accentBg : DARK.surfaceLight,
              }}
            >
              <View className="flex-1 flex-row items-center justify-between px-4">
                <View className="flex-row items-center">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-3"
                    style={{
                      borderWidth: 2,
                      borderColor:
                        selectedPlan === 'annual'
                          ? DARK.accent
                          : DARK.textSecondary,
                      backgroundColor:
                        selectedPlan === 'annual' ? DARK.accent : 'transparent',
                    }}
                  >
                    {selectedPlan === 'annual' && (
                      <Ionicons
                        name="checkmark"
                        size={iconSizeNum.sm}
                        color={DARK.bg}
                      />
                    )}
                  </View>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: DARK.text }}
                  >
                    年額プレミアム
                  </Text>
                </View>
                <View className="items-center">
                  <Text
                    className="text-xl font-bold"
                    style={{ color: DARK.text }}
                  >
                    {annualPackage.product.pricePerMonthString}/月
                  </Text>
                  <Text
                    className="text-xs"
                    style={{
                      position: 'absolute',
                      top: 28,
                      color: DARK.textSecondary,
                    }}
                  >
                    {annualPackage.product.priceString}/年
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* 月額プラン */}
          {monthlyPackage && (
            <Pressable
              onPress={() => setSelectedPlan('monthly')}
              className="rounded-2xl"
              style={{
                height: 80,
                borderWidth: 2,
                borderColor:
                  selectedPlan === 'monthly' ? DARK.accent : DARK.border,
                backgroundColor:
                  selectedPlan === 'monthly'
                    ? DARK.accentBg
                    : DARK.surfaceLight,
              }}
            >
              <View className="flex-1 flex-row items-center justify-between px-4">
                <View className="flex-row items-center">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-3"
                    style={{
                      borderWidth: 2,
                      borderColor:
                        selectedPlan === 'monthly'
                          ? DARK.accent
                          : DARK.textSecondary,
                      backgroundColor:
                        selectedPlan === 'monthly'
                          ? DARK.accent
                          : 'transparent',
                    }}
                  >
                    {selectedPlan === 'monthly' && (
                      <Ionicons
                        name="checkmark"
                        size={iconSizeNum.sm}
                        color={DARK.bg}
                      />
                    )}
                  </View>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: DARK.text }}
                  >
                    月額プレミアム
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold"
                  style={{ color: DARK.text }}
                >
                  {monthlyPackage.product.priceString}/月
                </Text>
              </View>
            </Pressable>
          )}

          {/* 無料トライアル表示 */}
          {selectedPackage?.product.introPrice && (
            <Text
              className="text-center text-sm"
              style={{ color: DARK.success }}
            >
              {selectedPackage.product.introPrice.periodNumberOfUnits}
              {selectedPackage.product.introPrice.periodUnit === 'DAY'
                ? '日間'
                : 'ヶ月'}
              無料トライアル
            </Text>
          )}
        </View>

        {/* プラン比較テーブル */}
        <View className="mb-4">
          <Text
            className="text-sm font-semibold mx-6 mb-3"
            style={{ color: DARK.textSecondary }}
          >
            プラン比較
          </Text>
          <ComparisonTable />
        </View>

        {/* 利用規約・プライバシーポリシー */}
        <View className="flex-row justify-center gap-4 mx-6 mb-4">
          <Pressable onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.TERMS)}>
            <Text className="text-xs underline" style={{ color: DARK.textSecondary }}>
              利用規約
            </Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.PRIVACY)}>
            <Text className="text-xs underline" style={{ color: DARK.textSecondary }}>
              プライバシーポリシー
            </Text>
          </Pressable>
        </View>

        {/* エラー表示 */}
        {error && (
          <View
            className="mx-6 mt-4 p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(248,113,113,0.15)' }}
          >
            <Text className="text-center" style={{ color: DARK.error }}>
              {error}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 固定フッター */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
        style={{
          backgroundColor: DARK.bg,
          borderTopWidth: 1,
          borderColor: DARK.border,
        }}
      >
        {/* 購入ボタン */}
        <Pressable
          onPress={handlePurchase}
          disabled={isPurchasing || isRestoring || !selectedPackage}
          className="w-full py-4 rounded-xl items-center justify-center"
          style={{
            backgroundColor:
              isPurchasing || isRestoring || !selectedPackage
                ? DARK.surface
                : DARK.accent,
          }}
        >
          {isPurchasing ? (
            <ActivityIndicator color={DARK.white} />
          ) : (
            <Text
              className="text-base font-semibold"
              style={{ color: DARK.white }}
            >
              プレミアムに登録する
            </Text>
          )}
        </Pressable>

        {/* 復元ボタン */}
        <Pressable
          onPress={handleRestore}
          disabled={isPurchasing || isRestoring}
          className="w-full py-3 items-center justify-center mt-2"
        >
          {isRestoring ? (
            <ActivityIndicator color={DARK.accent} size="small" />
          ) : (
            <Text className="text-sm" style={{ color: DARK.accent }}>
              購入を復元する
            </Text>
          )}
        </Pressable>

        {/* 注意事項 */}
        <Text
          className="text-xs text-center mt-2"
          style={{ color: DARK.textSecondary }}
        >
          サブスクリプションはいつでもキャンセルできます
        </Text>
      </View>
    </View>
  );
}
