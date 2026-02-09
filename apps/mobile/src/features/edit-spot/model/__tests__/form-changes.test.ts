/**
 * use-edit-spot-form-changes.ts の変更検出ロジックテスト
 *
 * hookのuseMemo内ロジックを純粋関数として再定義しテスト
 * 特にバグが潜みやすい箇所:
 * - spotColor のデフォルト値フォールバック
 * - spotName の条件付き比較（手動登録スポットのみ）
 * - isPublic のフォールバックロジック
 * - thumbnailCrop の座標比較とnullハンドリング
 */

// ---- テスト対象ロジックの再定義 ----

type SpotColor = 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray' | 'white';
const DEFAULT_SPOT_COLOR: SpotColor = 'blue';

interface ThumbnailCrop {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
}

interface SpotData {
  description: string | null;
  map_id: string;
  spot_color: string | null;
  label_id?: string | null;
  master_spot_id: string | null;
  name?: string | null;
  is_public?: boolean;
  thumbnail_image_id?: string | null;
  thumbnail_crop?: ThumbnailCrop | null;
}

interface FormValues {
  description: string;
  tags: string[];
  newImages: unknown[];
  deletedImageIds: string[];
  selectedMapId: string | null;
  spotColor: SpotColor;
  labelId: string | null;
  spotName?: string;
  isPublic: boolean;
  thumbnailImageId: string | null;
  thumbnailCrop: ThumbnailCrop | null;
}

function hasSpotChanges(spot: SpotData, initialTags: string[], currentValues: FormValues): boolean {
  const originalDescription = spot.description ?? '';
  if (currentValues.description.trim() !== originalDescription) return true;

  if (currentValues.tags.length !== initialTags.length) return true;
  if (currentValues.tags.some((tag, index) => tag !== initialTags[index])) return true;

  if (currentValues.newImages.length > 0) return true;
  if (currentValues.deletedImageIds.length > 0) return true;
  if (currentValues.selectedMapId !== spot.map_id) return true;

  const originalSpotColor = (spot.spot_color as SpotColor) || DEFAULT_SPOT_COLOR;
  if (currentValues.spotColor !== originalSpotColor) return true;

  if (currentValues.labelId !== spot.label_id) return true;

  if (currentValues.spotName !== undefined) {
    const isManualRegistration = !spot.master_spot_id;
    if (isManualRegistration) {
      const originalSpotName = spot.name || '';
      if (currentValues.spotName.trim() !== originalSpotName) return true;
    }
  }

  const originalIsPublic = 'is_public' in spot ? (spot.is_public ?? true) : true;
  if (currentValues.isPublic !== originalIsPublic) return true;

  const originalThumbnailId = spot.thumbnail_image_id ?? null;
  if (currentValues.thumbnailImageId !== originalThumbnailId) return true;

  if (currentValues.thumbnailCrop !== null) {
    const originalCrop = spot.thumbnail_crop;
    if (!originalCrop) return true;
    if (
      currentValues.thumbnailCrop.originX !== originalCrop.originX ||
      currentValues.thumbnailCrop.originY !== originalCrop.originY ||
      currentValues.thumbnailCrop.width !== originalCrop.width ||
      currentValues.thumbnailCrop.height !== originalCrop.height
    ) return true;
  }

  return false;
}

// ---- テスト ----

const baseSpot: SpotData = {
  description: 'おいしいラーメン屋',
  map_id: 'map-1',
  spot_color: 'red',
  label_id: null,
  master_spot_id: 'master-1',
  name: null,
  is_public: true,
  thumbnail_image_id: null,
  thumbnail_crop: null,
};

const baseForm: FormValues = {
  description: 'おいしいラーメン屋',
  tags: ['ラーメン', '新宿'],
  newImages: [],
  deletedImageIds: [],
  selectedMapId: 'map-1',
  spotColor: 'red',
  labelId: null,
  isPublic: true,
  thumbnailImageId: null,
  thumbnailCrop: null,
};

const baseTags = ['ラーメン', '新宿'];

