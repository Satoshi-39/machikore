/**
 * 認証要求ページ（モーダル）
 *
 * 認証が必要な機能にアクセスした際に表示される
 * シンプルに「アカウント作成」「ログイン」の選択肢を提示
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthRequiredPageProps {
  onSignUpPress?: () => void;
  onSignInPress?: () => void;
  onClose?: () => void;
  message?: string;
}

export function AuthRequiredPage({
  onSignUpPress,
  onSignInPress,
  onClose,
  message = 'この機能を利用するにはログインが必要です',
}: AuthRequiredPageProps) {
  const slideAnim = useRef(new Animated.Value(300)).current; // 初期位置: 画面外
  const overlayAnim = useRef(new Animated.Value(0)).current; // 背景の透明度

  useEffect(() => {
    // マウント時にアニメーション
    Animated.parallel([
      // シートをスライドアップ
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      // 背景をフェードイン
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // 閉じるアニメーション（シートと背景を同時に）
    Animated.parallel([
      // シートをスライドダウン
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      // 背景をフェードアウト
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // アニメーション完了後にモーダルを閉じる
      onClose?.();
    });
  };

  return (
    <View className="flex-1 justify-end">
      {/* 背景オーバーレイ（アニメーション） */}
      <Animated.View
        className="absolute inset-0 bg-black/50"
        style={{ opacity: overlayAnim }}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* モーダルコンテンツ（アニメーション） */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <SafeAreaView className="bg-surface rounded-t-3xl shadow-2xl px-6 py-8" edges={['bottom']}>
      {/* タイトル */}
      <View className="flex-row items-center justify-center mb-2">
        <Ionicons name="map" size={28} color="#007AFF" style={{ marginRight: 8 }} />
        <Text className="text-2xl font-bold text-on-surface">
          街コレへようこそ！
        </Text>
      </View>

      {/* メッセージ */}
      <Text className="text-base text-on-surface-variant mb-8 text-center">
        {message}
      </Text>

      {/* アカウント作成ボタン */}
      <View className="items-center">
        <TouchableOpacity
          onPress={onSignUpPress}
          className="bg-blue-600 py-4 px-8 rounded-lg w-full max-w-sm mb-3"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold text-base">
            アカウントを作成
          </Text>
        </TouchableOpacity>

        {/* ログインボタン */}
        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-surface border border-outline py-4 px-8 rounded-lg w-full max-w-sm"
          activeOpacity={0.8}
        >
          <Text className="text-on-surface-variant text-center font-semibold text-base">
            ログイン
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
      </Animated.View>
    </View>
  );
}
