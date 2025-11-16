/**
 * サインイン画面
 *
 * Expo Router: /auth/sign-in
 */

import { Stack, useRouter } from 'expo-router';
import { SignInPage } from '@/pages/sign-in';

export default function SignInScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // サインイン成功後、メイン画面に遷移
    router.replace('/(tabs)/map');
  };

  const handleNavigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'ログイン',
          headerBackTitle: '戻る',
        }}
      />
      <SignInPage
        onSuccess={handleSuccess}
        onNavigateToSignUp={handleNavigateToSignUp}
      />
    </>
  );
}