describe('hasSpotChanges', () => {
  it('変更なしの場合はfalse', () => {
    expect(hasSpotChanges(baseSpot, baseTags, baseForm)).toBe(false);
  });

  describe('description', () => {
    it('説明文が変更されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, description: '更新後の説明' })).toBe(true);
    });

    it('末尾空白はtrimで除去されるため変更なし', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, description: 'おいしいラーメン屋  ' })).toBe(false);
    });

    it('元がnullの場合、空文字なら変更なし', () => {
      const spot = { ...baseSpot, description: null };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, description: '' })).toBe(false);
    });

    it('元がnullの場合、文字があれば変更あり', () => {
      const spot = { ...baseSpot, description: null };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, description: 'new' })).toBe(true);
    });
  });

  describe('tags', () => {
    it('タグが追加されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, tags: ['ラーメン', '新宿', '渋谷'] })).toBe(true);
    });

    it('タグが削除されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, tags: ['ラーメン'] })).toBe(true);
    });

    it('タグの順序が変わるとtrue（順序依存）', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, tags: ['新宿', 'ラーメン'] })).toBe(true);
    });
  });

  describe('images', () => {
    it('新しい画像が追加されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, newImages: [{ uri: 'photo.jpg' }] })).toBe(true);
    });

    it('画像が削除されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, deletedImageIds: ['img-1'] })).toBe(true);
    });
  });

  describe('spotColor', () => {
    it('色が変更されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, spotColor: 'green' })).toBe(true);
    });

    it('spot_colorがnullの場合、DEFAULT_SPOT_COLOR (blue) と比較される', () => {
      const spot = { ...baseSpot, spot_color: null };
      // フォーム値がblue（デフォルト）なら変更なし
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, spotColor: 'blue' })).toBe(false);
      // フォーム値がredなら変更あり
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, spotColor: 'red' })).toBe(true);
    });
  });

  describe('spotName（手動登録スポット）', () => {
    it('master_spot_idがある場合、spotNameの変更は無視される', () => {
      // master_spot_idがある = マスタースポット紐づき = spotName比較は行わない
      const spot = { ...baseSpot, master_spot_id: 'master-1', name: 'マスター名' };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, spotName: '全く違う名前' })).toBe(false);
    });

    it('手動登録(master_spot_id=null)の場合、名前変更でtrue', () => {
      const spot = { ...baseSpot, master_spot_id: null, name: '元の名前' };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, spotName: '新しい名前' })).toBe(true);
    });

    it('手動登録で名前が同じならfalse', () => {
      const spot = { ...baseSpot, master_spot_id: null, name: 'カフェ' };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, spotName: 'カフェ' })).toBe(false);
    });

    it('spotNameがundefined（フォームに名前フィールドがない）場合は比較しない', () => {
      const spot = { ...baseSpot, master_spot_id: null, name: '名前あり' };
      const form = { ...baseForm };
      delete form.spotName;
      expect(hasSpotChanges(spot, baseTags, form)).toBe(false);
    });
  });

  describe('isPublic', () => {
    it('公開→非公開でtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, isPublic: false })).toBe(true);
    });

    it('is_publicがundefinedの場合、trueとして扱われる', () => {
      const spot = { ...baseSpot };
      delete (spot as Record<string, unknown>).is_public;
      // フォーム値がtrue（デフォルト）なら変更なし
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, isPublic: true })).toBe(false);
    });
  });

  describe('thumbnailCrop', () => {
    const crop: ThumbnailCrop = {
      originX: 10, originY: 20, width: 100, height: 100, imageWidth: 500, imageHeight: 500,
    };

    it('新しくクロップが追加された場合true', () => {
      // 元がnull、新しいクロップ値あり
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, thumbnailCrop: crop })).toBe(true);
    });

    it('クロップ座標が変更された場合true', () => {
      const spot = { ...baseSpot, thumbnail_crop: crop };
      const newCrop = { ...crop, originX: 50 };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, thumbnailCrop: newCrop })).toBe(true);
    });

    it('クロップ座標が同じならfalse', () => {
      const spot = { ...baseSpot, thumbnail_crop: crop };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, thumbnailCrop: { ...crop } })).toBe(false);
    });

    it('thumbnailCropがnull（ユーザーが操作していない）なら比較しない', () => {
      const spot = { ...baseSpot, thumbnail_crop: crop };
      expect(hasSpotChanges(spot, baseTags, { ...baseForm, thumbnailCrop: null })).toBe(false);
    });
  });

  describe('map / label', () => {
    it('マップが変更されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, selectedMapId: 'map-2' })).toBe(true);
    });

    it('ラベルが変更されるとtrue', () => {
      expect(hasSpotChanges(baseSpot, baseTags, { ...baseForm, labelId: 'label-1' })).toBe(true);
    });
  });
});
