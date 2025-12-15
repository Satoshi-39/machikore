/**
 * アプリエントリーポイント
 *
 * 認証状態に応じてルーティング：
 * - 認証中（loading）: ローディング表示
 * - 認証済み: メイン画面
 * - 未認証: メイン画面（匿名ユーザーとして）
 */

import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/entities/user';

export default function Index() {
  const authState = useUserStore((state) => state.authState);

  // 認証状態の初期化中
  if (authState === 'loading') {
    return (
      <View className="flex-1 justify-center items-center bg-surface dark:bg-dark-surface">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 認証完了後、メイン画面にリダイレクト
  // 匿名ユーザーも認証済み扱いで使用可能
  return <Redirect href="/(tabs)/home" />;
}
