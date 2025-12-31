/**
 * アプリ共通のToastコンポーネント
 *
 * ダークモード対応のカスタムToast設定
 */

import React from 'react';
import Toast, { BaseToast, type BaseToastProps } from 'react-native-toast-message';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors } from '@/shared/config';

// Toast設定を生成
const createToastConfig = (isDarkMode: boolean) => ({
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary.DEFAULT,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.danger,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.info,
        backgroundColor: isDarkMode ? colors.dark.muted : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? colors.dark.foreground : colors.light.foreground,
      }}
      text2Style={{
        fontSize: 12,
        color: isDarkMode ? colors.dark.foregroundSecondary : colors.light.foregroundSecondary,
      }}
    />
  ),
});

/**
 * ダークモード対応のToastコンポーネント
 * AppProvidersの内側（ThemeProviderの内側）で使用する
 */
export function AppToast() {
  const isDarkMode = useIsDarkMode();
  return <Toast config={createToastConfig(isDarkMode)} />;
}
