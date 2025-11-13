/**
 * マイページタブ
 *
 * 認証状態に応じて適切なページを表示
 * - 匿名ユーザー: AuthInvitationPage（サインイン/サインアップ誘導）
 * - 認証済みユーザー: MyPage（プロフィール、統計など）
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { MyPage, AuthInvitationPage } from '@/pages/mypage';
import { useUserStore } from '@/entities/user';

export default function MyPageTab() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  // 匿名ユーザー判定（emailがない = 匿名）
  const isAnonymous = !user?.email;

  const handleSignInPress = () => {
    router.push('/auth/sign-in');
  };

  const handleSignUpPress = () => {
    router.push('/auth/sign-up');
  };

  // 匿名ユーザーには認証誘導ページを表示
  if (isAnonymous) {
    return (
      <AuthInvitationPage
        onSignInPress={handleSignInPress}
        onSignUpPress={handleSignUpPress}
      />
    );
  }

  // 認証済みユーザーにはマイページを表示
  return <MyPage />;
}
