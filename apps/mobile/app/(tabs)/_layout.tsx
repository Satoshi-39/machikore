import { useUserStore } from '@/entities/user';
import { useTotalUnreadCount } from '@/entities/notification';
import { useMapStore } from '@/entities/map';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useCurrentTab } from '@/shared/lib';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const user = useUserStore((state) => state.user);
  const isAnonymous = !user?.email;
  const unreadCount = useTotalUnreadCount(user?.id, user?.created_at);
  const isDarkMode = useIsDarkMode();
  const setSourceTab = useMapStore((state) => state.setSourceTab);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
          borderTopColor: isDarkMode ? colors.dark.outline : colors.light.outline,
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
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View testID="tab-home" style={{ marginTop: 2 }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View testID="tab-discover" style={{ marginTop: 2 }}>
              <Ionicons name={focused ? 'search' : 'search-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: () => (
            <View testID="tab-create" style={{ marginTop: 2 }}>
              <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.light.primary }}
                >
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
              // スポット作成後に戻るタブを記録
              setSourceTab(currentTab);
              // ログイン済みの場合は作成メニューを開く
              router.push('/create-menu');
            }
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View testID="tab-notifications" style={{ marginTop: 2 }}>
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={26} color={color} />
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
          tabBarIcon: ({ color, focused }) => (
            <View testID="tab-mypage" style={{ marginTop: 2 }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
