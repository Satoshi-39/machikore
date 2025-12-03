import { useUserStore } from '@/entities/user';
import { useTotalUnreadCount } from '@/entities/notification';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isAnonymous = !user?.email;
  const unreadCount = useTotalUnreadCount(user?.id);
  const isDarkMode = useIsDarkMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', // dark: surface (#1F2937)
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',  // dark: border (#374151)
        },
      }}
    >
      {/* index ルートをタブバーから非表示 */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
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
        name="discover"
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
              {unreadCount > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: '#007AFF',
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              ) : null}
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
