/**
 * サインイン画面
 *
 * Expo Router: /auth/sign-in
 */

import { useRouter } from 'expo-router';
import { SignInPage } from '@/pages/sign-in';

export default function SignInScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // サインイン成功後、認証画面を閉じて元の画面に戻る
    router.back();
  };

  const handleNavigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <SignInPage
      onSuccess={handleSuccess}
      onNavigateToSignUp={handleNavigateToSignUp}
    />
  );
}
