/**
 * サインアップ画面
 *
 * Expo Router: /auth/sign-up
 */

import { Stack, useRouter } from 'expo-router';
import { SignUpPage } from '@/pages/auth';

export default function SignUpScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // サインアップ成功後、メイン画面に遷移
    router.replace('/(tabs)/map');
  };

  const handleNavigateToSignIn = () => {
    router.push('/auth/sign-in');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'アカウント作成',
          headerBackTitle: '戻る',
        }}
      />
      <SignUpPage
        onSuccess={handleSuccess}
        onNavigateToSignIn={handleNavigateToSignIn}
      />
    </>
  );
}
