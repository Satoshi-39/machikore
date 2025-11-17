/**
 * ユーザープロフィール画面
 *
 * URL: /user/:id
 * 他のユーザーのプロフィールを表示
 */

import { Stack } from 'expo-router';
import { UserProfilePage } from '@/pages/user-profile';

export default function UserProfileScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <UserProfilePage />
    </>
  );
}
