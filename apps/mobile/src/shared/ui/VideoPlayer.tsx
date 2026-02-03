/**
 * 動画プレーヤーコンポーネント
 *
 * ショート動画の再生に使用
 * - 自動再生（ミュート）
 * - タップでミュート切り替え
 * - ループ再生
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadiusNum, iconSizeNum } from '@/shared/config';

interface VideoPlayerProps {
  /** 動画URL */
  uri: string;
  /** 幅 */
  width: number;
  /** 高さ */
  height: number;
  /** ボーダー半径 */
  borderRadius?: number;
  /** 自動再生 */
  autoPlay?: boolean;
  /** ループ再生 */
  loop?: boolean;
  /** 初期ミュート状態 */
  initialMuted?: boolean;
  /** ミュートアイコンを表示するか */
  showMuteIcon?: boolean;
  /** ローディング中のプレースホルダーを表示するか */
  showLoadingPlaceholder?: boolean;
  /** 再生ボタンを表示するか（autoPlay=falseの場合） */
  showPlayButton?: boolean;
  /** スタイル */
  style?: any;
}

export function VideoPlayer({
  uri,
  width,
  height,
  borderRadius = 0,
  autoPlay = true,
  loop = true,
  initialMuted = true,
  showMuteIcon = true,
  showLoadingPlaceholder = true,
  showPlayButton = true,
  style,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoaded(true);
      setIsPlaying(status.isPlaying);
    }
  }, []);

  const handlePress = useCallback(async () => {
    if (!videoRef.current) return;

    if (autoPlay) {
      // 自動再生時はタップでミュート切り替え
      setIsMuted((prev) => !prev);
    } else {
      // 非自動再生時はタップで再生/停止切り替え
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  }, [autoPlay, isPlaying]);

  return (
    <Pressable onPress={handlePress}>
      <View style={[{ width, height, borderRadius, overflow: 'hidden' }, style]}>
        {/* ローディングプレースホルダー */}
        {showLoadingPlaceholder && !isLoaded && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.light['on-surface'],
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Ionicons name="videocam" size={iconSizeNum.xl} color={colors.light['on-surface-variant']} />
          </View>
        )}

        {/* 動画 */}
        <Video
          ref={videoRef}
          source={{ uri }}
          style={{ width, height }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={autoPlay}
          isLooping={loop}
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* ミュートアイコン */}
        {showMuteIcon && autoPlay && isLoaded && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: borderRadiusNum.lg,
              padding: 4,
            }}
          >
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={iconSizeNum.sm}
              color={colors.light.surface}
            />
          </View>
        )}

        {/* 再生ボタン（非自動再生時） */}
        {showPlayButton && !autoPlay && !isPlaying && isLoaded && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
            ]}
          >
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: borderRadiusNum.full,
                padding: 12,
              }}
            >
              <Ionicons name="play" size={iconSizeNum.lg} color={colors.light['on-surface']} />
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}
