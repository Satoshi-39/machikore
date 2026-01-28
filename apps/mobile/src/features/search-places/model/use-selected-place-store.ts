/**
 * 選択された場所データを一時的に保持するstore
 *
 * 検索結果 → スポット作成画面への遷移時にデータを渡すために使用
 * Google Places検索結果 と 手動登録（現在地/ピン刺し）の両方に対応
 * また、検索結果からのマップジャンプにも使用
 */

import { create } from 'zustand';
import type { SpotLocationInput } from './types';
import type { ProseMirrorDoc } from '@/shared/types';
import { deleteDraftImages } from '@/shared/lib/image';
import { log } from '@/shared/config/logger';

/** ドラフト画像の型 */
export interface DraftImage {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

interface SelectedPlaceStore {
  selectedPlace: SpotLocationInput | null;
  setSelectedPlace: (place: SpotLocationInput | null) => void;
  clearSelectedPlace: () => void;
  // スポット作成時の一言（一時保存）
  draftDescription: string;
  setDraftDescription: (description: string) => void;
  clearDraftDescription: () => void;
  // スポット作成時の記事コンテンツ（一時保存）
  draftArticleContent: ProseMirrorDoc | null;
  setDraftArticleContent: (content: ProseMirrorDoc | null) => void;
  clearDraftArticleContent: () => void;
  // スポット作成時の画像（一時保存・ローカル永続化）
  draftImages: DraftImage[];
  setDraftImages: (images: DraftImage[]) => void;
  addDraftImage: (image: DraftImage) => void;
  addDraftImages: (images: DraftImage[]) => void;
  removeDraftImage: (index: number) => Promise<void>;
  clearDraftImages: () => Promise<void>;
  // スポット作成時のサムネイル画像インデックス（draftImagesの中から選択）
  draftThumbnailIndex: number | null;
  setDraftThumbnailIndex: (index: number | null) => void;
  clearDraftThumbnailIndex: () => void;
  // 登録したスポットへのジャンプ用
  jumpToSpotId: string | null;
  setJumpToSpotId: (spotId: string | null) => void;
  // マスタースポットへのジャンプ用（いいね一覧からの遷移時）
  jumpToMasterSpotId: string | null;
  setJumpToMasterSpotId: (masterSpotId: string | null) => void;
  // 街へのジャンプ用（検索結果からの遷移時）
  jumpToMachiId: string | null;
  setJumpToMachiId: (machiId: string | null) => void;
  // 市区へのジャンプ用（検索結果からの遷移時）
  jumpToCityId: string | null;
  setJumpToCityId: (cityId: string | null) => void;
  // 都道府県へのジャンプ用（検索結果からの遷移時）
  jumpToPrefectureId: string | null;
  setJumpToPrefectureId: (prefectureId: string | null) => void;
  // 地方へのジャンプ用（検索結果からの遷移時）
  jumpToRegionId: string | null;
  setJumpToRegionId: (regionId: string | null) => void;
  // 国へのジャンプ用（検索結果からの遷移時）
  jumpToCountryId: string | null;
  setJumpToCountryId: (countryId: string | null) => void;
  // スポット作成関連データをすべてクリア
  clearAllDraftData: () => Promise<void>;
}

export const useSelectedPlaceStore = create<SelectedPlaceStore>((set, get) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  clearSelectedPlace: () => set({ selectedPlace: null }),
  draftDescription: '',
  setDraftDescription: (description) => set({ draftDescription: description }),
  clearDraftDescription: () => set({ draftDescription: '' }),
  draftArticleContent: null,
  setDraftArticleContent: (content) => set({ draftArticleContent: content }),
  clearDraftArticleContent: () => set({ draftArticleContent: null }),
  draftImages: [],
  setDraftImages: (images) => set({ draftImages: images }),
  addDraftImage: (image) => set((state) => ({ draftImages: [...state.draftImages, image] })),
  addDraftImages: (images) => set((state) => ({ draftImages: [...state.draftImages, ...images] })),
  removeDraftImage: async (index) => {
    const { draftImages, draftThumbnailIndex } = get();
    const imageToRemove = draftImages[index];
    if (imageToRemove) {
      // ローカルファイルを削除
      try {
        await deleteDraftImages([imageToRemove.uri]);
      } catch (error) {
        log.warn('[SelectedPlaceStore] ドラフト画像削除エラー:', error);
      }
    }
    // サムネイルインデックスの調整
    let newThumbnailIndex = draftThumbnailIndex;
    if (draftThumbnailIndex !== null) {
      if (draftThumbnailIndex === index) {
        // 削除された画像がサムネイルだった場合はクリア
        newThumbnailIndex = null;
      } else if (draftThumbnailIndex > index) {
        // サムネイルが削除位置より後ろにある場合はインデックスを調整
        newThumbnailIndex = draftThumbnailIndex - 1;
      }
    }
    set((state) => ({
      draftImages: state.draftImages.filter((_, i) => i !== index),
      draftThumbnailIndex: newThumbnailIndex,
    }));
  },
  clearDraftImages: async () => {
    const { draftImages } = get();
    if (draftImages.length > 0) {
      try {
        await deleteDraftImages(draftImages.map((img) => img.uri));
      } catch (error) {
        log.warn('[SelectedPlaceStore] ドラフト画像一括削除エラー:', error);
      }
    }
    set({ draftImages: [], draftThumbnailIndex: null });
  },
  draftThumbnailIndex: null,
  setDraftThumbnailIndex: (index) => set({ draftThumbnailIndex: index }),
  clearDraftThumbnailIndex: () => set({ draftThumbnailIndex: null }),
  jumpToSpotId: null,
  setJumpToSpotId: (spotId) => set({ jumpToSpotId: spotId }),
  jumpToMasterSpotId: null,
  setJumpToMasterSpotId: (masterSpotId) => set({ jumpToMasterSpotId: masterSpotId }),
  jumpToMachiId: null,
  setJumpToMachiId: (machiId) => set({ jumpToMachiId: machiId }),
  jumpToCityId: null,
  setJumpToCityId: (cityId) => set({ jumpToCityId: cityId }),
  jumpToPrefectureId: null,
  setJumpToPrefectureId: (prefectureId) => set({ jumpToPrefectureId: prefectureId }),
  jumpToRegionId: null,
  setJumpToRegionId: (regionId) => set({ jumpToRegionId: regionId }),
  jumpToCountryId: null,
  setJumpToCountryId: (countryId) => set({ jumpToCountryId: countryId }),
  clearAllDraftData: async () => {
    const { clearDraftImages } = get();
    await clearDraftImages();
    set({
      selectedPlace: null,
      draftDescription: '',
      draftArticleContent: null,
      draftThumbnailIndex: null,
    });
  },
}));
