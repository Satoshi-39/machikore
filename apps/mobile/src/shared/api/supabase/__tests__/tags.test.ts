/**
 * tags.ts のテスト
 *
 * getTagName関数のテスト
 * （ファイルがsupabase clientに依存するため、関数と型を再定義）
 */

// Tag型の再定義
interface Tag {
  id: string;
  name: string;
  name_translations?: Record<string, string> | null;
  category_id: string | null;
  display_order: number;
}

// getTagName関数の再定義（tags.tsからコピー）
function getTagName(tag: Tag, locale: string = 'ja'): string {
  if (locale === 'ja') {
    return tag.name;
  }
  if (tag.name_translations && tag.name_translations[locale]) {
    return tag.name_translations[locale];
  }
  return tag.name;
}

describe('getTagName', () => {
  const baseTag: Tag = {
    id: 'tag-1',
    name: 'カフェ',
    name_translations: {
      en: 'Cafe',
      cn: '咖啡馆',
      tw: '咖啡館',
    },
    category_id: 'cat-1',
    display_order: 1,
  };

  describe('日本語ロケール', () => {
    it('日本語名をそのまま返す', () => {
      const result = getTagName(baseTag, 'ja');
      expect(result).toBe('カフェ');
    });

    it('ロケール省略時は日本語', () => {
      const result = getTagName(baseTag);
      expect(result).toBe('カフェ');
    });
  });

  describe('英語ロケール', () => {
    it('英語翻訳を返す', () => {
      const result = getTagName(baseTag, 'en');
      expect(result).toBe('Cafe');
    });
  });

  describe('中国語（簡体字）ロケール', () => {
    it('中国語翻訳を返す', () => {
      const result = getTagName(baseTag, 'cn');
      expect(result).toBe('咖啡馆');
    });
  });

  describe('台湾語（繁体字）ロケール', () => {
    it('台湾語翻訳を返す', () => {
      const result = getTagName(baseTag, 'tw');
      expect(result).toBe('咖啡館');
    });
  });

  describe('翻訳がない場合', () => {
    it('翻訳がないロケールはデフォルト名を返す', () => {
      const result = getTagName(baseTag, 'ko');
      expect(result).toBe('カフェ');
    });

    it('name_translationsがnullの場合はデフォルト名', () => {
      const tag: Tag = {
        ...baseTag,
        name_translations: null,
      };
      const result = getTagName(tag, 'en');
      expect(result).toBe('カフェ');
    });

    it('name_translationsがundefinedの場合はデフォルト名', () => {
      const tag: Tag = {
        ...baseTag,
        name_translations: undefined,
      };
      const result = getTagName(tag, 'en');
      expect(result).toBe('カフェ');
    });

    it('特定言語の翻訳が空文字列の場合はデフォルト名', () => {
      const tag: Tag = {
        ...baseTag,
        name_translations: {
          en: '',
        },
      };
      const result = getTagName(tag, 'en');
      // 空文字列はfalsyなのでデフォルト名が返る
      expect(result).toBe('カフェ');
    });
  });

  describe('様々なタグ', () => {
    it('ラーメンタグ', () => {
      const tag: Tag = {
        id: 'tag-2',
        name: 'ラーメン',
        name_translations: { en: 'Ramen', cn: '拉面' },
        category_id: 'cat-1',
        display_order: 2,
      };
      expect(getTagName(tag, 'en')).toBe('Ramen');
      expect(getTagName(tag, 'cn')).toBe('拉面');
      expect(getTagName(tag, 'ja')).toBe('ラーメン');
    });

    it('寿司タグ', () => {
      const tag: Tag = {
        id: 'tag-3',
        name: '寿司',
        name_translations: { en: 'Sushi' },
        category_id: 'cat-1',
        display_order: 3,
      };
      expect(getTagName(tag, 'en')).toBe('Sushi');
      expect(getTagName(tag, 'tw')).toBe('寿司'); // 翻訳がないのでデフォルト
    });

    it('翻訳なしタグ', () => {
      const tag: Tag = {
        id: 'tag-4',
        name: '居酒屋',
        name_translations: null,
        category_id: 'cat-1',
        display_order: 4,
      };
      expect(getTagName(tag, 'en')).toBe('居酒屋');
      expect(getTagName(tag, 'cn')).toBe('居酒屋');
      expect(getTagName(tag, 'ja')).toBe('居酒屋');
    });
  });

  describe('エッジケース', () => {
    it('category_idがnullでも動作', () => {
      const tag: Tag = {
        id: 'tag-5',
        name: 'テスト',
        name_translations: { en: 'Test' },
        category_id: null,
        display_order: 5,
      };
      expect(getTagName(tag, 'en')).toBe('Test');
    });
  });
});
