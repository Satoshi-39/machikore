/**
 * 共通ボトムシートWidget
 *
 * 下からスライドアップするモーダルの共通実装
 * Modalを使用して確実に全画面オーバーレイを表示
 */

import React, { useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import { TouchableOpacity, View, Animated, Modal } from 'react-native';
import { duration as durationTokens } from '@/shared/config';

interface BottomSheetProps {
  children: ReactNode;
  onClose: () => void;
}

interface BottomSheetContextValue {
  close: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheet');
  }
  return context;
}

export function BottomSheet({ children, onClose }: BottomSheetProps) {
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
        duration: durationTokens.base,
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
        duration: durationTokens.medium,
        useNativeDriver: true,
      }),
      // 背景をフェードアウト
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: durationTokens.medium,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // アニメーション完了後にモーダルを閉じる
      onClose?.();
    });
  };

  const contextValue: BottomSheetContextValue = {
    close: handleClose,
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <BottomSheetContext.Provider value={contextValue}>
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
            {children}
          </Animated.View>
        </View>
      </BottomSheetContext.Provider>
    </Modal>
  );
}
