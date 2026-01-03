/**
 * use-edit-map-form-changes.ts の純粋関数テスト
 *
 * hasLabelChanges関数のロジックテスト
 * （ファイル内でexportされていないため再定義）
 */

// LocalMapLabelの型定義（テスト用）
interface LocalMapLabel {
  id: string;
  name: string;
  color: string;
  isNew?: boolean;
  isDeleted?: boolean;
  isModified?: boolean;
}

// hasLabelChanges関数の再定義（use-edit-map-form-changes.tsからコピー）
function hasLabelChanges(current: LocalMapLabel[], initial: LocalMapLabel[]): boolean {
  // 新規追加されたラベルがあるか
  if (current.some((l) => l.isNew)) return true;
  // 削除予定のラベルがあるか
  if (current.some((l) => l.isDeleted)) return true;
  // 変更されたラベルがあるか
  if (current.some((l) => l.isModified)) return true;
  // 数が違う（削除されたラベルがある場合など）
  if (current.filter((l) => !l.isDeleted).length !== initial.length) return true;

  return false;
}

describe('hasLabelChanges', () => {
  const baseLabel: LocalMapLabel = {
    id: 'label-1',
    name: 'ラベル1',
    color: '#FF0000',
  };

  describe('変更なしの場合', () => {
    it('同じラベルの場合はfalse', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel }];
      expect(hasLabelChanges(current, initial)).toBe(false);
    });

    it('空配列同士はfalse', () => {
      expect(hasLabelChanges([], [])).toBe(false);
    });

    it('複数ラベルで変更なしはfalse', () => {
      const initial = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00' },
      ];
      const current = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00' },
      ];
      expect(hasLabelChanges(current, initial)).toBe(false);
    });
  });

  describe('新規追加の検出', () => {
    it('isNewがtrueのラベルがあればtrue', () => {
      const initial = [baseLabel];
      const current = [
        { ...baseLabel },
        { id: 'label-2', name: '新規ラベル', color: '#00FF00', isNew: true },
      ];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('新規ラベルのみの場合もtrue', () => {
      const current = [
        { id: 'label-new', name: '新規', color: '#0000FF', isNew: true },
      ];
      expect(hasLabelChanges(current, [])).toBe(true);
    });
  });

  describe('削除の検出', () => {
    it('isDeletedがtrueのラベルがあればtrue', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, isDeleted: true }];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('一部のラベルが削除予定の場合もtrue', () => {
      const initial = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00' },
      ];
      const current = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00', isDeleted: true },
      ];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });
  });

  describe('変更の検出', () => {
    it('isModifiedがtrueのラベルがあればtrue', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, name: '変更後', isModified: true }];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('色変更でisModifiedがtrueの場合', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, color: '#0000FF', isModified: true }];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });
  });

  describe('数の変更検出', () => {
    it('ラベル数が増えた場合（isNewなし）はtrue', () => {
      const initial = [baseLabel];
      const current = [
        baseLabel,
        { id: '2', name: 'B', color: '#00FF00' }, // isNewなしでも数が増えれば検出
      ];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('ラベル数が減った場合はtrue', () => {
      const initial = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00' },
      ];
      const current = [{ id: '1', name: 'A', color: '#FF0000' }];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('削除済みラベルを除外した数で比較', () => {
      const initial = [{ id: '1', name: 'A', color: '#FF0000' }];
      const current = [
        { id: '1', name: 'A', color: '#FF0000' },
        { id: '2', name: 'B', color: '#00FF00', isDeleted: true },
      ];
      // currentは2件だが、isDeletedを除くと1件 = initialと同数
      // しかしisDeleted: trueがあるので変更ありと判定される
      expect(hasLabelChanges(current, initial)).toBe(true);
    });
  });

  describe('複合的な変更', () => {
    it('追加と削除が同時にある場合', () => {
      const initial = [{ id: '1', name: 'A', color: '#FF0000' }];
      const current = [
        { id: '1', name: 'A', color: '#FF0000', isDeleted: true },
        { id: '2', name: 'B', color: '#00FF00', isNew: true },
      ];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });

    it('変更と追加が同時にある場合', () => {
      const initial = [{ id: '1', name: 'A', color: '#FF0000' }];
      const current = [
        { id: '1', name: 'A変更', color: '#FF0000', isModified: true },
        { id: '2', name: 'B', color: '#00FF00', isNew: true },
      ];
      expect(hasLabelChanges(current, initial)).toBe(true);
    });
  });

  describe('フラグがfalseの場合', () => {
    it('isNew: falseは変更なしと判定', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, isNew: false }];
      expect(hasLabelChanges(current, initial)).toBe(false);
    });

    it('isDeleted: falseは変更なしと判定', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, isDeleted: false }];
      expect(hasLabelChanges(current, initial)).toBe(false);
    });

    it('isModified: falseは変更なしと判定', () => {
      const initial = [baseLabel];
      const current = [{ ...baseLabel, isModified: false }];
      expect(hasLabelChanges(current, initial)).toBe(false);
    });
  });
});
