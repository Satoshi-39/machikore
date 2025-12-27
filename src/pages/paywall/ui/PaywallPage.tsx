/**
 * Paywallページ
 *
 * プレミアムプランの購入画面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/shared/ui';
import { usePurchase } from '@/features/purchase-subscription';
import { useIsPremium } from '@/entities/subscription';
import { SUBSCRIPTION } from '@/shared/config';
import type { PurchasesPackage } from 'react-native-purchases';

interface PaywallPageProps {
  onPurchaseSuccess?: () => void;
}

// プレミアム機能リスト
const PREMIUM_FEATURES = [
  {
    icon: 'location' as const,
    title: 'スポット登録上限アップ',
    description: `マップごとに${SUBSCRIPTION.FREE_SPOT_LIMIT}箇所 → ${SUBSCRIPTION.PREMIUM_SPOT_LIMIT}箇所まで登録可能`,
  },
  {
    icon: 'eye-off' as const,
    title: '広告非表示',
    description: '全ての広告が非表示になり、快適に利用できます',
  },
  {
    icon: 'sparkles' as const,
    title: '今後の新機能を優先利用',
    description: '新しいプレミアム機能を優先的にお届けします',
  },
];

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-start py-4 border-b border-border-light dark:border-dark-border-light">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-1">
          {title}
        </Text>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
          {description}
        </Text>
      </View>
    </View>
  );
}

type PlanType = 'monthly' | 'annual';

export function PaywallPage({ onPurchaseSuccess }: PaywallPageProps) {
  const isPremium = useIsPremium();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
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
    selectedPlan === 'annual' ? annualPackage ?? null : monthlyPackage ?? null;

  // 年額の月あたり価格を計算
  const annualMonthlyPrice = annualPackage?.product.price
    ? Math.round(annualPackage.product.price / 12)
    : null;

  // 年額で何ヶ月分お得かを計算
  const savingsMonths = monthlyPackage?.product.price && annualPackage?.product.price
    ? Math.round(12 - (annualPackage.product.price / monthlyPackage.product.price))
    : null;

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('エラー', 'プランの取得に失敗しました');
      return;
    }

    const success = await purchase(selectedPackage);
    if (success) {
      Alert.alert(
        'ありがとうございます！',
        'プレミアムプランへの登録が完了しました。',
        [{ text: 'OK', onPress: onPurchaseSuccess }]
      );
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      Alert.alert(
        '復元完了',
        '購入の復元が完了しました。',
        [{ text: 'OK', onPress: onPurchaseSuccess }]
      );
    }
  };

  // サブスクリプション管理画面を開く
  const handleManageSubscription = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
    } else {
      // Android: Google Play のサブスクリプション管理画面
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  // すでにプレミアムの場合
  if (isPremium) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="プレミアム" />
        <View className="flex-1 items-center justify-center px-6" style={{ marginTop: -60 }}>
          <View className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={48} color="#22C55E" />
          </View>
          <Text className="text-xl font-bold text-foreground dark:text-dark-foreground mb-2 text-center">
            プレミアム会員です
          </Text>
          <Text className="text-center text-foreground-secondary dark:text-dark-foreground-secondary">
            すべてのプレミアム機能を{'\n'}ご利用いただけます
          </Text>

          {/* サブスクリプション管理ボタン */}
          <Pressable
            onPress={handleManageSubscription}
            className="mt-6 px-6 py-3 rounded-xl border border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
          >
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-sm">
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
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title="プレミアム" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-foreground-secondary dark:text-dark-foreground-secondary">
            読み込み中...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title="プレミアム" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ヘッダー */}
        <View className="items-center px-6 pt-6 pb-4">
          <View className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 items-center justify-center mb-4 bg-primary">
            <Ionicons name="diamond" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
            プレミアムプラン
          </Text>
          <Text className="text-center text-foreground-secondary dark:text-dark-foreground-secondary">
            より多くのスポットを登録して、{'\n'}あなただけの街コレマップを作りましょう
          </Text>
        </View>

        {/* プラン選択 */}
        <View className="mx-6 my-4 gap-3">
          {/* 年額プラン */}
          {annualPackage && (
            <Pressable
              onPress={() => setSelectedPlan('annual')}
              className={`p-4 rounded-2xl border-2 ${
                selectedPlan === 'annual'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border-light dark:border-dark-border-light bg-surface dark:bg-dark-surface'
              }`}
            >
              {savingsMonths && savingsMonths > 0 && (
                <View className="absolute -top-3 right-4 bg-green-500 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    {savingsMonths}ヶ月分お得
                  </Text>
                </View>
              )}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                    selectedPlan === 'annual' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedPlan === 'annual' && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                      年額プラン
                    </Text>
                    {annualMonthlyPrice && (
                      <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                        月あたり ¥{annualMonthlyPrice}
                      </Text>
                    )}
                  </View>
                </View>
                <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                  ¥{annualPackage.product.price}/年
                </Text>
              </View>
            </Pressable>
          )}

          {/* 月額プラン */}
          {monthlyPackage && (
            <Pressable
              onPress={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border-2 ${
                selectedPlan === 'monthly'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border-light dark:border-dark-border-light bg-surface dark:bg-dark-surface'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                    selectedPlan === 'monthly' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedPlan === 'monthly' && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                    月額プラン
                  </Text>
                </View>
                <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                  ¥{monthlyPackage.product.price}/月
                </Text>
              </View>
            </Pressable>
          )}

          {/* 無料トライアル表示 */}
          {selectedPackage?.product.introPrice && (
            <Text className="text-center text-sm text-green-600 dark:text-green-400">
              {selectedPackage.product.introPrice.periodNumberOfUnits}
              {selectedPackage.product.introPrice.periodUnit === 'DAY' ? '日間' : 'ヶ月'}
              無料トライアル
            </Text>
          )}
        </View>

        {/* 機能リスト */}
        <View className="px-6">
          <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary uppercase mb-2">
            プレミアム機能
          </Text>
          {PREMIUM_FEATURES.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </View>

        {/* エラー表示 */}
        {error && (
          <View className="mx-6 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <Text className="text-center text-red-600 dark:text-red-400">
              {error}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 固定フッター */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface border-t border-border-light dark:border-dark-border-light px-6 pb-8 pt-4">
        {/* 購入ボタン */}
        <Pressable
          onPress={handlePurchase}
          disabled={isPurchasing || isRestoring || !selectedPackage}
          className={`w-full py-4 rounded-xl items-center justify-center ${
            isPurchasing || isRestoring || !selectedPackage
              ? 'bg-gray-300 dark:bg-gray-700'
              : 'bg-primary active:bg-primary/90'
          }`}
        >
          {isPurchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
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
            <ActivityIndicator color="#3B82F6" size="small" />
          ) : (
            <Text className="text-primary text-sm">
              購入を復元する
            </Text>
          )}
        </Pressable>

        {/* 注意事項 */}
        <Text className="text-xs text-center text-foreground-muted dark:text-dark-foreground-muted mt-2">
          サブスクリプションはいつでもキャンセルできます
        </Text>
      </View>
    </View>
  );
}
