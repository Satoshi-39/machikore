/**
 * OTP認証コード入力画面
 *
 * Expo Router: /auth/verify?email=xxx
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { VerifyCodePage } from '@/pages/verify-code';

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleSuccess = () => {
    // 認証成功後、認証画面スタックを全て閉じる
    router.dismissAll();
  };

  const handleBack = () => {
    router.back();
  };

  if (!email) {
    // emailがない場合はサインイン画面に戻る
    router.replace('/auth/sign-in');
    return null;
  }

  return (
    <VerifyCodePage
      email={email}
      onSuccess={handleSuccess}
      onBack={handleBack}
    />
  );
}
