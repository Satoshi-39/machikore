/**
 * デモグラフィック設定
 * 性別、年代の選択肢を定義
 *
 * 国・都道府県データは既存のユーティリティを使用:
 * - getCountriesData() from '@/shared/lib/utils/countries.utils'
 * - getPrefecturesByCountry(code) from '@/shared/lib/utils/prefectures.utils'
 */

// 性別
export const GENDERS = ['male', 'female', 'other'] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
};

// 年代
export const AGE_GROUPS = ['10s', '20s', '30s', '40s', '50s', '60s+'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '10s': '10代',
  '20s': '20代',
  '30s': '30代',
  '40s': '40代',
  '50s': '50代',
  '60s+': '60代以上',
};

// デモグラフィック情報の型
export interface DemographicsData {
  gender?: Gender | null;
  age_group?: AgeGroup | null;
  country?: string | null;     // ISO 3166-1 alpha-2 (例: 'jp', 'us')
  prefecture?: string | null;  // 都道府県・州の名前
}
