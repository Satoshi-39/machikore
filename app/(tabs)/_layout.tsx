import { useUserStore } from '@/entities/user';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isAnonymous = !user?.email;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 2 }}>
              <Ionicons name="map-outline" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 2 }}>
              <Ionicons name="search-outline" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={{ marginTop: 2 }}>
              <View className="w-9 h-9 rounded-full bg-blue-500 items-center justify-center">
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </View>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // タブ遷移を常にキャンセル
            e.preventDefault();

            if (isAnonymous) {
              // 未ログインの場合は認証モーダルを開く
              router.push('/auth/auth-required');
            } else {
              // ログイン済みの場合は作成モーダルを開く
              router.push('/create-menu');
            }
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 2 }}>
              <Ionicons name="notifications-outline" size={26} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // 未ログインの場合はタブ遷移をキャンセルしてモーダルを開く
            if (isAnonymous) {
              e.preventDefault();
              router.push('/auth/auth-required');
            }
          },
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 2 }}>
              <Ionicons name="person-outline" size={26} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
