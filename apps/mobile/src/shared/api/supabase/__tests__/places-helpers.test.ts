/**
 * places.ts の純粋関数テスト
 *
 * extractPlaceNamesFromAddress関数のロジックテスト
 * （ファイル内でexportされていないため再定義）
 */

// extractPlaceNamesFromAddress関数の再定義（places.tsからコピー）
function extractPlaceNamesFromAddress(
  address: string,
  cityName: string
): string[] {
  if (!address || !cityName) return [];

  // 市区町村名の位置を探す
  const cityIndex = address.indexOf(cityName);
  if (cityIndex === -1) return [];

  // 市区町村名以降の部分を取得
  const afterCity = address.substring(cityIndex + cityName.length);
  if (!afterCity) return [];

  // 数字（番地）の前までを地名とみなす
  // 全角・半角数字の両方に対応
  const placeMatch = afterCity.match(/^([^\d０-９]+)/);
  if (!placeMatch || !placeMatch[1]) return [];

  const placeName = placeMatch[1].trim();
  if (!placeName) return [];

  // 「丁目」「番」「号」などを除去
  const cleaned = placeName
    .replace(/[丁目番号町字大字]/g, '')
    .trim();

  return cleaned ? [cleaned] : [];
}

describe('extractPlaceNamesFromAddress', () => {
  describe('基本的な抽出', () => {
    it('住所から地名を抽出する', () => {
      const result = extractPlaceNamesFromAddress(
        '山口県山口市江崎２７１０',
        '山口市'
      );
      expect(result).toEqual(['江崎']);
    });

    it('東京の住所から地名を抽出する', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区神南1丁目',
        '渋谷区'
      );
      expect(result).toEqual(['神南']);
    });

    it('全角数字の前で区切る', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都新宿区西新宿２−８−１',
        '新宿区'
      );
      expect(result).toEqual(['西新宿']);
    });

    it('半角数字の前で区切る', () => {
      const result = extractPlaceNamesFromAddress(
        '大阪府大阪市北区梅田3-1-1',
        '北区'
      );
      expect(result).toEqual(['梅田']);
    });
  });

  describe('特殊文字の除去', () => {
    it('「丁目」を除去する', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区神南一丁目1番',
        '渋谷区'
      );
      expect(result).toEqual(['神南一']);
    });

    it('「町」を除去する', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都千代田区神田駿河台町1',
        '千代田区'
      );
      expect(result).toEqual(['神田駿河台']);
    });

    it('「字」を除去する', () => {
      const result = extractPlaceNamesFromAddress(
        '青森県青森市大字浅虫字蛍谷1',
        '青森市'
      );
      expect(result).toEqual(['浅虫蛍谷']);
    });

    it('「大字」を除去する', () => {
      const result = extractPlaceNamesFromAddress(
        '埼玉県さいたま市大宮区大字北袋1',
        '大宮区'
      );
      expect(result).toEqual(['北袋']);
    });
  });

  describe('エッジケース', () => {
    it('空の住所は空配列を返す', () => {
      const result = extractPlaceNamesFromAddress('', '渋谷区');
      expect(result).toEqual([]);
    });

    it('空の市区町村名は空配列を返す', () => {
      const result = extractPlaceNamesFromAddress('東京都渋谷区神南1丁目', '');
      expect(result).toEqual([]);
    });

    it('市区町村名が見つからない場合は空配列', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区神南1丁目',
        '新宿区'
      );
      expect(result).toEqual([]);
    });

    it('市区町村名以降がない場合は空配列', () => {
      const result = extractPlaceNamesFromAddress('東京都渋谷区', '渋谷区');
      expect(result).toEqual([]);
    });

    it('数字だけの場合は空配列', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区123',
        '渋谷区'
      );
      expect(result).toEqual([]);
    });

    it('地名がスペースのみの場合は空配列', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区 1丁目',
        '渋谷区'
      );
      expect(result).toEqual([]);
    });
  });

  describe('複雑な住所', () => {
    it('長い地名を抽出する', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都千代田区永田町二丁目3番1号',
        '千代田区'
      );
      expect(result).toEqual(['永田二']);
    });

    it('ハイフン区切りの番地', () => {
      const result = extractPlaceNamesFromAddress(
        '神奈川県横浜市中区山下町1-2',
        '中区'
      );
      expect(result).toEqual(['山下']);
    });

    it('複数の区を持つ住所', () => {
      const result = extractPlaceNamesFromAddress(
        '大阪府大阪市中央区難波5丁目',
        '中央区'
      );
      expect(result).toEqual(['難波']);
    });
  });

  describe('特殊なケース', () => {
    it('市区町村名が住所の先頭にある場合', () => {
      const result = extractPlaceNamesFromAddress(
        '渋谷区神南1丁目',
        '渋谷区'
      );
      expect(result).toEqual(['神南']);
    });

    it('同じ名前が複数回出現する場合は最初にマッチ', () => {
      const result = extractPlaceNamesFromAddress(
        '東京都渋谷区渋谷1丁目',
        '渋谷区'
      );
      expect(result).toEqual(['渋谷']);
    });
  });
});
