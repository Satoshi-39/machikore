/**
 * スポット編集用Zustandストア
 *
 * スポット編集時の一時的な変更を保持
 * - 一言編集ページからの変更をストアに保存
 * - スポット編集ページの「変更を保存」でサーバーに送信
 *
 * ※記事・サムネイルは記事編集ページで即座にサーバー保存されるため、ここでは管理しない
 */

import { create } from 'zustand';

interface EditSpotState {
  /** 編集中のスポットID */
  spotId: string | null;

  /** 初期値（サーバーから取得した値、変更検知用） */
  initialDescription: string | null;

  /** 編集中の値 */
  draftDescription: string | null;

  /** 変更フラグ */
  isDescriptionChanged: boolean;
}

interface EditSpotActions {
  /** 編集を開始（サーバーから取得した初期値をセット） */
  initializeEdit: (params: {
    spotId: string;
    description: string;
  }) => void;

  /** 一言を更新 */
  setDraftDescription: (description: string) => void;

  /** ストアをクリア（編集完了時） */
  clearEdit: () => void;

  /** 変更された値のみを取得（サーバー送信用） */
  getChangedValues: () => {
    description?: string;
  };
}

const initialState: EditSpotState = {
  spotId: null,
  initialDescription: null,
  draftDescription: null,
  isDescriptionChanged: false,
};

export const useEditSpotStore = create<EditSpotState & EditSpotActions>((set, get) => ({
  ...initialState,

  initializeEdit: ({ spotId, description }) => {
    set({
      spotId,
      initialDescription: description,
      draftDescription: description,
      isDescriptionChanged: false,
    });
  },

  setDraftDescription: (description) => {
    const { initialDescription } = get();
    set({
      draftDescription: description,
      isDescriptionChanged: description !== initialDescription,
    });
  },

  clearEdit: () => {
    set(initialState);
  },

  getChangedValues: () => {
    const { isDescriptionChanged, draftDescription } = get();

    const changedValues: {
      description?: string;
    } = {};

    if (isDescriptionChanged && draftDescription !== null) {
      changedValues.description = draftDescription;
    }

    return changedValues;
  },
}));
