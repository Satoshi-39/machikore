/**
 * Paywallページ
 *
 * 街コレプレミアムの購入画面（ダークモード固定）
 */

import { useIsPremium, useSubscriptionStore } from '@/entities/subscription';
import { usePurchase } from '@/features/purchase-subscription';
import { colors, EXTERNAL_LINKS, iconSizeNum, PREMIUM_ENABLED, SUBSCRIPTION } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import * as WebBrowser from 'expo-web-browser';
import { useSafeBack } from '@/shared/lib/navigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
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
function getComparisonRows(t: (key: string) => string) {
  return [
    {
      label: t('paywall.adDisplay'),
      unit: '',
      free: t('paywall.valueYes'),
      premium: t('paywall.valueNo'),
    },
    {
      label: t('paywall.spotCreation'),
      unit: t('paywall.perMap'),
      free: `${SUBSCRIPTION.FREE_SPOT_LIMIT}`,
      premium: `${SUBSCRIPTION.PREMIUM_SPOT_LIMIT}`,
    },
    {
      label: t('paywall.imageInsertion'),
      unit: t('paywall.perSpot'),
      free: `${SUBSCRIPTION.FREE_IMAGE_LIMIT}`,
      premium: `${SUBSCRIPTION.PREMIUM_IMAGE_LIMIT}`,
    },
    {
      label: t('paywall.folderCreation'),
      unit: '',
      free: `${SUBSCRIPTION.FREE_FOLDER_LIMIT}`,
      premium: `${SUBSCRIPTION.PREMIUM_FOLDER_LIMIT}`,
    },
    {
      label: t('paywall.bookmarks'),
      unit: t('paywall.perFolder'),
      free: `${SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED}`,
      premium: `${SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED}`,
    },
    {
      label: t('paywall.bookmarksByCategory'),
      unit: t('paywall.perFolder'),
      free: `${SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER}`,
      premium: `${SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER}`,
    },
    {
      label: t('paywall.collectionCreation'),
      unit: '',
      free: `${SUBSCRIPTION.FREE_COLLECTION_LIMIT}`,
      premium: `${SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT}`,
    },
  ];
}

