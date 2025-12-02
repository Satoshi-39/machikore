/**
 * 画像拡大表示モーダル
 *
 * アバター画像などをタップして拡大表示するためのモーダル
 */

import React from 'react';
import { Modal, Pressable, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageViewerModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export function ImageViewerModal({ visible, imageUri, onClose }: ImageViewerModalProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/90 items-center justify-center"
        onPress={onClose}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: screenWidth - 40, height: screenWidth - 40, borderRadius: 20 }}
          resizeMode="cover"
        />
        {/* 閉じるボタン */}
        <Pressable
          onPress={onClose}
          className="absolute top-12 right-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="white" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
