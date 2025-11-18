/**
 * カスタムマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useSpots } from '@/entities/spot';
import { SpotDetailCard } from '@/widgets/spot-detail-card';
import type { SpotRow } from '@/shared/types/database.types';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number) => void;
}

interface CustomMapViewProps {
  mapId: string | null;
  isPinMode?: boolean;
  onMapPress?: ((latitude: number, longitude: number) => void) | null;
  onCancelPinMode?: (() => void) | null;
  onSpotSelect?: (spot: SpotRow | null) => void;
}

export const CustomMapView = forwardRef<MapViewHandle, CustomMapViewProps>(
  ({ mapId, isPinMode = false, onMapPress = null, onCancelPinMode = null, onSpotSelect }, ref) => {
    const cameraRef = useRef<Mapbox.Camera>(null);
    const { data: spots = [] } = useSpots(mapId ?? '');
    const [selectedSpot, setSelectedSpot] = useState<SpotRow | null>(null);

    // マップの中心座標を保持
    const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number }>({
      latitude: 35.6812,
      longitude: 139.7671,
    });

    // 選択状態を親に通知
    const handleSpotSelect = (spot: SpotRow | null) => {
      setSelectedSpot(spot);
      onSpotSelect?.(spot);
    };

    // スポットが読み込まれたら全スポットを表示
    useEffect(() => {
      if (spots.length > 0 && cameraRef.current) {
        // 全スポットの座標から境界を計算
        const lngs = spots.map(s => s.longitude);
        const lats = spots.map(s => s.latitude);

        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);

        // 少し遅延させてカメラが準備されるのを待つ
        setTimeout(() => {
          if (cameraRef.current) {
            cameraRef.current.fitBounds(
              [minLng, minLat], // 南西の座標
              [maxLng, maxLat], // 北東の座標
              [50, 50, 50, 50], // パディング [上, 右, 下, 左]
              1000 // アニメーション時間
            );
          }
        }, 100);
      }
    }, [spots, mapId]);

    // カメラ変更時に中心座標を更新
    const handleCameraChanged = async (state: any) => {
      if (state?.properties?.center) {
        const [longitude, latitude] = state.properties.center;
        setCenterCoords({ latitude, longitude });
      }
    };

    // 確定ボタンタップ（中央の座標を登録）
    const handleConfirmPress = () => {
      if (isPinMode && onMapPress) {
        console.log('📍 中央座標で確定:', centerCoords);
        onMapPress(centerCoords.latitude, centerCoords.longitude);
      }
    };

    // キャンセルボタンタップ
    const handleCancelPress = () => {
      if (onCancelPinMode) {
        console.log('❌ ピンモードキャンセル');
        onCancelPinMode();
      }
    };

  // 外部から呼び出せるメソッドを公開
  useImperativeHandle(ref, () => ({
    flyToLocation: (longitude: number, latitude: number) => {
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
    },
  }));

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Street}
        onCameraChanged={handleCameraChanged}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[139.7671, 35.6812]} // 東京
          animationDuration={0}
        />

        {/* スポットマーカー表示 */}
        {spots.map((spot) => (
          <Mapbox.PointAnnotation
            key={spot.id}
            id={spot.id}
            coordinate={[spot.longitude, spot.latitude]}
            onSelected={() => {
              console.log('📍 スポット選択:', spot.name);
              handleSpotSelect(spot);
            }}
          >
            <Ionicons name="location" size={40} color="#EF4444" />
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      {/* ピンモード時のオーバーレイ */}
      {isPinMode && (
        <View className="absolute inset-0 items-center justify-center">
          {/* 中央の十字線（タップを透過） */}
          <View className="items-center pointer-events-none">
            <Ionicons name="add" size={48} color="#3B82F6" />
          </View>

          {/* ボタンバー（画面下部） */}
          <View className="absolute bottom-32 left-0 right-0 items-center pointer-events-box-none">
            <View className="bg-white rounded-full shadow-lg px-4 py-3 flex-row items-center">
              {/* 確定ボタン */}
              <Pressable
                onPress={handleConfirmPress}
                className="flex-row items-center active:opacity-70"
              >
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
                <Text className="text-blue-500 font-bold text-base ml-2">
                  この位置で確定
                </Text>
              </Pressable>

              {/* 区切り線 */}
              <View className="w-px h-5 bg-gray-200 mx-3" />

              {/* 閉じるアイコン */}
              <Pressable
                onPress={handleCancelPress}
                className="active:opacity-50"
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 選択されたスポットの詳細カード */}
      {selectedSpot && (
        <SpotDetailCard
          spot={selectedSpot}
          onClose={() => handleSpotSelect(null)}
        />
      )}
    </View>
  );
});
