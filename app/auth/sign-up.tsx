/**
 * サインアップ画面
 *
 * Expo Router: /auth/sign-up
 */

import { useRouter } from 'expo-router';
import { SignUpPage } from '@/pages/sign-up';

export default function SignUpScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // サインアップ成功後、認証画面を閉じて元の画面に戻る
    router.back();
  };

  const handleNavigateToSignIn = () => {
    router.push('/auth/sign-in');
  };

  return (
    <SignUpPage
      onSuccess={handleSuccess}
      onNavigateToSignIn={handleNavigateToSignIn}
    />
  );
}
