/**
 * テーマプロバイダー
 *
 * NativeWindのダークモードとReact NavigationのThemeを連携
 */

import React, { useEffect } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme } from 'react-native';
import { useThemePreference } from '@/entities/user/api';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: themeMode } = useThemePreference();
  const systemColorScheme = useColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();

  // テーマモードに応じてNativeWindのcolorSchemeを設定
  useEffect(() => {
    let resolvedScheme: 'light' | 'dark';

    if (themeMode === 'system') {
      resolvedScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      resolvedScheme = themeMode;
    }

    setColorScheme(resolvedScheme);
  }, [themeMode, systemColorScheme, setColorScheme]);

  return <>{children}</>;
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