function ComparisonTable() {
  const { t } = useI18n();
  const comparisonRows = getComparisonRows(t);

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
            {t('paywall.tableFeature')}
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
            {t('paywall.tableFree')}
          </Text>
        </View>
        <View
          className="flex-1 py-3 px-2 items-center"
          style={{ borderLeftWidth: 1, borderColor: DARK.border }}
        >
          <Text className="text-sm font-bold" style={{ color: DARK.accent }}>
            {t('paywall.tablePremium')}
          </Text>
        </View>
      </View>

      {/* テーブル行 */}
      {comparisonRows.map((row, index) => (
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

// プレミアム特典一覧
function getPremiumBenefits(t: (key: string, params?: Record<string, string | number>) => string) {
  return [
    t('paywall.benefitNoAds'),
    t('paywall.benefitSpots', { limit: SUBSCRIPTION.PREMIUM_SPOT_LIMIT }),
    t('paywall.benefitImages', { limit: SUBSCRIPTION.PREMIUM_IMAGE_LIMIT }),
    t('paywall.benefitFolders', { limit: SUBSCRIPTION.PREMIUM_FOLDER_LIMIT }),
    t('paywall.benefitBookmarks', { limit: SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED }),
    t('paywall.benefitBookmarksPerFolder', { limit: SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER }),
    t('paywall.benefitCollections', { limit: SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT }),
  ];
}

/** 日付を「YYYY年M月D日」にフォーマット */
function formatDateJP(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  } catch {
    return null;
  }
}

type PlanType = 'monthly' | 'annual';

export function PaywallPage({ onPurchaseSuccess }: PaywallPageProps) {
  const isPremium = useIsPremium();
  const customerInfo = useSubscriptionStore((s) => s.customerInfo);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const { goBack } = useSafeBack();
  const isPurchasingRef = useRef(false);
  const { t } = useI18n();
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
      Alert.alert(t('common.error'), t('paywall.planFetchError'));
      return;
    }

    isPurchasingRef.current = true;
    const success = await purchase(selectedPackage);
    if (success) {
      Alert.alert(
        '',
        t('paywall.purchaseCompleteMessage'),
        [{ text: t('common.ok'), onPress: () => { isPurchasingRef.current = false; onPurchaseSuccess?.(); } }]
      );
    } else {
      isPurchasingRef.current = false;
    }
  };

  const handleRestore = async () => {
    isPurchasingRef.current = true;
    const success = await restore();
    if (success) {
      Alert.alert(t('paywall.restoreComplete'), t('paywall.restoreCompleteMessage'), [
        { text: t('common.ok'), onPress: () => { isPurchasingRef.current = false; onPurchaseSuccess?.(); } },
      ]);
    } else {
      isPurchasingRef.current = false;
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

  // すでにプレミアムの場合（購入/復元処理中はAlert表示を優先）
  if (isPremium && !isPurchasingRef.current) {
    // EntitlementからサブスクリプションSI情報を取得
    const entitlement = customerInfo?.entitlements.active[SUBSCRIPTION.ENTITLEMENT_ID];
    const expirationDate = formatDateJP(entitlement?.expirationDate);
    const willRenew = entitlement?.willRenew ?? false;
    const isTrial = entitlement?.periodType === 'TRIAL';

    return (
      <View className="flex-1" style={{ backgroundColor: DARK.bg }}>
        <StatusBar barStyle="light-content" />
        <ModalHeader onPress={goBack} />
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* ヘッダー */}
          <View className="items-center pt-8 pb-6 px-6">
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
              {t('paywall.premiumMember')}
            </Text>
            {isTrial && (
              <View
                className="px-3 py-1 rounded-full mb-2"
                style={{ backgroundColor: DARK.accentBg }}
              >
                <Text className="text-xs font-semibold" style={{ color: DARK.accent }}>
                  {t('paywall.freeTrial')}
                </Text>
              </View>
            )}
          </View>

          {/* プレミアム特典セクション */}
          <View className="mx-6 mb-6">
            <Text
              className="text-sm font-semibold mb-3"
              style={{ color: DARK.textSecondary }}
            >
              {t('paywall.premiumBenefits')}
            </Text>
            <View
              className="rounded-2xl px-4 py-3"
              style={{ backgroundColor: DARK.surface }}
            >
              {getPremiumBenefits(t).map((label, index) => (
                <View
                  key={index}
                  className="flex-row items-center py-2.5"
                  style={index > 0 ? { borderTopWidth: 1, borderColor: DARK.border } : undefined}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={iconSizeNum.md}
                    color={DARK.success}
                  />
                  <Text
                    className="text-sm ml-3 flex-1"
                    style={{ color: DARK.text }}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* サブスクリプション情報セクション */}
          {expirationDate && (
            <View className="mx-6 mb-6">
              <Text
                className="text-sm font-semibold mb-3"
                style={{ color: DARK.textSecondary }}
              >
                {t('paywall.subscriptionInfo')}
              </Text>
              <View
                className="rounded-2xl px-4 py-4"
                style={{ backgroundColor: DARK.surface }}
              >
                {willRenew ? (
                  <Text className="text-sm" style={{ color: DARK.text }}>
                    {t('paywall.nextRenewalDate', { date: expirationDate })}
                  </Text>
                ) : (
                  <Text className="text-sm" style={{ color: DARK.error }}>
                    {t('paywall.cancelledExpiry', { date: expirationDate })}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* サブスクリプション管理ボタン */}
          <View className="items-center px-6">
            <Pressable
              onPress={handleManageSubscription}
              className="px-6 py-3 rounded-xl active:opacity-70"
              style={{ borderWidth: 1, borderColor: DARK.border }}
            >
              <Text className="text-sm" style={{ color: DARK.textSecondary }}>
                {t('paywall.manageSubscription')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // プレミアム機能が準備中の場合
  if (!PREMIUM_ENABLED) {
    return (
      <View className="flex-1" style={{ backgroundColor: DARK.bg }}>
        <StatusBar barStyle="light-content" />
        <ModalHeader onPress={goBack} />
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
          {/* バナー画像 */}
          <View className="relative">
            <Image
              source={paywallBanner}
              className="w-full"
              style={{ height: 200 }}
              contentFit="cover"
              cachePolicy="disk"
              transition={200}
            />
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: 'rgba(15,23,42,0.5)' }}
            >
              <Text className="text-2xl font-bold" style={{ color: DARK.white }}>
                {t('paywall.premiumTitle')}
              </Text>
              <Text
                className="text-center mt-2"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {t('paywall.premiumSubtitle')}
              </Text>
            </View>
          </View>

          {/* 準備中バッジ */}
          <View className="mx-6 mt-6 mb-6 items-center">
            <View
              className="px-5 py-3 rounded-xl"
              style={{ backgroundColor: DARK.accentBg }}
            >
              <Text
                className="text-base font-semibold text-center"
                style={{ color: DARK.accent }}
              >
                {t('paywall.comingSoon')}
              </Text>
            </View>
            <Text
              className="text-center mt-3"
              style={{ color: DARK.textSecondary }}
            >
              {t('paywall.comingSoonMessage')}
            </Text>
          </View>

          {/* プラン比較テーブル */}
          <View className="mb-4">
            <Text
              className="text-sm font-semibold mx-6 mb-3"
              style={{ color: DARK.textSecondary }}
            >
              {t('paywall.planComparison')}
            </Text>
            <ComparisonTable />
          </View>
        </ScrollView>
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
            {t('common.loading')}
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
            cachePolicy="disk"
            transition={200}
          />
          {/* グラデーションオーバーレイ */}
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)' }}
          >
            <Text className="text-2xl font-bold" style={{ color: DARK.white }}>
              {t('paywall.premiumTitle')}
            </Text>
            <Text
              className="text-center mt-2"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {t('paywall.premiumSubtitle')}
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
                    {t('paywall.annualPremium')}
                  </Text>
                </View>
                <View className="items-center">
                  <Text
                    className="text-xl font-bold"
                    style={{ color: DARK.text }}
                  >
                    {annualPackage.product.pricePerMonthString}{t('paywall.perMonth')}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{
                      position: 'absolute',
                      top: 28,
                      color: DARK.textSecondary,
                    }}
                  >
                    {annualPackage.product.priceString}{t('paywall.perYear')}
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
                    {t('paywall.monthlyPremium')}
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold"
                  style={{ color: DARK.text }}
                >
                  {monthlyPackage.product.priceString}{t('paywall.perMonth')}
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
              {selectedPackage.product.introPrice.periodUnit === 'DAY'
                ? t('paywall.trialDays', { count: selectedPackage.product.introPrice.periodNumberOfUnits })
                : t('paywall.trialMonths', { count: selectedPackage.product.introPrice.periodNumberOfUnits })}
            </Text>
          )}
        </View>

        {/* プラン比較テーブル */}
        <View className="mb-4">
          <Text
            className="text-sm font-semibold mx-6 mb-3"
            style={{ color: DARK.textSecondary }}
          >
            {t('paywall.planComparison')}
          </Text>
          <ComparisonTable />
        </View>

        {/* 法的注意事項（プラットフォーム別） */}
        <View className="mx-6 mb-4 gap-1.5">
          {[
            Platform.OS === 'ios'
              ? t('paywall.subscriptionPaymentIos')
              : t('paywall.subscriptionPaymentAndroid'),
            Platform.OS === 'ios'
              ? t('paywall.subscriptionAutoRenewIos')
              : t('paywall.subscriptionAutoRenewAndroid'),
            ...(Platform.OS === 'ios'
              ? [t('paywall.subscriptionRenewalChargeIos')]
              : []),
            t('paywall.subscriptionManage'),
            ...(selectedPackage?.product.introPrice
              ? [Platform.OS === 'ios'
                  ? t('paywall.trialTermsIos')
                  : t('paywall.trialTermsAndroid')]
              : []),
            t('paywall.priceChangeNotice'),
            t('paywall.noRefund'),
            t('paywall.taxIncluded'),
            t('paywall.minorNotice'),
          ].map((text, index) => (
            <View key={index} className="flex-row">
              <Text className="text-xs" style={{ color: DARK.textSecondary }}>
                {'・ '}
              </Text>
              <Text
                className="text-xs leading-5 flex-1"
                style={{ color: DARK.textSecondary }}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>

        {/* 利用規約・プライバシーポリシー・特商法 */}
        <View className="flex-row justify-center flex-wrap gap-4 mx-6 mb-4">
          <Pressable onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.TERMS)}>
            <Text className="text-xs underline" style={{ color: DARK.textSecondary }}>
              {t('settings.termsOfService')}
            </Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.PRIVACY)}>
            <Text className="text-xs underline" style={{ color: DARK.textSecondary }}>
              {t('settings.privacyPolicy')}
            </Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(EXTERNAL_LINKS.TOKUSHOHO)}>
            <Text className="text-xs underline" style={{ color: DARK.textSecondary }}>
              {t('paywall.tokushoho')}
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
              {t('paywall.subscribeToPremium')}
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
              {t('paywall.restorePurchase')}
            </Text>
          )}
        </Pressable>

        {/* 注意事項（自動更新の詳細はスクロール領域内に記載済み） */}
        <Text
          className="text-xs text-center mt-2"
          style={{ color: DARK.textSecondary }}
        >
          {t('paywall.cancelAnytime')}
        </Text>
      </View>
    </View>
  );
}
