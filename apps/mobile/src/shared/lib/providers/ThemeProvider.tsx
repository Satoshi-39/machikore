/**
 * テーマプロバイダー
 *
 * CSS変数方式でライト/ダークテーマを切り替え
 * NativeWindのvars()を使用してテーマを適用
 */

import React, { useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import { useThemePreference } from '@/entities/user/api';
import { themes, type ThemeMode } from '@machikore/design-tokens/mobile/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: themeMode } = useThemePreference();
  const systemColorScheme = useColorScheme();

  // テーマモードを解決
  const resolvedTheme: ThemeMode = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  // CSS変数をルートに適用
  return (
    <View style={[{ flex: 1 }, themes[resolvedTheme]]}>
      {children}
    </View>
  );
}

/**
 * 現在のテーマがダークかどうかを返すhook
 */
export function useIsDarkMode(): boolean {
  const { theme: themeMode } = useThemePreference();
  const systemColorScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemColorScheme === 'dark';
  }
  return themeMode === 'dark';
}

/**
 * React Navigation用のテーマを返すhook
 */
export function useNavigationTheme() {
  const isDark = useIsDarkMode();

  return isDark ? 'dark' : 'light';
}
