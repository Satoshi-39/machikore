/**
 * 共通ボトムシートWidget
 *
 * 下からスライドアップするモーダルの共通実装
 */

import React, { useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';

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

  useEffect(() => {
    // マウント時にスライドアップアニメーション
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  const handleClose = () => {
    // 閉じるアニメーション（下にスライド）
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // アニメーション完了後にモーダルを閉じる
      onClose?.();
    });
  };

  const contextValue: BottomSheetContextValue = {
    close: handleClose,
  };

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <View className="flex-1 justify-end bg-black/50">
        {/* 背景タップで閉じる */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={handleClose}
        />

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
  );
}
