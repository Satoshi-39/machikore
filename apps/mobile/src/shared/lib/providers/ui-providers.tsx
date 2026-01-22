/**
 * UIプロバイダー
 *
 * UI制御系のプロバイダーを統合
 * - NavigationThemeProvider: ナビゲーションのテーマ（ダークモード対応）
 * - KeyboardProvider: キーボードアニメーション制御
 * - BottomSheetModalProvider: BottomSheet管理
 *
 * ビジネスロジック系（AppProviders）とは分離して管理
 */

import React from 'react';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useIsDarkMode } from './ThemeProvider';

interface UIProvidersProps {
  children: React.ReactNode;
}

/**
 * UI制御系のプロバイダーを統合
 *
 * 順序:
 * 1. ThemeProvider (@react-navigation) - ナビゲーションテーマ
 * 2. KeyboardProvider - キーボードアニメーション
 * 3. BottomSheetModalProvider - BottomSheet管理
 */
export function UIProviders({ children }: UIProvidersProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          {children}
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}
