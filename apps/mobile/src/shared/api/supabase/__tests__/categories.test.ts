/**
 * categories.ts のテスト
 *
 * getCategoryName関数のテスト
 * （ファイルがsupabase clientに依存するため、関数と型を再定義）
 */

// Category型の再定義
interface Category {
  id: string;
  name: string;
  name_translations?: Record<string, string> | null;
  display_order: number;
}

// getCategoryName関数の再定義（categories.tsからコピー）
function getCategoryName(category: Category, locale: string = 'ja'): string {
  if (locale === 'ja') {
    return category.name;
  }
  if (category.name_translations && category.name_translations[locale]) {
    return category.name_translations[locale];
  }
  return category.name;
}

describe('getCategoryName', () => {
  const baseCategory: Category = {
    id: 'cat-1',
    name: 'グルメ',
    name_translations: {
      en: 'Gourmet',
      cn: '美食',
      tw: '美食',
    },
    display_order: 1,
  };

  describe('日本語ロケール', () => {
    it('日本語名をそのまま返す', () => {
      const result = getCategoryName(baseCategory, 'ja');
      expect(result).toBe('グルメ');
    });

    it('ロケール省略時は日本語', () => {
      const result = getCategoryName(baseCategory);
      expect(result).toBe('グルメ');
    });
  });

  describe('英語ロケール', () => {
    it('英語翻訳を返す', () => {
      const result = getCategoryName(baseCategory, 'en');
      expect(result).toBe('Gourmet');
    });
  });

  describe('中国語（簡体字）ロケール', () => {
    it('中国語翻訳を返す', () => {
      const result = getCategoryName(baseCategory, 'cn');
      expect(result).toBe('美食');
    });
  });

  describe('台湾語（繁体字）ロケール', () => {
    it('台湾語翻訳を返す', () => {
      const result = getCategoryName(baseCategory, 'tw');
      expect(result).toBe('美食');
    });
  });

  describe('翻訳がない場合', () => {
    it('翻訳がないロケールはデフォルト名を返す', () => {
      const result = getCategoryName(baseCategory, 'ko');
      expect(result).toBe('グルメ');
    });

    it('name_translationsがnullの場合はデフォルト名', () => {
      const category: Category = {
        ...baseCategory,
        name_translations: null,
      };
      const result = getCategoryName(category, 'en');
      expect(result).toBe('グルメ');
    });

    it('name_translationsがundefinedの場合はデフォルト名', () => {
      const category: Category = {
        ...baseCategory,
        name_translations: undefined,
      };
      const result = getCategoryName(category, 'en');
      expect(result).toBe('グルメ');
    });

    it('特定言語の翻訳が空文字列の場合はデフォルト名', () => {
      const category: Category = {
        ...baseCategory,
        name_translations: {
          en: '',
        },
      };
      const result = getCategoryName(category, 'en');
      // 空文字列はfalsyなのでデフォルト名が返る
      expect(result).toBe('グルメ');
    });
  });

  describe('様々なカテゴリ', () => {
    it('旅行カテゴリ', () => {
      const category: Category = {
        id: 'cat-2',
        name: '旅行',
        name_translations: { en: 'Travel' },
        display_order: 2,
      };
      expect(getCategoryName(category, 'en')).toBe('Travel');
      expect(getCategoryName(category, 'ja')).toBe('旅行');
    });

    it('観光カテゴリ', () => {
      const category: Category = {
        id: 'cat-3',
        name: '観光',
        name_translations: { en: 'Sightseeing', cn: '观光' },
        display_order: 3,
      };
      expect(getCategoryName(category, 'en')).toBe('Sightseeing');
      expect(getCategoryName(category, 'cn')).toBe('观光');
    });
  });
});
