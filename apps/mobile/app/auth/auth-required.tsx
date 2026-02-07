/**
 * 認証要求モーダル
 *
 * Expo Router: /auth/auth-required
 * 認証が必要な機能にアクセスした際に表示される
 * モーダル設定は _layout.tsx で行われる
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthRequiredPage } from '@/pages/auth-required';

export default function AuthRequiredScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams<{ message?: string }>();

  const handleSignUpPress = () => {
    // auth-requiredをサインアップページに置き換え（スタックにモーダルを残さない）
    router.replace('/auth/sign-up');
  };

  const handleSignInPress = () => {
    // auth-requiredをサインインページに置き換え（スタックにモーダルを残さない）
    router.replace('/auth/sign-in');
  };

  const handleClose = () => {
    // モーダルを閉じる
    router.dismiss();
  };

  return (
    <AuthRequiredPage
      onSignUpPress={handleSignUpPress}
      onSignInPress={handleSignInPress}
      onClose={handleClose}
      message={message}
    />
  );
}
