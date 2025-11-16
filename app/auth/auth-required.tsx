/**
 * 認証要求モーダル
 *
 * Expo Router: /auth/auth-required
 * 認証が必要な機能にアクセスした際に表示される
 * モーダル設定は _layout.tsx で行われる
 */

import { useRouter } from 'expo-router';
import { AuthRequiredPage } from '@/pages/auth';

export default function AuthRequiredScreen() {
  const router = useRouter();

  const handleSignUpPress = () => {
    // モーダルを閉じてからサインアップページへ
    router.dismiss();
    router.push('/auth/sign-up');
  };

  const handleSignInPress = () => {
    // モーダルを閉じてからサインインページへ
    router.dismiss();
    router.push('/auth/sign-in');
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
    />
  );
}
