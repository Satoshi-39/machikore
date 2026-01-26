/**
 * アプリ共通のToastコンポーネント
 *
 * ダークモード対応のカスタムToast設定
 */

import React from 'react';
import Toast, { BaseToast, type BaseToastProps } from 'react-native-toast-message';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors, fontSizeNum } from '@/shared/config';

// Toast設定を生成
const createToastConfig = (isDarkMode: boolean) => ({
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.light.primary,
        backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: fontSizeNum.sm,
        fontWeight: '600',
        color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
      }}
      text2Style={{
        fontSize: fontSizeNum.xs,
        color: isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant'],
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.light.error,
        backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: fontSizeNum.sm,
        fontWeight: '600',
        color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
      }}
      text2Style={{
        fontSize: fontSizeNum.xs,
        color: isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant'],
      }}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.light.info,
        backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.surface,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: fontSizeNum.sm,
        fontWeight: '600',
        color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
      }}
      text2Style={{
        fontSize: fontSizeNum.xs,
        color: isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant'],
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
