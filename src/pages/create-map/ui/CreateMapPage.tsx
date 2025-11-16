/**
 * マップ作成ページ
 *
 * 新しいマップを作成するフォーム
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';

type MapCategory = '旅行' | 'グルメ' | '観光' | 'ショッピング' | 'アクティビティ' | 'その他';

const CATEGORIES: MapCategory[] = [
  '旅行',
  'グルメ',
  '観光',
  'ショッピング',
  'アクティビティ',
  'その他',
];

export function CreateMapPage() {
  const router = useRouter();
  const [mapName, setMapName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | null>(null);
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreate = async () => {
    if (!mapName.trim()) {
      // TODO: エラー表示を追加
      alert('マップ名を入力してください');
      return;
    }

    // TODO: マップ作成APIを実装
    console.log({
      mapName,
      description,
      category: selectedCategory,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublic,
    });

    // 作成後、マイページのマップタブへ遷移
    router.push('/(tabs)/mypage');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* マップ名 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            マップ名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={mapName}
            onChangeText={setMapName}
            placeholder="例：東京カフェ巡り"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            説明
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="マップの説明を入力してください"
            multiline
            numberOfLines={4}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* カテゴリー */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            カテゴリー
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            タグ
          </Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="例：カフェ, スイーツ, デート"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-gray-500 mt-1">
            カンマ区切りで入力してください
          </Text>
        </View>

        {/* 公開設定 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons
                name={isPublic ? 'earth' : 'lock-closed'}
                size={20}
                color={isPublic ? '#3B82F6' : '#6B7280'}
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-medium text-gray-800">
                {isPublic ? '公開' : '非公開'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={isPublic ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            公開すると他のユーザーもこのマップを見ることができます
          </Text>
        </View>

        {/* 作成ボタン */}
        <TouchableOpacity
          onPress={handleCreate}
          className="bg-blue-500 py-4 rounded-lg items-center mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            マップを作成
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
